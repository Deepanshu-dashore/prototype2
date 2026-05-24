"use client";

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetApi } from "./useApi";
import API_ENDPOINTS from "@/app/constants/apiConfig";
import { RootState } from "@/app/store/store";
import { setUser, logout as logoutAction, setLoading } from "@/app/store/userSlice";

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
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Redux Selectors
  const user = useSelector((state: RootState) => state.user.user);
  const reduxIsAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const reduxLoading = useSelector((state: RootState) => state.user.loading);

  useEffect(() => {
    setIsClient(true);
    const t = getCookie("_AT") || getCookie("authToken") || null;
    setToken(t);
  }, []);

  const hasToken = isClient && !!token;

  // Fetch current user if authenticated
  const { data: userData, isLoading: isQueryLoading } = useGetApi<{ data: User }>({
    key: "currentUser",
    url: API_ENDPOINTS.USER.CURRENT_USER,
    requireAuth: true,
    options: {
      enabled: hasToken,
      staleTime: 5 * 60 * 1000, // cache for 5 minutes
    },
  });

  const apiUser = userData?.data || null;

  // Sync with Redux Store
  useEffect(() => {
    if (isClient) {
      if (!token) {
        dispatch(setUser(null));
      } else if (apiUser) {
        dispatch(setUser(apiUser));
      } else if (!isQueryLoading && !apiUser) {
        dispatch(setUser(null));
      }
    }
  }, [apiUser, token, isClient, isQueryLoading, dispatch]);

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
    dispatch(logoutAction());
    // Force re-render
    window.location.reload();
  }, [dispatch]);

  return {
    user,
    isAuthenticated: reduxIsAuthenticated,
    isClient,
    isLoading: reduxLoading || isQueryLoading,
    logout,
    getFullName,
    getInitials,
  };
}
