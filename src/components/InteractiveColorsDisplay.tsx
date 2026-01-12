import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MousePointer className="h-5 w-5" />
          Interactive States
        </CardTitle>
        <CardDescription>Hover, active, disabled, and focus color tokens</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {colorGroups.map((group) => (
          <div key={group.name} className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg border border-border"
                style={{ background: group.base }}
              />
              <h3 className="font-semibold">{group.name}</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(group.states).map(([state, color]) => (
                <div
                  key={state}
                  className="p-3 rounded-lg border border-border/50 bg-muted/20 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    {stateIcons[state as keyof typeof stateIcons]}
                    <span className="text-sm font-medium capitalize">{state}</span>
                  </div>
                  <div
                    className="h-10 rounded-md border border-border/50"
                    style={{ background: color }}
                  />
                  <div className="text-xs text-muted-foreground font-mono truncate">
                    {color}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Border & Overlay Colors */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-border/50 bg-muted/20 space-y-2">
            <h4 className="font-medium text-sm">Overlay</h4>
            <div
              className="h-12 rounded-md border border-border/50 relative overflow-hidden"
              style={{ background: `linear-gradient(45deg, #888 25%, transparent 25%), linear-gradient(-45deg, #888 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #888 75%), linear-gradient(-45deg, transparent 75%, #888 75%)`, backgroundSize: '10px 10px', backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px' }}
            >
              <div
                className="absolute inset-0"
                style={{ background: colors.overlay }}
              />
            </div>
            <div className="text-xs text-muted-foreground font-mono">{colors.overlay}</div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-muted/20 space-y-2">
            <h4 className="font-medium text-sm">Border</h4>
            <div
              className="h-12 rounded-md"
              style={{ border: `3px solid ${colors.border}`, background: colors.background }}
            />
            <div className="text-xs text-muted-foreground font-mono">{colors.border}</div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-muted/20 space-y-2">
            <h4 className="font-medium text-sm">Border Light</h4>
            <div
              className="h-12 rounded-md"
              style={{ border: `3px solid ${colors.borderLight}`, background: colors.background }}
            />
            <div className="text-xs text-muted-foreground font-mono">{colors.borderLight}</div>
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
          <h4 className="font-medium text-sm mb-3">Interactive Demo</h4>
          <div className="flex flex-wrap gap-3">
            {colorGroups.map((group) => (
              <button
                key={group.name}
                className="px-4 py-2 rounded-md font-medium text-white transition-all"
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
                {group.name}
              </button>
            ))}
            <button
              className="px-4 py-2 rounded-md font-medium transition-all cursor-not-allowed"
              style={{
                background: colors.interactive.primary.disabled,
                color: colors.textSecondary,
              }}
              disabled
            >
              Disabled
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
