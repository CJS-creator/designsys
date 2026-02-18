
import { GeneratedDesignSystem, BorderRadius } from "@/types/designSystem";
import { hybridAdapter } from "./hybridAdapter";
import { monitor } from "./monitoring";

// Deterministic Mood Mappings (Tier 1)
const MOOD_PATTERNS: Record<string, Partial<GeneratedDesignSystem>> = {
    "corporate": {
        borderRadius: {
            none: "0px",
            sm: "2px",
            md: "4px",
            lg: "6px",
            xl: "8px",
            "2xl": "12px",
            full: "9999px"
        },
        // We could define more strict type scales or cooler colors here
    },
    "friendly": {
        borderRadius: {
            none: "0px",
            sm: "4px",
            md: "8px",
            lg: "12px",
            xl: "16px",
            "2xl": "24px",
            full: "9999px"
        }
    },
    // ... add more known moods
};

export class MoodTuner {
    /**
     * Modulates an existing design system based on a mood descriptor.
     * Uses deterministic patterns if available, otherwise asks AI (via HybridAdapter).
     */
    async tuneTheme(system: GeneratedDesignSystem, mood: string): Promise<GeneratedDesignSystem> {
        monitor.debug(`Tuning theme for mood: ${mood}`);

        // 1. Check for Deterministic Pattern
        const normalizedMood = mood.toLowerCase();
        if (MOOD_PATTERNS[normalizedMood]) {
            monitor.info(`Applying deterministic pattern for mood: ${mood}`);
            return this.applyPattern(system, MOOD_PATTERNS[normalizedMood]);
        }

        // 2. Fallback to AI (Hybrid)
        // We use hybridAdapter but construct a "partial" input to get adaptations
        monitor.info(`No pattern found for ${mood}, asking AI...`);
        try {
            // We simulate an input for the hybrid adapter
            const aiAdaptation = await hybridAdapter.getAIAdaptation({
                appType: "web", // context doesn't matter much for distinct mood tuning
                industry: "generic",
                brandMood: [mood],
                description: `Tune this design system to be ${mood}`
            });

            if (aiAdaptation) {
                return this.mergeAdaptation(system, aiAdaptation);
            }
        } catch (error) {
            monitor.error("AI Mood Tuning failed", { error });
        }

        return system;
    }

    private applyPattern(system: GeneratedDesignSystem, pattern: Partial<GeneratedDesignSystem>): GeneratedDesignSystem {
        return {
            ...system,
            ...pattern,
            // Deep merge specific sections if needed
            borderRadius: {
                ...system.borderRadius,
                ...(pattern.borderRadius || {})
            }
        };
    }

    private mergeAdaptation(system: GeneratedDesignSystem, adaptation: any): GeneratedDesignSystem {
        // Reuse the logic from hybridAdapter or duplicate for now?
        // Ideally hybridAdapter should expose `mergeSystems` publically or we duplicate/refactor.
        // For now, simpler merge:
        return {
            ...system,
            colors: {
                ...system.colors,
                ...(adaptation.colors || {})
            },
            borderRadius: {
                ...system.borderRadius,
                ...(adaptation.borderRadius || {})
            },
            typography: {
                ...system.typography,
                fontFamily: {
                    ...system.typography.fontFamily,
                    ...(adaptation.typography?.fontFamily || {})
                }
            },
            spacing: {
                ...system.spacing,
                ...(adaptation.spacing || {})
            }
        };
    }
}

export const moodTuner = new MoodTuner();
