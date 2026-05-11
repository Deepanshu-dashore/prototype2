"use client";

import React from "react";
import Link from "next/link";

export default function HelpingHeader() {
  return (
    <div className="w-full bg-[#F5F5F5] border-b border-gray-100 py-2.5 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto flex justify-end items-center gap-4">
        <Link 
          href="/help" 
          className="text-[11px] font-bold text-gray-500 hover:text-black transition-colors"
        >
          Help
        </Link>
        <span className="text-gray-300 text-[10px]">|</span>
        <Link 
          href="/register" 
          className="text-[11px] font-bold text-gray-500 hover:text-black transition-colors"
        >
          Join Us
        </Link>
        <span className="text-gray-300 text-[10px]">|</span>
        <Link 
          href="/login" 
          className="text-[11px] font-bold text-gray-500 hover:text-black transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
