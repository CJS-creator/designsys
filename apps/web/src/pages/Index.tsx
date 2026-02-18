import { useState, useEffect, Suspense, lazy } from "react";
import { monitor } from "@/lib/monitoring";
import { Link, useSearchParams } from "react-router-dom";
import { BrandSwitcher } from "@/components/BrandSwitcher";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { DesignSystemForm } from "@/components/DesignSystemForm";
import { ColorPaletteDisplay } from "@/components/ColorPaletteDisplay";
import { TypographyDisplay } from "@/components/TypographyDisplay";
import { SpacingDisplay } from "@/components/SpacingDisplay";
import { ShadowDisplay } from "@/components/ShadowDisplay";
import { GridDisplay } from "@/components/GridDisplay";
import { BorderRadiusDisplay } from "@/components/BorderRadiusDisplay";
import { ExportButton } from "@/components/ExportButton";
import { Button } from "@/components/ui/button";
import { ChevronDown, MoreHorizontal } from "lucide-react";

import { Tabs, TabsContent, TabsList, AnimatedTabsTrigger } from "@/components/ui/animated-tabs";
import { DesignSystemInput, GeneratedDesignSystem } from "@/types/designSystem";
import { hybridAdapter } from "@/lib/hybridAdapter";
import { SavedDesigns } from "@/components/SavedDesigns";
import { AnimationDisplay } from "@/components/AnimationDisplay";
import { InteractiveColorsDisplay } from "@/components/InteractiveColorsDisplay";
import { DesignSystemPresets } from "@/components/DesignSystemPresets";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { GitSettings } from "@/components/GitSettings";
import { useUserRole } from "@/hooks/useUserRole";
import { TeamSettings } from "@/components/TeamSettings";
import { AIAdvisor } from "@/components/AIAdvisor";
import { BrandSwapper } from "@/components/BrandSwapper";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { trackEvent } from "@/lib/analytics";



import { injectDesignSystemVariables } from "@/lib/theming/injectVariables";
import { SwatchBook, Sparkles, ArrowLeft, Wand2, History, FileText, LogOut, User, Brain, Box, Layers, Type, Settings as SettingsIcon, Users, Grid3X3, Palette, Eye, HelpCircle, Zap, X, Lock, Shield, ExternalLink, Ruler, Cast, Menu, BarChart3, ShieldCheck, ShoppingBag, Package } from "lucide-react";
import { usePresence } from "@/hooks/usePresence";
import { ModeToggle } from "@/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Spotlight } from "@/components/ui/spotlight";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useDesignSystemShortcuts } from "@/hooks/useKeyboardShortcuts";
import { ShortcutOverlay } from "@/components/ShortcutOverlay";
import { FeatureTour } from "@/components/FeatureTour";
import { DesignSystemSkeleton } from "@/components/DesignSystemSkeleton";
import { HeroSection } from "../components/HeroSection";
import { FeaturesOverview } from "../components/FeaturesOverview";
import { DesignHealthScore } from "@/components/DesignHealthScore";
import { AIChatPanel } from "@/components/AIChatPanel";
import { ComponentSandbox } from "@/components/ComponentSandbox";
import { ApprovalWorkflow } from "@/components/ApprovalWorkflow";
import { useTokens } from "@/hooks/useTokens";
import { PresenceAvatars } from "@/components/PresenceAvatars";

