import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Type, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { TypographyScale } from "@/types/designSystem";

interface TypeScaleRatio {
  name: string;
  ratio: number;
  description: string;
}

const TYPE_SCALE_RATIOS: TypeScaleRatio[] = [
  { name: "Minor Second", ratio: 1.067, description: "Subtle, minimal contrast" },
  { name: "Major Second", ratio: 1.125, description: "Gentle progression" },
  { name: "Minor Third", ratio: 1.2, description: "Balanced, versatile" },
  { name: "Major Third", ratio: 1.25, description: "Classic, harmonious" },
  { name: "Perfect Fourth", ratio: 1.333, description: "Strong contrast, traditional" },
  { name: "Augmented Fourth", ratio: 1.414, description: "Musical, dynamic" },
  { name: "Perfect Fifth", ratio: 1.5, description: "Bold, dramatic" },
  { name: "Golden Ratio", ratio: 1.618, description: "Natural, organic feel" },
];

interface AdvancedTypographyScaleProps {
  typography?: TypographyScale;
  onTypographyChange?: (typography: { sizes: Record<string, string> }) => void;
}

export function AdvancedTypographyScale({
  typography,
  onTypographyChange,
}: AdvancedTypographyScaleProps) {
  const [selectedRatio, setSelectedRatio] = useState<string>("Major Third");
  const [baseSize, setBaseSize] = useState<number>(16);
  const [generatedSizes, setGeneratedSizes] = useState<Record<string, string>>({});

  const calculateScale = useCallback((ratio: number, base: number) => {
    const sizes: Record<string, string> = {
      xs: `${(base / ratio / ratio).toFixed(3)}px`,
      sm: `${(base / ratio).toFixed(3)}px`,
      base: `${base}px`,
      lg: `${(base * ratio).toFixed(3)}px`,
      xl: `${(base * ratio * ratio).toFixed(3)}px`,
      "2xl": `${(base * ratio * ratio * ratio).toFixed(3)}px`,
      "3xl": `${(base * Math.pow(ratio, 4)).toFixed(3)}px`,
      "4xl": `${(base * Math.pow(ratio, 5)).toFixed(3)}px`,
      "5xl": `${(base * Math.pow(ratio, 6)).toFixed(3)}px`,
    };
    return sizes;
  }, []);

  const handleRatioChange = useCallback((ratioName: string) => {
    setSelectedRatio(ratioName);
    const ratio = TYPE_SCALE_RATIOS.find((r) => r.name === ratioName)?.ratio || 1.25;
    const sizes = calculateScale(ratio, baseSize);
    setGeneratedSizes(sizes);
    onTypographyChange?.({ sizes });
  }, [baseSize, calculateScale, onTypographyChange]);

  const handleBaseSizeChange = useCallback((newBaseSize: number) => {
    setBaseSize(newBaseSize);
    const ratio = TYPE_SCALE_RATIOS.find((r) => r.name === selectedRatio)?.ratio || 1.25;
    const sizes = calculateScale(ratio, newBaseSize);
    setGeneratedSizes(sizes);
    onTypographyChange?.({ sizes });
  }, [selectedRatio, calculateScale, onTypographyChange]);

  const regenerate = useCallback(() => {
    const ratio = TYPE_SCALE_RATIOS.find((r) => r.name === selectedRatio)?.ratio || 1.25;
    const sizes = calculateScale(ratio, baseSize);
    setGeneratedSizes(sizes);
    onTypographyChange?.({ sizes });
    toast.success("Typography scale regenerated");
  }, [selectedRatio, baseSize, calculateScale, onTypographyChange]);

  const copyAsCSS = () => {
    const css = Object.entries(generatedSizes)
      .map(([key, value]) => `  --font-size-${key}: ${value};`)
      .join("\n");
    navigator.clipboard.writeText(`:root {\n${css}\n}`);
    toast.success("Copied typography scale as CSS");
  };

  // Initialize on mount
  useState(() => {
    const ratio = TYPE_SCALE_RATIOS.find((r) => r.name === selectedRatio)?.ratio || 1.25;
    const sizes = calculateScale(ratio, baseSize);
    setGeneratedSizes(sizes);
  });

  const currentRatio = TYPE_SCALE_RATIOS.find((r) => r.name === selectedRatio);
  const displaySizes = Object.keys(generatedSizes).length > 0 ? generatedSizes : typography?.sizes || {};

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Type className="h-5 w-5 text-primary" />
          Advanced Typography Scale
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={copyAsCSS}>
            <Copy className="h-4 w-4 mr-1" />
            Copy CSS
          </Button>
          <Button variant="outline" size="sm" onClick={regenerate}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Regenerate
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg bg-background">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Type Scale Ratio</Label>
            <Select value={selectedRatio} onValueChange={handleRatioChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a ratio" />
              </SelectTrigger>
              <SelectContent>
                {TYPE_SCALE_RATIOS.map((ratio) => (
                  <SelectItem key={ratio.name} value={ratio.name}>
                    <div className="flex items-center justify-between gap-4">
                      <span>{ratio.name}</span>
                      <span className="text-muted-foreground text-xs">
                        ({ratio.ratio})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {currentRatio && (
              <p className="text-xs text-muted-foreground">{currentRatio.description}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Base Size: {baseSize}px</Label>
            <Slider
              value={[baseSize]}
              onValueChange={(value) => handleBaseSizeChange(value[0])}
              min={12}
              max={24}
              step={1}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>12px</span>
              <span>24px</span>
            </div>
          </div>
        </div>

        {/* Scale Preview */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Generated Scale
          </h4>
          <div className="space-y-2">
            {Object.entries(displaySizes)
              .reverse()
              .map(([size, value]) => (
                <button
                  key={size}
                  onClick={() => {
                    navigator.clipboard.writeText(value);
                    toast.success(`Copied: ${value}`);
                  }}
                  className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted/50 transition-colors group bg-background"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-muted-foreground w-10">
                      {size}
                    </span>
                    <span
                      className="truncate font-medium"
                      style={{ fontSize: value }}
                    >
                      The quick brown fox jumps
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">
                      {value}
                    </span>
                    <Copy className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* Ratio Visualization */}
        <div className="p-4 rounded-lg bg-background space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Scale Ratio: {currentRatio?.ratio || 1.25}
          </h4>
          <div className="flex items-center gap-2">
            {TYPE_SCALE_RATIOS.map((ratio) => (
              <button
                key={ratio.name}
                onClick={() => handleRatioChange(ratio.name)}
                className={`h-8 flex-1 rounded transition-all ${selectedRatio === ratio.name
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                  }`}
                title={`${ratio.name} (${ratio.ratio})`}
              >
                <span className="text-xs">{ratio.ratio}</span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
