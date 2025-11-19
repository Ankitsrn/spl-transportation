'use client';
import React from 'react';
import { MapPin, Menu, X, Phone } from 'lucide-react';
import Image from 'next/image';
// --- CONFIGURATION ---
const COMPANY_PHONE = '+61470032460'; 

export default function Navigation({
  setCurrentPage,
  menuOpen,
  setMenuOpen
}: {
  setCurrentPage: (p: string) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
}) {
  
  // --- UPDATED NAV HANDLER ---
  // This now handles State Change + Closing Menu + Scrolling to Top
  const handleNavClick = (page: string) => {
    setCurrentPage(page);
    setMenuOpen(false);
    // This forces the window to jump to the top immediately
    window.scrollTo(0, 0); 
  };

  return (
    <nav className="fixed w-full top-0 z-50 transition-all duration-300
                    bg-white/90 dark:bg-gray-950/90 backdrop-blur-md 
                    border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Logo */}
          <div
  className="flex items-center gap-4 cursor-pointer group"
  onClick={() => handleNavClick('home')}
>
  <div
    className="
      p-1 
      dark:bg-white 
      dark:shadow-md
      dark:border dark:border-gray-200
      lg:dark:bg-transparent lg:dark:shadow-none lg:dark:border-0 pt-0.5 pb-0.5
    "
  >
    <Image
      src="/logo.png"
      width={120}
      height={40}
      alt="SPL Transportation Logo"
      className="object-contain"
      priority
    />
  </div>
</div>

          

          {/* Center: Links (Desktop) */}
          <div className="hidden lg:flex space-x-8 items-center">
            {['Home', 'Routes', 'About', 'Contact','Terms'].map((item) => (
              <button
                key={item}
                // UPDATED: Now uses handleNavClick instead of setCurrentPage
                onClick={() => handleNavClick(item.toLowerCase())}
                className="text-sm font-semibold text-gray-600 dark:text-gray-300 
                          hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Right: CTA + Mobile Toggle */}
          <div className="flex items-center gap-4">
            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
               <a href={`tel:${COMPANY_PHONE}`} className="text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition mr-2">
                  <Phone className="w-5 h-5" />
               </a>
              <button
                // UPDATED: Now uses handleNavClick
                onClick={() => handleNavClick('routes')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full 
                          bg-yellow-400 hover:bg-yellow-300 
                          text-gray-900 font-bold text-sm shadow-lg shadow-yellow-400/20 
                          transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Book a Taxi</span>
              </button>
            </div>

            {/* Mobile Hamburger */}
            <div className="lg:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 
                          hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 py-4 space-y-2">
          {['Home', 'Routes', 'About', 'Contact', 'Terms'].map((item) => (
            <button
              key={item}
              onClick={() => handleNavClick(item.toLowerCase())}
              className="block w-full text-left py-3 px-4 rounded-lg font-medium
                        text-gray-700 dark:text-gray-200 
                        hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-yellow-500 transition"
            >
              {item}
            </button>
          ))}
          
          {/* Mobile CTA */}
          <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => handleNavClick('routes')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl 
                        bg-yellow-400 text-gray-900 font-bold shadow-md active:scale-95 transition"
            >
              BOOK A TAXI
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}