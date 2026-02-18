import { useState } from "react";

import { ColorPalette } from "@/types/designSystem";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface ColorPaletteDisplayProps {
  colors: ColorPalette;
  renderItem?: (color: { name: string; value: string; key: string }, index: number) => React.ReactNode;
}

export function ColorPaletteDisplay({ colors, renderItem }: ColorPaletteDisplayProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const colorEntries = Object.entries(colors)
    .filter(([_, value]) => typeof value === "string")
    .map(([name, value]) => ({
      name: name.replace(/([A-Z])/g, " $1").trim(),
      value: value as string,
      key: name,
    }));

  const copyColor = (value: string, name: string) => {
    navigator.clipboard.writeText(value);
    setCopiedColor(name);
    toast.success(`Copied ${value}`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {colorEntries.map(({ name, value, key }, index) => (
        renderItem ? renderItem({ name, value, key }, index) : (
          <button
            key={key}
            onClick={() => copyColor(value, key)}
            className="group relative flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className="h-20 w-full rounded-xl shadow-sm transition-all duration-300 group-hover:shadow-xl ring-1 ring-border/10 group-hover:ring-border/30 relative overflow-hidden"
              style={{ backgroundColor: value }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100 pointer-events-none">
              {copiedColor === key ? (
                <div className="bg-black/50 backdrop-blur-md text-white p-2 rounded-full">
                  <Check className="h-5 w-5" />
                </div>
              ) : (
                <div className="bg-black/20 backdrop-blur-sm text-white/90 p-2 rounded-full">
                  <Copy className="h-5 w-5" />
                </div>
              )}
            </div>

            <div className="text-center w-full">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">{name}</p>
              <p className="text-xs font-mono text-muted-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity leading-normal">{value}</p>
            </div>
          </button>
        )
      ))}
    </div>
  );
}
