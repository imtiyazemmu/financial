import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Author – FinanceTips | About the Founder',
  description: 'Learn about the founder of FinanceTips – a personal finance expert dedicated to helping Indians achieve financial freedom.',
};

export default function AuthorPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              About the <span className="text-blue-700">Author</span>
            </h1>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            {/* Profile Photo */}
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-emerald-400 flex items-center justify-center text-white text-5xl font-bold">
                📘
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Financial Expert
            </h2>
            <p className="text-gray-500 text-center mb-6">Personal Finance &amp; Govt Schemes Specialist</p>

            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                Welcome to <strong>FinanceTips</strong>! I am a personal finance enthusiast dedicated to helping Indians achieve financial freedom through simple, practical advice.
              </p>
              <p>
                With years of experience in personal finance, government schemes, and investment strategies, I break down complex topics into easy-to-understand guides in Hindi and English.
              </p>
              <p>
                My mission is to empower every Indian to make informed financial decisions – whether it's saving money, investing in SIPs, or understanding government schemes.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}