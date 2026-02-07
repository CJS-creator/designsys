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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Object.entries(shadows).map(([name, value]) => (
        <button
          key={name}
          onClick={() => copyValue(value)}
          className="flex flex-col items-center gap-3 group transition-all"
        >
          <div
            className="h-20 w-full bg-background rounded-xl border border-border/50 shadow-sm transition-all duration-300 group-hover:border-primary/50 relative flex items-center justify-center p-2"
            style={{ boxShadow: value }}
          >
            <span className="text-xs font-bold text-muted-foreground uppercase leading-relaxed">{name}</span>
          </div>
          <p className="text-xs font-mono text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity">Copy Shadow</p>
        </button>
      ))}
    </div>
  );
}
