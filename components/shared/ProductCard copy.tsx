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
  const [isBtnHovered, setIsBtnHovered] = useState(false);

  return (
    <Link 
      href={`/product/${product.id}`}
      className={`group flex flex-col cursor-pointer ${className}`}
    >
      {/* Image Container - Technical Minimalism */}
      <div 
        className="relative aspect-3/4 w-full overflow-hidden bg-surface-soft mb-5 transition-all duration-500"
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
            <span className="bg-gray-800 text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider">
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
          className="absolute cursor-pointer top-4 right-4 z-20 p-2.5 bg-black/15 backdrop-blur-[1px] text-white hover:bg-black hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Handle Wishlist
          }}
        >
          <Heart size={16} />
        </button>

        {/* Quick View Marquee Button on Hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white py-2.5 overflow-hidden z-10 cursor-pointer w-11/12"
              onMouseEnter={() => setIsBtnHovered(true)}
              onMouseLeave={() => setIsBtnHovered(false)}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Handle Quick View
              }}
            >
              <div className="relative flex justify-center items-center h-5">
                {/* Static centered text */}
                <span className={`text-black font-heading text-xs font-bold uppercase tracking-[0.2em] transition-opacity duration-300 ${isBtnHovered ? 'opacity-0' : 'opacity-100'}`}>
                  Choose Options
                </span>
                
                {/* Marquee text on hover */}
                <motion.div
                  className={`absolute left-0 flex whitespace-nowrap items-center transition-opacity duration-300 ${isBtnHovered ? 'opacity-100' : 'opacity-0'}`}
                  animate={isBtnHovered ? { x: ["0%", "-50%"] } : { x: "0%" }}
                  transition={{ ease: "linear", duration: 5, repeat: Infinity }}
                >
                  {[...Array(8)].map((_, i) => (
                    <span key={i} className="text-black font-heading text-xs font-bold uppercase tracking-[0.2em] px-4">
                      Choose Options <span className='h-2 w-2 rounded-full border border-black inline-block m-auto ml-3.5'></span>
                    </span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Details */}
      <div className="flex flex-col  pb-2 px-1 gap-0.5">
        <div className="flex justify-between items-start">
          <div className="flex flex-col flex-1 min-w-0">
            <h3 className="text-[15px] md:text-[16px] font-normal text-black uppercase tracking-tight leading-tight line-clamp-1 group-hover:text-primary-bright transition-colors font-heading">
              {product.name}
            </h3>
          </div>
          <div className="flex items-center space-x-1 opacity-60">
            <Star size={10} className="fill-black text-black" />
            <span className="text-[10px] font-bold tracking-tighter">{product.rating}</span>
          </div>
        </div>

        {/* Color Variants & Rating */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-1">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-black border border-gray-200" />
              <div className="w-3 h-3 bg-gray-300 border border-gray-200" />
            </div>
            <span className="text-[11px] text-gray-400 font-medium uppercase ml-1 tracking-tighter">
              +3 Colors
            </span>
          </div>
          <div className="text-right ml-2 flex items-center gap-1.5">
            {product.discount ? (
              <>
                <span className="text-[12px] md:text-[13px] text-gray-400 line-through tracking-tight">
                  {product.price}
                </span>
                <span className="text-[15px] md:text-[16px] font-medium text-primary-bright tracking-tight">
                  {(() => {
                    const price = parseFloat(product.price.replace('$', ''));
                    const discount = parseFloat(product.discount.replace('% OFF', ''));
                    if (!isNaN(price) && !isNaN(discount)) {
                      return `$${(price * (1 - discount / 100)).toFixed(2)}`;
                    }
                    return product.price;
                  })()}
                </span>
              </>
            ) : (
              <span className="text-[15px] md:text-[16px] font-medium text-black tracking-tight">
                {product.price}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
