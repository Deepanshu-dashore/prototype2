"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Plus, Star } from 'lucide-react';
import QuickViewModal from './QuickViewModal';

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
  badge?: string;
}

interface ProductCardProps {
  product: Product;
  className?: string;
  showRating?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = "", showRating = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  return (
    <>
      <Link 
        href={`/product/${product.id}`}
        className={`group flex flex-col cursor-pointer font-public ${className}`}
      >
      {/* Image Container - Technical Minimalism */}
      <div 
        className="relative aspect-3/4 w-full overflow-hidden bg-surface-soft mb-3 transition-all duration-500"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Base Image */}
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-all duration-1000 ease-out ${
            isHovered && product.hoverImage ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
          }`}
        />

        {/* Hover Image - Fades in on hover */}
        {product.hoverImage && (
          <Image
            src={product.hoverImage}
            alt={product.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-all duration-1000 ease-out absolute inset-0 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          />
        )}

        {/* Badges — flat sharp rectangles, stacked top-0 left-0 */}
        <div className="absolute top-0 left-0 z-10 flex flex-col">
          {product.isNew && (
            <span className="bg-[#f0655d] text-white text-[11px] font-bold px-3 py-1.5 uppercase tracking-wider">
              New Launch
            </span>
          )}
          {product.discount && (
            <span className="bg-[#ba1a1a] text-white text-[11px] font-bold px-3 py-1.5 uppercase tracking-wider">
              {product.discount} Off
            </span>
          )}
          {product.badge && (
            <span className="bg-[#1E1E1E] text-white text-[11px] font-bold px-3 py-1.5 uppercase tracking-wider">
              {product.badge}
            </span>
          )}
        </div>
        
        {/* Wishlist Button - Refined Iconography */}
        <button 
          className="absolute cursor-pointer top-4 right-4 z-20 p-2.5 bg-black/15 backdrop-blur-[1px] text-white hover:bg-primary-bright/60 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Handle Wishlist
          }}
        >
          <Heart size={16} />
        </button>

        {/* Pagination Dots on Hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1.5 z-20"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick View Bar on Hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-0 left-0 right-0 bg-[#2d2724]/90 py-3.5 z-10 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
            >
              <div className="text-white text-center font-heading text-xs font-bold uppercase tracking-[0.2em]">
                Quick View
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Details */}
      <div className="flex flex-col pb-2 gap-1 px-1">
        {/* Category */}
        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-normal">
          {product.category}
        </span>
        
        {/* Title */}
        <h3 className="text-[14px] font-medium text-black tracking-tight leading-tight line-clamp-1 font-public">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mt-0.5">
          {product.discount ? (
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-gray-400 line-through tracking-tight font-normal">
                {product.price}
              </span>
              <span className="text-[13px] font-medium text-gray-800 tracking-tight">
                {(() => {
                  const price = parseFloat(product.price.replace('$', '').replace('₹', ''));
                  const discount = parseFloat(product.discount.replace('% OFF', ''));
                  if (!isNaN(price) && !isNaN(discount)) {
                    const symbol = product.price.includes('₹') ? '₹' : '$';
                    return `${symbol}${Math.round(price * (1 - discount / 100))}`;
                  }
                  return product.price;
                })()}
              </span>
            </div>
          ) : (
            <span className="text-[13px] font-medium text-gray-800 tracking-tight">
              {product.price}
            </span>
          )}
        </div>

        {/* Rating */}
        {showRating && product.rating > 0 && (
          <div className="flex items-center gap-[1px] mt-1">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={10}
                className={`${
                  index < Math.floor(product.rating)
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-gray-200 fill-gray-200'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
      <QuickViewModal 
        product={product} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </>
  );
};

export default ProductCard;
