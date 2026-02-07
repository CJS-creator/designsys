import React, { useState, useEffect } from "react";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { DesignAuditEngine, AuditReport } from "@/lib/ai/auditEngine";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, CheckCircle, Activity, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DesignHealthScoreProps {
    designSystem: GeneratedDesignSystem;
}

export const DesignHealthScore: React.FC<DesignHealthScoreProps> = ({ designSystem }) => {
    const [report, setReport] = useState<AuditReport | null>(null);

    useEffect(() => {
        const runAudit = async () => {
            const result = await DesignAuditEngine.audit(designSystem);
            setReport(result);
        };
        runAudit();
    }, [designSystem]);

    if (!report) return null;

    const getScoreColor = (score: number) => {
        if (score >= 90) return "text-emerald-500";
        if (score >= 70) return "text-amber-500";
        return "text-red-500";
    };

    const getLevelIcon = (level: string) => {
        switch (level) {
            case "error": return <AlertTriangle className="h-4 w-4 text-red-500" />;
            case "warning": return <AlertTriangle className="h-4 w-4 text-amber-500" />;
            case "info": return <Info className="h-4 w-4 text-blue-500" />;
            default: return <CheckCircle className="h-4 w-4 text-emerald-500" />;
        }
    };

    return (
        <Card className="overflow-hidden border-2 border-primary/10 shadow-xl shadow-primary/5">
            <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Activity className="h-5 w-5 text-primary" />
                            Design Health Score
                        </CardTitle>
                        <CardDescription>AI-driven audit of your design system</CardDescription>
                    </div>
                    <div className={cn("text-4xl font-black tracking-tighter", getScoreColor(report.score))}>
                        {report.score}%
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="flex gap-4 mb-5">
                    <div className="flex-1 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-center">
                        <div className="text-2xl font-black text-red-500">{report.summary.errors}</div>
                        <div className="text-xs uppercase font-black text-red-500/60 tracking-widest">Errors</div>
                    </div>
                    <div className="flex-1 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-center">
                        <div className="text-2xl font-black text-amber-500">{report.summary.warnings}</div>
                        <div className="text-xs uppercase font-black text-amber-500/60 tracking-widest">Warnings</div>
                    </div>
                    <div className="flex-1 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 text-center">
                        <div className="text-2xl font-black text-blue-500">{report.summary.infos}</div>
                        <div className="text-xs uppercase font-black text-blue-500/60 tracking-widest">Insights</div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Urgent Recommendations</h4>
                    <div className="space-y-3">
                        {report.issues.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
                                <CheckCircle className="h-10 w-10 text-emerald-500 mb-2" />
                                <p className="text-sm font-bold text-emerald-700">Perfect Score!</p>
                                <p className="text-xs text-emerald-600/70">No critical issues found.</p>
                            </div>
                        ) : (
                            report.issues.slice(0, 4).map((issue) => (
                                <motion.div
                                    key={issue.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all flex gap-4 group cursor-default"
                                >
                                    <div className="shrink-0 mt-0.5">
                                        {getLevelIcon(issue.level)}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-bold leading-none">{issue.message}</p>
                                            <Badge variant="outline" className="text-[9px] uppercase font-black px-1.5 py-0">
                                                {issue.category}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{issue.description}</p>
                                        {issue.recommendation && (
                                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
                                                <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                                                <p className="text-xs font-bold text-primary/80 uppercase tracking-wider">{issue.recommendation}</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {report.issues.length > 4 && (
                    <button className="w-full mt-6 py-3 rounded-xl border border-dashed border-border text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-muted/50 transition-all">
                        View {report.issues.length - 4} More Issues
                    </button>
                )}
            </CardContent>
        </Card>
    );
};
