"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Star, ArrowRight, User, ShoppingBag } from "lucide-react";
import { toast } from "react-hot-toast";
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
  const [selectedVariants, setSelectedVariants] = useState<Record<string, any>>({});
  const [movingToCartItems, setMovingToCartItems] = useState<Set<string>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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
  const { mutate: removeFromWishlist, mutateAsync: removeFromWishlistAsync } = useMutationApi({
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

  // Add to cart mutation
  const { mutateAsync: addToCartMutationAsync } = useMutationApi({
    key: "cart",
    url: API_ENDPOINTS.CART.ADD,
    method: "POST",
    requireAuth: true,
    options: {
      onSuccess: () => {
        toast.success("Added to Bag successfully");
        queryClient.invalidateQueries({ queryKey: ["cartCount"] });
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

  const handleRemoveFromWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromWishlist({ 
      payload: { productId } 
    });
  };

  const handleVariantSelection = (e: React.MouseEvent, productId: string, color: string, size: any) => {
    e.preventDefault();
    e.stopPropagation();
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
    return !cartItem;
  };

  const handleMoveToCart = async (e: React.MouseEvent, productObj: WishlistItem) => {
    e.preventDefault();
    e.stopPropagation();
    const productId = productObj._id || productObj.product?._id;
    if (!productId) return;

    try {
      const selectedVariant = selectedVariants[productId];
      
      if (!selectedVariant || !selectedVariant.size) {
        toast.error("Please select a size first");
        return;
      }

      if (selectedVariant.variantId && !isSizeAvailableInCart(productId, selectedVariant.variantId)) {
        toast.error("This size is already in your bag");
        return;
      }

      setMovingToCartItems(prev => {
        const next = new Set(prev);
        next.add(productId);
        return next;
      });

      await removeFromWishlistAsync({ 
        payload: { productId } 
      });

      const variantData = {
        id: selectedVariant.variantId || null,
        price: selectedVariant.price || productObj.productDiscountPrice || productObj.price || productObj.product?.productDiscountPrice || productObj.product?.price || 0,
        discountPrice: selectedVariant.discountPrice || productObj.productDiscountPrice || productObj.product?.productDiscountPrice || 0,
        color: selectedVariant.color,
        size: selectedVariant.size,
      };

      await addToCartMutationAsync({
        payload: {
          productId,
          quantity: 1,
          selectedVariant: variantData
        }
      });
      
    } catch (error) {
      console.error("Error moving to cart:", error);
    } finally {
      setMovingToCartItems(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
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
              const totalReviews = item.totalReviews || item.product?.totalReviews || 0;
              const variants = item.variants || item.product?.variants || [];
              const categoryLabel = getCategoryLabel(item.category || item.product?.category);
              const isHovered = hoveredCard === productId;
              const isMoving = movingToCartItems.has(productId);
              const hasDiscount = rawActualPrice > rawDiscountPrice;
              const discountPercent = hasDiscount ? Math.round(((rawActualPrice - rawDiscountPrice) / rawActualPrice) * 100) : 0;

              return (
                <motion.div
                  key={productId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`/product/${productId}`}
                    className="group flex flex-col cursor-pointer"
                    onMouseEnter={() => setHoveredCard(productId)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Image Container — matches ProductCard aspect-3/4 */}
                    <div className="relative aspect-3/4 w-full overflow-hidden bg-surface-soft mb-3">
                      <Image
                        src={imageSrc}
                        alt={productName}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Discount Badge — top-left, Puma style */}
                      {hasDiscount && (
                        <div className="absolute top-0 left-0 z-10">
                          <span className="bg-[#ba1a1a] text-white text-[11px] font-bold px-3 py-1.5 uppercase tracking-wider">
                            {discountPercent}% Off
                          </span>
                        </div>
                      )}

                      {/* Wishlist Heart — top-right, filled heart to indicate saved, click to remove */}
                      <button 
                        onClick={(e) => handleRemoveFromWishlist(e, productId)}
                        className="absolute top-3 right-3 z-20 p-2.5 bg-white/80 backdrop-blur-sm text-primary-bright hover:bg-primary-bright hover:text-white transition-all duration-300 cursor-pointer"
                        title="Remove from Favourites"
                      >
                        <Heart size={16} className="fill-current" />
                      </button>

                      {/* "Move to Bag" overlay on hover — Nike style */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.25 }}
                            className="absolute bottom-0 left-0 right-0 z-10"
                          >
                            <button
                              onClick={(e) => handleMoveToCart(e, item)}
                              disabled={isMoving}
                              className="w-full bg-black/90 hover:bg-black text-white py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:bg-gray-400"
                            >
                              {isMoving ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                <>
                                  <ShoppingBag size={14} />
                                  <span>Move to Bag</span>
                                </>
                              )}
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Product Details — matches ProductCard layout exactly */}
                    <div className="flex flex-col gap-1 px-0.5">
                      {/* Category */}
                      {categoryLabel && (
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-normal">
                          {categoryLabel}
                        </span>
                      )}

                      {/* Product Name */}
                      <h3 className="text-[15px] font-medium text-black tracking-tight leading-snug line-clamp-1">
                        {productName}
                      </h3>

                      {/* Color count if variants exist */}
                      {variants.length > 0 && (
                        <span className="text-[11px] text-gray-500 font-normal">
                          {variants.length} {variants.length === 1 ? "Colour" : "Colours"}
                        </span>
                      )}

                      {/* Price */}
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[14px] font-medium text-black">
                          ₹{rawDiscountPrice.toLocaleString()}
                        </span>
                        {hasDiscount && (
                          <span className="text-[12px] text-gray-400 line-through">
                            ₹{rawActualPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Rating — small, minimal, inline */}
                      {averageRating > 0 && (
                        <div className="flex items-center gap-[2px] mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={10}
                              className={i < Math.floor(averageRating)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-200 fill-gray-200"
                              }
                            />
                          ))}
                          {totalReviews > 0 && (
                            <span className="text-[10px] text-gray-400 ml-1">({totalReviews})</span>
                          )}
                        </div>
                      )}

                      {/* Variant selectors — compact, inline within card details */}
                      {variants.length > 0 && (
                        <div className="mt-2.5 space-y-2">
                          {/* Color pills */}
                          <div className="flex flex-wrap gap-1.5">
                            {variants.map((v) => (
                              <button
                                key={v.color}
                                onClick={(e) => handleVariantSelection(e, productId, v.color, v.sizes?.[0])}
                                className={`text-[9px] font-medium uppercase px-2.5 py-1 border transition-all cursor-pointer ${
                                  selectedVariants[productId]?.color === v.color
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black"
                                }`}
                              >
                                {v.color}
                              </button>
                            ))}
                          </div>

                          {/* Size grid — only shows after color selection */}
                          {selectedVariants[productId]?.color && (
                            <div className="flex flex-wrap gap-1">
                              {variants.find(v => v.color === selectedVariants[productId].color)?.sizes?.map((s: any) => {
                                const sizeStr = s?.size || s;
                                return (
                                  <button
                                    key={sizeStr}
                                    onClick={(e) => handleVariantSelection(e, productId, selectedVariants[productId].color, s)}
                                    className={`w-8 h-8 flex items-center justify-center text-[10px] font-medium border transition-all cursor-pointer ${
                                      selectedVariants[productId]?.size === sizeStr
                                        ? "bg-black text-white border-black"
                                        : "bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black"
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
                  </Link>
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
