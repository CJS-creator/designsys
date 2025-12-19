import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DesignSystemInput, GeneratedDesignSystem } from "@/types/designSystem";
import { generateDesignSystemWithAI, generateDesignSystemFallback } from "@/lib/generateDesignSystem";
import { Sparkles, ArrowLeft, Wand2, Brain, User, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [designSystem, setDesignSystem] = useState<GeneratedDesignSystem | null>(null);
  const [currentInput, setCurrentInput] = useState<DesignSystemInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, signOut } = useAuth();

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

  if (designSystem && currentInput) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleReset}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">{designSystem.name}</h1>
                <p className="text-sm text-muted-foreground">AI-Generated Design System</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user ? (
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button variant="ghost" size="sm" asChild>
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
        <main className="container mx-auto px-4 py-8">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="flex-wrap">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="interactive">Interactive</TabsTrigger>
              <TabsTrigger value="animations">Animations</TabsTrigger>
              <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
              <TabsTrigger value="preview">Live Preview</TabsTrigger>
              <TabsTrigger value="compare">Compare</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
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

            <TabsContent value="accessibility">
              <AccessibilityChecker colors={designSystem.colors} darkColors={designSystem.darkColors} />
            </TabsContent>

            <TabsContent value="preview">
              <LivePreview designSystem={designSystem} />
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
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-primary/10 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-accent/20 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="py-6">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wand2 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">DesignForge</span>
            </div>
            {user ? (
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Button variant="ghost" size="sm" asChild>
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Brain className="h-4 w-4" />
                Powered by AI
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Create Complete{" "}
                <span className="text-primary">Design Systems</span>{" "}
                in Seconds
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our AI analyzes your project requirements and generates a comprehensive, 
                context-aware design system with colors, typography, spacing, shadows, and grid.
              </p>
            </div>

            <DesignSystemForm onGenerate={handleGenerate} isLoading={isLoading} />

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
                  className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm"
                >
                  <feature.icon className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
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
