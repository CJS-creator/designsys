import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColorPalette } from "@/types/designSystem";
import { Palette, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface ColorPaletteDisplayProps {
  colors: ColorPalette;
}

export function ColorPaletteDisplay({ colors }: ColorPaletteDisplayProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const colorEntries = Object.entries(colors).map(([name, value]) => ({
    name: name.replace(/([A-Z])/g, " $1").trim(),
    value,
    key: name,
  }));

  const copyColor = (value: string, name: string) => {
    navigator.clipboard.writeText(value);
    setCopiedColor(name);
    toast.success(`Copied ${value}`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          Color Palette
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {colorEntries.map(({ name, value, key }) => (
            <button
              key={key}
              onClick={() => copyColor(value, key)}
              className="group relative flex flex-col items-center gap-2 transition-transform hover:scale-105"
            >
              <div
                className="h-20 w-full rounded-xl shadow-md transition-shadow group-hover:shadow-lg ring-1 ring-border/30"
                style={{ backgroundColor: value }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                {copiedColor === key ? (
                  <Check className="h-6 w-6 text-card drop-shadow-lg" />
                ) : (
                  <Copy className="h-5 w-5 text-card drop-shadow-lg" />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium capitalize">{name}</p>
                <p className="text-xs text-muted-foreground font-mono">{value}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
