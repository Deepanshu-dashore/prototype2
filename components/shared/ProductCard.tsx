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

        {/* Badges — flat sharp rectangles, stacked top-0 left-0 */}
        <div className="absolute top-0 left-0 z-10 flex flex-col">
          {product.isNew && (
            <span className="bg-[#964900] text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider">
              Just In
            </span>
          )}
          {product.discount && (
            <span className="bg-[#ba1a1a] text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider">
              {product.discount} Off
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

      {/* Product Details */}
      <div className="flex flex-col pt-4 pb-2 px-1 gap-0.5">
        <div className="flex justify-between items-start">
          <div className="flex flex-col flex-1 min-w-0">
            <h3 className="text-[15px] md:text-[16px] font-bold text-black uppercase tracking-tight leading-tight line-clamp-1 group-hover:text-primary-bright transition-colors font-heading">
              {product.name}
            </h3>
            <p className="text-[13px] md:text-[14px] text-gray-500 font-medium">
              {product.category}
            </p>
          </div>
          <div className="text-right ml-2">
            <span className="text-[15px] md:text-[16px] font-bold text-black tracking-tight">
              {product.price}
            </span>
          </div>
        </div>

        {/* Color Variants & Rating */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-black border border-gray-200" />
              <div className="w-3 h-3 rounded-full bg-gray-300 border border-gray-200" />
            </div>
            <span className="text-[11px] text-gray-400 font-bold uppercase ml-1 tracking-tighter">
              +3 Colors
            </span>
          </div>
          <div className="flex items-center space-x-1 opacity-60">
            <Star size={10} className="fill-black text-black" />
            <span className="text-[10px] font-bold tracking-tighter">{product.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
