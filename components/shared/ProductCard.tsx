"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Plus, Star } from 'lucide-react';

export interface Product {
  id: number | string;
  name: string;
  category: string;
  price: string;
  image: string;
  imageAlt: string;
  hoverImage?: string;
  rating: number;
  isNew?: boolean;
  discount?: string;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      href={`/product/${product.id}`}
      className={`group flex flex-col cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container - Technical Minimalism */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-soft mb-5 group-hover:shadow-xl transition-all duration-500">
        <Image
          src={(isHovered && product.hoverImage) ? product.hoverImage : product.image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-black text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
              New
            </span>
          )}
          {product.discount && (
            <span className="bg-primary-bright text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
              {product.discount}
            </span>
          )}
        </div>
        
        {/* Wishlist Button - Refined Iconography */}
        <button 
          className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 backdrop-blur-md rounded-full text-black hover:bg-black hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Handle Wishlist
          }}
        >
          <Heart size={16} />
        </button>

        {/* Quick Add Overlay - High-Performance Interaction */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="absolute bottom-0 left-0 right-0 p-4 bg-white/10 backdrop-blur-sm z-10"
            >
              <button 
                className="w-full bg-primary-bright text-white font-bold uppercase py-3.5 flex items-center justify-center space-x-2 hover:bg-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Handle Quick Add
                }}
              >
                <Plus size={18} />
                <span className="text-xs tracking-[0.15em]">Quick Add</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Details - Editorial Spacing */}
      <div className="flex flex-col text-left px-1">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary/60">
            {product.category}
          </span>
          <div className="flex items-center space-x-1 opacity-60">
            <Star size={10} className="fill-black text-black" />
            <span className="text-[10px] font-bold tracking-tighter">{product.rating}</span>
          </div>
        </div>
        
        <h3 className="text-black font-bold text-sm md:text-base uppercase tracking-tight mb-2 group-hover:text-primary-bright transition-colors line-clamp-1">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-3">
          <span className="text-black font-bold text-lg md:text-xl tracking-tighter">
            {product.price}
          </span>
          {product.discount && (
            <span className="text-text-secondary/40 line-through text-sm font-medium">
              $99.00
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
