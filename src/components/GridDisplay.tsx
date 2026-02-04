import { GridSystem } from "@/types/designSystem";
import { toast } from "sonner";

interface GridDisplayProps {
  grid: GridSystem;
}

export function GridDisplay({ grid }: GridDisplayProps) {
  const copyValue = (_key: string, value: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`Copied: ${value}`);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Grid Properties */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider pl-1">Configuration</h4>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Columns", value: grid.columns, key: "columns" },
            { label: "Gutter", value: grid.gutter, key: "gutter" },
            { label: "Margin", value: grid.margin, key: "margin" },
            { label: "Max Width", value: grid.maxWidth, key: "maxWidth" }
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => copyValue(item.key, String(item.value))}
              className="p-4 bg-background rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
              <p className="text-lg font-bold text-foreground group-hover:text-primary transition-colors font-mono">{item.value}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Breakpoints */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider pl-1 font-semibold">Breakpoints</h4>
        <div className="border border-border rounded-xl bg-background divide-y divide-border overflow-hidden">
          {Object.entries(grid.breakpoints).map(([name, value]) => (
            <button
              key={name}
              onClick={() => copyValue(name, value)}
              className="flex items-center justify-between w-full p-3 hover:bg-muted/50 transition-all group"
            >
              <span className="text-sm font-bold uppercase text-muted-foreground group-hover:text-primary">{name}</span>
              <span className="text-base font-mono font-medium text-foreground">{value}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
