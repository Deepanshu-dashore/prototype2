"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Check } from "lucide-react";
import { createPortal } from "react-dom";
import Image from "next/image";

interface CartPopUpModelProps {
  open: boolean;
  onClose: () => void;
  product?: any;
  selectedSize?: string;
  selectedColor?: string;
  modelSize?: "small" | "normal";
  position?: "top-right" | "top-left" | "center";
  price?: string | number;
}

export default function CartPopUpModel({
  open,
  onClose,
  product,
  selectedSize,
  selectedColor,
  modelSize = "normal",
  position = "top-right",
  price
}: CartPopUpModelProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (typeof window === 'undefined') return null;

  const positionClasses = {
    "top-right": "top-24 right-6",
    "top-left": "top-24 left-6",
    "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
  };

  const imageSrc = product?.productImage?.[0] || product?.images?.[0] || product?.image || "/disport_sneakers_product_1778407255046.png";

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop - modern blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9997] bg-black/30 backdrop-blur-[2px]"
            onClick={onClose}
          />
          {/* Modal - Nike Premium Added-To-Cart Layout */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed bg-white border border-border shadow-[0_30px_60px_rgba(0,0,0,0.25)] z-[9998] p-6 rounded-none w-[360px] sm:w-[390px] ${positionClasses[position]}`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 hover:bg-surface-soft text-text-secondary/40 hover:text-black transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Header Status */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white">
                <Check size={12} className="stroke-[3]" />
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-black font-heading">
                Added To Bag
              </p>
            </div>

            {/* Product Metadata Row */}
            <div className="flex gap-4 mb-6">
              <div className="w-20 h-24 bg-surface-soft relative overflow-hidden flex-shrink-0 shadow-sm border border-border/30">
                <Image
                  src={imageSrc}
                  alt={product?.productName || product?.name || "Product"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <h3 className="font-black text-[12px] uppercase tracking-tight text-black mb-1.5 truncate font-heading leading-tight">
                  {product?.productName || product?.name}
                </h3>
                <div className="space-y-0.5 mb-2">
                  {selectedColor && (
                    <p className="text-text-secondary/60 text-[9px] font-black uppercase tracking-widest">
                      Color: {selectedColor}
                    </p>
                  )}
                  {selectedSize && (
                    <p className="text-text-secondary/60 text-[9px] font-black uppercase tracking-widest">
                      Size: {selectedSize}
                    </p>
                  )}
                </div>
                <p className="font-bold text-[13px] text-black">
                  {price ? `₹${price}` : product?.price}
                </p>
              </div>
            </div>

            {/* Nike Outlined Actions */}
            <div className="flex flex-col gap-2">
              <Link href="/cart" passHref className="w-full">
                <button
                  onClick={onClose}
                  className="w-full bg-white hover:bg-surface-soft border border-black text-black py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>View Bag</span>
                  <ShoppingCart size={12} />
                </button>
              </Link>
              <Link href="/cart" passHref className="w-full">
                <button
                  onClick={onClose}
                  className="w-full bg-black hover:bg-primary-bright text-white py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all cursor-pointer border border-transparent"
                >
                  Checkout
                </button>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
