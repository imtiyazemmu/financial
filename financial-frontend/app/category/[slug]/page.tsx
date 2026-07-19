import Link from 'next/link';
import { getAllPosts } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categoryName = slug.replace(/-/g, ' ').toUpperCase();
  return {
    title: `${categoryName} – FinanceTips`,
    description: `Read the latest articles on ${categoryName} – expert financial tips and guides.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const allPosts = await getAllPosts();

  // ✅ सही फ़िल्टर: क्योंकि API अब `categories` Array भेज रहा है
  const filteredPosts = allPosts.filter((post) => {
    // अगर post.categories मौजूद है और वह Array है
    if (post.categories && Array.isArray(post.categories)) {
      // क्या कोई Category का Slug (generate) हमारे slug से match करता है?
      return post.categories.some((catName: string) => {
        const catSlug = catName.toLowerCase().replace(/ /g, '-');
        return catSlug === slug;
      });
    }
    return false;
  });

  const categoryName = filteredPosts.length > 0
    ? filteredPosts[0].categories?.[0] || slug.replace(/-/g, ' ').toUpperCase()
    : slug.replace(/-/g, ' ').toUpperCase();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-800">
              📂 {categoryName}
            </h1>
            <p className="text-gray-600 mt-2">All articles related to {categoryName}</p>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.id} className="group">
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 h-full flex flex-col overflow-hidden">
                    <div className="h-44 overflow-hidden">
                      {post.featured_image ? (
                        <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center text-3xl text-gray-300">📰</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{post.created_at}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">No posts found in this category.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}