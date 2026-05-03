import { GeneratedDesignSystem } from "@/types/designSystem";
import { monitor } from "@/lib/monitoring";

export interface RegressionReport {
    timestamp: string;
    score: number; // 0-100 (100 = identical)
    changes: Array<{
        path: string;
        type: 'color' | 'typography' | 'spacing' | 'other';
        oldValue: any;
        newValue: any;
        severity: 'low' | 'medium' | 'high';
    }>;
}

/**
 * DesignRegressionEngine
 * 
 * Compares two design system states to identify visual shifts.
 * Useful for ensuring AI generations don't accidentally break brand consistency.
 */
export class DesignRegressionEngine {
    static compare(baseline: GeneratedDesignSystem, current: GeneratedDesignSystem): RegressionReport {
        const changes: RegressionReport['changes'] = [];
        let totalChecks = 0;
        let diffs = 0;

        // 1. Compare Colors
        Object.entries(baseline.colors).forEach(([key, baseVal]) => {
            totalChecks++;
            const currentVal = (current.colors as any)[key];
            if (baseVal !== currentVal) {
                diffs++;
                changes.push({
                    path: `colors.${key}`,
                    type: 'color',
                    oldValue: baseVal,
                    newValue: currentVal,
                    severity: key.includes('primary') ? 'high' : 'medium'
                });
            }
        });

        // 2. Compare Typography
        if (baseline.typography.fontFamily.heading !== current.typography.fontFamily.heading) {
            diffs++;
            changes.push({
                path: 'typography.fontFamily.heading',
                type: 'typography',
                oldValue: baseline.typography.fontFamily.heading,
                newValue: current.typography.fontFamily.heading,
                severity: 'high'
            });
        }

        // 3. Compare Spacing
        if (baseline.spacing.unit !== current.spacing.unit) {
            diffs++;
            changes.push({
                path: 'spacing.unit',
                type: 'spacing',
                oldValue: baseline.spacing.unit,
                newValue: current.spacing.unit,
                severity: 'medium'
            });
        }

        const score = totalChecks > 0 ? Math.max(0, 100 - (diffs / totalChecks) * 100) : 100;

        return {
            timestamp: new Date().toISOString(),
            score: Math.round(score),
            changes
        };
    }

    /**
     * Identifies "breaking" visual changes that might require human approval.
     */
    static isBreaking(report: RegressionReport): boolean {
        return report.score < 80 || report.changes.some(c => c.severity === 'high');
    }
}
