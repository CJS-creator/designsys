import { useState } from "react";
import { GeneratedDesignSystem, DesignSystemInput } from "@/types/designSystem";
import { hybridAdapter } from "@/lib/hybridAdapter";
import { generateDesignSystemFallback } from "@/lib/generateDesignSystem";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, X, Loader2, GitCompare } from "lucide-react";


interface ComparisonViewProps {
  baseInput: DesignSystemInput;
  initialSystem?: GeneratedDesignSystem;
}

export const ComparisonView = ({ baseInput, initialSystem }: ComparisonViewProps) => {
  const [variations, setVariations] = useState<GeneratedDesignSystem[]>(
    initialSystem ? [initialSystem] : []
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const generateVariation = async () => {
    if (variations.length >= 3) {
      toast.error("Maximum 3 variations allowed");
      return;
    }

    setIsGenerating(true);
    try {
      const variation = await hybridAdapter.generate({
        ...baseInput,
        description: `${baseInput.description} - Variation ${variations.length + 1}`,
      });
      setVariations((prev) => [...prev, variation]);
      toast.success(`Variation ${variations.length + 1} generated!`);
    } catch (error) {
      const fallback = await generateDesignSystemFallback({
        ...baseInput,
        primaryColor: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`,
      });
      setVariations((prev) => [...prev, fallback]);
      toast.warning("Generated variation with fallback algorithm");
    } finally {
      setIsGenerating(false);
    }
  };

  const removeVariation = (index: number) => {
    setVariations((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare className="h-5 w-5" />
          Compare Variations
        </CardTitle>
        <CardDescription>
          Generate and compare multiple design system variations side by side
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={generateVariation}
            disabled={isGenerating || variations.length >= 3}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Variation ({variations.length}/3)
              </>
            )}
          </Button>
        </div>

        {variations.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <GitCompare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No variations yet. Click "Add Variation" to generate design system alternatives.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {variations.map((system, index) => (
              <div key={index} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 z-10 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => removeVariation(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
                <div className="border border-border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{system.name}</h3>
                    <span className="text-xs text-muted-foreground">Variation {index + 1}</span>
                  </div>

                  {/* Color Swatches */}
                  <div className="flex gap-1">
                    {Object.entries(system.colors).slice(0, 5).map(([name, color]) => (
                      <div
                        key={name}
                        className="w-8 h-8 rounded-md border border-border"
                        style={{ background: color }}
                        title={name}
                      />
                    ))}
                  </div>

                  {/* Quick Preview */}
                  <div
                    className="p-4 rounded-lg space-y-2"
                    style={{ background: system.colors.background, color: system.colors.text }}
                  >
                    <h4
                      style={{ fontFamily: system.typography.fontFamily.heading }}
                      className="font-bold"
                    >
                      Sample Heading
                    </h4>
                    <p
                      style={{
                        fontFamily: system.typography.fontFamily.body,
                        fontSize: system.typography.sizes.sm,
                        color: system.colors.textSecondary,
                      }}
                    >
                      This is sample body text in the design system.
                    </p>
                    <button
                      style={{
                        background: system.colors.primary,
                        color: "#fff",
                        borderRadius: system.borderRadius.md,
                        padding: "6px 12px",
                        fontSize: system.typography.sizes.sm,
                      }}
                    >
                      Sample Button
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
