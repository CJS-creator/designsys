import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Slider available for future use: import { Slider } from "@/components/ui/slider";
import { Palette, Copy, Check, RefreshCw, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ColorShade {
  shade: number;
  color: string;
}

interface ColorPaletteSet {
  name: string;
  baseColor: string;
  shades: ColorShade[];
}

interface MultiPaletteGeneratorProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  onPaletteChange?: (palettes: ColorPaletteSet[]) => void;
}

// Convert hex to HSL
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// Convert HSL to hex
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Generate shades from a base color
function generateShades(baseColor: string): ColorShade[] {
  const hsl = hexToHsl(baseColor);
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  return shades.map((shade) => {
    // Map shade to lightness (50 = lightest, 950 = darkest)
    const lightness = shade === 50 ? 97 :
      shade === 100 ? 94 :
        shade === 200 ? 86 :
          shade === 300 ? 76 :
            shade === 400 ? 64 :
              shade === 500 ? 50 :
                shade === 600 ? 40 :
                  shade === 700 ? 32 :
                    shade === 800 ? 24 :
                      shade === 900 ? 18 : 10;

    // Adjust saturation slightly for lighter/darker shades
    const saturation = shade <= 100 ? Math.max(0, hsl.s - 20) :
      shade >= 800 ? Math.max(0, hsl.s - 10) :
        hsl.s;

    return {
      shade,
      color: hslToHex(hsl.h, saturation, lightness),
    };
  });
}

export function MultiPaletteGenerator({
  primaryColor = "#6366f1",
  secondaryColor = "#8b5cf6",
  accentColor = "#ec4899",
  onPaletteChange,
}: MultiPaletteGeneratorProps) {
  const [palettes, setPalettes] = useState<ColorPaletteSet[]>([
    { name: "Primary", baseColor: primaryColor, shades: generateShades(primaryColor) },
    { name: "Secondary", baseColor: secondaryColor, shades: generateShades(secondaryColor) },
    { name: "Accent", baseColor: accentColor, shades: generateShades(accentColor) },
  ]);

  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const updatePalette = useCallback((index: number, newBaseColor: string) => {
    setPalettes((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        baseColor: newBaseColor,
        shades: generateShades(newBaseColor),
      };
      onPaletteChange?.(updated);
      return updated;
    });
  }, [onPaletteChange]);

  const addPalette = useCallback(() => {
    const randomHue = Math.floor(Math.random() * 360);
    const newColor = hslToHex(randomHue, 70, 50);
    const newPalette: ColorPaletteSet = {
      name: `Custom ${palettes.length + 1}`,
      baseColor: newColor,
      shades: generateShades(newColor),
    };
    setPalettes((prev) => {
      const updated = [...prev, newPalette];
      onPaletteChange?.(updated);
      return updated;
    });
  }, [palettes.length, onPaletteChange]);

  const removePalette = useCallback((index: number) => {
    if (palettes.length <= 1) {
      toast.error("You need at least one palette");
      return;
    }
    setPalettes((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      onPaletteChange?.(updated);
      return updated;
    });
  }, [palettes.length, onPaletteChange]);

  const renamePalette = useCallback((index: number, newName: string) => {
    setPalettes((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name: newName };
      return updated;
    });
  }, []);

  const regenerateShades = useCallback((index: number) => {
    setPalettes((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        shades: generateShades(updated[index].baseColor),
      };
      onPaletteChange?.(updated);
      return updated;
    });
    toast.success("Shades regenerated");
  }, [onPaletteChange]);

  const copyColor = (color: string, label: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(label);
    toast.success(`Copied ${color}`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const copyAllAsCSS = () => {
    const css = palettes
      .map((palette) => {
        const prefix = palette.name.toLowerCase().replace(/\s+/g, "-");
        return palette.shades
          .map((shade) => `  --${prefix}-${shade.shade}: ${shade.color};`)
          .join("\n");
      })
      .join("\n\n");

    navigator.clipboard.writeText(`:root {\n${css}\n}`);
    toast.success("Copied all palettes as CSS variables");
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          Multi-Palette Generator
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={copyAllAsCSS}>
            <Copy className="h-4 w-4 mr-1" />
            Copy CSS
          </Button>
          <Button variant="outline" size="sm" onClick={addPalette}>
            <Plus className="h-4 w-4 mr-1" />
            Add Palette
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {palettes.map((palette, paletteIndex) => (
          <div key={paletteIndex} className="space-y-4 p-4 rounded-lg bg-background">
            <div className="flex items-center gap-4">
              <Input
                value={palette.name}
                onChange={(e) => renamePalette(paletteIndex, e.target.value)}
                className="w-32 font-medium"
              />
              <div className="flex items-center gap-2 flex-1">
                <Label className="text-sm text-muted-foreground">Base:</Label>
                <Input
                  type="color"
                  value={palette.baseColor}
                  onChange={(e) => updatePalette(paletteIndex, e.target.value)}
                  className="w-12 h-8 p-0 border-none cursor-pointer"
                />
                <Input
                  value={palette.baseColor}
                  onChange={(e) => updatePalette(paletteIndex, e.target.value)}
                  className="w-24 font-mono text-sm"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => regenerateShades(paletteIndex)}
                title="Regenerate shades"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removePalette(paletteIndex)}
                className="text-destructive hover:text-destructive"
                title="Remove palette"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-1 overflow-x-auto pb-2">
              {palette.shades.map((shade) => {
                const colorKey = `${palette.name}-${shade.shade}`;
                return (
                  <button
                    key={shade.shade}
                    onClick={() => copyColor(shade.color, colorKey)}
                    className="group flex flex-col items-center gap-1 min-w-[60px] transition-transform hover:scale-105"
                  >
                    <div
                      className="w-14 h-14 rounded-lg shadow-sm ring-1 ring-border/30 relative"
                      style={{ backgroundColor: shade.color }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {copiedColor === colorKey ? (
                          <Check className="h-4 w-4 text-card drop-shadow-lg" />
                        ) : (
                          <Copy className="h-4 w-4 text-card drop-shadow-lg" />
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-medium">{shade.shade}</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {shade.color}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
