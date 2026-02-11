import { monitor } from "./monitoring";

export type GenerationSource = "ai" | "pattern" | "hybrid" | "fallback";

export interface GenerationMetric {
    source: GenerationSource;
    durationMs: number;
    success: boolean;
    error?: string;
    metadata?: Record<string, any>;
}

/**
 * Track design system generation metrics
 */
export function trackGeneration(metric: GenerationMetric) {
    monitor.trackEvent("generation_completed", {
        source: metric.source,
        duration_ms: metric.durationMs,
        success: metric.success,
        error: metric.error,
        ...metric.metadata,
    });

    // Log performance for debugging
    if (metric.success) {
        monitor.info(`[Metrics] Generation (${metric.source}) completed in ${metric.durationMs}ms`, metric as unknown as Record<string, unknown>);
    } else {
        monitor.error(`[Metrics] Generation (${metric.source}) failed in ${metric.durationMs}ms`, undefined, metric as unknown as Record<string, unknown>);
    }
}

/**
 * Track specific AI service usage for cost estimation
 */
export function trackAICost(service: "openai" | "supabase-edge", tokens: number, model: string) {
    // Estimated costs (placeholder rates)
    const costPer1kInput = 0.0015;
    const costPer1kOutput = 0.0020;
    // Simplified estimation assuming 50/50 split for now
    const estimatedCost = (tokens / 1000) * ((costPer1kInput + costPer1kOutput) / 2);

    monitor.trackEvent("ai_cost_tracking", {
        service,
        tokens,
        model,
        estimated_cost_usd: estimatedCost
    });
}
