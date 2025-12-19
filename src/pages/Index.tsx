import { useState } from "react";
import { DesignSystemForm } from "@/components/DesignSystemForm";
import { ColorPaletteDisplay } from "@/components/ColorPaletteDisplay";
import { TypographyDisplay } from "@/components/TypographyDisplay";
import { SpacingDisplay } from "@/components/SpacingDisplay";
import { ShadowDisplay } from "@/components/ShadowDisplay";
import { GridDisplay } from "@/components/GridDisplay";
import { BorderRadiusDisplay } from "@/components/BorderRadiusDisplay";
import { ExportButton } from "@/components/ExportButton";
import { Button } from "@/components/ui/button";
import { DesignSystemInput, GeneratedDesignSystem } from "@/types/designSystem";
import { generateDesignSystem } from "@/lib/generateDesignSystem";
import { Sparkles, ArrowLeft, Wand2 } from "lucide-react";

const Index = () => {
  const [designSystem, setDesignSystem] = useState<GeneratedDesignSystem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (input: DesignSystemInput) => {
    setIsLoading(true);
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const generated = generateDesignSystem(input);
    setDesignSystem(generated);
    setIsLoading(false);
  };

  const handleReset = () => {
    setDesignSystem(null);
  };

  if (designSystem) {
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
                <p className="text-sm text-muted-foreground">Generated Design System</p>
              </div>
            </div>
            <ExportButton designSystem={designSystem} />
          </div>
        </header>

        {/* Design System Display */}
        <main className="container mx-auto px-4 py-8 space-y-8">
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
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2">
              <Wand2 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">DesignForge</span>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                AI-Powered Design System Generator
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Create Complete{" "}
                <span className="text-primary">Design Systems</span>{" "}
                in Seconds
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Tell us about your project and we'll generate a comprehensive design system 
                with colors, typography, spacing, shadows, and grid—all tailored to your needs.
              </p>
            </div>

            <DesignSystemForm onGenerate={handleGenerate} isLoading={isLoading} />

            {/* Features */}
            <div className="mt-16 grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Smart Color Generation",
                  description: "Harmonious palettes based on your brand mood and industry",
                },
                {
                  title: "Typography Pairing",
                  description: "Professionally paired fonts with complete type scales",
                },
                {
                  title: "Export Anywhere",
                  description: "Download as CSS variables, Tailwind config, or JSON",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm"
                >
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
