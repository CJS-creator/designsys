
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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {Object.entries(borderRadius).map(([name, value]) => (
        <button
          key={name}
          onClick={() => copyValue(value)}
          className="flex flex-col items-center gap-2 group transition-all min-w-0"
        >
          <div
            className="h-12 sm:h-16 w-full border border-border bg-background shadow-sm transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/5"
            style={{ borderRadius: value }}
          />
          <div className="text-center w-full min-w-0">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors truncate">{name}</p>
            <p className="text-[10px] sm:text-xs font-mono text-muted-foreground/60 truncate">{value}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
