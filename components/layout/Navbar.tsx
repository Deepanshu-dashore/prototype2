"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [isFocused, setIsFocused] = useState(false);

  const handleSearchAction = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 2000);
  };

  const navLinks = [
    { name: 'Men', href: '#' },
    { name: 'Women', href: '#' },
    { name: 'Performance', href: '#' },
    { name: 'New Arrivals', href: '#' },
    { name: 'Sale', href: '#' },
  ];

  return (
    <nav 
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 h-[72px] flex items-center px-5 md:px-10 ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-white/90 backdrop-blur-md'
      }`}
    >
      <div className="w-full flex items-center justify-between">
        {/* Mobile: Menu Trigger | Desktop: Hidden */}
        <div className="lg:hidden flex-1 flex justify-start">
          <button 
            className="p-2 text-[#1a1c1c] hover:bg-black/5 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Icon icon="tabler:menu-2" className="w-[24px] h-[24px]" />
          </button>
        </div>

        {/* Column 1: Logo - Left on Desktop, Center on Mobile */}
        <div className="flex-1 flex justify-center lg:justify-start">
          <Link href="/" className="relative w-28 md:w-40 h-8 md:h-10">
            <Image 
              src="/DISPORT LOGOS/LOGO.webp" 
              alt="Disport Logo" 
              fill
              sizes="(max-width: 768px) 112px, 160px"
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* Column 2: Desktop Navigation - Perfectly Centered */}
        <div className="hidden lg:flex flex-1 items-center justify-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-[14px] font-bold uppercase tracking-wider transition-all hover:text-[#964900] whitespace-nowrap text-black font-heading"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Column 3: Utilities - Right-aligned */}
        <div className="flex-1 flex items-center justify-end">
          <div className="flex items-center">
            {/* Search Bar - Desktop Only */}
            <div className="relative hidden md:flex items-center group">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#f3f3f4] border-none outline-none rounded-full py-0 px-[18px] text-[14px] placeholder:text-[#8a7263] focus:ring-0 focus:bg-[#eaeaeb] transition-all w-[220px] h-[48px] hover:bg-[#eaeaeb]"
              />
              <div 
                className="absolute right-[18px] flex items-center justify-center cursor-pointer text-[#1a1c1c] opacity-60 group-hover:opacity-100 transition-opacity"
                onClick={handleSearchAction}
              >
                <Icon icon="tabler:search" className="w-5 h-5" />
              </div>
              {isSearching && (
                <div className="absolute right-[45px]">
                  <div className="w-3 h-3 border-2 border-[#964900] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Icons Group */}
            <div className="flex items-center gap-[10px] md:gap-[18px] md:ml-6">
              {/* Mobile Search Trigger */}
              <button className="md:hidden p-2 text-[#1a1c1c] hover:bg-black/5 rounded-full transition-colors">
                <Icon icon="tabler:search" className="w-[24px] h-[24px]" />
              </button>

              {/* Wishlist - Desktop Only */}
              <Link href="/wishlist" className="hidden md:flex hover:scale-110 transition-transform text-[#1a1c1c]">
                <Icon icon="tabler:heart" className="w-[24px] h-[24px] stroke-[1.5]" />
              </Link>
              
              {/* Account - Desktop Only */}
              <Link href="/login" className="hidden md:flex hover:scale-110 transition-transform text-[#1a1c1c]">
                <Icon icon="tabler:user" className="w-[24px] h-[24px] stroke-[1.5]" />
              </Link>

              {/* Cart - Revenue Critical */}
              <Link href="/cart" className="relative p-2 rounded-full hover:bg-black/5 transition-all group">
                <Icon icon="tabler:shopping-bag" className="w-[24px] h-[24px] group-hover:scale-105 transition-transform text-[#1a1c1c]" />
                <span className="absolute top-[-2px] right-[-2px] bg-[#ec7700] text-white text-[11px] w-[18px] h-[18px] flex items-center justify-center rounded-full font-bold shadow-sm">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[60] flex flex-col"
          >
            <div className="flex justify-between items-center h-[72px] px-5 border-b border-gray-100">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <Image src="/DISPORT LOGOS/LOGO.webp" alt="Logo" width={120} height={30} className="object-contain" />
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                <Icon icon="tabler:x" className="w-6 h-6 text-black" />
              </button>
            </div>
            
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="text-2xl font-bold uppercase tracking-tight text-black font-['Space_Grotesk'] border-b border-gray-50 pb-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto p-6 bg-gray-50 space-y-4">
              <Link href="/wishlist" className="flex items-center gap-4 text-black font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                <Icon icon="tabler:heart" className="w-6 h-6" />
                <span>Wishlist</span>
              </Link>
              <Link href="/login" className="flex items-center gap-4 text-black font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                <Icon icon="tabler:user" className="w-6 h-6" />
                <span>Account</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
