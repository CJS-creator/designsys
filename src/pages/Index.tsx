import { useState, lazy, Suspense } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
import { AuthRequiredWrapper } from "@/components/AuthRequiredWrapper";
import { Tabs, TabsContent, TabsList, AnimatedTabsTrigger } from "@/components/ui/animated-tabs";
import { DesignSystemInput, GeneratedDesignSystem } from "@/types/designSystem";
import { generateDesignSystemWithAI, generateDesignSystemFallback } from "@/lib/generateDesignSystem";
import { SavedDesigns } from "@/components/SavedDesigns";
import { AnimationDisplay } from "@/components/AnimationDisplay";
import { InteractiveColorsDisplay } from "@/components/InteractiveColorsDisplay";
import { DesignSystemPresets } from "@/components/DesignSystemPresets";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { UserRole } from "@/components/TeamSettings";
import {
  Sparkles,
  ArrowLeft,
  Wand2,
  History,
  FileText,
  LogOut,
  User,
  Brain,
  Activity,
  Layers,
  Type,
  Grid3X3,
  Palette,
  Eye,
  Smartphone,
  Code2,
  HelpCircle,
  Zap,
  X,
  Search,
  Lock,
  Layout,
  GitCompare,
  Shield,
  BookOpen,
  ExternalLink,
  Ruler,
  Maximize,
  Cast,
  Menu
} from "lucide-react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/mode-toggle";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Spotlight } from "@/components/ui/spotlight";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useDesignSystemShortcuts } from "@/hooks/useKeyboardShortcuts";
import { ShortcutOverlay } from "@/components/ShortcutOverlay";
import { FeatureTour } from "@/components/FeatureTour";
import { DesignSystemSkeleton } from "@/components/DesignSystemSkeleton";

// Lazy-loaded heavy components
const AnimationSystemDocs = lazy(() => import("@/components/AnimationSystemDocs").then(m => ({ default: m.AnimationSystemDocs })));
const ComponentLibraryPreview = lazy(() => import("@/components/ComponentLibraryPreview").then(m => ({ default: m.ComponentLibraryPreview })));
const DesignInsights = lazy(() => import("@/components/DesignInsights").then(m => ({ default: m.DesignInsights })));
const MotionGallery = lazy(() => import("@/components/MotionGallery").then(m => ({ default: m.MotionGallery })));
const VisionGenerator = lazy(() => import("@/components/VisionGenerator").then(m => ({ default: m.VisionGenerator })));
const FigmaSync = lazy(() => import("@/components/FigmaSync").then(m => ({ default: m.FigmaSync })));
const ComponentBlueprints = lazy(() => import("@/components/ComponentBlueprints").then(m => ({ default: m.ComponentBlueprints })));
const VersionDiff = lazy(() => import("@/components/VersionDiff").then(m => ({ default: m.VersionDiff })));
const AuditLogViewer = lazy(() => import("@/components/AuditLogViewer").then(m => ({ default: m.AuditLogViewer })));
const TeamSettings = lazy(() => import("@/components/TeamSettings").then(m => ({ default: m.TeamSettings })));
const AccessibilityChecker = lazy(() => import("@/components/AccessibilityChecker").then(m => ({ default: m.AccessibilityChecker })));
const ColorBlindnessSimulator = lazy(() => import("@/components/ColorBlindnessSimulator").then(m => ({ default: m.ColorBlindnessSimulator })));

