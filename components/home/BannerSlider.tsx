"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=2070&auto=format&fit=crop",
    title: "Spring '26 Bottomwear",
    description: "Discover the ultimate comfort and style for the new season.",
    ctaText: "Shop Now",
    ctaLink: "#",
    brush: true
  },
  { 
    id: 2,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2070&auto=format&fit=crop",
    title: "SUMMER ESSENTIALS",
    description: "Lightweight gear engineered for high-temperature performance.",
    ctaText: "Shop Now",
    ctaLink: "#"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2071&auto=format&fit=crop",
    title: "ELITE PERFORMANCE GEAR",
    description: "Pro-level equipment designed to push your limits.",
    ctaText: "Shop Now",
    ctaLink: "#"
  }
];

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Auto-play
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden bg-surface-soft">
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slides[current].image}
            alt={slides[current].title}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-black/10" />
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-8 md:p-12 pb-20">
        {/* Title */}
        <motion.h2 
          key={`title-${current}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`text-white mb-2 ${
            slides[current].brush 
              ? 'font-comforter text-5xl md:text-7xl font-normal' 
              : 'text-3xl md:text-5xl font-bold uppercase tracking-[0.15em] font-public'
          }`}
        >
          {slides[current].title}
        </motion.h2>

        {/* Description */}
        <motion.p
          key={`desc-${current}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-white/80 text-sm md:text-base font-public mb-6 max-w-2xl"
        >
          {slides[current].description}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          key={`cta-${current}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <a 
            href={slides[current].ctaLink}
            className="inline-block bg-primary-bright text-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-primary transition-colors rounded-sm font-public"
          >
            {slides[current].ctaText}
          </a>
        </motion.div>
      </div>

      {/* Indicators - Bottom Center */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === current ? 'bg-white w-4' : 'bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/20 backdrop-blur-sm text-white hover:bg-black/50 transition-colors rounded-full"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/20 backdrop-blur-sm text-white hover:bg-black/50 transition-colors rounded-full"
      >
        <ChevronRight size={24} />
      </button>
    </section>
  );
}
