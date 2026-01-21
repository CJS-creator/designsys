import { GeneratedDesignSystem } from "@/types/designSystem";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { getContrastRatio, getWCAGCompliance, fixContrast } from "@/lib/colorUtils";
import { DesignAuditEngine, AuditReport } from "@/lib/ai/auditEngine";
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
    CheckCircle2, AlertCircle, Info, Activity, ShieldCheck, Zap, Sparkles,
    Palette, Type, Maximize2
} from "lucide-react";
import { toast } from "sonner";
import { TokenGraph } from "./TokenGraph";

interface DesignInsightsProps {
    designSystem: GeneratedDesignSystem;
    onUpdate: (updatedSystem: GeneratedDesignSystem) => void;
}

export const DesignInsights = ({ designSystem, onUpdate }: DesignInsightsProps) => {
    const { colors, typography, spacing, shadows, borderRadius } = designSystem;
    const [report, setReport] = useState<AuditReport | null>(null);

    useEffect(() => {
        const runAudit = async () => {
            const result = await DesignAuditEngine.audit(designSystem);
            setReport(result);
        };
        runAudit();
    }, [designSystem]);

    if (!report) return null;

    const handleSmartFix = () => {
        const updatedColors = { ...colors };
        let fixed = false;

        // Collect all contrast issues from the report
        const contrastIssues = report.issues.filter(i => i.id.startsWith("contrast-"));

        contrastIssues.forEach(issue => {
            // Mapping from ID to color key
            const colorKeyMap: Record<string, keyof typeof colors> = {
                "contrast-primary": "primary",
                "contrast-primary-warn": "primary",
                "contrast-text": "text",
                "contrast-text-warn": "text",
                "contrast-secondary": "secondary",
                "contrast-secondary-warn": "secondary",
                "contrast-accent": "accent",
                "contrast-accent-warn": "accent",
            };

            const key = colorKeyMap[issue.id];
            if (key && typeof colors[key] === "string") {
                // Determine background based on message/context
                const background = issue.message.includes("on Surface") ? colors.surface : colors.background;
                (updatedColors as any)[key] = fixContrast(colors[key] as string, background, "AA");
                fixed = true;
            }
        });

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
        { label: "Colors", count: Object.keys(colors).length, icon: Palette },
        { label: "Typography", count: Object.keys(typography.sizes).length, icon: Type },
        { label: "Spacing", count: Object.keys(spacing.scale).length, icon: Maximize2 },
        { label: "Effects", count: Object.keys(shadows).length + Object.keys(borderRadius).length, icon: Sparkles },
    ];

    // 3. DNA Data (Simplified visualization of design intent)
    const dnaData = [
        { name: "Brand", value: 40, color: colors.primary },
        { name: "Structure", value: 30, color: colors.secondary || colors.accent },
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
                            <div className="text-4xl font-black tracking-tighter text-white">{report.score}%</div>
                            <span className="text-xs font-bold text-success">Optimized</span>
                        </div>
                        <Progress value={report.score} className="h-1.5 mt-4 bg-white/10" />
                        <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
                            Holistic score based on accessibility, consistency, and completeness.
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
                        {report.issues.some(i => i.category === "accessibility" && i.level === "error") && (
                            <Button
                                variant="default"
                                size="sm"
                                className="h-8 gap-2 bg-primary/20 hover:bg-primary/30 text-primary border-none font-bold text-xs rounded-full px-4"
                                onClick={handleSmartFix}
                            >
                                <Sparkles className="h-3 w-3" />
                                Smart Fix
                            </Button>
                        )}
                    </div>

                    <div className="grid gap-3">
                        {report.issues.filter(i => i.id.startsWith("contrast-")).map((issue, i) => (
                            <div key={i} className="group flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-2">
                                        <div
                                            className="w-8 h-8 rounded-full border border-white/10 z-10"
                                            style={{ backgroundColor: colors[issue.tokenPath?.replace('colors.', '') as keyof typeof colors] as string || colors.primary }}
                                        />
                                        <div
                                            className="w-8 h-8 rounded-full border border-white/10"
                                            style={{ backgroundColor: issue.message.includes("on Surface") ? colors.surface : colors.background }}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{issue.message.split(':')[0]}</p>
                                        <p className="text-[10px] text-white/60">{issue.description.split(',')[0]}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge
                                        variant={issue.level === "error" ? "destructive" : "outline"}
                                        className="rounded-full px-3 py-1 font-bold text-[10px] tracking-widest"
                                    >
                                        {issue.level === "error" ? "FAIL" : "AA"}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                        {report.issues.filter(i => i.id.startsWith("contrast-")).length === 0 && (
                            <div className="p-10 text-center rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                                <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                                <p className="text-sm font-bold text-emerald-600">All tests passed!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Design Recommendations */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold px-2">AI Optimization Feed</h3>
                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden group min-h-[250px]">
                        <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Info className="h-40 w-40 text-primary" />
                        </div>

                        <div className="relative z-10 space-y-4">
                            {report.issues.map((issue, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                                    {issue.level === "error" ? <AlertCircle className="h-4 w-4 text-red-400 mt-1 shrink-0" /> : <Info className="h-4 w-4 text-primary mt-1 shrink-0" />}
                                    <div>
                                        <p className="text-xs font-bold text-white mb-1">{issue.message}</p>
                                        <p className="text-[10px] text-muted-foreground leading-relaxed">{issue.description}</p>
                                        {issue.recommendation && (
                                            <p className="text-[10px] text-primary/80 font-bold mt-2 uppercase tracking-wide">💡 {issue.recommendation}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Visual Token Graph */}
            <div className="space-y-6 pt-10 border-t border-border/50">
                <div className="px-2">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        Semantic Architecture
                    </h3>
                    <p className="text-sm text-muted-foreground">Visual mapping of primitive tokens to semantic layers and component usage.</p>
                </div>
                <TokenGraph designSystem={designSystem} />
            </div>
        </div>
    );
};
