import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'About Us – FinanceTips | Personal Finance & Govt Schemes',
  description: 'Learn about FinanceTips – India\'s trusted platform for personal finance, government schemes, banking guides, and investment tips in Hindi.',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              About <span className="text-blue-700">FinanceTips</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your trusted guide to personal finance, government schemes, and smart investing in India.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-blue-50 rounded-2xl p-8 mb-10 border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">🎯 Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              Our mission is to make <strong>financial literacy</strong> accessible to every Indian. We simplify complex financial concepts, government schemes, and investment strategies so that you can make informed decisions about your money.
            </p>
          </div>

          {/* What We Cover */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Personal Finance</h3>
              <p className="text-gray-600 text-sm">Budgeting, saving, debt management, and financial planning for everyday Indians.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="text-3xl mb-3">🏛️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Government Schemes</h3>
              <p className="text-gray-600 text-sm">Detailed guides on Pradhan Mantri Yojana, subsidies, and government benefits.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Investment &amp; SIP</h3>
              <p className="text-gray-600 text-sm">Learn about Index ETFs, mutual funds, SIPs, and wealth creation strategies.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="text-3xl mb-3">🏦</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Banking &amp; Loans</h3>
              <p className="text-gray-600 text-sm">Banking guides, loan management, EMI calculators, and financial tools.</p>
            </div>
          </div>

          {/* Why Trust Us */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🔒 Why Trust Us?</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span><strong>Expert-Backed Content:</strong> Our guides are researched and written with financial experts.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span><strong>Simple &amp; Practical:</strong> We explain complex topics in simple Hindi and English.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span><strong>No Jargon, No Fluff:</strong> Actionable advice that you can implement in your daily life.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <span><strong>100% Independent:</strong> We are not affiliated with any bank or financial institution.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}