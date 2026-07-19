'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Finance<span className="text-blue-700">Tips</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium" aria-label="Main navigation">
            <Link href="/" className="text-gray-700 hover:text-blue-700 transition">Home</Link>
            <Link href="/category/personal-finance" className="text-gray-700 hover:text-blue-700 transition">Personal Finance</Link>
            <Link href="/category/government-schemes" className="text-gray-700 hover:text-blue-700 transition">Govt Schemes</Link>
            <Link href="/tools/emi-calculator" className="text-gray-700 hover:text-blue-700 transition">Calculators</Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-700 transition">About</Link>
            <Link href="/author" className="text-gray-700 hover:text-blue-700 transition">Author</Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-700 transition">Contact</Link>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button
            className="md:hidden text-gray-700 text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1.5 transition"
            onClick={toggleMenu}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            title={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? (
              <FaTimes aria-hidden="true" />
            ) : (
              <FaBars aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div id="mobile-menu" className="md:hidden py-3 border-t border-gray-100">
            <nav className="flex flex-col gap-2 text-sm font-medium" aria-label="Mobile navigation">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-700 transition px-2 py-1 rounded hover:bg-gray-50"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                href="/category/personal-finance"
                className="text-gray-700 hover:text-blue-700 transition px-2 py-1 rounded hover:bg-gray-50"
                onClick={closeMenu}
              >
                Personal Finance
              </Link>
              <Link
                href="/category/government-schemes"
                className="text-gray-700 hover:text-blue-700 transition px-2 py-1 rounded hover:bg-gray-50"
                onClick={closeMenu}
              >
                Govt Schemes
              </Link>
              <Link
                href="/tools/emi-calculator"
                className="text-gray-700 hover:text-blue-700 transition px-2 py-1 rounded hover:bg-gray-50"
                onClick={closeMenu}
              >
                Calculators
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-700 transition px-2 py-1 rounded hover:bg-gray-50"
                onClick={closeMenu}
              >
                About
              </Link>
              <Link
                href="/author"
                className="text-gray-700 hover:text-blue-700 transition px-2 py-1 rounded hover:bg-gray-50"
                onClick={closeMenu}
              >
                Author
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-blue-700 transition px-2 py-1 rounded hover:bg-gray-50"
                onClick={closeMenu}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}