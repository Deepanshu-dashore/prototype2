"use client";

import React from "react";
import Link from "next/link";
import { Tag } from "lucide-react";

export default function HelpingHeader() {
  return (
    <div className="w-full bg-[#efeded] border-b border-gray-100 py-2 px-6 sm:px-12">
      <div className="max-w-[90dvw] mx-auto flex justify-between items-center gap-4">
        {/* Left Side: Promo Content */}
        <div className="hidden md:flex items-center gap-2">
          <Tag size={12} className="text-gray-500" />
          <p className="text-xs font-medium text-gray-600">
            Get <span className="text-primary-bright font-bold">30%</span> off on selected items <span className="mx-1 text-gray-300">|</span> Free shipping on orders over <span className="text-primary-bright font-bold">$99</span>
          </p>
        </div>

        {/* Right Side: Links */}
        <div className="flex items-center gap-4 ml-auto sm:ml-0">
          <Link 
            href="/help" 
            className="text-[11px] font-medium text-gray-500 hover:text-black transition-colors"
          >
            Support
          </Link>
          <span className="text-gray-300 text-[12px]">|</span>
          <Link 
            href="/register" 
            className="text-[11px] font-medium text-gray-500 hover:text-black transition-colors"
          >
            Join Us
          </Link>
          <span className="text-gray-300 text-[12px]">|</span>
          <Link 
            href="/login" 
            className="text-[11px] font-medium text-gray-500 hover:text-black transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
