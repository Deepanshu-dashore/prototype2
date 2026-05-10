"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Twitter, Facebook, Youtube } from '@/components/shared/BrandIcons';

const Footer = () => {
  const footerLinks = [
    {
      title: 'Products',
      links: [
        { name: 'Men', href: '#' },
        { name: 'Women', href: '#' },
        { name: 'New Arrivals', href: '#' },
        { name: 'Collections', href: '#' },
        { name: 'Sale', href: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Shipping', href: '#' },
        { name: 'Returns', href: '#' },
        { name: 'Size Guide', href: '#' },
        { name: 'Track Order', href: '#' },
        { name: 'Contact', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'Our Story', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Sustainability', href: '#' },
        { name: 'Press', href: '#' },
        { name: 'Store Locator', href: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-black text-white pt-20 pb-10 border-t border-white/10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
          {/* Logo and About */}
          <div className="lg:col-span-4">
            <Link href="/" className="relative w-48 h-12 mb-10 block">
              <Image 
                src="/DISPORT LOGOS/LOGO.webp" 
                alt="Disport Logo" 
                fill
                sizes="192px"
                className="object-contain object-left"
              />
            </Link>
            <p className="text-white/40 max-w-sm mb-10 leading-relaxed text-sm uppercase tracking-widest">
              Premium high-performance sportswear engineered for movement and technical precision. Redefining the limits of athletic gear.
            </p>
            <div className="flex gap-8">
              <Link href="#" className="text-white/40 hover:text-primary-bright transition-all duration-300 transform hover:scale-110"><Instagram size={22} /></Link>
              <Link href="#" className="text-white/40 hover:text-primary-bright transition-all duration-300 transform hover:scale-110"><Twitter size={22} /></Link>
              <Link href="#" className="text-white/40 hover:text-primary-bright transition-all duration-300 transform hover:scale-110"><Facebook size={22} /></Link>
              <Link href="#" className="text-white/40 hover:text-primary-bright transition-all duration-300 transform hover:scale-110"><Youtube size={22} /></Link>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-8">{section.title}</h4>
                <ul className="flex flex-col gap-5">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-white/50 hover:text-primary-bright text-[11px] font-bold transition-all uppercase tracking-[0.2em] block">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12">
            <p className="text-white/20 text-[9px] uppercase tracking-[0.3em]">
              © 2026 DISPORT SYSTEM. ALL RIGHTS RESERVED.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-white/10 hover:text-white text-[9px] uppercase tracking-[0.3em] transition-colors">Privacy Policy</Link>
              <span className="text-white/5 text-[10px]">/</span>
              <Link href="#" className="text-white/10 hover:text-white text-[9px] uppercase tracking-[0.3em] transition-colors">Terms of Service</Link>
              <span className="text-white/5 text-[10px]">/</span>
              <Link href="#" className="text-white/10 hover:text-white text-[9px] uppercase tracking-[0.3em] transition-colors">Cookie Settings</Link>
            </div>
          </div>
          <div className="flex items-center gap-4 opacity-20 grayscale brightness-200">
            {/* Payment Icons Placeholder - using small text labels as minimal indicators */}
            <span className="text-[8px] font-bold border border-white/50 px-2 py-1 rounded">VISA</span>
            <span className="text-[8px] font-bold border border-white/50 px-2 py-1 rounded">MASTERCARD</span>
            <span className="text-[8px] font-bold border border-white/50 px-2 py-1 rounded">APPLE PAY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
