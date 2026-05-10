"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden p-0">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/disport_hero_cinematic_1778406982113.png"
          alt="Disport High Performance Hero"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-primary-bright font-bold uppercase tracking-[0.3em] text-sm mb-4 block">
              Engineered for Motion
            </span>
            <h1 className="text-white text-6xl md:text-8xl font-bold mb-6 leading-[0.9] tracking-tighter">
              PRECISION <br />
              <span className="text-primary-bright">PERFORMANCE</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-xl mb-10 font-light leading-relaxed">
              Experience the next generation of athletic gear. Designed for speed, built for endurance, and engineered to push your limits.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="btn btn-primary px-10 py-5">
                Shop Collection
              </button>
              <button className="btn btn-white px-10 py-5">
                Explore Performance
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative side text or element */}
      <div className="absolute right-[-100px] bottom-[10%] rotate-90 hidden xl:block">
        <span className="text-white/10 text-[120px] font-bold uppercase tracking-widest whitespace-nowrap select-none">
          DISPORT // SYSTEM
        </span>
      </div>
    </section>
  );
};

export default Hero;
