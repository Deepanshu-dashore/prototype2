"use client";

import React from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

interface FabricItem {
  title: string;
  subtitle: string;
  bullets: string[];
  icon: string;
  iconColor: string;
}

const fabrics: FabricItem[] = [
  {
    title: "AEROPULSE™",
    subtitle: "ENGINEERED AIRFLOW TECHNOLOGY",
    bullets: ["Maximize airflow.", "Stay cool."],
    icon: "tabler:wind",
    iconColor: "text-[#ec7700]",
  },
  {
    title: "VELOCITYLITE™",
    subtitle: "ULTRA LIGHTWEIGHT TECHNOLOGY",
    bullets: ["Ultra light.", "Zero distractions."],
    icon: "tabler:leaf",
    iconColor: "text-[#a3e635]",
  },
  {
    title: "AEROMESH™",
    subtitle: "ADVANCED AIRFLOW TECHNOLOGY",
    bullets: ["Breathe deeper.", "Perform better."],
    icon: "tabler:snowflake",
    iconColor: "text-[#00d2ff]",
  },
  {
    title: "COOLFLUX™",
    subtitle: "ADVANCED THERMAL MANAGEMENT",
    bullets: ["Stay cool.", "Stay ahead."],
    icon: "tabler:circles-relation",
    iconColor: "text-[#e2e8f0]",
  },
  {
    title: "ELITEWEAVE™",
    subtitle: "PREMIUM STRENGTH FABRIC TECHNOLOGY",
    bullets: ["Stronger by design.", "Built to last."],
    icon: "tabler:grid-pattern",
    iconColor: "text-[#f97316]",
  },
  {
    title: "MOTIONFLEX™",
    subtitle: "360° FLEXIBILITY TECHNOLOGY",
    bullets: ["Move freely.", "Perform naturally."],
    icon: "tabler:refresh",
    iconColor: "text-[#c084fc]",
  },
];

export default function FabricShowcase() {
  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden bg-zinc-950 text-white border-t border-white/5">
      
      {/* Complete Section Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/fabrics/fabricShowCase.png"
          alt="Technical fabric texture"
          fill
          className="object-cover object-center opacity-65"
          sizes="100vw"
          priority
        />
        {/* Dark overlay mask: solid dark on the left, fading to transparent on the right */}
        <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-950 via-5% to-transparent pointer-events-none" />
        {/* Extra top/bottom shading for edge blending */}
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950/35 via-transparent to-zinc-950/10 pointer-events-none" />
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-start">
          
          {/* Left Side: Headline & Intro */}
          <div className="lg:col-span-3 flex flex-col justify-center items-start lg:pt-8">
            {/* Tech tag above headline */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] text-[#ec7700]  font-bold tracking-[0.2em] uppercase">SYSTEM INNOVATION</span>
              <div className="w-8 h-[1px] bg-[#ec7700]/50" />
            </div>

            <h2 className="font-heading text-4xl sm:text-5xl font-semibold uppercase tracking-tighter leading-[0.9] text-white mb-5">
              THE <span className="text-[#ec7700] block sm:inline">DISPORT</span>
              <br className="hidden sm:block" />
              ADVANTAGE
            </h2>
            <p className="font-body text-[13px] md:text-sm text-zinc-400 leading-relaxed mb-8 max-w-[280px] sm:max-w-xs">
              Our advanced fabric technologies are engineered to enhance every move you make.
            </p>
            <a
              href="/products"
              className="group inline-flex items-center gap-3 border border-white/10 hover:border-white/40 text-white px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 rounded-[4px] font-body bg-zinc-900/50 hover:bg-white hover:text-black cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>EXPLORE TECHNOLOGIES</span>
              <span className="group-hover:translate-x-1.5 transition-transform duration-300 text-sm">→</span>
            </a>
          </div>

          {/* Right Side: Fabric Details minimal left-aligned columns grid */}
          <div className="lg:col-span-9 w-full lg:mt-auto">
            {/* Horizontal Scrollable Container on Mobile, Standard Grid on Desktop */}
            <div className="flex flex-row overflow-x-auto gap-8 lg:gap-x-2 lg:gap-y-0 snap-x snap-mandatory scrollbar-hide lg:grid lg:grid-cols-6 w-full -mx-4 px-4 lg:mx-0 lg:px-0">
              {fabrics.map((fabric, i) => {
                return (
                  <div
                    key={i}
                    className="flex-shrink-0 w-[200px] lg:w-full snap-start flex flex-col items-start text-left transition-all duration-300 group"
                  >
                    {/* Icon Container with smooth hover scale and opacity change */}
                    <div className="mb-5 transition-all duration-300 group-hover:scale-115 group-hover:opacity-100 opacity-90">
                      <Icon
                        icon={fabric.icon}
                        className={`w-7 h-7 sm:w-8 sm:h-8 ${fabric.iconColor}`}
                      />
                    </div>

                    {/* Fabric Title - Barlow Bold (700) */}
                    <h3 className="font-heading text-sm sm:text-base font-bold uppercase tracking-tight text-white mb-2">
                      {fabric.title}
                    </h3>

                    {/* Technical Subtitle - Inter Semi-Bold (600) */}
                    <p className="font-body text-[9px] sm:text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-4 leading-snug">
                      {fabric.subtitle}
                    </p>

                    {/* Description Bullet Lines - Inter Regular (400) */}
                    <div className="flex flex-col gap-1.5 text-[11px] sm:text-xs text-zinc-400 font-normal font-body leading-relaxed">
                      {fabric.bullets.map((bullet, idx) => (
                        <span key={idx}>{bullet}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
