import { GeneratedDesignSystem } from "@/types/designSystem";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export function HeroSection({ designSystem }: { designSystem: GeneratedDesignSystem }) {
    return (
        <div className="relative p-6 md:p-10 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-background to-background border border-primary/10 overflow-hidden group">
            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
            <div className="relative z-10 w-full">
                <Badge variant="outline" className="mb-10 bg-primary/10 text-primary border-primary/20 backdrop-blur-md px-6 py-2.5 rounded-full text-[12px] font-black tracking-[0.2em] uppercase shadow-lg shadow-primary/10">
                    <Sparkles className="h-4 w-4 mr-2 animate-pulse text-primary/80" />
                    Ready for Production
                </Badge>
                <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tightest leading-[0.85] break-words hyphens-auto">
                    {designSystem.name}
                </h2>
                <p className="text-xl md:text-2xl text-muted-foreground/80 font-bold mb-10 leading-relaxed tracking-tight">
                    A high-performance design language generated for your specific industry and brand personality.
                </p>
                <div className="flex flex-wrap gap-4">
                    <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20 group/stat">
                        <span className="text-3xl font-black text-primary/80 group-hover/stat:text-primary transition-colors">
                            {Object.keys(designSystem.colors).length}
                        </span>
                        <span className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Colors</span>
                    </div>
                    <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20 group/stat">
                        <span className="text-3xl font-black text-primary/80 group-hover/stat:text-primary transition-colors">
                            {Object.keys(designSystem.typography.sizes).length}
                        </span>
                        <span className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Type Scales</span>
                    </div>
                    {/* Proper Export CTA instead of empty placeholder */}
                    <button className="px-6 py-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-4 backdrop-blur-sm transition-all hover:bg-primary/20 hover:border-primary/30 group/cta shadow-lg shadow-primary/5">
                        <span className="text-sm font-black uppercase tracking-widest text-primary">Export Tokens</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
