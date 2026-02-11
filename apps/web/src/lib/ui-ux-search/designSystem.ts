/**
 * Design System Generator using UI UX Pro Max Reasoning Engine
 */

import {
    searchStyles,
    searchColors,
    searchTypography,
    searchUXGuidelines,
    searchStackGuidelines
} from './core/bm25';

export interface DesignSystemInput {
    industry: string;
    productType: string;
    brandMood: string[];
    targetStack?: string;
    accessibilityRequirements?: string;
}

export interface StyleRecommendation {
    name: string;
    score: number;
    category: string;
    type: string;
    keywords: string[];
    colors: string[];
    effects: string[];
    bestFor: string[];
    doNotUseFor: string[];
    lightMode: string;
    darkMode: string;
    performance: string;
    accessibility: string;
    mobileFriendly: string;
    conversionFocused: string;
    frameworkCompatibility: string;
    era: string;
    complexity: string;
    aiPromptKeywords: string;
    cssKeywords: string[];
    checklist: string[];
    designSystemVariables: Record<string, string>;
}

export interface ColorPalette {
    productType: string;
    primary: string;
    secondary: string;
    cta: string;
    background: string;
    text: string;
    border: string;
    notes: string;
}

export interface TypographyPairing {
    name: string;
    category: string;
    headingFont: string;
    bodyFont: string;
    mood: string[];
    bestFor: string[];
    googleFontsUrl: string;
    cssImport: string;
    tailwindConfig: string;
    notes: string;
}

export interface UXGuidelines {
    category: string;
    guidelines: string[];
    antiPatterns: string[];
}

export interface StackGuidelines {
    stack: string;
    guidelines: string[];
    examples: string[];
}

export interface DesignSystemRecommendation {
    style: StyleRecommendation;
    colors: ColorPalette;
    typography: TypographyPairing;
    uxGuidelines: UXGuidelines;
    stackGuidelines?: StackGuidelines;
    antiPatterns: string[];
    checklist: string[];
    accessibilityNotes: string[];
}

/**
 * Extract checklist items from style data
 */
function extractChecklist(checklistText: string): string[] {
    return checklistText
        .split(',')
        .map(c => c.trim().replace('☐ ', ''))
        .filter(Boolean);
}

/**
 * Parse CSS keywords into an array
 */
function parseCSSKeywords(cssText: string): string[] {
    return cssText
        .split(',')
        .map(k => k.trim())
        .filter(Boolean);
}

/**
 * Parse design system variables from style data
 */
function parseDesignSystemVariables(varsText: string): Record<string, string> {
    const vars: Record<string, string> = {};
    varsText.split(',').forEach(v => {
        const [key, value] = v.split(':').map(s => s.trim());
        if (key && value) {
            vars[key] = value;
        }
    });
    return vars;
}



/**
 * Generate a complete design system recommendation
 */
