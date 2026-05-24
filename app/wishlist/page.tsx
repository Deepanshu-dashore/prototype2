"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Trash2, Star, ArrowRight, User } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useGetApi, useMutationApi } from "@/hooks/useApi";
import API_ENDPOINTS from "@/app/constants/apiConfig";
import { useAuth } from "@/hooks/useAuth";

interface WishlistVariant {
  color: string;
  sizes: Array<{ id?: string; size: string; price?: number; discountPrice?: number } | string>;
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
  };
}

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated: isLogin, isLoading: authLoading } = useAuth();
  const [selectedVariants, setSelectedVariants] = useState<Record<string, any>>({});
  const [movingToCartItems, setMovingToCartItems] = useState<Set<string>>(new Set());

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
      },
      onError: (error: any) => {
        console.error("Error removing from wishlist:", error);
        toast.error("Failed to remove item");
      },
    }
  });

  // Add to cart mutation
  const { mutate: addToCartMutation } = useMutationApi({
    key: "cart",
    url: API_ENDPOINTS.CART.ADD,
    method: "POST",
    requireAuth: true,
    options: {
      onSuccess: () => {
        toast.success("Added to Bag successfully");
      },
      onError: (error: any) => {
        console.error("Error adding to cart:", error);
        toast.error("Failed to add to cart");
      }
    }
  });

  // Get cart data to check availability
  const { data: cartData } = useGetApi<any>({
    key: "cart",
    url: API_ENDPOINTS.CART.GET_CART,
    requireAuth: true,
    options: {
      enabled: isLogin,
    }
  }) as any;

  const items = useMemo<WishlistItem[]>(() => {
    return wishlistData?.data?.products || wishlistData?.data || [];
  }, [wishlistData]);

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist({ 
      payload: { 
        productId: productId 
      } 
    });
  };

  const handleVariantSelection = (productId: string, color: string, size: any) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: {
        color,
        size: size?.size || size,
        variantId: size?.id || size?._id || size || null,
        price: size?.price || prev[productId]?.price, 
        discountPrice: size?.discountPrice || prev[productId]?.discountPrice
      }
    }));
  };

  // Check if size is available in cart
  const isSizeAvailableInCart = (productId: string, variantId: string) => {
    const cartProducts = cartData?.data?.products || [];
    const cartItem = cartProducts.find((item: any) => 
      (item.productId === productId || item.product?._id === productId) && 
      (item.selectedVariant?.id === variantId || item.selectedVariant?.variantId === variantId)
    );
    return !cartItem; // Return true if not found in cart (available)
  };

  const handleMoveToCart = async (productObj: WishlistItem) => {
    const productId = productObj._id || productObj.product?._id;
    if (!productId) return;

    try {
      const selectedVariant = selectedVariants[productId];
      
      if (!selectedVariant || !selectedVariant.size) {
        toast.error("Please select a size");
        return;
      }

      // Check if size is already in cart
      if (selectedVariant.variantId && !isSizeAvailableInCart(productId, selectedVariant.variantId)) {
        toast.error("This size is already in your cart");
        return;
      }

      // Set loading state for this specific card
      setMovingToCartItems(prev => {
        const next = new Set(prev);
        next.add(productId);
        return next;
      });

      // First remove from wishlist
      await removeFromWishlist({ 
        payload: { 
          productId: productId 
        } 
      });

      // Then add to cart with selected variant
      const variantData = {
        id: selectedVariant.variantId || null,
        price: selectedVariant.price || productObj.productDiscountPrice || productObj.price || productObj.product?.productDiscountPrice || productObj.product?.price || 0,
        discountPrice: selectedVariant.discountPrice || productObj.productDiscountPrice || productObj.product?.productDiscountPrice || 0,
        color: selectedVariant.color,
        size: selectedVariant.size,
      };

      addToCartMutation({
        payload: {
          productId,
          quantity: 1,
          selectedVariant: variantData
        }
      });
      
    } catch (error) {
      console.error("Error moving to cart:", error);
    } finally {
      // Reset loading state for this specific card
      setMovingToCartItems(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  // Auth Guard Rendering
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black" />
      </div>
    );
  }

  if (!isLogin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center py-20 px-6 max-w-md mx-auto">
          {/* Login Icon */}
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          
          {/* Main Message */}
          <h2 className="text-2xl font-bold text-black mb-4">Please Sign In to View Your Wishlist</h2>
          
          {/* Description */}
          <p className="text-gray-600 mb-8">
            Sign in to access your saved items and performance gear collections.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-row sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => router.push("/login")}
              className="bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button 
              onClick={() => router.push("/")}
              className="border border-gray-300 text-gray-700 px-8 py-3 text-sm font-medium hover:border-black hover:text-black transition-colors cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-black antialiased">
      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Header Section */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-primary-bright fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Your Selection</span>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
            My Wishlist <span className="text-gray-200">({wishlistLoading ? "..." : items.length})</span>
          </h1>
        </header>

        {wishlistLoading ? (
          <div className="py-40 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black mx-auto" />
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-4">Loading your wishlist...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item: WishlistItem) => {
              const productId = item._id || item.product?._id || "";
              const productName = item.productName || item.product?.productName || item.name || item.product?.name || "Premium Sportswear Gear";
              const rawDiscountPrice = item.productDiscountPrice || item.price || item.product?.productDiscountPrice || item.product?.price || 0;
              const rawActualPrice = item.productPrice || item.productActualPrice || item.product?.productActualPrice || item.product?.price || 0;
              const imageSrc = item.image || item.product?.image || item.product?.images?.[0] || item.product?.productImage?.[0] || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop";
              const averageRating = item.averageRating || item.product?.averageRating || 4.5;
              const totalReviews = item.totalReviews || item.product?.totalReviews || 0;
              const variants = item.variants || item.product?.variants || [];

              return (
                <motion.div
                  key={productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative bg-[#F9F9F9] border border-gray-100 p-4 transition-all hover:bg-white hover:shadow-2xl hover:shadow-black/5 flex flex-col justify-between"
                >
                  <div>
                    {/* Product Image */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 mb-6">
                      <Image
                        src={imageSrc}
                        alt={productName}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <button 
                        onClick={() => handleRemoveFromWishlist(productId)}
                        className="absolute top-4 right-4 w-10 h-10 bg-white flex items-center justify-center rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-black hover:text-white cursor-pointer z-20"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-sm font-black uppercase tracking-tight leading-tight max-w-[70%]">
                          {productName}
                        </h3>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-black">₹{rawDiscountPrice.toLocaleString()}</p>
                          {rawActualPrice > rawDiscountPrice && (
                            <p className="text-[10px] text-gray-400 line-through">₹{rawActualPrice.toLocaleString()}</p>
                          )}
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-primary-bright text-primary-bright" />
                        <span className="text-[10px] font-bold">{averageRating}</span>
                        <span className="text-[10px] text-gray-400 ml-1">({totalReviews})</span>
                      </div>

                      {/* Technical Variant Selectors */}
                      {variants.length > 0 && (
                        <div className="pt-4 border-t border-gray-100 space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {variants.map((v) => (
                              <button
                                key={v.color}
                                onClick={() => handleVariantSelection(productId, v.color, v.sizes?.[0])}
                                className={`text-[9px] font-black uppercase px-3 py-1 border transition-all cursor-pointer ${
                                  selectedVariants[productId]?.color === v.color
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black"
                                }`}
                              >
                                {v.color}
                              </button>
                            ))}
                          </div>

                          {selectedVariants[productId]?.color && (
                            <div className="flex flex-wrap gap-1">
                              {variants.find(v => v.color === selectedVariants[productId].color)?.sizes?.map((s: any) => {
                                const sizeStr = s?.size || s;
                                return (
                                  <button
                                    key={sizeStr}
                                    onClick={() => handleVariantSelection(productId, selectedVariants[productId].color, s)}
                                    className={`w-8 h-8 flex items-center justify-center text-[10px] font-bold border transition-all cursor-pointer ${
                                      selectedVariants[productId]?.size === sizeStr
                                        ? "bg-black text-white border-black"
                                        : "bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black"
                                    }`}
                                  >
                                    {sizeStr}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Move to Cart overlay */}
                  <button 
                    onClick={() => handleMoveToCart(item)}
                    disabled={movingToCartItems.has(productId)}
                    className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-white bg-black py-4 hover:bg-gray-900 transition-all cursor-pointer flex items-center justify-center gap-2 mt-6 disabled:bg-gray-400"
                  >
                    {movingToCartItems.has(productId) ? "Moving..." : <>Move to Cart <ArrowRight size={14} /></>}
                  </button>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="py-40 text-center">
            <div className="inline-flex w-24 h-24 bg-gray-50 items-center justify-center rounded-full mb-8">
              <Heart size={40} className="text-gray-200" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-4">Your Wishlist is Empty</h2>
            <p className="text-gray-500 mb-12 max-w-sm mx-auto text-sm leading-relaxed">
              Find gear that fits your performance level. Start exploring our technical collections to add items here.
            </p>
            <Link 
              href="/"
              className="inline-flex bg-black text-white px-12 py-5 text-xs font-black uppercase tracking-[0.3em] hover:bg-gray-900 transition-all cursor-pointer"
            >
              Explore Collections
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
