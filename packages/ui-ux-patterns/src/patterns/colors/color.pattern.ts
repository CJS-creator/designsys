import { Pattern, PatternCategory, PatternCriteria, PatternInput, PatternOutput } from '@designsys/ui-ux-core';
import { generatePaletteFromMood, generateInteractiveStates, getOnColor, getContainerColor, generateDarkModeColor, generateShades } from './utils';

export class ColorPattern implements Pattern<PatternOutput> {
    id: string;
    name: string;
    category: PatternCategory = 'color';
    tags: string[];
    description: string;
    industries: string[];
    mood: string[];

    // Specific properties
    baseHarmony: "complementary" | "split-complementary" | "triadic" | "analogous" | "monochromatic";

    constructor(data: Partial<ColorPattern>) {
        this.id = data.id || `color-${Math.random().toString(36).substr(2, 9)}`;
        this.name = data.name || 'Unnamed Palette';
        this.tags = data.tags || [];
        this.description = data.description || '';
        this.industries = data.industries || [];
        this.mood = data.mood || [];
        this.baseHarmony = data.baseHarmony || 'monochromatic';
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
        const baseColor = input.baseColor || '#3B82F6'; // Default primary blue
        const mood = (input.mood && ['energetic', 'trust', 'creative', 'calm', 'modern'].includes(input.mood))
            ? input.mood
            : 'modern';

        const palette = generatePaletteFromMood(baseColor, mood);

        const colors = {
            primary: baseColor,
            secondary: palette.secondary,
            accent: palette.accent,
            background: '#ffffff',
            surface: '#f8fafc',
            text: '#0f172a'
        };

        const primaryStates = generateInteractiveStates(baseColor);
        const darkPrimary = generateDarkModeColor(baseColor);

        return {
            tokens: [
                { id: 'color.primary', name: 'Primary', value: baseColor, type: 'color' },
                { id: 'color.secondary', name: 'Secondary', value: palette.secondary, type: 'color' },
                { id: 'color.accent', name: 'Accent', value: palette.accent, type: 'color' }
            ],
            cssVariables: {
                '--color-primary': baseColor,
                '--color-primary-hover': primaryStates.hover,
                '--color-secondary': palette.secondary,
                '--color-accent': palette.accent,
                '--color-background': colors.background,
                '--color-surface': colors.surface,
                '--color-text': colors.text
            },
            shades: {
                primary: generateShades(baseColor),
                secondary: generateShades(palette.secondary),
                accent: generateShades(palette.accent)
            },
            tailwindConfig: {
                theme: {
                    extend: {
                        colors: {
                            primary: 'var(--color-primary)',
                            secondary: 'var(--color-secondary)'
                        }
                    }
                }
            },
            codeSnippets: [],
            checklist: [
                'Check contrast ratios',
                'Verify color blindness accessibility'
            ]
        };
    }
}
