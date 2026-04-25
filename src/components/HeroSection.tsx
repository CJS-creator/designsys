import { GeneratedDesignSystem } from "@/types/designSystem";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export function HeroSection({ designSystem }: { designSystem: GeneratedDesignSystem }) {
    return (
        <div className="relative p-6 md:p-8 rounded-[2rem] bg-gradient-to-br from-primary/10 via-background to-card border border-primary/10 overflow-hidden group shadow-sm">
            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
            <div className="relative z-10 max-w-2xl">
                {designSystem.id && (
                    <Badge variant="outline" className="mb-6 bg-primary/5 text-primary border-primary/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase">
                        <Sparkles className="h-3 w-3 mr-2 animate-pulse" aria-hidden="true" />
                        Ready for Production
                    </Badge>
                )}
                <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight leading-tight">
                    {designSystem.name}
                </h2>
                <p className="text-sm md:text-base text-muted-foreground font-medium mb-8 leading-relaxed">
                    A high-performance design language generated for your specific industry and brand personality.
                </p>
                <div className="flex flex-wrap gap-3">
                    <div className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-lg shadow-primary/20 cursor-default">
                        {Object.keys(designSystem.colors).length} Colors
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-card border border-border text-foreground text-xs font-bold cursor-default">
                        {Object.keys(designSystem.typography.sizes).length} Type Scales
                    </div>
                </div>
            </div>
        </div>
    );
}
