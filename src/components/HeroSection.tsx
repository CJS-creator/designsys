import { GeneratedDesignSystem } from "@/types/designSystem";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface HeroSectionProps {
    designSystem: GeneratedDesignSystem;
    isSaved?: boolean;
}

export function HeroSection({ designSystem, isSaved }: HeroSectionProps) {
    return (
        <section
            aria-labelledby="design-system-title"
            className="relative p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-background to-background border border-border shadow-sm overflow-hidden"
        >
            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" aria-hidden="true" />
            <div className="relative z-10 max-w-2xl">
                {isSaved ? (
                    <Badge variant="outline" className="mb-4 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                        <CheckCircle2 className="h-3 w-3 mr-1.5" aria-hidden="true" />
                        Saved
                    </Badge>
                ) : (
                    <Badge variant="outline" className="mb-4 bg-primary/5 text-primary border-primary/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                        <Sparkles className="h-3 w-3 mr-1.5" aria-hidden="true" />
                        Draft Preview
                    </Badge>
                )}
                <h2 id="design-system-title" className="text-3xl md:text-4xl font-bold mb-3 tracking-tight leading-tight">
                    {designSystem.name}
                </h2>
                <p className="text-base text-muted-foreground mb-2 leading-relaxed">
                    A high-performance design language generated for your specific industry and brand personality.
                </p>
            </div>
        </section>
    );
}
