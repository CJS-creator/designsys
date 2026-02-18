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
            className="h-48 w-full bg-background rounded-[2.5rem] border border-border/50 shadow-sm transition-all duration-500 group-hover:border-primary/50 relative flex items-center justify-center p-8 overflow-visible"
            style={{
              boxShadow: value,
              backgroundImage: 'radial-gradient(circle, currentColor 1.5px, transparent 1.5px)',
              backgroundSize: '16px 16px',
              color: 'rgba(0,0,0,0.04)'
            }}
          >
            <span className="text-sm font-black text-muted-foreground/80 uppercase leading-relaxed relative z-10 tracking-[0.2em]">{name}</span>
          </div>
          <p className="text-xs font-mono text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity">Copy Shadow</p>
        </button>
      ))}
    </div>
  );
}
