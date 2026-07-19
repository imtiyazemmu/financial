'use client';

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// ---------- Helpers ----------
function getReadingTime(content: string) {
  const text = content.replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.ceil(words / 200);
}

function extractHeadings(content: string) {
  const headings: { level: number; text: string; id: string }[] = [];
  const regex = /<h([1-6])>(.*?)<\/h\1>/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    if (text) headings.push({ level, text, id: `heading-${headings.length}` });
  }
  return headings;
}

export default function BlogContent({ content }: { content: string }) {
  const headings = extractHeadings(content);
  const readingTime = getReadingTime(content);

  return (
    <>
      {/* Table of Contents */}
      {headings.length > 2 && (
        <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-6 rounded-2xl border border-blue-100/50 mb-8 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
            Table of Contents
          </h3>
          <ul className="mt-3 space-y-1.5">
            {headings.map((h, idx) => (
              <li key={idx} style={{ marginLeft: `${(h.level - 1) * 1.2}rem` }}>
                <a
                  href={`#${h.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition"
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reading Time + Word Count */}
      <div className="flex items-center gap-5 text-sm text-gray-500 mb-8 p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
        <span className="flex items-center gap-1.5">📖 {readingTime} min read</span>
        <span className="w-px h-4 bg-gray-300" />
        <span className="flex items-center gap-1.5">📝 {content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length} words</span>
      </div>

      {/* Main Content */}
      <div
        className={`blog-content ${inter.className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <style jsx>{`
        .blog-content {
          font-size: 1.125rem;
          line-height: 1.8;
          color: #1e293b;
        }
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4 {
          scroll-margin-top: 100px;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.3;
          margin-top: 2.5rem;
          margin-bottom: 0.75rem;
        }
        .blog-content h1 {
          font-size: 2.8rem;
          background: linear-gradient(135deg, #1e293b, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .blog-content h2 {
          font-size: 2.2rem;
          color: #0f172a;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 0.4rem;
        }
        .blog-content h3 {
          font-size: 1.7rem;
          color: #1e293b;
        }
        .blog-content h4 {
          font-size: 1.3rem;
          color: #334155;
        }
        .blog-content p {
          margin-bottom: 1.5rem;
          color: #334155;
        }
        .blog-content ul,
        .blog-content ol {
          margin-left: 1.8rem;
          margin-bottom: 1.5rem;
        }
        .blog-content li {
          margin-bottom: 0.5rem;
          color: #334155;
        }
        .blog-content strong {
          color: #0f172a;
          font-weight: 700;
        }
        .blog-content a {
          color: #2563eb;
          text-decoration: underline;
          text-underline-offset: 2px;
          font-weight: 500;
        }
        .blog-content a:hover {
          color: #1d4ed8;
        }
        .blog-content img {
          border-radius: 16px;
          margin: 2rem 0;
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          transition: transform 0.2s ease;
        }
        .blog-content img:hover {
          transform: scale(1.01);
        }
        .blog-content blockquote {
          border-left: 5px solid #3b82f6;
          padding-left: 1.8rem;
          padding-top: 0.8rem;
          padding-bottom: 0.8rem;
          margin: 1.8rem 0;
          background: linear-gradient(to right, #f8fafc, #ffffff);
          border-radius: 0 12px 12px 0;
          font-style: italic;
          color: #475569;
        }
        .blog-content code {
          background: #f1f5f9;
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          font-size: 0.9rem;
          font-family: 'Courier New', monospace;
          color: #b91c1c;
        }
        .blog-content pre {
          background: #0f172a;
          padding: 1.2rem;
          border-radius: 14px;
          overflow-x: auto;
          margin: 1.8rem 0;
          color: #e2e8f0;
          font-size: 0.9rem;
        }
        .blog-content pre code {
          background: transparent;
          color: inherit;
          padding: 0;
        }
        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.8rem 0;
        }
        .blog-content th,
        .blog-content td {
          border: 1px solid #e2e8f0;
          padding: 0.6rem 1rem;
          text-align: left;
        }
        .blog-content th {
          background: #f1f5f9;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}