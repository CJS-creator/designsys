import { TypographyScale } from "@/types/designSystem";
import { Copy } from "lucide-react";
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
                    className="flex items-center justify-between p-6 rounded-3xl border border-border bg-background hover:bg-muted/30 transition-all duration-500 group min-h-[140px]"
                  >
                    <div className="flex flex-col items-start gap-2">
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 px-3 py-1 rounded-full mb-2">
                        {type}
                      </span>
                      <span
                        className="text-4xl md:text-5xl text-foreground font-black tracking-tight"
                        style={{ fontFamily: font }}
                      >
                        {font.split(',')[0].replace(/['"]/g, '')}
                      </span>
                      <span className="text-sm font-mono font-bold text-muted-foreground mt-2 opacity-60">{font}</span>
                    </div>
                    <div className="h-12 w-12 flex items-center justify-center rounded-2xl border-2 border-border bg-background group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all shadow-lg shadow-primary/5">
                      <Copy className="h-5 w-5" />
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
                    className="flex flex-col items-center justify-center p-6 rounded-3xl border border-border bg-background hover:border-primary/50 hover:bg-primary/5 transition-all group aspect-square shadow-xl shadow-black/5"
                  >
                    <span
                      className="text-5xl text-foreground group-hover:text-primary transition-colors mb-3"
                      style={{ fontWeight: value }}
                    >
                      Aa
                    </span>
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">{weight}</span>
                    <span className="text-sm font-mono font-black text-primary/60">{value}</span>
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
                    className="flex items-center justify-between w-full p-6 hover:bg-muted/50 transition-all group min-h-[100px]"
                  >
                    <div className="flex items-center gap-12 py-2">
                      <span className="text-[10px] font-black text-muted-foreground w-16 text-left uppercase tracking-[0.2em]">
                        {size}
                      </span>
                      <span
                        className="text-foreground group-hover:text-primary transition-colors font-black"
                        style={{ fontSize: value, lineHeight: 1.1 }}
                      >
                        Ag
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-sm font-black font-mono text-muted-foreground bg-muted/80 px-4 py-2 rounded-xl border border-border shadow-sm">
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
