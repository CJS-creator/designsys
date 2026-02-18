import { Skill, SkillCategory, SkillContext, SkillOutputSchema, SkillParameter, ValidationResult, CostEstimate, SkillDependency } from '@designsys/ui-ux-core';
import { BM25 } from '@designsys/ui-ux-patterns';

export interface MatchVibeInput {
    description: string;
    industry?: string;
    limit?: number;
}

export class MatchVibeSkill implements Skill<MatchVibeInput, any> {
    id = 'style.match-vibe';
    name = 'Match Vibe';
    category: SkillCategory = 'style';
    version = '1.0.0';
    description = 'Matches a text description to a design style using BM25 search.';

    parameters: SkillParameter[] = [
        { name: 'description', type: 'string', required: true, description: 'Project or brand description' },
        { name: 'industry', type: 'string', required: false, description: 'Target industry' }
    ];

    outputSchema: SkillOutputSchema = {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                score: { type: 'number' },
                name: { type: 'string' }
            }
        }
    };

    dependencies: SkillDependency[] = [];
    requiresAI = false;
    canRunOffline = true;
    cacheConfig = {
        ttlMs: 1000 * 60 * 30, // 30 minutes
        persist: 'memory' as const
    };

    // Mock data for internal index
    private styles = {
        'minimalist': 'Clean, simple, whitespace, modern, tech, start-up, sans-serif, neutral colors.',
        'brutalist': 'Bold, raw, high contrast, outlines, neo-brutalism, trendy, youthful, loud.',
        'corporate': 'Trust, blue, professional, enterprise, finance, safe, reliable, serif headings.',
        'luxury': 'Elegant, gold, black, serif, high-end, fashion, expensive, exclusive, rich.',
        'playful': 'Fun, colorful, rounded, kids, education, game, bright, illustration, friendly.'
    };

    private searchEngine: BM25;

    constructor() {
        this.searchEngine = new BM25(this.styles);
    }

    validate(input: MatchVibeInput): ValidationResult {
        if (!input.description) return { valid: false, errors: ['Description is required'] };
        return { valid: true, errors: [] };
    }

    async execute(input: MatchVibeInput, _context: SkillContext): Promise<any> {
        const query = `${input.description} ${input.industry || ''}`;
        const results = this.searchEngine.search(query, input.limit || 3);

        // Map IDs back to metadata (in a real app, fetch from DB)
        return results.map(r => ({
            id: r.id,
            score: r.score,
            name: r.id.charAt(0).toUpperCase() + r.id.slice(1) // Simple title case
        }));
    }

    estimateCost(_input: MatchVibeInput): CostEstimate {
        return { tokens: 0, usd: 0 };
    }
}
