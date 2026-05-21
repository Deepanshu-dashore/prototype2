"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User } from "lucide-react";
import { useEffect, useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

interface LoginPopUpModelProps {
  open: boolean;
  onClose: () => void;
  message?: string;
  position?: "top-right" | "top-left" | "center";
}

export default function LoginPopUpModel({
  open,
  onClose,
  message = "Please sign in to continue with your cart and checkout process.",
  position = "top-right"
}: LoginPopUpModelProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !mounted) return;

    const timer = setTimeout(() => {
      onClose();
      startTransition(() => {
        router.push("/login");
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [open, onClose, router, mounted]);

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
            className="fixed inset-0 z-[9998] bg-black/5 backdrop-blur-[2px]"
            onClick={onClose}
          />
          {/* Modal - Disport Premium Aesthetic */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className={`fixed overflow-hidden bg-white rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[9999] border-l-4 border-primary-bright w-[360px] sm:w-[370px] ${positionClasses[position]}`}
          >
            <div className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 bg-black flex-shrink-0 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-black mb-1">
                  Authentication Required
                </p>
                <p className="text-[11px] font-medium text-text-secondary/70 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>
            
            {/* Auto-redirect progress bar */}
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "linear" }}
              className="h-1 bg-primary-bright/20 absolute bottom-0 left-0"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
