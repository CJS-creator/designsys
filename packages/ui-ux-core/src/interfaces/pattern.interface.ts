/**
 * Base interface for all UI UX Pro Max patterns
 */
export interface Pattern<T = unknown> {
    /** Unique identifier for the pattern */
    id: string;

    /** Human-readable name */
    name: string;

    /** Pattern category */
    category: PatternCategory;

    /** Tags for searchability */
    tags: string[];

    /** Description of the pattern */
    description: string;

    /** Industries this pattern is suitable for */
    industries: string[];

    /** Mood keywords associated with this pattern */
    mood: string[];

    /** Validate if pattern matches given criteria */
    matches(criteria: PatternCriteria): boolean;

    /** Generate output based on input parameters */
    generate(input: PatternInput): T;

    /** Get rendered component representation (optional as it might be frontend specific) */
    render?(props: PatternProps): any;
}

/**
 * Pattern categories
 */
export type PatternCategory = 'style' | 'color' | 'typography' | 'layout' | 'interaction' | 'component';

/**
 * Pattern input criteria for matching
 */
export interface PatternCriteria {
    industry?: string;
    productType?: string;
    brandMood?: string[];
    targetPlatform?: 'web' | 'mobile' | 'desktop';
    accessibilityLevel?: 'A' | 'AA' | 'AAA';
    complexity?: 'low' | 'medium' | 'high';
}

/**
 * Generic input for pattern generation
 */
export interface PatternInput {
    [key: string]: any;
}

/**
 * Generic props for pattern rendering
 */
export interface PatternProps {
    [key: string]: any;
}

/**
 * Pattern output types
 */
export interface PatternOutput {
    /** Generated tokens */
    tokens: any[]; // refine type later

    /** CSS variables to define */
    cssVariables: Record<string, string>;

    /** Tailwind config additions */
    tailwindConfig: Record<string, unknown>;

    /** Generated color shades */
    shades?: Record<string, any[]>;

    /** Code snippets */
    codeSnippets: CodeSnippet[];

    /** Implementation checklist */
    checklist: string[];
}

/**
 * Code snippet for component implementation
 */
export interface CodeSnippet {
    language: 'tsx' | 'css' | 'scss' | 'tailwind';
    framework: 'react' | 'vue' | 'svelte' | 'vanilla';
    code: string;
}
