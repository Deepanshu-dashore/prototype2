"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Ruler, ShoppingBag } from 'lucide-react';
import { Icon } from '@iconify/react';
import QuickViewModal from './QuickViewModal';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export interface Product {
  id: number | string;
  name: string;
  category: string;
  price: string;
  image: string;
  imageAlt: string;
  hoverImage?: string;
  rating: number;
  isNew?: boolean;
  discount?: string;
  badge?: string;
  variants?: any[];
  description?: string;
  productDescription?: string;
}

interface ProductCardProps {
  product: Product;
  className?: string;
  showRating?: boolean;
  disableVariants?: boolean;
  isWishlistActive?: boolean;
  onWishlistToggle?: (e: React.MouseEvent, productId: string | number) => void;
}

/* Color map for rendering swatches */
const COLOR_MAP: Record<string, string> = {
  black: "#000000",
  white: "#FFFFFF",
  red: "#D32F2F",
  blue: "#1565C0",
  navy: "#0D1B3E",
  green: "#2E7D32",
  yellow: "#F9A825",
  orange: "#E65100",
  pink: "#C2185B",
  purple: "#7B1FA2",
  grey: "#9E9E9E",
  gray: "#9E9E9E",
  brown: "#5D4037",
  beige: "#D7C9AA",
  cream: "#FFFDD0",
  maroon: "#800000",
  olive: "#556B2F",
  teal: "#00796B",
  coral: "#FF7043",
  gold: "#C9A84C",
};

function resolveColor(colorName: string): string {
  const name = colorName.toLowerCase().trim();
  if (COLOR_MAP[name]) return COLOR_MAP[name];
  const key = Object.keys(COLOR_MAP).find(k => name.includes(k));
  if (key) return COLOR_MAP[key];
  return "#CCCCCC";
}

const resolveImageUrl = (imgUrl: string) => {
  if (!imgUrl) return "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop";
  
  let url = imgUrl;
  if (!imgUrl.startsWith("http://") && !imgUrl.startsWith("https://") && !imgUrl.startsWith("/")) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://nexapoint-e-com-site-backend.onrender.com";
    url = `${baseUrl}/uploads/product/${imgUrl}`;
  }

  if (url.startsWith("http://localhost:2500")) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://nexapoint-e-com-site-backend.onrender.com";
    return url.replace("http://localhost:2500", baseUrl);
  }
  return url;
};

