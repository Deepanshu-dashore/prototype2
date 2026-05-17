"use client";

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from './ProductCard';

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden grid grid-cols-1 md:grid-cols-2 rounded-sm shadow-2xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-black hover:text-white transition-all duration-300"
          >
            <X size={20} />
          </button>

          {/* Left Column: Image */}
          <div className="relative aspect-square md:aspect-auto bg-surface-soft h-full max-h-[500px] md:max-h-full">
            <Image
              src={product.image}
              alt={product.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1">
              {product.isNew && (
                <span className="bg-[#f0655d] text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider">
                  New Launch
                </span>
              )}
              {product.discount && (
                <span className="bg-[#ba1a1a] text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider">
                  {product.discount} Off
                </span>
              )}
              {product.badge && (
                <span className="bg-[#1E1E1E] text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="p-8 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              {/* Category & Rating */}
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-gray-500 uppercase tracking-wider font-medium font-public bg-gray-100 px-2 py-1 rounded-sm">
                  {product.category}
                </span> 
                {product.rating > 0 && (
                  <div className="flex items-center gap-0.5">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-medium text-gray-700 font-public">{product.rating}</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-black uppercase font-public">
                {product.name}
              </h2>

              {/* Price */}
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  {product.discount ? (
                    <>
                      <span className="text-xl font-bold text-gray-800 font-public">
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
                      <span className="text-sm text-gray-400 line-through font-public">
                        {product.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-gray-800 font-public">
                      {product.price}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-gray-500 font-public">MRP Inclusive of all taxes</div>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-2 text-xs text-red-600 font-medium font-public">
                <span>🔥</span>
                <span>24 others have this in their cart!</span>
              </div>

              {/* Short Description */}
              <p className="text-sm text-gray-600 leading-relaxed font-public">
                Engineered for maximum comfort and high performance. This premium piece features breathable materials and a design tailored for athletic motion.
              </p>

              {/* Size Selector */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs uppercase tracking-wider font-medium text-gray-700 font-public">
                  <span>Select Size</span>
                  <button className="text-gray-500 underline hover:text-black">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      className="border border-gray-200 w-12 h-10 flex items-center justify-center text-sm font-medium hover:border-black transition-colors rounded-sm font-public"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-wider font-medium text-gray-700 font-public">Color</span>
                <div className="flex gap-2">
                  <button className="w-6 h-6 rounded-full bg-black ring-2 ring-offset-2 ring-black" />
                  <button className="w-6 h-6 rounded-full bg-gray-400 ring-2 ring-offset-2 ring-transparent hover:ring-gray-400" />
                  <button className="w-6 h-6 rounded-full bg-[#f3f3f4] ring-2 ring-offset-2 ring-transparent hover:ring-gray-300" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 space-y-3">
              <div className="flex gap-3">
                <button className="flex-1 bg-[#ec7700] text-white py-4 text-xs font-bold uppercase tracking-wider hover:bg-[#964900] transition-colors flex items-center justify-center gap-2 rounded-sm font-public">
                  <ShoppingBag size={16} />
                  Add to Cart
                </button>
                <button className="border border-gray-200 p-4 hover:border-black transition-colors rounded-sm">
                  <Heart size={16} />
                </button>
              </div>
              <button className="w-full text-center text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black transition-colors py-2 font-public underline">
                View full details
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuickViewModal;
