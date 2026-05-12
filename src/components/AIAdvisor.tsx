import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Brain, Lightbulb, CheckCircle2, AlertCircle, Wand2, Loader2 } from "lucide-react";
import { GeneratedDesignSystem } from "@/types/designSystem";
import {
    getContrastRatio,
    autoFixContrast,
    parseHslString,
    hexToHsl,
    hslToString,
    pickAccessibleForeground,
    generateInteractiveStates,
} from "@/lib/colorUtils";
import { toast } from "sonner";

interface Suggestion {
    id: string;
    type: "harmony" | "usability" | "accessibility" | "naming";
    message: string;
    severity: "info" | "warning" | "success";
    fix?: () => void | Promise<void>;
    fixLabel?: string;
    autoFix?: () => void | Promise<void>;
    autoFixLabel?: string;
}

interface AIAdvisorProps {
    designSystem: GeneratedDesignSystem;
    onUpdate?: (next: GeneratedDesignSystem) => void;
}

/**
 * After changing a primary color, recompute all derived/related tokens
 * (foreground, interactive states) so the rest of the palette stays
 * accessible & coherent.
 */
function recalcRelatedTokens(ds: GeneratedDesignSystem, newPrimary: string): GeneratedDesignSystem {
    const next: GeneratedDesignSystem = {
        ...ds,
        colors: { ...ds.colors, primary: newPrimary },
    };

    // Foreground on primary
    next.colors.onPrimary = pickAccessibleForeground(newPrimary);

    // Interactive states derived from primary
    next.colors.interactive = {
        ...ds.colors.interactive,
        primary: generateInteractiveStates(newPrimary),
    };

    // Container variants
    let hsl = parseHslString(newPrimary);
    if (!hsl && newPrimary.startsWith("#")) hsl = hexToHsl(newPrimary);
    if (hsl) {
        const { h, s, l } = hsl;
        next.colors.primaryContainer = hslToString(h, Math.max(s - 10, 5), Math.min(l + 35, 92));
        next.colors.onPrimaryContainer = pickAccessibleForeground(next.colors.primaryContainer);
    }

    return next;
}

export function AIAdvisor({ designSystem, onUpdate }: AIAdvisorProps) {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());
    const [autoFixing, setAutoFixing] = useState<string | null>(null);

    useEffect(() => {
        if (!designSystem) return;

        const timer = setTimeout(() => {
            const newSuggestions: Suggestion[] = [];

            // 1. Accessibility — primary contrast
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
                    const result = autoFixContrast(
                        designSystem.colors.primary,
                        designSystem.colors.background,
                        { targetLevel: "AA", textSize: "normal", step: 2, maxLightnessDelta: 30 }
                    );
                    const next = recalcRelatedTokens(designSystem, result.color);
                    onUpdate(next);
                    if (result.passed) {
                        toast.success(`Primary updated · contrast now ${result.ratio.toFixed(2)}:1`, {
                            description: "Foreground & interactive tokens were also recalculated.",
                        });
                    } else {
                        toast.warning("Could not reach AA in one pass", {
                            description: `Try "Auto-fix until AA passes". Current ratio: ${result.ratio.toFixed(2)}:1`,
                        });
                    }
                },
                autoFixLabel: "Auto-fix until AA passes",
                autoFix: async () => {
                    if (!onUpdate) {
                        toast.error("Cannot apply fix in this context");
                        return;
                    }
                    setAutoFixing("a11y-primary");
                    try {
                        const result = autoFixContrast(
                            designSystem.colors.primary,
                            designSystem.colors.background,
                            { targetLevel: "AA", textSize: "normal", step: 1, maxLightnessDelta: 100 }
                        );
                        const next = recalcRelatedTokens(designSystem, result.color);
                        onUpdate(next);
                        if (result.passed) {
                            toast.success(`AA reached after ${result.iterations} steps`, {
                                description: `Final ratio ${result.ratio.toFixed(2)}:1, lightness Δ ${result.deltaL > 0 ? "+" : ""}${result.deltaL}.`,
                            });
                        } else {
                            toast.error("Reached the lightness limit before passing AA", {
                                description: `Best ratio achieved: ${result.ratio.toFixed(2)}:1. Consider changing the hue.`,
                            });
                        }
                    } finally {
                        setAutoFixing(null);
                    }
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

        // 2. Harmony — duplicate accent/secondary
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

        // 3. Spacing consistency
        if (designSystem.spacing.unit !== 4 && designSystem.spacing.unit !== 8) {
            newSuggestions.push({
                id: "usability-spacing",
                type: "usability",
                message: `Spacing unit is ${designSystem.spacing.unit}px. 4px or 8px grids are recommended.`,
                severity: "warning",
            });
        }

            setSuggestions(newSuggestions);
        }, 300);

        return () => clearTimeout(timer);
    }, [designSystem, onUpdate]);

    const visible = suggestions.filter((s) => !dismissed.has(s.id));
    if (visible.length === 0) return null;

    return (
        <Card className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10" aria-hidden="true">
                <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        <Brain className="h-3 w-3 mr-1" aria-hidden="true" />
                        AI Advisor
                    </Badge>
                    <CardTitle className="text-sm font-semibold">Smart Insights</CardTitle>
                </div>
                <CardDescription className="text-[10px] font-medium leading-relaxed">System-wide design audits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {visible.map((suggestion) => {
                    const isAutoFixing = autoFixing === suggestion.id;
                    return (
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
                                {(suggestion.fix || suggestion.autoFix || suggestion.severity !== "success") && (
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {suggestion.fix && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-6 px-2 text-[11px] font-semibold rounded-md"
                                                onClick={suggestion.fix}
                                                disabled={isAutoFixing}
                                            >
                                                <Wand2 className="h-3 w-3 mr-1" aria-hidden="true" />
                                                {suggestion.fixLabel || "Fix"}
                                            </Button>
                                        )}
                                        {suggestion.autoFix && (
                                            <Button
                                                size="sm"
                                                variant="default"
                                                className="h-6 px-2 text-[11px] font-semibold rounded-md"
                                                onClick={suggestion.autoFix}
                                                disabled={isAutoFixing}
                                            >
                                                {isAutoFixing ? (
                                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" aria-hidden="true" />
                                                ) : (
                                                    <Sparkles className="h-3 w-3 mr-1" aria-hidden="true" />
                                                )}
                                                {isAutoFixing ? "Fixing…" : suggestion.autoFixLabel || "Auto-fix"}
                                            </Button>
                                        )}
                                        {suggestion.severity !== "success" && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-6 px-2 text-[11px] font-medium rounded-md"
                                                onClick={() => setDismissed((prev) => new Set(prev).add(suggestion.id))}
                                                aria-label="Dismiss suggestion"
                                                disabled={isAutoFixing}
                                            >
                                                Dismiss
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
