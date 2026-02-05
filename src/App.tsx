import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { OnboardingModal } from "@/components/onboarding";
import { ThemeProvider } from "@/components/theme-provider";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ErrorBoundary from "./components/ErrorBoundary";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Lazy load pages for bundle optimization
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SharedDesign = lazy(() => import("./pages/SharedDesign"));
const Landing = lazy(() => import("./pages/Landing"));
// Named export lazy loading
const PublicDocViewer = lazy(() => import("./components/docs/PublicDocViewer").then(module => ({ default: module.PublicDocViewer })));


const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary variant="full">
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <OnboardingProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <OnboardingModal />
              <BrowserRouter>
                <div className="min-h-screen bg-background text-foreground">
                  <Suspense fallback={
                    <div className="h-screen w-screen flex flex-col items-center justify-center gap-4">
                      <LoadingSpinner size="xl" />
                      <p className="text-muted-foreground animate-pulse text-sm font-medium">Loading DesignForge...</p>
                    </div>
                  }>
                    <Routes>
                      <Route path="/" element={<Landing />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/share/:id" element={<SharedDesign />} />
                      <Route path="/docs/:shareId" element={<PublicDocViewer />} />
                      <Route
                        path="/app"
                        element={
                          <ProtectedRoute>
                            <Index />
                          </ProtectedRoute>
                        }
                      />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </OnboardingProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);


export default App;
