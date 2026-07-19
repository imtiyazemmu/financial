'use client';

import { useState, useEffect, useCallback } from 'react';

interface Comment {
  id: number;
  author_name: string;
  content: string;
  reply: string | null;
  is_approved: boolean;
  edit_token: string | null;
  created_at: string;
}

interface CommentSectionProps {
  slug: string;
  postId: number;
}

export default function CommentSection({ slug, postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const API_URL = 'https://financial-sapl.onrender.com';

  // ✅ localStorage से Tokens Fetch करें
  const getStoredTokens = useCallback(() => {
    const stored = localStorage.getItem(`comment_tokens_${postId}`);
    return stored ? JSON.parse(stored) : [];
  }, [postId]);

  const storeToken = useCallback((token: string) => {
    const tokens = getStoredTokens();
    if (!tokens.includes(token)) {
      tokens.push(token);
      localStorage.setItem(`comment_tokens_${postId}`, JSON.stringify(tokens));
    }
  }, [postId, getStoredTokens]);

  const fetchComments = useCallback(async () => {
    if (!slug || slug === 'undefined') {
      setLoading(false);
      setComments([]);
      return;
    }

    setLoading(true);
    setError(null);

    const tokens = getStoredTokens();
    const tokenQuery = tokens.length > 0 ? `&tokens=${tokens.join(',')}` : '';
    const url = `${API_URL}/api/posts/${encodeURIComponent(slug)}/comments?_=${Date.now()}${tokenQuery}`;

    console.log('🔍 Fetching comments from:', url);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      console.log('✅ Comments received:', data);
      setComments(data);
    } catch (err) {
      console.error('❌ Failed to load comments:', err);
      setError('Failed to load comments. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, [slug, API_URL, getStoredTokens]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      alert('Please enter your name and comment.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          author_name: name,
          author_email: email,
          content,
        }),
      });
      const data = await res.json();
      if (res.ok && data.comment) {
        storeToken(data.comment.edit_token);
        setSubmitted(true);
        setName('');
        setEmail('');
        setContent('');
        alert('✅ Comment submitted! You can see and edit it until admin approves.');
        fetchComments();
      } else {
        alert('❌ Error: ' + (data.error || 'Something went wrong'));
      }
    } catch (err) {
      alert('❌ Network error. Please try again.');
    }
    setSubmitting(false);
  };

  const handleEdit = async (id: number, token: string, newContent: string) => {
    if (!newContent.trim()) {
      alert('Content cannot be empty.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ edit_token: token, content: newContent }),
      });
      const data = await res.json();
      if (res.ok) {
        setEditingId(null);
        setEditContent('');
        alert('✅ Comment updated!');
        fetchComments();
      } else {
        alert('❌ Error: ' + (data.error || 'Update failed'));
      }
    } catch (err) {
      alert('❌ Network error. Please try again.');
    }
  };

  return (
    <div className="mt-12 border-t border-gray-200 pt-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">
          💬 Comments ({comments.length})
        </h3>
        <button
          onClick={fetchComments}
          disabled={loading}
          className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium transition disabled:opacity-50"
        >
          {loading ? 'Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="space-y-5 mb-8">
        {!loading && comments.length === 0 && (
          <p className="text-gray-500 italic text-center py-6 bg-gray-50/50 rounded-xl">
            No comments yet. Be the first!
          </p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {comment.author_name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <span className="font-semibold text-gray-800">{comment.author_name}</span>
              <span className="text-xs text-gray-400">• {comment.created_at}</span>
              {!comment.is_approved && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Pending</span>
              )}
            </div>

            {editingId === comment.id ? (
              <div className="mt-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(comment.id, comment.edit_token!, editContent)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => { setEditingId(null); setEditContent(''); }}
                    className="bg-gray-300 hover:bg-gray-400 px-4 py-1 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                {!comment.is_approved && comment.edit_token && (
                  <button
                    onClick={() => {
                      setEditingId(comment.id);
                      setEditContent(comment.content);
                    }}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 transition"
                  >
                    ✏️ Edit
                  </button>
                )}
              </>
            )}

            {comment.reply && (
              <div className="mt-4 pl-5 border-l-4 border-blue-500 bg-blue-50/60 p-4 rounded-r-lg">
                <p className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                  <span>🗣️ Admin Reply</span>
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">{comment.reply}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ✅ पूरा Comment Form – अब गायब नहीं होगा! */}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition"
              placeholder="Share your thoughts..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-700 hover:bg-blue-800 text-white font-medium px-6 py-2.5 rounded-lg transition disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Post Comment'}
          </button>
          <p className="text-xs text-gray-400 mt-3">
            💡 After submission, you can see and edit your comment until admin approves it.
          </p>
        </form>
      ) : (
        <div className="bg-green-50 rounded-xl p-6 border border-green-200 text-center">
          <p className="text-green-700 font-medium">✅ Thank you for your comment!</p>
          <p className="text-sm text-gray-600">You can now see it above and edit it until admin approval.</p>
          <button
            onClick={() => { setSubmitted(false); fetchComments(); }}
            className="mt-3 text-blue-600 hover:underline text-sm"
          >
            Write another comment
          </button>
        </div>
      )}
    </div>
  );
}