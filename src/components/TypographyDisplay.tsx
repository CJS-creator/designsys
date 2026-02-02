import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyScale } from "@/types/designSystem";
import { Type, Copy } from "lucide-react";
import { toast } from "sonner";

interface TypographyDisplayProps {
  typography: TypographyScale;
  renderFontFamily?: (font: string, type: string, index: number) => React.ReactNode;
  renderWeight?: (weight: string, value: number) => React.ReactNode;
  renderTypeScaleItem?: (size: string, value: string, index: number) => React.ReactNode;
}

export function TypographyDisplay({
  typography,
  renderFontFamily,
  renderWeight,
  renderTypeScaleItem
}: TypographyDisplayProps) {
  const copyValue = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`Copied: ${value}`);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Container for Typography subsections using the specified grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left Column: Font Families & Font Weights */}
        <div className="space-y-6">
          {/* Font Families */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider pl-1">
              Font Families
            </h4>
            <div className="grid gap-4">
              {Object.entries(typography.fontFamily).map(([type, font], index) => (
                renderFontFamily ? renderFontFamily(font, type, index) : (
                  <button
                    key={type}
                    onClick={() => copyValue(font)}
                    className="flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:bg-muted/50 transition-all duration-300 group"
                  >
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-full mb-1">
                        {type}
                      </span>
                      <span
                        className="text-2xl text-foreground"
                        style={{ fontFamily: font }}
                      >
                        {font.split(',')[0].replace(/['"]/g, '')}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground mt-1">{font}</span>
                    </div>
                    <div className="h-8 w-8 flex items-center justify-center rounded-full border border-border bg-background group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                      <Copy className="h-3 w-3" />
                    </div>
                  </button>
                )
              ))}
            </div>
          </div>

          {/* Font Weights */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider pl-1">
              Font Weights
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(typography.weights).map(([weight, value]) => (
                renderWeight ? renderWeight(weight, Number(value)) : (
                  <button
                    key={weight}
                    onClick={() => copyValue(String(value))}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-border bg-background hover:border-primary/50 hover:bg-primary/5 transition-all group aspect-square"
                  >
                    <span
                      className="text-3xl text-foreground group-hover:text-primary transition-colors"
                      style={{ fontWeight: value }}
                    >
                      Aa
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-2">{weight}</span>
                    <span className="text-xs font-mono text-muted-foreground/60">{value}</span>
                  </button>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Type Scale */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider pl-1">
            Type Scale
          </h4>
          <div className="border border-border rounded-xl bg-background divide-y divide-border overflow-hidden">
            {Object.entries(typography.sizes)
              .sort((a, b) => parseInt(b[1]) - parseInt(a[1]))
              .map(([size, value], index) => (
                renderTypeScaleItem ? renderTypeScaleItem(size, value, index) : (
                  <button
                    key={size}
                    onClick={() => copyValue(value)}
                    className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-all group"
                  >
                    <div className="flex items-center gap-8 py-1">
                      <span className="text-xs font-mono text-muted-foreground w-12 text-left uppercase">
                        {size}
                      </span>
                      <span
                        className="text-foreground group-hover:text-primary transition-colors"
                        style={{ fontSize: value, lineHeight: 1.5 }}
                      >
                        Ag
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded border border-border">
                        {value}
                      </span>
                    </div>
                  </button>
                )
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
