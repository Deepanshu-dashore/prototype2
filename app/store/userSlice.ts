import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  [key: string]: any;
}

interface UserState {
  user: User | null;
  cartCount: number;
  wishlistCount: number;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: UserState = {
  user: null,
  cartCount: 0,
  wishlistCount: 0,
  isAuthenticated: false,
  loading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
    },
    setCartCount: (state, action: PayloadAction<number>) => {
      state.cartCount = action.payload;
    },
    setWishlistCount: (state, action: PayloadAction<number>) => {
      state.wishlistCount = action.payload;
    },
    setCounts: (state, action: PayloadAction<{ cartCount: number; wishlistCount: number }>) => {
      state.cartCount = action.payload.cartCount;
      state.wishlistCount = action.payload.wishlistCount;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.cartCount = 0;
      state.wishlistCount = 0;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
});

export const { setUser, setCartCount, setWishlistCount, setCounts, setLoading, logout } = userSlice.actions;
export default userSlice.reducer;
