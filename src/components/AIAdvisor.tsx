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
}

export function AIAdvisor({ designSystem }: { designSystem: GeneratedDesignSystem }) {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

    useEffect(() => {
        if (!designSystem) return;

        const newSuggestions: Suggestion[] = [];

        // 1. Accessibility Checks
        const contrastRatio = getContrastRatio(designSystem.colors.primary, designSystem.colors.background);
        if (contrastRatio < 4.5) {
            newSuggestions.push({
                id: "a11y-primary",
                type: "accessibility",
                message: "Primary color has low contrast on background. Consider using the 'Magic Fix' in the Accessibility tab.",
                severity: "warning"
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
                severity: "warning"
            });
        }

        setSuggestions(newSuggestions);
    }, [designSystem]);

    if (suggestions.length === 0) return null;

    return (
        <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 animate-pulse-soft">
                        <Brain className="h-3 w-3 mr-1" />
                        AI ADVISOR
                    </Badge>
                    <CardTitle className="text-sm font-bold">Smart Insights</CardTitle>
                </div>
                <CardDescription className="text-xs">Real-time design audits for your system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {suggestions.map((suggestion) => (
                    <div
                        key={suggestion.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border text-xs transition-all hover:translate-x-1 ${suggestion.severity === "success"
                                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                                : suggestion.severity === "warning"
                                    ? "bg-amber-500/5 border-amber-500/20 text-amber-700 dark:text-amber-400"
                                    : "bg-blue-500/5 border-blue-500/20 text-blue-700 dark:text-blue-400"
                            }`}
                    >
                        {suggestion.severity === "success" ? (
                            <CheckCircle2 className="h-3.5 w-3.5 mt-0.5" />
                        ) : suggestion.severity === "warning" ? (
                            <AlertCircle className="h-3.5 w-3.5 mt-0.5" />
                        ) : (
                            <Lightbulb className="h-3.5 w-3.5 mt-0.5" />
                        )}
                        <p className="font-medium">{suggestion.message}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
