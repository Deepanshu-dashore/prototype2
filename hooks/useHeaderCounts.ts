"use client";

import { useGetApi } from "./useApi";
import { useAuth } from "./useAuth";

export function useHeaderCounts() {
  const { isAuthenticated, isClient } = useAuth();

  // Fetch wishlist count
  const { data: wishlistData, isLoading: wishlistLoading } = useGetApi({
    key: "wishlistCount",
    url: "/count",
    params: { filter: "wishlist" },
    requireAuth: true,
    options: {
      enabled: isAuthenticated && isClient,
      staleTime: 30 * 1000, // 30s cache
    },
  });

  // Fetch cart count
  const { data: cartData, isLoading: cartLoading } = useGetApi({
    key: "cartCount",
    url: "/count",
    params: { filter: "cart" },
    requireAuth: true,
    options: {
      enabled: isAuthenticated && isClient,
      staleTime: 30 * 1000,
    },
  });

  const wishlistCount =
    isAuthenticated && isClient
      ? (wishlistData?.count ?? wishlistData?.data ?? 0)
      : 0;

  const cartCount =
    isAuthenticated && isClient
      ? (cartData?.count ?? cartData?.data ?? 0)
      : 0;

  return {
    wishlistCount,
    cartCount,
    loading: wishlistLoading || cartLoading,
  };
}
