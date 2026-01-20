import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Info, Check, AlertTriangle } from "lucide-react";
import { ColorPalette } from "@/types/designSystem";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ColorBlindnessSimulatorProps {
  colors: ColorPalette;
}

type ColorBlindnessType = "normal" | "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia";

interface ColorBlindnessInfo {
  name: string;
  description: string;
  prevalence: string;
  affects: string;
  matrix: string; // SVG feColorMatrix values
}

const colorBlindnessInfo: Record<ColorBlindnessType, ColorBlindnessInfo> = {
  normal: {
    name: "Normal Vision",
    description: "Standard color perception",
    prevalence: "~92% of population",
    affects: "Baseline comparison",
    matrix: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0",
  },
  protanopia: {
    name: "Protanopia",
    description: "Red-blind (no red cones)",
    prevalence: "~1% of males",
    affects: "Red appears dark, confused with green/brown",
    matrix: "0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0",
  },
  deuteranopia: {
    name: "Deuteranopia",
    description: "Green-blind (no green cones)",
    prevalence: "~6% of males",
    affects: "Green and red appear similar (yellow/brown)",
    matrix: "0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0",
  },
  tritanopia: {
    name: "Tritanopia",
    description: "Blue-blind (no blue cones)",
    prevalence: "~0.01% of population",
    affects: "Blue appears green, yellow appears pink",
    matrix: "0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0",
  },
  achromatopsia: {
    name: "Achromatopsia",
    description: "Complete color blindness",
    prevalence: "~0.003% of population",
    affects: "Sees only shades of gray",
    matrix: "0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0",
  },
};

export function ColorBlindnessSimulator({ colors }: ColorBlindnessSimulatorProps) {
  const [selectedType, setSelectedType] = useState<ColorBlindnessType>("normal");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          Color Blindness Simulator
        </CardTitle>
        <CardDescription>
          Visualize your design system through different color vision deficiencies using SVG filters.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* SVG Filter Definitions */}
        <svg className="hidden">
          <defs>
            {Object.entries(colorBlindnessInfo).map(([type, info]) => (
              <filter key={type} id={`filter-${type}`}>
                <feColorMatrix type="matrix" values={info.matrix} />
              </filter>
            ))}
          </defs>
        </svg>

        {/* Type Selector */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(colorBlindnessInfo) as ColorBlindnessType[]).map((type) => (
            <TooltipProvider key={type}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={selectedType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                    className="capitalize relative"
                  >
                    {colorBlindnessInfo[type].name}
                    {type !== "normal" && (
                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{colorBlindnessInfo[type].description}</p>
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

        <Tabs defaultValue="preview">
          <TabsList>
            <TabsTrigger value="preview">Live UI Preview</TabsTrigger>
            <TabsTrigger value="swatches">Color Swatches</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <div
              className="border rounded-lg p-8 space-y-6 transition-all duration-500 bg-background"
              style={{ filter: `url(#filter-${selectedType})` }}
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-bold" style={{ color: colors.text }}>Accessible Design</h3>
                <p style={{ color: colors.textSecondary }}>
                  Ensuring your interface is usable by everyone is a key part of modern design systems.
                </p>
              </div>

              <div className="flex gap-4">
                <Button style={{ backgroundColor: colors.primary, color: '#fff' }}>Primary Action</Button>
                <Button variant="outline" style={{ borderColor: colors.secondary, color: colors.secondary }}>Secondary</Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border" style={{ borderColor: colors.success, backgroundColor: colors.success + '20' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="h-4 w-4" style={{ color: colors.success }} />
                    <span className="font-medium" style={{ color: colors.success }}>Success Message</span>
                  </div>
                  <p className="text-sm" style={{ color: colors.text }}>Operation completed successfully.</p>
                </div>
                <div className="p-4 rounded-lg border" style={{ borderColor: colors.error, backgroundColor: colors.error + '20' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4" style={{ color: colors.error }} />
                    <span className="font-medium" style={{ color: colors.error }}>Error Alert</span>
                  </div>
                  <p className="text-sm" style={{ color: colors.text }}>Something went wrong.</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>* This preview uses SVG filters to simulate vision deficiencies.</span>
              {selectedType !== 'normal' && <Badge variant="destructive">Simulation Active</Badge>}
            </div>
          </TabsContent>

          <TabsContent value="swatches">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" style={{ filter: `url(#filter-${selectedType})` }}>
              {[
                { name: "Primary", value: colors.primary },
                { name: "Secondary", value: colors.secondary },
                { name: "Accent", value: colors.accent },
                { name: "Success", value: colors.success },
                { name: "Warning", value: colors.warning },
                { name: "Error", value: colors.error },
              ].map((color) => (
                <div key={color.name} className="space-y-2">
                  <div
                    className="h-20 rounded-lg shadow-sm border"
                    style={{ backgroundColor: color.value }}
                  />
                  <p className="text-sm font-medium text-center">{color.name}</p>
                  <p className="text-xs text-center text-muted-foreground">{color.value}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

      </CardContent>
    </Card>
  );
}
