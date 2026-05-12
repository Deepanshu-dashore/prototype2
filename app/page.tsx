import Hero from "@/components/home/Hero";
import CategorySection from "@/components/home/CategorySection";
import ProductGrid from "@/components/shared/ProductGrid";
import BrandStory from "@/components/home/BrandStory";
import Newsletter from "@/components/home/Newsletter";

const trendingProducts = [
  {
    id: 1,
    name: "AERO-DRY PERFORMANCE TEE",
    category: "TRAINING",
    price: "$55.00",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
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
    imageAlt: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
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
  }
];

const bestSellers = [
  {
    id: 5,
    name: "IGNITE FOAM RUNNERS",
    category: "RUNNING",
    price: "$160.00",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=2070&auto=format&fit=crop",
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
  }
];

export default function Home() {
  return (
    <>
      <Hero />
      <CategorySection />
      <ProductGrid 
        title="Trending Now" 
        subtitle="The Latest Gear"
        products={trendingProducts} 
      />
      <BrandStory />
      <ProductGrid 
        title="Best Sellers" 
        subtitle="Fan Favorites"
        products={bestSellers} 
      />
      <Newsletter />
    </>
  );
}
