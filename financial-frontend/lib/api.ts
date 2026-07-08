const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

// पोस्ट का Data Type (TypeScript के लिए)
export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  featured_image: string | null;
  category: string | null;
  created_at: string;
}

// 1. सभी पोस्ट्स लाएं (Home Page)
export async function getAllPosts(): Promise<Post[]> {
  const res = await fetch(`${API_URL}/api/posts`, {
    cache: 'no-store', // डेवलपमेंट में ताज़ा डेटा
  });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

// 2. एक सिंगल पोस्ट (Blog Detail Page) - ISR के साथ
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const res = await fetch(`${API_URL}/api/posts/${slug}`, {
    next: { revalidate: 60 }, // 60 सेकंड बाद कैश अपडेट
  });
  if (!res.ok) return null;
  return res.json();
}

// Settings (AdSense Codes) लाने के लिए
export async function getSettings() {
  const res = await fetch(`${API_URL}/api/settings`, {
    cache: 'no-store', // हर बार ताज़ा डेटा (ताकि एडमिन में बदलाव तुरंत दिखे)
  });
  if (!res.ok) return {};
  return res.json();
}