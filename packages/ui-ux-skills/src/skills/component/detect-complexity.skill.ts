import { Skill, SkillCategory, SkillContext, SkillOutputSchema, SkillParameter, ValidationResult, CostEstimate, SkillDependency } from '@designsys/ui-ux-core';

export interface DetectComplexityInput {
    componentCode: string;
}

export class DetectComplexitySkill implements Skill<DetectComplexityInput, any> {
    id = 'component.detect-complexity';
    name = 'Detect Component Complexity';
    category: SkillCategory = 'component';
    version = '1.0.0';
    description = 'Analyzes component code to estimate complexity rating.';

    parameters: SkillParameter[] = [
        { name: 'componentCode', type: 'string', required: true, description: 'Source code of the component' }
    ];

    outputSchema: SkillOutputSchema = {
        type: 'object',
        properties: {
            complexity: { type: 'string', enum: ['low', 'medium', 'high'] },
            score: { type: 'number' },
            reasons: { type: 'array', items: { type: 'string' } }
        }
    };

    dependencies: SkillDependency[] = [];
    requiresAI = false;
    canRunOffline = true;

    validate(input: DetectComplexityInput): ValidationResult {
        if (!input.componentCode) return { valid: false, errors: ['Component code is required'] };
        return { valid: true, errors: [] };
    }

    async execute(input: DetectComplexityInput, _context: SkillContext): Promise<any> {
        const code = input.componentCode;
        const reasons: string[] = [];
        let score = 0;

        // Heuristics
        const lines = code.split('\n').length;
        if (lines > 200) { score += 3; reasons.push('High line count (>200)'); }
        else if (lines > 100) { score += 1; reasons.push('Moderate line count (>100)'); }

        const hooks = (code.match(/use[A-Z]\w+/g) || []).length;
        if (hooks > 5) { score += 3; reasons.push('Many hooks usage (>5)'); }

        const useEffects = (code.match(/useEffect/g) || []).length;
        if (useEffects > 2) { score += 2; reasons.push('Multiple useEffects'); }

        const ternaries = (code.match(/\?/g) || []).length;
        if (ternaries > 10) { score += 2; reasons.push('High cyclomatic complexity (ternaries)'); }

        let complexity = 'low';
        if (score >= 6) complexity = 'high';
        else if (score >= 3) complexity = 'medium';

        return {
            complexity,
            score,
            reasons
        };
    }

    estimateCost(_input: DetectComplexityInput): CostEstimate {
        return { tokens: 0, usd: 0 };
    }
}
