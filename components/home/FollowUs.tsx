"use client";

import React from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const instagramUrl = "https://www.instagram.com/";

const postCards = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
    link: instagramUrl,
    alt: "Teal performance jersey athlete"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600&auto=format&fit=crop",
    link: instagramUrl,
    alt: "Grey technical training tee athlete"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
    link: instagramUrl,
    alt: "Stealth black training apparel in gym"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop",
    link: instagramUrl,
    alt: "High-performance compression jersey athlete"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1486218119243-13883505764c?q=80&w=600&auto=format&fit=crop",
    link: instagramUrl,
    alt: "Athletes running in red performance gear"
  }
];

export default function FollowUs() {
  return (
    <section className="py-16 md:py-20 bg-white border-t border-[var(--color-border-accent)]">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header: Title Left, Instagram Icon Right */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <h2 className="font-heading text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-tight text-[var(--color-black)]">
            FOLLOW US @DISPORT.CORPORATION
          </h2>
          
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-black)] hover:text-[var(--color-primary-bright)] transition-colors duration-300"
            aria-label="Follow us on Instagram"
          >
            <Icon icon="iconoir:instagram" width="24" height="24" className="stroke-[1.5]" />
          </a>
        </div>

        {/* Responsive Grid: 5 columns on desktop, 3 columns on mobile/tablet */}
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
          {postCards.map((post) => (
            <motion.a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-[3/4] bg-[var(--color-surface-soft)] overflow-hidden group cursor-pointer block"
              whileHover={{ scale: 1.015 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <Image
                src={post.image}
                alt={post.alt}
                fill
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                priority={post.id <= 3}
              />
              
              {/* Premium micro hover overlay */}
              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                <div className="w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-[var(--color-black)] shadow-md transform translate-y-1.5 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                  <Icon icon="iconoir:instagram" width="18" height="18" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  );
}
