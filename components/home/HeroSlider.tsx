"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type TextAlignment = "left" | "center" | "right";

interface HeroSlide {
  id: number;
  /** Background image path (public folder or URL) */
  image: string;
  imageAlt: string;
  /** Overlay colour/gradient — supports any CSS value */
  overlay: string;
  /** Small eyebrow label above headline */
  eyebrow: string;
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
    image: "/disport_hero_cinematic_1778406982113.png",
    imageAlt: "Disport High-Performance Athlete",
    overlay: "linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.42) 55%, transparent 100%)",
    eyebrow: "Engineered for Motion",
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
    image: "/disport_running_category_1778407053113.png",
    imageAlt: "Disport Running — Velocity Series",
    overlay: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.70) 100%)",
    eyebrow: "Velocity Series — SS26",
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
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Disport Training — Elite Gymwear",
    overlay: "linear-gradient(to left, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.42) 55%, transparent 100%)",
    eyebrow: "Elite Gymwear",
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

const AUTOPLAY_INTERVAL = 6000; // ms

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

  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // ── Autoplay + progress bar ─────────────────────────────────────────────────
  useEffect(() => {
    // Tick every 50 ms → 6000ms total = 120 ticks
    const tickMs = 50;
    const ticks = AUTOPLAY_INTERVAL / tickMs;

    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        return p + 100 / ticks;
      });
    }, tickMs);

    autoplayRef.current = setTimeout(() => {
      next();
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
      if (autoplayRef.current) clearTimeout(autoplayRef.current);
    };
  }, [current, next]);

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
      {/* ── Background Image ────────────────────────────────────────────────── */}
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
          <Image
            src={slide.image}
            alt={slide.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{ background: slide.overlay }}
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
            {/* Eyebrow */}
            <span className="text-[var(--color-primary-bright)] font-bold uppercase tracking-[0.3em] text-xs md:text-sm mb-4 block">
              {slide.eyebrow}
            </span>

            {/* Headline */}
            <h1
              className="text-white font-bold mb-6 leading-[0.9] tracking-tighter"
              style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}
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
                className="btn bg-[var(--color-primary-bright)] !text-white px-14 py-6 rounded-none font-black text-sm tracking-[0.2em] hover:bg-black transition-all duration-300 shadow-2xl uppercase border-none"
              >
                {slide.cta.label}
              </Link>
              <Link 
                href={slide.ctaSecondary.href} 
                className="btn border-2 border-white !text-white px-14 py-6 rounded-none font-black text-sm tracking-[0.2em] hover:bg-white hover:!text-black transition-all duration-300 backdrop-blur-md uppercase"
              >
                {slide.ctaSecondary.label}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>





      {/* ── Slide Navigation (Bottom Right) ─────────────────────────────────── */}
      <div className="absolute bottom-12 right-12 z-20 flex flex-col items-end gap-6">
        {/* Slide Counter & Arrows */}
        <div className="flex items-center gap-6">
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-white text-4xl" style={{ fontFamily: "var(--font-heading)", lineHeight: 1 }}>
              0{current + 1}
            </span>
            <span className="text-white/40 font-light text-base">/ 0{total}</span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={prev}
              className="w-12 h-12 flex items-center justify-center border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={next}
              className="w-12 h-12 flex items-center justify-center border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bars (Technical Indicators) */}
        <div className="flex gap-3">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className="group relative h-1 w-24 bg-white/10 overflow-hidden transition-all"
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%" }}
                animate={{ x: i < current ? "0%" : "-100%" }}
                transition={{ duration: 0.5 }}
              />
              {i === current && (
                <motion.div
                  className="absolute inset-0 bg-[var(--color-primary-bright)]"
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: "linear" }}
                  key={`progress-${current}`}
                />
              )}
            </button>
          ))}
        </div>
      </div>






    </section>
  );
};

export default HeroSlider;
