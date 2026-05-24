"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const BrandStory = () => {
  return (
    <section className="bg-black text-white py-24 md:py-32 overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          > 
            <span className="text-primary-bright font-bold uppercase tracking-[0.3em] text-sm mb-6 block">
              Engineered for Movement
            </span>
            <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-8 leading-[0.9]">
              THE SYSTEM <br />
              OF SPEED
            </h2>
            <p className="text-white/60 text-lg md:text-xl mb-10 leading-relaxed max-w-xl">
              At Disport, we don't just make apparel. We build performance systems. Every stitch, every fabric, and every silhouette is engineered to enhance your motion and maximize your potential.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-primary-bright text-3xl font-bold mb-2">0.1s</h4>
                <p className="text-white/40 text-xs uppercase tracking-widest">Reaction Time Focus</p>
              </div>
              <div>
                <h4 className="text-primary-bright text-3xl font-bold mb-2">100%</h4>
                <p className="text-white/40 text-xs uppercase tracking-widest">Technical Precision</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative h-[500px] md:h-[600px] rounded-lg overflow-hidden"
          >
            <Image
              src="/disport_hero_cinematic_1778406982113.png"
              alt="Disport Technical Detail"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-primary-bright/10 mix-blend-overlay" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
