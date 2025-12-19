import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyScale } from "@/types/designSystem";
import { Type, Copy } from "lucide-react";
import { toast } from "sonner";

interface TypographyDisplayProps {
  typography: TypographyScale;
}

export function TypographyDisplay({ typography }: TypographyDisplayProps) {
  const copyValue = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`Copied: ${value}`);
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="h-5 w-5 text-primary" />
          Typography
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Font Families */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Font Families
          </h4>
          <div className="grid gap-3">
            {Object.entries(typography.fontFamily).map(([type, font]) => (
              <button
                key={type}
                onClick={() => copyValue(font)}
                className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-muted-foreground uppercase w-16">
                    {type}
                  </span>
                  <span
                    className="text-lg"
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </span>
                </div>
                <Copy className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* Type Scale */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Type Scale
          </h4>
          <div className="space-y-2">
            {Object.entries(typography.sizes)
              .reverse()
              .map(([size, value]) => (
                <button
                  key={size}
                  onClick={() => copyValue(value)}
                  className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-muted-foreground w-8">
                      {size}
                    </span>
                    <span
                      className="truncate"
                      style={{ fontSize: value }}
                    >
                      The quick brown fox
                    </span>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    {value}
                  </span>
                </button>
              ))}
          </div>
        </div>

        {/* Font Weights */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Font Weights
          </h4>
          <div className="flex flex-wrap gap-3">
            {Object.entries(typography.weights).map(([weight, value]) => (
              <button
                key={weight}
                onClick={() => copyValue(String(value))}
                className="flex flex-col items-center gap-1 p-3 rounded-lg bg-background hover:bg-muted/50 transition-colors"
              >
                <span
                  className="text-lg"
                  style={{ fontWeight: value }}
                >
                  Aa
                </span>
                <span className="text-xs text-muted-foreground capitalize">{weight}</span>
                <span className="text-xs font-mono text-muted-foreground">{value}</span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