export async function generateDesignSystem(
    input: DesignSystemInput
): Promise<DesignSystemRecommendation> {
    const { industry, productType, brandMood, targetStack, accessibilityRequirements } = input;

    // Build search query from input
    const query = `${industry} ${productType} ${brandMood.join(' ')}`;

    // Run parallel searches
    const [styleResults, colorResults, typographyResults, uxResults] = await Promise.all([
        searchStyles(query, 5),
        searchColors(industry, 3),
        searchTypography(brandMood.join(' ') || industry, 3),
        searchUXGuidelines(industry, 5)
    ]);

    const topStyle = styleResults[0];
    const topColor = colorResults[0];
    const topTypography = typographyResults[0];

    // Extract anti-patterns from UX guidelines
    const antiPatterns = uxResults.flatMap(r =>
        (r.row['Anti-Pattern'] || '').split(',').map((a: string) => a.trim())
    ).filter(Boolean);

    // Extract checklist from style
    const checklist = extractChecklist(topStyle?.row['Implementation Checklist'] || '');

    // Extract UX guidelines
    const guidelines = uxResults
        .slice(0, 5)
        .map(r => r.row['Guideline'] || '')
        .filter(Boolean);

    // Search stack guidelines if target stack provided
    let stackGuidelines: StackGuidelines | undefined;
    if (targetStack) {
        const stackResults = await searchStackGuidelines(targetStack, industry, 5);
        stackGuidelines = {
            stack: targetStack,
            guidelines: stackResults.map(r => r.row['Guideline'] || '').filter(Boolean),
            examples: stackResults.map(r => r.row['Example'] || '').filter(Boolean)
        };
    }

    return {
        style: {
            name: topStyle?.row['Style'] || 'Minimalism & Swiss Style',
            score: topStyle?.score || 0,
            category: topStyle?.row['Style Category'] || 'General',
            type: topStyle?.row['Type'] || 'General',
            keywords: (topStyle?.row['Keywords'] || '').split(',').map((k: string) => k.trim()).filter(Boolean),
            colors: (topStyle?.row['Primary Colors'] || '').split(',').map((c: string) => c.trim()),
            effects: (topStyle?.row['Effects & Animation'] || '').split(',').map((e: string) => e.trim()).filter(Boolean),
            bestFor: (topStyle?.row['Best For'] || '').split(',').map((b: string) => b.trim()).filter(Boolean),
            doNotUseFor: (topStyle?.row['Do Not Use For'] || '').split(',').map((d: string) => d.trim()).filter(Boolean),
            lightMode: topStyle?.row['Light Mode'] || '✓ Full',
            darkMode: topStyle?.row['Dark Mode'] || '✓ Full',
            performance: topStyle?.row['Performance'] || '⚡ Excellent',
            accessibility: topStyle?.row['Accessibility'] || '✓ WCAG AA',
            mobileFriendly: topStyle?.row['Mobile-Friendly'] || '✓ High',
            conversionFocused: topStyle?.row['Conversion-Focused'] || '◐ Medium',
            frameworkCompatibility: topStyle?.row['Framework Compatibility'] || 'Tailwind 10/10',
            era: topStyle?.row['Era/Origin'] || '2020s Modern',
            complexity: topStyle?.row['Complexity'] || 'Low',
            aiPromptKeywords: topStyle?.row['AI Prompt Keywords'] || '',
            cssKeywords: parseCSSKeywords(topStyle?.row['CSS/Technical Keywords'] || ''),
            checklist,
            designSystemVariables: parseDesignSystemVariables(topStyle?.row['Design System Variables'] || '')
        },
        colors: {
            productType: topColor?.row['Product Type'] || industry,
            primary: topColor?.row['Primary (Hex)'] || '#2563EB',
            secondary: topColor?.row['Secondary (Hex)'] || '#3B82F6',
            cta: topColor?.row['CTA (Hex)'] || '#F97316',
            background: topColor?.row['Background (Hex)'] || '#F8FAFC',
            text: topColor?.row['Text (Hex)'] || '#1E293B',
            border: topColor?.row['Border (Hex)'] || '#E2E8F0',
            notes: topColor?.row['Notes'] || ''
        },
        typography: {
            name: topTypography?.row['Font Pairing Name'] || 'Modern Professional',
            category: topTypography?.row['Category'] || 'Sans + Sans',
            headingFont: topTypography?.row['Heading Font'] || 'Poppins',
            bodyFont: topTypography?.row['Body Font'] || 'Open Sans',
            mood: (topTypography?.row['Mood/Style Keywords'] || '').split(',').map((m: string) => m.trim()).filter(Boolean),
            bestFor: (topTypography?.row['Best For'] || '').split(',').map((b: string) => b.trim()).filter(Boolean),
            googleFontsUrl: topTypography?.row['Google Fonts URL'] || '',
            cssImport: topTypography?.row['CSS Import'] || '',
            tailwindConfig: topTypography?.row['Tailwind Config'] || '',
            notes: topTypography?.row['Notes'] || ''
        },
        uxGuidelines: {
            category: uxResults[0]?.row['Category'] || industry,
            guidelines,
            antiPatterns: uxResults.slice(0, 3).map(r => r.row['Anti-Pattern'] || '').filter(Boolean)
        },
        stackGuidelines,
        antiPatterns,
        checklist,
        accessibilityNotes: [
            accessibilityRequirements === 'WCAG AAA'
                ? 'Targeting WCAG AAA compliance - highest accessibility standards'
                : accessibilityRequirements === 'WCAG AA'
                    ? 'Targeting WCAG AA compliance - standard accessibility requirements'
                    : 'Consider accessibility requirements for your audience',
            topStyle?.row['Accessibility'] || 'Check contrast ratios manually'
        ]
    };
}