const formatTitle = (title: string) => {
  if (!title) return "";
  return title
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (word === "gv" || word === "v2" || word === "v3") return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

const formatCategory = (cat: string) => {
  if (!cat) return "";
  return cat
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const parsePrice = (val: string | number | undefined): number => {
  if (val === undefined || val === null) return 0;
  if (typeof val === 'number') return val;
  const cleaned = val.replace(/[₹$,]/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

const loadingIcons = [
  "mdi:soccer", "mdi:basketball", "mdi:tennis", "mdi:cricket", 
  "mdi:badminton", "mdi:volleyball", "mdi:golf", "mdi:swimming",
  "mdi:running", "mdi:cycling", "mdi:boxing", "mdi:martial-arts",
];

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  className = "", 
  showRating = true,
  disableVariants = false,
  isWishlistActive = false,
  onWishlistToggle
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { addToCartSingle } = useCart();
  const { isAuthenticated } = useAuth();

  // Initialize selectedColor and selectedSize when product loads or changes
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      const firstVar = product.variants[0];
      setSelectedColor(firstVar.color?.trim() || "");
      const firstAvailableSize = firstVar.sizes?.find((s: any) => s.stock > 0) || firstVar.sizes?.[0];
      setSelectedSize(firstAvailableSize?.size || "");
    } else {
      setSelectedColor("");
      setSelectedSize("");
    }
  }, [product]);

  // Derive current active variant and its images
  const activeVariant = product.variants?.find(
    (v: any) => v.color?.trim() === selectedColor
  ) || product.variants?.[0];

  const activeSizeObj = activeVariant?.sizes?.find(
    (s: any) => s.size === selectedSize
  ) || activeVariant?.sizes?.[0];

  const isVariantAvailable = activeSizeObj ? activeSizeObj.stock > 0 : true;

  const displayImage = activeVariant?.images?.[0]
    ? resolveImageUrl(activeVariant.images[0])
    : resolveImageUrl(product.image);

  let resolvedHover: string | undefined = undefined;
  if (activeVariant) {
    if (activeVariant.images && activeVariant.images.length > 1) {
      resolvedHover = resolveImageUrl(activeVariant.images[1]);
    } else {
      const otherVar = product.variants?.find((v: any) => v.color?.trim() !== selectedColor && v.images?.[0]);
      if (otherVar) {
        resolvedHover = resolveImageUrl(otherVar.images[0]);
      } else if (product.hoverImage) {
        resolvedHover = resolveImageUrl(product.hoverImage);
      }
    }
  } else if (product.hoverImage) {
    resolvedHover = resolveImageUrl(product.hoverImage);
  }

  const displayHoverImage = resolvedHover === displayImage ? undefined : resolvedHover;

  const getDisplayPrice = () => {
    if (activeVariant) {
      if (activeSizeObj) {
        const price = activeSizeObj.price;
        const discountPrice = activeSizeObj.discountPrice;
        const hasDiscount = discountPrice && discountPrice < price;
        const currencySymbol = product.price.includes('₹') ? '₹' : '$';

        if (hasDiscount) {
          return (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[14px] font-bold text-black tracking-tight font-heading">
                {currencySymbol}{discountPrice.toLocaleString()}
              </span>
              <span className="text-[11px] text-gray-400 line-through tracking-tight font-normal">
                {currencySymbol}{price.toLocaleString()}
              </span>
            </div>
          );
        } else {
          return (
            <span className="text-[14px] font-bold text-black tracking-tight font-heading">
              {currencySymbol}{price.toLocaleString()}
            </span>
          );
        }
      }
    }

    if (product.discount) {
      return (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-gray-400 line-through tracking-tight font-normal">
            {product.price}
          </span>
          <span className="text-[14px] font-bold text-black tracking-tight font-heading">
            {(() => {
              const price = parseFloat(product.price.replace('$', '').replace('₹', ''));
              const discount = parseFloat(product.discount.replace('% OFF', ''));
              if (!isNaN(price) && !isNaN(discount)) {
                const symbol = product.price.includes('₹') ? '₹' : '$';
                return `${symbol}${Math.round(price * (1 - discount / 100)).toLocaleString()}`;
              }
              return product.price;
            })()}
          </span>
        </div>
      );
    }

    return (
      <span className="text-[14px] font-bold text-black tracking-tight font-heading">
        {product.price}
      </span>
    );
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to add items to your bag");
      return;
    }

    if (!isVariantAvailable) {
      toast.error("This variant size is out of stock");
      return;
    }

    try {
      setIsAddingToCart(true);
      const variantData = {
        id: activeSizeObj?.id || activeSizeObj?._id || "",
        price: parsePrice(activeSizeObj?.discountPrice ?? activeSizeObj?.price),
        discountPrice: parsePrice(activeSizeObj?.discountPrice ?? activeSizeObj?.price),
        color: selectedColor || activeVariant?.color || "",
        size: selectedSize || activeSizeObj?.size || "",
      };

      await addToCartSingle({
        productId: String(product.id || (product as any)._id),
        quantity: 1,
        selectedVariant: variantData,
        image: activeVariant?.images?.[0] || product.image
      });

      toast.success("Added to Bag successfully");
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      toast.error(err?.message || "Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const renderBrandLogo = () => {
    const nameLower = product.name.toLowerCase();
    if (nameLower.includes("puma")) {
      return (
        <svg className="w-8 h-8 text-black opacity-80" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 17.5c2.5-1.5 5.5-1.5 8 0 1-.5 2-1.5 3-3 .5-.8 1-2.2.5-3.5-.5-1.3-1.8-2.2-3.2-2-1.2.2-2 .8-2.8 1.5-.5-.8-1.2-1.5-2.2-1.8-1-.3-2.2 0-3 1-.8-.8-2-1.2-3.2-.8C1.5 9 1 10 1 11.2c0 2 1.5 4 3.5 5.5v.8z" />
        </svg>
      );
    }
    if (nameLower.includes("nike")) {
      return (
        <svg className="w-8 h-4 text-black opacity-80" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 10.5c5-1.5 11-1.5 16-5.5 1-1 2-.5 1 .5-2 2-6.5 6.5-11 9-2.5 1.5-4 1.5-6.5.5-1-.4-1-.1.5-1z" />
        </svg>
      );
    }
    return (
      <div className="flex items-center gap-1 opacity-70">
        <span className="font-heading text-[10px] font-bold tracking-[0.2em] text-black">D-SPORT</span>
      </div>
    );
  };

  return (
    <>
      <Link 
        href={`/product/${product.id}`}
        className={`group flex flex-col cursor-pointer font-public transition-all duration-300 ${className}`}
      >
        {/* Image Container */}
        <div 
          className="relative aspect-3/4 w-full overflow-hidden bg-surface-soft mb-3 transition-all duration-500 rounded-xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Brand Logo overlay */}
          <div className="absolute top-4 left-4 z-10">
            {renderBrandLogo()}
          </div>

          {/* Badges overlay */}
          <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
            {product.isNew && (
              <span className="bg-black text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest rounded-xs shadow-xs">
                New Launch
              </span>
            )}
            {product.discount && (
              <span className="bg-[#ba1a1a] text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest rounded-xs shadow-xs">
                {product.discount}
              </span>
            )}
            {product.badge && (
              <span className="bg-white text-black border border-gray-200 text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest rounded-xs shadow-xs">
                {product.badge}
              </span>
            )}
          </div>

          {/* Base Image */}
          <Image
            src={displayImage}
            alt={product.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-all duration-1000 ease-out ${
              isHovered && displayHoverImage ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
            }`}
          />

          {/* Hover Image */}
          {displayHoverImage && (
            <Image
              src={displayHoverImage}
              alt={product.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover transition-all duration-1000 ease-out absolute inset-0 ${
                isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            />
          )}


          
          {/* Wishlist Button */}
          <button 
            type="button"
            className={`absolute cursor-pointer top-4 right-4 z-20 p-2.5 rounded-full transition-all duration-300 translate-y-[-10px] group-hover:translate-y-0 ${
              isWishlistActive 
                ? "bg-white text-primary-bright shadow-sm opacity-100" 
                : "bg-black/15 backdrop-blur-[1px] text-white hover:bg-primary-bright/60 hover:text-white opacity-0 group-hover:opacity-100"
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onWishlistToggle) {
                onWishlistToggle(e, product.id);
              }
            }}
          >
            <Heart size={16} className={isWishlistActive ? "fill-current" : ""} />
          </button>

          {/* Quick View Bar on Hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-0 left-0 right-0 bg-[#2d2724]/90 py-3.5 z-10 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsQuickViewOpen(true);
                }}
              >
                <div className="text-white text-center font-heading text-xs font-bold uppercase tracking-[0.2em]">
                  Quick View
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Product Details */}
        <div className="flex flex-col pb-2 gap-1">
          {/* Title */}
          <h3 className="text-[16px] font-bold text-black tracking-tight leading-tight line-clamp-1 font-heading">
            {formatTitle(product.name)}
          </h3>

          {/* Category & Color dots horizontally aligned */}
          <div className="flex justify-between items-center min-h-[20px] w-full gap-2">
            <span className="text-[12px] text-gray-500 font-normal line-clamp-1 flex-1">
              {product.productDescription || product.description || product.category}
            </span>
            
            {/* Color swatches */}
            {!disableVariants && product.variants && product.variants.length > 0 && (
              <div className="flex items-center gap-1">
                {product.variants.map((v: any, index: number) => {
                  const hexColor = resolveColor(v.color);
                  const isActive = selectedColor === v.color?.trim();
                  return (
                    <button
                      key={v.color || index}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedColor(v.color?.trim());
                        const firstAvailableSize = v.sizes?.find((s: any) => s.stock > 0) || v.sizes?.[0];
                        setSelectedSize(firstAvailableSize?.size || "");
                      }}
                      className={`w-3 h-3 rounded-full border transition-all cursor-pointer ${
                        isActive ? "border-black scale-110 ring-1 ring-black/40" : "border-gray-300 hover:scale-110"
                      }`}
                      style={{ backgroundColor: hexColor }}
                      title={v.color}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Rating */}
          {showRating && product.rating > 0 && (
            <div className="flex items-center gap-[1px] mt-0.5">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  size={10}
                  className={`${
                    index < Math.floor(product.rating)
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-gray-200 fill-gray-200'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Size Selector */}
          {!disableVariants && product.variants && product.variants.length > 0 && activeVariant && (
            <div className="flex flex-col mt-2">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-semibold text-gray-700">
                <span>Select Size</span>
                <button 
                  type="button"
                  className="text-gray-400 hover:text-black flex items-center gap-1 underline decoration-1 decoration-gray-350 hover:decoration-black underline-offset-2 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <Ruler size={10} className="-rotate-45" />
                  <span className="text-[9px]">Size Guide</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {activeVariant.sizes?.map((sObj: any) => {
                  const isAvailable = sObj.stock > 0;
                  const isSelected = selectedSize === sObj.size;
                  return (
                    <button
                      key={sObj.size}
                      type="button"
                      disabled={!isAvailable}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedSize(sObj.size);
                      }}
                      className={`w-9 h-8 flex items-center justify-center text-[10px] font-bold border transition-all rounded-md cursor-pointer ${
                        isSelected
                          ? "bg-black text-white border-black"
                          : !isAvailable
                          ? "bg-gray-55 text-gray-300 border-gray-150 cursor-not-allowed line-through"
                          : "bg-white text-gray-600 border-gray-200 hover:border-black"
                      }`}
                    >
                      {sObj.size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom row: Price and Add to Cart */}
          <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200/80">
            <div>
              {getDisplayPrice()}
            </div>
            
            <button
              type="button"
              disabled={isAddingToCart || !isVariantAvailable}
              onClick={handleAddToCart}
              className="bg-linear-to-l from-[#ec7700] to-[#ff9e3b] hover:from-[#ff9e3b] hover:to-[#ec7700] text-white px-4 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md hover:shadow-orange-500/10 disabled:from-gray-400 disabled:to-gray-400"
            >
              {isAddingToCart ? (
                <div className="w-20 overflow-hidden relative flex items-center justify-center">
                  <motion.div
                    className="flex items-center gap-4.5 whitespace-nowrap"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ ease: "linear", duration: 4, repeat: Infinity }}
                  >
                    {[...loadingIcons, ...loadingIcons].map((icon, idx) => (
                      <Icon 
                        key={idx}
                        icon={icon}
                        className="text-white w-[15px] h-[15px] shrink-0"
                      />
                    ))}
                  </motion.div>
                </div>
              ) : !isVariantAvailable ? (
                <span>Out of Stock</span>
              ) : (
                <>
                  <ShoppingBag size={12} />
                  <span>Add to cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Link>
      <QuickViewModal 
        product={product} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </>
  );
};

export default ProductCard;

