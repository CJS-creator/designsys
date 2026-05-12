import { useState, useEffect, Suspense, lazy, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BrandSwitcher } from "@/components/BrandSwitcher";
import { Button } from "@/components/ui/button";
import { DesignSystemSidebar, DesignSystemSidebarMobile } from "@/components/DesignSystemSidebar";
import { DesignSystemInput, GeneratedDesignSystem } from "@/types/designSystem";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useUserRole } from "@/hooks/useUserRole";
import { injectDesignSystemVariables } from "@/lib/theming/injectVariables";
import { ArrowLeft, X, Lock, LogOut, User, HelpCircle, Palette, Sparkles } from "lucide-react";
import { usePresence } from "@/hooks/usePresence";
import { PresenceAvatars } from "@/components/PresenceAvatars";
import { ModeToggle } from "@/components/mode-toggle";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Spotlight } from "@/components/ui/spotlight";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useDesignSystemShortcuts } from "@/hooks/useDesignSystemShortcuts";
import { DesignSystemSkeleton } from "@/components/DesignSystemSkeleton";
import { useDesignSystemActions } from "@/hooks/useDesignSystemActions";
import { DashboardTabs } from "@/components/layout/DashboardTabs";
import { flattenDesignSystemToTokens } from "@/lib/token-utils";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { DesignSystemForm } from "@/components/DesignSystemForm";
import { DesignSystemPresets } from "@/components/DesignSystemPresets";
import { ShortcutOverlay } from "@/components/ShortcutOverlay";
import { FeatureTour } from "@/components/FeatureTour";

// Lazy-loaded components
const ExportButton = lazy(() => import("@/components/ExportButton").then(m => ({ default: m.ExportButton })));
const AIChatPanel = lazy(() => import("@/components/AIChatPanel").then(m => ({ default: m.AIChatPanel })));

