from flask import Flask, request, jsonify, render_template, session, redirect, url_for, flash, Response
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import re
import json
import csv
from io import StringIO
from dotenv import load_dotenv
from functools import wraps
import cloudinary
import cloudinary.uploader
import requests
import time

# ✅ Environment Variables Load करें
load_dotenv()

# ✅ Cloudinary Configuration – Unsigned Mode
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME')
)

app = Flask(__name__)

# ✅ Database Configuration
database_url = os.getenv('DATABASE_URL')
if database_url and database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url or 'sqlite:///blog.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'my-super-secret-key-12345')

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# ✅ CORS
cors_origins = os.getenv('CORS_ORIGINS', '*')
if cors_origins != '*':
    cors_origins = cors_origins.split(',')
CORS(app, origins=cors_origins)

# ✅ Upload Folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static/uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# ---------- डेटाबेस मॉडल ----------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)

# ✅ Many-to-Many Association Table (Post ↔ Category)
post_category = db.Table('post_category',
    db.Column('post_id', db.Integer, db.ForeignKey('post.id'), primary_key=True),
    db.Column('category_id', db.Integer, db.ForeignKey('category.id'), primary_key=True)
)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(200), unique=True, nullable=False)
    content = db.Column(db.Text, nullable=False)
    meta_title = db.Column(db.String(200))
    meta_description = db.Column(db.String(300))
    featured_image = db.Column(db.String(300))
    status = db.Column(db.String(20), default='draft')
    views = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    # ✅ REMOVED: category_id and category relationship
    # ✅ NEW: Many-to-Many relationship
    categories = db.relationship('Category', secondary=post_category, backref=db.backref('posts', lazy='dynamic'))

class Setting(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), unique=True, nullable=False)
    value = db.Column(db.Text, nullable=True)
    description = db.Column(db.String(200))

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    post = db.relationship('Post', backref=db.backref('comments', lazy='dynamic', cascade='all, delete-orphan'))
    author_name = db.Column(db.String(100), nullable=False)
    author_email = db.Column(db.String(100), nullable=True)
    content = db.Column(db.Text, nullable=False)
    is_approved = db.Column(db.Boolean, default=False)
    reply = db.Column(db.Text, nullable=True)
    edit_token = db.Column(db.String(100), unique=True, nullable=True)  # ✅ नया
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ---------- Helper Functions ----------
def generate_unique_slug(title):
    slug = title.lower().strip()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    if not slug:
        slug = 'post'
    original_slug = slug
    count = 1
    while Post.query.filter_by(slug=slug).first():
        slug = f"{original_slug}-{count}"
        count += 1
    return slug


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)
    return decorated_function


@app.route('/api/posts', methods=['GET'])
def get_posts():
    category_slug = request.args.get('category')
    query = Post.query.filter_by(status='published')
    
    if category_slug:
        category = Category.query.filter_by(slug=category_slug).first()
        if category:
            # ✅ Filter by many-to-many categories
            query = query.filter(Post.categories.contains(category))
        else:
            # ✅ अगर Category नहीं मिली, तो कोई Post न लौटाएँ
            return jsonify([])
    
    posts = query.order_by(Post.created_at.desc()).all()
    return jsonify([{
        'id': p.id,
        'title': p.title,
        'slug': p.slug,
        'content': p.content[:150] + '...' if len(p.content) > 150 else p.content,
        'meta_title': p.meta_title,
        'meta_description': p.meta_description,
        'featured_image': p.featured_image,
        'categories': [cat.name for cat in p.categories],  # ✅ Array of category names
        'created_at': p.created_at.strftime('%d %b, %Y')
    } for p in posts])


