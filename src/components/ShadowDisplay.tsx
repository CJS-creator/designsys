import { ShadowScale } from "@/types/designSystem";
import { toast } from "sonner";

interface ShadowDisplayProps {
  shadows: ShadowScale;
}

export function ShadowDisplay({ shadows }: ShadowDisplayProps) {
  const copyValue = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Shadow copied!", { icon: "👻" });
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
      {Object.entries(shadows).map(([name, value]) => (
        <button
          key={name}
          onClick={() => copyValue(value)}
          className="flex flex-col items-center gap-2 group transition-all min-w-0"
        >
          <div
            className="h-20 sm:h-24 w-full bg-background rounded-2xl border border-border/50 shadow-sm transition-all duration-300 group-hover:border-primary/50 relative flex flex-col items-center justify-center p-3 overflow-hidden"
            style={{ boxShadow: value }}
          >
            <span className="text-[10px] sm:text-xs font-black text-muted-foreground uppercase tracking-widest leading-none mb-1.5 group-hover:text-primary transition-colors">{name}</span>
            <span className="text-[8px] font-mono text-muted-foreground/40 truncate w-full text-center">{value}</span>
          </div>
          <p className="text-[10px] font-bold text-primary uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Click to copy</p>
        </button>
      ))}
    </div>
  );
}
