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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {colorEntries.map(({ name, value, key }, index) => (
        renderItem ? renderItem({ name, value, key }, index) : (
          <button
            key={key}
            onClick={() => copyColor(value, key)}
            className="group relative flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className="h-32 w-full rounded-2xl shadow-md transition-all duration-500 group-hover:shadow-2xl ring-2 ring-border/5 group-hover:ring-primary/20 relative overflow-hidden"
              style={{ backgroundColor: value }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100 pointer-events-none">
              {copiedColor === key ? (
                <div className="bg-black/40 backdrop-blur-xl text-white p-3 rounded-full shadow-2xl">
                  <Check className="h-6 w-6" />
                </div>
              ) : (
                <div className="bg-black/20 backdrop-blur-md text-white/90 p-3 rounded-full shadow-2xl">
                  <Copy className="h-6 w-6" />
                </div>
              )}
            </div>

            <div className="text-center w-full mt-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 group-hover:text-primary transition-colors mb-1">{name}</p>
              <p className="text-sm font-mono font-black text-primary/80 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">{value}</p>
            </div>
          </button>
        )
      ))}
    </div>
  );
}
