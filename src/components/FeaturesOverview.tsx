import { GeneratedDesignSystem } from "@/types/designSystem";
import { Card } from "@/components/ui/card";
import { Layers, Type, Palette, Ruler } from "lucide-react";
import { useMemo } from "react";

export function FeaturesOverview({ designSystem }: { designSystem: GeneratedDesignSystem }) {
    const metrics = useMemo(() => {
        const colorCount = Object.keys(designSystem.colors || {}).length;
        const typeScales = Object.keys(designSystem.typography?.sizes || {}).length;
        const spacingSteps = Object.keys(designSystem.spacing?.scale || {}).length;
        const shadowCount = Object.keys(designSystem.shadows || {}).length;

        return [
            {
                icon: Palette,
                title: "Color Tokens",
                description: "Semantic colors covering brand, surface, and feedback roles.",
                value: String(colorCount),
                ariaLabel: `${colorCount} color tokens`,
            },
            {
                icon: Type,
                title: "Type Scales",
                description: `Heading font: ${designSystem.typography?.fontFamily?.heading ?? "—"}.`,
                value: String(typeScales),
                ariaLabel: `${typeScales} typography scales`,
            },
            {
                icon: Ruler,
                title: "Spacing Steps",
                description: `Built on a ${designSystem.spacing?.unit ?? 4}px base unit.`,
                value: String(spacingSteps),
                ariaLabel: `${spacingSteps} spacing steps`,
            },
            {
                icon: Layers,
                title: "Elevation",
                description: "Shadow tokens for depth across light and dark modes.",
                value: String(shadowCount),
                ariaLabel: `${shadowCount} shadow tokens`,
            },
        ];
    }, [designSystem]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list" aria-label="Design system metrics">
            {metrics.map((feature, index) => (
                <Card
                    key={index}
                    role="listitem"
                    aria-label={feature.ariaLabel}
                    className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
                >
                    <div className="flex items-start justify-between mb-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                            <feature.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                        </div>
                        <div className="text-sm font-bold text-primary px-2 py-0.5 rounded-md bg-primary/5 border border-primary/10 tabular-nums">
                            {feature.value}
                        </div>
                    </div>
                    <h3 className="text-sm font-semibold mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
            ))}
        </div>
    );
}