@app.route('/api/posts/<slug>', methods=['GET'])
def get_post(slug):
    post = Post.query.filter_by(slug=slug, status='published').first()
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    return jsonify({
        'id': post.id,
        'title': post.title,
        'slug': post.slug,  # ✅ यह Line जोड़ें
        'content': post.content,
        'meta_title': post.meta_title,
        'meta_description': post.meta_description,
        'featured_image': post.featured_image,
        'categories': [cat.name for cat in post.categories],
        'created_at': post.created_at.strftime('%d %b, %Y')
    })


@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'slug': c.slug
    } for c in categories])

# ✅ ADMIN CATEGORY ROUTES (ALREADY PRESENT, KEEP THEM)
@app.route('/admin/categories')
@login_required
def admin_categories():
    categories = Category.query.all()
    return render_template('admin/categories.html', categories=categories)

@app.route('/admin/category/new', methods=['GET', 'POST'])
@login_required
def admin_new_category():
    if request.method == 'POST':
        name = request.form['name']
        slug = request.form['slug'] or name.lower().replace(' ', '-')
        if Category.query.filter_by(slug=slug).first():
            flash('यह Slug पहले से मौजूद है!', 'danger')
            return render_template('admin/category_form.html')
        category = Category(name=name, slug=slug)
        db.session.add(category)
        db.session.commit()
        flash('✅ कैटेगरी बन गई!', 'success')
        return redirect(url_for('admin_categories'))
    return render_template('admin/category_form.html', category=None)

@app.route('/admin/category/<int:id>/delete')
@login_required
def admin_delete_category(id):
    category = Category.query.get_or_404(id)
    # ✅ Check if any post has this category
    if category.posts.count() > 0:
        flash('❌ इस कैटेगरी में पोस्ट्स हैं, पहले उन्हें हटाएं या बदलें!', 'danger')
        return redirect(url_for('admin_categories'))
    db.session.delete(category)
    db.session.commit()
    flash('🗑️ कैटेगरी डिलीट हो गई!', 'success')
    return redirect(url_for('admin_categories'))

@app.route('/api/settings', methods=['GET'])
def get_settings():
    settings = Setting.query.all()
    return jsonify({s.key: s.value for s in settings})


# ---------- Comments API ----------
@app.route('/api/posts/<slug>/comments', methods=['GET'])
def get_comments(slug):
    post = Post.query.filter_by(slug=slug).first()
    if not post:
        return jsonify({'error': 'Post not found'}), 404

    # Approved Comments
    approved = Comment.query.filter_by(post_id=post.id, is_approved=True).order_by(Comment.created_at.asc()).all()

    # Pending Comments – सिर्फ Token Match होने पर
    tokens = request.args.get('tokens', '')
    token_list = [t.strip() for t in tokens.split(',') if t.strip()]
    pending = []
    if token_list:
        pending = Comment.query.filter(
            Comment.post_id == post.id,
            Comment.is_approved == False,
            Comment.edit_token.in_(token_list)
        ).order_by(Comment.created_at.asc()).all()

    # Merge – Pending पहले, Approved बाद में
    all_comments = pending + approved

    return jsonify([{
        'id': c.id,
        'author_name': c.author_name,
        'content': c.content,
        'reply': c.reply,
        'is_approved': c.is_approved,
        'edit_token': c.edit_token if c.edit_token in token_list else None,
        'created_at': c.created_at.strftime('%d %b, %Y')
    } for c in all_comments])
    
    

@app.route('/api/comments/<int:id>', methods=['PUT'])
def edit_comment(id):
    data = request.get_json()
    edit_token = data.get('edit_token')
    new_content = data.get('content', '').strip()

    if not edit_token or not new_content:
        return jsonify({'error': 'Token and content required'}), 400

    comment = Comment.query.get(id)
    if not comment:
        return jsonify({'error': 'Comment not found'}), 404

    if comment.is_approved:
        return jsonify({'error': 'Cannot edit approved comment'}), 403

    if comment.edit_token != edit_token:
        return jsonify({'error': 'Invalid token'}), 403

    comment.content = new_content
    db.session.commit()

    return jsonify({
        'message': 'Comment updated',
        'comment': {'id': comment.id, 'content': comment.content}
    }), 200
    
    
