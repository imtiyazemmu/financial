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

# ✅ Environment Variables Load करें (सबसे पहले!)
load_dotenv()

# ✅ Cloudinary Configuration – **Unsigned Mode** (सिर्फ cloud_name चाहिए)
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME')
    # ⚠️ API_KEY और API_SECRET हटा दिए – Unsigned Upload के लिए ज़रूरी नहीं
)

app = Flask(__name__)

# ✅ Database Configuration – PostgreSQL Support
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

# ✅ Upload Folder (Fallback के लिए)
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
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    category = db.relationship('Category', backref='posts')

class Setting(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), unique=True, nullable=False)
    value = db.Column(db.Text, nullable=True)
    description = db.Column(db.String(200))


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


# ---------- API Routes ----------
@app.route('/api/posts', methods=['GET'])
def get_posts():
    category_slug = request.args.get('category')
    query = Post.query.filter_by(status='published')
    if category_slug:
        category = Category.query.filter_by(slug=category_slug).first()
        if category:
            query = query.filter_by(category_id=category.id)
    posts = query.order_by(Post.created_at.desc()).all()
    return jsonify([{
        'id': p.id,
        'title': p.title,
        'slug': p.slug,
        'content': p.content[:150] + '...' if len(p.content) > 150 else p.content,
        'meta_title': p.meta_title,
        'meta_description': p.meta_description,
        'featured_image': p.featured_image,
        'category': p.category.name if p.category else None,
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
        'content': post.content,
        'meta_title': post.meta_title,
        'meta_description': post.meta_description,
        'featured_image': post.featured_image,
        'category': post.category.name if post.category else None,
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


@app.route('/api/settings', methods=['GET'])
def get_settings():
    settings = Setting.query.all()
    return jsonify({s.key: s.value for s in settings})


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
    posts = Post.query.order_by(Post.created_at.desc()).all()
    total_posts = Post.query.count()
    draft_posts = Post.query.filter_by(status='draft').count()
    published_posts = Post.query.filter_by(status='published').count()
    total_categories = Category.query.count()
    total_views = db.session.query(db.func.sum(Post.views)).scalar() or 0
    return render_template('admin/index.html',
                           posts=posts,
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
        category_id = request.form.get('category_id')
        slug = request.form.get('slug', '').strip()
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
                category_id=category_id if category_id else None
            )
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
        category_id = request.form.get('category_id')
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
        post.category_id = category_id if category_id else None
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


# ✅ Cloudinary Upload – **पूरी तरह Unsigned** (बिना Signature)
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
            # ✅ Unsigned Upload – बस preset name
            result = cloudinary.uploader.upload(
                file,
                upload_preset='blog_unsigned'   # ← यहाँ अपना Unsigned Preset Name डालें
                unsigned=True
            )
            return jsonify({'location': result['secure_url']}), 200
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
        'category': p.category.name if p.category else None,
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
            category_id=cat.id,
            status='published'
        )
        db.session.add(post)
        db.session.commit()
        print("✅ डमी पोस्ट डाल दी गई!")


# ---------- Session Status (Health Check) ----------
@app.route('/session-status')
def session_status():
    return '', 200


# ---------- Main ----------
if __name__ == '__main__':
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug_mode, host='0.0.0.0', port=int(os.getenv('PORT', 5000)))