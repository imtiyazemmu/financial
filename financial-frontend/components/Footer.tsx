'use client';

import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t-4 border-t-transparent border-image-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1 – Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold text-white inline-block">
              Finance<span className="text-blue-400">Tips</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Your trusted guide to personal finance, government schemes, and smart investing in India.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3 pt-2">
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <FaFacebook className="text-sm" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-9 h-9 bg-gray-800 hover:bg-sky-500 rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <FaTwitter className="text-sm" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <FaInstagram className="text-sm" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-9 h-9 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <FaYoutube className="text-sm" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-9 h-9 bg-gray-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <FaLinkedin className="text-sm" />
              </a>
            </div>
          </div>

          {/* Column 2 – Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/author" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Author
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 – Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/category/personal-finance" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Personal Finance
                </Link>
              </li>
              <li>
                <Link href="/category/government-schemes" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Govt Schemes
                </Link>
              </li>
              <li>
                <Link href="/category/banking" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Banking
                </Link>
              </li>
              <li>
                <Link href="/tools/emi-calculator" className="text-gray-400 hover:text-white transition-colors duration-200">
                  EMI Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 – Newsletter / Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Stay Updated
            </h4>
            <p className="text-sm text-gray-400 mb-3">
              Subscribe to our newsletter for the latest financial tips.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2">No spam, unsubscribe anytime.</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>
            &copy; {currentYear} FinanceTips. Made with ❤️ in India.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-700">|</span>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
            <span className="text-gray-700">|</span>
            <Link href="/disclaimer" className="hover:text-gray-300 transition-colors">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>

      {/* Gradient Border Style */}
      <style jsx>{`
        .border-image-gradient {
          border-image: linear-gradient(to right, #2563eb, #14b8a6, #10b981) 1;
        }
      `}</style>
    </footer>
  );
}