"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const categories = [
  {
    id: 1,
    name: 'RUNNING',
    subtitle: 'Engineered for Speed',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070&auto=format&fit=crop',
    link: '/category/running'
  },
  {
    id: 2,
    name: 'TRAINING',
    subtitle: 'Built for Performance',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
    link: '/category/training'
  },
  {
    id: 3,
    name: 'ESSENTIALS',
    subtitle: 'Everyday Excellence',
    image: '/sportCatgory.png',
    link: '/category/essentials'
  },
  {
    id: 4,
    name: 'PERFORMANCE',
    subtitle: 'Push Your Limits',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop',
    link: '/category/performance'
  },
  {
    id: 5,
    name: 'STREET ATHLETICS',
    subtitle: 'Culture in Motion',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2020&auto=format&fit=crop',
    link: '/category/street-athletics'
  },
  {
    id: 6,
    name: 'NEW DROPS',
    subtitle: 'The Future of Sport',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop',
    link: '/category/new-drops'
  },
  {
    id: 7,
    name: 'OVERSIZED',
    subtitle: 'Comfort Redefined',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1974&auto=format&fit=crop',
    link: '/category/oversized'
  },
  {
    id: 8,
    name: 'FOOTWEAR',
    subtitle: 'Step Into Performance',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
    link: '/category/footwear'
  }
];

const CategoryGrid = () => {  
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const cardWidth = container.querySelector('.snap-start')?.clientWidth || 300;
    const gap = 32; // gap-8 is 32px
    const scrollAmount = direction === 'left' ? -(cardWidth + gap) : (cardWidth + gap);
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  useEffect(() => {
    const container = sliderRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cardWidth = container.querySelector('.snap-start')?.clientWidth || 300;
      const index = Math.round(container.scrollLeft / cardWidth);
      setActiveIndex(index);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className=" bg-[var(--color-background)] overflow-hidden max-[1024px]:py-[80px]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div className="headerLeft">
            {/* <span className="block font-body text-[0.875rem] font-bold text-[var(--color-primary-bright)] tracking-[0.15em] mb-3 uppercase">
              BEST CATEGORIES
            </span> */}
            <h2 className="heading-brand">
              FOR YOUR BRAND
            </h2>
            <p className="brand-desc">
              Curated high-performance gear engineered for movement and style.
            </p>
          </div>
          
          {/* Navigation Arrows */}
          <div className="flex gap-3">
            <button 
              onClick={() => scroll('left')}
              className="p-3 border border-black hover:bg-black text-black hover:text-white transition-all duration-300 cursor-pointer flex items-center justify-center group"
              aria-label="Previous categories"
            >
              <Icon icon="ph:arrow-left-bold" className="text-xl transition-transform duration-300 group-hover:-translate-x-1" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-3 border border-black hover:bg-black text-black hover:text-white transition-all duration-300 cursor-pointer flex items-center justify-center group"
              aria-label="Next categories"
            >
              <Icon icon="ph:arrow-right-bold" className="text-xl transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        <div ref={sliderRef} className="grid grid-flow-col auto-cols-[100%] md:auto-cols-[calc((100%-32px)/2)] lg:auto-cols-[calc((100%-64px)/3)] gap-8 overflow-x-auto snap-x snap-mandatory hide-scrollbar w-full">
          {categories.map((cat, index) => (
            <motion.div 
              key={cat.id} 
              className="relative bg-[var(--color-black)] overflow-hidden cursor-pointer aspect-[16/10] flex flex-col group snap-start"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="relative w-full h-full overflow-hidden">
                <Image 
                  src={cat.image} 
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-[1]" />
                <div className="absolute bottom-0 left-0 w-full p-10 z-[2] flex flex-col gap-2 max-[768px]:p-[30px]">
                  <span className="font-body text-[0.875rem] text-[var(--color-primary-light)] font-medium opacity-0 translate-y-[10px] transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                    {cat.subtitle}
                  </span>
                  <h3 className="font-heading text-[1.75rem] font-bold text-[var(--color-white)] tracking-[-0.02em] uppercase m-0">
                    {cat.name}
                  </h3>
                  <div className="flex items-center justify-between mt-4 opacity-80 transition-all duration-300 group-hover:opacity-100">
                    <span className="font-heading text-[0.875rem] font-bold text-[var(--color-white)] uppercase tracking-[0.05em] flex items-center gap-2">
                      Explore 
                      <Icon icon="ph:arrow-right-bold" className="transition-transform duration-300 group-hover:translate-x-[5px]" />
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[var(--color-primary-bright)] transition-[width] duration-500 ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:w-full" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Slider Indicators (Dots) */}
        <div className="flex justify-center gap-2 mt-8">
          {categories.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (!sliderRef.current) return;
                const container = sliderRef.current;
                const cardWidth = container.querySelector('.snap-start')?.clientWidth || 300;
                container.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeIndex ? 'bg-[#ec7700] w-4' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
