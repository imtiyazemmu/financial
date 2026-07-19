import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Disclaimer – FinanceTips',
  description: 'Read FinanceTips disclaimer – our content is for educational purposes only. We are not financial advisors.',
};

export default function DisclaimerPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="text-blue-700">Disclaimer</span>
            </h1>
            <p className="text-gray-600">Last updated: July 14, 2026</p>
          </div>

          <div className="bg-yellow-50 rounded-2xl p-8 border border-yellow-200 mb-10">
            <p className="text-gray-700 text-lg font-medium">
              ⚠️ <strong>Important:</strong> The information on this website is for <strong>educational and informational purposes only</strong>.
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">General Information</h2>
            <p>
              FinanceTips provides content related to personal finance, government schemes, banking, and investments. All content is created for <strong>informational and educational purposes</strong>.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Not Financial Advice</h2>
            <ul>
              <li>We are <strong>NOT registered financial advisors</strong>.</li>
              <li>Our content should not be considered as professional financial advice.</li>
              <li>Always consult a <strong>qualified financial advisor</strong> before making investment or financial decisions.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Accuracy of Information</h2>
            <ul>
              <li>We strive to provide accurate and up-to-date information.</li>
              <li>However, we do not guarantee the completeness, accuracy, or reliability of any content.</li>
              <li>Financial data, government schemes, and investment information can change frequently.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Risk of Financial Loss</h2>
            <ul>
              <li>All investments carry <strong>risk</strong>.</li>
              <li>Past performance does not guarantee future results.</li>
              <li>You are <strong>solely responsible</strong> for your financial decisions.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">External Links</h2>
            <p>
              We may link to external websites. We are not responsible for the content, accuracy, or reliability of these third-party sites.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">No Liability</h2>
            <p>
              FinanceTips, its authors, and contributors are <strong>not liable</strong> for any losses, damages, or issues arising from the use of our content.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p>
              If you have any questions, please <Link href="/contact" className="text-blue-700 hover:underline">contact us</Link>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}