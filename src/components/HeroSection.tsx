import { GeneratedDesignSystem } from "@/types/designSystem";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export function HeroSection({ designSystem }: { designSystem: GeneratedDesignSystem }) {
    return (
        <div className="relative p-5 md:p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-background to-background border border-primary/10 overflow-hidden group">
            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
            <div className="relative z-10 max-w-2xl">
                <Badge variant="outline" className="mb-4 bg-primary/5 text-primary border-primary/20 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                    <Sparkles className="h-3 w-3 mr-2 animate-pulse" />
                    Ready for Production
                </Badge>
                <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter leading-none">
                    {designSystem.name}
                </h2>
                <p className="text-lg text-muted-foreground font-medium mb-5 leading-relaxed">
                    A high-performance design language generated for your specific industry and brand personality.
                </p>
                <div className="flex flex-wrap gap-4">
                    <div className="px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 hover-lift cursor-default">
                        {Object.keys(designSystem.colors).length} Colors
                    </div>
                    <div className="px-5 py-2.5 rounded-2xl bg-card border border-border text-foreground text-sm font-bold hover-lift cursor-default">
                        {Object.keys(designSystem.typography.sizes).length} Type Scales
                    </div>
                </div>
            </div>
        </div>
    );
}
