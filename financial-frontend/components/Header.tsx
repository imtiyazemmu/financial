'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Finance<span className="text-blue-700">Tips</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-gray-700 hover:text-blue-700 transition">Home</Link>
            <Link href="/category/personal-finance" className="text-gray-700 hover:text-blue-700 transition">Personal Finance</Link>
            <Link href="/category/government-schemes" className="text-gray-700 hover:text-blue-700 transition">Govt Schemes</Link>
            <Link href="/tools/emi-calculator" className="text-gray-700 hover:text-blue-700 transition">Calculators</Link>
          </nav>
          <button
            className="md:hidden text-gray-700 text-2xl focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        {isOpen && (
          <div className="md:hidden py-3 border-t border-gray-100">
            <nav className="flex flex-col gap-2 text-sm font-medium">
              <Link href="/" className="text-gray-700 hover:text-blue-700 transition px-2 py-1 rounded hover:bg-gray-50">Home</Link>
              <Link href="/category/personal-finance" className="text-gray-700 hover:text-blue-700 transition px-2 py-1 rounded hover:bg-gray-50">Personal Finance</Link>
              <Link href="/category/government-schemes" className="text-gray-700 hover:text-blue-700 transition px-2 py-1 rounded hover:bg-gray-50">Govt Schemes</Link>
              <Link href="/tools/emi-calculator" className="text-gray-700 hover:text-blue-700 transition px-2 py-1 rounded hover:bg-gray-50">Calculators</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}