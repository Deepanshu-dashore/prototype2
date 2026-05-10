"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Plus, Star } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  imageAlt: string;
  hoverImage?: string;
  rating: number;
}

const ProductCard = ({ product }: { product: Product }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative group flex flex-col cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-surface-soft mb-4">
        <Image
          src={isHovered && product.hoverImage ? product.hoverImage : product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Wishlist Icon */}
        <button className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-black hover:text-primary-bright transition-colors">
          <Heart size={18} />
        </button>

        {/* Quick Add Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 left-4 right-4 bg-primary-bright text-white font-bold uppercase py-3 rounded-[4px] flex items-center justify-center space-x-2 z-10"
            >
              <Plus size={18} />
              <span className="text-xs tracking-widest">Quick Add</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Product Details */}
      <div className="flex flex-col text-left">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
            {product.category}
          </span>
          <div className="flex items-center space-x-1">
            <Star size={10} className="fill-primary-bright text-primary-bright" />
            <span className="text-[10px] font-bold">{product.rating}</span>
          </div>
        </div>
        <h3 className="text-black font-bold text-sm md:text-base uppercase tracking-tight mb-2">
          {product.name}
        </h3>
        <p className="text-black font-bold text-lg">{product.price}</p>
      </div>
    </div>
  );
};

const ProductGrid = ({ title, products }: { title: string, products: Product[] }) => {
  return (
    <section className="bg-background">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter">{title}</h2>
          <Link href="#" className="font-bold uppercase tracking-widest text-xs border-b-2 border-primary-bright pb-1 hover:text-primary-bright transition-colors">
            View All Collection
          </Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
export { ProductCard };
