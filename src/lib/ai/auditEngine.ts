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

        // 3. Completeness Checks
        this.checkCompletenessIssues(ds, issues);

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

        // Check Primary on Background
        this.validateContrast(colors.primary, background, "Primary", "Background", "accessibility", issues);

        // Check Text on Surface
        this.validateContrast(colors.text, colors.surface, "Text", "Surface", "accessibility", issues);

        // Check Secondary on Background if exists
        if (colors.secondary) {
            this.validateContrast(colors.secondary, background, "Secondary", "Background", "accessibility", issues);
        }

        // Check Accent on Background
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
                    description: `The contrast ratio is ${ratio.toFixed(2)}:1, which is below the WCAG minimum of 4.5:1 for normal text or 3:1 for large text.`,
                    recommendation: `Adjust the ${fgName} color to be darker or ${bgName} to be lighter to improve readability.`,
                    tokenPath: `colors.${fgName.toLowerCase()}`,
                    impact: 90
                });
            } else if (ratio < 4.5) {
                issues.push({
                    id: `contrast-${fgName.toLowerCase()}-warn`,
                    category,
                    level: "warning",
                    message: `Low contrast: ${fgName} on ${bgName}`,
                    description: `The contrast ratio is ${ratio.toFixed(2)}:1. While acceptable for large text (AA), it fails for normal body text.`,
                    recommendation: `Aim for a ratio of at least 4.5:1 for optimal accessibility.`,
                    tokenPath: `colors.${fgName.toLowerCase()}`,
                    impact: 40
                });
            }
        } catch (e) {
            monitor.error("Failed to calculate contrast", e as Error);
        }
    }

    private static checkConsistencyIssues(ds: GeneratedDesignSystem, issues: AuditIssue[]) {
        // Check for too many font sizes
        if (Object.keys(ds.typography.sizes).length > 10) {
            issues.push({
                id: "consistency-font-sizes",
                category: "consistency",
                level: "warning",
                message: "High font-size complexity",
                description: `Your system defines ${Object.keys(ds.typography.sizes).length} different font sizes. Over-diversifying typography can lead to visual clutter.`,
                recommendation: "Limit font sizes to a 5-8 step scale for better rhythm.",
                impact: 30
            });
        }

        // Check for shadow naming consistency
        const shadows = Object.keys(ds.shadows);
        if (shadows.length > 0 && !shadows.includes("md")) {
            issues.push({
                id: "consistency-shadow-naming",
                category: "consistency",
                level: "info",
                message: "Non-standard shadow scale",
                description: "Your shadow system is missing the standard 'md' base. Using predictable scales (sm, md, lg) helps developer adoption.",
                recommendation: "Normalize shadow names to follow standard naming conventions.",
                impact: 10
            });
        }
    }

    private static checkCompletenessIssues(ds: GeneratedDesignSystem, issues: AuditIssue[]) {
        // Check for missing secondary colors (common in generators)
        if (!ds.colors.secondary) {
            issues.push({
                id: "completeness-secondary",
                category: "completeness",
                level: "info",
                message: "Missing secondary color palette",
                description: "A secondary color helps guide user attention and prevents primary color overuse.",
                recommendation: "Generate a secondary harmony that complements your primary color.",
                impact: 20
            });
        }

        // Check for border radius consistency
        if (Object.keys(ds.borderRadius).length === 0) {
            issues.push({
                id: "completeness-radius",
                category: "completeness",
                level: "error",
                message: "No border-radius scale defined",
                description: "Interactive elements need consistent rounding to look professional.",
                recommendation: "Define at least sm, md, and lg border radius tokens.",
                impact: 60
            });
        }
    }

    private static calculateScore(issues: AuditIssue[]): number {
        const totalImpact = issues.reduce((acc, issue) => {
            const multiplier = issue.level === "error" ? 1.0 : issue.level === "warning" ? 0.5 : 0.2;
            return acc + (issue.impact * multiplier);
        }, 0);

        // Max impact is arbitrary, let's say 200 is 0 score
        const score = Math.max(0, 100 - (totalImpact / 2));
        return Math.round(score);
    }
}
