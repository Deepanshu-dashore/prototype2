"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import {
  updateFilter as updateFilterAction,
  setFilters as setFiltersAction,
  clearFilters as clearFiltersAction,
  setSearchQuery as setSearchQueryAction,
  FiltersState
} from "@/app/store/filterSlice";

export interface Filters {
  category?: string;
  color?: string;
  size?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  search?: string;
  page?: string;
  limit?: string;
  [key: string]: string | undefined;
}

export function useFilter(initialFilters: Partial<FiltersState> = {}) {
  const router = useRouter();
  const dispatch = useDispatch();

  // Select active filters from Redux store
  const filters = useSelector((state: RootState) => state.filter);

  // Initialize filters on mount if initialFilters are provided
  useEffect(() => {
    if (initialFilters && Object.keys(initialFilters).length > 0) {
      dispatch(setFiltersAction(initialFilters));
    }
  }, [dispatch]);

  const updateFilter = useCallback((key: string, value: string) => {
    dispatch(updateFilterAction({ key, value }));
  }, [dispatch]);

  const clearFilters = useCallback(() => {
    dispatch(clearFiltersAction());
  }, [dispatch]);

  // Navigate to /products with search query
  const searchProducts = useCallback(
    (query: string) => {
      const params = new URLSearchParams();
      if (query.trim()) params.set("search", query.trim());
      router.push(`/products${params.toString() ? `?${params}` : ""}`);

      dispatch(setSearchQueryAction(query));
    },
    [router, dispatch]
  );

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => value && key !== "page" && key !== "limit" && key !== "sort"
  ).length;

  return { filters, updateFilter, clearFilters, activeFilterCount, searchProducts };
}
