"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./store/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1E1E1E",
            color: "#FFFFFF",
            fontSize: "13px",
            fontWeight: 600,
            marginTop: "100px",
            letterSpacing: "0.02em",
            padding: "14px 20px",
            borderRadius: "4px",
          },
          success: {
            iconTheme: {
              primary: "#ec7700",
              secondary: "#FFFFFF",
            },
          },
          error: {
            iconTheme: {
              primary: "#ba1a1a",
              secondary: "#FFFFFF",
            },
          },
        }}
      />
      {children}
      </Provider>
    </QueryClientProvider>
  );
}
