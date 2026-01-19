import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Maximize2, Grid3X3, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { SpacingScale, GridSystem } from "@/types/designSystem";

interface SpacingGridEditorProps {
  spacing?: SpacingScale;
  grid?: GridSystem;
  onSpacingChange?: (spacing: { unit: number; scale: Record<string, string> }) => void;
  onGridChange?: (grid: { columns?: number; gutter?: string; margin?: string; maxWidth?: string }) => void;
}

const SPACING_PRESETS = {
  compact: { unit: 4, multiplier: 1 },
  comfortable: { unit: 4, multiplier: 1.5 },
  spacious: { unit: 8, multiplier: 1 },
  relaxed: { unit: 8, multiplier: 1.25 },
};

const GRID_PRESETS = {
  "12-column": { columns: 12, gutter: "24px", margin: "24px", maxWidth: "1280px" },
  "16-column": { columns: 16, gutter: "16px", margin: "32px", maxWidth: "1440px" },
  "8-column": { columns: 8, gutter: "32px", margin: "48px", maxWidth: "1024px" },
  "6-column": { columns: 6, gutter: "24px", margin: "24px", maxWidth: "960px" },
};

export function SpacingGridEditor({
  spacing,
  grid,
  onSpacingChange,
  onGridChange,
}: SpacingGridEditorProps) {
  // Spacing state
  const [baseUnit, setBaseUnit] = useState(spacing?.unit || 4);
  const [spacingPreset, setSpacingPreset] = useState<string>("comfortable");
  const [customScale, setCustomScale] = useState<Record<string, string>>(
    spacing?.scale || {}
  );

  // Grid state
  const [columns, setColumns] = useState(grid?.columns || 12);
  const [gutter, setGutter] = useState(grid?.gutter || "24px");
  const [margin, setMargin] = useState(grid?.margin || "24px");
  const [maxWidth, setMaxWidth] = useState(grid?.maxWidth || "1280px");
  const [gridPreset, setGridPreset] = useState<string>("12-column");

  const generateSpacingScale = useCallback((unit: number) => {
    const scale: Record<string, string> = {
      "0": "0px",
      "1": `${unit * 1}px`,
      "2": `${unit * 2}px`,
      "3": `${unit * 3}px`,
      "4": `${unit * 4}px`,
      "5": `${unit * 5}px`,
      "6": `${unit * 6}px`,
      "8": `${unit * 8}px`,
      "10": `${unit * 10}px`,
      "12": `${unit * 12}px`,
      "16": `${unit * 16}px`,
      "20": `${unit * 20}px`,
      "24": `${unit * 24}px`,
    };
    return scale;
  }, []);

  const handleSpacingPresetChange = useCallback((preset: string) => {
    setSpacingPreset(preset);
    const presetConfig = SPACING_PRESETS[preset as keyof typeof SPACING_PRESETS];
    if (presetConfig) {
      const newUnit = presetConfig.unit * presetConfig.multiplier;
      setBaseUnit(newUnit);
      const newScale = generateSpacingScale(newUnit);
      setCustomScale(newScale);
      onSpacingChange?.({ unit: newUnit, scale: newScale });
    }
  }, [generateSpacingScale, onSpacingChange]);

  const handleBaseUnitChange = useCallback((value: number) => {
    setBaseUnit(value);
    const newScale = generateSpacingScale(value);
    setCustomScale(newScale);
    onSpacingChange?.({ unit: value, scale: newScale });
  }, [generateSpacingScale, onSpacingChange]);

  const handleGridPresetChange = useCallback((preset: string) => {
    setGridPreset(preset);
    const presetConfig = GRID_PRESETS[preset as keyof typeof GRID_PRESETS];
    if (presetConfig) {
      setColumns(presetConfig.columns);
      setGutter(presetConfig.gutter);
      setMargin(presetConfig.margin);
      setMaxWidth(presetConfig.maxWidth);
      onGridChange?.(presetConfig);
    }
  }, [onGridChange]);

  const handleGridChange = useCallback(() => {
    onGridChange?.({
      columns,
      gutter,
      margin,
      maxWidth,
    });
  }, [columns, gutter, margin, maxWidth, onGridChange]);

  const copySpacingCSS = () => {
    const css = Object.entries(customScale)
      .map(([key, value]) => `  --spacing-${key}: ${value};`)
      .join("\n");
    navigator.clipboard.writeText(`:root {\n${css}\n}`);
    toast.success("Copied spacing scale as CSS");
  };

  const copyGridCSS = () => {
    const css = `  --grid-columns: ${columns};
  --grid-gutter: ${gutter};
  --grid-margin: ${margin};
  --grid-max-width: ${maxWidth};`;
    navigator.clipboard.writeText(`:root {\n${css}\n}`);
    toast.success("Copied grid system as CSS");
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Maximize2 className="h-5 w-5 text-primary" />
          Spacing & Grid Editor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="spacing" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="spacing">
              <Maximize2 className="h-4 w-4 mr-2" />
              Spacing
            </TabsTrigger>
            <TabsTrigger value="grid">
              <Grid3X3 className="h-4 w-4 mr-2" />
              Grid System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="spacing" className="space-y-6">
            {/* Spacing Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg bg-background">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Preset</Label>
                <Select value={spacingPreset} onValueChange={handleSpacingPresetChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select preset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact (4px base)</SelectItem>
                    <SelectItem value="comfortable">Comfortable (6px base)</SelectItem>
                    <SelectItem value="spacious">Spacious (8px base)</SelectItem>
                    <SelectItem value="relaxed">Relaxed (10px base)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Base Unit: {baseUnit}px</Label>
                <Slider
                  value={[baseUnit]}
                  onValueChange={(v) => handleBaseUnitChange(v[0])}
                  min={2}
                  max={16}
                  step={1}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>2px</span>
                  <span>16px</span>
                </div>
              </div>
            </div>

            {/* Spacing Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Spacing Scale
                </h4>
                <Button variant="outline" size="sm" onClick={copySpacingCSS}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy CSS
                </Button>
              </div>
              <div className="space-y-2">
                {Object.entries(customScale).length > 0 ? (
                  Object.entries(customScale).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => {
                        navigator.clipboard.writeText(value);
                        toast.success(`Copied: ${value}`);
                      }}
                      className="flex items-center gap-4 w-full p-2 rounded-lg hover:bg-muted/50 transition-colors group bg-background"
                    >
                      <span className="text-xs font-mono text-muted-foreground w-6">{key}</span>
                      <div className="flex-1 flex items-center gap-3">
                        <div
                          className="bg-primary rounded-sm h-6 transition-all"
                          style={{ width: value }}
                        />
                        <span className="text-xs font-mono text-muted-foreground">{value}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  spacing?.scale && Object.entries(spacing.scale).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => {
                        navigator.clipboard.writeText(value);
                        toast.success(`Copied: ${value}`);
                      }}
                      className="flex items-center gap-4 w-full p-2 rounded-lg hover:bg-muted/50 transition-colors group bg-background"
                    >
                      <span className="text-xs font-mono text-muted-foreground w-6">{key}</span>
                      <div className="flex-1 flex items-center gap-3">
                        <div
                          className="bg-primary rounded-sm h-6 transition-all"
                          style={{ width: value }}
                        />
                        <span className="text-xs font-mono text-muted-foreground">{value}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="grid" className="space-y-6">
            {/* Grid Controls */}
            <div className="p-4 rounded-lg bg-background space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Preset</Label>
                  <Select value={gridPreset} onValueChange={handleGridPresetChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12-column">12 Column</SelectItem>
                      <SelectItem value="16-column">16 Column</SelectItem>
                      <SelectItem value="8-column">8 Column</SelectItem>
                      <SelectItem value="6-column">6 Column</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Columns: {columns}</Label>
                  <Slider
                    value={[columns]}
                    onValueChange={(v) => {
                      setColumns(v[0]);
                      handleGridChange();
                    }}
                    min={4}
                    max={24}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Gutter</Label>
                  <Input
                    value={gutter}
                    onChange={(e) => {
                      setGutter(e.target.value);
                      handleGridChange();
                    }}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Margin</Label>
                  <Input
                    value={margin}
                    onChange={(e) => {
                      setMargin(e.target.value);
                      handleGridChange();
                    }}
                    className="font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Max Width</Label>
                  <Input
                    value={maxWidth}
                    onChange={(e) => {
                      setMaxWidth(e.target.value);
                      handleGridChange();
                    }}
                    className="font-mono"
                  />
                </div>
                <div className="flex items-end">
                  <Button variant="outline" onClick={copyGridCSS} className="w-full">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Grid CSS
                  </Button>
                </div>
              </div>
            </div>

            {/* Grid Preview */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Grid Preview
              </h4>
              <div className="p-4 bg-background rounded-xl overflow-hidden">
                <div
                  className="mx-auto"
                  style={{ maxWidth: maxWidth, padding: `0 ${margin}` }}
                >
                  <div
                    className="grid"
                    style={{
                      gridTemplateColumns: `repeat(${columns}, 1fr)`,
                      gap: gutter,
                    }}
                  >
                    {Array.from({ length: columns }).map((_, i) => (
                      <div
                        key={i}
                        className="h-16 bg-primary/20 rounded-md flex items-center justify-center text-xs font-mono text-primary"
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Grid Properties */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-background rounded-lg">
                <p className="text-xs text-muted-foreground">Columns</p>
                <p className="text-lg font-semibold">{columns}</p>
              </div>
              <div className="p-3 bg-background rounded-lg">
                <p className="text-xs text-muted-foreground">Gutter</p>
                <p className="text-lg font-semibold font-mono">{gutter}</p>
              </div>
              <div className="p-3 bg-background rounded-lg">
                <p className="text-xs text-muted-foreground">Margin</p>
                <p className="text-lg font-semibold font-mono">{margin}</p>
              </div>
              <div className="p-3 bg-background rounded-lg">
                <p className="text-xs text-muted-foreground">Max Width</p>
                <p className="text-lg font-semibold font-mono">{maxWidth}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
