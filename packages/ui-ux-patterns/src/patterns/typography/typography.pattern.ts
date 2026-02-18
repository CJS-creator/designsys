import { Pattern, PatternCategory, PatternCriteria, PatternInput, PatternOutput } from '@designsys/ui-ux-core';

export class TypographyPattern implements Pattern<PatternOutput> {
    id: string;
    name: string;
    category: PatternCategory = 'typography';
    tags: string[];
    description: string;
    industries: string[];
    mood: string[];

    // Specific properties
    headingFont: string;
    bodyFont: string;
    scaleRatio: number;

    constructor(data: Partial<TypographyPattern>) {
        this.id = data.id || `type-${Math.random().toString(36).substr(2, 9)}`;
        this.name = data.name || 'Unnamed Typography';
        this.tags = data.tags || [];
        this.description = data.description || '';
        this.industries = data.industries || [];
        this.mood = data.mood || [];
        this.headingFont = data.headingFont || 'Inter';
        this.bodyFont = data.bodyFont || 'Inter';
        this.scaleRatio = data.scaleRatio || 1.25; // Major Third
    }

    matches(criteria: PatternCriteria): boolean {
        let score = 0;

        if (criteria.brandMood && criteria.brandMood.length > 0) {
            const matches = criteria.brandMood.filter(m => this.mood.includes(m));
            score += matches.length * 5;
        }

        if (criteria.industry && this.industries.includes(criteria.industry)) {
            score += 5;
        }

        return score > 0;
    }

    generate(input: PatternInput): PatternOutput {
        // Basic generation logic
        const scale = this.generateScale(16, this.scaleRatio);

        return {
            tokens: [
                { id: 'font.heading', name: 'Heading Font', value: this.headingFont, type: 'fontFamily' },
                { id: 'font.body', name: 'Body Font', value: this.bodyFont, type: 'fontFamily' },
                ...scale.map((s, i) => ({ id: `font.size.${i}`, name: `Font Size ${i}`, value: `${s}rem`, type: 'fontSize' }))
            ],
            cssVariables: {
                '--font-heading': this.headingFont,
                '--font-body': this.bodyFont,
                // Add scale vars
            },
            tailwindConfig: {
                theme: {
                    fontFamily: {
                        heading: ['var(--font-heading)'],
                        body: ['var(--font-body)']
                    }
                }
            },
            codeSnippets: [],
            checklist: [
                'Import fonts',
                'Verify readability'
            ]
        };
    }

    private generateScale(base: number, ratio: number): number[] {
        const scale = [];
        for (let i = 0; i < 6; i++) {
            scale.push(Math.round(base * Math.pow(ratio, i)) / 16); // rem
        }
        return scale;
    }
}
