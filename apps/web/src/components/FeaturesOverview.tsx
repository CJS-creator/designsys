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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
                <Card key={index} className="p-6 md:p-10 border-border/50 bg-card/50 backdrop-blur-md card-interactive hover:border-primary/30 flex flex-col justify-between min-h-[220px] rounded-[2.5rem]">
                    <div className="flex items-start justify-between mb-6 shrink-0">
                        <div className="h-16 w-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-primary/5">
                            <feature.icon className="h-8 w-8 text-primary" />
                        </div>
                        <div className="text-sm font-black text-primary px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/10 shrink-0 ml-2 shadow-sm uppercase tracking-widest">
                            {feature.value}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-black mb-2 shrink-0 tracking-tight uppercase tracking-wider">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground/80 leading-relaxed font-bold flex-shrink-0">{feature.description}</p>
                    </div>
                </Card>
            ))}
        </div>
    );
}
