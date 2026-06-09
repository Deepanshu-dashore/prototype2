"use client";

import React from "react";
import HeroSlider from "@/components/home/HeroSlider";
import TrustBar from "@/components/home/TrustBar";
import ShopBySport from "@/components/home/ShopBySport";
import CountdownDeals from "@/components/home/CountdownDeals";
import FabricShowcase from "@/components/home/FabricShowcase";
import ProductGrid from "@/components/shared/ProductGrid";
import BannerSlider from "@/components/home/BannerSlider";
import CategoryGrid from "@/components/home/CategoryGrid";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import { useGetApi } from "@/hooks/useApi";
import API_ENDPOINTS from "@/app/constants/apiConfig";
import { Product } from "@/components/shared/ProductCard";

// Mock Product Data as fallbacks in case API fails or returns empty lists
const fallbackTrending = [
  {
    id: 1,
    name: "AERO-DRY PERFORMANCE TEE",
    category: "TRAINING",
    price: "$55.00",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1517838577597-4712306aa13a?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Aero-Dry Performance Tee",
    rating: 4.9,
    isNew: true
  },
  {
    id: 2,
    name: "VELOCITY V2 SNEAKERS",
    category: "RUNNING",
    price: "$180.00",
    image: "/disport_sneakers_product_1778407255046.png",
    hoverImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Velocity V2 Sneakers",
    rating: 5.0,
    isNew: true
  },
  {
    id: 3,
    name: "COMPRESSION ARMOR TIGHTS",
    category: "GYMWEAR",
    price: "$75.00",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2071&auto=format&fit=crop",
    imageAlt: "Compression Armor Tights",
    rating: 4.8
  },
  {
    id: 4,
    name: "CORE TECH WINDSTOPPER",
    category: "OUTDOOR",
    price: "$120.00",
    image: "https://images.unsplash.com/photo-1511402339625-5942682714cd?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Core Tech Windstopper",
    rating: 4.7,
    discount: "20% OFF"
  },
  {
    id: 11,
    name: "HYBRID TECH SLEEVELESS",
    category: "TRAINING",
    price: "$60.00",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1517838577597-4712306aa13a?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Hybrid Tech Sleeveless",
    rating: 4.8,
    isNew: true
  }
];

const fallbackBestSellers = [
  {
    id: 5,
    name: "IGNITE FOAM RUNNERS",
    category: "RUNNING",
    price: "$160.00",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=2070&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1512327428752-64345224594c?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Ignite Foam Runners",
    rating: 4.9
  },
  {
    id: 6,
    name: "PRO-LIFT TRAINING SHOES",
    category: "TRAINING",
    price: "$140.00",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?q=80&w=2070&auto=format&fit=crop",
    rating: 4.8
  },
  {
    id: 7,
    name: "ELITE CARGO JOGGERS",
    category: "SNEAKERS",
    price: "$95.00",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2070&auto=format&fit=crop",
    rating: 4.6
  },
  {
    id: 8,
    name: "DYNAMIC SHELL VEST",
    category: "PERFORMANCE",
    price: "$110.00",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
    rating: 4.7
  },
  {
    id: 12,
    name: "AERO-DRY RUNNING SOCKS",
    category: "RUNNING",
    price: "$25.00",
    image: "https://images.unsplash.com/photo-1582966772680-860e372bb558?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Aero-Dry Running Socks",
    rating: 4.9
  }
];

// Helper to resolve Localhost URLs to the correct base URL
const resolveImageUrl = (imgUrl: string) => {
  if (!imgUrl) return "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop";
  if (imgUrl.startsWith("http://localhost:2500")) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://nexapoint-e-com-site-backend.onrender.com";
    return imgUrl.replace("http://localhost:2500", baseUrl);
  }
  return imgUrl;
};

