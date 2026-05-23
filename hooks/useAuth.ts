"use client";

import { useState, useEffect, useCallback } from "react";
import { useGetApi } from "./useApi";
import API_ENDPOINTS from "@/app/constants/apiConfig";

// ── Cookie helper ────────────────────────────────────────
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return decodeURIComponent(match[2]);
  return null;
};

const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
};

// ── Types ────────────────────────────────────────────────
interface User {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  [key: string]: any;
}

export function useAuth() {
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const t = getCookie("_AT") || getCookie("authToken") || null;
    setToken(t);
  }, []);

  const isAuthenticated = isClient && !!token;

  // Fetch current user if authenticated
  const { data: userData, isLoading } = useGetApi<{ data: User }>({
    key: "currentUser",
    url: API_ENDPOINTS.USER.CURRENT_USER,
    requireAuth: true,
    options: {
      enabled: isAuthenticated,
      staleTime: 5 * 60 * 1000, // cache for 5 minutes
    },
  });

  const user: User | null = userData?.data || null;

  const getFullName = useCallback(() => {
    if (!user) return "Guest";
    return `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
  }, [user]);

  const getInitials = useCallback(() => {
    if (!user) return "G";
    const first = (user.firstName || "")[0] || "";
    const last = (user.lastName || "")[0] || "";
    return (first + last).toUpperCase() || "U";
  }, [user]);

  const logout = useCallback(() => {
    deleteCookie("_AT");
    deleteCookie("authToken");
    setToken(null);
    // Force re-render
    window.location.reload();
  }, []);

  return {
    user,
    isAuthenticated,
    isClient,
    isLoading,
    logout,
    getFullName,
    getInitials,
  };
}
