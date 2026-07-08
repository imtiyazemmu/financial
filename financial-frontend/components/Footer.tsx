import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h3 className="font-bold text-gray-800">FinanceTips</h3>
            <p className="text-gray-600 mt-2">Your guide to personal finance, government schemes, and smart investing in India.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700">Quick Links</h4>
            <ul className="mt-2 space-y-1">
              <li><Link href="/" className="text-gray-600 hover:text-blue-700 transition">Home</Link></li>
              <li><Link href="/blog" className="text-gray-600 hover:text-blue-700 transition">Blog</Link></li>
              <li><Link href="/tools/emi-calculator" className="text-gray-600 hover:text-blue-700 transition">EMI Calculator</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700">Categories</h4>
            <ul className="mt-2 space-y-1">
              <li><Link href="/category/personal-finance" className="text-gray-600 hover:text-blue-700 transition">Personal Finance</Link></li>
              <li><Link href="/category/government-schemes" className="text-gray-600 hover:text-blue-700 transition">Govt Schemes</Link></li>
              <li><Link href="/category/banking" className="text-gray-600 hover:text-blue-700 transition">Banking</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-6 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} FinanceTips. Made with ❤️ in India.
        </div>
      </div>
    </footer>
  );
}