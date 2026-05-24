"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetApi, useMutationApi } from "@/hooks/useApi";
import { useFilter } from "@/hooks/useFilter";
import { useAuth } from "@/hooks/useAuth";
import { useHeaderCounts } from "@/hooks/useHeaderCounts";
import API_ENDPOINTS from "@/app/constants/apiConfig";
import toast from "react-hot-toast";

/* ── Debounce utility ─────────────────────────────────── */
function debounce<T extends (...args: any[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as unknown as T;
}

const Navbar = () => {
  const router = useRouter();

  // ── State ─────────────────────────────────────────────
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // ── Hooks ─────────────────────────────────────────────
  const { searchProducts } = useFilter();
  const {
    user,
    isAuthenticated,
    isClient,
    logout: authLogout,
    getFullName,
    getInitials,
  } = useAuth();
  const { wishlistCount, cartCount } = useHeaderCounts();

  // ── Scroll listener ───────────────────────────────────
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Focus input when search opens ─────────────────────
  useEffect(() => {
    if (isSearchOpen && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // ── Sync search from URL on mount / popstate ──────────
  useEffect(() => {
    const syncFromUrl = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlSearch = urlParams.get("search") || "";
      setSearchValue(urlSearch);
    };
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  // ── Close suggestions on outside click ────────────────
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ── Search suggestions API ────────────────────────────
  const { data: searchSuggestions, isLoading: suggestionsLoading } = useGetApi({
    key: ["searchSuggestions", searchValue],
    url: API_ENDPOINTS.SUPER_Search,
    requireAuth: false,
    params: { query: searchValue.trim().length > 0 ? searchValue.trim() : "" },
    options: {
      enabled: searchValue.trim().length > 1,
      staleTime: 10 * 1000,
    },
  });

  // ── Logout mutation ───────────────────────────────────
  const { mutateAsync: logoutMutation, isPending: loggingOut } = useMutationApi({
    key: "logout",
    url: API_ENDPOINTS.USER.LOGOUT,
    method: "POST",
    options: {
      onSuccess: () => {
        authLogout();
        toast.success("Logged out successfully!");
        router.push("/login");
      },
      onError: () => {
        toast.error("Logout failed. Try again.");
      },
    },
  });

  // ── Debounced search submit ───────────────────────────
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (value.trim().length > 0) {
        searchProducts(value.trim());
        setShowSuggestions(false);
        setIsSearchOpen(false);
      }
    }, 400),
    [searchProducts]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setShowSuggestions(value.trim().length > 1);
  };

  const handleSearchSubmit = () => {
    if (searchValue.trim().length > 0) {
      searchProducts(searchValue.trim());
      setShowSuggestions(false);
      setIsSearchOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleSuggestionClick = (value: string) => {
    setSearchValue(value);
    searchProducts(value);
    setShowSuggestions(false);
  };

  const suggestions: any[] =
    searchSuggestions?.data?.results ||
    searchSuggestions?.data ||
    [];

  // ── Nav links ─────────────────────────────────────────
  const navLinks = [
    { name: "Men", href: "/products?gender=Men" },
    { name: "Women", href: "/products?gender=Women" },
    { name: "Performance", href: "/products" },
    { name: "New Arrivals", href: "/products" },
    { name: "Sale", href: "/products" },
  ];

  return (
    <nav
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 h-[72px] flex items-center px-5 md:px-10 ${
        isScrolled ? "bg-white shadow-sm" : "bg-white/90 backdrop-blur-md"
      }`}
    >
      <div className="w-full flex items-center justify-between">
        {/* ── Mobile: Hamburger ────────────────────────── */}
        <div className="lg:hidden flex-1 flex justify-start">
          <button
            className="p-2 text-[#1a1c1c] hover:bg-black/5 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Icon icon="tabler:menu-2" className="w-[24px] h-[24px]" />
          </button>
        </div>

        {/* ── Logo ─────────────────────────────────────── */}
        <div className="flex-1 flex justify-center lg:justify-start">
          <Link href="/" className="relative w-28 md:w-40 h-8 md:h-10">
            <Image
              src="/DISPORT LOGOS/LOGO.webp"
              alt="Disport Logo"
              fill
              sizes="(max-width: 768px) 112px, 160px"
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* ── Desktop Navigation ───────────────────────── */}
        <div className="hidden lg:flex flex-1 items-center justify-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[14px] font-bold uppercase tracking-wider transition-all hover:text-[#964900] whitespace-nowrap text-black font-heading"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* ── Utilities ────────────────────────────────── */}
        <div className="flex-1 flex items-center justify-end">
          <div className="flex items-center">
            {/* Search Bar — Desktop */}
            <div className="relative hidden md:flex items-center group" ref={suggestionsRef}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search products..."
                value={searchValue}
                onFocus={() => {
                  setIsFocused(true);
                  if (searchValue.trim().length > 1) setShowSuggestions(true);
                }}
                onBlur={() => setIsFocused(false)}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="bg-[#f3f3f4] border-none outline-none rounded-full py-0 px-[18px] text-[14px] placeholder:text-[#8a7263] focus:ring-0 focus:bg-[#eaeaeb] transition-all w-[220px] h-[48px] hover:bg-[#eaeaeb]"
              />
              <div
                className="absolute right-[18px] flex items-center justify-center cursor-pointer text-[#1a1c1c] opacity-60 group-hover:opacity-100 transition-opacity"
                onClick={handleSearchSubmit}
              >
                {suggestionsLoading && searchValue.trim().length > 1 ? (
                  <div className="w-4 h-4 border-2 border-[#964900] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Icon icon="tabler:search" className="w-5 h-5" />
                )}
              </div>

              {/* ── Search Suggestions Dropdown ─────────── */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-lg z-50 max-h-[280px] overflow-y-auto"
                  >
                    {suggestions
                      .filter(
                        (s: any) =>
                          (s.value || s.name || s.productName || "")
                            .toLowerCase() !== searchValue.toLowerCase()
                      )
                      .slice(0, 6)
                      .map((s: any, idx: number) => {
                        const label = s.value || s.name || s.productName || "";
                        return (
                          <button
                            key={idx}
                            onMouseDown={() => handleSuggestionClick(label)}
                            className="w-full text-left px-4 py-3 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3 cursor-pointer"
                          >
                            <Icon
                              icon="tabler:search"
                              className="w-3.5 h-3.5 text-gray-400 shrink-0"
                            />
                            <span className="truncate">{label}</span>
                          </button>
                        );
                      })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Icons Group */}
            <div className="flex items-center gap-[10px] md:gap-[18px] md:ml-6">
              {/* Mobile Search Trigger */}
              <button
                className="md:hidden p-2 text-[#1a1c1c] hover:bg-black/5 rounded-full transition-colors"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Icon icon="tabler:search" className="w-[24px] h-[24px]" />
              </button>

              {/* Wishlist — Desktop */}
              <Link
                href="/wishlist"
                className="hidden md:flex relative hover:scale-110 transition-transform text-[#1a1c1c]"
              >
                <Icon
                  icon="tabler:heart"
                  className="w-[24px] h-[24px] stroke-[1.5]"
                />
                {isClient && wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#ec7700] text-white text-[10px] w-[16px] h-[16px] flex items-center justify-center rounded-full font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account — Desktop */}
              {isClient && isAuthenticated ? (
                <div className="hidden md:flex items-center gap-2 relative group">
                  <button className="w-8 h-8 bg-black text-white text-[11px] font-bold flex items-center justify-center rounded-full uppercase cursor-pointer">
                    {getInitials()}
                  </button>
                  {/* Dropdown */}
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-[12px] font-bold text-black truncate">
                        {getFullName()}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      href="/account"
                      className="block px-4 py-2.5 text-[12px] font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                    >
                      My Account
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2.5 text-[12px] font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={() => logoutMutation({} as any)}
                      disabled={loggingOut}
                      className="w-full text-left px-4 py-2.5 text-[12px] font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50 cursor-pointer"
                    >
                      {loggingOut ? "Logging out..." : "Sign Out"}
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:flex hover:scale-110 transition-transform text-[#1a1c1c]"
                >
                  <Icon
                    icon="tabler:user"
                    className="w-[24px] h-[24px] stroke-[1.5]"
                  />
                </Link>
              )}

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 rounded-full hover:bg-black/5 transition-all group"
              >
                <Icon
                  icon="tabler:shopping-bag"
                  className="w-[24px] h-[24px] group-hover:scale-105 transition-transform text-[#1a1c1c]"
                />
               {  isClient && cartCount > 0 && (<span className="absolute top-[-2px] right-[-2px] bg-[#ec7700] text-white text-[11px] w-[18px] h-[18px] flex items-center justify-center rounded-full font-bold shadow-sm">
                  {isClient ? cartCount : 0}
                </span>)}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Search Bar ──────────────────────────── */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[72px] left-0 right-0 bg-white border-b border-gray-100 px-5 py-3 md:hidden z-40"
          >
            <div className="flex items-center gap-3">
              <input
                ref={mobileInputRef}
                type="text"
                placeholder="Search products..."
                value={searchValue}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-[#f3f3f4] border-none outline-none rounded-full px-5 py-3 text-[14px] placeholder:text-[#8a7263]"
              />
              <button
                onClick={handleSearchSubmit}
                className="p-3 bg-black text-white rounded-full"
              >
                <Icon icon="tabler:search" className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-gray-500"
              >
                <Icon icon="tabler:x" className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Menu Overlay ────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[60] flex flex-col"
          >
            <div className="flex justify-between items-center h-[72px] px-5 border-b border-gray-100">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <Image
                  src="/DISPORT LOGOS/LOGO.webp"
                  alt="Logo"
                  width={120}
                  height={30}
                  className="object-contain"
                />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2"
              >
                <Icon icon="tabler:x" className="w-6 h-6 text-black" />
              </button>
            </div>

            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-2xl font-bold uppercase tracking-tight text-black font-['Space_Grotesk'] border-b border-gray-50 pb-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto p-6 bg-gray-50 space-y-4">
              <Link
                href="/wishlist"
                className="flex items-center gap-4 text-black font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon icon="tabler:heart" className="w-6 h-6" />
                <span>Wishlist</span>
                {isClient && wishlistCount > 0 && (
                  <span className="ml-auto bg-[#ec7700] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {isClient && isAuthenticated ? (
                <>
                  <div className="flex items-center gap-4 text-black font-medium border-t border-gray-200 pt-4">
                    <div className="w-8 h-8 bg-black text-white text-[11px] font-bold flex items-center justify-center rounded-full uppercase">
                      {getInitials()}
                    </div>
                    <span className="text-sm">{getFullName()}</span>
                  </div>
                  <button
                    onClick={() => {
                      logoutMutation({} as any);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-4 text-red-600 font-medium cursor-pointer"
                  >
                    <Icon icon="tabler:logout" className="w-6 h-6" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-4 text-black font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon icon="tabler:user" className="w-6 h-6" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
