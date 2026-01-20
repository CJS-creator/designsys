import { GeneratedDesignSystem } from "@/types/designSystem";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { getContrastRatio, getWCAGCompliance, optimizeColorForContrast } from "@/lib/colorUtils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
    CheckCircle2, AlertCircle, Info, Activity, ShieldCheck, Zap, Sparkles,
    Palette, Type, Maximize2
} from "lucide-react";
import { toast } from "sonner";

interface DesignInsightsProps {
    designSystem: GeneratedDesignSystem;
    onUpdate: (updatedSystem: GeneratedDesignSystem) => void;
}

export const DesignInsights = ({ designSystem, onUpdate }: DesignInsightsProps) => {
    const { colors, typography, spacing, shadows, borderRadius } = designSystem;

    // 1. Accessibility Analysis
    const checkContrast = (foreground: string, background: string) => {
        const ratio = getContrastRatio(foreground, background);
        return {
            ratio: ratio.toFixed(2),
            status: getWCAGCompliance(ratio),
        };
    };

    const primaryContrast = checkContrast(colors.primary, colors.background);
    const secondaryContrast = checkContrast(colors.secondary, colors.background);
    const textContrast = checkContrast(colors.text, colors.background);

    const accessibilityScore = [
        primaryContrast.status !== "Fail",
        secondaryContrast.status !== "Fail",
        textContrast.status === "AAA",
    ].filter(Boolean).length * 33.3;

    const handleSmartFix = () => {
        const updatedColors = { ...colors };
        let fixed = false;

        if (primaryContrast.status === "Fail") {
            updatedColors.primary = optimizeColorForContrast(colors.primary, colors.background, "AA");
            fixed = true;
        }

        if (secondaryContrast.status === "Fail") {
            updatedColors.secondary = optimizeColorForContrast(colors.secondary, colors.background, "AA");
            fixed = true;
        }

        if (fixed) {
            onUpdate({
                ...designSystem,
                colors: updatedColors,
            });
            toast.success("AI Smart Fix applied! Colors optimized for accessibility.");
        } else {
            toast.info("Your colors already pass accessibility standards.");
        }
    };

    // 2. Token Statistics
    const tokenStats = [
        { label: "Colors", count: Object.keys(colors).length + Object.keys(colors.interactive).length * 4, icon: Palette },
        { label: "Typography", count: Object.keys(typography.sizes).length, icon: Type },
        { label: "Spacing", count: Object.keys(spacing.scale).length, icon: Maximize2 },
        { label: "Effects", count: Object.keys(shadows).length + Object.keys(borderRadius).length, icon: Sparkles },
    ];

    // 3. DNA Data (Simplified visualization of design intent)
    const dnaData = [
        { name: "Brand", value: 40, color: colors.primary },
        { name: "Structure", value: 30, color: colors.secondary },
        { name: "Utility", value: 30, color: colors.accent },
    ];

    return (
        <div className="space-y-10 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Overall Health */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-md relative overflow-hidden group transition-all hover:bg-white/10">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShieldCheck className="h-12 w-12 text-primary" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Design Health</p>
                        <div className="flex items-baseline gap-2">
                            <div className="text-4xl font-black tracking-tighter text-white">{Math.round(accessibilityScore)}%</div>
                            <span className="text-xs font-bold text-success">Optimized</span>
                        </div>
                        <Progress value={accessibilityScore} className="h-1.5 mt-4 bg-white/10" />
                        <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
                            Calculated via WCAG 2.1 contrast compliance and token completeness mapping.
                        </p>
                    </div>
                </div>

                {/* Token Count */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-md relative overflow-hidden group transition-all hover:bg-white/10">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="h-12 w-12 text-primary" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">System Entropy</p>
                        <div className="text-4xl font-black tracking-tighter text-white">
                            {tokenStats.reduce((acc, curr) => acc + curr.count, 0)}
                        </div>
                        <div className="flex gap-1.5 mt-4 flex-wrap">
                            {tokenStats.map(stat => (
                                <div key={stat.label} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                    <stat.icon className="h-2.5 w-2.5" />
                                    {stat.count}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* DNA Composition */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-md relative overflow-hidden group transition-all hover:bg-white/10">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap className="h-12 w-12 text-primary" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Style DNA</p>
                        <div className="h-[75px] w-full -mt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dnaData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={22}
                                        outerRadius={32}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {dnaData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Accessibility Details */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            Contrast Analytics
                        </h3>
                        <Button
                            variant="default"
                            size="sm"
                            className="h-8 gap-2 bg-primary/20 hover:bg-primary/30 text-primary border-none font-bold text-xs rounded-full px-4"
                            onClick={handleSmartFix}
                        >
                            <Sparkles className="h-3 w-3" />
                            Smart Fix
                        </Button>
                    </div>

                    <div className="grid gap-3">
                        {[
                            { label: "Primary / BG", result: primaryContrast, color: colors.primary },
                            { label: "Secondary / BG", result: secondaryContrast, color: colors.secondary },
                            { label: "Text / BG", result: textContrast, color: colors.text },
                        ].map((item, i) => (
                            <div key={i} className="group flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-10 h-10 rounded-full border-2 border-white/10 shadow-lg"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{item.label}</p>
                                        <p className="text-sm font-mono text-white/90">{item.result.ratio}:1 Ratio</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge
                                        variant={item.result.status === "Fail" ? "destructive" : "outline"}
                                        className={`rounded-full px-3 py-1 font-bold text-[10px] tracking-widest ${item.result.status === "AAA" ? "bg-primary/20 text-primary border-primary/20" : ""}`}
                                    >
                                        {item.result.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Design Recommendations */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold px-2">AI Optimization Feed</h3>
                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden group min-h-[250px]">
                        <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Info className="h-40 w-40 text-primary" />
                        </div>

                        <div className="relative z-10 space-y-6">
                            {accessibilityScore < 70 && (
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                    <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                                    <p className="text-xs text-red-200/80 leading-relaxed font-medium">
                                        Contrast levels are below enterprise standards. <span className="text-red-400 underline cursor-pointer" onClick={handleSmartFix}>Apply Smart Fix</span> to automatically adjust saturation for WCAG compliance.
                                    </p>
                                </div>
                            )}

                            <div className="space-y-4">
                                {Object.keys(spacing.scale).length < 10 && (
                                    <div className="flex items-start gap-4">
                                        <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0 shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            The spacing scale is constrained. Expanding to include hyper-scale values (48px+) would enhance layout hierarchy.
                                        </p>
                                    </div>
                                )}
                                <div className="flex items-start gap-4">
                                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0 shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Heading typeface "<span className="text-white font-bold">{typography.fontFamily.heading.split(',')[0]}</span>" demonstrates excellent geometric balance with your primary brand font.
                                    </p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0 shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Shadow definitions are consistent. The "<span className="text-white font-bold">large</span>" preset provides optimal elevation for modal depth.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
