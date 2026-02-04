
import { SpacingScale } from "@/types/designSystem";

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
    <div className="grid gap-3">
      {Object.entries(spacing.scale).map(([key, value]) => (
        <button
          key={key}
          onClick={() => copyValue(value)}
          className="flex items-center gap-4 w-full p-2 rounded-lg hover:bg-muted/50 transition-all group border border-transparent hover:border-border/50"
        >
          <div className="w-12 text-right">
            <span className="text-xs font-mono font-bold text-muted-foreground uppercase leading-normal">{key}</span>
          </div>
          <div className="flex-1 flex items-center gap-4">
            <div className="h-4 bg-primary/20 rounded-sm transition-all duration-300 group-hover:bg-primary/30" style={{ width: `min(100%, ${parseInt(value) * 2}px)` }} />
            <span className="text-xs font-mono text-muted-foreground">{value}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
