import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  _id: string;
  productId: any;
  productName: string;
  productDescription?: string;
  productActualPrice: number;
  productDiscountPrice?: number;
  image: string;
  selectedVariant: {
    id: string | number;
    price: number;
    discountPrice?: number;
    size?: string;
    color?: string;
    [key: string]: any;
  };
  bulkNameAndNumber?: any[];
  uploadLogo?: any[];
  uploadSponserLogo?: any[];
  commonLogoForBulk?: string;
  commonSponsorLogoForBulk?: string;
  quantity: number;
  totalPrice: number;
  createdAt?: string;
  updatedAt?: string;
}

interface PricingBreakdown {
  subtotal: number;
  discount: number;
  total: number;
  savings: number;
}

interface CartState {
  cartId: string | null;
  items: CartItem[];
  cartCount: number;
  totalAmount: number;
  pricing: PricingBreakdown;
  loading: boolean;
}

const initialState: CartState = {
  cartId: null,
  items: [],
  cartCount: 0,
  totalAmount: 0,
  pricing: {
    subtotal: 0,
    discount: 0,
    total: 0,
    savings: 0,
  },
  loading: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartData: (state, action: PayloadAction<{ cartId: string | null; products: CartItem[]; pricing?: PricingBreakdown; totalAmount?: number }>) => {
      state.cartId = action.payload.cartId;
      state.items = action.payload.products || [];
      state.cartCount = (action.payload.products || []).reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = action.payload.totalAmount || 0;
      if (action.payload.pricing) {
        state.pricing = action.payload.pricing;
      } else {
        state.pricing = {
          subtotal: state.totalAmount,
          discount: 0,
          total: state.totalAmount,
          savings: 0,
        };
      }
      state.loading = false;
    },
    updateLocalCartItem: (
      state, 
      action: PayloadAction<{ cartProductId: string; quantity: number; totalPrice: number; bulkNameAndNumber?: any[] }>
    ) => {
      const item = state.items.find((i) => i._id === action.payload.cartProductId);
      if (item) {
        item.quantity = action.payload.quantity;
        item.totalPrice = action.payload.totalPrice;
        if (action.payload.bulkNameAndNumber) {
          item.bulkNameAndNumber = action.payload.bulkNameAndNumber;
        }
        
        // Recalculate cart count and total amount
        state.cartCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
        state.totalAmount = state.items.reduce((sum, i) => sum + i.totalPrice, 0);
        state.pricing.total = state.totalAmount;
      }
    },
    removeLocalCartItem: (state, action: PayloadAction<{ cartProductId: string }>) => {
      state.items = state.items.filter((i) => i._id !== action.payload.cartProductId);
      state.cartCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
      state.totalAmount = state.items.reduce((sum, i) => sum + i.totalPrice, 0);
      state.pricing.total = state.totalAmount;
    },
    setLoadingState: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearCartData: (state) => {
      state.cartId = null;
      state.items = [];
      state.cartCount = 0;
      state.totalAmount = 0;
      state.pricing = { subtotal: 0, discount: 0, total: 0, savings: 0 };
      state.loading = false;
    },
  },
});

export const {
  setCartData,
  updateLocalCartItem,
  removeLocalCartItem,
  setLoadingState,
  clearCartData,
} = cartSlice.actions;

export default cartSlice.reducer;
