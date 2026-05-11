"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Trash2, Star, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const dummyWishlist = [
  {
    _id: "1",
    productName: "AERO-DRY PERFORMANCE TEE",
    productPrice: 55.00,
    productDiscountPrice: 45.00,
    averageRating: 4.8,
    totalReviews: 124,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
    variants: [
      { color: "Black", sizes: ["S", "M", "L", "XL"] },
      { color: "Gray", sizes: ["M", "L"] }
    ]
  },
  {
    _id: "2",
    productName: "VELOCITY V2 SNEAKERS",
    productPrice: 180.00,
    productDiscountPrice: 165.00,
    averageRating: 5.0,
    totalReviews: 89,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
    variants: [
      { color: "Red", sizes: ["8", "9", "10", "11"] },
      { color: "Black", sizes: ["9", "10"] }
    ]
  },
  {
    _id: "3",
    productName: "CORE TECH WINDSTOPPER",
    productPrice: 120.00,
    productDiscountPrice: 110.00,
    averageRating: 4.7,
    totalReviews: 45,
    image: "https://images.unsplash.com/photo-1511402339625-5942682714cd?q=80&w=2070&auto=format&fit=crop",
    variants: [
      { color: "Navy", sizes: ["S", "M", "L"] },
      { color: "Black", sizes: ["L", "XL"] }
    ]
  }
];

export default function WishlistPage() {
  const [items, setItems] = useState(dummyWishlist);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, any>>({});

  const handleRemove = (id: string) => {
    setItems(items.filter(item => item._id !== id));
  };

  const handleVariantSelection = (productId: string, color: string, size: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: { color, size }
    }));
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black antialiased">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Header Section */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-primary-bright fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Your Selection</span>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
            My Wishlist <span className="text-gray-200">({items.length})</span>
          </h1>
        </header>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative bg-[#F9F9F9] border border-gray-100 p-4 transition-all hover:bg-white hover:shadow-2xl hover:shadow-black/5"
              >
                {/* Product Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 mb-6">
                  <Image
                    src={item.image}
                    alt={item.productName}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <button 
                    onClick={() => handleRemove(item._id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white flex items-center justify-center rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-black hover:text-white"
                  >
                    <Trash2 size={18} />
                  </button>
                  
                  {/* Quick Add Overlay */}
                <button 
                  onClick={() => {}}
                  className="flex-1 text-[10px] font-black uppercase tracking-[0.2em] text-white bg-black py-4 hover:bg-gray-900 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  Move to Cart <ArrowRight size={14} />
                </button>
                </div>

                {/* Info */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-black uppercase tracking-tight leading-tight max-w-[70%]">
                      {item.productName}
                    </h3>
                    <div className="text-right">
                      <p className="text-sm font-black">${item.productDiscountPrice.toFixed(2)}</p>
                      <p className="text-[10px] text-gray-400 line-through">${item.productPrice.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-primary-bright text-primary-bright" />
                    <span className="text-[10px] font-bold">{item.averageRating}</span>
                    <span className="text-[10px] text-gray-400 ml-1">({item.totalReviews})</span>
                  </div>

                  {/* Technical Variant Selectors */}
                  <div className="pt-4 border-t border-gray-100 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {item.variants.map((v) => (
                        <button
                          key={v.color}
                          onClick={() => handleVariantSelection(item._id, v.color, v.sizes[0])}
                          className={`text-[9px] font-black uppercase px-3 py-1 border transition-all ${
                            selectedVariants[item._id]?.color === v.color
                              ? "bg-black text-white border-black"
                              : "bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black"
                          }`}
                        >
                          {v.color}
                        </button>
                      ))}
                    </div>

                    {selectedVariants[item._id]?.color && (
                      <div className="flex flex-wrap gap-1">
                        {item.variants.find(v => v.color === selectedVariants[item._id].color)?.sizes.map(s => (
                          <button
                            key={s}
                            onClick={() => handleVariantSelection(item._id, selectedVariants[item._id].color, s)}
                            className={`w-8 h-8 flex items-center justify-center text-[10px] font-bold border transition-all ${
                              selectedVariants[item._id]?.size === s
                                ? "bg-black text-white border-black"
                                : "bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center">
            <div className="inline-flex w-24 h-24 bg-gray-50 items-center justify-center rounded-full mb-8">
              <Heart size={40} className="text-gray-200" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-4">Your Wishlist is Empty</h2>
            <p className="text-gray-500 mb-12 max-w-sm mx-auto text-sm leading-relaxed">
              Find gear that fits your performance level. Start exploring our technical collections to add items here.
            </p>
            <Link 
              href="/"
              className="inline-flex bg-black text-white px-12 py-5 text-xs font-black uppercase tracking-[0.3em] hover:bg-gray-900 transition-all"
            >
              Explore Collections
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
