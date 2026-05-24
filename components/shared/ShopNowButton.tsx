"use client";

import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

interface ShopNowButtonProps {
  href: string;
  variant?: 'white' | 'dark' | 'orange';
  label?: string;
  className?: string;
}

const ShopNowButton = ({
  href,
  variant = 'white',
  label = 'Shop now',
  className = '',
}: ShopNowButtonProps) => {
  const isWhite = variant === 'white';
  const isOrange = variant === 'orange';

  // Base layout styles
  const baseClass = "group inline-flex items-center gap-3 font-body font-bold text-xs md:text-sm rounded-full px-6 py-3 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md";

  // Strict theme color classes to bypass global CSS anchor color inheritances
  let themeClass = '';
  let circleClass = '';

  if (variant === 'white') {
    themeClass = "bg-white !text-[#382830] hover:bg-gray-50";
    circleClass = "bg-[#382830] !text-white";
  } else if (variant === 'dark') {
    themeClass = "bg-[#382830] !text-white hover:bg-[#25191E]";
    circleClass = "bg-white !text-[#382830]";
  } else if (variant === 'orange') {
    themeClass = "bg-[#ec7700] !text-white hover:bg-[#d56a00]";
    circleClass = "bg-white !text-[#ec7700]";
  }

  return (
    <Link
      href={href}
      className={`${baseClass} ${themeClass} ${className}`}
    >
      {/* Explicitly colored span to block parent color inheritances */}
      <span className="leading-none transition-colors duration-300">
        {label}
      </span>
      <span className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-45 ${circleClass}`}>
        <Icon icon="ph:arrow-up-right-bold" className="text-xs" />
      </span>
    </Link>
  );
};

export default ShopNowButton;
