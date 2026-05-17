"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2500';

export const API_ENDPOINTS = {
  // User endpoints
  USER: {
    SEND_OTP: `/users/send-otp`,
    VERIFY_OTP: `/users/verify-otp`,
    REGISTER: `/users/register`,
    LOGIN: `/users/login`,
    CURRENT_USER: `${API_BASE_URL}/users/current-user`,
    UPDATE_USER: `${API_BASE_URL}/users/update-user`,
    LOGOUT: `/users/logout`,
    DELETE_USER: `${API_BASE_URL}/users/delete-user`,
    REFRESH_TOKEN: `${API_BASE_URL}/users/refresh-token`,
    REQUEST_PASSWORD_RESET: `${API_BASE_URL}/users/password-reset/request`,
    RESET_PASSWORD: (token: string) => `${API_BASE_URL}/users/reset-password/${token}`,
  },

  // Product endpoints
  PRODUCT: {
    GET_ALL: `/products/get-all-product`,
    GET_BY_ID: (id: string | number) => `${API_BASE_URL}/products/get-product/${id}`,
    CREATE: `${API_BASE_URL}/products/create-product`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/products/update-product/${id}`,
    UPDATE_IMAGE: (id: string | number) => `${API_BASE_URL}/products/update-image/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/products/delete-product/${id}`,
    DELETE_ALL: `${API_BASE_URL}/products/delete-products`,
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
    CREATE: `${API_BASE_URL}/category/create`,
    UPDATE: (id: string | number) => `${API_BASE_URL}/category/update/${id}`,
    DELETE: (id: string | number) => `${API_BASE_URL}/category/delete/${id}`,
  },

  // filters 
  COLOR: `/products/get-colors`,      // -> GET /get-colors
  SIZE: `/products/get-sizes`,       // -> GET /get-sizes
  SUPER_Search: `/products/search-filter`,       // -> GET /get-sizes

  // Cart endpoints
  CART: {
    ADD: `${API_BASE_URL}/carts/add`,
    LOCAL_CART: `${API_BASE_URL}/carts/local-cart`,
    SYNC_CART: `${API_BASE_URL}/carts/sync-cart`,
    GET_CART: `${API_BASE_URL}/carts/get-cart`,
    GET_LOCAL_CART: (tempCartId: string | number) => `${API_BASE_URL}/carts/get-localCart/${tempCartId}`,
    UPDATE: `/carts/update-cart/`,
    REMOVE: `/carts/remove/`,
    UPDATE_QUANTITY: `${API_BASE_URL}/carts/update-quantity`,
    REMOVE_ITEM: `${API_BASE_URL}/carts/remove-item`,
  },

  // Order endpoints
  ORDER: {
    ORDER_FROM_CART: `${API_BASE_URL}/orders/order-cart`,
    ORDER_SINGLE_PRODUCT: `${API_BASE_URL}/orders/order-product`,
    GET_ORDER: (orderId: string | number) => `${API_BASE_URL}/orders/get-order/${orderId}`,
    GET_ORDERS: `${API_BASE_URL}/orders/get-orders`,
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
    REMOVE_FROM_WISHLIST:  "/remove-wishlist",
    COUNT: `/count`,
  },
};

export default API_ENDPOINTS;
