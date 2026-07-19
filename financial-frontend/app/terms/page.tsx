import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Terms of Service – FinanceTips',
  description: 'Read FinanceTips terms of service – understand the rules and guidelines for using our website.',
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms of <span className="text-blue-700">Service</span>
            </h1>
            <p className="text-gray-600">Last updated: July 14, 2026</p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              Welcome to <strong>FinanceTips</strong>. By using our website (accessible from <a href="https://picsartpng.in" className="text-blue-700">picsartpng.in</a>), you agree to comply with these terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>By accessing this website, you agree to be bound by these Terms of Service. If you do not agree, please do not use our site.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Content Disclaimer</h2>
            <ul>
              <li>All content on FinanceTips is for <strong>educational and informational purposes only</strong>.</li>
              <li>We are not financial advisors. Always consult a qualified professional before making financial decisions.</li>
              <li>Past performance does not guarantee future results.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Intellectual Property</h2>
            <ul>
              <li>All content on this site (text, images, graphics) is the property of FinanceTips unless otherwise noted.</li>
              <li>You may share our content with proper attribution.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. User Conduct</h2>
            <ul>
              <li>Do not use our site for any unlawful purpose.</li>
              <li>Do not post harmful or abusive content.</li>
              <li>Respect the intellectual property of others.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. External Links</h2>
            <p>Our website may contain links to third-party sites. We are not responsible for their content or privacy practices.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Limitation of Liability</h2>
            <p>FinanceTips is not liable for any losses or damages arising from the use of our website or reliance on our content.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Changes to Terms</h2>
            <p>We reserve the right to update these terms at any time. Please review them periodically.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Contact Us</h2>
            <p>
              Questions? <Link href="/contact" className="text-blue-700 hover:underline">Contact us</Link>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}