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
      setIsScrolled(window.scrollY > 50);
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
    { name: 'New Arrivals', href: '#' },
    { name: 'Collections', href: '#' },
    { name: 'Performance', href: '#' },
    { name: 'Sale', href: '#' },
  ];

  return (
    <nav 
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white py-4 shadow-sm' : 'bg-white/25 py-6'
      }`}
    >
      <div className="container grid grid-cols-3 items-center">
        {/* Column 1: Logo */}
        <div className="flex justify-start">
          <Link href="/" className="relative w-32 h-10">
            <Image 
              src="/DISPORT LOGOS/logo-Small.webp" 
              alt="Disport Logo" 
              fill
              sizes="128px"
              className={`object-contain transition-all duration-300`}
            />
          </Link>
        </div>

        {/* Column 2: Desktop Navigation (Centered) */}
        <div className="hidden lg:flex items-center justify-center gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`py-2 text-[15px] font-medium transition-all hover:text-gray-500 whitespace-nowrap text-black`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Column 3: Actions (Right-aligned) */}
        <div className="flex items-center justify-end gap-3">
          <div className="flex items-center gap-3">
            {/* Search Bar - Inverted Style */}
            <div className="relative hidden md:flex items-center group">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#F5F5F5] border-none rounded-full py-1.5 pl-4 pr-12 text-[16px] ring-gray-200 placeholder:text-[#757575] focus:ring-0 transition-all w-32 focus:w-48 lg:w-40 lg:focus:w-64 hover:bg-[#E5E5E5]"
              />
              <div 
                className={`absolute right-1.5 transition-all duration-300 flex items-center justify-center cursor-pointer ${
                  isFocused 
                    ? 'text-gray-100 bg-amber-600 p-1 rounded-full' 
                    : 'text-gray-900 bg-transparent p-0'
                }`}
                onClick={handleSearchAction}
              >
                <Search size={isFocused ? 20 : 22} strokeWidth={isFocused ? 1.5 : 2} />
              </div>
              {isSearching && (
                <div className="absolute right-12">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            <button className="md:hidden hover:opacity-70 transition-opacity">
              <Search size={24} strokeWidth={1.5} />
            </button>

            <Link href="/wishlist" className="hover:opacity-70 transition-opacity flex items-center">
              <Icon icon="tabler:heart" className="w-6 h-6" />
            </Link>
            <Link href="/login" className="hover:opacity-70 transition-opacity flex items-center">
              <Icon icon="mingcute:user-5-line" className="w-6 h-6" />
            </Link>
            <Link href="/cart" className="relative hover:opacity-70 transition-opacity flex items-center">
              <Icon icon="solar:bag-5-broken" className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                0
              </span>
            </Link>
            <button 
              className="lg:hidden hover:opacity-70 transition-opacity"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[60] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <Link href="/" className="text-2xl font-bold tracking-tighter" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="text-black">DIS</span>
                <span className="text-primary-bright">PORT</span>
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} className="text-black" />
              </button>
            </div>
            
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="text-2xl font-bold uppercase tracking-widest text-black hover:text-primary-bright transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto pt-8 border-t border-border">
              <button className="flex items-center space-x-4 text-black mb-6">
                <User size={20} />
                <span className="font-bold uppercase tracking-widest">Profile</span>
              </button>
              <button className="flex items-center space-x-4 text-black">
                <Search size={20} />
                <span className="font-bold uppercase tracking-widest">Search</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

