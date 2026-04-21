import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Brain, Lightbulb, CheckCircle2, AlertCircle, Wand2 } from "lucide-react";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { getContrastRatio, fixContrast, parseHslString, hexToHsl, hslToString } from "@/lib/colorUtils";
import { toast } from "sonner";

interface Suggestion {
    id: string;
    type: "harmony" | "usability" | "accessibility" | "naming";
    message: string;
    severity: "info" | "warning" | "success";
    fix?: () => void;
    fixLabel?: string;
}

interface AIAdvisorProps {
    designSystem: GeneratedDesignSystem;
    onUpdate?: (next: GeneratedDesignSystem) => void;
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
                message: `Primary color contrast is ${contrastRatio.toFixed(2)}:1 (needs 4.5:1 for WCAG AA).`,
                severity: "warning",
                fixLabel: "Magic Fix",
                fix: () => {
                    if (!onUpdate) {
                        toast.error("Cannot apply fix in this context");
                        return;
                    }
                    const fixed = fixContrast(
                        designSystem.colors.primary,
                        designSystem.colors.background,
                        "AA",
                        "normal"
                    );
                    const newRatio = getContrastRatio(fixed, designSystem.colors.background);
                    if (newRatio < 4.5) {
                        toast.warning("Could not reach AA — primary nudged as far as possible", {
                            description: `New ratio: ${newRatio.toFixed(2)}:1`,
                        });
                    } else {
                        toast.success(`Primary updated · contrast now ${newRatio.toFixed(2)}:1`);
                    }
                    onUpdate({
                        ...designSystem,
                        colors: { ...designSystem.colors, primary: fixed },
                    });
                },
            });
        } else {
            newSuggestions.push({
                id: "a11y-success",
                type: "accessibility",
                message: `Primary contrast is ${contrastRatio.toFixed(2)}:1 — exceeds WCAG AA. Great work!`,
                severity: "success",
            });
        }

        // 2. Harmony Checks (Heuristic based)
        if (designSystem.colors.accent === designSystem.colors.secondary) {
            newSuggestions.push({
                id: "harmony-duplicate",
                type: "harmony",
                message: "Accent and Secondary colors are identical. Try more variety for better hierarchy.",
                severity: "info",
                fixLabel: "Differentiate",
                fix: () => {
                    if (!onUpdate) return;
                    const base = designSystem.colors.accent;
                    let hsl = parseHslString(base);
                    if (!hsl && base.startsWith("#")) hsl = hexToHsl(base);
                    if (!hsl) return;
                    const shifted = hslToString((hsl.h + 30) % 360, hsl.s, hsl.l);
                    onUpdate({
                        ...designSystem,
                        colors: { ...designSystem.colors, accent: shifted },
                    });
                    toast.success("Accent shifted 30° for better contrast with secondary");
                },
            });
        }

        // 3. Spacing Consistency
        if (designSystem.spacing.unit !== 4 && designSystem.spacing.unit !== 8) {
            newSuggestions.push({
                id: "usability-spacing",
                type: "usability",
                message: `Spacing unit is ${designSystem.spacing.unit}px. 4px or 8px grids are recommended.`,
                severity: "warning",
            });
        }

        setSuggestions(newSuggestions);
    }, [designSystem, onUpdate]);

    const visible = suggestions.filter((s) => !dismissed.has(s.id));
    if (visible.length === 0) return null;

    return (
        <Card className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10" aria-hidden="true">
                <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        <Brain className="h-3 w-3 mr-1" aria-hidden="true" />
                        AI Advisor
                    </Badge>
                    <CardTitle className="text-sm font-semibold">Smart Insights</CardTitle>
                </div>
                <CardDescription className="text-xs">Real-time design audits for your system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {visible.map((suggestion) => (
                    <div
                        key={suggestion.id}
                        className={`flex items-start gap-3 p-2.5 rounded-lg border text-xs transition-all ${suggestion.severity === "success"
                            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                            : suggestion.severity === "warning"
                                ? "bg-amber-500/5 border-amber-500/20 text-amber-700 dark:text-amber-400"
                                : "bg-blue-500/5 border-blue-500/20 text-blue-700 dark:text-blue-400"
                            }`}
                    >
                        {suggestion.severity === "success" ? (
                            <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                        ) : suggestion.severity === "warning" ? (
                            <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                        ) : (
                            <Lightbulb className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                        )}
                        <div className="flex-1 min-w-0 space-y-2">
                            <p className="font-semibold leading-snug">{suggestion.message}</p>
                            {(suggestion.fix || suggestion.severity !== "success") && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    {suggestion.fix && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-6 px-2 text-[11px] font-semibold rounded-md"
                                            onClick={suggestion.fix}
                                        >
                                            <Wand2 className="h-3 w-3 mr-1" aria-hidden="true" />
                                            {suggestion.fixLabel || "Fix"}
                                        </Button>
                                    )}
                                    {suggestion.severity !== "success" && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 px-2 text-[11px] font-medium rounded-md"
                                            onClick={() => setDismissed((prev) => new Set(prev).add(suggestion.id))}
                                            aria-label="Dismiss suggestion"
                                        >
                                            Dismiss
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
