"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import ShopNowButton from '../shared/ShopNowButton';

interface Fabric {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  image: string;
  icon: string;
  iconColor: string;
  dotColor: string;
  hotspot: {
    top: string;
    left: string;
  };
}

const fabrics: Fabric[] = [
  {
    id: 0,
    title: "AEROPULSE™",
    subtitle: "ENGINEERED AIRFLOW TECHNOLOGY",
    description: "Engineered with a unique micro-perforated matrix that reacts to heat, expanding to maximize cross-ventilation. Keep your body at the absolute peak temperature zone during high-intensity intervals.",
    bullets: ["Maximize airflow.", "Stay cool."],
    image: "/fabrics/aeropulse.png",
    icon: "ph:wind-bold",
    iconColor: "text-[#ec7700]",
    dotColor: "bg-[#ec7700]",
    hotspot: { top: "25%", left: "12%" }
  },
  {
    id: 1,
    title: "VELOCITYLITE™",
    subtitle: "ULTRA LIGHTWEIGHT TECHNOLOGY",
    description: "Constructed using featherweight microfibers that feel virtually weightless. Offering zero resistance and rapid evaporation, it allows athletes to achieve full-speed velocity with zero friction.",
    bullets: ["Ultra light.", "Zero distractions."],
    image: "/fabrics/velocitylite.png",
    icon: "ph:leaf-bold",
    iconColor: "text-[#a3e635]",
    dotColor: "bg-[#a3e635]",
    hotspot: { top: "25%", left: "28%" }
  },
  {
    id: 2,
    title: "AEROMESH™",
    subtitle: "ADVANCED AIRFLOW TECHNOLOGY",
    description: "Featuring open-cell weave technology designed to facilitate rapid sweat dissipation and heat expulsion. Provides 360-degree ventilation, keeping you dry and focused under pressure.",
    bullets: ["Breathe deeper.", "Perform better."],
    image: "/fabrics/aeromesh.png",
    icon: "ph:circles-four-bold",
    iconColor: "text-[#00d2ff]",
    dotColor: "bg-[#00d2ff]",
    hotspot: { top: "25%", left: "45%" }
  },
  {
    id: 3,
    title: "COOLFLUX™",
    subtitle: "ADVANCED THERMAL MANAGEMENT",
    description: "Engineered with cooling crystals embedded deep within the yarn structure. Actively pulls heat away from the skin surface, dropping contact temperature by up to 2 degrees Celsius.",
    bullets: ["Stay cool.", "Stay ahead."],
    image: "/fabrics/coolflux.png",
    icon: "ph:snowflake-bold",
    iconColor: "text-[#e2e8f0]",
    dotColor: "bg-[#e2e8f0]",
    hotspot: { top: "25%", left: "60%" }
  },
  {
    id: 4,
    title: "ELITEWEAVE™",
    subtitle: "PREMIUM STRENGTH FABRIC TECHNOLOGY",
    description: "High-density woven composite designed for maximum tear resistance and structural integrity. Built to withstand abrasive friction while retaining a soft, premium feel against the skin.",
    bullets: ["Stronger by design.", "Built to last."],
    image: "/fabrics/eliteweave.png",
    icon: "ph:grid-four-bold",
    iconColor: "text-[#f97316]",
    dotColor: "bg-[#f97316]",
    hotspot: { top: "25%", left: "75%" }
  },
  {
    id: 5,
    title: "MOTIONFLEX™",
    subtitle: "360° FLEXIBILITY TECHNOLOGY",
    description: "Four-way elastic interlock knit that moves in perfect synergy with the muscular system. Delivers mild compression support and retains 100% shape recovery even after heavy dynamic use.",
    bullets: ["Move freely.", "Perform naturally."],
    image: "/fabrics/motionflex.png",
    icon: "ph:arrows-clockwise-bold",
    iconColor: "text-[#c084fc]",
    dotColor: "bg-[#c084fc]",
    hotspot: { top: "25%", left: "88%" }
  }
];

const FabricShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hoveredArrow, setHoveredArrow] = useState<'prev' | 'next' | null>(null);

  const prevIndex = (activeIndex - 1 + fabrics.length) % fabrics.length;
  const nextIndex = (activeIndex + 1) % fabrics.length;

  const handlePrev = () => {
    setActiveIndex(prevIndex);
    setIsDrawerOpen(true);
  };

  const handleNext = () => {
    setActiveIndex(nextIndex);
    setIsDrawerOpen(true);
  };

  return (
    <section className="py-12">
      <div className=" mx-auto px-4">
        {/* Header */}
        {/* <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight text-white mb-3">
            Engineered Materials
          </h2>
          <p className="font-body text-base text-gray-400 max-w-lg mx-auto">
            Discover performance fabrics designed to enhance and support high-intensity athletic movement.
          </p>
        </div> */}

        {/* Hotspots Showcase Container */}
        <div className="relative w-full h-[95vh] min-h-[750px] md:min-h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-zinc-950 border border-zinc-800">
          
          {/* Main Visual Base Image - Dynamic background crossfade */}
          <div className={`absolute inset-0 w-full h-full z-0 transition-all duration-700 ${
            isDrawerOpen ? 'scale-[1.02] brightness-[0.55]' : 'scale-100 brightness-[0.85]'
          }`}>
            {fabrics.map((fabric, i) => (
              <div
                key={fabric.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  activeIndex === i ? 'opacity-90' : 'opacity-0 pointer-events-none'
                }`}
              >
                <Image
                  src={fabric.image}
                  alt={fabric.title}
                  fill
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))}
            {/* Dark gradient mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none z-10" />
          </div>

          {/* Centered Heading Overlay - Fades/scales down when drawer is open */}
          <div className={`absolute bottom-72 md:bottom-80 left-1/2 -translate-x-1/2 z-10 text-center w-full max-w-[800px] px-4 flex flex-col items-center gap-4 transition-all duration-500 ${
            isDrawerOpen ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 pointer-events-auto scale-100'
          }`}>
            <h3 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-[0.95] text-white">
              <span className="block">Push limits.</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-400 to-[#ec7700] block mt-1">Break boundaries.</span>
            </h3>
            <p className="font-body text-sm md:text-base text-gray-300 font-light max-w-[500px]">
              Click on any fabric node or technical detail below to inspect its engineered characteristics.
            </p>
            <ShopNowButton href="/products" variant="white" />
          </div>

          {/* Horizontal Connector Line between Dot 1 and Dot 2 */}
          <div className="absolute top-[25%] left-[calc(100%/12)] right-[calc(100%-(3*100%/12))] h-[1px] bg-gradient-to-r from-[#ec7700] to-[#a3e635] hidden lg:block z-10 opacity-60" />

          {/* Interactive Dots and Vertical Connector Lines */}
          {fabrics.map((fabric, i) => {
            const isActive = activeIndex === i;

            return (
              <div key={fabric.id} className="hidden lg:block">
                {/* Vertical Connector Line */}
                <div 
                  className={`absolute top-[25%] bottom-[230px] w-[1px] transition-all duration-500 ease-out ${
                    isActive 
                      ? 'bg-gradient-to-b from-[#ec7700] via-[#ec7700]/50 to-transparent' 
                      : 'bg-gradient-to-b from-white/10 via-white/5 to-transparent'
                  }`}
                  style={{ left: `calc((100% / 6) * ${i} + (100% / 12))` }}
                />

                {/* Hotspot Dot */}
                <button
                  onClick={() => {
                    setActiveIndex(i);
                    setIsDrawerOpen(true);
                  }}
                  className="absolute z-20 w-8 h-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none group/hotspot flex items-center justify-center transition-all duration-300"
                  style={{ top: "25%", left: `calc((100% / 6) * ${i} + (100% / 12))` }}
                  aria-label={`View ${fabric.title} details`}
                >
                  {/* Outer breathing animation ring */}
                  <span className={`absolute -inset-4 rounded-full border transition-all duration-500 ${
                    isActive 
                      ? 'border-[#ec7700]/70 animate-pulse scale-110' 
                      : 'border-white/20 animate-ping group-hover/hotspot:border-white/40'
                  }`} />

                  {/* Inner solid border ring */}
                  <span className={`relative w-7 h-7 rounded-full flex items-center justify-center border transition-colors duration-500 ${
                    isActive ? 'border-[#ec7700] bg-black/60' : 'border-white/60 bg-black/30'
                  }`}>
                    {/* Colored Core Bullet */}
                    <span className={`w-3 h-3 rounded-full transition-transform duration-500 ${fabric.dotColor} ${
                      isActive ? 'scale-110 shadow-[0_0_8px_currentColor]' : 'group-hover/hotspot:scale-125'
                    }`} />
                  </span>
                </button>
              </div>
            );
          })}

          {/* Bottom Fabric Columns Grid */}
          <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10 z-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6 bg-black/35 backdrop-blur-md border border-white/10 p-5 lg:p-6 rounded-2xl">
            {fabrics.map((fabric, i) => {
              const isActive = activeIndex === i;
              return (
                <div
                  key={fabric.id}
                  onClick={() => {
                    setActiveIndex(i);
                    setIsDrawerOpen(true);
                  }}
                  className={`group flex flex-col items-center text-center cursor-pointer p-3 rounded-xl transition-all duration-300 border ${
                    isActive 
                      ? 'border-[#ec7700]/40 bg-white/5' 
                      : 'border-transparent hover:bg-white/5'
                  }`}
                >
                  {/* Fabric Icon */}
                  <div className={`mb-3 p-2 rounded-lg bg-white/5 transition-all duration-300 group-hover:scale-110 ${
                    isActive ? 'bg-[#ec7700]/10 scale-105' : ''
                  }`}>
                    <Icon 
                      icon={fabric.icon} 
                      className={`text-2xl lg:text-3xl ${fabric.iconColor} transition-transform duration-500`} 
                    />
                  </div>

                  {/* Fabric Title */}
                  <h4 className="font-heading text-[13px] lg:text-[14px] font-bold uppercase tracking-wider text-white mb-1">
                    {fabric.title}
                  </h4>

                  {/* Fabric Subtitle */}
                  <p className="font-body text-[9px] lg:text-[10px] text-gray-400 uppercase tracking-tight mb-2 h-6 flex items-center justify-center leading-tight">
                    {fabric.subtitle}
                  </p>

                  {/* Bullets */}
                  {/* <div className="flex flex-col gap-0.5 text-[11px] text-gray-500 leading-tight">
                    {fabric.bullets.map((bullet, idx) => (
                      <span key={idx}>{bullet}</span>
                    ))}
                  </div> */}
                </div>
              );
            })}
          </div>

          {/* Floating Details Drawer */}
          <div
            className={`absolute z-30 flex flex-col justify-between bg-[#111111] text-white shadow-2xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] top-1/3 -translate-y-1/2 right-0 md:right-6 w-full md:w-[410px] h-[64vh] min-h-[480px] max-h-[95vh] rounded-none md:rounded-[24px] border border-white/10 ${
              isDrawerOpen 
                ? 'translate-x-0 opacity-100 pointer-events-auto' 
                : 'translate-x-[110%] opacity-0 pointer-events-none'
            }`}
          >
            {/* Top Section - Subtitle, Icon & Clean Close button */}
            <div className="flex justify-between items-center px-8 pt-8 md:px-10 md:pt-10">
              <div className="flex items-center gap-3">
                <Icon icon={fabrics[activeIndex].icon} className={`text-2xl ${fabrics[activeIndex].iconColor}`} />
                <span className="font-heading text-xs font-semibold text-[#ec7700] tracking-wider uppercase">
                  {fabrics[activeIndex].subtitle}
                </span>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-gray-400 hover:text-white active:scale-95 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
                aria-label="Close fabric drawer"
              >
                <Icon icon="ph:x-bold" className="text-xl" />
              </button>
            </div>

            {/* Middle Section - Fabric Technical Descriptions */}
            <div className="flex-grow px-8 py-6 md:px-10 flex flex-col justify-start">
              <h4 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-tight leading-tight text-white mb-4">
                {fabrics[activeIndex].title}
              </h4>
              <p className="font-body text-sm text-gray-300 leading-relaxed font-light mb-6">
                {fabrics[activeIndex].description}
              </p>
              
              <div className="border-t border-white/10 pt-4">
                <h5 className="font-heading text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Key Features</h5>
                <ul className="flex flex-col gap-2">
                  {fabrics[activeIndex].bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-300 font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ec7700]" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Section - Micro-interactive sliding line arrows */}
            <div className="px-8 py-8 md:px-10 md:py-8 bg-[#181818] relative border-t border-white/5 flex flex-col justify-end min-h-[50px]">
              
              {/* Line Container */}
              <div className="relative flex items-center justify-between h-12 w-full">
                {/* Previous Button */}
                <button
                  onClick={handlePrev}
                  onMouseEnter={() => setHoveredArrow('prev')}
                  onMouseLeave={() => setHoveredArrow(null)}
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black active:scale-95 transition-all duration-300 cursor-pointer z-10 group"
                  aria-label="Previous detail"
                >
                  <Icon icon="ph:arrow-left-bold" className="text-base transition-transform duration-300 group-hover:-translate-x-0.5" />
                </button>

                {/* Baseline connecting the arrows */}
                <div className="absolute left-12 right-12 h-[1px] bg-white/10 z-0 pointer-events-none" />

                {/* Active Highlight Line */}
                <div className="absolute left-12 right-12 h-[1px] z-0 pointer-events-none overflow-hidden flex">
                  <div
                    className={`h-full bg-white/60 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      hoveredArrow === 'prev' 
                        ? 'w-full origin-left scale-x-100' 
                        : hoveredArrow === 'next' 
                          ? 'w-full origin-right scale-x-100 ml-auto' 
                          : 'w-0 scale-x-0 mx-auto'
                    }`}
                  />
                </div>

                {/* Floating Title Reveal above the stretching line */}
                <div className="absolute left-14 right-14 -top-0.5 flex justify-center pointer-events-none overflow-hidden h-7">
                  <span
                    className={`absolute font-heading text-xs font-bold uppercase tracking-widest text-[#ec7700] truncate max-w-full text-center transition-all duration-300 transform ${
                      hoveredArrow === 'prev'
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-2 opacity-0'
                    }`}
                  >
                    {fabrics[prevIndex].title}
                  </span>
                  <span
                    className={`absolute font-heading text-xs font-bold uppercase tracking-widest text-[#ec7700] truncate max-w-full text-center transition-all duration-300 transform ${
                      hoveredArrow === 'next'
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-2 opacity-0'
                    }`}
                  >
                    {fabrics[nextIndex].title}
                  </span>
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  onMouseEnter={() => setHoveredArrow('next')}
                  onMouseLeave={() => setHoveredArrow(null)}
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black active:scale-95 transition-all duration-300 cursor-pointer z-10 group"
                  aria-label="Next detail"
                >
                  <Icon icon="ph:arrow-right-bold" className="text-base transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Quick-Reopen Fabric Indicator */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className={`absolute right-8 top-8 z-20 bg-white text-black font-body text-xs md:text-sm font-bold rounded-full px-5 py-2.5 flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all duration-500 cursor-pointer border border-gray-100 ${
              !isDrawerOpen 
                ? 'scale-100 opacity-100 pointer-events-auto' 
                : 'scale-90 opacity-0 pointer-events-none'
            }`}
          >
            <Icon icon="ph:info-bold" className="text-base text-[#ec7700]" />
            <span>Show Technical Info</span>
          </button>

        </div>
      </div>
    </section>
  );
};

export default FabricShowcase;