// Lazy-loaded heavy components
const AnimationSystemDocs = lazy(() => import("@/components/AnimationSystemDocs").then(m => ({ default: m.AnimationSystemDocs })));
const ComponentLibraryPreview = lazy(() => import("@/components/ComponentLibraryPreview").then(m => ({ default: m.ComponentLibraryPreview })));
const DesignInsights = lazy(() => import("@/components/DesignInsights").then(m => ({ default: m.DesignInsights })));
const MotionGallery = lazy(() => import("@/components/MotionGallery").then(m => ({ default: m.MotionGallery })));
const VisionGenerator = lazy(() => import("@/components/VisionGenerator").then(m => ({ default: m.VisionGenerator })));
const FigmaSync = lazy(() => import("@/components/FigmaSync").then(m => ({ default: m.FigmaSync })));
const ComponentBlueprints = lazy(() => import("@/components/ComponentBlueprints").then(m => ({ default: m.ComponentBlueprints })));
// Phase 2/3 Components are imported directly
const AccessibilityChecker = lazy(() => import("@/components/AccessibilityChecker").then(m => ({ default: m.AccessibilityChecker })));
const ColorBlindnessSimulator = lazy(() => import("@/components/ColorBlindnessSimulator").then(m => ({ default: m.ColorBlindnessSimulator })));
const TokenManagementDashboard = lazy(() => import("@/components/tokens/TokenManagementDashboard").then(m => ({ default: m.TokenManagementDashboard })));
const DocEditor = lazy(() => import("@/components/docs/DocEditor").then(m => ({ default: m.DocEditor })));
const Marketplace = lazy(() => import("@/components/marketplace/Marketplace").then(m => ({ default: m.Marketplace })));
const AssetHub = lazy(() => import("@/components/AssetHub").then(m => ({ default: m.AssetHub })));
// const GitSettings = lazy(() => import("@/components/GitSettings").then(m => ({ default: m.GitSettings }))); // GitSettings is now directly imported
// const TeamSettings = lazy(() => import("@/components/TeamSettings").then(m => ({ default: m.TeamSettings }))); // TeamSettings is now directly imported

