import { useMemo } from "react";
import { ShieldCheck, ShieldAlert, ChevronRight } from "lucide-react";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { getContrastRatio, getWCAGCompliance } from "@/lib/colorUtils";

interface Props {
    designSystem: GeneratedDesignSystem;
    onOpenDetails?: () => void;
}

interface Pair {
    label: string;
    fg: string;
    bg: string;
}

export function AccessibilitySummaryCard({ designSystem, onOpenDetails }: Props) {
    const checks = useMemo(() => {
        const c = designSystem.colors;
        const pairs: Pair[] = [
            { label: "Primary on background", fg: c.primary, bg: c.background },
            { label: "Secondary on background", fg: c.secondary, bg: c.background },
            { label: "Accent on background", fg: c.accent, bg: c.background },
            { label: "Text on background", fg: c.text, bg: c.background },
            { label: "Text on surface", fg: c.text, bg: c.surface },
        ];
        return pairs.map((p) => {
            const ratio = getContrastRatio(p.fg, p.bg);
            const level = getWCAGCompliance(ratio, "normal");
            return { ...p, ratio, level };
        });
    }, [designSystem.colors]);

    const passing = checks.filter((c) => c.level !== "Fail").length;
    const failing = checks.length - passing;
    const score = Math.round((passing / checks.length) * 100);

    const Icon = failing === 0 ? ShieldCheck : ShieldAlert;
    const tone = failing === 0
        ? "text-emerald-600"
        : failing <= 1
            ? "text-amber-600"
            : "text-red-600";

    return (
        <section
            aria-labelledby="a11y-summary-title"
            className="p-6 rounded-2xl border border-border bg-card shadow-sm"
        >
            <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                    <Icon className={`h-4 w-4 ${tone}`} aria-hidden="true" />
                    <h3
                        id="a11y-summary-title"
                        className="text-sm font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                        Accessibility
                    </h3>
                </div>
                <span className={`text-sm font-bold ${tone}`}>{score}%</span>
            </div>

            <p className="text-xs text-muted-foreground mb-3">
                {passing}/{checks.length} contrast checks pass WCAG AA
                {failing > 0 ? ` · ${failing} need attention` : ""}
            </p>

            <ul className="space-y-1.5">
                {checks.map((c) => (
                    <li key={c.label} className="flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="flex gap-0.5 shrink-0">
                                <span className="h-3 w-3 rounded-sm border" style={{ backgroundColor: c.fg }} />
                                <span className="h-3 w-3 rounded-sm border" style={{ backgroundColor: c.bg }} />
                            </span>
                            <span className="truncate text-foreground/80">{c.label}</span>
                        </div>
                        <span
                            className={
                                c.level === "AAA"
                                    ? "text-emerald-600 font-semibold"
                                    : c.level === "AA"
                                        ? "text-amber-600 font-semibold"
                                        : "text-red-600 font-semibold"
                            }
                        >
                            {c.ratio.toFixed(2)} · {c.level}
                        </span>
                    </li>
                ))}
            </ul>

            {onOpenDetails && (
                <button
                    type="button"
                    onClick={onOpenDetails}
                    className="mt-3 w-full text-left text-xs font-semibold text-primary hover:underline flex items-center justify-between"
                >
                    Open full audit
                    <ChevronRight className="h-3.5 w-3.5" />
                </button>
            )}
        </section>
    );
}
