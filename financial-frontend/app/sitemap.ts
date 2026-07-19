import { getAllPosts } from '@/lib/api';

// ✅ हार्डकोड करें – इससे कोई गलती नहीं होगी
const baseUrl = 'https://picsartpng.in';

export default async function sitemap() {
  // 1. Static Pages – सिर्फ Home Page, About/Contact हटा दिए
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // 2. Blog Posts – सिर्फ Published
  const posts = await getAllPosts();
  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [...staticPages, ...blogPages];
}