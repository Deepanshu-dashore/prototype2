"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ProductsBannerProps {
  categories: any[];
  activeCategoryId?: string;
  activeGender?: string;
}

interface BannerVariant {
  tag: string;
  titleFirst: string;
  titleHighlight: string;
  description: string;
  image: string;
}

// Default page layout shows the collections banner
const defaultVariant: BannerVariant = {
  tag: "EXCLUSIVE COLLECTIONS",
  titleFirst: "THE APEX OF ",
  titleHighlight: "PERFORMANCE",
  description: "Discover our curated technical collections engineered for speed, agility, and style.",
  image: "/collections_banner_bg.png"
};

const variantsMap: Record<string, BannerVariant> = {
  men: {
    tag: "MEN'S COLLECTION",
    titleFirst: "ENGINEERED FOR ",
    titleHighlight: "EVERY MOVE",
    description: "High performance fabrics, modern fits and built for athletes who push limits.",
    image: "/men_banner_bg.png"
  },
  women: {
    tag: "WOMEN'S COLLECTION",
    titleFirst: "STRENGTH IN ",
    titleHighlight: "MOTION",
    description: "Engineered performance wear designed to empower your every movement.",
    image: "/women_banner_bg.png"
  },
  kids: {
    tag: "KIDS COLLECTION",
    titleFirst: "BUILT FOR THE ",
    titleHighlight: "FUTURE",
    description: "Durable, comfortable, and breathable activewear for next-generation champions.",
    image: "/kids_banner_bg.png"
  },
  kit: {
    tag: "KIDS COLLECTION",
    titleFirst: "BUILT FOR THE ",
    titleHighlight: "FUTURE",
    description: "Durable, comfortable, and breathable activewear for next-generation champions.",
    image: "/kids_banner_bg.png"
  },
  teamwear: {
    tag: "TEAMWEAR COLLECTION",
    titleFirst: "YOUR DESIGN, YOUR ",
    titleHighlight: "IDENTITY",
    description: "Premium custom jerseys and team kits engineered for peak performance and unity.",
    image: "/teamwear_banner_bg.png"
  },
  jersey: {
    tag: "TEAMWEAR COLLECTION",
    titleFirst: "YOUR DESIGN, YOUR ",
    titleHighlight: "IDENTITY",
    description: "Premium custom jerseys and team kits engineered for peak performance and unity.",
    image: "/teamwear_banner_bg.png"
  },
  jerseys: {
    tag: "TEAMWEAR COLLECTION",
    titleFirst: "YOUR DESIGN, YOUR ",
    titleHighlight: "IDENTITY",
    description: "Premium custom jerseys and team kits engineered for peak performance and unity.",
    image: "/teamwear_banner_bg.png"
  },
  collections: {
    tag: "EXCLUSIVE COLLECTIONS",
    titleFirst: "THE APEX OF ",
    titleHighlight: "PERFORMANCE",
    description: "Discover our curated technical collections engineered for speed, agility, and style.",
    image: "/collections_banner_bg.png"
  },
  collection: {
    tag: "EXCLUSIVE COLLECTIONS",
    titleFirst: "THE APEX OF ",
    titleHighlight: "PERFORMANCE",
    description: "Discover our curated technical collections engineered for speed, agility, and style.",
    image: "/collections_banner_bg.png"
  }
};

export default function ProductsBanner({ categories, activeCategoryId, activeGender }: ProductsBannerProps) {
  // Find current active category name
  const activeCategory = useMemo(() => {
    if (!activeCategoryId || !categories) return null;
    
    // 1. Try matching by ObjectId
    let found = categories.find((cat) => (cat._id || cat.id) === activeCategoryId);
    
    // 2. Fallback to matching by name (case-insensitive) for links like ?category=jerseys
    if (!found) {
      found = categories.find(
        (cat) => cat.name && cat.name.toLowerCase() === activeCategoryId.toLowerCase()
      );
    }
    return found;
  }, [activeCategoryId, categories]);

  const activeCategoryName = activeCategory ? activeCategory.name : "";

  // The active display name (either gender, category name, or category slug itself as fallback)
  const activeDisplayName = activeGender || activeCategoryName || activeCategoryId || "";

  // Resolve the banner variant based on activeDisplayName matching word boundaries
  const variant = useMemo<BannerVariant>(() => {
    if (!activeDisplayName) return defaultVariant;
    const nameLower = activeDisplayName.toLowerCase();
    
    // Find key match with word boundaries to prevent "women" from matching "men"
    const matchedKey = Object.keys(variantsMap).find((key) => {
      const regex = new RegExp(`\\b${key}\\b`, "i");
      return regex.test(nameLower);
    });
    
    return matchedKey ? variantsMap[matchedKey] : defaultVariant;
  }, [activeDisplayName]);

  return (
    <div className="max-w-[1600px] mx-auto mb-6">
      <div className="relative bg-[#f6f6f6] overflow-hidden flex flex-col md:flex-row items-stretch min-h-[340px] md:min-h-[380px] lg:min-h-[420px] rounded-[4px]">
        
        {/* Left / Top Side: Text Content */}
        <div className="flex-1 p-6 sm:p-10 md:p-14 lg:p-20 flex flex-col justify-center z-10 relative bg-[#f6f6f6]/80 md:bg-transparent backdrop-blur-xs md:backdrop-blur-none max-w-full md:max-w-[55%]">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-secondary)]/50 mb-6">
            <Link href="/" className="hover:text-[var(--color-primary-bright)] transition-colors">
              Home
            </Link>
            <ChevronRight size={10} className="text-gray-400" />
            <span className="text-[var(--color-black)]">
              {activeDisplayName || "All Products"}
            </span>
          </nav>

          {/* Badge/Tag */}
          <span className="text-[14px] font-bold! tracking-[0.2em] text-[var(--color-primary-bright)] uppercase mb-3.5 block">
            {variant.tag}
          </span>

          {/* Heading */}
          <h1 className="font-heading text-[1.85rem] sm:text-[2.25rem] md:text-[2.5rem] lg:text-[4rem] font-bold uppercase tracking-tight text-[var(--color-black)] leading-[0.95] mb-6">
            {variant.titleFirst}
            <span className="text-[var(--color-primary-bright)] block md:inline">
              {variant.titleHighlight}
            </span>
          </h1>

          {/* Description */}
          <p className="font-body text-xs sm:text-sm text-[var(--color-text-secondary)] font-medium leading-relaxed max-w-md">
            {variant.description}
          </p>
        </div>

        {/* Right / Bottom Side: Athlete Graphic Image (Baked with stripes) */}
        <div className="relative w-full md:w-[48%] min-h-[220px] md:min-h-full flex-shrink-0">
          <Image
            src={variant.image}
            alt={activeDisplayName || "Disport Performance Banner"}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`object-cover object-center ${variant.tag === "EXCLUSIVE COLLECTIONS" ? "md:object-center" : "md:object-top"}`}
          />
          {/* Soft gradient mask for mobile to blend the text container background */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#f6f6f6] via-[#f6f6f6]/10 to-transparent md:hidden" />
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#f6f6f6] to-transparent hidden md:block" />
        </div>

      </div>
    </div>
  );
}
