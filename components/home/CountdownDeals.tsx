"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import ShopNowButton from '../shared/ShopNowButton';

// Simple slot machine animated digit component
const AnimatedNumber = ({ value }: { value: number }) => {
  const digits = String(value).padStart(2, '0').split('');

  return (
    <div className="flex select-none h-12 md:h-14 overflow-hidden items-center justify-center">
      {digits.map((digit, idx) => (
        <div 
          key={ idx} 
          className="relative w-[0.62em] h-full overflow-hidden flex items-center justify-center font-heading text-3xl md:text-4xl font-bold tracking-tight text-white"
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              key={digit}
              initial={{ y: "80%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-80%", opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {digit}
            </motion.span>
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

const CountdownDeals = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Setup parallax scroll tracking on container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Zoom background slightly as you scroll
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1.12, 1.02]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-12%", "6%"]);

  // Standard rolling countdown: initialized to 14 days, 12 hours, 45 minutes, 30 seconds
  const [timeLeft, setTimeLeft] = useState({
    days: 99,
    hours: 15,
    minutes: 58,
    seconds: 29
  });

  useEffect(() => {
    // Run interval to tick timer down
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          // If expired, reset to a rolling 7-day loop to keep the layout active for viewers
          return { days: 7, hours: 12, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-[95vh] min-h-[650px] md:min-h-[780px] overflow-hidden flex items-center bg-black"
    >
      {/* Parallax Background Image */}
      <motion.div 
        style={{ scale: backgroundScale, y: backgroundY }}
        className="absolute inset-0 w-full h-[120%] -top-[10%] z-0"
      >
        <Image
          src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop"
          alt="Premium training athlete workout"
          fill
          className="object-cover brightness-50"
          priority
        />
      </motion.div>

      {/* Dark overlay mask to isolate details */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />

      {/* Section Content */}
      <div className="container relative z-20 mx-auto px-4 w-full">
        <div className="max-w-[700px] text-left flex flex-col items-start">
          
          {/* Flame badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md mb-6 shadow-sm">
            <span className="text-sm">🔥</span>
            <span className="font-body text-xs md:text-sm font-semibold tracking-wider text-white uppercase">
              Limited-time deals
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.05] mb-4">
            Don't miss out on<br/>these exclusive offers
          </h2>

          {/* Subheading */}
          <p className="font-body text-sm md:text-base text-gray-300 font-light max-w-[500px] mb-8 leading-relaxed">
            For a short time only, grab your favorite activewear pieces at unbeatable prices
          </p>

          {/* Countdown Clock Panel Deck */}
          <div className="flex gap-3 md:gap-4 mb-10 select-none">
            {/* Days */}
            <div className="w-[76px] h-[92px] md:w-[90px] md:h-[105px] rounded-2xl bg-black/35 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center shadow-lg">
              <AnimatedNumber value={timeLeft.days} />
              <span className="font-body text-[10px] md:text-xs font-medium text-gray-400 uppercase tracking-widest mt-1">
                Days
              </span>
            </div>

            {/* Hours */}
            <div className="w-[76px] h-[92px] md:w-[90px] md:h-[105px] rounded-2xl bg-black/35 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center shadow-lg">
              <AnimatedNumber value={timeLeft.hours} />
              <span className="font-body text-[10px] md:text-xs font-medium text-gray-400 uppercase tracking-widest mt-1">
                Hours
              </span>
            </div>

            {/* Minutes */}
            <div className="w-[76px] h-[92px] md:w-[90px] md:h-[105px] rounded-2xl bg-black/35 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center shadow-lg">
              <AnimatedNumber value={timeLeft.minutes} />
              <span className="font-body text-[10px] md:text-xs font-medium text-gray-400 uppercase tracking-widest mt-1">
                Minutes
              </span>
            </div>

            {/* Seconds */}
            <div className="w-[76px] h-[92px] md:w-[90px] md:h-[105px] rounded-2xl bg-black/35 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center shadow-lg">
              <AnimatedNumber value={timeLeft.seconds} />
              <span className="font-body text-[10px] md:text-xs font-medium text-gray-400 uppercase tracking-widest mt-1">
                Seconds
              </span>
            </div>
          </div>

          {/* Shop now CTA */}
          <ShopNowButton href="/products" variant="white" />

        </div>
      </div>
    </section>
  );
};

export default CountdownDeals;
