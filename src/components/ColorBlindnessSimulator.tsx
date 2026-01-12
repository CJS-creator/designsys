import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Info } from "lucide-react";
import { ColorPalette } from "@/types/designSystem";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ColorBlindnessSimulatorProps {
  colors: ColorPalette;
}

type ColorBlindnessType = "normal" | "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia";

interface ColorBlindnessInfo {
  name: string;
  description: string;
  prevalence: string;
  affects: string;
}

const colorBlindnessInfo: Record<ColorBlindnessType, ColorBlindnessInfo> = {
  normal: {
    name: "Normal Vision",
    description: "Standard color perception",
    prevalence: "~92% of population",
    affects: "Baseline comparison",
  },
  protanopia: {
    name: "Protanopia",
    description: "Red-blind (no red cones)",
    prevalence: "~1% of males",
    affects: "Red appears dark, confused with green/brown",
  },
  deuteranopia: {
    name: "Deuteranopia",
    description: "Green-blind (no green cones)",
    prevalence: "~6% of males",
    affects: "Green and red appear similar (yellow/brown)",
  },
  tritanopia: {
    name: "Tritanopia",
    description: "Blue-blind (no blue cones)",
    prevalence: "~0.01% of population",
    affects: "Blue appears green, yellow appears pink",
  },
  achromatopsia: {
    name: "Achromatopsia",
    description: "Complete color blindness",
    prevalence: "~0.003% of population",
    affects: "Sees only shades of gray",
  },
};

// Color blindness simulation matrices
// Based on scientific research for color vision deficiency simulation
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  return `#${[r, g, b].map((x) => clamp(x).toString(16).padStart(2, "0")).join("")}`;
}

function applyColorBlindnessMatrix(
  r: number,
  g: number,
  b: number,
  type: ColorBlindnessType
): { r: number; g: number; b: number } {
  // Normalize to 0-1
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  // Transformation matrices for different types of color blindness
  const matrices: Record<ColorBlindnessType, number[][]> = {
    normal: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
    protanopia: [
      [0.567, 0.433, 0],
      [0.558, 0.442, 0],
      [0, 0.242, 0.758],
    ],
    deuteranopia: [
      [0.625, 0.375, 0],
      [0.7, 0.3, 0],
      [0, 0.3, 0.7],
    ],
    tritanopia: [
      [0.95, 0.05, 0],
      [0, 0.433, 0.567],
      [0, 0.475, 0.525],
    ],
    achromatopsia: [
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114],
    ],
  };

  const matrix = matrices[type];
  
  return {
    r: (matrix[0][0] * rn + matrix[0][1] * gn + matrix[0][2] * bn) * 255,
    g: (matrix[1][0] * rn + matrix[1][1] * gn + matrix[1][2] * bn) * 255,
    b: (matrix[2][0] * rn + matrix[2][1] * gn + matrix[2][2] * bn) * 255,
  };
}

function simulateColorBlindness(hexColor: string, type: ColorBlindnessType): string {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return hexColor;

  const simulated = applyColorBlindnessMatrix(rgb.r, rgb.g, rgb.b, type);
  return rgbToHex(simulated.r, simulated.g, simulated.b);
}

export function ColorBlindnessSimulator({ colors }: ColorBlindnessSimulatorProps) {
  const [selectedType, setSelectedType] = useState<ColorBlindnessType>("normal");
  const [showComparison, setShowComparison] = useState(true);

  const colorTypes: ColorBlindnessType[] = ["normal", "protanopia", "deuteranopia", "tritanopia", "achromatopsia"];

  // Get main colors to display
  const mainColors = [
    { name: "Primary", value: colors.primary },
    { name: "Secondary", value: colors.secondary },
    { name: "Accent", value: colors.accent },
    { name: "Success", value: colors.success },
    { name: "Warning", value: colors.warning },
    { name: "Error", value: colors.error },
    { name: "Background", value: colors.background },
    { name: "Text", value: colors.text },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Color Blindness Simulator
            </CardTitle>
            <CardDescription>
              Preview how your colors appear to people with color vision deficiencies
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComparison(!showComparison)}
          >
            {showComparison ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Comparison
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Show Comparison
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Type Selector */}
        <div className="flex flex-wrap gap-2">
          {colorTypes.map((type) => (
            <TooltipProvider key={type}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={selectedType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                    className="capitalize"
                  >
                    {colorBlindnessInfo[type].name}
                    {type !== "normal" && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {colorBlindnessInfo[type].prevalence}
                      </Badge>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{colorBlindnessInfo[type].description}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {colorBlindnessInfo[type].affects}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        {/* Info Box */}
        <div className="p-4 rounded-lg bg-muted/50 flex items-start gap-3">
          <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">{colorBlindnessInfo[selectedType].name}</p>
            <p className="text-sm text-muted-foreground">
              {colorBlindnessInfo[selectedType].description} — {colorBlindnessInfo[selectedType].affects}
            </p>
          </div>
        </div>

        {/* Color Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {mainColors.map(({ name, value }) => {
            const simulatedColor = simulateColorBlindness(value, selectedType);
            const hasChanged = selectedType !== "normal" && value !== simulatedColor;

            return (
              <div key={name} className="space-y-2">
                <p className="text-sm font-medium text-center">{name}</p>
                
                {showComparison ? (
                  <div className="flex gap-1 h-20">
                    <div className="flex-1 flex flex-col">
                      <div
                        className="flex-1 rounded-l-lg border border-r-0"
                        style={{ backgroundColor: value }}
                      />
                      <p className="text-xs text-center text-muted-foreground mt-1">Original</p>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div
                        className="flex-1 rounded-r-lg border border-l-0 relative"
                        style={{ backgroundColor: simulatedColor }}
                      >
                        {hasChanged && (
                          <Badge
                            variant="secondary"
                            className="absolute -top-2 -right-2 text-xs px-1"
                          >
                            !
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-center text-muted-foreground mt-1">Simulated</p>
                    </div>
                  </div>
                ) : (
                  <div
                    className="h-20 rounded-lg border relative"
                    style={{ backgroundColor: simulatedColor }}
                  >
                    {hasChanged && (
                      <Badge
                        variant="secondary"
                        className="absolute -top-2 -right-2 text-xs px-1"
                      >
                        Changed
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="text-center">
                  <p className="text-xs font-mono text-muted-foreground">
                    {showComparison ? `${value} → ${simulatedColor}` : simulatedColor}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* All Types Preview */}
        <div className="space-y-4">
          <h3 className="font-semibold">Quick Comparison (All Types)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">Color</th>
                  {colorTypes.map((type) => (
                    <th key={type} className="text-center py-2 px-2 capitalize">
                      {type === "normal" ? "Original" : type.slice(0, 4) + "."}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mainColors.slice(0, 6).map(({ name, value }) => (
                  <tr key={name} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-medium">{name}</td>
                    {colorTypes.map((type) => {
                      const simulated = simulateColorBlindness(value, type);
                      return (
                        <td key={type} className="py-3 px-2">
                          <div
                            className="w-10 h-10 rounded-md mx-auto border"
                            style={{ backgroundColor: simulated }}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <h4 className="font-medium flex items-center gap-2 mb-2">
            <Info className="h-4 w-4" />
            Accessibility Tips
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Avoid relying solely on red/green to convey meaning</li>
            <li>Use patterns, icons, or labels in addition to color</li>
            <li>Ensure sufficient contrast between adjacent colors</li>
            <li>Test with real users who have color vision deficiencies</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