const Index = () => {
  const [designSystem, setDesignSystem] = useState<GeneratedDesignSystem | null>(null);
  const [themedDesignSystem, setThemedDesignSystem] = useState<GeneratedDesignSystem | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");
  const [currentInput, setCurrentInput] = useState<DesignSystemInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [userRole, setUserRole] = useState<UserRole>("owner"); // TODO: Implement in Phase 2
  const { role: userRole } = useUserRole(designSystem?.id || "");
  const [showGuestBanner, setShowGuestBanner] = useState(() => {
    return !localStorage.getItem("guest_banner_dismissed");
  });
  const { user, signOut } = useAuth();
  const { resetOnboarding, selectedTemplate } = useOnboarding();
  const { tokens } = useTokens(designSystem?.id || "");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value }, { replace: true });
  };

  const handleGenerate = async (input: DesignSystemInput) => {
    setIsLoading(true);
    setCurrentInput(input);

    try {
      const generated = await hybridAdapter.generate(input);
      setDesignSystem(generated);
      setThemedDesignSystem(generated);
      injectDesignSystemVariables(generated);
      trackEvent(generated.id || searchParams.get("id") || "", "design_generated", { input });
      toast.success("AI-powered design system generated!", {
        description: "Your custom design system is ready to use.",
      });
    } catch (error) {
      // hybridAdapter already handles fallback internally, but if it throws, it means real failure
      monitor.error("Design generation failed", error as Error);
      // We can still try a manual fallback if needed, but hybridAdapter calls generateDesignSystemFallback internally on circuit breaker open
      // However, if hybridAdapter throws, it might be a deeper error. 
      // For now, let's keep a basic fallback or trust hybridAdapter.
      // The original code caught error and did fallback. hybridAdapter does allow error to propagate if fully failed?
      // hybridAdapter.generate returns Promise<GeneratedDesignSystem>. 
      // If it fails completely, we might want to show error.

      toast.error("Generation failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setDesignSystem(null);
    setCurrentInput(null);
  };

  const handleLoadDesign = (system: GeneratedDesignSystem) => {
    setDesignSystem(system);
    setThemedDesignSystem(system);
    injectDesignSystemVariables(system);
    toast.success("Design system loaded!");
  };

  const handleApplyPreset = (preset: GeneratedDesignSystem) => {
    setDesignSystem(preset);
    setCurrentInput({
      appType: "web",
      industry: "Technology",
      brandMood: ["Modern", "Professional"],
      primaryColor: preset.colors.primary,
      description: `Design system based on ${preset.name}`,
    });
    toast.success(`${preset.name} preset applied!`);
  };

  const handleRestoreVersion = (system: GeneratedDesignSystem) => {
    setDesignSystem(system);
    setThemedDesignSystem(system);
    injectDesignSystemVariables(system);
  };

  const handleVisionGenerate = (color: string) => {
    handleGenerate({
      appType: "web",
      industry: "Modern",
      brandMood: ["Modern", "Creative"],
      primaryColor: color,
      description: "Design system generated from visual inspiration",
    });
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("Sign in to save your design system");
      return;
    }
    if (!designSystem) return;

    const toastId = toast.loading("Saving design...");
    const { error } = await supabase.from("design_systems").insert({
      user_id: user.id,
      name: designSystem.name,
      description: `Generated styles`,
      design_system_data: designSystem as unknown as Json,
    });

    if (error) {
      toast.error("Failed to save", { id: toastId, description: error.message });
    } else {
      toast.success("Design saved!", { id: toastId });
    }
  };

  const { onlineUsers, broadcastUpdate } = usePresence(designSystem?.id || "", (updatedDs) => {
    setDesignSystem(updatedDs);
  });

  useEffect(() => {
    if (designSystem) {
      broadcastUpdate(designSystem);
    }
  }, [designSystem]);

  useDesignSystemShortcuts({
    onReset: handleReset,
    hasDesignSystem: !!designSystem,
    onSave: handleSave,
  });

  // Result View
  if ((designSystem || isLoading) && currentInput) {
    return (
      <div className="min-h-screen bg-background dark:bg-black/[0.96] antialiased bg-grid-black/[0.02] dark:bg-grid-white/[0.02] relative overflow-hidden transition-colors duration-300">
        <div className="fixed inset-0 pointer-events-none">
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 opacity-50 dark:opacity-100" fill="white" />
          <BackgroundBeams className="opacity-20 dark:opacity-40" />
        </div>

        <header className="sticky top-0 z-50 border-b border-border/40 bg-background/60 dark:bg-black/40 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20 animate-slide-in-down transition-all duration-300">
          <div className="container mx-auto py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleReset} aria-label="Go back" className="hover:rotate-[-10deg] transition-transform duration-300 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-neutral-600 to-neutral-900 dark:from-neutral-50 dark:to-neutral-400 animate-fade-in tracking-tight">
                  {designSystem?.name || "Generating System..."}
                </h1>
                <p className="text-sm text-muted-foreground animate-fade-in font-medium">
                  {designSystem ? "AI-Generated Design System" : "Creating your custom design language..."}
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={resetOnboarding} aria-label="Restart tour" title="Restart tour" className="hover-scale text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full" disabled={isLoading}>
                <HelpCircle className="h-4 w-4" />
              </Button>

              <PresenceAvatars users={onlineUsers} />

              {user ? (
                <Button variant="ghost" size="sm" onClick={signOut} className="hover-lift text-muted-foreground hover:text-foreground rounded-full px-4">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button variant="ghost" size="sm" asChild className="hover-lift text-muted-foreground hover:text-foreground rounded-full px-4">
                  <Link to="/auth">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              )}
              <ModeToggle />
              <div className="h-6 w-px bg-border/40 mx-2" />
              {designSystem && (
                <BrandSwitcher designSystemId={designSystem.id || ""} />
              )}
              <div id="tour-export">
                {designSystem && <ExportButton designSystem={designSystem} />}
              </div>
            </div>
          </div>
        </header>

        {!user && showGuestBanner && (
          <div className="bg-primary/10 border-b border-primary/20 animate-fade-in backdrop-blur-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
            <div className="container mx-auto py-3 flex items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 shadow-inner">
                  <Lock className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-foreground font-medium">
                  You are previewing as a guest. <span className="text-muted-foreground">Sign in to export, save, and access all features.</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" asChild className="rounded-full shadow-lg shadow-primary/20">
                  <Link to="/auth">
                    <User className="h-4 w-4 mr-2" />
                    Sign In Free
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full"
                  aria-label="Dismiss banner"
                  onClick={() => {
                    setShowGuestBanner(false);
                    localStorage.setItem("guest_banner_dismissed", "true");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <main className="container mx-auto px-6 md:px-12 py-8 animate-fade-in relative z-10">
          {isLoading && !designSystem ? (
            <DesignSystemSkeleton />
          ) : (
            designSystem && (
              <Tabs value={activeTab} className="w-full" onValueChange={handleTabChange}>
                {/* Modern Sliding Tabs with Scroll Indicators */}
                <div
                  className="sticky top-[72px] z-40 bg-background/60 dark:bg-black/60 backdrop-blur-xl border-b border-border/40 py-3 mb-4 -mx-6 md:-mx-12 px-6 md:px-12 relative"
                  id="tour-tabs"
                  role="navigation"
                  aria-label="Design system sections"
                >
                  {/* Left scroll indicator - only visible when scrolled right */}
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background via-background/60 to-transparent pointer-events-none z-10 md:hidden opacity-0 group-hover:opacity-100 transition-opacity" />
                  {/* Right scroll indicator - always visible on mobile until end */}
                  <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background via-background/60 to-transparent pointer-events-none z-10 md:hidden animate-pulse-soft" />

                  <div className="overflow-x-auto scrollbar-hide -mx-2">
                    <TabsList
                      className="bg-transparent p-0 h-auto flex-nowrap w-max md:w-full md:justify-start gap-1.5"
                      role="tablist"
                      aria-label="Design system sections"
                    >
                      <AnimatedTabsTrigger value="overview" className="gap-2 px-4 py-2.5 rounded-xl text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/5 hover:bg-muted/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-bold">
                        <Palette className="h-4.5 w-4.5" /> Overview
                      </AnimatedTabsTrigger>
                      <AnimatedTabsTrigger value="tokens" className="gap-2 px-4 py-2.5 rounded-xl text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/5 hover:bg-muted/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-bold">
                        <Box className="h-4.5 w-4.5" /> Tokens
                      </AnimatedTabsTrigger>
                      <AnimatedTabsTrigger value="docs" className="gap-2 px-4 py-2.5 rounded-xl text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/5 hover:bg-muted/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-bold">
                        <FileText className="h-4.5 w-4.5" /> Docs
                      </AnimatedTabsTrigger>
                      <AnimatedTabsTrigger value="preview" className="gap-1.5 px-3 py-2 rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none hover:bg-muted/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                        <Eye className="h-4 w-4" /> Preview
                      </AnimatedTabsTrigger>
                      <AnimatedTabsTrigger value="components" className="gap-1.5 px-3 py-2 rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none hover:bg-muted/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                        <Layers className="h-4 w-4" /> Components
                      </AnimatedTabsTrigger>
                      <AnimatedTabsTrigger value="motion" className="gap-1.5 px-3 py-2 rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none hover:bg-muted/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-bold">
                        <Zap className="h-4 w-4" /> Motion
                      </AnimatedTabsTrigger>

                      <div className="h-6 w-px bg-border/40 mx-1 self-center hidden md:block" />

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "gap-1.5 px-3 py-2 rounded-lg hover:bg-muted/50 transition-all focus-visible:outline-none",
                              !["overview", "tokens", "docs", "preview", "components", "motion"].includes(activeTab) && "text-primary bg-primary/5"
                            )}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="text-sm font-bold">More</span>
                            <ChevronDown className="h-3 w-3 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl">
                          {[
                            { value: "team", label: "Team", icon: Users },
                            { value: "governance", label: "Governance", icon: ShieldCheck },
                            { value: "marketplace", label: "Store", icon: ShoppingBag },
                            { value: "assets", label: "Assets", icon: Package },
                            { value: "vision", label: "Vision", icon: Sparkles },
                            { value: "insights", label: "Insights", icon: Brain },
                            { value: "themes", label: "Themes", icon: SwatchBook },
                            { value: "analytics", label: "Analytics", icon: BarChart3 },
                            { value: "accessibility", label: "Accessibility", icon: Shield },
                            { value: "figma", label: "Figma", icon: ExternalLink },
                            { value: "saved", label: "Saved", icon: History },
                            { value: "settings", label: "Settings", icon: SettingsIcon },
                          ].map((item) => (
                            <DropdownMenuItem
                              key={item.value}
                              onClick={() => handleTabChange(item.value)}
                              className={cn(
                                "gap-2 py-2.5 px-3 rounded-xl cursor-pointer",
                                activeTab === item.value ? "bg-primary/10 text-primary" : "hover:bg-muted"
                              )}
                            >
                              <item.icon className="h-4 w-4 shrink-0" />
                              <span className="font-bold text-xs">{item.label}</span>
                              {activeTab === item.value && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TabsList>
                  </div>
                </div>

                <div className="relative min-h-[500px]">
                  <TabsContent value="overview" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Simplified container - relying on top-level provider/main container */}
                    <div className="w-full">
                      <div className="flex flex-col gap-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                          <div className="lg:col-span-8 space-y-8">
                            <HeroSection designSystem={designSystem} />
                            <FeaturesOverview designSystem={designSystem} />
                          </div>
                          <div className="lg:col-span-4 sticky top-[140px] space-y-6">
                            <DesignHealthScore designSystem={designSystem} />
                            <AIAdvisor designSystem={designSystem} />
                            <InteractiveColorsDisplay colors={designSystem.colors} />
                          </div>
                        </div>

                        {/* Brand Color Palette Section */}
                        <div className="p-6 md:p-10 rounded-xl border border-border bg-card shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Palette className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold text-foreground">Brand Color Palette</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">Primary, secondary, and accent colors with semantic variants</p>
                          <ColorPaletteDisplay colors={designSystem.colors} />
                        </div>

                        {/* Typography System Section */}
                        <div className="p-6 md:p-10 rounded-xl border border-border bg-card shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Type className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold text-foreground">Typography System</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">Heading and body scales using modern font pairings</p>
                          <TypographyDisplay typography={designSystem.typography} />
                        </div>

                        {/* Spacing & Border Radius Combined Section */}
                        <div className="p-6 md:p-10 rounded-xl border border-border bg-card shadow-sm">
                          <div className="flex items-center gap-2 mb-4">
                            <Ruler className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold text-foreground">Spacing & Radius</h3>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Spacing Scale</h4>
                              <p className="text-xs text-muted-foreground mb-4">{designSystem.spacing.unit}px base unit with consistent scale</p>
                              <SpacingDisplay spacing={designSystem.spacing} />
                            </div>
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Border Radius</h4>
                              <p className="text-xs text-muted-foreground mb-4">{designSystem.borderRadius.md} standard radius with full range</p>
                              <BorderRadiusDisplay borderRadius={designSystem.borderRadius} />
                            </div>
                          </div>
                        </div>

                        {/* Elevation & Shadows Section */}
                        <div className="p-6 md:p-10 rounded-xl border border-border bg-card shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Cast className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold text-foreground">Elevation & Shadows</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">Light and dark mode compatible elevation system</p>
                          <ShadowDisplay shadows={designSystem.shadows} />
                        </div>

                        {/* Layout Grid Section */}
                        <div className="p-6 md:p-10 rounded-xl border border-border bg-card shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Grid3X3 className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold text-foreground">Layout Grid</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">Responsive 12-column grid with flexible layout system</p>
                          <GridDisplay grid={designSystem.grid} />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="tokens" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Suspense fallback={<DesignSystemSkeleton />}>
                      <TokenManagementDashboard
                        designSystem={designSystem}
                        designSystemId={designSystem?.id || searchParams.get("id") || ""}
                      />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="docs" className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Suspense fallback={<DesignSystemSkeleton />}>
                      <DocEditor designSystemId={designSystem?.id || ""} />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="settings" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Suspense fallback={<DesignSystemSkeleton />}>
                      <GitSettings designSystemId={designSystem?.id || ""} />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="preview" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Suspense fallback={<DesignSystemSkeleton />}>
                      <InteractiveColorsDisplay colors={designSystem.colors} />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="components" className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                    <Suspense fallback={<DesignSystemSkeleton />}>
                      <ComponentSandbox />
                      <ComponentLibraryPreview designSystem={designSystem} />
                      <ComponentBlueprints designSystem={designSystem} />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="motion" className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                    <Suspense fallback={<DesignSystemSkeleton />}>
                      <AnimationDisplay animations={designSystem.animations} />
                      <MotionGallery designSystem={designSystem} />
                      <AnimationSystemDocs />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="team" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Suspense fallback={<DesignSystemSkeleton />}>
                      <TeamSettings designSystemId={designSystem?.id || ""} currentUserRole={userRole} />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="governance" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Suspense fallback={<DesignSystemSkeleton />}>
                      <ApprovalWorkflow designSystemId={designSystem?.id || ""} />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="vision" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Suspense fallback={<DesignSystemSkeleton />}>
                      <VisionGenerator onDesignGenerated={handleVisionGenerate} isGenerating={isLoading} />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="insights" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Suspense fallback={<DesignSystemSkeleton />}>
                      <DesignInsights designSystem={themedDesignSystem || designSystem} onUpdate={setDesignSystem} />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="themes" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Suspense fallback={<DesignSystemSkeleton />}>
                      <BrandSwapper
                        designSystemId={designSystem?.id || ""}
                        baseDesignSystem={designSystem!}
                        onThemeChange={setThemedDesignSystem}
                      />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="analytics" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Suspense fallback={<DesignSystemSkeleton />}>
                      <AnalyticsDashboard designSystemId={designSystem?.id || searchParams.get("id") || ""} />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="accessibility" className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                    <Suspense fallback={<DesignSystemSkeleton />}>
                      <AccessibilityChecker
                        colors={designSystem.colors}
                        darkColors={designSystem.darkColors}
                        onUpdate={(colors, darkColors) => setDesignSystem({ ...designSystem, colors, darkColors })}
                      />
                      <ColorBlindnessSimulator colors={designSystem.colors} />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="figma" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Suspense fallback={<DesignSystemSkeleton />}>
                      <FigmaSync designSystemId={searchParams.get("id") || undefined} />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="saved" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Suspense fallback={<DesignSystemSkeleton />}>
                      <SavedDesigns onLoad={handleLoadDesign} currentSystem={designSystem} />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="marketplace" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Suspense fallback={<DesignSystemSkeleton />}>
                      <Marketplace
                        onImport={handleRestoreVersion}
                        currentSystemId={designSystem?.id}
                      />
                    </Suspense>
                  </TabsContent>

                  <TabsContent value="assets" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Suspense fallback={<DesignSystemSkeleton />}>
                      <AssetHub designSystem={designSystem!} tokens={tokens || []} />
                    </Suspense>
                  </TabsContent>
                </div>
              </Tabs >
            )
          )}
        </main >
        <ShortcutOverlay />
        {
          designSystem && (
            <AIChatPanel
              designSystem={designSystem}
              onUpdate={(updated) => {
                setDesignSystem(updated);
                setThemedDesignSystem(updated);
                injectDesignSystemVariables(updated);
              }}
            />
          )
        }
      </div >
    );
  }

  // Home / Initial View
  return (
    <div className="min-h-screen bg-background dark:bg-black/[0.96] antialiased bg-grid-black/[0.02] dark:bg-grid-white/[0.02] relative overflow-hidden transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 opacity-50 dark:opacity-100" fill="white" />
        <BackgroundBeams className="opacity-20 dark:opacity-40" />
      </div>

      <div className="relative z-10">
        <header className="py-6 animate-fade-in border-b border-border/40 bg-background/60 dark:bg-black/40 backdrop-blur-xl sticky top-0 z-50 transition-all">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Wand2 className="h-8 w-8 text-primary dark:text-white transition-all duration-500 group-hover:rotate-12 group-hover:scale-110" />
                <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-b from-neutral-600 to-neutral-900 dark:from-neutral-50 dark:to-neutral-400 tracking-tighter">DesignForge</span>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              <ModeToggle />
              {user ? (
                <Button variant="ghost" size="sm" onClick={signOut} className="hover-lift text-muted-foreground hover:text-foreground rounded-full px-4">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button variant="ghost" size="sm" asChild className="hover-lift text-muted-foreground hover:text-foreground rounded-full px-4">
                  <Link to="/auth">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              )}
            </div>

            <div className="md:hidden flex items-center gap-2">
              <ModeToggle />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open menu" className="rounded-full">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 mt-6">
                    {user ? (
                      <Button variant="ghost" onClick={signOut} className="justify-start">
                        <LogOut className="h-4 w-4 mr-2" /> Sign Out
                      </Button>
                    ) : (
                      <Button variant="ghost" asChild className="justify-start">
                        <Link to="/auth">
                          <User className="h-4 w-4 mr-2" /> Sign In
                        </Link>
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/20 blur-[100px] -z-10 rounded-full mix-blend-screen" />

            <div className="text-center mb-20 relative">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-black uppercase tracking-widest mb-10 animate-fade-in-up hover-scale cursor-default shadow-lg shadow-primary/10">
                <Brain className="h-4 w-4 animate-pulse-soft" />
                Powered by AI
              </div>
              <h1 className="text-6xl md:text-8xl font-black mb-10 leading-[0.95] animate-fade-in-up tracking-tighter break-words overflow-wrap-anywhere" style={{ animationDelay: '0.1s' }}>
                Create Complete{" "}
                <span className="text-primary relative inline-block">
                  Design Systems
                  <svg className="absolute w-full h-4 -bottom-2 left-0 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="12" fill="none" />
                  </svg>
                </span>{" "}
                in Seconds
              </h1>
              <p className="text-2xl md:text-3xl text-muted-foreground/80 max-w-3xl mx-auto animate-fade-in-up font-bold leading-relaxed tracking-tight" style={{ animationDelay: '0.2s' }}>
                Our AI analyzes your project requirements and generates a comprehensive,
                context-aware design system with complete token architecture.
              </p>
            </div>

            <div className="animate-fade-in-up relative z-20" style={{ animationDelay: '0.3s' }} id="tour-input-section">
              <div className="bg-card/40 backdrop-blur-md rounded-[2rem] border border-border/50 p-2 shadow-2xl ring-1 ring-white/10">
                <DesignSystemForm
                  onGenerate={handleGenerate}
                  isLoading={isLoading}
                  initialValues={
                    selectedTemplate ? {
                      industry: selectedTemplate.industry,
                      brandMood: selectedTemplate.mood,
                      primaryColor: selectedTemplate.primaryColor,
                      description: selectedTemplate.description,
                    } : undefined
                  }
                />
              </div>
            </div>

            <div className="mt-20 animate-fade-in-up" style={{ animationDelay: '0.35s' }} id="tour-presets">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-3 flex items-center justify-center gap-2">
                  <Palette className="h-6 w-6 text-primary" />
                  Or Start from a Preset
                </h2>
                <p className="text-muted-foreground font-medium">Choose from popular design system architectures</p>
              </div>
              <DesignSystemPresets onApplyPreset={handleApplyPreset} />
            </div>

            <div className="mt-24 grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Brain,
                  title: "AI-Powered Analysis",
                  description: "Our AI understands your industry and mood to create perfect color harmonies",
                  delay: 0.4
                },
                {
                  icon: Sparkles,
                  title: "Smart Typography",
                  description: "Professionally paired fonts based on industry best practices",
                  delay: 0.5
                },
                {
                  icon: Wand2,
                  title: "Export Anywhere",
                  description: "Download as CSS variables, Tailwind config, or JSON",
                  delay: 0.6
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-8 rounded-[2rem] bg-card/30 border border-border/50 backdrop-blur-sm card-interactive animate-fade-in-up group hover:bg-card/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-primary/5 cursor-default"
                  style={{ animationDelay: `${feature.delay}s` }}
                >
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <feature.icon className="h-6 w-6 text-primary transition-all duration-300 group-hover:rotate-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 transition-colors duration-300 group-hover:text-primary">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      <ShortcutOverlay />
      <FeatureTour />
    </div>
  );
};

export default Index;
