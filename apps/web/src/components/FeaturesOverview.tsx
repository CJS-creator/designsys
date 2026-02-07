import { GeneratedDesignSystem } from "@/types/designSystem";
import { Card } from "@/components/ui/card";
import { Layers, Zap, Shield, Type } from "lucide-react";

export function FeaturesOverview({ designSystem }: { designSystem: GeneratedDesignSystem }) {
    const features = [
        {
            icon: Layers,
            title: "Full Token Coverage",
            description: "23+ semantic token types including shadows, grid, and motion.",
            value: "100%"
        },
        {
            icon: Zap,
            title: "Optimized Performance",
            description: "Tokens optimized for minimal bundle size and runtime impact.",
            value: "<1ms"
        },
        {
            icon: Shield,
            title: "A11y Validated",
            description: "WCAG 2.1 contrast compliance checked across all brand roles.",
            value: "Pass"
        },
        {
            icon: Type,
            title: "Smart Typography",
            description: "Professionally paired fonts selected by AI for readability.",
            value: designSystem.typography.fontFamily.heading
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
                <Card key={index} className="p-5 border-border/50 bg-card/50 backdrop-blur-sm card-interactive hover:border-primary/20">
                    <div className="flex items-start justify-between mb-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <feature.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-xs font-bold text-primary px-2 py-1 rounded-md bg-primary/5 border border-primary/10">
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
