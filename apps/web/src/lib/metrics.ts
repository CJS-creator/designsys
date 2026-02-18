import { monitor } from "./monitoring";

export type GenerationSource = "ai" | "pattern" | "hybrid" | "fallback";

export interface AIValueMetric {
    feature: string; // e.g., "layout", "color"
    aiSuggested: boolean;
    userAccepted: boolean;
    patternMatchScore: number; // 0-1, how close was AI to a known pattern?
}

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

/**
 * Track the qualitative value of AI usage.
 * High patternMatchScore means AI is redundant (low value).
 */
export function trackAIValue(metric: AIValueMetric) {
    monitor.trackEvent("ai_value_tracking", {
        feature: metric.feature,
        ai_suggested: metric.aiSuggested,
        user_accepted: metric.userAccepted,
        pattern_match_score: metric.patternMatchScore,
        value_score: metric.aiSuggested && metric.userAccepted ? (1 - metric.patternMatchScore) : 0
    });
}

export interface SkillMetric {
    skillId: string;
    durationMs: number;
    success: boolean;
    cached: boolean;
    error?: string;
}

/**
 * Track skill engine execution metrics
 */
export function trackSkillExecution(metric: SkillMetric) {
    monitor.trackEvent("skill_execution_completed", {
        skill_id: metric.skillId,
        duration_ms: metric.durationMs,
        success: metric.success,
        cached: metric.cached,
        error: metric.error
    });

    if (metric.success) {
        monitor.debug(`[Metrics] Skill ${metric.skillId} ${metric.cached ? '(cached)' : ''} completed in ${metric.durationMs}ms`);
    } else {
        monitor.error(`[Metrics] Skill ${metric.skillId} failed after ${metric.durationMs}ms: ${metric.error}`);
    }
}
