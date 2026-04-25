import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain, Lightbulb, CheckCircle2, AlertCircle } from "lucide-react";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { getContrastRatio } from "@/lib/colorUtils";

interface Suggestion {
    id: string;
    type: "harmony" | "usability" | "accessibility" | "naming";
    message: string;
    severity: "info" | "warning" | "success";
    fixable?: boolean;
}

interface AIAdvisorProps {
    designSystem: GeneratedDesignSystem;
    onUpdate?: (updated: GeneratedDesignSystem) => void;
}

export function AIAdvisor({ designSystem, onUpdate }: AIAdvisorProps) {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!designSystem) return;

        const newSuggestions: Suggestion[] = [];

        // 1. Accessibility Checks
        const contrastRatio = getContrastRatio(designSystem.colors.primary, designSystem.colors.background);
        if (contrastRatio < 4.5) {
            newSuggestions.push({
                id: "a11y-primary",
                type: "accessibility",
                message: "Primary color has low contrast on background. Use a darker shade for WCAG compliance.",
                severity: "warning",
                fixable: true
            });
        } else {
            newSuggestions.push({
                id: "a11y-success",
                type: "accessibility",
                message: "Great job! Your primary color exceeds WCAG AA standards for accessibility.",
                severity: "success"
            });
        }

        // 2. Harmony Checks (Heuristic based)
        if (designSystem.colors.accent === designSystem.colors.secondary) {
            newSuggestions.push({
                id: "harmony-duplicate",
                type: "harmony",
                message: "Accent and Secondary colors are identical. Try more variety for better visual hierarchy.",
                severity: "info"
            });
        }

        // 3. Spacing Consistency
        if (designSystem.spacing.unit !== 4 && designSystem.spacing.unit !== 8) {
            newSuggestions.push({
                id: "usability-spacing",
                type: "usability",
                message: "Non-standard spacing unit detected. 4px or 8px grids are recommended for modern UI consistency.",
                severity: "warning",
                fixable: true
            });
        }

        setSuggestions(newSuggestions);
    }, [designSystem]);

    if (suggestions.length === 0) return null;

    return (
        <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm overflow-hidden relative rounded-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10" aria-hidden="true">
                <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 animate-pulse-soft px-2 py-0.5 text-[9px] font-bold">
                        <Brain className="h-3 w-3 mr-1" aria-hidden="true" />
                        AI ADVISOR
                    </Badge>
                    <CardTitle className="text-xs font-bold tracking-tight">Smart Insights</CardTitle>
                </div>
                <CardDescription className="text-[10px] font-medium leading-relaxed">System-wide design audits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {suggestions
                    .filter(s => !dismissed.has(s.id))
                    .map((suggestion) => (
                    <div
                        key={suggestion.id}
                        className={`flex flex-col gap-2 p-3 rounded-xl border text-[11px] transition-all hover:translate-x-1 ${suggestion.severity === "success"
                            ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : suggestion.severity === "warning"
                                ? "bg-amber-500/5 border-amber-500/10 text-amber-700 dark:text-amber-400"
                                : "bg-blue-500/5 border-blue-500/10 text-blue-700 dark:text-blue-400"
                            }`}
                        role="alert"
                    >
                        <div className="flex items-start gap-3">
                            {suggestion.severity === "success" ? (
                                <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                            ) : suggestion.severity === "warning" ? (
                                <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                            ) : (
                                <Lightbulb className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                            )}
                            <p className="font-semibold leading-normal flex-1">{suggestion.message}</p>
                            <button 
                                onClick={() => setDismissed(prev => new Set([...prev, suggestion.id]))}
                                className="opacity-40 hover:opacity-100 transition-opacity"
                                aria-label="Dismiss"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                        
                        {suggestion.fixable && onUpdate && (
                            <div className="flex gap-2 pl-6.5">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-6 text-[9px] px-2 rounded-lg bg-background/50 border-primary/20 hover:bg-primary/10"
                                    onClick={() => handleFix(suggestion.id)}
                                >
                                    <Wand2 className="h-2.5 w-2.5 mr-1" />
                                    Magic Fix
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 text-[9px] px-2 rounded-lg"
                                    onClick={() => setDismissed(prev => new Set([...prev, suggestion.id]))}
                                >
                                    Ignore
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );

    function handleFix(id: string) {
        if (!onUpdate) return;
        
        const updated = { ...designSystem };
        
        if (id === "a11y-primary") {
            // Darken primary color slightly for demo
            updated.colors = { ...updated.colors, primary: "#0f172a" };
            toast.success("Primary color contrast improved");
        } else if (id === "usability-spacing") {
            // Standardize spacing to 8px
            updated.spacing = { ...updated.spacing, unit: 8 };
            toast.success("Spacing standardized to 8px grid");
        }
        
        onUpdate(updated);
        setDismissed(prev => new Set([...prev, id]));
    }
}

import { X, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
