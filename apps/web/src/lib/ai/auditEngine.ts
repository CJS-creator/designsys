import { GeneratedDesignSystem } from "@/types/designSystem";
import { getContrastRatio } from "../colorUtils";
import { monitor } from "../monitoring";

export type AuditLevel = "error" | "warning" | "info";

export interface AuditIssue {
    id: string;
    category: "accessibility" | "consistency" | "completeness";
    level: AuditLevel;
    message: string;
    description: string;
    recommendation?: string;
    tokenPath?: string;
    impact: number; // 0-100
}

export interface AuditReport {
    score: number;
    issues: AuditIssue[];
    summary: {
        errors: number;
        warnings: number;
        infos: number;
    };
}

export class DesignAuditEngine {
    static async audit(ds: GeneratedDesignSystem): Promise<AuditReport> {
        const issues: AuditIssue[] = [];

        // 1. Accessibility Checks (Contrast)
        this.checkContrastIssues(ds, issues);

        // 2. Consistency Checks
        this.checkConsistencyIssues(ds, issues);
        this.checkSpacingRhythm(ds, issues);
        this.checkTypographyScale(ds, issues);

        // 3. Completeness Checks
        this.checkCompletenessIssues(ds, issues);
        this.checkColorHarmony(ds, issues);

        const score = this.calculateScore(issues);

        return {
            score,
            issues,
            summary: {
                errors: issues.filter(i => i.level === "error").length,
                warnings: issues.filter(i => i.level === "warning").length,
                infos: issues.filter(i => i.level === "info").length,
            }
        };
    }

    private static checkContrastIssues(ds: GeneratedDesignSystem, issues: AuditIssue[]) {
        const colors = ds.colors;
        const background = colors.background;

        this.validateContrast(colors.primary, background, "Primary", "Background", "accessibility", issues);
        this.validateContrast(colors.text, colors.surface, "Text", "Surface", "accessibility", issues);
        if (colors.secondary) {
            this.validateContrast(colors.secondary, background, "Secondary", "Background", "accessibility", issues);
        }
        this.validateContrast(colors.accent, background, "Accent", "Background", "accessibility", issues);
    }

    private static validateContrast(
        foreground: string,
        background: string,
        fgName: string,
        bgName: string,
        category: "accessibility",
        issues: AuditIssue[]
    ) {
        try {
            const ratio = getContrastRatio(foreground, background);
            if (ratio < 3.0) {
                issues.push({
                    id: `contrast-${fgName.toLowerCase()}`,
                    category,
                    level: "error",
                    message: `Critical contrast issue: ${fgName} on ${bgName}`,
                    description: `Ratio is ${ratio.toFixed(2)}:1. WCAG AA requires 4.5:1.`,
                    recommendation: `Darken ${fgName} or lighten ${bgName}.`,
                    tokenPath: `colors.${fgName.toLowerCase()}`,
                    impact: 90
                });
            } else if (ratio < 4.5) {
                issues.push({
                    id: `contrast-${fgName.toLowerCase()}-warn`,
                    category,
                    level: "warning",
                    message: `Low contrast: ${fgName} on ${bgName}`,
                    description: `Ratio is ${ratio.toFixed(2)}:1. Good for large text, fails normal text.`,
                    recommendation: `Aim for 4.5:1 for better readability.`,
                    tokenPath: `colors.${fgName.toLowerCase()}`,
                    impact: 40
                });
            }
        } catch (e) {
            monitor.error("Failed to calculate contrast", e as Error);
        }
    }

    private static checkConsistencyIssues(ds: GeneratedDesignSystem, issues: AuditIssue[]) {
        // Font complexity
        if (Object.keys(ds.typography.sizes).length > 10) {
            issues.push({
                id: "consistency-font-sizes",
                category: "consistency",
                level: "warning",
                message: "High font-size complexity",
                description: `System defines ${Object.keys(ds.typography.sizes).length} sizes.`,
                recommendation: "Reduce to a 5-8 step scale.",
                impact: 30
            });
        }
        // Shadow complexity
        const shadows = Object.keys(ds.shadows);
        if (shadows.length > 0 && !shadows.includes("md")) {
            issues.push({
                id: "consistency-shadow-naming",
                category: "consistency",
                level: "info",
                message: "Non-standard shadow scale",
                description: "Missing standard 'md' base shadow.",
                recommendation: "Adopt standard naming (sm, md, lg).",
                impact: 10
            });
        }
    }

    private static checkSpacingRhythm(ds: GeneratedDesignSystem, issues: AuditIssue[]) {
        const spacings = Object.values(ds.spacing).map(v => parseInt(v.toString()));
        const is4pxGrid = spacings.every(s => s % 4 === 0);

        if (!is4pxGrid) {
            issues.push({
                id: "consistency-spacing-grid",
                category: "consistency",
                level: "info",
                message: "Off-grid spacing detected",
                description: "Some spacing values do not align with a 4px grid.",
                recommendation: "Align all spacing to multiples of 4px (4, 8, 12...).",
                impact: 15
            });
        }
    }

    private static checkTypographyScale(ds: GeneratedDesignSystem, issues: AuditIssue[]) {
        // Simplified check: see if sizes are roughly growing
        const sizes = Object.values(ds.typography.sizes)
            .map(s => parseFloat(s.toString()))
            .sort((a, b) => a - b);

        // Check for duplicate sizes
        const uniqueSizes = new Set(sizes);
        if (uniqueSizes.size < sizes.length) {
            issues.push({
                id: "consistency-type-dupes",
                category: "consistency",
                level: "warning",
                message: "Duplicate font sizes",
                description: "Multiple tokens share the same font size.",
                recommendation: "Consolidate redundant tokens.",
                impact: 20
            });
        }
    }

    private static checkCompletenessIssues(ds: GeneratedDesignSystem, issues: AuditIssue[]) {
        if (!ds.colors.secondary) {
            issues.push({
                id: "completeness-secondary",
                category: "completeness",
                level: "info",
                message: "Missing secondary color palette",
                description: "Secondary colors add depth to UI.",
                recommendation: "Add a secondary color.",
                impact: 20
            });
        }
        if (Object.keys(ds.borderRadius).length === 0) {
            issues.push({
                id: "completeness-radius",
                category: "completeness",
                level: "error",
                message: "No border-radius scale",
                description: "Essential for modern UI design.",
                recommendation: "Add sm, md, lg radius tokens.",
                impact: 60
            });
        }
    }

    private static checkColorHarmony(ds: GeneratedDesignSystem, issues: AuditIssue[]) {
        // rudimentary check: if primary and accent are too close in hue
        // Note: Real implementation needs hex->hsl conversion. 
        // For now, we simulate this 'intelligence' by assuming if accent == primary it's an issue
        if (ds.colors.primary === ds.colors.accent) {
            issues.push({
                id: "harmony-contrast",
                category: "completeness",
                level: "warning",
                message: "Low color variety",
                description: "Primary and Accent colors are identical.",
                recommendation: "Select a distinct accent color for calls-to-action.",
                impact: 25
            });
        }
    }

    private static calculateScore(issues: AuditIssue[]): number {
        const totalImpact = issues.reduce((acc, issue) => {
            const multiplier = issue.level === "error" ? 1.0 : issue.level === "warning" ? 0.5 : 0.2;
            return acc + (issue.impact * multiplier);
        }, 0);
        return Math.max(0, Math.round(100 - (totalImpact / 2)));
    }
}
