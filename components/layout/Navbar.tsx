"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    // Initial check on mount
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative w-32 h-10">
          <Image 
            src="/DISPORT LOGOS/logo-Small.webp" 
            alt="Disport Logo" 
            fill
            sizes="128px"
            className={`object-contain transition-all duration-300 ${isScrolled ? '' : 'brightness-0 invert'}`}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`text-sm font-bold uppercase tracking-widest hover:text-primary-bright transition-colors ${
                isScrolled ? 'text-black' : 'text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className={`flex items-center gap-6 ${isScrolled ? 'text-black' : 'text-white'}`}>
          <button className="hover:text-primary-bright transition-colors">
            <Search size={20} />
          </button>
          <button className="hover:text-primary-bright transition-colors">
            <User size={20} />
          </button>
          <button className="relative hover:text-primary-bright transition-colors">
            <ShoppingBag size={20} />
            <span className="absolute -top-2 -right-2 bg-primary-bright text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
              0
            </span>
          </button>
          <button 
            className="lg:hidden hover:text-primary-bright transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
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
