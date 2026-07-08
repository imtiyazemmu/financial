'use client';

import { useEffect, useState } from 'react';

export default function ShareButtons() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
    setTitle(document.title);
  }, []);

  return (
    <div className="mt-8 pt-4 border-t flex flex-wrap gap-3">
      <span className="font-medium text-gray-600">Share:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        className="text-blue-400 hover:text-blue-600"
      >
        Twitter
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        className="text-blue-600 hover:text-blue-800"
      >
        Facebook
      </a>
      <a
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`}
        target="_blank"
        className="text-green-500 hover:text-green-700"
      >
        WhatsApp
      </a>
    </div>
  );
}