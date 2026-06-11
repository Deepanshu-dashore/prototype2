"use client";

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetApi } from "./useApi";
import API_ENDPOINTS from "@/app/constants/apiConfig";
import { RootState } from "@/app/store/store";
import { setUser, logout as logoutAction, setLoading } from "@/app/store/userSlice";

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

  // Redux Selectors
  const user = useSelector((state: RootState) => state.user.user);
  const reduxIsAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const reduxLoading = useSelector((state: RootState) => state.user.loading);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch current user if authenticated
  const { data: userData, isSuccess, isError, isLoading: isQueryLoading } = useGetApi<{ data: User }>({
    key: "currentUser",
    url: API_ENDPOINTS.USER.CURRENT_USER,
    requireAuth: false,
    options: {
      enabled: isClient,
      staleTime: 5 * 60 * 1000, // cache for 5 minutes
      retry: false, // Do not retry on mount if unauthorized
    },
  });

  const apiUser = userData?.data || null;

  // Sync with Redux Store
  useEffect(() => {
    if (isClient) {
      if (isSuccess && apiUser) {
        dispatch(setUser(apiUser));
      } else if (isError) {
        dispatch(setUser(null));
      }
    }
  }, [apiUser, isClient, isSuccess, isError, dispatch]);

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
