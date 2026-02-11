import { DesignSystemInput, GeneratedDesignSystem, TypographyScale, ColorPalette, SpacingScale, BorderRadius } from "@/types/designSystem";
import { generateDesignSystemFallback } from "./generateDesignSystem";
import { aiCircuitBreaker } from "./circuitBreaker";
import { monitor } from "./monitoring";
import { invokeWithRetry } from "./utils";
import { consistencyEngine } from "./consistencyEngine";

interface AIAdaptation {
    typography?: Partial<TypographyScale>;
    colors?: Partial<ColorPalette>;
    spacing?: Partial<SpacingScale>;
    borderRadius?: Partial<BorderRadius>;
}

export class HybridAdapter {
    /**
     * Orchestrates the generation of a Hybrid Design System (Tier 2).
     * Merges deterministic foundation patterns with AI-driven creative adaptations.
     */
    async generate(input: DesignSystemInput): Promise<GeneratedDesignSystem> {
        monitor.debug("Starting Hybrid Generation (Tier 2)", { input });
        const startTime = performance.now();

        // 1. Parallel Execution: Pattern Foundation + AI Adaptation
        const foundationPromise = this.getPatternFoundation(input);
        const adaptationPromise = this.getAIAdaptation(input);

        const [foundation, adaptation] = await Promise.all([
            foundationPromise,
            adaptationPromise
        ]);

        // 2. Synthesis: Overlay AI adaptations onto Foundation
        const hybridSystem = this.mergeSystems(foundation, adaptation);

        // 3. Validation (Placeholder for Consistency Engine)
        this.validateHybridSystem(hybridSystem);

        monitor.info("Hybrid Generation Complete", {
            duration: performance.now() - startTime,
            adaptationApplied: !!adaptation
        });

        return hybridSystem;
    }

    /**
     * Fetches the deterministic "Tier 1" foundation using existing Pattern Engine.
     */
    private async getPatternFoundation(input: DesignSystemInput): Promise<GeneratedDesignSystem> {
        return generateDesignSystemFallback(input);
    }

    /**
     * Requests *only* creative adaptations from AI, keeping cost/latency low.
     * Uses Circuit Breaker to fail gracefully to empty adaptation.
     */
    private async getAIAdaptation(input: DesignSystemInput): Promise<AIAdaptation | null> {
        try {
            return await aiCircuitBreaker.execute(async () => {
                const { data, error } = await invokeWithRetry("generate-design-adaptation", {
                    body: {
                        description: input.description,
                        brandMood: input.brandMood,
                        // tailored prompt to ask for specific tweaks only
                    }
                });

                if (error || !data) {
                    monitor.warn("AI Adaptation failed or empty", { error });
                    return null;
                }

                return data.adaptation as AIAdaptation;
            });
        } catch (error) {
            monitor.warn("AI Adaptation Skipped (Circuit Open or Error)", { error });
            return null;
        }
    }

    /**
     * Merges the Pattern Foundation with AI Adaptations.
     */
    private mergeSystems(foundation: GeneratedDesignSystem, adaptation: AIAdaptation | null): GeneratedDesignSystem {
        if (!adaptation) return foundation;

        return {
            ...foundation,
            colors: {
                ...foundation.colors,
                ...(adaptation.colors || {}),
            },
            typography: {
                ...foundation.typography,
                fontFamily: {
                    ...foundation.typography.fontFamily,
                    ...(adaptation.typography?.fontFamily || {})
                }
            },
            spacing: {
                ...foundation.spacing,
                ...(adaptation.spacing || {})
            },
            borderRadius: {
                ...foundation.borderRadius,
                ...(adaptation.borderRadius || {})
            }
        };
    }

    private validateHybridSystem(system: GeneratedDesignSystem) {
        const { isValid, issues, fixedSystem } = consistencyEngine.validate(system);

        if (issues.length > 0) {
            monitor.info("Consistency Issues Found", { issues });
        }
    }
}

export const hybridAdapter = new HybridAdapter();
