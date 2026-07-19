import Link from 'next/link';
import { getAllPosts } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// ✅ Home Page SEO Metadata
export const metadata = {
  title: 'FinanceTips – Personal Finance, Govt Schemes & Banking Guides',
  description: 'Expert financial tips, government schemes (Pradhan Mantri Yojana), banking guides, loan calculators, and stock market basics in Hindi.',
  keywords: 'personal finance, government schemes, banking, loans, insurance, crypto, stock market, financial tips',
  openGraph: {
    title: 'FinanceTips – Personal Finance & Govt Schemes India',
    description: 'Learn personal finance, government schemes, and banking in Hindi.',
    type: 'website',
    locale: 'hi_IN',
    url: 'https://picsartpng.in',
  },
};

export default async function Home() {
  const posts = await getAllPosts();

  // Top 3 featured posts (first 3)
  const featuredPosts = posts.slice(0, 3);
  const remainingPosts = posts.slice(3);

  // ✅ Extract unique categories from all posts (categories array)
  const categories = Array.from(new Set(
    posts.flatMap(p => p.categories ?? [])
  ));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
        
        {/* 🎯 Hero Section */}
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-emerald-500/5" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                Financial Tips & Government Schemes
              </span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Personal Finance, Banking, Stock Market, and Government Yojana guides in Hindi.
            </p>
            
            {/* Category Pills – using extracted categories */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${cat.toLowerCase().replace(/ /g, '-')}`}
                  className="px-5 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition shadow-sm"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 🔥 Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 w-1.5 h-8 rounded-full" />
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPosts.map((post, index) => (
                <Link href={`/blog/${post.slug}`} key={post.id} className="group">
                  <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col border border-gray-100">
                    <div className="relative overflow-hidden h-52">
                      {post.featured_image ? (
                        <img 
                          src={post.featured_image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-4xl text-gray-300">
                          📊
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        #{index + 1}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        {/* ✅ Display first category, or 'Finance' */}
                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                          {post.categories?.[0] || 'Finance'}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span>{post.created_at}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-3 flex-1">
                        {post.content.replace(/<[^>]+>/g, '').substring(0, 120)}...
                      </p>
                      <div className="mt-4 text-blue-600 font-medium text-sm group-hover:underline flex items-center gap-1">
                        Read More <span className="text-lg">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 📄 All Posts Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-600 to-emerald-500 w-1.5 h-8 rounded-full" />
            Latest Articles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="group">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 h-full flex flex-col overflow-hidden">
                  <div className="h-44 overflow-hidden">
                    {post.featured_image ? (
                      <img 
                        src={post.featured_image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center text-3xl text-gray-300">
                        📈
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium text-[10px]">
                        {post.categories?.[0] || 'Finance'}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span>{post.created_at}</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-800 group-hover:text-blue-600 transition line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2 flex-1">
                      {post.content.replace(/<[^>]+>/g, '').substring(0, 100)}...
                    </p>
                    <div className="mt-3 text-blue-600 font-medium text-xs group-hover:underline">
                      Read More →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">📝 No posts yet. Check back soon!</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}