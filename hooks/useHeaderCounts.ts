"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetApi } from "./useApi";
import { useAuth } from "./useAuth";
import { RootState } from "@/app/store/store";
import { setCounts } from "@/app/store/userSlice";

export function useHeaderCounts() {
  const dispatch = useDispatch();
  const { isAuthenticated, isClient } = useAuth();

  // Select counts from Redux
  const wishlistCount = useSelector((state: RootState) => state.user.wishlistCount);
  const cartCount = useSelector((state: RootState) => state.user.cartCount);

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

  // Sync React Query fetched data with Redux Store
  useEffect(() => {
    if (isAuthenticated && isClient) {
      const wCount = wishlistData?.count ?? wishlistData?.data ?? 0;
      const cCount = cartData?.count ?? cartData?.data ?? 0;
      
      dispatch(setCounts({
        cartCount: cCount,
        wishlistCount: wCount,
      }));
    }
  }, [wishlistData, cartData, isAuthenticated, isClient, dispatch]);

  return {
    wishlistCount,
    cartCount,
    loading: wishlistLoading || cartLoading,
  };
}
