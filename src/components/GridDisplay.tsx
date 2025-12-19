import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GridSystem } from "@/types/designSystem";
import { Grid3X3, Copy } from "lucide-react";
import { toast } from "sonner";

interface GridDisplayProps {
  grid: GridSystem;
}

export function GridDisplay({ grid }: GridDisplayProps) {
  const copyValue = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`Copied: ${value}`);
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grid3X3 className="h-5 w-5 text-primary" />
          Grid System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Grid Visualization */}
        <div className="p-4 bg-background rounded-xl">
          <div
            className="grid gap-2 mx-auto"
            style={{
              gridTemplateColumns: `repeat(${grid.columns}, 1fr)`,
              maxWidth: "100%",
            }}
          >
            {Array.from({ length: grid.columns }).map((_, i) => (
              <div
                key={i}
                className="h-12 bg-primary/20 rounded-md flex items-center justify-center text-xs font-mono text-primary"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Grid Properties */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => copyValue("columns", String(grid.columns))}
            className="p-3 bg-background rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <p className="text-xs text-muted-foreground">Columns</p>
            <p className="text-lg font-semibold">{grid.columns}</p>
          </button>
          <button
            onClick={() => copyValue("gutter", grid.gutter)}
            className="p-3 bg-background rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <p className="text-xs text-muted-foreground">Gutter</p>
            <p className="text-lg font-semibold font-mono">{grid.gutter}</p>
          </button>
          <button
            onClick={() => copyValue("margin", grid.margin)}
            className="p-3 bg-background rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <p className="text-xs text-muted-foreground">Margin</p>
            <p className="text-lg font-semibold font-mono">{grid.margin}</p>
          </button>
          <button
            onClick={() => copyValue("maxWidth", grid.maxWidth)}
            className="p-3 bg-background rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <p className="text-xs text-muted-foreground">Max Width</p>
            <p className="text-lg font-semibold font-mono">{grid.maxWidth}</p>
          </button>
        </div>

        {/* Breakpoints */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Breakpoints
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(grid.breakpoints).map(([name, value]) => (
              <button
                key={name}
                onClick={() => copyValue(name, value)}
                className="px-3 py-2 bg-background rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-2"
              >
                <span className="text-xs font-mono text-muted-foreground">{name}</span>
                <span className="text-sm font-mono font-medium">{value}</span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
