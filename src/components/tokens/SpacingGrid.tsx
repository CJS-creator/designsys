import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SpacingGridProps {
    tokens: { path: string; value: string }[];
    onSelect?: (path: string) => void;
    className?: string;
}

export function SpacingGrid({ tokens, onSelect, className }: SpacingGridProps) {
    return (
        <Card className={cn("p-6 bg-card/50 backdrop-blur-sm border-border/50", className)}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Spacing Visual Grid
                </h3>
                <Badge variant="outline" className="text-[10px]">VISUAL GUIDE</Badge>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {tokens.map((token) => (
                    <div
                        key={token.path}
                        className="group flex items-center gap-4 cursor-pointer hover:bg-primary/5 p-2 rounded-lg transition-all"
                        onClick={() => onSelect?.(token.path)}
                    >
                        <div className="w-24 shrink-0">
                            <span className="text-xs font-mono font-bold truncate block">{token.path.split('.').pop()}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">{token.value}</span>
                        </div>

                        <div className="flex-1 h-8 flex items-center bg-muted/30 rounded px-2 overflow-hidden border border-border/30">
                            <div
                                className="h-4 bg-primary/40 rounded border border-primary/30 transition-all group-hover:bg-primary/60 group-hover:scale-y-110"
                                style={{ width: token.value }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-border/50 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-dashed border-border/50 flex flex-col items-center justify-center gap-2">
                    <div className="w-full h-24 relative overflow-hidden bg-muted/10 rounded-lg flex items-center justify-center">
                        <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-2 p-2 opacity-20">
                            {Array.from({ length: 36 }).map((_, i) => (
                                <div key={i} className="bg-primary/50 rounded-sm" />
                            ))}
                        </div>
                        <span className="text-[10px] font-medium text-muted-foreground z-10">Unit Consistency</span>
                    </div>
                </div>
                <div className="p-4 rounded-xl border border-dashed border-border/50 flex flex-col items-center justify-center gap-2">
                    <div className="w-full h-24 relative overflow-hidden bg-muted/10 rounded-lg flex items-center justify-center p-4">
                        <div className="flex gap-4 items-end h-full">
                            {tokens.slice(0, 5).map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-primary/30 rounded-t border-x border-t border-primary/20"
                                    style={{ width: '12px', height: `${(i + 1) * 20}%` }}
                                />
                            ))}
                        </div>
                        <span className="text-[10px] font-medium text-muted-foreground absolute bottom-2">Scale Preview</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
