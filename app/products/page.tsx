"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setFilters as setFiltersAction } from "@/app/store/filterSlice";
import { useGetApi } from "@/hooks/useApi";
import API_ENDPOINTS from "@/app/constants/apiConfig";
import { useFilter } from "@/hooks/useFilter";
import ProductCard, { Product } from "@/components/shared/ProductCard";
import FilterSection from "@/components/products/FilterSection";
import ToolBar from "@/components/products/ToolBar";
import ProductsBanner from "@/components/products/ProductsBanner";
import { Filter, X, ShoppingBag, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

const DISPLAY_LIMIT = 10; // products shown per page
const FETCH_LIMIT = 20;   // products fetched per API call (2× display)

// Helper to resolve Localhost URLs to the correct base URL
const resolveImageUrl = (imgUrl: string) => {
  if (!imgUrl) return "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop";
  if (imgUrl.startsWith("http://localhost:2500")) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://nexapoint-e-com-site-backend.onrender.com";
    return imgUrl.replace("http://localhost:2500", baseUrl);
  }
  return imgUrl;
};

// Mapper to transform the raw backend product structure into our Product interface
const mapBackendProduct = (p: any): Product => {
  let priceStr = "₹0";
  let discountStr: string | undefined = undefined;

  if (p.variants && p.variants.length > 0) {
    const firstVar = p.variants[0];
    if (firstVar.sizes && firstVar.sizes.length > 0) {
      const firstSize = firstVar.sizes[0];
      priceStr = `₹${firstSize.price}`;

      if (firstSize.discountPrice) {
        if (firstSize.discountPrice < 0) {
          discountStr = `${Math.abs(firstSize.discountPrice)}% OFF`;
        } else if (firstSize.discountPrice > 0 && firstSize.discountPrice < firstSize.price) {
          const pct = Math.round(((firstSize.price - firstSize.discountPrice) / firstSize.price) * 100);
          discountStr = `${pct}% OFF`;
        }
      }
    }
  }

  const categoryName =
    typeof p.category === "object" && p.category !== null
      ? p.category.name
      : p.category || p.subCategory || "PERFORMANCE";

  return {
    id: p._id || p.id,
    name: p.productName || "TECHNICAL GEAR",
    category: categoryName.toUpperCase(),
    price: priceStr,
    image: resolveImageUrl(p.productImage?.[0]),
    imageAlt: p.productName || "Technical Gear",
    hoverImage: p.productImage?.[1] ? resolveImageUrl(p.productImage[1]) : undefined,
    rating: p.averageRating || 0,
    isNew: p.bestSellingStatus !== true,
    discount: discountStr,
    badge: p.bestSellingStatus ? "Best Seller" : undefined,
  };
};

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);

  // filters hook — page/limit managed internally here, not in the hook
  const { filters, updateFilter, clearFilters } = useFilter();

  // ─── Display page (what user sees: 1, 2, 3, …) ────────────────────
  const [displayPage, setDisplayPage] = useState(1);

  // Refs to avoid infinite dependency loop with filters state
  const filtersRef = useRef(filters);
  const displayPageRef = useRef(displayPage);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    displayPageRef.current = displayPage;
  }, [displayPage]);

  // Sync URL query params to Redux filter state on query changes (e.g. Header Nav click)
  useEffect(() => {
    const currentFilters = filtersRef.current;
    const currentPage = displayPageRef.current;

    const categoryParam = searchParams.get("category") || "";
    const genderParam = searchParams.get("gender") || "";
    const colorParam = searchParams.get("color") || "";
    const sizeParam = searchParams.get("size") || "";
    const minPriceParam = searchParams.get("minPrice") || "";
    const maxPriceParam = searchParams.get("maxPrice") || "";
    const sortParam = searchParams.get("sort") || "popular";
    const searchParam = searchParams.get("search") || "";
    const pageParam = searchParams.get("page") || "1";

    const isDifferent =
      (currentFilters.category || "") !== categoryParam ||
      (currentFilters.gender || "") !== genderParam ||
      (currentFilters.color || "") !== colorParam ||
      (currentFilters.size || "") !== sizeParam ||
      (currentFilters.minPrice || "") !== minPriceParam ||
      (currentFilters.maxPrice || "") !== maxPriceParam ||
      (currentFilters.sort || "popular") !== sortParam ||
      (currentFilters.search || "") !== searchParam ||
      String(currentPage) !== pageParam;

    if (isDifferent) {
      dispatch(
        setFiltersAction({
          category: categoryParam,
          gender: genderParam,
          color: colorParam,
          size: sizeParam,
          minPrice: minPriceParam,
          maxPrice: maxPriceParam,
          sort: sortParam,
          search: searchParam,
        })
      );
      const pageNum = parseInt(pageParam, 10);
      if (!isNaN(pageNum) && pageNum > 0) {
        setDisplayPage(pageNum);
      }
    }
  }, [searchParams, dispatch]);

  // Reset display page to 1 when any filter changes
  const prevFiltersRef = useRef(filters);
  useEffect(() => {
    const prev = prevFiltersRef.current;
    const changed = Object.keys(filters).some(
      (key) => key !== "page" && key !== "limit" && filters[key] !== prev[key]
    );
    if (changed) setDisplayPage(1);
    prevFiltersRef.current = filters;
  }, [filters]);

  // ─── Compute which API page to fetch ───────────────────────────────
  // displayPage 1,2 → apiPage 1 | displayPage 3,4 → apiPage 2 | etc.
  const apiPage = Math.ceil(displayPage / 2);

  // Whether this displayPage uses the first or second half of the batch
  const isSecondHalf = displayPage % 2 === 0;

  // ─── Sync URL ──────────────────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "" && key !== "page" && key !== "limit") {
        params.set(key, value);
      }
    });
    if (displayPage > 1) params.set("page", String(displayPage));

    const queryString = params.toString();
    const newUrl = `/products${queryString ? `?${queryString}` : ""}`;
    if (window.location.pathname + window.location.search !== newUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [filters, displayPage, router]);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // ─── Build API params (exclude internal page/limit from useFilter) ─
  const apiParams = useMemo(() => {
    const clean: Record<string, string> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== "page" && key !== "limit") {
        clean[key] = value;
      }
    });
    return { ...clean, page: String(apiPage), limit: String(FETCH_LIMIT) };
  }, [filters, apiPage]);

  // ─── Current batch ────────────────────────────────────────────────
  const { data: productsData, isLoading } = useGetApi({
    key: ["products", apiParams],
    url: API_ENDPOINTS.PRODUCT.FILTER,
    requireAuth: false,
    params: apiParams,
  });

  // ─── Prefetch next batch (apiPage + 1) ─────────────────────────────
  const nextApiParams = useMemo(
    () => ({ ...apiParams, page: String(apiPage + 1) }),
    [apiParams, apiPage]
  );

  // This fires a background query that sits in cache, ready for instant use
  useGetApi({
    key: ["products", nextApiParams],
    url: API_ENDPOINTS.PRODUCT.FILTER,
    requireAuth: false,
    params: nextApiParams,
    options: { enabled: true },
  });

  // ─── fetch categories/colors/sizes ─────────────────────────────────
  const { data: categories, isLoading: categoryLoading } = useGetApi({
    key: "categories",
    url: API_ENDPOINTS.CATEGORY.GET_ALL,
    requireAuth: false,
  });
  const { data: colors } = useGetApi({
    key: "colors",
    url: API_ENDPOINTS.COLOR,
    requireAuth: false,
  });
  const { data: sizes } = useGetApi({
    key: "sizes",
    url: API_ENDPOINTS.SIZE,
    requireAuth: false,
  });

  // ─── Slice the 20 results into the correct 10 ─────────────────────
  const allFetched = useMemo(() => {
    const raw = productsData?.data?.products || productsData?.data || [];
    return Array.isArray(raw) ? raw.map(mapBackendProduct) : [];
  }, [productsData]);

  const productList = useMemo(() => {
    const start = isSecondHalf ? DISPLAY_LIMIT : 0;
    return allFetched.slice(start, start + DISPLAY_LIMIT);
  }, [allFetched, isSecondHalf]);

  // ─── Total pages (based on total count from API) ──────────────────
  const totalApiCount =
    productsData?.data?.totalProducts ||
    productsData?.data?.total ||
    allFetched.length;
  const totalPages = Math.max(1, Math.ceil(totalApiCount / DISPLAY_LIMIT));

  // ─── Page navigation ──────────────────────────────────────────────
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setDisplayPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ─── Build visible pagination numbers ─────────────────────────────
  const paginationRange = useMemo(() => {
    const pages: (number | "dots")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (displayPage > 3) pages.push("dots");
      const start = Math.max(2, displayPage - 1);
      const end = Math.min(totalPages - 1, displayPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (displayPage < totalPages - 2) pages.push("dots");
      pages.push(totalPages);
    }
    return pages;
  }, [displayPage, totalPages]);

  // ─── Product grid renderer ────────────────────────────────────────
  const ProductGrid = () => (
    <div
      className={`grid gap-5 ${
        viewMode === "grid"
          ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2"
      }`}
    >
      {productList.map((product) => (
        <div
          key={product.id}
          className={viewMode === "list" ? "flex gap-4 border p-4 items-center" : ""}
        >
          {viewMode === "list" ? (
            <div className="flex gap-6 w-full">
              <div className="w-1/3">
                <ProductCard product={product} showRating={true} />
              </div>
              <div className="w-2/3 flex flex-col justify-center">
                <h3 className="text-xl font-bold uppercase">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-2 mb-4">
                  {product.category}
                </p>
                <div className="font-semibold text-lg">{product.price}</div>
                <button className="mt-4 bg-black text-white px-6 py-2 uppercase text-xs tracking-wider font-bold w-max hover:bg-gray-800 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ) : (
            <ProductCard product={product} showRating={true} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 border-t border-gray-200">
      
      <ProductsBanner 
        categories={categories?.data || []}
        activeCategoryId={filters.category}
        activeGender={filters.gender}
      />

      <div className="flex flex-col lg:flex-row gap-6 max-w-[1600px] mx-auto px-4 md:px-8 mt-6">
          {/* Filters */}
          <div className="hidden lg:block">
            <FilterSection
              filters={filters}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              onChange={updateFilter}
              onClear={clearFilters}
              categoriesData={categories?.data || []}
              categoryLoading={categoryLoading}
              sizes={sizes?.data || []}
              colors={colors?.data || []}
            />
          </div>

          {/* Main */}
          <div className="flex-1 pb-20">
            <ToolBar
              totalProducts={totalApiCount}
              viewMode={viewMode}
              setShowFilters={setShowFilters}
              setViewMode={setViewMode}
              onCollapsedToggle={() => setCollapsed(!collapsed)}
              collapsed={collapsed}
            />

            {/* Products */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(DISPLAY_LIMIT)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-200 rounded-sm aspect-3/4 animate-pulse"
                  />
                ))}
              </div>
            ) : productList.length > 0 ? (
              <>
                <ProductGrid />

                {/* ── Pagination ──────────────────────────── */}
                {totalPages > 1 && (
                  <div className="flex flex-col items-end mt-14">
                    <div className="flex items-center gap-1">                    {/* Prev */}
                    <button
                      disabled={displayPage === 1}
                      onClick={() => goToPage(displayPage - 1)}
                      className={`w-10 h-10 flex items-center justify-center transition-all ${
                        displayPage === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-black hover:bg-gray-100 cursor-pointer"
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Page numbers */}
                    {paginationRange.map((item, idx) =>
                      item === "dots" ? (
                        <span
                          key={`dots-${idx}`}
                          className="w-10 h-10 flex items-center justify-center text-gray-400 text-sm"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => goToPage(item as number)}
                          className={`w-10 h-10 flex items-center justify-center text-[13px] font-semibold transition-all cursor-pointer ${
                            displayPage === item
                              ? "bg-black text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {item}
                        </button>
                      )
                    )}

                    {/* Next */}
                    <button
                      disabled={displayPage === totalPages}
                      onClick={() => goToPage(displayPage + 1)}
                      className={`w-10 h-10 flex items-center justify-center transition-all ${
                        displayPage === totalPages
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-black hover:bg-gray-100 cursor-pointer"
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    </div>

                    {/* Page indicator */}
                    <p className="mt-2 text-[11px] font-medium text-gray-400 tracking-wide">
                      Page {displayPage} of {totalPages}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex w-full flex-col items-center justify-center min-h-[50vh] bg-white border border-gray-100 p-12 text-center">
                <div className="bg-gray-50 p-6 rounded-full mb-6">
                  <ShoppingBag className="w-12 h-12 text-gray-300" />
                </div>
                <h1 className="text-2xl font-black uppercase tracking-tight text-black mb-3">
                  No Products Found
                </h1>
                <p className="text-sm font-medium text-gray-500 max-w-md mb-8">
                  We couldn&apos;t find any products matching your current
                  filters. Try adjusting your selections or clearing filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="flex gap-2 items-center px-8 py-4 text-[11px] font-bold uppercase tracking-[0.15em] bg-black text-white hover:bg-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filters Overlay */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 z-[100] flex">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
              onClick={() => setShowFilters(false)}
            />
            <div className="relative ml-auto h-full w-[85%] max-w-[320px] bg-white shadow-2xl flex flex-col">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-black" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-black">
                    Filters
                  </h3>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <FilterSection
                  filters={filters}
                  onChange={updateFilter}
                  onClear={clearFilters}
                  categoriesData={categories?.data || []}
                  categoryLoading={categoryLoading}
                  sizes={sizes?.data || []}
                  colors={colors?.data || []}
                />
              </div>
              <div className="p-5 border-t border-gray-100 bg-white">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-black text-white py-4 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-gray-900 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black" />
        <span className="text-xs uppercase tracking-widest text-gray-400 font-heading">Loading products...</span>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
