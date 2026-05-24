import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FiltersState {
  category?: string;
  color?: string;
  size?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  search?: string;
  page: string;
  limit: string;
  [key: string]: string | undefined;
}

const initialState: FiltersState = {
  page: "1",
  limit: "12",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    updateFilter: (state, action: PayloadAction<{ key: string; value: string }>) => {
      const { key, value } = action.payload;
      if (!value || value === "") {
        delete state[key];
      } else {
        state[key] = value;
      }
      // Reset to page 1 when any filter changes (except page itself)
      if (key !== "page") {
        state.page = "1";
      }
    },
    setFilters: (state, action: PayloadAction<Partial<FiltersState>>) => {
      return {
        ...state,
        ...action.payload,
      } as FiltersState;
    },
    clearFilters: (state) => {
      return {
        page: "1",
        limit: "12",
      };
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.search = action.payload.trim() || undefined;
      state.page = "1";
    },
  },
});

export const { updateFilter, setFilters, clearFilters, setSearchQuery } = filterSlice.actions;
export default filterSlice.reducer;
