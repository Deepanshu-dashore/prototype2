"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";

export default function Footer() {
  const shopLinks = [
    { name: "Men's Sportswear", href: "#" },
    { name: "Women's Sportswear", href: "#" },
    { name: "Shoes", href: "#" },
    { name: "Accessories", href: "#" },
    { name: "New Arrivals", href: "#" },
  ];

  const supportLinks = [
    { name: "Contact Us", href: "#" },
    { name: "FAQs", href: "#" },
    { name: "Size Guide", href: "#" },
  ];

  const companyLinks = [
    { name: 'Our Story', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Sustainability', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Store Locator', href: '#' },
  ];

  const policyLinks = [
    { name: "Privacy Policy", href: "/document/privacy" },
    { name: "Refund & Exchange", href: "/document/refund-exchange" },
    { name: "Refund Policy", href: "/document/refund" },
    { name: "Shipping Policy", href: "/document/shipping" },
    { name: "Terms of Service", href: "/document/terms" },
    { name: "Search", href: "/products" },
  ];

  const socialLinks = [
    { icon: "basil:facebook-outline", href: "#" },
    { icon: "iconoir:instagram", href: "#" },
    { icon: "mynaui:twitter", href: "#" },
    { icon: "iconoir:youtube", href: "#" },
  ];

  const contactInfo = [
    { icon: "carbon:location", text: "123 Sport Street, New Delhi, India" },
    { icon: "carbon:phone", text: "+91 98765 43210" },
    { icon: "carbon:email", text: "support@disport.com" },
  ];

  return (
    <footer className="bg-[#f9f9f9] text-gray-700 border-t border-gray-200">
      <div className="max-w-[90dvw] mx-auto py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-12">
        
        {/* Logo & About */}
        <div className="space-y-6 lg:col-span-2 sm:col-span-2 md:col-span-3 lg:col-auto">
          <Link href="/" className="relative w-40 h-10 block">
            <Image 
              src="/DISPORT LOGOS/LOGO.webp" 
              alt="Disport Logo" 
              width={160}
              height={40}
              className="h-10 object-contain w-auto" 
            />
          </Link>
          <p className="text-sm leading-relaxed text-gray-500 font-medium">
            Your one-stop shop for premium sports gear, apparel, and accessories.
            We bring quality and performance to every athlete.
          </p>
          <div className="flex space-x-5">
            {socialLinks.map((social, idx) => (
              <Link key={idx} href={social.href} className="text-gray-400 hover:text-primary-bright transition-colors">
                <Icon icon={social.icon} width="22" height="22" />
              </Link>
            ))}
          </div>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="font-bold text-lg mb-6 text-gray-900">Shop</h3>
          <ul className="space-y-3">
            {shopLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="text-sm text-gray-600 hover:text-primary-bright transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="font-bold text-lg mb-6 text-gray-900">Support</h3>
          <ul className="space-y-3">
            {supportLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="text-sm text-gray-600 hover:text-primary-bright transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="font-bold text-lg mb-6 text-gray-900">Company</h3>
          <ul className="space-y-3">
            {companyLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="text-sm text-gray-600 hover:text-primary-bright transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Policy Links */}
        <div>
          <h3 className="font-bold text-lg mb-6 text-gray-900">Our Policies</h3>
          <ul className="space-y-3">
            {policyLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="text-sm text-gray-600 hover:text-primary-bright transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Get in Touch */}
        <div className="lg:col-span-1">
          <h3 className="font-bold text-lg mb-6 text-gray-900">Get in Touch</h3>
          <ul className="space-y-4">
            {contactInfo.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <Icon icon={item.icon} className="text-primary-bright mt-1 flex-shrink-0" width="20" height="20" />
                <span className="text-sm text-gray-600 leading-snug">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs text-gray-400 tracking-wider">
            © {new Date().getFullYear()} DISPORT. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
