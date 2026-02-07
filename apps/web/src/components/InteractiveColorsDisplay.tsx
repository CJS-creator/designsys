
import { ColorPalette } from "@/types/designSystem";
import { MousePointer, Hand, Ban, Focus } from "lucide-react";

interface InteractiveColorsDisplayProps {
  colors: ColorPalette;
}

export function InteractiveColorsDisplay({ colors }: InteractiveColorsDisplayProps) {
  // Ensure interactive colors exist with fallback
  const interactive = colors.interactive || {
    primary: { hover: colors.primary, active: colors.primary, disabled: colors.primary, focus: colors.primary },
    secondary: { hover: colors.secondary, active: colors.secondary, disabled: colors.secondary, focus: colors.secondary },
    accent: { hover: colors.accent, active: colors.accent, disabled: colors.accent, focus: colors.accent },
  };

  const colorGroups = [
    { name: "Primary", states: interactive.primary, base: colors.primary },
    { name: "Secondary", states: interactive.secondary, base: colors.secondary },
    { name: "Accent", states: interactive.accent, base: colors.accent },
  ];

  const stateIcons = {
    hover: <MousePointer className="h-3 w-3" />,
    active: <Hand className="h-3 w-3" />,
    disabled: <Ban className="h-3 w-3" />,
    focus: <Focus className="h-3 w-3" />,
  };

  return (
    <div className="space-y-8 p-4">
      <div className="grid gap-6">
        {colorGroups.map((group, groupIdx) => (
          <div key={group.name} className="space-y-6">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl shadow-lg border-2 border-white/10"
                style={{ background: group.base }}
              />
              <div>
                <h3 className="text-xl font-bold tracking-tight">{group.name} System</h3>
                <p className="text-sm text-muted-foreground">Reactive states for {group.name.toLowerCase()} elements</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(group.states).map(([state, color], idx) => (
                <div
                  key={state}
                  className="group relative p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1"
                  style={{ animationDelay: `${(groupIdx * 4 + idx) * 50}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                      {stateIcons[state as keyof typeof stateIcons]}
                      <span className="text-xs font-bold uppercase tracking-widest">{state}</span>
                    </div>
                  </div>

                  <div
                    className="h-16 rounded-xl border border-white/10 shadow-inner relative overflow-hidden mb-3"
                    style={{ background: color }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                  </div>

                  <div className="text-xs font-mono text-muted-foreground/80 bg-black/20 px-2 py-1 rounded inline-block">
                    {color}
                  </div>

                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div
                      className="h-2 w-2 rounded-full animate-ping"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Surface & Semantic Tokens */}
      <div className="space-y-6 pt-6 border-t border-white/5">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Focus className="h-5 w-5 text-primary" />
          Surface & Semantic Tokens
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Overlay */}
          <div className="p-6 rounded-2xl border border-white/5 bg-white/5 space-y-4 group">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Overlay</h4>
              <span className="text-xs font-mono text-muted-foreground">{colors.overlay}</span>
            </div>
            <div
              className="h-24 rounded-xl border border-white/10 relative overflow-hidden"
              style={{ background: `linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)`, backgroundSize: '12px 12px' }}
            >
              <div
                className="absolute inset-0 transition-opacity group-hover:opacity-80"
                style={{ background: colors.overlay }}
              />
            </div>
          </div>

          {/* Border Tokens */}
          <div className="p-6 rounded-2xl border border-white/5 bg-white/5 space-y-4 group">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Borders</h4>
              <span className="text-xs font-mono text-muted-foreground">{colors.border}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div
                className="h-24 rounded-xl flex items-center justify-center transition-all group-hover:scale-105"
                style={{ border: `2px solid ${colors.border}`, background: colors.background }}
              >
                <span className="text-xs font-bold text-muted-foreground uppercase opacity-50">Standard</span>
              </div>
              <div
                className="h-24 rounded-xl flex items-center justify-center transition-all group-hover:scale-105"
                style={{ border: `2px solid ${colors.borderLight}`, background: colors.background }}
              >
                <span className="text-xs font-bold text-muted-foreground uppercase opacity-50">Light</span>
              </div>
            </div>
          </div>

          {/* Backgrounds */}
          <div className="p-6 rounded-2xl border border-white/5 bg-white/5 space-y-4 group">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Backgrounds</h4>
              <span className="text-xs font-mono text-muted-foreground">{colors.background}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div
                className="h-24 rounded-xl shadow-lg transition-all group-hover:scale-105"
                style={{ background: colors.background }}
              />
              <div
                className="h-24 rounded-xl shadow-lg transition-all group-hover:scale-105"
                style={{ background: colors.surface }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Real-world Preview Buttons */}
      <div className="p-5 rounded-3xl bg-primary/5 border border-primary/10 mt-10">
        <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 text-center">Interactive Playground</h4>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {colorGroups.map((group) => (
            <button
              key={group.name}
              className="px-8 py-4 rounded-2xl font-bold text-white shadow-lg transition-all transform active:scale-95 hover:-translate-y-1 hover:shadow-2xl"
              style={{
                background: group.base,
                ["--hover-bg" as string]: group.states.hover,
                ["--active-bg" as string]: group.states.active,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = group.states.hover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = group.base)}
              onMouseDown={(e) => (e.currentTarget.style.background = group.states.active)}
              onMouseUp={(e) => (e.currentTarget.style.background = group.states.hover)}
            >
              {group.name} Action
            </button>
          ))}
          <button
            className="px-8 py-4 rounded-2xl font-bold transition-all cursor-not-allowed opacity-50 grayscale"
            style={{
              background: interactive.primary.disabled,
              color: colors.textSecondary,
              border: `1px solid ${colors.border}`
            }}
            disabled
          >
            Disabled State
          </button>
        </div>
      </div>
    </div>
  );
}
