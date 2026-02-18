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
    <div className="grid gap-4">
      {Object.entries(spacing.scale).map(([key, value]) => (
        <button
          key={key}
          onClick={() => copyValue(value)}
          className="flex items-center gap-6 w-full p-4 rounded-2xl hover:bg-muted/50 transition-all group border border-transparent hover:border-border/50"
        >
          <div className="w-16 text-right">
            <span className="text-sm font-black font-mono text-muted-foreground/60 uppercase tracking-widest">{key}</span>
          </div>
          <div className="flex-1 flex items-center gap-6">
            <div className="h-8 bg-primary/20 rounded-lg transition-all duration-500 group-hover:bg-primary/40 shadow-inner" style={{ width: `min(100%, ${parseInt(value) * 3}px)` }} />
            <span className="text-sm font-black font-mono text-primary/80">{value}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
