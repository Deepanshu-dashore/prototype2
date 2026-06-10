"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useGetApi } from '@/hooks/useApi';
import API_ENDPOINTS from '@/app/constants/apiConfig';

const fallbackCategories = [
  {
    id: 'fallback-1',
    name: 'ACTIVEWEAR',
    image: 'https://images.unsplash.com/photo-1581622558663-b2e33377dfb2?q=80&w=1974&auto=format&fit=crop',
    link: '/products?category=activewear'
  },
  {
    id: 'fallback-2',
    name: 'SPORTSWEAR',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1974&auto=format&fit=crop',
    link: '/products?category=sportswear'
  },
  {
    id: 'fallback-3',
    name: 'TEAM JERSEYS',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070&auto=format&fit=crop',
    link: '/products?category=jerseys'
  },
  {
    id: 'fallback-4',
    name: 'SHORTS',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=2070&auto=format&fit=crop',
    link: '/products?category=shorts'
  },
  {
    id: 'fallback-5',
    name: 'TRACK PANTS',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop',
    link: '/products?category=trackpants'
  },
  {
    id: 'fallback-6',
    name: 'PREMIUM TEES',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1974&auto=format&fit=crop',
    link: '/products?category=tees'
  }
];

const resolveImageUrl = (imgUrl: string) => {
  if (!imgUrl) return "https://images.unsplash.com/photo-1581622558663-b2e33377dfb2?q=80&w=1974&auto=format&fit=crop";
  if (imgUrl.startsWith("http://") || imgUrl.startsWith("https://") || imgUrl.startsWith("/")) {
    return imgUrl;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2500";
  return `${baseUrl}/uploads/${imgUrl}`;
};

const CategorySkeleton = ({ width }: { width: number }) => (
  <div 
    style={{ width: `${width}px`, flexShrink: 0 }}
    className="relative bg-gray-200 overflow-hidden aspect-[3/4] rounded-[12px] md:rounded-[16px] shadow-lg animate-pulse"
  >
    <div className="absolute inset-0 bg-gray-300" />
    <div className="absolute bottom-0 left-0 w-full p-5 py-3 flex flex-col gap-2 z-[2]">
      <div className="h-5 w-3/4 bg-gray-400 rounded-sm" />
      <div className="h-3 w-1/3 bg-gray-400 rounded-sm" />
    </div>
  </div>
);

const CategoryGrid = () => {  
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [containerWidth, setContainerWidth] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: categoryResponse, isLoading, error } = useGetApi<{ data: any[] }>({
    key: "categories",
    url: API_ENDPOINTS.CATEGORY.GET_ALL,
    requireAuth: false,
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 768) {
        setCardsPerView(2);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(3);
      } else {
        setCardsPerView(5);
      }
      
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Slight delay to ensure DOM is fully laid out
    const timeout = setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, []);

  const apiCategories = categoryResponse?.data || [];
  const categoriesToShow = !error && apiCategories.length > 0
    ? apiCategories.map((cat: any) => ({
        id: cat._id || cat.id,
        name: cat.name ? cat.name.toUpperCase() : 'CATEGORY',
        image: resolveImageUrl(cat.image),
        link: `/products?category=${cat._id || cat.id}`
      }))
    : fallbackCategories;

  const gap = 24; // gap-6 spacing (24px)
  const maxIndex = Math.max(0, categoriesToShow.length - cardsPerView);
  
  // Calculate exact card width based on active container width
  const cardWidth = containerWidth > 0 
    ? (containerWidth - (cardsPerView - 1) * gap) / cardsPerView 
    : 300;
  
  const slideAmount = cardWidth + gap;

  const scroll = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else {
      setActiveIndex((prev) => Math.min(prev + 1, maxIndex));
    }
  };

  return (
    <section className="py-24 bg-[var(--color-background)] overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h2 className="heading-brand mx-auto">
            FOR YOUR BRAND
          </h2>
          <p className="brand-desc mx-auto mt-3">
            Curated high-performance gear engineered for movement and style.
          </p>
        </div>

        {/* Slider Frame */}
        <div className="relative w-full overflow-visible group/slider" ref={containerRef}>
          {/* Left Arrow Button Overlay */}
          {!isLoading && activeIndex > 0 && (
            <button 
              onClick={() => scroll('left')}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-xs transition-all duration-300 cursor-pointer shadow-xl hover:scale-110 active:scale-95 border-none"
              aria-label="Previous slide"
            >
              <Icon icon="ph:arrow-left-bold" className="text-lg" />
            </button>
          )}

          {/* Right Arrow Button Overlay */}
          {!isLoading && activeIndex < maxIndex && (
            <button 
              onClick={() => scroll('right')}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-xs transition-all duration-300 cursor-pointer shadow-xl hover:scale-110 active:scale-95 border-none"
              aria-label="Next slide"
            >
              <Icon icon="ph:arrow-right-bold" className="text-lg" />
            </button>
          )}

          {/* Slider Outer Window */}
          <div className="w-full overflow-hidden">
            {isLoading ? (
              <div className="flex gap-6">
                {[...Array(cardsPerView + 1)].map((_, i) => (
                  <CategorySkeleton key={i} width={cardWidth} />
                ))}
              </div>
            ) : (
              <motion.div 
                className="flex gap-6"
                animate={{ x: -activeIndex * slideAmount }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
              >
                {categoriesToShow.map((cat, index) => (
                  <Link
                    key={cat.id}
                    href={cat.link}
                    style={{ width: `${cardWidth}px`, flexShrink: 0 }}
                    className="relative bg-[var(--color-black)] overflow-hidden cursor-pointer aspect-[3/4] flex flex-col group rounded-[12px] md:rounded-[16px] shadow-lg"
                  >
                    <div className="relative w-full h-full overflow-hidden">
                      <Image 
                        src={cat.image} 
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:scale-[1.05]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={index < 3}
                      />
                      
                      {/* Subtle initial linear for baseline readability */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-[1] transition-opacity duration-500 group-hover:opacity-0" />
                      
                      {/* Stronger hover linear that fades in to make the white pill button pop */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent z-[1] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Overlay Text Content */}
                      <div className="absolute bottom-0 left-0 w-full p-5 py-3 z-[2] flex flex-col items-start gap-1">
                        {/* Title (shifts up slightly on hover) */}
                        <h3 className="font-heading text-[1.3rem] md:text-[1.4rem] font-extrabold text-white tracking-tight uppercase leading-none m-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2">
                          {cat.name}
                        </h3>
                        {/* Shop Now link (slides up and fades in on hover, invisible initially) */}
                        <span className="font-heading text-[0.75rem] font-bold text-white uppercase tracking-wider opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center gap-1.5">
                          SHOP NOW →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Slider Indicators (Dots) */}
        {!isLoading && maxIndex > 0 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer border-none ${
                  idx === activeIndex ? 'bg-[#ec7700] w-5' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryGrid;
