"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2500';

export const API_ENDPOINTS = {
  // User endpoints
  USER: {
    SEND_OTP: `/users/send-otp`,
    VERIFY_OTP: `/users/verify-otp`,
    REGISTER: `/users/register`,
    LOGIN: `/users/login`,
    CURRENT_USER: `/users/current-user`,
    UPDATE_USER: `/users/update-user`,
    LOGOUT: `/users/logout`,
    DELETE_USER: `/users/delete-user`,
    REFRESH_TOKEN: `/users/refresh-token`,
    REQUEST_PASSWORD_RESET: `/users/password-reset/request`,
    RESET_PASSWORD: (token: string) => `/users/reset-password/${token}`,
  },

  // Product endpoints
  PRODUCT: {
    GET_ALL: `/products/get-all-product`,
    MINIMAL_GET_ALL: `/products/get-product-minimal`,
    GET_BY_ID: (id: string | number) => `/products/get-product/${id}`,
    FILTER: `/products/filter`,
    CREATE: `/products/create-product`,
    UPDATE: (id: string | number) => `/products/update-product/${id}`,
    UPDATE_IMAGE: (id: string | number) => `/products/update-image/${id}`,
    DELETE: (id: string | number) => `/products/delete-product/${id}`,
    DELETE_ALL: `/products/delete-products`,
  },

  REVIEW: {
    CREATE: (productId: string | number) => `/review/${productId}`,
    UPDATE: (productId: string | number) => `/update-review/${productId}`,
    APPROVE: (productId: string | number, reviewId: string | number) => `/approve-review/${productId}/${reviewId}`,
    GET_BY_PRODUCT: (productId: string | number) => `/get-reviews/${productId}`,
    REMOVE_MEDIA: (productId: string | number, reviewId: string | number, mediaIndex: number) => `/remove-media/${productId}/${reviewId}/${mediaIndex}`,
    DELETE: (productId: string | number, reviewId: string | number) => `/delete-review/${productId}/${reviewId}`,
  },

  // Category endpoints
  CATEGORY: {
    GET_ALL: `/category`,
    CREATE: `/category/create`,
    UPDATE: (id: string | number) => `/category/update/${id}`,
    DELETE: (id: string | number) => `/category/delete/${id}`,
  },

  // filters 
  COLOR: `/products/get-colors`,      // -> GET /get-colors
  SIZE: `/products/get-sizes`,       // -> GET /get-sizes
  SUPER_Search: `/products/search-filter`,       // -> GET /get-sizes

  // Cart endpoints
  CART: {
    ADD: `/carts/add`,
    LOCAL_CART: `/carts/local-cart`,
    SYNC_CART: `/carts/sync-cart`,
    GET_CART: `/carts/get-cart`,
    GET_LOCAL_CART: (tempCartId: string | number) => `/carts/get-localCart/${tempCartId}`,
    UPDATE: `/carts/update-cart/`,
    REMOVE: `/carts/remove/`,
    UPDATE_QUANTITY: `/carts/update-quantity`,
    REMOVE_ITEM: `/carts/remove-item`,
  },

  // Order endpoints
  ORDER: {
    ORDER_FROM_CART: `/orders/order-cart`,
    ORDER_SINGLE_PRODUCT: `/orders/order-product`,
    GET_ORDER: (orderId: string | number) => `/orders/get-order/${orderId}`,
    GET_ORDERS: `/orders/get-orders`,
  },

  // Address endpoints
  ADDRESS: {
    GET_ALL: `/address/get-address`,
    CREATE: `/address/add-address`,
    UPDATE: (id: string | number) => `/address/update-address/${id}`,
    DELETE: (id: string | number) => `/address/delete-address/${id}`,
  },

  // Wishlist endpoints
  WISHLIST: {
    ADD_TO_WISHLIST: `/add-to-wishlist`,
    GET_WISHLIST: `/wishlist`,
    REMOVE_FROM_WISHLIST: "/remove-wishlist",
    COUNT: `/count`,
  },
};

export default API_ENDPOINTS;
