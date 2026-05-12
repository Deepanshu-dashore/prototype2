"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  ChevronRight, 
  Plus, 
  Minus,
  Maximize2,
  Share2,
  Ruler
} from 'lucide-react';
import ProductCard, { Product } from '@/components/shared/ProductCard';
import CartPopUpModel from '@/components/shared/CartPopUpModel';
import LoginPopUpModel from '@/components/shared/LoginPopUpModel';

// Mock Product Data
const MOCK_PRODUCT = {
  id: "1",
  name: "AERO-DRY PERFORMANCE TEE",
  category: "TRAINING / PERFORMANCE",
  price: "$55.00",
  rating: 4.9,
  reviewsCount: 124,
  description: "Engineered for high-intensity training. The Aero-Dry Performance Tee features our signature moisture-wicking technology and laser-cut ventilation zones to keep you cool when the heat is on.",
  details: [
    "Lightweight, breathable 4-way stretch fabric",
    "Anti-odor technology prevents growth of odor-causing microbes",
    "Reflective logos for low-light visibility",
    "Ergonomic flatlock seams for chafe-free movement",
    "Material: 88% Recycled Polyester / 12% Elastane"
  ],
  specs: [
    { label: "Fit", value: "Athletic / Slim" },
    { label: "Material", value: "88% Polyester, 12% Elastane" },
    { label: "Weight", value: "140g (Size M)" },
    { label: "Wash Care", value: "Machine wash cold" },
    { label: "Origin", value: "Imported" },
    { label: "Technology", value: "Aero-Dry™ V2" }
  ],
  images: [
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517836012474-3241e397851a?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2071&auto=format&fit=crop"
  ],
  colors: [
    { name: "Stealth Black", hex: "#1a1c1c" },
    { name: "Hyper Orange", hex: "#ec7700" },
    { name: "Arctic White", hex: "#ffffff" }
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"]
};

const SIMILAR_PRODUCTS: Product[] = [
  { id: 2, name: "VELOCITY V2 SNEAKERS", category: "RUNNING", price: "$180.00", image: "/disport_sneakers_product_1778407255046.png", imageAlt: "Velocity V2 Sneakers", rating: 5.0, isNew: true },
  { id: 3, name: "COMPRESSION ARMOR TIGHTS", category: "GYMWEAR", price: "$75.00", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2071&auto=format&fit=crop", imageAlt: "Compression Armor Tights", rating: 4.8 },
  { id: 4, name: "CORE TECH WINDSTOPPER", category: "OUTDOOR", price: "$120.00", image: "https://images.unsplash.com/photo-1511402339625-5942682714cd?q=80&w=2070&auto=format&fit=crop", imageAlt: "Core Tech Windstopper", rating: 4.7, discount: "20% OFF" },
  { id: 5, name: "IGNITE FOAM RUNNERS", category: "RUNNING", price: "$160.00", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=2070&auto=format&fit=crop", imageAlt: "Ignite Foam Runners", rating: 4.9 }
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [showCartModal, setShowCartModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleAddToBag = () => setShowCartModal(true);
  const handleWishlist = () => setShowLoginModal(true);

  return (
    <>
      
      <main className="container pt-32 pb-24">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-text-secondary/40 mb-12">
          <a href="/" className="hover:text-primary-bright">Home</a>
          <ChevronRight size={10} />
          <a href="/shop" className="hover:text-primary-bright">Shop</a>
          <ChevronRight size={10} />
          <span className="text-text-primary">{MOCK_PRODUCT.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">
            {/* Thumbnails */}
            <div className="order-2 md:order-1 flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar">
              {MOCK_PRODUCT.images.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 aspect-square flex-shrink-0 bg-surface-soft border-2 transition-all duration-300 ${selectedImage === i ? 'border-primary-bright shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <Image src={img} alt={`${MOCK_PRODUCT.name} view ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="order-1 md:order-2 flex-1 relative aspect-[4/5] bg-surface-soft overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full"
                >
                  <Image 
                    src={MOCK_PRODUCT.images[selectedImage]} 
                    alt={MOCK_PRODUCT.name} 
                    fill 
                    priority
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              
              <button className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 size={20} />
                </button>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-8">
              <span className="text-primary-bright font-bold uppercase tracking-[0.2em] text-xs mb-3 block">
                  {MOCK_PRODUCT.category}
                </span>
              <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-none mb-6">
                {MOCK_PRODUCT.name}
              </h1>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="text-3xl font-bold tracking-tight text-black">
                {MOCK_PRODUCT.price}
                </div>
                <div className="flex items-center gap-1 border-l border-border pl-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < 4 ? "fill-primary-bright text-primary-bright" : "text-border"} />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-text-secondary/60">({MOCK_PRODUCT.reviewsCount} REVIEWS)</span>
                </div>
              </div>

              <p className="text-text-secondary text-sm leading-relaxed mb-10 max-w-md">
                {MOCK_PRODUCT.description}
              </p>
            </div>

            {/* Color Selector */}
            <div className="mb-8">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/60 mb-4">
                Color: {MOCK_PRODUCT.colors[selectedColor].name}
              </h4>
                <div className="flex gap-4">
                  {MOCK_PRODUCT.colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(i)}
                    className={`w-10 h-10 rounded-full border-2 transition-all p-1 ${selectedColor === i ? 'border-primary-bright ring-2 ring-primary-bright/20' : 'border-transparent'}`}
                    >
                    <div className="w-full h-full rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: color.hex }} />
                    </button>
                  ))}
                </div>
              </div>

            {/* Size Selector */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/60">Select Size</h4>
                <button className="text-[10px] font-bold uppercase tracking-widest text-primary-bright border-b border-primary-bright pb-0.5">Size Guide</button>
                </div>
              <div className="grid grid-cols-6 gap-2">
                  {MOCK_PRODUCT.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                    className={`h-12 flex items-center justify-center font-bold text-xs transition-all border ${selectedSize === size ? 'bg-black text-white border-black shadow-lg translate-y-[-2px]' : 'bg-surface-soft text-black border-transparent hover:border-black/20'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col gap-4 mt-auto">
                <div className="flex gap-4">
                <div className="flex items-center bg-surface-soft px-4 h-14">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:text-primary-bright transition-colors"><Minus size={16} /></button>
                  <span className="w-12 text-center font-bold text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:text-primary-bright transition-colors"><Plus size={16} /></button>
                  </div>
                  <button 
                    onClick={handleAddToBag}
                  className="flex-1 bg-primary-bright text-white font-bold uppercase tracking-[0.15em] flex items-center justify-center space-x-3 hover:bg-primary transition-all shadow-xl hover:shadow-primary-bright/20"
                  >
                    <ShoppingBag size={20} />
                    <span>Add to Bag</span>
                  </button>
                </div>
                <button 
                  onClick={handleWishlist}
                className="h-14 border-2 border-black font-bold uppercase tracking-[0.15em] flex items-center justify-center space-x-3 hover:bg-black hover:text-white transition-all"
                >
                <Heart size={20} />
                  <span>Add to Wishlist</span>
                </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-border">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck size={20} className="text-text-secondary/60" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-text-secondary/60">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw size={20} className="text-text-secondary/60" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-text-secondary/60">30-Day Returns</span>
                </div>
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck size={20} className="text-text-secondary/60" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-text-secondary/60">2-Year Warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Tabs Section */}
        <div className="mt-40">
          <div className="flex border-b border-border mb-16 overflow-x-auto no-scrollbar">
            {['details', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-10 py-6 font-bold uppercase tracking-[0.3em] text-[10px] transition-all relative ${activeTab === tab ? 'text-black' : 'text-text-secondary/40 hover:text-black'}`}
              >
                {tab}
                {activeTab === tab && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-bright" />}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {activeTab === 'details' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <div className="space-y-10">
                      <h3 className="text-3xl font-bold uppercase tracking-tighter">Engineered For Motion</h3>
                      <p className="text-text-secondary text-sm leading-relaxed max-w-xl">
                        The Aero-Dry™ technology is built for the athlete who doesn't compromise. Every fiber is treated to handle peak perspiration levels while maintaining a feather-light feel against the skin.
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                        {MOCK_PRODUCT.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-4 p-4 bg-surface-soft group hover:bg-black transition-all">
                            <Plus size={14} className="text-primary-bright mt-1 group-hover:rotate-90 transition-transform" />
                            <span className="text-text-secondary group-hover:text-white text-[11px] font-bold uppercase tracking-wider">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="relative aspect-video bg-surface-soft overflow-hidden">
                      <Image src="https://images.unsplash.com/photo-1517836012474-3241e397851a?q=80&w=2070&auto=format&fit=crop" alt="Lab Test" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold uppercase tracking-[0.4em] bg-black/40 backdrop-blur-md px-6 py-2">View Lab Video</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'specifications' && (
               <div className="max-w-2xl">
                  <div className="grid grid-cols-2 py-4 border-b border-border">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/60">Fit</span>
                    <span className="text-sm font-bold">Athletic / Slim</span>
                          </div>
                  <div className="grid grid-cols-2 py-4 border-b border-border">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/60">Material</span>
                    <span className="text-sm font-bold">88% Polyester, 12% Elastane</span>
                  </div>
                  <div className="grid grid-cols-2 py-4 border-b border-border">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/60">Weight</span>
                    <span className="text-sm font-bold">140g (Size M)</span>
                  </div>
                  <div className="grid grid-cols-2 py-4 border-b border-border">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/60">Wash Care</span>
                    <span className="text-sm font-bold">Machine wash cold, tumble dry low</span>
                     </div>
                   </div>
                )}

                {activeTab === 'reviews' && (
              <div className="text-center py-20 bg-surface-soft border-2 border-dashed border-border">
                <h3 className="text-xl font-bold uppercase tracking-tight mb-2">No Reviews Yet</h3>
                <p className="text-text-secondary text-sm mb-8">Be the first to test this gear and share your feedback.</p>
                <button className="bg-black text-white px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-primary-bright transition-colors">Write a Review</button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Similar Products - Editorial Composition */}
        <div className="mt-56">
          <div className="flex items-end justify-between mb-20 gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-primary-bright font-bold uppercase tracking-[0.3em] text-[10px]">Gear Upgrade</span>
              <h2 className="text-5xl lg:text-7xl font-bold uppercase tracking-tighter leading-none">Complete The Kit</h2>
            </div>
            <a href="/shop" className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black">
              <span className="border-b-2 border-black pb-1">Shop Collection</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {SIMILAR_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>

      <CartPopUpModel 
        open={showCartModal} 
        onClose={() => setShowCartModal(false)} 
        product={MOCK_PRODUCT}
        selectedSize={selectedSize}
        price={MOCK_PRODUCT.price}
      />

      <LoginPopUpModel 
        open={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
}
