import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import ErrorBoundary from "@/components/ErrorBoundary";
import RouteErrorBoundary from "@/components/RouteErrorBoundary";
import OfflineIndicator from "@/components/OfflineIndicator";

import PageTransition from "@/components/PageTransition";

import AppRoutes from "./routes.tsx";
import { AuthProvider } from "./providers/AuthProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { DriveProvider } from "@/context/drive/DriveContext.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <DriveProvider>
              <ErrorBoundary>
                <Suspense
                  fallback={
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                    </div>
                  }
                >
                  <RouteErrorBoundary>
                    <PageTransition>
                      <AppRoutes />
                    </PageTransition>
                  </RouteErrorBoundary>
                </Suspense>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: "var(--color-surface)",
                      color: "var(--color-foreground)",
                      borderRadius: "var(--radius-2xl)",
                      border: "1px solid var(--color-border)",
                      boxShadow: "var(--shadow-medium)",
                    },
                    success: {
                      iconTheme: {
                        primary: "var(--color-primary-500)",
                        secondary: "var(--color-surface)",
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: "#ef4444",
                        secondary: "var(--color-surface)",
                      },
                    },
                  }}
                />
                <OfflineIndicator />
              </ErrorBoundary>
            </DriveProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
