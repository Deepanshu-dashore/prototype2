"use client";

import React from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import Link from 'next/link';

const categories = [
  {
    id: 1,
    title: 'Run',
    subtitle: 'Sit comfortably, feel at home!',
    image: 'https://images.unsplash.com/photo-1486218119243-13883505764c?q=80&w=2070&auto=format&fit=crop',
    link: '/products?category=running',
    theme: 'dark', // Dark card -> White button
    zIndexClass: 'z-10',
    marginClass: 'md:ml-0',
  },
  {
    id: 2,
    title: 'Gym',
    subtitle: 'Sit comfortably, feel at home!',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop',
    link: '/products?category=training',
    theme: 'dark', // Dark card -> White button
    zIndexClass: 'z-20',
    marginClass: 'md:-ml-14',
  },
  {
    id: 3,
    title: 'Pilates',
    subtitle: 'Sit comfortably, feel at home!',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop',
    link: '/products?category=essentials',
    theme: 'light', // Light card -> Dark plum button
    zIndexClass: 'z-30',
    marginClass: 'md:-ml-14',
  },
  {
    id: 4,
    title: 'Swimwear',
    subtitle: 'Sit comfortably, feel at home!',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=2070&auto=format&fit=crop',
    link: '/products?category=performance',
    theme: 'dark', // Dark card -> White button
    zIndexClass: 'z-40',
    marginClass: 'md:-ml-14',
  },
  {
    id: 5,
    title: 'Casual',
    subtitle: 'Sit comfortably, feel at home!',
    image: 'https://images.unsplash.com/photo-1483721310020-0a334fc37757?q=80&w=2070&auto=format&fit=crop',
    link: '/products?category=street-athletics',
    theme: 'dark', // Dark card -> White button
    zIndexClass: 'z-50',
    marginClass: 'md:-ml-14',
  },
];

const ShopBySport = () => {
  return (
    <section className="py-24 bg-[var(--color-background)] overflow-hidden">
      <div className="container">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight text-[var(--color-black)]">
            Shop by activity
          </h2>
          <p className="font-body text-base text-gray-500 max-w-lg mx-auto mt-4">
            Curated high-performance gear engineered for movement and style.
          </p>
        </div>

        {/* Sliding Accordion Grid */}
        <div className="flex flex-col md:flex-row w-full h-[1550px] md:h-[500px] gap-4 md:gap-0 overflow-visible relative">
          {categories.map((cat) => {
            const isLight = cat.theme === 'light';

            return (
              <Link
                key={cat.id}
                href={cat.link}
                className={`group relative w-full md:flex-1 md:hover:flex-[2.8] h-[290px] md:h-full rounded-[38px] md:rounded-[48px] overflow-hidden cursor-pointer shadow-lg transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${cat.zIndexClass} ${cat.marginClass}`}
              >
                {/* Background Image with slight overlay */}
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority
                  />
                  {/* Subtle soft overlay for better text contrast */}
                  {isLight ? (
                    <div className="absolute inset-0 bg-white/5 group-hover:bg-white/0 transition-colors duration-500" />
                  ) : (
                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors duration-500" />
                  )}
                </div>

                {/* Text Content overlay */}
                <div className="absolute top-10 left-10 right-10 z-20 flex flex-col items-start gap-1 max-w-[280px]">
                  <h3
                    className={`font-heading text-3xl md:text-4xl font-bold tracking-tight uppercase leading-none transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 ${
                      isLight ? 'text-[#382830]' : 'text-white'
                    }`}
                  >
                    {cat.title}
                  </h3>
                  <p
                    className={`font-body text-sm md:text-base leading-snug mt-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isLight ? 'text-[#5A454E]' : 'text-white/80'
                    }`}
                  >
                    {cat.subtitle}
                  </p>

                  {/* Micro-animated Reveal Button */}
                  <div className="mt-5 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] delay-75">
                    {isLight ? (
                      /* Light theme -> Dark Button */
                      <div className="bg-[#382830] text-white text-xs md:text-sm font-body font-bold rounded-full px-5 py-2.5 flex items-center gap-3 transition-all duration-300 hover:bg-[#20151a] hover:scale-105 active:scale-95 shadow-md">
                        <span>Shop now</span>
                        <span className="bg-white text-[#382830] w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                          <Icon icon="ph:arrow-up-right-bold" className="text-xs" />
                        </span>
                      </div>
                    ) : (
                      /* Dark theme -> White Button */
                      <div className="bg-white text-[#382830] text-xs md:text-sm font-body font-bold rounded-full px-5 py-2.5 flex items-center gap-3 transition-all duration-300 hover:bg-gray-100 hover:scale-105 active:scale-95 shadow-md">
                        <span>Shop now</span>
                        <span className="bg-[#382830] text-white w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                          <Icon icon="ph:arrow-up-right-bold" className="text-xs" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ShopBySport;
