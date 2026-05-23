"use client";

import React, { useState } from "react";
import { ChevronDown, X, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Filters } from "@/hooks/useFilter";

interface FilterSectionProps {
  filters: Filters;
  collapsed?: boolean;
  setCollapsed?: (v: boolean) => void;
  onChange: (key: string, value: string) => void;
  onClear: () => void;
  categoriesData: any[];
  categoryLoading?: boolean;
  brands?: string[];
  sizes: string[];
  colors: string[];
}

/* ── Accordion ─────────────────────────────────────────── */
function FilterAccordion({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group cursor-pointer"
      >
        <span className="text-[13px] font-semibold text-black tracking-tight">
          {title}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Color map for rendering swatches ─────────────────── */
const COLOR_MAP: Record<string, string> = {
  black: "#000000",
  white: "#FFFFFF",
  red: "#D32F2F",
  blue: "#1565C0",
  navy: "#0D1B3E",
  green: "#2E7D32",
  yellow: "#F9A825",
  orange: "#E65100",
  pink: "#C2185B",
  purple: "#7B1FA2",
  grey: "#9E9E9E",
  gray: "#9E9E9E",
  brown: "#5D4037",
  beige: "#D7C9AA",
  cream: "#FFFDD0",
  maroon: "#800000",
  olive: "#556B2F",
  teal: "#00796B",
  coral: "#FF7043",
  gold: "#C9A84C",
};

function resolveColor(color: any): string {
  if (typeof color === "object" && color.hex) return color.hex;
  const name = (typeof color === "string" ? color : color?.name || "").toLowerCase();
  return COLOR_MAP[name] || "#CCCCCC";
}

function resolveColorName(color: any): string {
  if (typeof color === "string") return color;
  return color?.name || color?.colorName || "Unknown";
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════ */
export default function FilterSection({
  filters,
  collapsed,
  setCollapsed,
  onChange,
  onClear,
  categoriesData,
  categoryLoading,
  sizes,
  colors,
}: FilterSectionProps) {
  const priceRanges = [
    { label: "Under ₹500", min: "0", max: "500" },
    { label: "₹500 – ₹1,000", min: "500", max: "1000" },
    { label: "₹1,000 – ₹2,000", min: "1000", max: "2000" },
    { label: "₹2,000 – ₹5,000", min: "2000", max: "5000" },
    { label: "Over ₹5,000", min: "5000", max: "" },
  ];

  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low → High", value: "price_asc" },
    { label: "Price: High → Low", value: "price_desc" },
    { label: "Most Popular", value: "popular" },
  ];

  const activeCount = Object.entries(filters).filter(
    ([key, value]) =>
      value && key !== "page" && key !== "limit" && key !== "sort"
  ).length;

  return (
    <aside
      className={`bg-white transition-all duration-300 ${
        collapsed
          ? "w-0 overflow-hidden opacity-0"
          : "w-[260px] min-w-[260px]"
      }`}
    >
      <div className="sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto scrollbar-hide">
        <div className="px-6 pt-5 pb-10">
          {/* ── Header ───────────────────────────────── */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h2 className="text-[15px] font-bold text-black tracking-tight">
              Filters
            </h2>
            <div className="flex items-center gap-3">
              {activeCount > 0 && (
                <button
                  onClick={onClear}
                  className="flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-black transition-colors cursor-pointer"
                >
                  <RotateCcw size={11} />
                  Reset
                </button>
              )}
              {setCollapsed && (
                <button
                  onClick={() => setCollapsed(true)}
                  className="text-gray-400 hover:text-black transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* ── Active Chips ─────────────────────────── */}
          {activeCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 mb-1">
              {filters.category &&
                categoriesData.map((cat: any) => {
                  const catId =
                    typeof cat === "string" ? cat : cat._id || cat.id;
                  const catName =
                    typeof cat === "string"
                      ? cat
                      : cat.name || cat.categoryName;
                  if (catId !== filters.category) return null;
                  return (
                    <Chip
                      key={catId}
                      label={catName}
                      onRemove={() => onChange("category", "")}
                    />
                  );
                })}
              {filters.color && (
                <Chip
                  label={filters.color}
                  onRemove={() => onChange("color", "")}
                />
              )}
              {filters.size && (
                <Chip
                  label={filters.size}
                  onRemove={() => onChange("size", "")}
                />
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <Chip
                  label={`₹${filters.minPrice || "0"} – ₹${
                    filters.maxPrice || "∞"
                  }`}
                  onRemove={() => {
                    onChange("minPrice", "");
                    onChange("maxPrice", "");
                  }}
                />
              )}
            </div>
          )}

          {/* ── Category ─────────────────────────────── */}
          <FilterAccordion title="Category">
            {categoryLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-[18px] bg-gray-100 animate-pulse rounded-sm"
                    style={{ width: `${60 + Math.random() * 30}%` }}
                  />
                ))}
              </div>
            ) : (
              <ul className="space-y-0.5">
                {categoriesData.map((cat: any) => {
                  const catName =
                    typeof cat === "string"
                      ? cat
                      : cat.name || cat.categoryName;
                  const catId =
                    typeof cat === "string" ? cat : cat._id || cat.id;
                  const isActive = filters.category === catId;

                  return (
                    <li key={catId}>
                      <button
                        onClick={() =>
                          onChange("category", isActive ? "" : catId)
                        }
                        className="w-full flex items-center gap-3 py-[7px] cursor-pointer group"
                      >
                        {/* Checkbox */}
                        <span
                          className={`w-[18px] h-[18px] border flex items-center justify-center transition-all shrink-0 ${
                            isActive
                              ? "bg-black border-black"
                              : "border-gray-300 group-hover:border-gray-500"
                          }`}
                        >
                          {isActive && (
                            <svg
                              width="10"
                              height="8"
                              viewBox="0 0 10 8"
                              fill="none"
                            >
                              <path
                                d="M1 3.5L3.5 6L9 1"
                                stroke="white"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </span>
                        <span
                          className={`text-[13px] transition-colors ${
                            isActive
                              ? "text-black font-semibold"
                              : "text-gray-600 group-hover:text-black"
                          }`}
                        >
                          {catName}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </FilterAccordion>

          {/* ── Color ────────────────────────────────── */}
          <FilterAccordion title="Colour" defaultOpen={false}>
            <div className="grid grid-cols-5 gap-3">
              {colors.map((color: any) => {
                const name = resolveColorName(color);
                const hex = resolveColor(color);
                const isActive = filters.color === name;
                const isWhite =
                  hex.toLowerCase() === "#ffffff" ||
                  hex.toLowerCase() === "#fff" ||
                  name.toLowerCase() === "white";

                return (
                  <button
                    key={name}
                    onClick={() => onChange("color", isActive ? "" : name)}
                    className="flex flex-col items-center gap-1.5 cursor-pointer group"
                    title={name}
                  >
                    <span
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        isActive
                          ? "border-black scale-110"
                          : isWhite
                          ? "border-gray-300 group-hover:border-gray-500"
                          : "border-transparent group-hover:scale-110"
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                    <span
                      className={`text-[9px] leading-tight text-center capitalize ${
                        isActive
                          ? "text-black font-semibold"
                          : "text-gray-500"
                      }`}
                    >
                      {name}
                    </span>
                  </button>
                );
              })}
            </div>
          </FilterAccordion>

          {/* ── Size ─────────────────────────────────── */}
          <FilterAccordion title="Size" defaultOpen={false}>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size: any) => {
                const sizeName =
                  typeof size === "string" ? size : size.name || size;
                const isActive = filters.size === sizeName;

                return (
                  <button
                    key={sizeName}
                    onClick={() =>
                      onChange("size", isActive ? "" : sizeName)
                    }
                    className={`min-w-[42px] h-[42px] px-3 flex items-center justify-center text-[12px] font-medium border transition-all cursor-pointer ${
                      isActive
                        ? "border-black bg-black text-white"
                        : "border-gray-200 text-gray-700 hover:border-black"
                    }`}
                  >
                    {sizeName}
                  </button>
                );
              })}
            </div>
          </FilterAccordion>

          {/* ── Price ────────────────────────────────── */}
          <FilterAccordion title="Shop by Price" defaultOpen={false}>
            <ul className="space-y-0.5">
              {priceRanges.map((range) => {
                const isActive =
                  filters.minPrice === range.min &&
                  filters.maxPrice === range.max;

                return (
                  <li key={range.label}>
                    <button
                      onClick={() => {
                        if (isActive) {
                          onChange("minPrice", "");
                          onChange("maxPrice", "");
                        } else {
                          onChange("minPrice", range.min);
                          onChange("maxPrice", range.max);
                        }
                      }}
                      className="w-full flex items-center gap-3 py-[7px] cursor-pointer group"
                    >
                      <span
                        className={`w-[18px] h-[18px] border flex items-center justify-center transition-all shrink-0 ${
                          isActive
                            ? "bg-black border-black"
                            : "border-gray-300 group-hover:border-gray-500"
                        }`}
                      >
                        {isActive && (
                          <svg
                            width="10"
                            height="8"
                            viewBox="0 0 10 8"
                            fill="none"
                          >
                            <path
                              d="M1 3.5L3.5 6L9 1"
                              stroke="white"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <span
                        className={`text-[13px] transition-colors ${
                          isActive
                            ? "text-black font-semibold"
                            : "text-gray-600 group-hover:text-black"
                        }`}
                      >
                        {range.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </FilterAccordion>

          {/* ── Sort By ──────────────────────────────── */}
          <FilterAccordion title="Sort By" defaultOpen={false}>
            <ul className="space-y-0.5">
              {sortOptions.map((option) => {
                const isActive = filters.sort === option.value;
                return (
                  <li key={option.value}>
                    <button
                      onClick={() =>
                        onChange("sort", isActive ? "" : option.value)
                      }
                      className="w-full flex items-center gap-3 py-[7px] cursor-pointer group"
                    >
                      {/* Radio circle */}
                      <span
                        className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                          isActive
                            ? "border-black"
                            : "border-gray-300 group-hover:border-gray-500"
                        }`}
                      >
                        {isActive && (
                          <span className="w-[8px] h-[8px] rounded-full bg-black" />
                        )}
                      </span>
                      <span
                        className={`text-[13px] transition-colors ${
                          isActive
                            ? "text-black font-semibold"
                            : "text-gray-600 group-hover:text-black"
                        }`}
                      >
                        {option.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </FilterAccordion>
        </div>
      </div>
    </aside>
  );
}

/* ── Chip component ────────────────────────────────────── */
function Chip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-[11px] font-medium text-gray-700 pl-3 pr-2 py-1.5 capitalize">
      {label}
      <button
        onClick={onRemove}
        className="hover:bg-gray-200 p-0.5 transition-colors cursor-pointer"
      >
        <X size={11} className="text-gray-500" />
      </button>
    </span>
  );
}
