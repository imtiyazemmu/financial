'use client';

import { useState, useEffect } from 'react';

interface Comment {
  id: number;
  author_name: string;
  content: string;
  created_at: string;
}

interface CommentSectionProps {
  slug: string;
}

export default function CommentSection({ slug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const API_URL = 'https://financial-sapl.onrender.com';


  // Load Comments
  useEffect(() => {
    fetch(`${API_URL}/api/posts/${slug}/comments`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setComments(data);
      })
      .catch(err => console.error('Failed to load comments:', err));
  }, [slug, API_URL]);

  // Submit Comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      alert('Please enter your name and comment.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/posts/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author_name: name, author_email: email, content }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setContent('');
        // Optionally, reload comments (but they are pending, so keep it empty or show message)
        alert('✅ Comment submitted! It will appear after approval.');
      } else {
        alert('❌ Error: ' + (data.error || 'Something went wrong'));
      }
    } catch (err) {
      alert('❌ Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="mt-12 border-t border-gray-200 pt-10">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Comments ({comments.length})
      </h3>

      {/* Comments List */}
      <div className="space-y-6 mb-8">
        {comments.length === 0 && (
          <p className="text-gray-500 italic">No comments yet. Be the first!</p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {comment.author_name.charAt(0).toUpperCase()}
              </span>
              <span className="font-semibold text-gray-800">{comment.author_name}</span>
              <span className="text-xs text-gray-400">• {comment.created_at}</span>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>
        ))}
      </div>

      {/* Comment Form */}
      {!submitted ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Leave a Comment</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="your@email.com"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Comment *</label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              placeholder="Share your thoughts..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-700 hover:bg-blue-800 text-white font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Post Comment'}
          </button>
          <p className="text-xs text-gray-400 mt-3">
            💡 Your comment will appear after admin approval.
          </p>
        </form>
      ) : (
        <div className="bg-green-50 rounded-xl p-6 border border-green-200 text-center">
          <p className="text-green-700 font-medium">✅ Thank you for your comment!</p>
          <p className="text-sm text-gray-600">It will appear after admin approval.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-3 text-blue-600 hover:underline text-sm"
          >
            Write another comment
          </button>
        </div>
      )}
    </div>
  );
}