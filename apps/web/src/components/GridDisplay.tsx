import { GridSystem } from "@/types/designSystem";
import { toast } from "sonner";

interface GridDisplayProps {
  grid: GridSystem;
}

export function GridDisplay({ grid }: GridDisplayProps) {
  const copyValue = (arg1: string, arg2?: string) => {
    const value = arg2 ?? arg1;
    navigator.clipboard.writeText(value);
    toast.success(`Copied: ${value}`);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Grid Properties */}
      <div className="space-y-6">
        <h4 className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em] pl-2 mb-6">Configuration</h4>
        <div className="grid grid-cols-2 gap-6">
          {[
            { label: "Columns", value: grid.columns, key: "columns" },
            { label: "Gutter", value: grid.gutter, key: "gutter" },
            { label: "Margin", value: grid.margin, key: "margin" },
            { label: "Max Width", value: grid.maxWidth, key: "maxWidth" }
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => copyValue(String(item.value))}
              className="p-8 bg-background rounded-3xl border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all group shadow-sm hover:shadow-xl hover:shadow-primary/5"
            >
              <p className="text-[10px] text-muted-foreground/60 uppercase font-black tracking-[0.2em] mb-2">{item.label}</p>
              <p className="text-3xl font-black text-foreground group-hover:text-primary transition-colors font-mono">{item.value}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em] pl-2 mb-6">Breakpoints</h4>
        <div className="border-2 border-border rounded-3xl bg-background divide-y-2 divide-border overflow-hidden shadow-sm">
          {Object.entries(grid.breakpoints).map(([name, value]) => (
            <button
              key={name}
              onClick={() => copyValue(name, value)}
              className="flex items-center justify-between w-full p-6 hover:bg-muted/50 transition-all group lg:min-h-[80px]"
            >
              <span className="text-base font-black uppercase text-muted-foreground group-hover:text-primary tracking-widest">{name}</span>
              <span className="text-xl font-mono font-black text-foreground bg-muted/30 px-4 py-1.5 rounded-xl">{value}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
