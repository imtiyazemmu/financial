import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy – FinanceTips',
  description: 'Read FinanceTips privacy policy to understand how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Privacy <span className="text-blue-700">Policy</span>
            </h1>
            <p className="text-gray-600">Last updated: July 14, 2026</p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              At <strong>FinanceTips</strong> (accessible from <a href="https://picsartpng.in" className="text-blue-700">picsartpng.in</a>), we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
            <ul>
              <li><strong>Personal Information:</strong> Name, email address when you contact us or subscribe.</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, and interactions with our content.</li>
              <li><strong>Cookies:</strong> We use cookies to improve your browsing experience.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
            <ul>
              <li>To provide and maintain our website.</li>
              <li>To send you updates, newsletters, and promotional content (only with your consent).</li>
              <li>To improve user experience and content quality.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Third-Party Services</h2>
            <ul>
              <li><strong>Google AdSense:</strong> We use Google AdSense to serve ads. Google may use cookies to show personalized ads based on your interests.</li>
              <li><strong>Google Analytics:</strong> We use Google Analytics to understand visitor behavior and improve our content.</li>
              <li><strong>Cloudinary:</strong> We use Cloudinary for image hosting and optimization.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal data from unauthorized access, alteration, or disclosure.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Your Rights</h2>
            <ul>
              <li>You can request access to your personal data.</li>
              <li>You can ask us to delete your personal data.</li>
              <li>You can opt out of marketing communications at any time.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Changes to This Policy</h2>
            <p>We may update this policy from time to time. Please check back periodically for changes.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Contact Us</h2>
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