const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

// ✅ Post Interface – अब categories Array है
export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  featured_image: string | null;
  categories: string[];      // ✅ Array of category names
  created_at: string;
}

// 1. सभी पोस्ट्स लाएं (Home Page)
export async function getAllPosts(): Promise<Post[]> {
  const res = await fetch(`${API_URL}/api/posts`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch posts');
  const data = await res.json();
  // ✅ Ensure categories is always an array (backward compatible)
  return data.map((post: any) => ({
    ...post,
    categories: post.categories || [],
  }));
}

// 2. एक सिंगल पोस्ट (Blog Detail Page) - ISR के साथ
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const res = await fetch(`${API_URL}/api/posts/${slug}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return {
    ...data,
    categories: data.categories || [],
  };
}

// 3. Settings (AdSense Codes) लाने के लिए
export async function getSettings() {
  const res = await fetch(`${API_URL}/api/settings`, {
    cache: 'no-store',
  });
  if (!res.ok) return {};
  return res.json();
}