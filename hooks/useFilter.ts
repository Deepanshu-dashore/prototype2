"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

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

export function useFilter(initialFilters: Filters = {}) {
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>({
    page: "1",
    limit: "12",
    ...initialFilters,
  });

  const updateFilter = useCallback((key: string, value: string) => {
    setFilters((prev) => {
      const updated = { ...prev };

      if (!value || value === "") {
        delete updated[key];
      } else {
        updated[key] = value;
      }

      // Reset to page 1 when any filter changes (except page itself)
      if (key !== "page") {
        updated.page = "1";
      }

      return updated;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ page: "1", limit: "12" });
  }, []);

  // Navigate to /products with search query
  const searchProducts = useCallback(
    (query: string) => {
      const params = new URLSearchParams();
      if (query.trim()) params.set("search", query.trim());
      router.push(`/products${params.toString() ? `?${params}` : ""}`);

      setFilters((prev) => ({
        ...prev,
        search: query.trim() || undefined,
        page: "1",
      }));
    },
    [router]
  );

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => value && key !== "page" && key !== "limit" && key !== "sort"
  ).length;

  return { filters, updateFilter, clearFilters, activeFilterCount, searchProducts };
}
