
import { BorderRadius } from "@/types/designSystem";

import { toast } from "sonner";

interface BorderRadiusDisplayProps {
  borderRadius: BorderRadius;
}

export function BorderRadiusDisplay({ borderRadius }: BorderRadiusDisplayProps) {
  const copyValue = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`Copied: ${value}`);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
      {Object.entries(borderRadius).map(([name, value]) => (
        <button
          key={name}
          onClick={() => copyValue(value)}
          className="flex flex-col items-center gap-3 group transition-all"
        >
          <div
            className="h-16 w-full border border-border bg-background shadow-sm transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/5"
            style={{ borderRadius: value }}
          />
          <div className="text-center w-full">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">{name}</p>
            <p className="text-xs font-mono text-muted-foreground/60">{value}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
