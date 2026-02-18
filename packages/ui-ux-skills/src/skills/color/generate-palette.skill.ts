import { Skill, SkillCategory, SkillContext, SkillOutputSchema, SkillParameter, ValidationResult, CostEstimate, SkillDependency } from '@designsys/ui-ux-core';
import { ColorPattern } from '@designsys/ui-ux-patterns';

export interface GeneratePaletteInput {
    baseColor: string;
    mood?: string;
    industry?: string;
}

export class GeneratePaletteSkill implements Skill<GeneratePaletteInput, any> {
    id = 'color.generate-palette';
    name = 'Generate Color Palette';
    category: SkillCategory = 'color';
    version = '1.0.0';
    description = 'Generates a complete color palette based on a base color and optional mood/industry.';

    parameters: SkillParameter[] = [
        { name: 'baseColor', type: 'string', required: true, description: 'Hex code of the primary color' },
        { name: 'mood', type: 'string', required: false, description: 'Brand mood (e.g., energetic, trust)' },
        { name: 'industry', type: 'string', required: false, description: 'Target industry' }
    ];

    outputSchema: SkillOutputSchema = {
        type: 'object',
        properties: {
            tokens: { type: 'array' },
            cssVariables: { type: 'object' }
        }
    };

    dependencies: SkillDependency[] = [];
    requiresAI = false;
    canRunOffline = true;
    cacheConfig = {
        ttlMs: 1000 * 60 * 60, // 1 hour
        persist: 'localStorage' as const
    };

    validate(input: GeneratePaletteInput): ValidationResult {
        if (!input.baseColor || !/^#[0-9A-F]{6}$/i.test(input.baseColor)) {
            return { valid: false, errors: ['Invalid baseColor. Must be a hex code.'] };
        }
        return { valid: true, errors: [] };
    }

    async execute(input: GeneratePaletteInput, _context: SkillContext): Promise<any> {
        // Leverage the ColorPattern from ui-ux-patterns
        const pattern = new ColorPattern({});

        // Simulate some processing time
        await new Promise(resolve => setTimeout(resolve, 50));

        return pattern.generate({
            baseColor: input.baseColor,
            mood: input.mood,
            industry: input.industry
        });
    }

    estimateCost(_input: GeneratePaletteInput): CostEstimate {
        return { tokens: 0, usd: 0 };
    }
}