const Index = () => {
  const [designSystem, setDesignSystem] = useState<GeneratedDesignSystem | null>(null);
  const [themedDesignSystem, setThemedDesignSystem] = useState<GeneratedDesignSystem | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");
  const [currentInput, setCurrentInput] = useState<DesignSystemInput | null>(null);
  
  const { user, signOut } = useAuth();
  const { resetOnboarding, selectedTemplate } = useOnboarding();
  const { role: userRole } = useUserRole(designSystem?.id || "");
  
  const [showGuestBanner, setShowGuestBanner] = useState(() => {
    return !localStorage.getItem("guest_banner_dismissed");
  });

  const { isLoading, handleGenerate, handleSave } = useDesignSystemActions(
    designSystem,
    setDesignSystem,
    setThemedDesignSystem,
    injectDesignSystemVariables
  );

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams, activeTab]);

  const scrollPositionsRef = useRef<Record<string, number>>({});

  const handleTabChange = (value: string) => {
    const main = document.querySelector<HTMLElement>("main[data-ds-main]");
    if (main) scrollPositionsRef.current[activeTab] = main.scrollTop;

    setActiveTab(value);
    setSearchParams({ tab: value }, { replace: true });
    
    if (typeof window !== "undefined" && window.location.hash !== `#${value}`) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search.includes("tab=") ? window.location.search : `?tab=${value}`}#${value}`);
    }

    requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>("main[data-ds-main]");
      if (target) target.scrollTop = scrollPositionsRef.current[value] ?? 0;
    });
  };

  const { onlineUsers, broadcastUpdate } = usePresence(designSystem?.id || "", (updatedDS, timestamp) => {
    if (timestamp && timestamp <= lastUpdateRef.current) return;
    if (timestamp) lastUpdateRef.current = timestamp;
    setDesignSystem(updatedDS);
    setThemedDesignSystem(updatedDS);
    injectDesignSystemVariables(updatedDS);
  });

  const handleRestoreVersion = (system: GeneratedDesignSystem) => {
    setDesignSystem(system);
    setThemedDesignSystem(system);
    injectDesignSystemVariables(system);
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

  useEffect(() => {
    if (designSystem) {
      const timeout = setTimeout(() => {
        lastUpdateRef.current = Date.now();
        broadcastUpdate(designSystem);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [designSystem, broadcastUpdate]);

  useDesignSystemShortcuts({
    onReset: () => { setDesignSystem(null); setCurrentInput(null); },
    hasDesignSystem: !!designSystem,
    onSave: handleSave,
  });

  // Result View (Dashboard)
  if ((designSystem || isLoading) && currentInput) {
    return (
      <div className="min-h-screen bg-background dark:bg-black/[0.96] antialiased bg-grid-black/[0.02] dark:bg-grid-white/[0.02] relative overflow-hidden transition-colors duration-300">
        <div className="fixed inset-0 pointer-events-none">
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 opacity-50 dark:opacity-100" fill="white" />
          <BackgroundBeams className="opacity-20 dark:opacity-40" />
        </div>

        <header className="sticky top-0 z-50 border-b border-border/40 bg-background/60 dark:bg-black/40 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20 animate-slide-in-down transition-all duration-300">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setDesignSystem(null)} aria-label="Go back" className="hover:rotate-[-10deg] transition-transform duration-300 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <DesignSystemSidebarMobile activeTab={activeTab} onTabChange={handleTabChange} />
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
                <>
                  <Button variant="ghost" size="sm" asChild className="hover-lift text-muted-foreground hover:text-foreground rounded-full px-4">
                    <Link to="/profile">
                      <User className="h-4 w-4 mr-2" /> Profile
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={signOut} className="hover-lift text-muted-foreground hover:text-foreground rounded-full px-4">
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </Button>
                </>
              ) : (
                <Button variant="ghost" size="sm" asChild className="hover-lift text-muted-foreground hover:text-foreground rounded-full px-4">
                  <Link to="/auth">
                    <User className="h-4 w-4 mr-2" /> Sign In
                  </Link>
                </Button>
              )}
              <ModeToggle />
              <div className="h-6 w-px bg-border/40 mx-2" />
              {designSystem && <BrandSwitcher designSystemId={designSystem.id || ""} />}
              <div id="tour-export">
                {designSystem && (
                  <Suspense fallback={<Button disabled size="lg">Export</Button>}>
                    <ExportButton designSystem={designSystem} />
                  </Suspense>
                )}
              </div>
            </div>
          </div>
        </header>

        {!user && showGuestBanner && (
          <div className="bg-primary/10 border-b border-primary/20 animate-fade-in backdrop-blur-md relative overflow-hidden">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-primary" />
                <p className="text-sm text-foreground font-medium">
                  Guest Mode: <span className="text-muted-foreground">Sign in to save and access all features.</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" asChild className="rounded-full">
                  <Link to="/auth">Sign In Free</Link>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setShowGuestBanner(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-1 relative z-10 min-h-0 h-[calc(100vh-73px)]">
          <DesignSystemSidebar activeTab={activeTab} onTabChange={handleTabChange} />
          <main data-ds-main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
              {isLoading && !designSystem ? (
                <DesignSystemSkeleton />
              ) : designSystem && (
                <DashboardTabs
                  activeTab={activeTab}
                  designSystem={designSystem}
                  themedDesignSystem={themedDesignSystem}
                  tokens={flattenDesignSystemToTokens(designSystem)}
                  onUpdate={(next) => {
                    setDesignSystem(next);
                    setThemedDesignSystem(next);
                    injectDesignSystemVariables(next);
                  }}
                />
              )}
            </div>
          </main>
        </div>
        <ShortcutOverlay />
        {designSystem && (
          <Suspense fallback={null}>
            <AIChatPanel
              designSystem={designSystem}
              onUpdate={(updated) => {
                setDesignSystem(updated);
                setThemedDesignSystem(updated);
                injectDesignSystemVariables(updated);
              }}
            />
          </Suspense>
        )}
      </div>
    );
  }

  // Home / Initial View (Form)
  return (
    <div className="min-h-screen bg-background dark:bg-black/[0.96] antialiased bg-grid-black/[0.02] dark:bg-grid-white/[0.02] relative overflow-hidden transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 opacity-50 dark:opacity-100" fill="white" />
        <BackgroundBeams className="opacity-20 dark:opacity-40" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-20 min-h-screen flex flex-col items-center">
        <header className="w-full flex items-center justify-between mb-12 md:mb-20 animate-slide-in-down">
          <div className="flex items-center gap-2 group">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg">DF</div>
            <span className="text-2xl font-black tracking-tighter text-foreground">DesignForge</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Button variant="ghost" asChild className="rounded-full">
                <Link to="/profile">My Projects</Link>
              </Button>
            ) : (
              <Button variant="ghost" asChild className="rounded-full">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
            <ModeToggle />
          </div>
        </header>

        <div className="w-full max-w-4xl space-y-20">
          <HeroSection />
          
          <div id="generation-form" className="scroll-mt-24 p-1 md:p-8 rounded-[2rem] border border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative">
              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4 uppercase tracking-widest">
                  <Sparkles className="h-3 w-3" /> Engine v2.0
                </div>
                <h2 className="text-3xl font-bold mb-2">Configure Your System</h2>
                <p className="text-muted-foreground">Define your brand personality and let AI handle the rest.</p>
              </div>
              <DesignSystemForm 
                onSubmit={(input) => { setCurrentInput(input); handleGenerate(input); }} 
                isLoading={isLoading} 
                initialValues={selectedTemplate ? {
                  industry: selectedTemplate.industry,
                  brandMood: selectedTemplate.mood,
                  primaryColor: selectedTemplate.primaryColor,
                  description: selectedTemplate.description,
                } : undefined}
              />
            </div>
          </div>

          <div className="mt-20">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-3 flex items-center justify-center gap-2">
                <Palette className="h-6 w-6 text-primary" /> Or Start from a Preset
              </h2>
            </div>
            <DesignSystemPresets onApplyPreset={(preset) => {
              setCurrentInput({
                appType: "web",
                industry: "Technology",
                brandMood: ["Modern"],
                description: preset.name
              });
              handleApplyPreset(preset);
            }} />
          </div>

          <FeaturesSection />
        </div>

        <footer className="w-full mt-20 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground pb-12">
          <p>© 2024 DesignForge AI. Built for the modern web.</p>
          <div className="flex items-center gap-8">
            <Link to="/docs" className="hover:text-foreground">Documentation</Link>
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          </div>
        </footer>
      </div>
      <ShortcutOverlay />
      <FeatureTour />
    </div>
  );
};

export default Index;
