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

    const [showAllIssues, setShowAllIssues] = useState(false);

    if (!report) return null;

    const getScoreColor = (score: number) => {
        if (score >= 90) return "text-emerald-500";
        if (score >= 70) return "text-amber-500";
        return "text-red-500";
    };

    const getLevelIcon = (level: string) => {
        switch (level) {
            case "error": return <AlertTriangle className="h-4 w-4 text-red-500" aria-label="Error" />;
            case "warning": return <AlertTriangle className="h-4 w-4 text-amber-500" aria-label="Warning" />;
            case "info": return <Info className="h-4 w-4 text-blue-500" aria-label="Information" />;
            default: return <CheckCircle className="h-4 w-4 text-emerald-500" aria-label="Success" />;
        }
    };

    const visibleIssues = showAllIssues ? report.issues : report.issues.slice(0, 3);

    return (
        <Card className="overflow-hidden border-2 border-primary/10 shadow-xl shadow-primary/5 rounded-[2rem]">
            <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-center justify-between gap-3">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                            <Activity className="h-5 w-5 text-primary" aria-hidden="true" />
                            Health Score
                        </CardTitle>
                        <CardDescription className="text-[10px] md:text-xs">AI-driven system audit</CardDescription>
                    </div>
                    <div className={cn("text-3xl md:text-4xl font-bold tracking-tighter", getScoreColor(report.score))}>
                        {report.score}%
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                {/* Stats grid that handles narrow containers better */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="p-2 md:p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-center">
                        <div className="text-xl md:text-2xl font-bold text-red-500">{report.summary.errors}</div>
                        <div className="text-[8px] uppercase font-bold text-red-500/60 tracking-widest truncate">Errors</div>
                    </div>
                    <div className="p-2 md:p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-center">
                        <div className="text-xl md:text-2xl font-bold text-amber-500">{report.summary.warnings}</div>
                        <div className="text-[8px] uppercase font-bold text-amber-500/60 tracking-widest truncate">Warns</div>
                    </div>
                    <div className="p-2 md:p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-center">
                        <div className="text-xl md:text-2xl font-bold text-blue-500">{report.summary.infos}</div>
                        <div className="text-[8px] uppercase font-bold text-blue-500/60 tracking-widest truncate">Infos</div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Critical Insights</h4>
                    <div className="space-y-3">
                        {report.issues.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-6 text-center bg-emerald-500/5 rounded-[1.5rem] border border-emerald-500/10">
                                <CheckCircle className="h-8 w-8 text-emerald-500 mb-2" aria-hidden="true" />
                                <p className="text-xs font-bold text-emerald-700">Perfect Score!</p>
                                <p className="text-[10px] text-emerald-600/70">No critical issues found.</p>
                            </div>
                        ) : (
                            visibleIssues.map((issue) => (
                                <motion.div
                                    key={issue.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-3.5 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all flex gap-3 group cursor-default"
                                >
                                    <div className="shrink-0 mt-0.5" aria-hidden="true">
                                        {getLevelIcon(issue.level)}
                                    </div>
                                    <div className="flex-1 space-y-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-xs font-bold leading-none truncate">{issue.message}</p>
                                            <Badge variant="outline" className="text-[8px] uppercase font-bold px-1 py-0 shrink-0">
                                                {issue.category}
                                            </Badge>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground leading-relaxed lg:line-clamp-2">{issue.description}</p>
                                        {issue.recommendation && (
                                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
                                                <Sparkles className="h-3 w-3 text-primary animate-pulse" aria-hidden="true" />
                                                <p className="text-[9px] font-bold text-primary/80 uppercase tracking-wider line-clamp-1">{issue.recommendation}</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {report.issues.length > 3 && (
                    <button 
                        onClick={() => setShowAllIssues(!showAllIssues)}
                        className="w-full mt-6 py-3 rounded-xl border border-dashed border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted/50 transition-all focus:outline-none focus:ring-1 focus:ring-primary/50"
                    >
                        {showAllIssues ? "Show Less" : `View ${report.issues.length - 3} More Issues`}
                    </button>
                )}
            </CardContent>
        </Card>
    );
};
