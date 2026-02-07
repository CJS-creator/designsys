/**
 * Design System - Typography Tokens
 * 
 * This module provides comprehensive typography tokens including:
 * - Font families
 * - Font sizes with fluid scaling
 * - Font weights
 * - Line heights
 * - Letter spacing
 * - Text utilities
 */

// Font families
export const fontFamilies = {
    sans: {
        DEFAULT: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        variable: '"InterVariable", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    },
    serif: {
        DEFAULT: '"Playfair Display", Georgia, "Times New Roman", serif',
        variable: '"Playfair DisplayVariable", Georgia, serif',
    },
    mono: {
        DEFAULT: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
        variable: '"JetBrains MonoVariable", monospace',
    },
    display: {
        DEFAULT: '"Cal Sans", "Inter", system-ui, sans-serif',
    },
} as const;

export type FontFamilyToken = keyof typeof fontFamilies;

// Font sizes with fluid typography using clamp()
export const fontSizes = {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
    '9xl': '8rem',
} as const;

// Fluid font sizes using clamp()
export const fluidFontSizes = {
    h1: 'clamp(2rem, 5vw + 1rem, 4.5rem)',
    h2: 'clamp(1.75rem, 4vw + 0.75rem, 3rem)',
    h3: 'clamp(1.5rem, 3vw + 0.5rem, 2.25rem)',
    h4: 'clamp(1.25rem, 2.5vw + 0.25rem, 1.75rem)',
    h5: 'clamp(1.125rem, 2vw + 0.25rem, 1.5rem)',
    h6: 'clamp(1rem, 1.5vw + 0.25rem, 1.25rem)',
    body: 'clamp(0.875rem, 1vw + 0.5rem, 1rem)',
    small: 'clamp(0.75rem, 0.5vw + 0.5rem, 0.875rem)',
    caption: 'clamp(0.625rem, 0.25vw + 0.5rem, 0.75rem)',
} as const;

export type FontSizeToken = keyof typeof fontSizes;

// Font weights
export const fontWeights = {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
} as const;

export type FontWeightToken = keyof typeof fontWeights;

// Line heights
export const lineHeights = {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
} as const;

export type LineHeightToken = keyof typeof lineHeights;

// Letter spacing
export const letterSpacing = {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
} as const;

export type LetterSpacingToken = keyof typeof letterSpacing;

// Typography scale for semantic usage with fontFamily
export const typographyScale = {
    display: {
        fontSize: fluidFontSizes.h1,
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.tighter,
        fontFamily: fontFamilies.display.DEFAULT,
    },
    h1: {
        fontSize: fluidFontSizes.h1,
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.tighter,
        fontFamily: fontFamilies.sans.DEFAULT,
    },
    h2: {
        fontSize: fluidFontSizes.h2,
        fontWeight: fontWeights.semibold,
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.tight,
        fontFamily: fontFamilies.sans.DEFAULT,
    },
    h3: {
        fontSize: fluidFontSizes.h3,
        fontWeight: fontWeights.semibold,
        lineHeight: lineHeights.snug,
        letterSpacing: letterSpacing.normal,
        fontFamily: fontFamilies.sans.DEFAULT,
    },
    h4: {
        fontSize: fluidFontSizes.h4,
        fontWeight: fontWeights.semibold,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.normal,
        fontFamily: fontFamilies.sans.DEFAULT,
    },
    h5: {
        fontSize: fluidFontSizes.h5,
        fontWeight: fontWeights.medium,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.normal,
        fontFamily: fontFamilies.sans.DEFAULT,
    },
    h6: {
        fontSize: fluidFontSizes.h6,
        fontWeight: fontWeights.medium,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.normal,
        fontFamily: fontFamilies.sans.DEFAULT,
    },
    body: {
        fontSize: fluidFontSizes.body,
        fontWeight: fontWeights.normal,
        lineHeight: lineHeights.relaxed,
        letterSpacing: letterSpacing.normal,
        fontFamily: fontFamilies.sans.DEFAULT,
    },
    bodySmall: {
        fontSize: fluidFontSizes.small,
        fontWeight: fontWeights.normal,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.normal,
        fontFamily: fontFamilies.sans.DEFAULT,
    },
    caption: {
        fontSize: fluidFontSizes.caption,
        fontWeight: fontWeights.medium,
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.wide,
        fontFamily: fontFamilies.sans.DEFAULT,
    },
    code: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.medium,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.normal,
        fontFamily: fontFamilies.mono.DEFAULT,
    },
} as const;

export type TypographyScaleToken = keyof typeof typographyScale;

// Text utilities
export const textUtilities = {
    // Truncation
    truncate: 'overflow-hidden text-ellipsis whitespace-nowrap',
    truncate2: 'overflow-hidden text-ellipsis whitespace-nowrap line-clamp-2',
    truncate3: 'overflow-hidden text-ellipsis whitespace-nowrap line-clamp-3',
    truncate4: 'overflow-hidden text-ellipsis whitespace-nowrap line-clamp-4',

    // Alignment
    textLeft: 'text-left',
    textCenter: 'text-center',
    textRight: 'text-right',
    textJustify: 'text-justify',

    // Transformation
    textUppercase: 'uppercase',
    textLowercase: 'lowercase',
    textCapitalize: 'capitalize',
    textNormalCase: 'normal-case',

    // Decoration
    textUnderline: 'underline',
    textNoUnderline: 'no-underline',
    textLineThrough: 'line-through',

    // Styles
    textItalic: 'italic',
    textNotItalic: 'not-italic',
    textBold: 'font-bold',
    textNormal: 'font-normal',
};

