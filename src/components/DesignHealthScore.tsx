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
    const [showAll, setShowAll] = useState(false);

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

    const getScoreLabel = (score: number) => {
        if (score >= 90) return "Excellent";
        if (score >= 70) return "Good";
        if (score >= 50) return "Needs work";
        return "Critical";
    };

    const getLevelIcon = (level: string) => {
        switch (level) {
            case "error": return <AlertTriangle className="h-4 w-4 text-red-500" aria-hidden="true" />;
            case "warning": return <AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden="true" />;
            case "info": return <Info className="h-4 w-4 text-blue-500" aria-hidden="true" />;
            default: return <CheckCircle className="h-4 w-4 text-emerald-500" aria-hidden="true" />;
        }
    };

    const visibleIssues = showAll ? report.issues : report.issues.slice(0, 4);

    return (
        <Card className="overflow-hidden rounded-2xl border border-border shadow-sm">
            <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                            <Activity className="h-5 w-5 text-primary" aria-hidden="true" />
                            Health Score
                        </CardTitle>
                        <CardDescription className="text-xs">AI-driven audit of your design system</CardDescription>
                    </div>
                    <div className="text-right shrink-0">
                        <div
                            className={cn("text-3xl font-bold tracking-tight tabular-nums", getScoreColor(report.score))}
                            aria-label={`Health score ${report.score} out of 100, ${getScoreLabel(report.score)}`}
                        >
                            {report.score}%
                        </div>
                        <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                            {getScoreLabel(report.score)}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="grid grid-cols-3 gap-2 mb-5">
                    <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-center">
                        <div className="text-xl font-bold text-red-500 tabular-nums">{report.summary.errors}</div>
                        <div className="text-[10px] uppercase font-semibold text-red-500/70 tracking-wider">Errors</div>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-center">
                        <div className="text-xl font-bold text-amber-500 tabular-nums">{report.summary.warnings}</div>
                        <div className="text-[10px] uppercase font-semibold text-amber-500/70 tracking-wider">Warn</div>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-center">
                        <div className="text-xl font-bold text-blue-500 tabular-nums">{report.summary.infos}</div>
                        <div className="text-[10px] uppercase font-semibold text-blue-500/70 tracking-wider">Info</div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recommendations</h4>
                    <div className="space-y-2">
                        {report.issues.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-6 text-center bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                                <CheckCircle className="h-8 w-8 text-emerald-500 mb-2" aria-hidden="true" />
                                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Perfect score</p>
                                <p className="text-xs text-emerald-600/70">No critical issues found.</p>
                            </div>
                        ) : (
                            visibleIssues.map((issue) => (
                                <motion.div
                                    key={issue.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors flex gap-3"
                                >
                                    <div className="shrink-0 mt-0.5" aria-hidden="true">
                                        {getLevelIcon(issue.level)}
                                    </div>
                                    <div className="flex-1 space-y-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-sm font-semibold leading-tight">{issue.message}</p>
                                            <Badge variant="outline" className="text-[9px] uppercase font-semibold px-1.5 py-0 shrink-0">
                                                {issue.category}
                                            </Badge>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground leading-relaxed lg:line-clamp-2">{issue.description}</p>
                                        {issue.recommendation && (
                                            <div className="flex items-start gap-2 mt-2 pt-2 border-t border-border/50">
                                                <Sparkles className="h-3 w-3 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                                                <p className="text-xs font-medium text-primary/90">{issue.recommendation}</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {report.issues.length > 4 && (
                    <button
                        type="button"
                        onClick={() => setShowAll((v) => !v)}
                        className="w-full mt-4 py-2.5 rounded-xl border border-dashed border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                        aria-expanded={showAll}
                    >
                        {showAll ? "Show less" : `View ${report.issues.length - 4} more issues`}
                    </button>
                )}
            </CardContent>
        </Card>
    );
};
