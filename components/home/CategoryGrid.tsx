"use client";

import React from 'react';
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
  return (
    <section className="pb-[120px] bg-[var(--color-background)] overflow-hidden max-[1024px]:py-[80px]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-[64px]">
          <div className="headerLeft">
            <span className="block font-body text-[0.875rem] font-bold text-[var(--color-primary-bright)] tracking-[0.15em] mb-3 uppercase">
              BEST CATEGORIES
            </span>
            <h2 className="font-heading text-[3.5rem] font-bold text-[var(--color-black)] tracking-[-0.04em] uppercase leading-[0.9] max-[1200px]:text-[2.75rem] max-[768px]:text-[2.25rem]">
              FOR YOUR BRAND
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 w-full max-[1024px]:grid-cols-2 max-[768px]:grid-cols-1 max-[768px]:gap-5">
          {categories.map((cat, index) => (
            <motion.div 
              key={cat.id} 
              className="relative bg-[var(--color-black)] overflow-hidden cursor-pointer aspect-[16/10] flex flex-col group"
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
      </div>
    </section>
  );
};

export default CategoryGrid;
