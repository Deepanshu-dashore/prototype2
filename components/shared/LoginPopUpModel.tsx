"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, X, LogIn } from "lucide-react";
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

  const handleSignInClick = () => {
    onClose();
    startTransition(() => {
      router.push("/login");
    });
  };

  if (typeof window === 'undefined') return null;

  const positionClasses = {
    "top-right": "top-24 right-6",
    "top-left": "top-24 left-6",
    "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop - sleek blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-[2px]"
            onClick={onClose}
          />
          {/* Modal - Nike Premium Athletic Minimalism */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed bg-white border border-border-accent shadow-[0_30px_60px_rgba(0,0,0,0.25)] z-[9999] w-[350px] sm:w-[380px] p-6 rounded-none ${positionClasses[position]}`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 hover:bg-surface-soft text-text-secondary/40 hover:text-black transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex flex-col gap-4 mt-2">
              {/* Header Icon */}
              <div className="w-10 h-10 bg-black flex items-center justify-center text-white rounded-none">
                <User size={18} className="stroke-[2.5]" />
              </div>

              {/* Text */}
              <div className="space-y-1">
                <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-black font-heading leading-tight">
                  Disport Membership
                </h3>
                <p className="text-[11px] font-medium text-text-secondary leading-relaxed max-w-[90%]">
                  {message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleSignInClick}
                  className="w-full bg-black hover:bg-primary-bright text-white py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all cursor-pointer border border-transparent"
                >
                  <span>Sign In / Join Us</span>
                  <LogIn size={12} className="stroke-[2.5]" />
                </button>
                <button
                  onClick={onClose}
                  className="w-full bg-white hover:bg-surface-soft border border-black/10 hover:border-black text-black py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all cursor-pointer"
                >
                  Continue Guest Mode
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