const Index = () => {
  const [designSystem, setDesignSystem] = useState<GeneratedDesignSystem | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentInput, setCurrentInput] = useState<DesignSystemInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("admin");
  const [showGuestBanner, setShowGuestBanner] = useState(() => {
    return !sessionStorage.getItem("guest_banner_dismissed");
  });
  const { user, signOut } = useAuth();
  const { resetOnboarding, selectedTemplate } = useOnboarding();
  const [searchParams] = useSearchParams();

  const handleGenerate = async (input: DesignSystemInput) => {
    setIsLoading(true);
    setCurrentInput(input);

    try {
      const generated = await generateDesignSystemWithAI(input);
      setDesignSystem(generated);
      toast.success("AI-powered design system generated!", {
        description: "Your custom design system is ready to use.",
      });
    } catch (error) {
      console.error("AI generation failed, using fallback:", error);
      const fallbackSystem = generateDesignSystemFallback(input);
      setDesignSystem(fallbackSystem);
      toast.warning("Generated with fallback algorithm", {
        description: error instanceof Error ? error.message : "AI generation unavailable",
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

  useDesignSystemShortcuts({
    onReset: handleReset,
    hasDesignSystem: !!designSystem,
    onSave: handleSave,
  });

  // Result View
  if ((designSystem || isLoading) && currentInput) {
    return (
      <div className="min-h-screen bg-background dark:bg-black/[0.96] antialiased bg-grid-black/[0.02] dark:bg-grid-white/[0.02] relative overflow-hidden transition-colors duration-300">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 hidden dark:block" fill="white" />
        <BackgroundBeams className="opacity-40 hidden dark:block" />

        <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 dark:bg-black/75 backdrop-blur-xl animate-slide-in-down">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleReset} aria-label="Go back" className="hover:rotate-[-10deg] transition-transform duration-300 text-muted-foreground hover:text-foreground hover:bg-muted/50">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-neutral-600 to-neutral-900 dark:from-neutral-50 dark:to-neutral-400 animate-fade-in">
                  {designSystem?.name || "Generating System..."}
                </h1>
                <p className="text-sm text-muted-foreground animate-fade-in">
                  {designSystem ? "AI-Generated Design System" : "Creating your custom design language..."}
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={resetOnboarding} aria-label="Restart tour" title="Restart tour" className="hover-scale text-muted-foreground hover:text-foreground hover:bg-muted/50" disabled={isLoading}>
                <HelpCircle className="h-4 w-4" />
              </Button>
              {user ? (
                <Button variant="ghost" size="sm" onClick={signOut} className="hover-lift text-muted-foreground hover:text-foreground">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button variant="ghost" size="sm" asChild className="hover-lift text-muted-foreground hover:text-foreground">
                  <Link to="/auth">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              )}
              <ModeToggle />
              <div id="tour-export">
                {designSystem && <ExportButton designSystem={designSystem} />}
              </div>
            </div>
          </div>
        </header>

        {!user && showGuestBanner && (
          <div className="bg-primary/20 border-b border-primary/30 animate-fade-in backdrop-blur-sm">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/30">
                  <Lock className="h-4 w-4 text-primary-foreground" />
                </div>
                <p className="text-sm text-foreground">
                  <span className="font-medium">You are previewing as a guest.</span>{" "}
                  <span className="text-muted-foreground">Sign in to export, save, and access all features.</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" asChild variant="secondary">
                  <Link to="/auth">
                    <User className="h-4 w-4 mr-2" />
                    Sign In Free
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  onClick={() => {
                    setShowGuestBanner(false);
                    sessionStorage.setItem("guest_banner_dismissed", "true");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <main className="container mx-auto px-4 py-8 animate-fade-in relative z-10">
          {isLoading && !designSystem ? (
            <DesignSystemSkeleton />
          ) : (
            designSystem && (
              <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                <div className="sticky top-[72px] z-40 bg-background/80 backdrop-blur-md border-b border-border/40 py-2 mb-6 -mx-4 px-4 overflow-x-auto no-scrollbar" id="tour-tabs">
                  <TabsList className="bg-muted/50 p-1 h-auto flex-nowrap w-max md:w-full md:justify-start">
                    <AnimatedTabsTrigger value="overview" className="gap-2 py-2">
                      <Palette className="h-4 w-4" /> Overview
                    </AnimatedTabsTrigger>
                    <AnimatedTabsTrigger value="preview" className="gap-2 py-2">
                      <Eye className="h-4 w-4" /> Preview
                    </AnimatedTabsTrigger>
                    <AnimatedTabsTrigger value="components" className="gap-2 py-2">
                      <Layers className="h-4 w-4" /> Components
                    </AnimatedTabsTrigger>
                    <AnimatedTabsTrigger value="motion" className="gap-2 py-2">
                      <Activity className="h-4 w-4" /> Motion
                    </AnimatedTabsTrigger>
                    <AnimatedTabsTrigger value="vision" className="gap-2 py-2">
                      <Sparkles className="h-4 w-4" /> Vision
                    </AnimatedTabsTrigger>
                    <AnimatedTabsTrigger value="insights" className="gap-2 py-2">
                      <Brain className="h-4 w-4" /> Insights
                    </AnimatedTabsTrigger>
                    <AnimatedTabsTrigger value="accessibility" className="gap-2 py-2">
                      <Shield className="h-4 w-4" /> Accessibility
                    </AnimatedTabsTrigger>
                    <AnimatedTabsTrigger value="figma" className="gap-2 py-2">
                      <ExternalLink className="h-4 w-4" /> Figma
                    </AnimatedTabsTrigger>
                    <AnimatedTabsTrigger value="saved" className="gap-2 py-2">
                      <History className="h-4 w-4" /> Saved
                    </AnimatedTabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="overview" className="space-y-12 animate-fade-in">
                  <BentoGrid className="max-w-7xl mx-auto">
                    <BentoGridItem
                      className="md:col-span-3"
                      header={<ColorPaletteDisplay colors={designSystem.colors} />}
                      title="Brand Color Palette"
                      description="Primary, secondary, and accent colors with semantic variants."
                      icon={<Palette className="h-4 w-4 text-neutral-500" />}
                    />
                    <BentoGridItem
                      className="md:col-span-1"
                      header={<TypographyDisplay typography={designSystem.typography} />}
                      title="Typography System"
                      description="Heading and body scales using modern pairings."
                      icon={<Type className="h-4 w-4 text-neutral-500" />}
                    />
                    <div className="md:col-span-1 grid grid-cols-1 gap-4">
                      <BentoGridItem
                        className="h-auto min-h-[180px]"
                        header={<SpacingDisplay spacing={designSystem.spacing} />}
                        title="Spacing Scale"
                        description={`${designSystem.spacing.unit}px base unit`}
                        icon={<Ruler className="h-4 w-4 text-neutral-500" />}
                      />
                      <BentoGridItem
                        className="h-auto min-h-[180px]"
                        header={<BorderRadiusDisplay borderRadius={designSystem.borderRadius} />}
                        title="Border Radius"
                        description={`${designSystem.borderRadius.md} standard radius`}
                        icon={<Maximize className="h-4 w-4 text-neutral-500" />}
                      />
                    </div>
                    <BentoGridItem
                      className="md:col-span-1"
                      header={<ShadowDisplay shadows={designSystem.shadows} />}
                      title="Elevation & Shadows"
                      description="Light and dark mode compatible shadows"
                      icon={<Cast className="h-4 w-4 text-neutral-500" />}
                    />
                    <BentoGridItem
                      className="md:col-span-2"
                      header={<GridDisplay grid={designSystem.grid} />}
                      title="Layout Grid"
                      description="Responsive 12-column grid system"
                      icon={<Grid3X3 className="h-4 w-4 text-neutral-500" />}
                    />
                  </BentoGrid>
                </TabsContent>

                <TabsContent value="preview" className="animate-fade-in">
                  <Suspense fallback={<DesignSystemSkeleton />}>
                    <InteractiveColorsDisplay colors={designSystem.colors} />
                  </Suspense>
                </TabsContent>

                <TabsContent value="components" className="animate-fade-in space-y-8">
                  <Suspense fallback={<DesignSystemSkeleton />}>
                    <ComponentLibraryPreview designSystem={designSystem} />
                    <ComponentBlueprints designSystem={designSystem} />
                  </Suspense>
                </TabsContent>

                <TabsContent value="motion" className="space-y-8 animate-fade-in">
                  <Suspense fallback={<DesignSystemSkeleton />}>
                    <AnimationDisplay animations={designSystem.animations} />
                    <MotionGallery designSystem={designSystem} />
                    <AnimationSystemDocs />
                  </Suspense>
                </TabsContent>

                <TabsContent value="vision" className="animate-fade-in">
                  <Suspense fallback={<DesignSystemSkeleton />}>
                    <VisionGenerator onDesignGenerated={handleVisionGenerate} isGenerating={isLoading} />
                  </Suspense>
                </TabsContent>

                <TabsContent value="insights" className="animate-fade-in">
                  <Suspense fallback={<DesignSystemSkeleton />}>
                    <DesignInsights designSystem={designSystem} onUpdate={setDesignSystem} />
                  </Suspense>
                </TabsContent>

                <TabsContent value="accessibility" className="animate-fade-in space-y-8">
                  <Suspense fallback={<DesignSystemSkeleton />}>
                    <AccessibilityChecker colors={designSystem.colors} darkColors={designSystem.darkColors} />
                    <ColorBlindnessSimulator colors={designSystem.colors} />
                  </Suspense>
                </TabsContent>

                <TabsContent value="figma" className="animate-fade-in">
                  <Suspense fallback={<DesignSystemSkeleton />}>
                    <FigmaSync designSystemId={searchParams.get("id") || undefined} />
                  </Suspense>
                </TabsContent>

                <TabsContent value="saved" className="animate-fade-in">
                  <Suspense fallback={<DesignSystemSkeleton />}>
                    <SavedDesigns onLoad={handleLoadDesign} currentSystem={designSystem} />
                  </Suspense>
                </TabsContent>
              </Tabs>
            )
          )}
        </main>
        <ShortcutOverlay />
      </div>
    );
  }

  // Home / Initial View
  return (
    <div className="min-h-screen bg-background dark:bg-black/[0.96] antialiased bg-grid-black/[0.02] dark:bg-grid-white/[0.02] relative overflow-hidden transition-colors duration-300">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 hidden dark:block" fill="white" />
      <BackgroundBeams className="opacity-40 hidden dark:block" />

      <div className="relative z-10">
        <header className="py-6 animate-fade-in border-b border-border/40 bg-background/80 dark:bg-black/75 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <Wand2 className="h-8 w-8 text-primary dark:text-white transition-transform duration-300 group-hover:rotate-12" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-600 to-neutral-900 dark:from-neutral-50 dark:to-neutral-400">DesignForge</span>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              <ModeToggle />
              {user ? (
                <Button variant="ghost" size="sm" onClick={signOut} className="hover-lift text-muted-foreground hover:text-foreground">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button variant="ghost" size="sm" asChild className="hover-lift text-muted-foreground hover:text-foreground">
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
                  <Button variant="ghost" size="icon" aria-label="Open menu">
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in-up hover-scale cursor-default">
                <Brain className="h-4 w-4 animate-pulse-soft" />
                Powered by AI
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                Create Complete{" "}
                <span className="text-primary relative">
                  Design Systems
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary/30 rounded-full" />
                </span>{" "}
                in Seconds
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Our AI analyzes your project requirements and generates a comprehensive,
                context-aware design system with colors, typography, spacing, shadows, and grid.
              </p>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }} id="tour-input-section">
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

            <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '0.35s' }} id="tour-presets">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                  <Palette className="h-6 w-6 text-primary" />
                  Or Start from a Preset
                </h2>
                <p className="text-muted-foreground">Choose from popular design systems</p>
              </div>
              <DesignSystemPresets onApplyPreset={handleApplyPreset} />
            </div>

            <div className="mt-16 grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Brain,
                  title: "AI-Powered Analysis",
                  description: "Our AI understands your industry and mood to create perfect color harmonies",
                },
                {
                  icon: Sparkles,
                  title: "Smart Typography",
                  description: "Professionally paired fonts based on industry best practices",
                },
                {
                  icon: Wand2,
                  title: "Export Anywhere",
                  description: "Download as CSS variables, Tailwind config, or JSON",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm card-interactive animate-fade-in-up group"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <feature.icon className="h-8 w-8 text-primary mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                  <h3 className="font-semibold mb-2 transition-colors duration-300 group-hover:text-primary">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
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
