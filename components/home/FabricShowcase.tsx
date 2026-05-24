"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import ShopNowButton from '../shared/ShopNowButton';

interface Slide {
  id: number;
  title: string;
  description: string;
  image: string;
  hotspot: {
    top: string;
    left: string;
  };
}

const slides: Slide[] = [
  {
    id: 0,
    title: "Ultra-Lightweight Feel",
    description: "Crafted from high-quality, performance-driven materials, this fabric delivers the perfect balance of softness, durability, and stretch. It feels smooth and weightless during active sprints.",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070&auto=format&fit=crop", // Sleeve Close-Up
    hotspot: { top: "18%", left: "29%" }
  },
  {
    id: 1,
    title: "4-Way Dynamic Stretch",
    description: "Designed to expand in all four directions. Experience unrestricted range of motion during deep squats, high jumps, or explosive athletic sprints without losing structural shape.",
    image: "https://images.unsplash.com/photo-1502224562085-639556652f33?q=80&w=2070&auto=format&fit=crop", // Legs / Pants Close-Up
    hotspot: { top: "45%", left: "22%" }
  },
  {
    id: 2,
    title: "Premium Performance Fabric",
    description: "Crafted from high-quality, performance-driven materials, this fabric delivers the perfect balance of softness, durability, and stretch. It feels smooth, wicks sweat, and regulates body heat.",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop", // Crop Top Close-Up
    hotspot: { top: "26%", left: "69%" }
  }
];

const FabricShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(2); // Start with active index 2 matching the visual crop top
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [hoveredArrow, setHoveredArrow] = useState<'prev' | 'next' | null>(null);

  const prevIndex = (activeIndex - 1 + slides.length) % slides.length;
  const nextIndex = (activeIndex + 1) % slides.length;

  const handlePrev = () => {
    setActiveIndex(prevIndex);
    setIsDrawerOpen(true);
  };

  const handleNext = () => {
    setActiveIndex(nextIndex);
    setIsDrawerOpen(true);
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight text-[var(--color-black)] mb-3">
            Engineered Detail
          </h2>
          <p className="font-body text-base text-gray-500 max-w-lg mx-auto">
            Discover performance gear designed to move with you
          </p>
        </div>

        {/* Hotspots Showcase Container */}
        <div className="relative w-full h-[95vh] min-h-[650px] md:min-h-[780px] rounded-[40px] overflow-hidden shadow-xl bg-gray-100">
          
          {/* Main Visual Base Image - Blurs and dims dynamically when drawer is open */}
          <div className={`absolute inset-0 w-full h-full z-0 transition-all duration-700 ${
            isDrawerOpen ? 'blur-lg scale-[1.04] brightness-[0.65]' : 'blur-0 scale-100 brightness-[0.88]'
          }`}>
            <Image
              src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop"
              alt="Athletes performing exercises highlighting premium fabrics"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Interactive Centered Heading Overlay - Fades/scales down when drawer is open to direct attention */}
          <div className={`absolute bottom-16 left-1/2 -translate-x-1/2 z-10 text-center w-full max-w-[800px] px-4 flex flex-col items-center gap-4 transition-all duration-500 ${
            isDrawerOpen ? 'opacity-25 pointer-events-none scale-95' : 'opacity-100 pointer-events-auto scale-100'
          }`}>
            <h3 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-[0.95] text-white">
              <span className="block">Push limits.</span>
              <span className="text-transparent bg-clip-text bg-linear-to-b from-white via-[#C9B6FF]/50 to-white/20 block mt-1">Break boundaries.</span>
            </h3>
            <p className="font-body text-sm md:text-base text-gray-200/90 font-light max-w-[500px]">
              Discover performance gear designed to move with you
            </p>
            <ShopNowButton href="/products" variant="white" />
          </div>

          {/* Pulsing Hotspots Layer - Button gets explicit layout sizes (w-8 h-8) for absolute click targets */}
          {slides.map((slide) => {
            const isActive = slide.id === activeIndex;

            return (
              <button
                key={slide.id}
                onClick={() => {
                  setActiveIndex(slide.id);
                  setIsDrawerOpen(true);
                }}
                style={{ top: slide.hotspot.top, left: slide.hotspot.left }}
                className="absolute z-20 w-8 h-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none group/hotspot flex items-center justify-center"
                aria-label={`View ${slide.title} details`}
              >
                {/* Outer Breathing Animation Ring */}
                <span className={`absolute -inset-4 rounded-full border-2 transition-all duration-500 ${
                  isActive 
                    ? 'border-[#ec7700] animate-pulse scale-110' 
                    : 'border-white/40 animate-ping group-hover/hotspot:border-white/70'
                }`} />

                {/* Inner solid border ring */}
                <span className={`relative w-8 h-8 rounded-full flex items-center justify-center border-2 bg-black/30 backdrop-blur-xs transition-colors duration-500 ${
                  isActive ? 'border-[#ec7700]' : 'border-white'
                }`}>
                  {/* Purple/Orange Core Bullet */}
                  <span className={`w-3.5 h-3.5 rounded-full transition-transform duration-500 ${
                    isActive ? 'bg-[#ec7700] scale-110' : 'bg-indigo-600 group-hover/hotspot:scale-125'
                  }`} />
                </span>
              </button>
            );
          })}

          {/* Floating Details Drawer (Hardware-Accelerated Pure CSS Slide-in / Elegant Floating Overlay) */}
          <div
            className={`absolute z-30 flex flex-col justify-between bg-[#2E2C2C] text-white shadow-2xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] top-0 md:top-[4%] bottom-0 md:bottom-[4%] right-0 md:right-8 w-full md:w-[410px] rounded-none md:rounded-[32px] ${
              isDrawerOpen 
                ? 'translate-x-0 opacity-100 pointer-events-auto' 
                : 'translate-x-[110%] opacity-0 pointer-events-none'
            }`}
          >
            {/* Top Section - Close button & Fabric photo */}
            <div className="relative">
              {/* Close button - Styled as solid white circle with dark icon */}
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="absolute top-6 right-6 z-40 bg-white hover:bg-gray-100 active:scale-95 text-[#382830] w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg"
                aria-label="Close fabric drawer"
              >
                <Icon icon="ph:x-bold" className="text-sm" />
              </button>

              {/* Fabric detail image */}
              <div className="relative w-full h-[240px] md:h-[260px] overflow-hidden shadow-md">
                <Image
                  src={slides[activeIndex].image}
                  alt={slides[activeIndex].title}
                  fill
                  className="object-cover animate-fade-in"
                  sizes="(max-width: 768px) 100vw, 410px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2E2C2C] via-transparent to-transparent z-10" />
              </div>
            </div>

            {/* Middle Section - Fabric Technical Descriptions */}
            <div className="flex-grow px-8 py-6 md:px-10 flex flex-col justify-start">
              <h4 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-tight leading-tight text-white mb-3">
                {slides[activeIndex].title}
              </h4>
              <p className="font-body text-sm text-gray-300 leading-relaxed font-light">
                {slides[activeIndex].description}
              </p>
            </div>

            {/* Bottom Section - Micro-interactive sliding line arrows */}
            <div className="px-8 py-8 md:px-10 md:py-10 bg-[#282626] relative border-t border-white/5 flex flex-col justify-end min-h-[140px]">
              
              {/* Line Container */}
              <div className="relative flex items-center justify-between h-12 w-full">
                {/* Previous Button */}
                <button
                  onClick={handlePrev}
                  onMouseEnter={() => setHoveredArrow('prev')}
                  onMouseLeave={() => setHoveredArrow(null)}
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#2E2C2C] active:scale-95 transition-all duration-300 cursor-pointer z-10 group"
                  aria-label="Previous detail"
                >
                  <Icon icon="ph:arrow-left-bold" className="text-base transition-transform duration-300 group-hover:-translate-x-0.5" />
                </button>

                {/* Baseline connecting the arrows */}
                <div className="absolute left-12 right-12 h-[1px] bg-white/10 z-0 pointer-events-none" />

                {/* Active Highlight Line: left-growing or right-growing (CSS-driven scale/origin) */}
                <div className="absolute left-12 right-12 h-[1px] z-0 pointer-events-none overflow-hidden flex">
                  <div
                    className={`h-full bg-white/60 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      hoveredArrow === 'prev' 
                        ? 'w-full origin-left scale-x-100' 
                        : hoveredArrow === 'next' 
                          ? 'w-full origin-right scale-x-100 ml-auto' 
                          : 'w-0 scale-x-0 mx-auto'
                    }`}
                  />
                </div>

                {/* Floating Title Reveal above the stretching line */}
                <div className="absolute left-14 right-14 -top-8 flex justify-center pointer-events-none overflow-hidden h-7">
                  <span
                    className={`absolute font-heading text-xs font-bold uppercase tracking-widest text-white/90 truncate max-w-full text-center transition-all duration-300 transform ${
                      hoveredArrow === 'prev'
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-2 opacity-0'
                    }`}
                  >
                    {slides[prevIndex].title}
                  </span>
                  <span
                    className={`absolute font-heading text-xs font-bold uppercase tracking-widest text-white/90 truncate max-w-full text-center transition-all duration-300 transform ${
                      hoveredArrow === 'next'
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-2 opacity-0'
                    }`}
                  >
                    {slides[nextIndex].title}
                  </span>
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  onMouseEnter={() => setHoveredArrow('next')}
                  onMouseLeave={() => setHoveredArrow(null)}
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#2E2C2C] active:scale-95 transition-all duration-300 cursor-pointer z-10 group"
                  aria-label="Next detail"
                >
                  <Icon icon="ph:arrow-right-bold" className="text-base transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Quick-Reopen Fabric Indicator (CSS-driven Scale & Opacity) */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className={`absolute right-8 top-8 z-20 bg-white text-[#382830] font-body text-xs md:text-sm font-bold rounded-full px-5 py-2.5 flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all duration-500 cursor-pointer border border-gray-100 ${
              !isDrawerOpen 
                ? 'scale-100 opacity-100 pointer-events-auto' 
                : 'scale-90 opacity-0 pointer-events-none'
            }`}
          >
            <Icon icon="ph:info-bold" className="text-base" />
            <span>Show Fabric Details</span>
          </button>

        </div>
      </div>
    </section>
  );
};

export default FabricShowcase;
