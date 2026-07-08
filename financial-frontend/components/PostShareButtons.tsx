'use client';

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

interface PostShareButtonsProps {
  slug: string;
  title: string;
}

export default function PostShareButtons({ slug, title }: PostShareButtonsProps) {
  // पोस्ट का पूरा URL बनाएँ (मान लें कि साइट URL env में है)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/blog/${slug}`;

  const shareData = [
    { icon: FaTwitter, color: 'text-blue-400 hover:text-blue-500', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
    { icon: FaFacebook, color: 'text-blue-600 hover:text-blue-700', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { icon: FaWhatsapp, color: 'text-green-500 hover:text-green-600', href: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}` },
    { icon: FaLinkedin, color: 'text-blue-700 hover:text-blue-800', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { icon: FaPinterest, color: 'text-red-600 hover:text-red-700', href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}` },
    { icon: FaTelegram, color: 'text-sky-500 hover:text-sky-600', href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
    { icon: FaReddit, color: 'text-orange-500 hover:text-orange-600', href: `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
    { icon: FaEnvelope, color: 'text-gray-600 hover:text-gray-700', href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Check out this article: ' + url)}` },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied!'); // या आप एक टूलटिप भी दिखा सकते हैं
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 mt-2">
      {shareData.map(({ icon: Icon, color, href }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${color} p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200`}
          aria-label="Share"
          title="Share"
        >
          <Icon size={16} />
        </a>
      ))}
      {/* Copy Link Button */}
      <button
        onClick={handleCopyLink}
        className="text-gray-600 hover:text-gray-800 p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
        aria-label="Copy link"
        title="Copy link"
      >
        <FaLink size={16} />
      </button>
    </div>
  );
}