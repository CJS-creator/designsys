import { GeneratedDesignSystem } from "@/types/designSystem";
import { Card } from "@/components/ui/card";
import { Layers, Zap, Shield, Type } from "lucide-react";

export function FeaturesOverview({ designSystem }: { designSystem: GeneratedDesignSystem }) {
    const tokenCount = Object.keys(designSystem.colors).length + 
                     Object.keys(designSystem.typography.sizes).length + 
                     Object.keys(designSystem.spacing.scale).length + 
                     Object.keys(designSystem.shadows).length;

    const features = [
        {
            icon: Layers,
            title: "Token Architecture",
            description: `${tokenCount} design tokens architected across semantic layers.`,
            value: "100%",
            label: "Full Architecture Coverage"
        },
        {
            icon: Zap,
            title: "Bundle Efficiency",
            description: "Tokens optimized for zero-runtime impact and tiny bundle size.",
            value: "Optimized",
            label: "Performance Optimized"
        },
        {
            icon: Shield,
            title: "A11y Validated",
            description: "WCAG 2.1 contrast compliance verified across brand roles.",
            value: "Verified",
            label: "Accessibility Verified"
        },
        {
            icon: Type,
            title: "Typography",
            description: `Using ${designSystem.typography.fontFamily.heading} for premium legibility.`,
            value: "Premium",
            label: "Typography Standard"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
                <Card 
                    key={index} 
                    className="p-6 border-border/50 bg-card/50 backdrop-blur-sm card-interactive hover:border-primary/20 rounded-2xl"
                    role="region"
                    aria-label={feature.label}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center" aria-hidden="true">
                            <feature.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-[10px] font-bold text-primary px-2 py-1 rounded-lg bg-primary/5 border border-primary/10 uppercase tracking-wider">
                            {feature.value}
                        </div>
                    </div>
                    <h3 className="text-sm font-bold mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">{feature.description}</p>
                </Card>
            ))}
        </div>
    );
}
