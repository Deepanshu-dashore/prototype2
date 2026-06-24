"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowRight, User } from "lucide-react";
import { toast } from "react-hot-toast";
import ProductCard, { Product } from "@/components/shared/ProductCard";
import { useRouter } from "next/navigation";
import { useGetApi, useMutationApi } from "@/hooks/useApi";
import API_ENDPOINTS from "@/app/constants/apiConfig";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

interface WishlistVariant {
  color: string;
  sizes: Array<{ id?: string; size: string; price?: number; discountPrice?: number; stock?: number } | string>;
}

interface WishlistItem {
  _id: string;
  productName?: string;
  name?: string;
  productPrice?: number;
  productActualPrice?: number;
  productDiscountPrice?: number;
  price?: number;
  averageRating?: number;
  totalReviews?: number;
  image?: string;
  images?: string[];
  productImage?: string[];
  variants?: WishlistVariant[];
  category?: string | { name: string };
  description?: string;
  product?: {
    _id: string;
    productName?: string;
    name?: string;
    productActualPrice?: number;
    productDiscountPrice?: number;
    price?: number;
    averageRating?: number;
    totalReviews?: number;
    image?: string;
    images?: string[];
    productImage?: string[];
    variants?: WishlistVariant[];
    category?: string | { name: string };
    description?: string;
  };
}

function getCategoryLabel(category?: string | { name: string }): string {
  if (!category) return "";
  if (typeof category === "string") return category;
  return category.name ?? "";
}

export default function WishlistPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated: isLogin, isLoading: authLoading } = useAuth();
  // Fetch Wishlist Data
  const { data: wishlistData, isLoading: wishlistLoading, refetch: refetchWishlist } = useGetApi<any>({
    key: "wishlist",
    url: API_ENDPOINTS.WISHLIST.GET_WISHLIST,
    requireAuth: true,
    options: {
      enabled: isLogin,
    }
  }) as any;

  // Remove from wishlist mutation
  const { mutate: removeFromWishlist } = useMutationApi({
    key: "wishlist",
    url: API_ENDPOINTS.WISHLIST.REMOVE_FROM_WISHLIST,
    method: "PATCH",
    requireAuth: true,
    options: {
      onSuccess: () => {
        refetchWishlist();
        toast.success("Item removed from wishlist");
        queryClient.invalidateQueries({ queryKey: ["wishlistCount"] });
      },
      onError: (error: any) => {
        console.error("Error removing from wishlist:", error);
        toast.error("Failed to remove item");
      },
    }
  });

  const items = useMemo<WishlistItem[]>(() => {
    return wishlistData?.data?.products || wishlistData?.data || [];
  }, [wishlistData]);

  const handleRemoveFromWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromWishlist({ 
      payload: { productId } 
    });
  };

  // Auth Guard
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black" />
      </div>
    );
  }

  if (!isLogin) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-surface-soft flex items-center justify-center mx-auto mb-8">
            <User className="w-8 h-8 text-gray-300" />
          </div>
          <h2 className="text-xl font-medium text-text-primary mb-2 font-heading">
            Save Your Favourites
          </h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            Want to save the items that you love? Just click on the heart to add it to your wishlist.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => router.push("/login")}
              className="bg-black text-white px-10 py-3.5 text-xs font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button 
              onClick={() => router.push("/register")}
              className="border border-black text-black px-10 py-3.5 text-xs font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-text-primary antialiased">
      <main className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-32 pb-24">
        
        {/* Page Header — Nike style: clean, left-aligned, title + count */}
        <div className="mb-10">
          <h1 className="text-2xl font-medium text-black font-heading">
            Favourites {!wishlistLoading && <span className="text-gray-400 font-normal">({items.length})</span>}
          </h1>
        </div>

        {wishlistLoading ? (
          <div className="py-40 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black mb-4" />
            <p className="text-xs text-gray-400 uppercase tracking-widest">Loading...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {items.map((item: WishlistItem, index: number) => {
              const productId = item._id || item.product?._id || "";
              const productName = item.productName || item.product?.productName || item.name || item.product?.name || "Product";
              const rawDiscountPrice = item.productDiscountPrice || item.price || item.product?.productDiscountPrice || item.product?.price || 0;
              const rawActualPrice = item.productPrice || item.productActualPrice || item.product?.productActualPrice || item.product?.price || 0;
              const imageSrc = item.image || item.product?.image || item.product?.images?.[0] || item.product?.productImage?.[0] || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop";
              const averageRating = item.averageRating || item.product?.averageRating || 0;
              const variants = item.variants || item.product?.variants || [];
              const categoryLabel = getCategoryLabel(item.category || item.product?.category);
              const hasDiscount = rawActualPrice > rawDiscountPrice;
              const discountPercent = hasDiscount ? Math.round(((rawActualPrice - rawDiscountPrice) / rawActualPrice) * 100) : 0;

              return (
                <motion.div
                  key={productId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard
                    product={{
                      id: productId,
                      name: productName,
                      category: categoryLabel.toUpperCase() || "PERFORMANCE",
                      description: item.product?.description || item.description || "",
                      price: hasDiscount ? `₹${rawActualPrice}` : `₹${rawDiscountPrice}`,
                      image: imageSrc,
                      imageAlt: productName,
                      rating: averageRating,
                      discount: hasDiscount ? `${discountPercent}% OFF` : undefined,
                      variants: variants
                    }}
                    isWishlistActive={true}
                    onWishlistToggle={(e) => handleRemoveFromWishlist(e, productId)}
                    disableVariants={true}
                  />
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Empty State — Nike style: clean, centered, minimal */
          <div className="py-32 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-8">
              <Heart size={36} className="text-gray-200" />
            </div>
            <h2 className="text-xl font-medium text-black mb-3 font-heading">
              Items Added to Your Favourites Will Be Saved Here
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-10">
              Find something you love? Tap the heart icon on any product to save it to your favourites.
            </p>
            <Link 
              href="/shop"
              className="bg-black text-white px-12 py-4 text-xs font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <span>Shop Now</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
