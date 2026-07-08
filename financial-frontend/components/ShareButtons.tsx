'use client';

import { useEffect, useState } from 'react';
import {
  FaTwitter,
  FaFacebook,
  FaWhatsapp,
  FaLinkedin,
  FaPinterest,
  FaTelegram,
  FaReddit,
  FaEnvelope,
  FaLink,
} from 'react-icons/fa';

export default function ShareButtons() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
    setTitle(document.title);
  }, []);

  const shareData = [
    {
      name: 'Twitter',
      icon: FaTwitter,
      color: 'bg-blue-400 hover:bg-blue-500',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: 'Facebook',
      icon: FaFacebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'bg-green-500 hover:bg-green-600',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`,
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      color: 'bg-blue-700 hover:bg-blue-800',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: 'Pinterest',
      icon: FaPinterest,
      color: 'bg-red-600 hover:bg-red-700',
      href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`,
    },
    {
      name: 'Telegram',
      icon: FaTelegram,
      color: 'bg-sky-500 hover:bg-sky-600',
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: 'Reddit',
      icon: FaReddit,
      color: 'bg-orange-500 hover:bg-orange-600',
      href: `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    },
    {
      name: 'Email',
      icon: FaEnvelope,
      color: 'bg-gray-600 hover:bg-gray-700',
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Check out this article: ' + url)}`,
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="mt-8 pt-4 border-t border-gray-200">
      <p className="text-sm font-medium text-gray-700 mb-3">Share this article:</p>
      <div className="flex flex-wrap gap-3">
        {shareData.map(({ name, icon: Icon, color, href }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${color} text-white p-2 rounded-full transition-transform duration-200 hover:scale-110 shadow-md`}
            aria-label={`Share on ${name}`}
            title={name}
          >
            <Icon size={20} />
          </a>
        ))}
        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className="bg-gray-800 hover:bg-gray-900 text-white p-2 rounded-full transition-transform duration-200 hover:scale-110 shadow-md relative"
          aria-label="Copy link"
          title="Copy link"
        >
          <FaLink size={20} />
          {copied && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Copied!
            </span>
          )}
        </button>
      </div>
    </div>
  );
}