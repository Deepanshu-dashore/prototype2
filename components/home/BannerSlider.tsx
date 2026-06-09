"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: "/banner slider/banner.png",
    title: "BUILT FOR TEAMS.\nDESIGNED TO WIN.",
    description: "Custom Jerseys. Your Design.\nYour Identity. We Make It Happen.",
    ctaText: "CUSTOMIZE NOW",
    ctaLink: "/products?category=jerseys",
    align: "left"
  },
  {
    id: 2,
    image: "/spring_bottomwear_banner.png",
    title: "SPRING '26\nBOTTOMWEAR.",
    description: "Engineered joggers, track pants & shorts.\nUnrestricted range of motion.",
    ctaText: "SHOP BOTTOMS",
    ctaLink: "/products?category=pants",
    align: "left"
  },
  { 
    id: 3,
    image: "/summer_essentials_banner.png",
    title: "AERO-DRY\nSUMMER GEAR.",
    description: "Vapor-ventilated training tees & singlets.\nEngineered for high-temp execution.",
    ctaText: "SHOP SUMMER",
    ctaLink: "/products",
    align: "left"
  },
  {
    id: 4,
    image: "/elite_performance_banner.png",
    title: "ELITE\nCOMPRESSION.",
    description: "Pro-level wraps, technical shells & hoodies.\nRegulate heat. Retain strength.",
    ctaText: "SHOP ELITE",
    ctaLink: "/products",
    align: "left"
  }
];

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const safeCurrent = current >= 0 && current < slides.length ? current : 0;

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
    <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden bg-zinc-950 border-y border-white/5">
      <AnimatePresence initial={false}>
        <motion.div
          key={safeCurrent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slides[safeCurrent].image}
            alt={slides[safeCurrent].title}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          {/* Background Overlay */}
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className={`absolute inset-0 flex flex-col justify-center p-8 md:p-16 pb-24 container mx-auto ${
        slides[safeCurrent].align === 'left' 
          ? 'items-start text-left md:pl-20' 
          : 'items-center text-center'
      }`}>
        {/* Title */}
        <motion.h2 
          key={`title-${safeCurrent}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white mb-3 leading-tight text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-[0.05em] font-heading"
        >
          {slides[safeCurrent].title.split('\n').map((line, idx) => (
            <span key={idx} className="block">{line}</span>
          ))}
        </motion.h2>

        {/* Description */}
        <motion.p
          key={`desc-${safeCurrent}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`text-white/80 text-sm md:text-base font-body mb-8 ${
            slides[safeCurrent].align === 'left' ? 'max-w-md leading-relaxed' : 'max-w-2xl mx-auto'
          }`}
        >
          {slides[safeCurrent].description.split('\n').map((line, idx) => (
            <span key={idx} className="block">{line}</span>
          ))}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          key={`cta-${safeCurrent}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a 
            href={slides[safeCurrent].ctaLink}
            className="group inline-flex items-center gap-3 bg-[#ec7700] hover:bg-orange-600 text-white px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-none font-body shadow-lg hover:shadow-orange-500/10 cursor-pointer"
          >
            <span>{slides[safeCurrent].ctaText}</span>
            <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
          </a>
        </motion.div>
      </div>

      {/* Indicators - Bottom Center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === safeCurrent ? 'bg-[#ec7700] w-6' : 'bg-white/40 w-1.5 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/40 hover:bg-white hover:text-black text-white flex items-center justify-center backdrop-blur-xs transition-all duration-300 cursor-pointer border border-white/10 group active:scale-95"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-0.5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/40 hover:bg-white hover:text-black text-white flex items-center justify-center backdrop-blur-xs transition-all duration-300 cursor-pointer border border-white/10 group active:scale-95"
        aria-label="Next slide"
      >
        <ChevronRight size={20} className="transition-transform group-hover:translate-x-0.5" />
      </button>
    </section>
  );
}
