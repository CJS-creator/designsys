import { DesignSystemInput, GeneratedDesignSystem, TypographyScale, ColorPalette, SpacingScale, BorderRadius, LayoutStrategy } from "@/types/designSystem";
import { generateDesignSystemFallback } from "./generateDesignSystem";
import { aiCircuitBreaker } from "./circuitBreaker";
import { monitor } from "./monitoring";
import { invokeWithRetry } from "./utils";
import { consistencyEngine } from "./consistencyEngine";
import { optimizationEngine } from "./optimizationEngine";
import { aiCache } from "./aiCache";

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
        const config = optimizationEngine.getConfig();
        monitor.debug("Using Optimization Config", { config });

        const foundationPromise = this.getPatternFoundation(input);

        // Skip AI adaptation if optimization says "Use Pattern" for everything relevant
        // For simplicity, we check if AI is allowed at all, or just let metrics drive it.
        // Expanding this: if config.featureFlags.usePatternForColors is true, we might suppress color adaptation request.
        const adaptationPromise = this.getAIAdaptation(input, config);

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
    public async getAIAdaptation(input: DesignSystemInput, config?: any): Promise<AIAdaptation | null> {
        // 1. Check Cache
        const cacheKey = aiCache.generateKey({ type: 'adaptation', input, config });
        const cached = aiCache.get<AIAdaptation>(cacheKey);
        if (cached) {
            return cached;
        }

        try {
            return await aiCircuitBreaker.execute(async () => {
                // Apply Optimization Config: 
                // If usage flags are set to pattern-only, we might skip asking AI for those properties
                // For now, we pass the full request but log the optimization intent
                if (config) {
                    monitor.debug("AI Request optimized with config", { config });
                }

                const { data, error } = await invokeWithRetry("generate-design-adaptation", {
                    body: {
                        description: input.description,
                        brandMood: input.brandMood,
                        config: config
                    }
                });

                if (error || !data) {
                    monitor.warn("AI Adaptation failed or empty", { error });
                    return null;
                }

                if (data.meta) {
                    monitor.info("AI Generation Metadata", { meta: data.meta });
                }

                const result = data.adaptation as AIAdaptation;

                // 2. Save to Cache
                aiCache.set(cacheKey, result);

                return result;
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
        const { issues } = consistencyEngine.validate(system);

        if (issues.length > 0) {
            monitor.info("Consistency Issues Found", { issues });
        }
    }

    /**
     * Determines the optimal layout strategy based on content description.
     * Uses AI to analyze content density and purpose.
     */
    async getLayoutStrategy(contentDescription: string): Promise<LayoutStrategy> {
        try {
            return await aiCircuitBreaker.execute(async () => {
                const { data, error } = await invokeWithRetry("generate-layout-strategy", {
                    body: { description: contentDescription }
                });

                if (error || !data) {
                    monitor.warn("AI Layout Strategy failed, using default", { error });
                    return this.getDefaultLayout();
                }

                return data.layout as LayoutStrategy;
            });
        } catch (error) {
            monitor.warn("AI Layout Strategy Skipped (Circuit Open or Error)", { error });
            return this.getDefaultLayout();
        }
    }

    private getDefaultLayout(): LayoutStrategy {
        return {
            type: "flex", // Safe default
            config: {
                direction: "column",
                gap: 4
            }
        };
    }
}

export const hybridAdapter = new HybridAdapter();
