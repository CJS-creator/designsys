import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SpacingScale } from "@/types/designSystem";
import { Maximize2 } from "lucide-react";
import { toast } from "sonner";

interface SpacingDisplayProps {
  spacing: SpacingScale;
}

export function SpacingDisplay({ spacing }: SpacingDisplayProps) {
  const copyValue = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`Copied: ${value}`);
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Maximize2 className="h-5 w-5 text-primary" />
          Spacing Scale
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Base unit:</span>
            <code className="px-2 py-0.5 bg-muted rounded font-mono">{spacing.unit}px</code>
          </div>
          <div className="space-y-2">
            {Object.entries(spacing.scale).map(([key, value]) => (
              <button
                key={key}
                onClick={() => copyValue(value)}
                className="flex items-center gap-4 w-full p-2 rounded-lg hover:bg-muted/50 transition-colors group"
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
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
