"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Shirt, Users, Trophy, Truck } from 'lucide-react';

const features = [
  {
    icon: Shirt,
    title: "CUSTOM DESIGNS",
    desc: "Built your way"
  },
  {
    icon: Users,
    title: "TEAM READY",
    desc: "Unite. Perform. Win."
  },
  {
    icon: Trophy,
    title: "PREMIUM QUALITY",
    desc: "Made to last"
  },
  {
    icon: Truck,
    title: "FAST DELIVERY",
    desc: "On time, every time"
  }
];

export default function BannerSlider() {
  return (
    <section className="relative w-full min-h-[580px] md:min-h-[660px] flex items-center overflow-hidden bg-zinc-950 border-y border-white/5 py-12 md:py-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/banner slider/banner.png"
          alt="Build for Teams. Designed to Win."
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/40 md:bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent max-md:bg-zinc-950/50" />
      </div>

      {/* Content Overlay */}
      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.1 }
            }
          }}
          className="flex flex-col items-start text-left max-w-3xl"
        >
          {/* Headline Part 1 */}
          <motion.span 
            variants={{
              hidden: { opacity: 0, y: -10 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
            }}
            className="text-[#ec7700] text-base sm:text-lg md:text-xl font-heading font-black tracking-[0.08em] italic uppercase block"
          >
            BUILD FOR TEAMS.
          </motion.span>

          {/* Headline Part 2 */}
          <motion.h2 
            variants={{
              hidden: { opacity: 0, x: -30 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black tracking-tight italic uppercase block leading-[0.95] mt-1"
          >
            DESIGNED TO WIN.
          </motion.h2>

          {/* Decorative Divider */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, width: 0 },
              visible: { opacity: 1, width: "auto", transition: { duration: 0.5, delay: 0.3 } }
            }}
            className="flex items-center gap-1.5 my-5 sm:my-6"
          >
            <div className="w-12 h-[3.5px] bg-[#ec7700]" />
            <div className="w-1.5 h-[3.5px] bg-[#ec7700] -skew-x-20" />
            <div className="w-1.5 h-[3.5px] bg-[#ec7700] -skew-x-20" />
          </motion.div>

          {/* Description */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
            className="text-white/90 text-sm md:text-base font-body max-w-lg leading-relaxed mb-8 sm:mb-10"
          >
            Custom Jerseys. Your Design.<br />Your Identity. We Make It Happen.
          </motion.p>

          {/* Feature Grid */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-y-0 w-full max-w-2xl mb-8 sm:mb-10 py-5 border-t border-b border-white/10"
          >
            {features.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={idx} 
                  className={`flex flex-col items-start pr-4 md:pr-6 md:pl-6 first:pl-0 last:pr-0 ${
                    idx === 3 
                      ? "" 
                      : idx === 1 
                      ? "border-r border-white/10 max-md:border-none" 
                      : "border-r border-white/10"
                  }`}
                >
                  <IconComponent className="w-7 h-7 text-[#ec7700] mb-3 stroke-[1.25]" />
                  <span className="text-white text-[11px] sm:text-xs font-heading font-extrabold tracking-wider uppercase mb-0.5">{item.title}</span>
                  <span className="text-white/50 text-[10px] sm:text-[11px] font-body">{item.desc}</span>
                </div>
              );
            })}
          </motion.div>

          {/* Customize CTA Button */}
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.4, delay: 0.3 } }
            }}
          >
            <a 
              href="/products?category=jerseys"
              className="group inline-flex items-center gap-3 bg-[#ec7700] hover:bg-orange-600 text-white px-8 py-4 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-[4px] font-body shadow-lg hover:shadow-orange-500/10 cursor-pointer hover:scale-102 active:scale-98"
            >
              <span>CUSTOMIZE NOW</span>
              <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


