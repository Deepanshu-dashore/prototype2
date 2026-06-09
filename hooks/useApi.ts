"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return decodeURIComponent(match[2]);
  return null;
};

// Base API URL from env
const BaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2500";

export const api = axios.create({
  baseURL: BaseUrl,
});

// 🔹 Helper to build headers
interface HeaderOptions {
  requireAuth?: boolean;
  multiPart?: boolean;
}

const getHeader = ({
  requireAuth = true,
  multiPart = false,
}: HeaderOptions = {}) => {
  const token = getCookie("_AT") || getCookie("authToken") || null;

  if (requireAuth && !token) {
    // You can handle redirection or global toast here
    throw new Error("Please log in");
  }

  const headers: Record<string, string> = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!multiPart) {
    headers["Content-Type"] = "application/json";
  } else {
    headers["Content-Type"] = "multipart/form-data";
  }

  return headers;
};

/* ===========================================================
   🔹 Hook for GET requests (useQuery)
   =========================================================== */
interface UseGetApiProps<
  TQueryFnData = any,
  TError = unknown,
  TData = TQueryFnData,
> {
  key: string | readonly unknown[];
  url: string;
  requireAuth?: boolean;
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData>,
    "queryKey" | "queryFn"
  >;
  params?: Record<string, any>;
  payload?: any; // GET requests usually don't have a body, but added for flexibility
}

export const useGetApi = <
  TQueryFnData = any,
  TError = AxiosError,
  TData = TQueryFnData,
>({
  key,
  url,
  requireAuth = true,
  options = {},
  params = {},
  payload,
}: UseGetApiProps<TQueryFnData, TError, TData>) => {
  const queryKey = Array.isArray(key) ? key : [key];

  return useQuery<TQueryFnData, TError, TData>({
    queryKey: [...queryKey, params, requireAuth],
    queryFn: async () => {
      const config: AxiosRequestConfig = {
        headers: getHeader({ requireAuth }),
        params,
      };

      if (payload) {
        config.data = payload;
      }

      const res = await api.get<TQueryFnData>(url, config);
      return res.data;
    },
    ...options,
  });
};

/* ===========================================================
   🔹 Hook for Mutations (POST, PATCH, PUT, DELETE)
   =========================================================== */
type HttpMethod = "POST" | "PATCH" | "PUT" | "DELETE";

interface MutationVariables {
  id?: string | number | null;
  payload?: any;
  params?: Record<string, any>;
}

interface UseMutationApiProps<
  TData = unknown,
  TError = AxiosError,
  TVariables = MutationVariables,
  TContext = unknown,
> {
  key: string | readonly unknown[];
  url: string;
  method?: HttpMethod;
  requireAuth?: boolean;
  multiPart?: boolean;
  options?: UseMutationOptions<TData, TError, TVariables, TContext>;
}

export const useMutationApi = <
  TData = any,
  TError = AxiosError,
  TVariables = MutationVariables,
  TContext = unknown,
>({
  key,
  url,
  method = "POST",
  requireAuth = true,
  multiPart = false,
  options = {},
}: UseMutationApiProps<TData, TError, TVariables, TContext>) => {
  const queryClient = useQueryClient();
  const baseQueryKey = Array.isArray(key) ? key : [key];

  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn: async (variables: TVariables) => {
      const {
        id = null,
        payload = {},
        params = {},
      } = (variables || {}) as MutationVariables;

      try {
        const requestedUrl = id ? `${url}/${id}` : url;
        const config: AxiosRequestConfig = {
          headers: getHeader({ requireAuth, multiPart }),
          params,
        };

        let response;
        switch (method) {
          case "POST":
            response = await api.post<TData>(requestedUrl, payload, config);
            break;
          case "PATCH":
            response = await api.patch<TData>(requestedUrl, payload, config);
            break;
          case "PUT":
            response = await api.put<TData>(requestedUrl, payload, config);
            break;
          case "DELETE":
            config.data = payload; // Axios delete requires body in config.data
            response = await api.delete<TData>(requestedUrl, config);
            break;
          default:
            throw new Error(`Invalid HTTP method: ${method}`);
        }
        return response.data;
      } catch (error) {
        console.log(
          `Mutation Error for ------>>${baseQueryKey.join("-")}:`,
          error,
        );
        throw error;
      }
    },
    ...options,
    onSuccess: (data: TData, variables: TVariables, context: TContext) => {
      const vars = variables as MutationVariables;

      // Invalidate specific queries based on the key to refetch data
      queryClient.invalidateQueries({
        queryKey: vars?.params ? [...baseQueryKey, vars.params] : baseQueryKey,
      });

      // Call custom onSuccess if provided
      if (options.onSuccess) {
        (options.onSuccess as any)(data, variables, context);
      }
    },
    onError: (
      error: TError,
      variables: TVariables,
      context: TContext | undefined,
    ) => {
      console.error(`Mutation Error for ${baseQueryKey.join("-")}:`, error);

      // Call custom onError if provided
      if (options.onError) {
        (options.onError as any)(error, variables, context);
      }
    },
  });
};