/**
 * Generate CSS variables from recommendation
 */
export function generateCSSVariables(recommendation: DesignSystemRecommendation): string {
    const { style, colors, typography } = recommendation;

    let css = ':root {\n';
    css += '  /* Colors */\n';
    css += `  --color-primary: ${colors.primary};\n`;
    css += `  --color-secondary: ${colors.secondary};\n`;
    css += `  --color-cta: ${colors.cta};\n`;
    css += `  --color-background: ${colors.background};\n`;
    css += `  --color-text: ${colors.text};\n`;
    css += `  --color-border: ${colors.border};\n\n`;

    css += '  /* Typography */\n';
    css += `  --font-heading: '${typography.headingFont}', sans-serif;\n`;
    css += `  --font-body: '${typography.bodyFont}', sans-serif;\n\n`;

    css += '  /* Design Tokens */\n';
    Object.entries(style.designSystemVariables).forEach(([key, value]) => {
        css += `  --${key}: ${value};\n`;
    });

    css += '}\n';

    return css;
}

/**
 * Generate Tailwind config from recommendation
 */
export function generateTailwindConfig(recommendation: DesignSystemRecommendation): string {
    const { colors, typography } = recommendation;

    let config = '// tailwind.config.js\nmodule.exports = {\n';
    config += '  theme: {\n';
    config += '    extend: {\n';
    config += '      colors: {\n';
    config += `        primary: '${colors.primary}',\n`;
    config += `        secondary: '${colors.secondary}',\n`;
    config += `        cta: '${colors.cta}',\n`;
    config += `        background: '${colors.background}',\n`;
    config += `        text: '${colors.text}',\n`;
    config += `        border: '${colors.border}',\n`;
    config += '      },\n';

    config += '      fontFamily: {\n';
    config += `        heading: ['${typography.headingFont}', 'sans-serif'],\n`;
    config += `        body: ['${typography.bodyFont}', 'sans-serif'],\n`;
    config += '      },\n';

    config += '    },\n';
    config += '  },\n';
    config += '};\n';

    return config;
}

/**
 * Generate complete implementation guide
 */
export function generateImplementationGuide(
    recommendation: DesignSystemRecommendation
): string {
    const { style, typography, checklist, accessibilityNotes } = recommendation;

    let guide = `# Implementation Guide: ${style.name}\n\n`;

    guide += `## Overview\n`;
    guide += `Style: **${style.name}** (${style.category})\n`;
    guide += `Complexity: ${style.complexity}\n`;
    guide += `Era: ${style.era}\n\n`;

    guide += `## CSS Implementation\n`;
    guide += '```css\n';
    guide += style.cssKeywords.map(k => k.replace(/[:=]/g, ': ')).join('\n');
    guide += '\n```\n\n';

    guide += `## Typography\n`;
    guide += `Heading: **${typography.headingFont}**\n`;
    guide += `Body: **${typography.bodyFont}**\n\n`;

    if (typography.cssImport) {
        guide += `## Import Fonts\n`;
        guide += '```css\n';
        guide += typography.cssImport;
        guide += '\n```\n\n';
    }

    guide += `## Pre-delivery Checklist\n`;
    checklist.forEach((item, i) => {
        guide += `${i + 1}. [ ] ${item}\n`;
    });

    guide += '\n## Accessibility Notes\n';
    accessibilityNotes.forEach(note => {
        guide += `- ${note}\n`;
    });

    return guide;
}