@app.route('/api/posts/<slug>/comments', methods=['POST'])
def add_comment(slug):
    post = Post.query.filter_by(slug=slug).first()
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    data = request.get_json()
    author_name = data.get('author_name', '').strip()
    author_email = data.get('author_email', '').strip()
    content = data.get('content', '').strip()
    if not author_name or not content:
        return jsonify({'error': 'Name and Comment are required'}), 400
    comment = Comment(
        post_id=post.id,
        author_name=author_name,
        author_email=author_email,
        content=content,
        is_approved=False
    )
    db.session.add(comment)
    db.session.commit()
    return jsonify({'message': 'Comment added! It will appear after approval.'}), 201

import uuid

import uuid

@app.route('/api/comments', methods=['POST'])
def add_comment_by_id():
    try:
        data = request.get_json()
        post_id = data.get('post_id')
        if not post_id:
            return jsonify({'error': 'Post ID required'}), 400
        post_id = int(post_id)

        author_name = data.get('author_name', '').strip()
        author_email = data.get('author_email', '').strip()
        content = data.get('content', '').strip()

        if not author_name or not content:
            return jsonify({'error': 'Name and comment required'}), 400

        post = Post.query.get(post_id)
        if not post:
            return jsonify({'error': 'Post not found'}), 404

        edit_token = str(uuid.uuid4())

        comment = Comment(
            post_id=post.id,
            author_name=author_name,
            author_email=author_email,
            content=content,
            is_approved=False,
            edit_token=edit_token
        )
        db.session.add(comment)
        db.session.commit()

        return jsonify({
            'message': 'Comment added!',
            'comment': {
                'id': comment.id,
                'edit_token': edit_token
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ---------- Admin Panel Routes ----------
@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            return redirect(url_for('admin_dashboard'))
        flash('❌ गलत यूजरनेम या पासवर्ड!', 'danger')
        return render_template('admin/login.html')
    return render_template('admin/login.html')


@app.route('/admin/logout')
def admin_logout():
    session.pop('user_id', None)
    return redirect(url_for('admin_login'))


@app.route('/admin')
@login_required
def admin_dashboard():
    # ✅ 1. Posts – हमेशा काम करेगा
    posts = Post.query.order_by(Post.created_at.desc()).all()
    
    # ✅ 2. Comments – अगर Column missing है तो भी Dashboard Crash नहीं होगा
    comments = []
    pending_comments_count = 0
    try:
        comments = Comment.query.order_by(Comment.created_at.desc()).all()
        pending_comments_count = Comment.query.filter_by(is_approved=False).count()
    except Exception as e:
        print(f"⚠️ Comment query error (migration pending?): {e}")
        # अगर Column missing है, तो बस Empty List भेज दो, Dashboard चलता रहेगा
        comments = []
        pending_comments_count = 0
    
    # ✅ 3. Stats
    total_posts = Post.query.count()
    draft_posts = Post.query.filter_by(status='draft').count()
    published_posts = Post.query.filter_by(status='published').count()
    total_categories = Category.query.count()
    total_views = db.session.query(db.func.sum(Post.views)).scalar() or 0
    
    return render_template('admin/index.html',
                           posts=posts,
                           comments=comments,
                           pending_comments_count=pending_comments_count,
                           total_posts=total_posts,
                           draft_posts=draft_posts,
                           published_posts=published_posts,
                           total_categories=total_categories,
                           total_views=total_views)


@app.route('/admin/post/new', methods=['GET', 'POST'])
@login_required
def admin_new_post():
    categories = Category.query.all()
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        meta_title = request.form.get('meta_title', '')
        meta_description = request.form.get('meta_description', '')
        featured_image = request.form.get('featured_image', '')
        slug = request.form.get('slug', '').strip()
        # ✅ Get multiple categories from form
        category_ids = request.form.getlist('categories')  # list of strings
        
        if not slug:
            slug = generate_unique_slug(title)
        else:
            if Post.query.filter_by(slug=slug).first():
                flash('❌ यह Slug (URL) पहले से मौजूद है, कृपया कोई दूसरा डालें।', 'danger')
                return render_template('admin/post_form.html', categories=categories, post=None)
        try:
            post = Post(
                title=title,
                slug=slug,
                content=content,
                meta_title=meta_title,
                meta_description=meta_description,
                featured_image=featured_image,
                status='draft'  # default
            )
            # ✅ Add selected categories
            if category_ids:
                selected_categories = Category.query.filter(Category.id.in_(category_ids)).all()
                post.categories = selected_categories
            
            db.session.add(post)
            db.session.commit()
            flash('✅ पोस्ट सफलतापूर्वक सेव हो गई!', 'success')
            return redirect(url_for('admin_dashboard'))
        except Exception as e:
            db.session.rollback()
            flash(f'❌ डेटाबेस में सेव करते समय एरर: {str(e)}', 'danger')
            return render_template('admin/post_form.html', categories=categories, post=None)
    return render_template('admin/post_form.html', categories=categories, post=None)


@app.route('/admin/post/<int:id>/edit', methods=['GET', 'POST'])
@login_required
def admin_edit_post(id):
    post = Post.query.get_or_404(id)
    categories = Category.query.all()
    if request.method == 'POST':
        title = request.form['title']
        slug = request.form.get('slug', '').strip()
        content = request.form['content']
        meta_title = request.form.get('meta_title', '')
        meta_description = request.form.get('meta_description', '')
        featured_image = request.form.get('featured_image', '')
        category_ids = request.form.getlist('categories')  # ✅ list of category ids
        
        if not slug:
            slug = generate_unique_slug(title)
        else:
            existing = Post.query.filter_by(slug=slug).first()
            if existing and existing.id != id:
                flash('❌ यह Slug (URL) किसी दूसरी पोस्ट में पहले से मौजूद है!', 'danger')
                return render_template('admin/post_form.html', categories=categories, post=post)
        
        post.title = title
        post.slug = slug
        post.content = content
        post.meta_title = meta_title
        post.meta_description = meta_description
        post.featured_image = featured_image
        
        # ✅ Update many-to-many categories
        post.categories.clear()  # Remove all existing
        if category_ids:
            selected_categories = Category.query.filter(Category.id.in_(category_ids)).all()
            post.categories = selected_categories
        
        try:
            db.session.commit()
            flash('✅ पोस्ट अपडेट हो गई!', 'success')
            return redirect(url_for('admin_dashboard'))
        except Exception as e:
            db.session.rollback()
            flash(f'❌ अपडेट करते समय एरर: {str(e)}', 'danger')
    return render_template('admin/post_form.html', categories=categories, post=post)


@app.route('/admin/post/<int:id>/delete')
@login_required
def admin_delete_post(id):
    post = Post.query.get_or_404(id)
    db.session.delete(post)
    db.session.commit()
    flash('🗑️ पोस्ट डिलीट हो गई!', 'success')
    return redirect(url_for('admin_dashboard'))


@app.route('/admin/post/<int:id>/toggle-status', methods=['POST'])
@login_required
def admin_toggle_status(id):
    post = Post.query.get_or_404(id)
    data = request.get_json()
    new_status = data.get('status')
    if new_status in ['draft', 'published']:
        post.status = new_status
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'error': 'Invalid status'}), 400


@app.route('/admin/bulk-action', methods=['POST'])
@login_required
def admin_bulk_action():
    action = request.form.get('action')
    post_ids = request.form.getlist('post_ids')
    if not post_ids:
        flash('❌ कोई पोस्ट सिलेक्ट नहीं की गई!', 'danger')
        return redirect(url_for('admin_dashboard'))
    if action == 'delete':
        Post.query.filter(Post.id.in_(post_ids)).delete(synchronize_session=False)
        db.session.commit()
        flash(f'🗑️ {len(post_ids)} पोस्ट्स डिलीट हो गईं!', 'success')
    elif action == 'publish':
        Post.query.filter(Post.id.in_(post_ids)).update({Post.status: 'published'}, synchronize_session=False)
        db.session.commit()
        flash(f'✅ {len(post_ids)} पोस्ट्स पब्लिश हो गईं!', 'success')
    elif action == 'draft':
        Post.query.filter(Post.id.in_(post_ids)).update({Post.status: 'draft'}, synchronize_session=False)
        db.session.commit()
        flash(f'📝 {len(post_ids)} पोस्ट्स ड्राफ्ट में चली गईं!', 'success')
    else:
        flash('⚠️ कोई एक्शन सिलेक्ट करें!', 'warning')
    return redirect(url_for('admin_dashboard'))


@app.route('/admin/settings', methods=['GET', 'POST'])
@login_required
def admin_settings():
    if request.method == 'POST':
        for key, value in request.form.items():
            if key == 'csrf_token':
                continue
            setting = Setting.query.filter_by(key=key).first()
            if setting:
                setting.value = value
            else:
                setting = Setting(key=key, value=value)
                db.session.add(setting)
        db.session.commit()
        flash('✅ सेटिंग्स सफलतापूर्वक सेव हो गईं!', 'success')
        return redirect(url_for('admin_settings'))
    settings = Setting.query.all()
    settings_dict = {s.key: s.value for s in settings}
    return render_template('admin/settings.html', settings=settings_dict)


@app.route('/admin/upload', methods=['POST'])
@login_required
def admin_upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        try:
            cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
            upload_url = f'https://api.cloudinary.com/v1_1/{cloud_name}/upload'
            files = {'file': (file.filename, file.stream, file.content_type)}
            data = {'upload_preset': 'blog_unsigned'}
            response = requests.post(upload_url, files=files, data=data)
            response_data = response.json()
            if response.status_code == 200:
                return jsonify({'location': response_data['secure_url']}), 200
            else:
                return jsonify({'error': response_data.get('error', {}).get('message', 'Upload failed')}), 500
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    return jsonify({'error': 'Invalid file type'}), 400


@app.route('/admin/export', methods=['GET'])
@login_required
def admin_export():
    format_type = request.args.get('format', 'json')
    posts = Post.query.order_by(Post.created_at.desc()).all()
    data = [{
        'id': p.id,
        'title': p.title,
        'slug': p.slug,
        'content': p.content,
        'meta_title': p.meta_title,
        'meta_description': p.meta_description,
        'featured_image': p.featured_image,
        'status': p.status,
        'views': p.views,
        'categories': [cat.name for cat in p.categories],  # ✅ list of names
        'created_at': p.created_at.isoformat(),
        'updated_at': p.updated_at.isoformat()
    } for p in posts]
    if format_type == 'csv':
        si = StringIO()
        if data:
            cw = csv.DictWriter(si, fieldnames=data[0].keys())
            cw.writeheader()
            cw.writerows(data)
        output = si.getvalue()
        return Response(output, mimetype='text/csv',
                        headers={'Content-Disposition': 'attachment; filename=posts_export.csv'})
    else:
        return jsonify(data)


# ---------- TEMPORARY MIGRATION ROUTES (Render Free Tier के लिए) ----------
@app.route('/migrate')
def migrate_db():
    try:
        from flask_migrate import upgrade
        upgrade()
        return "✅ Database migrated successfully! Tables created."
    except Exception as e:
        return f"❌ Error: {str(e)}"

@app.route('/seed')
def seed_db_route():
    try:
        if not User.query.filter_by(username='admin').first():
            admin = User(username='admin', password=generate_password_hash('admin123'))
            db.session.add(admin)
            db.session.commit()
        if not Category.query.first():
            cat = Category(name='Personal Finance', slug='personal-finance')
            db.session.add(cat)
            db.session.commit()
            post = Post(
                title='बजट कैसे बनाएं?',
                slug='budget-kaise-banaye',
                content='<p>यह आपका पहला ब्लॉग पोस्ट है। यहाँ पूरा आर्टिकल आएगा।</p>',
                meta_title='बजट बनाने का सही तरीका | Personal Finance',
                meta_description='घर का बजट बनाना सीखें और पैसे बचाएं।',
                status='published'
            )
            post.categories = [cat]  # ✅ Many-to-Many
            db.session.add(post)
            db.session.commit()
        return "✅ Seed completed! Admin (admin/admin123) and demo post created."
    except Exception as e:
        return f"❌ Error: {str(e)}"


# ---------- Database Seeding (CLI Command) ----------
@app.cli.command("seed")
def seed_db():
    if not User.query.filter_by(username='admin').first():
        admin = User(username='admin', password=generate_password_hash('admin123'))
        db.session.add(admin)
        print("✅ एडमिन बन गया (Username: admin, Password: admin123)")
    if not Category.query.first():
        cat = Category(name='Personal Finance', slug='personal-finance')
        db.session.add(cat)
        db.session.commit()
        post = Post(
            title='बजट कैसे बनाएं?',
            slug='budget-kaise-banaye',
            content='<p>यह आपका पहला ब्लॉग पोस्ट है। यहाँ पूरा आर्टिकल आएगा।</p>',
            meta_title='बजट बनाने का सही तरीका | Personal Finance',
            meta_description='घर का बजट बनाना सीखें और पैसे बचाएं।',
            status='published'
        )
        post.categories = [cat]
        db.session.add(post)
        db.session.commit()
        print("✅ डमी पोस्ट डाल दी गई!")

# ---------- ADMIN: COMMENTS MANAGEMENT ----------
@app.route('/admin/comments')
@login_required
def admin_comments():
    """Admin panel to manage all comments"""
    # सारे Comments लाओ (सबसे नए पहले)
    comments = Comment.query.order_by(Comment.created_at.desc()).all()
    return render_template('admin/comments.html', comments=comments)

@app.route('/admin/comments/<int:id>/approve', methods=['POST'])
@login_required
def admin_approve_comment(id):
    """Approve a comment"""
    comment = Comment.query.get_or_404(id)
    comment.is_approved = True
    db.session.commit()
    flash('✅ Comment approved successfully!', 'success')
    return redirect(url_for('admin_comments'))

@app.route('/admin/comments/<int:id>/delete', methods=['POST'])
@login_required
def admin_delete_comment(id):
    """Delete a comment"""
    comment = Comment.query.get_or_404(id)
    db.session.delete(comment)
    db.session.commit()
    flash('🗑️ Comment deleted!', 'success')
    return redirect(url_for('admin_comments'))

@app.route('/admin/comments/<int:id>/reply', methods=['POST'])
@login_required
def admin_reply_comment(id):
    """Reply to a comment"""
    comment = Comment.query.get_or_404(id)
    reply_text = request.form.get('reply', '').strip()
    if reply_text:
        comment.reply = reply_text
        # अगर comment pending है तो उसे auto-approve कर दें
        if not comment.is_approved:
            comment.is_approved = True
        db.session.commit()
        flash('💬 Reply posted successfully!', 'success')
    else:
        flash('❌ Reply cannot be empty!', 'danger')
    return redirect(url_for('admin_comments'))

# ---------- Session Status (Health Check) ----------
@app.route('/session-status')
def session_status():
    return '', 200


# ---------- Main ----------
if __name__ == '__main__':
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug_mode, host='0.0.0.0', port=int(os.getenv('PORT', 5000)))