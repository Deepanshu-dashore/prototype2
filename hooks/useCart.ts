"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetApi, useMutationApi } from "./useApi";
import { API_ENDPOINTS } from "@/app/constants/apiConfig";
import { RootState } from "@/app/store/store";
import { setCartCount } from "@/app/store/userSlice";
import {
  setCartData,
  updateLocalCartItem,
  removeLocalCartItem,
  clearCartData,
} from "@/app/store/cartSlice";
import { useAuth } from "./useAuth";

export function useCart() {
  const dispatch = useDispatch();
  const { isAuthenticated, isClient } = useAuth();

  // Select cart state from Redux
  const cart = useSelector((state: RootState) => state.cart);

  // 1. Fetch Cart (GET)
  const { data: serverCartData, refetch: refetchCart, isLoading: isFetching } = useGetApi({
    key: "getCart",
    url: API_ENDPOINTS.CART.GET_CART,
    requireAuth: true,
    options: {
      enabled: isAuthenticated && isClient,
    },
  });

  useEffect(() => {
    if (serverCartData) {
      const cartData = serverCartData?.data || serverCartData;
      if (cartData) {
        dispatch(
          setCartData({
            cartId: cartData.cartId || cartData._id,
            products: cartData.products || [],
            pricing: cartData.pricing,
            totalAmount: cartData.totalAmount,
          })
        );
        
        // Sync header cart count
        const totalQty = (cartData.products || []).reduce(
          (sum: number, item: any) => sum + item.quantity,
          0
        );
        dispatch(setCartCount(totalQty));
      }
    }
  }, [serverCartData, dispatch]);

  // 2. Add Product to Cart (POST)
  const { mutateAsync: addProductMutate, isPending: isAdding } = useMutationApi({
    key: "addToCart",
    url: API_ENDPOINTS.CART.ADD,
    method: "POST",
    requireAuth: true,
    options: {
      onSuccess: () => {
        // Refetch cart data from server to keep state and pricing correct
        refetchCart();
      },
    },
  });

  // 2a. Add Single Product to Cart (POST)
  const { mutateAsync: addSingleProductMutate, isPending: isAddingSingle } = useMutationApi({
    key: "addSingleToCart",
    url: API_ENDPOINTS.CART.ADD_SINGLE,
    method: "POST",
    requireAuth: true,
    options: {
      onSuccess: () => {
        // Refetch cart data from server to keep state and pricing correct
        refetchCart();
      },
    },
  });

  // 3. Update Cart Product (PATCH)
  // Backend URL is: PATCH /carts/update-cart/:cartProductId
  const { mutateAsync: updateProductMutate, isPending: isUpdating } = useMutationApi({
    key: "updateCart",
    url: "/carts/update-cart", // Using base URL without trailing slash as requestedUrl handles id appending
    method: "PATCH",
    requireAuth: true,
  });

  // 4. Remove Cart Product (DELETE)
  // Backend URL is: DELETE /carts/remove/:cartProductId
  const { mutateAsync: removeProductMutate, isPending: isRemoving } = useMutationApi({
    key: "removeCart",
    url: "/carts/remove",
    method: "DELETE",
    requireAuth: true,
  });

  // ── Action wrappers exposed to components ────────────────────────────────

  const addToCart = async (payload: {
    productId: string;
    selectedVariant: any; // variant object
    quantity: number;
    image?: string;
    bulkNameAndNumber?: string; // stringified json
    uploadLogo?: string; // stringified json
    uploadSponserLogo?: string; // stringified json
    commonLogoForBulk?: string;
    commonSponsorLogoForBulk?: string;
  }) => {
    try {
      const result = await addProductMutate({ payload });
      return result?.data || result;
    } catch (error) {
      console.error("Error in addToCart:", error);
      throw error;
    }
  };

  const addToCartSingle = async (payload: {
    productId: string;
    selectedVariant: {
      id: string;
      price: number;
      discountPrice?: number;
      size: string;
      color: string;
    };
    quantity: number;
    image?: string;
  }) => {
    try {
      const result = await addSingleProductMutate({ payload });
      return result?.data || result;
    } catch (error) {
      console.error("Error in addToCartSingle:", error);
      throw error;
    }
  };

  const updateCartItem = async (
    cartProductId: string,
    cartId: string,
    quantity: number,
    otherPayload?: {
      bulkNameAndNumber?: string;
      commonLogoForBulk?: string;
      commonSponsorLogoForBulk?: string;
    }
  ) => {
    try {
      const result = await updateProductMutate({
        id: cartProductId,
        payload: {
          quantity,
          cartId,
          ...otherPayload,
        },
      });

      const updatedProduct = result?.data || result;

      // Update Redux state immediately to reflect new quantities and total price
      dispatch(
        updateLocalCartItem({
          cartProductId,
          quantity: updatedProduct.quantity,
          totalPrice: updatedProduct.totalPrice,
          bulkNameAndNumber: updatedProduct.bulkNameAndNumber,
        })
      );

      // Sync userSlice cartCount to match new quantities sum
      const newItems = cart.items.map((i) =>
        i._id === cartProductId ? { ...i, quantity: updatedProduct.quantity } : i
      );
      const newCount = newItems.reduce((sum, i) => sum + i.quantity, 0);
      dispatch(setCartCount(newCount));

      // Refetch the full cart in the background to sync breakdown/discount details
      refetchCart();
      
      return updatedProduct;
    } catch (error) {
      console.error("Error in updateCartItem:", error);
      throw error;
    }
  };

  const removeFromCart = async (cartProductId: string, cartId: string) => {
    try {
      await removeProductMutate({
        id: cartProductId,
        payload: { cartId },
      });

      // Remove from Redux store immediately
      dispatch(removeLocalCartItem({ cartProductId }));

      // Sync userSlice cartCount
      const newItems = cart.items.filter((i) => i._id !== cartProductId);
      const newCount = newItems.reduce((sum, i) => sum + i.quantity, 0);
      dispatch(setCartCount(newCount));

      // Refetch in the background
      refetchCart();
    } catch (error) {
      console.error("Error in removeFromCart:", error);
      throw error;
    }
  };

  const clearCart = () => {
    dispatch(clearCartData());
    dispatch(setCartCount(0));
  };

  return {
    cartId: cart.cartId,
    items: cart.items,
    cartCount: cart.cartCount,
    totalAmount: cart.totalAmount,
    pricing: cart.pricing,
    loading: cart.loading || isFetching,
    isAdding: isAdding || isAddingSingle,
    isAddingSingle,
    isUpdating,
    isRemoving,
    refetchCart,
    addToCart,
    addToCartSingle,
    updateCartItem,
    removeFromCart,
    clearCart,
  };
}
