"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import Image from "next/image";

interface CartPopUpModelProps {
  open: boolean;
  onClose: () => void;
  product?: any;
  selectedSize?: string;
  modelSize?: "small" | "normal";
  position?: "top-right" | "top-left" | "center";
  price?: string | number;
}

export default function CartPopUpModel({
  open,
  onClose,
  product,
  selectedSize,
  modelSize = "normal",
  position = "top-right",
  price
}: CartPopUpModelProps) {
  const router = useRouter();

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
        router.push("/cart");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose, router]);

  if (typeof window === 'undefined') return null;

  const positionClasses = {
    "top-right": "top-20 right-4",
    "top-left": "top-20 left-4",
    "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9997] bg-black/5 backdrop-blur-[2px]"
            onClick={onClose}
          />
          {/* Modal - Disport Premium Athletic Aesthetic */}
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className={`fixed bg-white shadow-[0_30px_60px_rgba(0,0,0,0.2)] z-[9998] border border-border 
              ${modelSize === "small" ? "w-[300px] p-4" : "w-[360px] p-6"}
              ${positionClasses[position]}
            `}
          >
            {modelSize === "small" ? (
              <div className="relative flex items-center gap-4">
                <div className="w-16 h-20 bg-surface-soft relative overflow-hidden flex-shrink-0">
                  <Image
                    src={product?.image || product?.productImage?.[0]}
                    alt={product?.name || product?.productName}
                    fill
                    className="object-cover"
                  />
                </div>
              
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle2 size={12} className="text-primary-bright" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-black">
                      Added to Bag
                    </p>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-tight line-clamp-1 mb-1">
                    {product?.name || product?.productName}
                  </p>
                  <p className="text-[10px] font-bold text-primary-bright">
                    {price ? `₹${price}` : product?.price}
                  </p>
                </div>
              
                <button
                  onClick={onClose}
                  className="absolute -top-1 -right-1 p-1 hover:bg-surface-soft transition-colors"
                >
                  <X size={14} className="text-text-secondary/40" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-primary-bright" />
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-black">
                      Added to Bag
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-surface-soft transition-colors"
                  >
                    <X size={18} className="text-text-secondary/40" />
                  </button>
                </div>

                <div className="flex gap-5 mb-8">
                  <div className="w-24 h-32 bg-surface-soft relative overflow-hidden flex-shrink-0 shadow-sm">
                    <Image
                      src={product?.image || product?.productImage?.[0]}
                      alt={product?.name || product?.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="font-bold text-sm uppercase tracking-tight text-black mb-1">
                      {product?.name || product?.productName}
                    </h3>
                    <p className="text-text-secondary/60 text-[10px] font-bold uppercase tracking-widest mb-2">
                      Size: {selectedSize}
                    </p>
                    <p className="font-bold text-base text-black">
                      {price ? `₹${price}` : product?.price}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link href="/cart" passHref className="w-full">
                    <button
                      onClick={onClose}
                      className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-primary-bright transition-all"
                    >
                      <span>View Bag</span>
                      <ShoppingCart size={16} />
                    </button>
                  </Link>
                  <button 
                    onClick={onClose}
                    className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/40 hover:text-black transition-colors py-2"
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}

            {/* Auto-redirect progress bar */}
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="h-1 bg-primary-bright/10 absolute bottom-0 left-0"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
