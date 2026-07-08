import { getAllPosts } from '@/lib/api';

export default async function sitemap() {
  // ✅ अपना डोमेन यहाँ डालें (अभी localhost है, बाद में बदल देना)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // 1. स्टैटिक पेजेज़ (होम, अबाउट, कॉन्टैक्ट आदि)
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // 2. सारे ब्लॉग पोस्ट्स को Sitemap में जोड़ें
  const posts = await getAllPosts();
  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.created_at), // पोस्ट की तारीख
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [...staticPages, ...blogPages];
}