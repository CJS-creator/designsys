
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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
      {Object.entries(borderRadius).map(([name, value]) => (
        <button
          key={name}
          onClick={() => copyValue(value)}
          className="flex flex-col items-center gap-4 group transition-all"
        >
          <div
            className="h-28 w-full border-2 border-border bg-background shadow-lg transition-all duration-500 group-hover:border-primary/50 group-hover:bg-primary/5 group-hover:shadow-2xl group-hover:shadow-primary/5"
            style={{ borderRadius: value }}
          />
          <div className="text-center w-full">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/60 group-hover:text-primary transition-colors mb-1">{name}</p>
            <p className="text-sm font-mono font-black text-primary/80">{value}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
