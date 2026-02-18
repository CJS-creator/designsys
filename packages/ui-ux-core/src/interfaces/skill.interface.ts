/**
 * Base interface for all skills
 */
export interface Skill<TInput = unknown, TOutput = unknown> {
    /** Unique skill identifier */
    id: string;

    /** Human-readable name */
    name: string;

    /** Skill category */
    category: SkillCategory;

    /** Version of the skill */
    version: string;

    /** Description of what the skill does */
    description: string;

    /** Parameters this skill accepts */
    parameters: SkillParameter[];

    /** Output schema */
    outputSchema: SkillOutputSchema;

    /** Dependencies on other skills */
    dependencies: SkillDependency[];

    /** Whether this skill requires AI */
    requiresAI: boolean;

    /** Whether this skill can run offline */
    canRunOffline: boolean;

    /** Cache configuration */
    cacheConfig?: SkillCacheConfig;

    /** Validate input parameters */
    validate(input: TInput): ValidationResult;

    /** Execute the skill */
    execute(
        input: TInput,
        context: SkillContext
    ): Promise<TOutput>;

    /** Get estimated cost (for AI-based skills) */
    estimateCost(input: TInput): CostEstimate;
}

/**
 * Skill categories
 */
export type SkillCategory =
    | 'color'
    | 'typography'
    | 'layout'
    | 'style'
    | 'interaction'
    | 'accessibility'
    | 'animation'
    | 'component'
    | 'analysis';

/**
 * Skill parameter definition
 */
export interface SkillParameter {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'array' | 'object';
    required: boolean;
    description: string;
    defaultValue?: unknown;
    validation?: ParameterValidation;
}

export interface ParameterValidation {
    min?: number;
    max?: number;
    options?: any[];
    regex?: string;
    custom?: (value: any) => boolean;
}

/**
 * Skill output schema
 */
/**
 * Skill output schema
 */
export interface SkillOutputSchema {
    type: 'object' | 'array' | 'string' | 'number' | 'boolean';
    properties?: Record<string, SkillOutputSchema>;
    items?: SkillOutputSchema;
    description?: string;
    format?: string;
    enum?: any[];
}

/**
 * Skill dependency definition
 */
export interface SkillDependency {
    skillId: string;
    minVersion: string;
    optional: boolean;
    reason: string;
}

export interface SkillContext {
    executionId?: string;
    timeout?: number;
    logger?: any;
    messageBus?: any;
    [key: string]: any;
}

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

export interface CostEstimate {
    tokens: number;
    usd: number;
}

export interface SkillResult<T = unknown> {
    skillId: string;
    executionId: string;
    status: 'success' | 'error' | 'cancelled';
    output?: T;
    error?: {
        message: string;
        code: string;
        recoverable: boolean;
        details?: unknown;
    };
    duration: number;
    timestamp: Date;
    cached?: boolean;
    metrics?: {
        tokens?: number;
        cost?: number;
    };
}

/**
 * Skill cache configuration
 */
export interface SkillCacheConfig {
    ttlMs: number;
    persist: 'memory' | 'localStorage';
}
