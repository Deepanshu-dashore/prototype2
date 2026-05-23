"use client";

import React from "react";
import { LayoutGrid, List, SlidersHorizontal, ChevronDown } from "lucide-react";

interface ToolBarProps {
  totalProducts?: number;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  setShowFilters: (show: boolean) => void;
  onCollapsedToggle?: () => void;
  collapsed?: boolean;
}

export default function ToolBar({
  totalProducts = 0,
  viewMode,
  setViewMode,
  setShowFilters,
  onCollapsedToggle,
  collapsed,
}: ToolBarProps) {
  return (
    <div className="flex items-center justify-between mb-6 gap-4">
      {/* Left: Results count + sidebar toggle */}
      <div className="flex items-center gap-3">
        {/* Desktop: Sidebar collapse toggle */}
        {onCollapsedToggle && (
          <button
            onClick={onCollapsedToggle}
            className="hidden lg:flex items-center gap-2 px-3 py-2 border border-gray-200 hover:border-black transition-all text-[11px] font-bold uppercase tracking-wider cursor-pointer"
          >
            <SlidersHorizontal size={14} />
            {collapsed ? "Show Filters" : "Hide Filters"}
          </button>
        )}

        {/* Mobile: Filter trigger */}
        <button
          onClick={() => setShowFilters(true)}
          className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-200 hover:border-black transition-all text-[11px] font-bold uppercase tracking-wider cursor-pointer"
        >
          <SlidersHorizontal size={14} />
          Filters
        </button>

        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider hidden sm:inline">
          {totalProducts} {totalProducts === 1 ? "Product" : "Products"}
        </span>
      </div>

      {/* Right: View toggle */}
      <div className="flex items-center gap-1 border border-gray-200 p-0.5">
        <button
          onClick={() => setViewMode("grid")}
          className={`p-2 transition-all cursor-pointer ${
            viewMode === "grid"
              ? "bg-black text-white"
              : "text-gray-400 hover:text-black"
          }`}
        >
          <LayoutGrid size={14} />
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`p-2 transition-all cursor-pointer ${
            viewMode === "list"
              ? "bg-black text-white"
              : "text-gray-400 hover:text-black"
          }`}
        >
          <List size={14} />
        </button>
      </div>
    </div>
  );
}