// Mapper to transform the raw backend product structure into our Product interface
const mapBackendProduct = (p: any): Product => {
  let priceStr = "₹0";
  let discountStr: string | undefined = undefined;

  if (p.variants && p.variants.length > 0) {
    const firstVar = p.variants[0];
    if (firstVar.sizes && firstVar.sizes.length > 0) {
      const firstSize = firstVar.sizes[0];
      priceStr = `₹${firstSize.price}`;

      if (firstSize.discountPrice) {
        if (firstSize.discountPrice < 0) {
          discountStr = `${Math.abs(firstSize.discountPrice)}% OFF`;
        } else if (firstSize.discountPrice > 0 && firstSize.discountPrice < firstSize.price) {
          const pct = Math.round(((firstSize.price - firstSize.discountPrice) / firstSize.price) * 100);
          discountStr = `${pct}% OFF`;
        }
      }
    }
  }

  const categoryName =
    typeof p.category === "object" && p.category !== null
      ? p.category.name
      : p.category || p.subCategory || "PERFORMANCE";

  return {
    id: p._id || p.id,
    name: p.productName || "TECHNICAL GEAR",
    category: categoryName.toUpperCase(),
    price: priceStr,
    image: resolveImageUrl(p.productImage?.[0]),
    imageAlt: p.productName || "Technical Gear",
    hoverImage: p.productImage?.[1] ? resolveImageUrl(p.productImage[1]) : undefined,
    rating: p.averageRating || 0,
    isNew: p.bestSellingStatus !== true,
    discount: discountStr,
    badge: p.bestSellingStatus ? "Best Seller" : undefined,
  };
};

const ProductSkeleton = () => (
  <div className="flex flex-col gap-3 animate-pulse">
    <div className="w-full aspect-3/4 bg-surface-soft mb-3" />
    <div className="h-3 w-1/4 bg-surface-soft" />
    <div className="h-5 w-3/4 bg-surface-soft animate-pulse delay-75" />
    <div className="h-4 w-1/3 bg-surface-soft animate-pulse delay-150" />
  </div>
);

const GridSkeleton = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <section className="py-24 bg-background">
    <div className="container">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-16">
        <div>
          <h2 className="heading-brand">{title}</h2>
          {subtitle && <p className="brand-desc">{subtitle}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-7">
        {[...Array(4)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    </div>
  </section>
);

export default function Home() {
  const { data, isLoading, error } = useGetApi<{ data: any[] }>({
    key: "products",
    url: API_ENDPOINTS.PRODUCT.MINIMAL_GET_ALL,
    requireAuth: false,
  });
  // console.log(data?.data, "data")

  // Handle loading state
  if (isLoading) {
    return (
      <>
        <HeroSlider />
        <CategoryGrid />
        <TrustBar />
        <ShopBySport />
        <GridSkeleton
          title="Trending Now"
          subtitle="Experience the latest in high-performance innovation and athletic style."
        />
        <BannerSlider />
        <GridSkeleton
          title="Best Sellers"
          subtitle="Our highest-rated, most demanded gear engineered for everyday excellence."
        />
        <Newsletter />
      </>
    );
  }

  // Gather products with fallbacks in case of query error or empty backend data
  let trendingProductsToShow: any = fallbackTrending;
  let bestSellersToShow: any = fallbackBestSellers;

  if (!error && data?.data && data.data.length > 0) {
    try {
      const mapped = data.data.map(mapBackendProduct);

      const bestSellersList = mapped.filter((p) => p.badge === "Best Seller");
      const trendingList = mapped.filter((p) => p.badge !== "Best Seller");

      if (trendingList.length > 0) {
        trendingProductsToShow = trendingList;
      }
      if (bestSellersList.length > 0) {
        bestSellersToShow = bestSellersList;
      }
    } catch (e) {
      console.error("Error mapping products: ", e);
    }
  }

  return (
    <>
      <HeroSlider />
      <TrustBar />
      <CategoryGrid />
      {/* <ShopBySport /> */}
      <FabricShowcase />
      <ProductGrid
        title="Trending Now"
        subtitle="Experience the latest in high-performance innovation and athletic style."
        products={trendingProductsToShow}
        showRating={false}
      />
      <BannerSlider />
      <ProductGrid
        title="Best Sellers"
        subtitle="Our highest-rated, most demanded gear engineered for everyday excellence."
        products={bestSellersToShow}
      />
      <CountdownDeals />
      <Testimonials />
      {/* <Newsletter /> */}
    </>
  );
}