// Responsive typography
export const responsiveTypography = {
    mobile: {
        h1: fluidFontSizes.h2,
        h2: fluidFontSizes.h3,
        h3: fluidFontSizes.h4,
        h4: fluidFontSizes.h5,
        h5: fluidFontSizes.h6,
        h6: fontSizes.base,
        body: fontSizes.sm,
    },
    tablet: {
        h1: fluidFontSizes.h1,
        h2: fluidFontSizes.h2,
        h3: fluidFontSizes.h3,
        h4: fluidFontSizes.h4,
        h5: fluidFontSizes.h5,
        h6: fluidFontSizes.h6,
        body: fontSizes.base,
    },
    desktop: {
        h1: fluidFontSizes.h1,
        h2: fluidFontSizes.h2,
        h3: fluidFontSizes.h3,
        h4: fluidFontSizes.h4,
        h5: fluidFontSizes.h5,
        h6: fluidFontSizes.h6,
        body: fontSizes.base,
    },
} as const;

// Generate CSS custom properties for typography
export function generateTypographyCSS(prefix: string = 'font'): string {
    const lines: string[] = [':root {'];

    // Font families
    Object.entries(fontFamilies).forEach(([key, value]) => {
        if (typeof value === 'object') {
            lines.push(`  --${prefix}-family-${key}: ${value.DEFAULT};`);
        }
    });

    // Font sizes
    Object.entries(fontSizes).forEach(([key, value]) => {
        lines.push(`  --${prefix}-size-${key}: ${value};`);
    });

    // Font weights
    Object.entries(fontWeights).forEach(([key, value]) => {
        lines.push(`  --${prefix}-weight-${key}: ${value};`);
    });

    // Line heights
    Object.entries(lineHeights).forEach(([key, value]) => {
        lines.push(`  --${prefix}-leading-${key}: ${value};`);
    });

    // Letter spacing
    Object.entries(letterSpacing).forEach(([key, value]) => {
        lines.push(`  --${prefix}-tracking-${key}: ${value};`);
    });

    lines.push('}');

    return lines.join('\n');
}

// Get typography styles for a semantic token
export function getTypographyStyles(token: TypographyScaleToken) {
    const styles = typographyScale[token];
    if (!styles) {
        console.warn(`Unknown typography token: ${token}`);
        return null;
    }

    return {
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        lineHeight: styles.lineHeight,
        letterSpacing: styles.letterSpacing,
        fontFamily: styles.fontFamily || fontFamilies.sans.DEFAULT,
    };
}

// Typography component props helper
export interface TypographyProps {
    variant?: TypographyScaleToken;
    as?: keyof JSX.IntrinsicElements;
    className?: string;
    children: React.ReactNode;
}

// Utility to combine typography classes
export function combineTypographyClasses(
    variant: TypographyScaleToken,
    additionalClasses?: string
): string {
    const scale = typographyScale[variant];
    if (!scale) return additionalClasses || '';

    const classes = [
        `font-size: ${scale.fontSize}`,
        `font-weight: ${scale.fontWeight}`,
        `line-height: ${scale.lineHeight}`,
        `letter-spacing: ${scale.letterSpacing}`,
    ];

    if (additionalClasses) {
        classes.push(additionalClasses);
    }

    return classes.join('; ');
}

// Export TypeScript definitions
export function generateTypographyModule(): string {
    const lines: string[] = [
        '// Auto-generated typography tokens',
        '// Do not edit manually',
        '',
        'export const fontFamilies = {',
    ];

    Object.entries(fontFamilies).forEach(([key, value]) => {
        if (typeof value === 'object' && 'DEFAULT' in value) {
            lines.push(`  ${key}: {`);
            lines.push(`    DEFAULT: '${value.DEFAULT}',`);
            if ('variable' in value && value.variable) {
                lines.push(`    variable: '${value.variable}',`);
            }
            lines.push('  },');
        }
    });

    lines.push('} as const;');
    lines.push('');
    lines.push('export const fontSizes = {');
    Object.entries(fontSizes).forEach(([key, value]) => {
        lines.push(`  ${key}: '${value}',`);
    });
    lines.push('} as const;');
    lines.push('');
    lines.push('export const fontWeights = {');
    Object.entries(fontWeights).forEach(([key, value]) => {
        lines.push(`  ${key}: ${value},`);
    });
    lines.push('} as const;');
    lines.push('');
    lines.push('export const lineHeights = {');
    Object.entries(lineHeights).forEach(([key, value]) => {
        lines.push(`  ${key}: ${value},`);
    });
    lines.push('} as const;');
    lines.push('');
    lines.push('export const letterSpacing = {');
    Object.entries(letterSpacing).forEach(([key, value]) => {
        lines.push('  ' + key + ": '" + value + "',");
    });
    lines.push('} as const;');
    lines.push('');
    lines.push('export const typographyScale = {');
    Object.entries(typographyScale).forEach(([key, value]) => {
        lines.push(`  ${key}: {`);
        lines.push(`    fontSize: '${value.fontSize}',`);
        lines.push(`    fontWeight: ${value.fontWeight},`);
        lines.push(`    lineHeight: ${value.lineHeight},`);
        lines.push(`    letterSpacing: '${value.letterSpacing}',`);
        lines.push(`    fontFamily: '${value.fontFamily}',`);
        lines.push('  },');
    });
    lines.push('} as const;');

    return lines.join('\n');
}

// Default typography configuration
export const defaultTypographyConfig = {
    families: fontFamilies,
    sizes: fontSizes,
    fluidSizes: fluidFontSizes,
    weights: fontWeights,
    lineHeights,
    letterSpacing,
    scale: typographyScale,
    responsive: responsiveTypography,
    utilities: textUtilities,
} as const;
