"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Icon } from "@iconify/react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TextAlignment = "left" | "center" | "right";

interface HeroSlide {
  id: number;
  /** Background video path (public folder or URL) */
  video: string;
  /** Main headline — can contain \n for line breaks */
  headline: string;
  /** Highlighted part of the headline */
  headlineAccent: string;
  /** Sub-headline body copy */
  body: string;
  /** Text & content alignment */
  align: TextAlignment;
  /** Primary CTA */
  cta: { label: string; href: string };
  /** Secondary CTA */
  ctaSecondary: { label: string; href: string };
  /** Decorative watermark text shown at the bottom */
  watermark: string;
  /** Accent badge shown in a corner — optional */
  badge?: string;
}

// ─── Slide Data ───────────────────────────────────────────────────────────────

const slides: HeroSlide[] = [
  {
    id: 1,
    video: "/hero/intro1.mp4",
    headline: "PRECISION\n",
    headlineAccent: "PERFORMANCE",
    body: "Experience the next generation of athletic gear. Designed for speed, built for endurance, and engineered to push your limits.",
    align: "left",
    cta: { label: "Shop Collection", href: "/products" },
    ctaSecondary: { label: "Explore Performance", href: "/categories" },
    watermark: "DISPORT // SYSTEM",
    badge: "NEW SEASON",
  },
  {
    id: 2,
    video: "/hero/intro2.mp4",
    headline: "RUN\n",
    headlineAccent: "FASTER",
    body: "Biomechanically tuned outsoles. Ultra-responsive foam. The Velocity V2 is built for athletes who refuse to slow down.",
    align: "center",
    cta: { label: "Shop Running", href: "/products?category=running" },
    ctaSecondary: { label: "See All Footwear", href: "/products?category=footwear" },
    watermark: "VELOCITY // SS26",
    badge: "LIMITED DROP",
  },
  {
    id: 3,
    video: "/hero/intro1.mp4",
    headline: "TRAIN\n",
    headlineAccent: "HARDER",
    body: "Maximum compression, zero compromise. Our Armor Series redefines what performance gymwear can achieve at every rep.",
    align: "right",
    cta: { label: "Shop Training", href: "/products?category=training" },
    ctaSecondary: { label: "View Lookbook", href: "/lookbook" },
    watermark: "ARMOR // SERIES",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function alignClass(align: TextAlignment): string {
  return align === "center"
    ? "items-center text-center"
    : align === "right"
    ? "items-end text-right"
    : "items-start text-left";
}

function contentMaxWidthClass(align: TextAlignment): string {
  return align === "center" ? "max-w-3xl mx-auto" : "max-w-2xl";
}

// ─── Slide Content Variants ───────────────────────────────────────────────────

const contentVariants: any = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 60 : -60,
    y: 0,
  }),
  center: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -60 : 60,
    transition: { duration: 0.45, ease: "easeOut" },
  }),
};

const imageVariants: any = {
  enter: (direction: number) => ({
    scale: 1.08,
    x: direction > 0 ? "3%" : "-3%",
    opacity: 0.5,
  }),
  center: {
    scale: 1,
    x: 0,
    opacity: 1,
    transition: { duration: 1.0, ease: "easeOut" },
  },
  exit: (direction: number) => ({
    scale: 1.04,
    x: direction > 0 ? "-3%" : "3%",
    opacity: 0.5,
    transition: { duration: 0.55, ease: "easeOut" },
  }),
};

