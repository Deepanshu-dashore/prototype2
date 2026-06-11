"use client";

import React from 'react';
import Image from 'next/image';
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
  // Use Cloudinary base path for relative category images
  return `https://res.cloudinary.com/dqubhicgn/image/upload/v1779562735/${imgUrl}`;
};

const CategorySkeleton = () => (
  <div 
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
  const { data: categoryResponse, isLoading, error } = useGetApi<{ data: any[] }>({
    key: "categories",
    url: API_ENDPOINTS.CATEGORY.GET_ALL,
    requireAuth: false,
  });

  const apiCategories = categoryResponse?.data || [];
  let categoriesToShow = !error && apiCategories.length > 0
    ? apiCategories.map((cat: any) => ({
        id: cat._id || cat.id,
        name: cat.name ? cat.name.toUpperCase() : 'CATEGORY',
        image: resolveImageUrl(cat.image),
        link: `/products?category=${cat._id || cat.id}`
      }))
    : fallbackCategories;

  // Pad with fallback categories if we have fewer than 6
  if (categoriesToShow.length < 6) {
    const extraNeeded = 6 - categoriesToShow.length;
    const existingNames = new Set(categoriesToShow.map(c => c.name.toUpperCase()));
    const paddings = fallbackCategories.filter(f => !existingNames.has(f.name.toUpperCase())).slice(0, extraNeeded);
    categoriesToShow = [...categoriesToShow, ...paddings];
  }

  const slicedCategories = categoriesToShow.slice(0, 6);

  return (
    <section className="py-24 bg-[var(--color-background)]">
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

        {/* Grid Layout */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {slicedCategories.map((cat, index) => (
              <Link
                key={cat.id}
                href={cat.link}
                className="relative bg-[var(--color-black)] overflow-hidden cursor-pointer aspect-[3/4] flex flex-col group rounded-[12px] md:rounded-[16px] shadow-lg"
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Image 
                    src={cat.image} 
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:scale-[1.05]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                    priority={index < 3}
                  />
                  
                  {/* Background overlay gradient for contrast and readability */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent z-[1]" />
                  
                  {/* Overlay Text Content */}
                  <div className="absolute bottom-0 left-0 w-full p-5 py-4 z-[2] flex flex-col items-start gap-1">
                    {/* Title */}
                    <h3 className="font-heading text-[1.1rem] sm:text-[1.3rem] md:text-[1.4rem] font-extrabold text-white tracking-tight uppercase leading-none m-0">
                      {cat.name}
                    </h3>
                    {/* Shop Now link (always visible) */}
                    <span className="font-heading text-[0.7rem] sm:text-[0.75rem] font-bold text-[#ec7700] uppercase tracking-wider flex items-center gap-1.5 mt-1 transition-all duration-300">
                      SHOP NOW 
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 duration-300"
                      >
                        <g fill="none">
                          <path fill="currentColor" d="M4 11.25a.75.75 0 0 0 0 1.5zm0 1.5h16v-1.5H4z" opacity={0.5} />
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m14 6l6 6l-6 6" />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryGrid;


// export default CategoryGrid;
