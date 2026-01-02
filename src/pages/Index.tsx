import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DesignSystemForm } from "@/components/DesignSystemForm";
import { ColorPaletteDisplay } from "@/components/ColorPaletteDisplay";
import { TypographyDisplay } from "@/components/TypographyDisplay";
import { SpacingDisplay } from "@/components/SpacingDisplay";
import { ShadowDisplay } from "@/components/ShadowDisplay";
import { GridDisplay } from "@/components/GridDisplay";
import { BorderRadiusDisplay } from "@/components/BorderRadiusDisplay";
import { ExportButton } from "@/components/ExportButton";
import { LivePreview } from "@/components/LivePreview";
import { ComparisonView } from "@/components/ComparisonView";
import { SavedDesigns } from "@/components/SavedDesigns";
import { AccessibilityChecker } from "@/components/AccessibilityChecker";
import { AnimationDisplay } from "@/components/AnimationDisplay";
import { InteractiveColorsDisplay } from "@/components/InteractiveColorsDisplay";
import { DesignSystemPresets } from "@/components/DesignSystemPresets";
import { ResponsivePreview } from "@/components/ResponsivePreview";
import { TokenVersioning } from "@/components/TokenVersioning";
import { BrandGuidelinesPDF } from "@/components/BrandGuidelinesPDF";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DesignSystemInput, GeneratedDesignSystem } from "@/types/designSystem";
import { generateDesignSystemWithAI, generateDesignSystemFallback } from "@/lib/generateDesignSystem";
import { Sparkles, ArrowLeft, Wand2, Brain, User, LogOut, Zap, HelpCircle, Smartphone, History, FileText, Palette } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AnimationSystemDocs } from "@/components/AnimationSystemDocs";
import { ComponentLibraryPreview } from "@/components/ComponentLibraryPreview";
import { useOnboarding } from "@/contexts/OnboardingContext";
const Index = () => {
  const [designSystem, setDesignSystem] = useState<GeneratedDesignSystem | null>(null);
  const [currentInput, setCurrentInput] = useState<DesignSystemInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, signOut } = useAuth();
  const { resetOnboarding, selectedTemplate } = useOnboarding();

  const [pendingInput, setPendingInput] = useState<DesignSystemInput | null>(null);

  const handleGenerate = async (input: DesignSystemInput) => {
    // Require authentication before generating
    if (!user) {
      setPendingInput(input);
      toast.info("Please sign in to generate your design system", {
        description: "Create a free account to save and manage your designs.",
        action: {
          label: "Sign In",
          onClick: () => window.location.href = "/auth",
        },
      });
      return;
    }

    await generateDesignSystem(input);
  };

  const generateDesignSystem = async (input: DesignSystemInput) => {
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

  // Auto-generate after authentication if there's a pending input
  useEffect(() => {
    if (user && pendingInput) {
      generateDesignSystem(pendingInput);
      setPendingInput(null);
    }
  }, [user, pendingInput]);

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
  if (designSystem && currentInput) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl animate-slide-in-down">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleReset} className="hover:rotate-[-10deg] transition-transform duration-300">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">{designSystem.name}</h1>
                <p className="text-sm text-muted-foreground">AI-Generated Design System</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={resetOnboarding} title="Restart tour" className="hover-scale">
                <HelpCircle className="h-4 w-4" />
              </Button>
              {user ? (
                <Button variant="ghost" size="sm" onClick={signOut} className="hover-lift">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button variant="ghost" size="sm" asChild className="hover-lift">
                  <Link to="/auth">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              )}
              <ExportButton designSystem={designSystem} />
            </div>
          </div>
        </header>

        {/* Design System Display */}
        <main className="container mx-auto px-4 py-8 animate-fade-in">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="flex-wrap transition-all duration-300">
              <TabsTrigger value="overview" className="transition-all duration-200 data-[state=active]:scale-105">Overview</TabsTrigger>
              <TabsTrigger value="interactive" className="transition-all duration-200 data-[state=active]:scale-105">Interactive</TabsTrigger>
              <TabsTrigger value="animations" className="transition-all duration-200 data-[state=active]:scale-105">Animations</TabsTrigger>
              <TabsTrigger value="animation-system" className="transition-all duration-200 data-[state=active]:scale-105"><Zap className="h-4 w-4 mr-1" />Animation System</TabsTrigger>
              <TabsTrigger value="components" className="transition-all duration-200 data-[state=active]:scale-105">Components</TabsTrigger>
              <TabsTrigger value="responsive" className="transition-all duration-200 data-[state=active]:scale-105"><Smartphone className="h-4 w-4 mr-1" />Responsive</TabsTrigger>
              <TabsTrigger value="accessibility" className="transition-all duration-200 data-[state=active]:scale-105">Accessibility</TabsTrigger>
              <TabsTrigger value="preview" className="transition-all duration-200 data-[state=active]:scale-105">Live Preview</TabsTrigger>
              <TabsTrigger value="versioning" className="transition-all duration-200 data-[state=active]:scale-105"><History className="h-4 w-4 mr-1" />Versions</TabsTrigger>
              <TabsTrigger value="export" className="transition-all duration-200 data-[state=active]:scale-105"><FileText className="h-4 w-4 mr-1" />Guidelines</TabsTrigger>
              <TabsTrigger value="compare" className="transition-all duration-200 data-[state=active]:scale-105">Compare</TabsTrigger>
              <TabsTrigger value="saved" className="transition-all duration-200 data-[state=active]:scale-105">Saved</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <ColorPaletteDisplay colors={designSystem.colors} />
              <div className="grid lg:grid-cols-2 gap-8">
                <TypographyDisplay typography={designSystem.typography} />
                <SpacingDisplay spacing={designSystem.spacing} />
              </div>
              <div className="grid lg:grid-cols-2 gap-8">
                <ShadowDisplay shadows={designSystem.shadows} />
                <BorderRadiusDisplay borderRadius={designSystem.borderRadius} />
              </div>
              <GridDisplay grid={designSystem.grid} />
            </TabsContent>

            <TabsContent value="interactive">
              <InteractiveColorsDisplay colors={designSystem.colors} />
            </TabsContent>

            <TabsContent value="animations">
              <AnimationDisplay animations={designSystem.animations} />
            </TabsContent>

            <TabsContent value="animation-system">
              <AnimationSystemDocs />
            </TabsContent>

            <TabsContent value="components">
              <ComponentLibraryPreview designSystem={designSystem} />
            </TabsContent>

            <TabsContent value="accessibility">
              <AccessibilityChecker colors={designSystem.colors} darkColors={designSystem.darkColors} />
            </TabsContent>

            <TabsContent value="responsive">
              <ResponsivePreview designSystem={designSystem} />
            </TabsContent>

            <TabsContent value="preview">
              <LivePreview designSystem={designSystem} />
            </TabsContent>

            <TabsContent value="versioning">
              <TokenVersioning currentSystem={designSystem} onRestore={handleRestoreVersion} />
            </TabsContent>

            <TabsContent value="export">
              <BrandGuidelinesPDF designSystem={designSystem} />
            </TabsContent>

            <TabsContent value="compare">
              <ComparisonView baseInput={currentInput} initialSystem={designSystem} />
            </TabsContent>

            <TabsContent value="saved">
              <SavedDesigns onLoad={handleLoadDesign} currentSystem={designSystem} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-primary/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-accent/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="py-6 animate-fade-in">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-2 group">
              <Wand2 className="h-8 w-8 text-primary transition-transform duration-300 group-hover:rotate-12" />
              <span className="text-2xl font-bold">DesignForge</span>
            </div>
            {user ? (
              <Button variant="ghost" size="sm" onClick={signOut} className="hover-lift">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Button variant="ghost" size="sm" asChild className="hover-lift">
                <Link to="/auth">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </header>

        {/* Hero Section */}
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

            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
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

            {/* Design System Presets */}
            <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                  <Palette className="h-6 w-6 text-primary" />
                  Or Start from a Preset
                </h2>
                <p className="text-muted-foreground">Choose from popular design systems</p>
              </div>
              <DesignSystemPresets onApplyPreset={handleApplyPreset} />
            </div>

            {/* Features */}
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
    </div>
  );
};

export default Index;
