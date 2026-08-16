'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function MarketingHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-xl tracking-tight">Segmentics.</Link>
        
        {/* DESKTOP NAV (Hidden on Mobile) */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <Link href="/#features" className="hover:text-black transition-colors">Features</Link>
          <Link href="/#how-it-works" className="hover:text-black transition-colors">How it Works</Link>
          <Link href="/pricing" className="hover:text-black transition-colors">Pricing</Link>
          <Link href="/about" className="hover:text-black transition-colors">About Us</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold hover:text-gray-600 transition-colors">Log In</Link>
          <Link href="/login" className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition-transform active:scale-95">Get Started</Link>
        </div>

        {/* MOBILE MENU BUTTON (Hidden on Desktop) */}
        <button 
          className="md:hidden p-2 text-gray-900 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-6 flex flex-col gap-4 shadow-2xl absolute top-16 left-0 right-0 z-50">
          <Link href="/#features" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-bold text-lg p-3 hover:bg-gray-50 rounded-xl">Features</Link>
          <Link href="/#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-bold text-lg p-3 hover:bg-gray-50 rounded-xl">How it Works</Link>
          <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-bold text-lg p-3 hover:bg-gray-50 rounded-xl">Pricing</Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-bold text-lg p-3 hover:bg-gray-50 rounded-xl">About Us</Link>
          
          <div className="h-px bg-gray-200 my-4"></div>
          
          <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center font-bold text-gray-800 p-4">Log In</Link>
          <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="bg-black text-white text-center font-bold p-4 rounded-xl text-lg">Get Started</Link>
        </div>
      )}
    </header>
  );
}