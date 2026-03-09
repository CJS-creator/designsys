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
            className="h-16 sm:h-20 w-full bg-background rounded-xl border border-border/50 shadow-sm transition-all duration-300 group-hover:border-primary/50 relative flex items-center justify-center p-2"
            style={{ boxShadow: value }}
          >
            <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase leading-relaxed truncate">{name}</span>
          </div>
          <p className="text-[10px] sm:text-xs font-mono text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity truncate max-w-full">Copy</p>
        </button>
      ))}
    </div>
  );
}
