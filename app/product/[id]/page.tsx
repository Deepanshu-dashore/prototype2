"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Minus,
  Maximize2,
  Share2,
  Ruler,
  ArrowLeft,
  Heart,
  ShoppingBag,
  Star,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Truck,
  X
} from 'lucide-react';
import { Icon } from '@iconify/react';
import ProductCard, { Product } from '@/components/shared/ProductCard';
import CartPopUpModel from '@/components/shared/CartPopUpModel';
import LoginPopUpModel from '@/components/shared/LoginPopUpModel';
import ReviewModal from '@/components/shared/ReviewModal';
import { useGetApi, useMutationApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import API_ENDPOINTS from '@/app/constants/apiConfig';
import toast from 'react-hot-toast';
import DisportLoader from '@/components/shared/DisportLoader';
import TrustBar from '@/components/home/TrustBar';

// Mock Product Data
const product = {
  id: "1",
  name: "AERO-DRY PERFORMANCE TEE",
  category: "TRAINING / PERFORMANCE",
  price: "$55.00",
  rating: 4.9,
  reviewsCount: 124,
  productDescription: "Engineered for high-intensity training. The Aero-Dry Performance Tee features our signature moisture-wicking technology and laser-cut ventilation zones to keep you cool when the heat is on. Built with a specialized 4-way stretch fabric that moves with your body, ensuring zero restrictions during your most demanding workouts.",
  specification: [
    { _id: "1", name: "Fit", value: "Athletic / Slim" },
    { _id: "2", name: "Material", value: "88% Polyester, 12% Elastane" },
    { _id: "3", name: "Weight", value: "140g (Size M)" },
    { _id: "4", name: "Wash Care", value: "Machine wash cold" },
    { _id: "5", name: "Origin", value: "Imported" },
    { _id: "6", name: "Technology", value: "Aero-Dry™ V2" }
  ],
  productDimensions: "30 x 22 x 1.5 cm",
  itemModelNumber: "DS-PR-001",
  itemWeight: 140,
  genericName: "Sportswear Tee",
  netQuantity: "1 Unit",
  whatsInTheBox: ["1 Performance Tee", "Technical Care Guide"],
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
  variants: [
    {
      id: "v1",
      color: "Stealth Black",
      images: ["https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop"],
      sizes: [
        { id: "s1", size: "XS", stock: 10, price: "$55.00" },
        { id: "s2", size: "S", stock: 5, price: "$55.00" },
        { id: "s3", size: "M", stock: 15, price: "$55.00" },
        { id: "s4", size: "L", stock: 0, price: "$55.00" },
        { id: "s5", size: "XL", stock: 8, price: "$55.00" },
        { id: "s6", size: "XXL", stock: 3, price: "$55.00" }
      ]
    },
    {
      id: "v2",
      color: "Hyper Orange",
      images: ["https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop"],
      sizes: [
        { id: "s7", size: "XS", stock: 0, price: "$55.00" },
        { id: "s8", size: "S", stock: 12, price: "$55.00" },
        { id: "s9", size: "M", stock: 20, price: "$55.00" },
        { id: "s10", size: "L", stock: 5, price: "$55.00" },
        { id: "s11", size: "XL", stock: 0, price: "$55.00" }
      ]
    },
    {
      id: "v3",
      color: "Arctic White",
      images: ["https://images.unsplash.com/photo-1517836012474-3241e397851a?q=80&w=2070&auto=format&fit=crop"],
      sizes: [
        { id: "s12", size: "M", stock: 25, price: "$55.00" },
        { id: "s13", size: "L", stock: 15, price: "$55.00" },
        { id: "s14", size: "XL", stock: 10, price: "$55.00" }
      ]
    }
  ]
};

const SIMILAR_PRODUCTS: Product[] = [
  { id: 2, name: "VELOCITY V2 SNEAKERS", category: "RUNNING", price: "$180.00", image: "/disport_sneakers_product_1778407255046.png", imageAlt: "Velocity V2 Sneakers", rating: 5.0, isNew: true },
  { id: 3, name: "COMPRESSION ARMOR TIGHTS", category: "GYMWEAR", price: "$75.00", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2071&auto=format&fit=crop", imageAlt: "Compression Armor Tights", rating: 4.8 },
  { id: 4, name: "CORE TECH WINDSTOPPER", category: "OUTDOOR", price: "$120.00", image: "https://images.unsplash.com/photo-1511402339625-5942682714cd?q=80&w=2070&auto=format&fit=crop", imageAlt: "Core Tech Windstopper", rating: 4.7, discount: "20% OFF" },
  { id: 5, name: "IGNITE FOAM RUNNERS", category: "RUNNING", price: "$160.00", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=2070&auto=format&fit=crop", imageAlt: "Ignite Foam Runners", rating: 4.9 }
];

interface SizeDetail {
  id: string;
  size: string;
  price: number;
  discountPrice: number;
  stock: number;
}

interface ProductVariant {
  id: string;
  color: string;
  images: string[];
  sizes: SizeDetail[];
}

interface ProductCategory {
  _id: string;
  name: string;
  keywords?: string[];
  isActive?: boolean;
}

interface GetProduct {
  id: string;
  _id?: string;
  productName: string;
  productDescription: string;
  price: string;
  image: string;
  imageAlt: string;
  rating: number;
  isNew?: boolean;
  discount?: string;
  category: string | ProductCategory;
  images?: string[];
  productImage?: string[]; // additional array of images
  variants?: ProductVariant[];
  specification?: any[];
  productDimensions?: any;
  itemModelNumber?: string;
  itemWeight?: number;
  genericName?: string;
  netQuantity?: string;
  reviewsCount?: number;
  whatsInTheBox?: string[];
  returnPolicy?: string[];
  shippingDetails?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  productStatus?: string;
  productQuantity?: number;
  defaultSequence?: string[];
  sizeChart?: string;
  subcategoryShow?: boolean;
  averageRating?: number;
  averageSizeRating?: number;
  averageComfortRating?: number;
  averageQualityRating?: number;
  totalRatings?: number;
  totalReviews?: number;
}

function getCategoryLabel(category: GetProduct["category"]): string {
  if (!category) return "";
  if (typeof category === "string") return category;
  return category.name ?? "";
}

const resolveImageUrl = (imgUrl: string) => {
  if (!imgUrl) return '';
  if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://') || imgUrl.startsWith('/')) {
    return imgUrl;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2500';
  return `${baseUrl}/uploads/product/${imgUrl}`;
};

const parsePrice = (val: string | number | undefined): number => {
  if (val === undefined || val === null) return 0;
  if (typeof val === 'number') return val;
  const cleaned = val.replace(/[₹$,]/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

function getProductGalleryImages(product: GetProduct): string[] {
  if (product.productImage?.length) return product.productImage;
  if (product.images?.length) return product.images;

  const fromVariants = (product.variants ?? []).flatMap(
    (variant) => variant.images ?? []
  );
  const uniqueVariantImages = [...new Set(fromVariants.filter(Boolean))];
  if (uniqueVariantImages.length) return uniqueVariantImages;

  if (product.image) return [product.image];
  return [];
}



function ProductDetailContent() {
  const params = useParams();
  const productId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : undefined;

  const { isAuthenticated, isClient } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch: refetchProduct } = useGetApi<{ data: GetProduct }>({
    key: ["product", productId],
    url: API_ENDPOINTS.PRODUCT.GET_BY_ID(productId ?? ""),
    requireAuth: false,
    options: {
      enabled: Boolean(productId),
    },
  });

  // Fetch real reviews
  const { data: fetchedReviews, refetch: refetchReviews } = useGetApi<{ data: any }>({
    key: ["reviews", productId],
    url: API_ENDPOINTS.REVIEW.GET_BY_PRODUCT(productId ?? ""),
    requireAuth: false,
    options: {
      enabled: Boolean(productId),
    },
  });

  // Fetch wishlist
  const { data: wishlistData } = useGetApi<{ data: any[] }>({
    key: "wishlist",
    url: API_ENDPOINTS.WISHLIST.GET_WISHLIST,
    requireAuth: true,
    options: {
      enabled: isAuthenticated && isClient && Boolean(productId),
    },
  });

  // Wishlist mutation hooks
  const wishlistMutation = useMutationApi({
    key: "wishlist",
    url: API_ENDPOINTS.WISHLIST.ADD_TO_WISHLIST,
    method: "POST",
    requireAuth: true,
    options: {
      onSuccess: () => {
        toast.success("Product added to wishlist!");
        queryClient.invalidateQueries({ queryKey: ["wishlistCount"] });
      },
      onError: (err: any) => {
        console.error("Error adding to wishlist:", err);
        toast.error(err.message || "Failed to add to wishlist");
      },
    },
  });

  const removeFromWishlistMutation = useMutationApi({
    key: "wishlist",
    url: API_ENDPOINTS.WISHLIST.REMOVE_FROM_WISHLIST,
    method: "PATCH",
    requireAuth: true,
    options: {
      onSuccess: () => {
        toast.success("Product removed from wishlist!");
        queryClient.invalidateQueries({ queryKey: ["wishlistCount"] });
      },
      onError: (err: any) => {
        console.error("Error removing from wishlist:", err);
        toast.error(err.message || "Failed to remove from wishlist");
      },
    },
  });

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);

  const [showCartModal, setShowCartModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("description");
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    specifications: false,
    delivery: false,
    details: false
  });
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});
  const [reviewsLoading] = useState(false);
  const [reviewsError] = useState(false);

  const apiProduct = data?.data;

  // Initialize selectedColor and selectedSize when product loads
  useEffect(() => {
    if (!apiProduct) return;

    setSelectedImage(0);
    const variants = apiProduct.variants ?? [];
    if (variants.length > 0) {
      const firstVariant = variants[0];
      const firstAvailableSize =
        firstVariant.sizes?.find((s) => s.stock > 0) ?? firstVariant.sizes?.[0];

      setSelectedColor(firstVariant.color?.trim() ?? "");
      setSelectedSize(firstAvailableSize?.size ?? "M");
    } else {
      setSelectedColor("");
      setSelectedSize("M");
    }
  }, [apiProduct]);

  // Reset selected image when color changes
  useEffect(() => {
    setSelectedImage(0);
  }, [selectedColor]);

  if (isLoading) {
    return <DisportLoader />;
  }

  if (!productId || error || !apiProduct) {
    return (
      <main className="container min-h-[70vh] pt-32 pb-24 flex flex-col items-center justify-center text-center">
        <div className="max-w-md mx-auto px-4 flex flex-col items-center animate-fade-in">
          <div className="w-16 h-16 bg-surface-soft border border-border flex items-center justify-center rounded-none mb-8">
            <Icon icon="solar:danger-triangle-bold" className="w-8 h-8 text-primary-bright" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-none mb-4 font-heading text-text-primary">
            Oops! Product Not Found
          </h1>
          
          <p className="text-sm font-lexend text-text-secondary leading-relaxed mb-10 max-w-sm">
            The performance gear you are looking for might have been retired, sold out, or is temporarily unavailable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.history.back();
                }
              }}
              className="flex-1 sm:flex-none h-14 border border-black bg-transparent text-black hover:bg-black hover:text-white px-8 font-semibold uppercase text-xs tracking-widest transition-all duration-300 flex items-center justify-center gap-2 rounded-none cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Go Back</span>
            </button>
            <Link
              href="/shop"
              className="flex-1 sm:flex-none h-14 bg-primary-bright text-white hover:bg-primary-bright/90 px-8 font-semibold uppercase text-xs tracking-widest transition-all duration-300 flex items-center justify-center gap-2 rounded-none cursor-pointer"
            >
              <ShoppingBag size={16} />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const product = apiProduct;
  const categoryLabel = getCategoryLabel(product.category);
  const variants = product.variants ?? [];
  const specifications = product.specification ?? [];

  // Derive active variant and size
  const selectedVariant = variants.find((v) => v.color?.trim() === selectedColor) || variants[0];
  const selectedSizeObj = selectedVariant?.sizes?.find((s) => s.size === selectedSize) || selectedVariant?.sizes?.[0];

  // Derive gallery images based on selected variant
  const variantImages = selectedVariant?.images ?? [];
  const galleryImages = variantImages.length > 0
    ? variantImages.map(resolveImageUrl)
    : getProductGalleryImages(product).map(resolveImageUrl);

  const mainImage = galleryImages[selectedImage] ?? galleryImages[0];

  // Derive dynamic pricing
  const displayPrice = selectedSizeObj
    ? (selectedSizeObj.discountPrice ?? selectedSizeObj.price)
    : (product.price ?? 0);

  const originalPrice = selectedSizeObj
    ? selectedSizeObj.price
    : (product.price ?? 0);

  const displayPriceNum = parsePrice(displayPrice);
  const originalPriceNum = parsePrice(originalPrice);
  const discountPercent = originalPriceNum && displayPriceNum < originalPriceNum
    ? Math.round(((originalPriceNum - displayPriceNum) / originalPriceNum) * 100)
    : 0;

  // Derive stock status
  const inStock = selectedSizeObj
    ? selectedSizeObj.stock > 0
    : (product.productStatus === "inStock" || (product.productQuantity ?? 0) > 0);

  // Derive variant ID
  const selectvarid = selectedSizeObj?.id ?? null;

  // Wishlist list
  const wishlistItems = wishlistData?.data || [];
  const isInWishlist = wishlistItems.some((item: any) => {
    if (!product._id) return false;
    if (typeof item === 'string') return item === product._id;
    if (item?._id === product._id) return true;
    if (item?.product?._id === product._id) return true;
    if (item?.productId === product._id) return true;
    if (item?.productId?._id === product._id) return true;
    return false;
  });

  const handleWishlistToggle = async () => {
    if (!product?._id) {
      toast.error("Product information is missing");
      return;
    }

    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlistMutation.mutateAsync({
          payload: {
            productId: product._id,
          },
        });
      } else {
        await wishlistMutation.mutateAsync({
          payload: {
            productId: product._id,
          },
        });
      }
    } catch (err) {
      console.error("Failed to toggle wishlist:", err);
    }
  };

  const backendReviews = fetchedReviews?.data || fetchedReviews || [];
  const reviewsList = Array.isArray(backendReviews) ? backendReviews : [];

  const totalReviewsCount = reviewsList.length;

  const averageRatingVal = totalReviewsCount > 0
    ? backendReviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / totalReviewsCount
    : (product.averageRating || product.rating || 0);

  const averageComfortRatingVal = totalReviewsCount > 0
    ? backendReviews.reduce((acc: number, r: any) => acc + (r.comfortRating || 0), 0) / totalReviewsCount
    : (product.averageComfortRating || 0);

  const averageQualityRatingVal = totalReviewsCount > 0
    ? backendReviews.reduce((acc: number, r: any) => acc + (r.qualityRating || 0), 0) / totalReviewsCount
    : (product.averageQualityRating || 0);

  const averageSizeRatingVal = totalReviewsCount > 0
    ? backendReviews.reduce((acc: number, r: any) => acc + (r.sizeRating || 0), 0) / totalReviewsCount
    : (product.averageSizeRating || 0);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section as keyof typeof expandedSections]: !prev[section as keyof typeof expandedSections] }));
  };

  const capitalize = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  const toggleReviewDescription = (id: string) => {
    setExpandedReviews(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openImageCarousel = (media: string[], index: number) => {
    console.log("Opening carousel", media, index);
  };

  const handleAddToBag = () => setShowCartModal(true);

  return (
    <>

      <main className="container pt-32 pb-24">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-text-secondary/40 mb-12">
          <Link href="/" className="hover:text-primary-bright">Home</Link>
          <ChevronRight size={10} />
          <Link href="/shop" className="hover:text-primary-bright">Shop</Link>
          <ChevronRight size={10} />
          <span className="text-text-primary">{product.productName}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">
            {/* Thumbnails */}
            <div className="order-2 md:order-1 flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 aspect-square flex-shrink-0 bg-surface-soft border-2 transition-all duration-300 ${selectedImage === i ? 'border-primary-bright shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <Image src={img} alt={`${product.productName} view ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div 
              onClick={() => setIsImageEnlarged(true)}
              className="order-1 md:order-2 flex-1 relative aspect-[4/5] bg-surface-soft overflow-hidden group cursor-zoom-in"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full"
                >
                  {mainImage ? (
                    <Image
                      src={mainImage}
                      alt={product.productName}
                      fill
                      priority
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-text-secondary">
                      No image available
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <button 
                onClick={(e) => { e.stopPropagation(); setIsImageEnlarged(true); }}
                className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-black hover:text-primary-bright"
              >
                <Maximize2 size={20} />
              </button>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-8">
              <span className="text-primary-bright font-bold uppercase tracking-[0.2em] text-xs mb-3 block">
                {categoryLabel}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-none mb-6">
                {product.productName}
              </h1>

              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
                    ₹{displayPrice}
                  </span>
                  {discountPercent > 0 && (
                    <>
                      <span className="text-sm text-gray-400 line-through">
                        ₹{originalPrice}
                      </span>
                      <span className="text-[10px] font-bold text-primary-bright bg-primary-bright/10 px-2 py-0.5 uppercase tracking-wider">
                        {discountPercent}% OFF
                      </span>
                    </>
                  )}
                </div>
                {totalReviewsCount !== 0 && (
                  <div className="flex items-center gap-1 border-l border-border pl-6">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < Math.round(averageRatingVal) ? "fill-primary-bright text-primary-bright" : "text-border"} />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-text-secondary/60">({totalReviewsCount} REVIEWS)</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-text-secondary text-sm leading-relaxed mb-10 max-w-md">
                {product.productDescription}
              </p>
            </div>

            {/* Colors Section */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-gray-800 font-bold uppercase tracking-widest">Colours</h3>
                {selectedColor && (
                  <div className="text-[10px] text-gray-900 font-bold uppercase tracking-widest bg-surface-soft px-3 py-1">
                    {selectedColor}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {variants.map((variant: ProductVariant, i: number) => {
                  const isSelected = selectedColor === variant.color;
                  const hasStock = variant.sizes?.some(
                    (size) => size.stock > 0
                  );

                  return (
                    <button
                      key={variant.id || i}
                      onClick={() => {
                        setSelectedColor(variant.color);
                        if (variant.sizes && variant.sizes.length > 0) {
                          const firstAvailableSize = variant.sizes.find((size) => size.stock > 0) || variant.sizes[0];
                          setSelectedSize(firstAvailableSize.size);
                        }
                      }}
                      className={`
                        relative w-16 aspect-square border transition-all duration-300
                        ${!hasStock ? "opacity-30 grayscale cursor-not-allowed" : "cursor-pointer hover:border-black"}
                        ${isSelected ? "border-black scale-105 shadow-md" : "border-transparent bg-surface-soft"}
                      `}
                    >
                      <Image
                        src={resolveImageUrl(variant.images?.[0] || product.image || '')}
                        alt={variant.color}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />

                      {isSelected && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-black" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-10">
              {selectedColor && (
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm text-gray-800 font-bold uppercase tracking-widest">Sizes</h3>
                  <div className="text-[10px] text-gray-900 font-bold uppercase tracking-widest bg-surface-soft px-3 py-1">
                    {!selectedSize
                      ? "Select size"
                      : inStock
                        ? "In Stock"
                        : "Out of Stock"}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-6 gap-2 mb-6">
                {selectedVariant?.sizes?.map((sizeObj: SizeDetail) => {
                  const isAvailable = sizeObj.stock > 0;
                  const isSelected = selectedSize === sizeObj.size;

                  return (
                    <button
                      key={sizeObj.id}
                      disabled={!isAvailable}
                      onClick={() => {
                        setSelectedSize(sizeObj.size);
                      }}
                      className={`h-12 flex items-center justify-center font-bold text-xs transition-all border 
                        ${isSelected
                          ? 'bg-black text-white border-black shadow-lg translate-y-[-2px]'
                          : !isAvailable
                            ? 'bg-gray-100 text-gray-300 border-transparent cursor-not-allowed opacity-40 line-through'
                            : 'bg-surface-soft text-black border-transparent hover:border-black/20'}`}
                    >
                      {sizeObj.size}
                    </button>
                  );
                })}
                          {/* Size Guide */}
              <button
                onClick={() => setShowSizeChart(true)}
                className="text-gray-700 text-xs font-normal hover:text-black flex items-center gap-2 group transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-surface-soft rounded-full group-hover:bg-black group-hover:text-white transition-all">
                  <Icon
                    icon="emojione-monotone:straight-ruler"
                    className="w-5 h-5 -rotate-45"
                  />
                </div>
                <span className="underline uppercase tracking-widest font-bold text-[10px]">Size Guide</span>
              </button>
            </div>
 
            {/* Quantity & Add to Cart */}
            <div className="flex flex-col gap-4 mt-auto">
              <div className="flex gap-4">
                <div className="flex items-center bg-surface-soft px-4 h-14">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:text-primary-bright transition-colors cursor-pointer"><Minus size={16} /></button>
                  <span className="w-12 text-center font-bold text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:text-primary-bright transition-colors cursor-pointer"><Plus size={16} /></button>
                </div>
                <button
                  onClick={handleAddToBag}
                  disabled={!inStock}
                  className={`flex-1 font-semibold uppercase flex items-center justify-center space-x-3 transition-all shadow-xl text-sm h-14
                    ${inStock
                      ? "bg-primary-bright text-white hover:bg-primary hover:shadow-primary-bright/20 cursor-pointer"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"}`}
                >
                  <ShoppingBag size={20} />
                  <span>{inStock ? "Add to Bag" : "Out of Stock"}</span>
                </button>
              </div>
              <button
                onClick={handleWishlistToggle}
                className={`h-14 font-semibold uppercase text-sm flex items-center justify-center gap-3 transition-all duration-500 group relative overflow-hidden border cursor-pointer
                  ${isInWishlist
                    ? "bg-black text-white border-black"
                    : "border-black/10 hover:bg-black hover:text-white text-black bg-transparent"}`}
              >
                <Icon
                  icon={isInWishlist ? "solar:heart-bold" : "solar:heart-linear"}
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${isInWishlist ? "text-primary-bright" : ""}`}
                />
                <span>{isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}</span>
                <div className="absolute inset-0 bg-black/5 opacity-0 group-active:opacity-100 transition-opacity" />
              </button>
            </div>

            {/* Trust Badges - Infinite Scrolling Ticker (Pauses on Hover) */}
            <div className="relative mt-5 w-full overflow-hidden rounded-lg bg-surface-soft/80 py-3 px-2 border border-gray-200 select-none">
              {/* Fade gradients on edges for premium visual transition */}
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-surface-soft/80 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-surface-soft/80 to-transparent z-10 pointer-events-none" />
              
              <div className="flex w-max items-center marquee-track whitespace-nowrap">
                {/* Loop 3 times to ensure perfect coverage and continuous looping */}
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-6 md:gap-8 shrink-0">
                    {/* Item 1: Secure Delivery */}
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center text-gray-700 bg-primary-bright/50 rounded-xs p-1">
                        <Icon icon="solar:shield-check-bold" className="w-[16px] h-[16px]" />
                      </div>
                      <span className="text-[11px] font-bold tracking-tight text-text-primary font-lexend uppercase">Secure Delivery</span>
                    </div>
                    
                    <div className="w-[1px] h-4 bg-text-primary/10 self-center" />
                    
                    {/* Item 2: 30-Day Returns */}
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center text-gray-700 bg-primary-bright/50 rounded-xs p-1">
                        <RotateCcw size={14} className="stroke-[2.5]" />
                      </div>
                      <span className="text-[11px] font-bold tracking-tight text-text-primary font-lexend uppercase">30-Day Returns</span>
                    </div>
                    
                    <div className="w-[1px] h-4 bg-text-primary/10 self-center" />
                    
                    {/* Item 3: 2-Year Warranty */}
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center text-gray-700 bg-primary-bright/50 rounded-xs p-1">
                        <ShieldCheck size={14} className="stroke-[2.5]" />
                      </div>
                      <span className="text-[11px] font-bold tracking-tight text-text-primary font-lexend uppercase">2-Year Warranty</span>
                    </div>
                    
                    <div className="w-[1px] h-4 bg-text-primary/10 self-center" />

                    {/* Item 4: Free Shipping */}
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center text-gray-700 bg-primary-bright/50 rounded-xs p-1">
                        <Truck size={14} className="stroke-[2.5]" />
                      </div>
                      <span className="text-[11px] font-bold tracking-tight text-text-primary font-lexend uppercase">Free Shipping</span>
                    </div>
                    
                    <div className="w-[1px] h-4 bg-text-primary/10 self-center mr-6 md:mr-8" />
                  </div>
                ))}
              </div>

              {/* Self-contained style block for high performance CSS animations */}
              <style>{`
                @keyframes marquee {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-33.333%); }
                }
                .marquee-track {
                  display: flex;
                  animation: marquee 25s linear infinite;
                }
                .marquee-track:hover {
                  animation-play-state: paused;
                }
              `}</style>
            </div>
          </div>
        </div>
        </div>

        {/* Product Description & Reviews Section */}
        <div className="mt-40 max-w-7xl mx-auto w-full flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-white">
          <div className="flex items-center gap-8 border-b border-gray-200 px-8 py-4 overflow-x-auto no-scrollbar bg-white">
            {["description", "reviews"].map((item) => (
              <button
                key={item}
                onClick={() => setSelectedTab(item)}
                className={`relative pb-2 text-sm font-semibold transition-all cursor-pointer ${selectedTab === item ? "text-black" : "text-gray-500 hover:text-black"
                  }`}
              >
                {item === "description"
                  ? "Description"
                  : `Reviews (${totalReviewsCount})`}

                {/* underline with motion */}
                {selectedTab === item && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute left-0 bottom-0 h-[2px] w-full bg-black"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {selectedTab === "description" ? (
            <div className="bg-white">
              {/* Description Accordion */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => toggleSection("description")}
                  className="w-full flex items-center justify-between px-8 py-5 hover:bg-gray-50/50 transition-colors"
                >
                  <span className={`text-base font-medium ${expandedSections.description ? "text-primary-bright" : "text-gray-600"}`}>
                    Description
                  </span>
                  <motion.div
                    animate={{ rotate: expandedSections.description ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={20} className={expandedSections.description ? "text-primary-bright" : "text-gray-600"} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedSections.description && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 space-y-6">
                        <p className="text-sm text-gray-600 leading-relaxed max-w-4xl">
                          {product.productDescription}
                        </p>
                        <div className="space-y-3">
                          <h4 className="text-sm font-bold text-gray-800">Key Features:</h4>
                          <ul className="space-y-2 list-disc list-inside">
                            {[
                              "Crafted from premium materials for long-lasting durability.",
                              "Versatile design suitable for multiple purposes.",
                              "Lightweight yet sturdy for comfortable everyday use.",
                              "Available in a variety of colors to suit different styles.",
                              "Backed by a trusted manufacturer warranty."
                            ].map((feature, i) => (
                              <li key={i} className="text-sm text-gray-600 pl-1">
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Specifications Accordion */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => toggleSection("specifications")}
                  className="w-full flex items-center justify-between px-8 py-5 hover:bg-gray-50/50 transition-colors"
                >
                  <span className={`text-base font-medium ${expandedSections.specifications ? "text-primary-bright" : "text-gray-600"}`}>
                    Specifications
                  </span>
                  <motion.div
                    animate={{ rotate: expandedSections.specifications ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={20} className={expandedSections.specifications ? "text-primary-bright" : "text-gray-600"} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedSections.specifications && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8">
                        <div className="border border-gray-200 rounded-sm overflow-hidden max-w-2xl">
                          <table className="w-full text-sm border-collapse">
                            <thead>
                              <tr className="bg-gray-700 text-white">
                                <th className="p-3 text-left w-1/3">Attribute</th>
                                <th className="p-3 text-left">Value</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {specifications.map((spec, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                  <td className="p-3 font-medium text-gray-800 border-r border-gray-200">{spec.name}</td>
                                  <td className="p-3 text-gray-600">{spec.value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Delivery Accordion */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => toggleSection("delivery")}
                  className="w-full flex items-center justify-between px-8 py-5 hover:bg-gray-50/50 transition-colors"
                >
                  <span className={`text-base font-medium ${expandedSections.delivery ? "text-primary-bright" : "text-gray-600"}`}>
                    Delivery & Returns
                  </span>
                  <motion.div
                    animate={{ rotate: expandedSections.delivery ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={20} className={expandedSections.delivery ? "text-primary-bright" : "text-gray-600"} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedSections.delivery && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 space-y-4">
                        <p className="text-sm text-gray-600">
                          Your order of ₹500 or more gets free standard delivery.
                        </p>
                        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                          <li>Standard delivery: 4–5 Business Days</li>
                          <li>Express delivery: 2–4 Business Days</li>
                          <li>Orders are processed Mon–Fri (excluding holidays)</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Technical Details Accordion */}
              <div>
                <button
                  onClick={() => toggleSection("details")}
                  className="w-full flex items-center justify-between px-8 py-5 hover:bg-gray-50/50 transition-colors"
                >
                  <span className={`text-base font-medium ${expandedSections.details ? "text-primary-bright" : "text-gray-600"}`}>
                    Product Details
                  </span>
                  <motion.div
                    animate={{ rotate: expandedSections.details ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={20} className={expandedSections.details ? "text-primary-bright" : "text-gray-600"} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedSections.details && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 space-y-4">
                        <ul className="text-sm text-gray-600 list-disc list-inside space-y-2">
                          <li><span className="font-semibold text-gray-800">Dimensions:</span> {product.productDimensions}</li>
                          <li><span className="font-semibold text-gray-800">Model Number:</span> {product.itemModelNumber}</li>
                          <li><span className="font-semibold text-gray-800">Weight:</span> {product.itemWeight}g</li>
                          <li><span className="font-semibold text-gray-800">Generic Name:</span> {product.genericName}</li>
                          <li><span className="font-semibold text-gray-800">Net Quantity:</span> {product.netQuantity}</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8">
              <div className="space-y-12">
                {/* Average Rating Dashboard */}
                {reviewsList.length > 0 && (
                  <div className="p-8 bg-gray-50/50 border border-gray-100 rounded-sm">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
                      <div className="flex items-center gap-8">
                        <div className="text-6xl font-bold tracking-tighter text-gray-900 border-r border-gray-200 pr-8 font-heading">
                          {averageRatingVal.toFixed(1)}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} size={18} className={star <= Math.round(averageRatingVal) ? "fill-primary-bright text-primary-bright" : "text-gray-200"} />
                            ))}
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                            Based on {totalReviewsCount} Customer Reviews
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setOpenReviewModal(true)}
                        className="bg-black text-white px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-primary-bright transition-all flex items-center gap-3 group"
                      >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Write Performance Review
                      </button>
                    </div>

                    {/* Technical Attribute Sliders */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
                      {[
                        { label: "Comfort", value: averageComfortRatingVal, min: "Firm", max: "Plush" },
                        { label: "Quality", value: averageQualityRatingVal, min: "Standard", max: "Elite" },
                        { label: "Size", value: averageSizeRatingVal, min: "Small", max: "Large" }
                      ].map((attr, i) => (
                        <div key={i} className="space-y-3">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-900">{attr.label}</h4>
                          <div className="relative w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(attr.value / 5) * 100}%` }}
                              className="absolute inset-0 bg-primary-bright"
                            />
                          </div>
                          <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-gray-400">
                            <span>{attr.min}</span>
                            <span>{attr.max}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customer Reviews Feed */}
                <div className="space-y-8">
                  {reviewsList.length > 0 && (
                    <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-8 border-b border-gray-100 pb-4">
                      Latest Assessments
                    </h2>
                  )}

                  {reviewsLoading ? (
                    <div className="text-center py-20 uppercase tracking-[0.4em] text-gray-400 text-[10px] animate-pulse">Loading Feed...</div>
                  ) : reviewsList.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-gray-200 rounded-sm bg-gray-50/50">
                      <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2 font-heading">No Performance Reviews Yet</p>
                      <p className="text-[10px] text-gray-400 max-w-xs mx-auto mb-6">Be the first to share your technical feedback on this high-performance gear!</p>
                      <button
                        onClick={() => setOpenReviewModal(true)}
                        className="inline-flex bg-black text-white px-6 py-3 text-[9px] font-bold uppercase tracking-wider hover:bg-primary-bright transition-all"
                      >
                        Write First Review
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {reviewsList.map((review, index) => {
                        const firstName = review.userId?.firstName || review.firstName || "Verified";
                        const lastName = review.userId?.lastName || review.lastName || "Athlete";
                        const comment = review.comment || "";
                        const ratingVal = review.rating || 5;
                        const media = review.media || [];

                        return (
                          <div key={review._id || index} className="py-10 first:pt-0 group">
                            <div className="flex flex-col md:flex-row gap-8">
                              <div className="md:w-1/4 space-y-4">
                                <div className="space-y-1">
                                  <h5 className="text-[11px] font-bold uppercase tracking-widest text-gray-900 font-heading">
                                    {firstName} {lastName}
                                  </h5>
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star key={star} size={10} className={star <= ratingVal ? "fill-black text-black" : "text-gray-200"} />
                                    ))}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <ShieldCheck size={12} className="text-green-600" />
                                  <span className="text-[8px] font-bold uppercase tracking-widest text-green-600">Verified Athlete</span>
                                </div>
                              </div>

                              <div className="md:w-3/4 space-y-6">
                                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                  "{comment}"
                                </p>

                                {media.length > 0 && (
                                  <div className="flex gap-4">
                                    {media.map((mediaUrl: string, i: number) => (
                                      <div key={i} className="relative w-24 aspect-square rounded-sm overflow-hidden cursor-zoom-in group-hover:shadow-xl transition-all">
                                        <Image src={resolveImageUrl(mediaUrl)} alt="Review" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Similar Products - Editorial Composition */}
        <div className="mt-56 pb-32">
          <div className="flex items-end justify-between mb-20 gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-primary-bright font-bold uppercase tracking-[0.3em] text-[10px]">Gear Upgrade</span>
              <h2 className="text-5xl lg:text-7xl font-bold uppercase tracking-tighter leading-none">Complete The Kit</h2>
            </div>
            <Link href="/shop" className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black">
              <span className="border-b-2 border-black pb-1">Shop Collection</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {SIMILAR_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Brand Trust & Benefits Bar */}
        <div className="border-t border-gray-200 mt-20 pt-12">
          <TrustBar />
        </div>
      </main >

      <CartPopUpModel
        open={showCartModal}
        onClose={() => setShowCartModal(false)}
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        price={displayPrice}
      />

      <LoginPopUpModel
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      <ReviewModal
        open={openReviewModal}
        onClose={() => setOpenReviewModal(false)}
        product={product}
        onReviewAdded={() => {
          refetchReviews();
          refetchProduct();
        }}
      />

      {/* Fullscreen Product Image Lightbox */}
      <AnimatePresence>
        {isImageEnlarged && mainImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsImageEnlarged(false)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50 cursor-pointer"
            >
              <X size={24} />
            </button>

            {/* Navigation buttons */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-colors z-50 cursor-pointer"
                >
                  <ChevronRight size={24} className="rotate-180" />
                </button>
                <button
                  onClick={() => setSelectedImage((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-colors z-50 cursor-pointer"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Image display */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl aspect-[4/5] md:aspect-square max-h-[85vh] overflow-hidden cursor-zoom-out"
              onClick={() => setIsImageEnlarged(false)}
            >
              <Image
                src={mainImage}
                alt={product.productName}
                fill
                priority
                className="object-contain"
              />
            </motion.div>

            {/* Thumbnails indicator at the bottom */}
            <div className="absolute bottom-6 flex gap-2 overflow-x-auto max-w-md no-scrollbar">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-12 h-15 bg-white/5 border-2 transition-all ${
                    selectedImage === idx ? 'border-primary-bright scale-105' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ProductDetailLoading() {
  return (
    <main className="container pt-32 pb-24">
      <div className="text-sm text-text-secondary">Loading product...</div>
    </main>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<ProductDetailLoading />}>
      <ProductDetailContent />
    </Suspense>
  );
}