// ─── Component ────────────────────────────────────────────────────────────────

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);

  const total = slides.length;

  // ── Navigation helpers ──────────────────────────────────────────────────────

  const goTo = useCallback(
    (index: number, dir?: number) => {
      const resolvedDir = dir ?? (index > current ? 1 : -1);
      setDirection(resolvedDir);
      setCurrent((index + total) % total);
      setProgress(0);
    },
    [current, total]
  );

  const next = useCallback(() => goTo((current + 1) % total, 1), [current, goTo, total]);
  const prev = useCallback(() => goTo((current - 1 + total) % total, -1), [current, goTo, total]);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const handleVideoEnded = () => {
    next();
  };

  // ── Keyboard navigation ─────────────────────────────────────────────────────

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // ── Touch / drag ────────────────────────────────────────────────────────────

  const touchStartX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  const slide = slides[current];

  return (
    <section
      className="relative h-screen min-h-[600px] overflow-hidden select-none"
      aria-label="Hero Slider"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Background Video ────────────────────────────────────────────────── */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={`bg-${current}`}
          className="absolute inset-0 z-0"
          custom={direction}
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          <video
            src={slide.video}
            autoPlay
            muted
            playsInline
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Progress bar ────────────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-30 h-[3px] bg-white/10">
        <motion.div
          className="h-full bg-[var(--color-primary-bright)]"
          style={{ width: `${progress}%` }}
          transition={{ ease: "linear" }}
        />
      </div>

      {/* ── Slide Content ───────────────────────────────────────────────────── */}
      <div
        className={`container relative z-10 h-full flex flex-col justify-center ${
          slide.align === "right"
            ? "items-end"
            : slide.align === "center"
            ? "items-center"
            : "items-start"
        }`}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={`content-${current}`}
            custom={direction}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className={`${contentMaxWidthClass(slide.align)} flex flex-col ${alignClass(slide.align)}`}
          >
            {/* Headline */}
            <h1
              className="text-white font-bold mb-6 leading-[0.9] tracking-tighter"
              style={{ 
                fontSize: "clamp(2rem, 6vw, 4.5rem)",
                textShadow: "0 8px 24px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3)"
              }}
            >
              {slide.headline.split("\n").map((line, i) =>
                line ? (
                  <span key={i} className="block">
                    {line}
                  </span>
                ) : null
              )}
              <span className="text-[var(--color-primary-bright)] block">
                {slide.headlineAccent}
              </span>
            </h1>

            {/* Body */}
            <p
              className="text-white/80 text-sm md:text-lg mb-10 font-light leading-relaxed"
              style={{ maxWidth: "42ch" }}
            >
              {slide.body}
            </p>

            <div
              className={`flex flex-wrap gap-4 mt-2 ${
                slide.align === "center" ? "justify-center" : slide.align === "right" ? "justify-end" : ""
              }`}
            >
              <Link 
                href={slide.cta.href} 
                className="group/btn1 flex items-center gap-3 bg-white text-[#382830] text-xs md:text-sm font-body font-bold rounded-full px-6 py-3 transition-all duration-300 hover:bg-gray-100 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
              >
                <span>{slide.cta.label}</span>
                <span className="bg-[#382830] text-white w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 group-hover/btn1:rotate-45">
                  <Icon icon="ph:arrow-up-right-bold" className="text-xs" />
                </span>
              </Link>
              <Link 
                href={slide.ctaSecondary.href} 
                className="group/btn2 flex items-center gap-3 bg-white/10 backdrop-blur-md text-white border border-white/20 text-xs md:text-sm font-body font-bold rounded-full px-6 py-3 transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
              >
                <span>{slide.ctaSecondary.label}</span>
                <span className="bg-white/20 text-white w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 group-hover/btn2:rotate-45">
                  <Icon icon="ph:arrow-up-right-bold" className="text-xs" />
                </span>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>





      {/* ── Slide Navigation (Bottom Right) ─────────────────────────────────── */}
      <div className="absolute bottom-12 right-12 z-20 flex items-center gap-6">
        {/* Sliding Navigation Arrows */}
        <div className="flex gap-2">
          <button
            onClick={prev}
            className="w-12 h-12 flex items-center justify-center border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
            aria-label="Previous Slide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={next}
            className="w-12 h-12 flex items-center justify-center border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
            aria-label="Next Slide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>






    </section>
  );
};

export default HeroSlider;
