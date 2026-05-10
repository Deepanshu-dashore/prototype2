"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface CategoryProps {
  title: string;
  image: string;
  link: string;
  className?: string;
}

const CategoryCard = ({ title, image, link, className }: CategoryProps) => {
  return (
    <Link href={link} className={`group relative overflow-hidden rounded-lg block h-[450px] ${className}`}>
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
      <div className="absolute bottom-0 left-0 p-8 w-full">
        <h3 className="text-white text-3xl font-bold uppercase tracking-tighter mb-2 transform group-hover:-translate-y-2 transition-transform duration-500">
          {title}
        </h3>
        <span className="text-primary-bright font-bold uppercase tracking-widest text-xs opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 inline-block">
          Explore Now →
        </span>
      </div>
    </Link>
  );
};

const CategorySection = () => {
  const categories = [
    { title: 'Running', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=2070&auto=format&fit=crop', link: '#', size: 'col-span-12 md:col-span-8' },
    { title: 'Training', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop', link: '#', size: 'col-span-12 md:col-span-4' },
    { title: 'Sneakers', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop', link: '#', size: 'col-span-12 md:col-span-4' },
    { title: 'Gymwear', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop', link: '#', size: 'col-span-12 md:col-span-8' },
  ];

  return (
    <section className="bg-surface"> 
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <span className="text-primary-bright font-bold uppercase tracking-widest text-sm mb-2 block">Categories</span>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter">Choose Your Field</h2>
          </div>
          <p className="max-w-md text-text-secondary font-light">
            Engineered equipment for every discipline. Whether you're hitting the track or the weight room, we have you covered.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {categories.map((cat, index) => (
            <div key={cat.title} className={cat.size}>
              <CategoryCard {...cat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
