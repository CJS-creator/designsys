import { Pattern, PatternCategory, PatternCriteria, PatternInput, PatternOutput } from '@designsys/ui-ux-core';

export class StylePattern implements Pattern<PatternOutput> {
    id: string;
    name: string;
    category: PatternCategory = 'style';
    tags: string[];
    description: string;
    industries: string[];
    mood: string[];

    // Specific properties for style patterns
    cssKeywords: string[];
    designSystemVariables: Record<string, string>; // name -> default value

    constructor(data: Partial<StylePattern>) {
        this.id = data.id || `style-${Math.random().toString(36).substr(2, 9)}`;
        this.name = data.name || 'Unnamed Style';
        this.tags = data.tags || [];
        this.description = data.description || '';
        this.industries = data.industries || [];
        this.mood = data.mood || [];
        this.cssKeywords = data.cssKeywords || [];
        this.designSystemVariables = data.designSystemVariables || {};
    }

    matches(criteria: PatternCriteria): boolean {
        let score = 0;

        // Industry match
        if (criteria.industry && this.industries.includes(criteria.industry)) {
            score += 10;
        }

        // Mood match
        if (criteria.brandMood && criteria.brandMood.length > 0) {
            const matches = criteria.brandMood.filter(m => this.mood.includes(m));
            score += matches.length * 5;
        }

        // Complexity match (simple check)
        if (criteria.complexity) {
            // Here we theoretically check if the pattern complexity matches
            // For now, assuming match if not explicitly conflicting
        }

        return score > 0;
    }

    generate(input: PatternInput): PatternOutput {
        // Basic generation logic for style pattern
        // In a real implementation, this would use the input to customize the output

        return {
            tokens: [],
            cssVariables: this.designSystemVariables,
            tailwindConfig: {},
            codeSnippets: [],
            checklist: [
                `Apply style: ${this.name}`,
                'Verify contrast ratios',
                'Check responsive behavior'
            ]
        };
    }
}
