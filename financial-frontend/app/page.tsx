import Link from 'next/link';
import { getAllPosts } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostShareButtons from '@/components/PostShareButtons';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';

export const metadata = {
  title: 'FinanceTips – Personal Finance, Govt Schemes & Banking Guides',
  description: 'Expert financial tips, government schemes, banking guides, loan calculators, and stock market basics in Hindi.',
};

export default async function Home() {
  const posts = await getAllPosts();
  const featuredPosts = posts.slice(0, 3);
  const remainingPosts = posts.slice(3);

  // ✅ Type-Safe Categories – Fix for null/undefined
  const categories = Array.from(new Set(
    posts.map(p => p.category).filter((c): c is string => c !== null && c !== undefined)
  ));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section – Clean & Simple */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Smart Finance <br className="hidden sm:inline" />
            <span className="text-blue-700">Made Simple</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Expert guides on Personal Finance, Government Schemes, Banking &amp; Investing – in Hindi.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="#latest" className="px-6 py-3 bg-blue-700 text-white font-medium rounded-full hover:bg-blue-800 transition">
              Explore Articles
            </Link>
            <Link href="/tools/emi-calculator" className="px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-full hover:bg-gray-200 transition">
              EMI Calculator
            </Link>
          </div>
          {/* Category Pills */}
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/category/${cat.toLowerCase().replace(/ /g, '-')}`}
                className="px-4 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition"
              >
                {cat}
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <article key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="h-48 overflow-hidden bg-gray-100 relative">
                      {post.featured_image ? (
                        <Image
                          src={getImageUrl(post.featured_image)}
                          alt={post.title}
                          width={800}
                          height={400}
                          priority={index === 0} // ✅ पहली इमेज को Priority दें (LCP)
                          className="w-full h-full object-cover hover:scale-105 transition duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">📊</div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{post.category || 'Finance'}</span>
                        <span>•</span>
                        <span>{post.created_at}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {post.content.replace(/<[^>]+>/g, '').substring(0, 120)}…
                      </p>
                      <div className="mt-4 text-blue-700 font-medium text-sm inline-flex items-center group-hover:underline">
                        Read more <span className="ml-1">→</span>
                      </div>
                    </div>
                  </Link>
                  <div className="px-5 pb-4">
                    <PostShareButtons slug={post.slug} title={post.title} />
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* All Posts Grid */}
        <section id="latest" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Latest Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="h-40 overflow-hidden bg-gray-100 relative">
                    {post.featured_image ? (
                      <Image
                        src={getImageUrl(post.featured_image)}
                        alt={post.title}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">📈</div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{post.category || 'Finance'}</span>
                      <span>•</span>
                      <span>{post.created_at}</span>
                    </div>
                    <h3 className="text-md font-semibold text-gray-800 group-hover:text-blue-700 transition line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {post.content.replace(/<[^>]+>/g, '').substring(0, 100)}…
                    </p>
                    <div className="mt-3 text-blue-700 font-medium text-sm inline-flex items-center group-hover:underline">
                      Read more <span className="ml-1">→</span>
                    </div>
                  </div>
                </Link>
                <div className="px-4 pb-3">
                  <PostShareButtons slug={post.slug} title={post.title} />
                </div>
              </article>
            ))}
          </div>
          {posts.length === 0 && (
            <div className="text-center py-16 text-gray-500">📝 No posts yet. Check back soon!</div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}