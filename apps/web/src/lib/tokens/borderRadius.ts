/**
 * Design System - Border Radius Tokens
 * 
 * This module provides consistent border radius tokens for the design system.
 * All radius values follow a cohesive scale that works across different components.
 */

// Border radius scale
export const borderRadiusScale = {
    /** No radius (0px) */
    none: '0',
    /** Extra small (0.125rem / 2px) */
    xs: '0.125rem',
    /** Small (0.25rem / 4px) */
    sm: '0.25rem',
    /** Default/Medium (0.375rem / 6px) */
    DEFAULT: '0.375rem',
    /** Medium (0.5rem / 8px) */
    md: '0.5rem',
    /** Large (0.75rem / 12px) */
    lg: '0.75rem',
    /** Extra large (1rem / 16px) */
    xl: '1rem',
    /** 2XL (1.25rem / 20px) */
    '2xl': '1.25rem',
    /** 3XL (1.5rem / 24px) */
    '3xl': '1.5rem',
    /** Full/Container (2rem / 32px) */
    full: '2rem',
    /** Pill shape (9999px) */
    pill: '9999px',
    /** Circular (50%) */
    circular: '50%',
} as const;

// Type definition for border radius scale
export type BorderRadiusScale = typeof borderRadiusScale[keyof typeof borderRadiusScale];
export type BorderRadiusToken = keyof typeof borderRadiusScale;

// Component-specific shape mappings
export const componentShapes = {
    button: {
        default: 'md' as BorderRadiusToken,
        sm: 'sm' as BorderRadiusToken,
        lg: 'lg' as BorderRadiusToken,
        icon: 'full' as BorderRadiusToken,
        pill: 'pill' as BorderRadiusToken,
    },
    card: {
        default: 'lg' as BorderRadiusToken,
        elevated: 'xl' as BorderRadiusToken,
        interactive: 'lg' as BorderRadiusToken,
        flat: 'md' as BorderRadiusToken,
    },
    input: {
        default: 'md' as BorderRadiusToken,
        filled: 'md' as BorderRadiusToken,
        outlined: 'md' as BorderRadiusToken,
        ghost: 'sm' as BorderRadiusToken,
    },
    badge: {
        default: 'full' as BorderRadiusToken,
        subtle: 'sm' as BorderRadiusToken,
        interactive: 'md' as BorderRadiusToken,
        button: 'pill' as BorderRadiusToken,
    },
    modal: {
        default: 'xl' as BorderRadiusToken,
        alert: 'lg' as BorderRadiusToken,
        fullscreen: 'none' as BorderRadiusToken,
        dialog: 'lg' as BorderRadiusToken,
    },
    tabs: {
        default: 'md' as BorderRadiusToken,
        pill: 'full' as BorderRadiusToken,
        underlined: 'none' as BorderRadiusToken,
    },
    avatar: {
        default: 'full' as BorderRadiusToken,
        square: 'md' as BorderRadiusToken,
        rounded: 'lg' as BorderRadiusToken,
    },
    tooltip: {
        default: 'md' as BorderRadiusToken,
        arrow: 'sm' as BorderRadiusToken,
    },
    dropdown: {
        default: 'lg' as BorderRadiusToken,
        menu: 'xl' as BorderRadiusToken,
        scroll: 'md' as BorderRadiusToken,
    },
    overlay: {
        default: 'xl' as BorderRadiusToken,
        modal: '2xl' as BorderRadiusToken,
        popover: 'lg' as BorderRadiusToken,
    },
} as const;

// Responsive radius multipliers
export const responsiveRadius = {
    mobile: 0.875,
    tablet: 1,
    desktop: 1.125,
} as const;

// Generate CSS custom properties for border radius
export function generateBorderRadiusCSS(prefix: string = 'radius'): string {
    const lines: string[] = [':root {'];

    Object.entries(borderRadiusScale).forEach(([key, value]) => {
        lines.push(`  --${prefix}-${key}: ${value};`);
    });

    lines.push('}');

    return lines.join('\n');
}

// Get border radius utility classes
export function getBorderRadiusClasses(prefix: string = 'rounded') {
    const classes: Record<string, string> = {};

    Object.entries(borderRadiusScale).forEach(([key, value]) => {
        const className = key === 'DEFAULT' ? prefix : `${prefix}-${key}`;
        classes[key] = `${className}: ${value};`;
    });

    return classes;
}

// Fluid border radius based on viewport
export const fluidBorderRadius = {
    mobile: 'var(--radius-sm)',
    tablet: 'var(--radius-md)',
    desktop: 'var(--radius-lg)',
    largeDesktop: 'var(--radius-xl)',
} as const;

// Animation variants for radius transitions
export const radiusTransitions = {
    fast: 'border-radius 150ms ease-out',
    normal: 'border-radius 200ms ease-out',
    slow: 'border-radius 300ms ease-out',
} as const;

// Theme-specific radius overrides
export const themeRadius = {
    subtle: { default: 'sm', hover: 'md' },
    moderate: { default: 'md', hover: 'lg' },
    pronounced: { default: 'lg', hover: 'xl' },
    extreme: { default: 'xl', hover: '2xl' },
} as const;

// Export as CSS module content
export function generateBorderRadiusModule(prefix: string = 'radius'): string {
    const lines: string[] = [
        '// Auto-generated border radius tokens',
        '// Do not edit manually',
        '',
        `export const ${prefix}Scale = {`,
    ];

    Object.entries(borderRadiusScale).forEach(([key, value]) => {
        const exportKey = key === 'DEFAULT' ? 'DEFAULT' : key;
        lines.push(`  ${exportKey}: '${value}',`);
    });

    lines.push('} as const;');
    lines.push('');
    lines.push(`export type ${prefix.charAt(0).toUpperCase() + prefix.slice(1)}Scale = typeof ${prefix}Scale[keyof typeof ${prefix}Scale];`);
    lines.push('');
    lines.push('export const componentShapes = {');

    Object.entries(componentShapes).forEach(([component, shapes]) => {
        lines.push(`  ${component}: {`);
        Object.entries(shapes).forEach(([shapeKey, shapeValue]) => {
            lines.push(`    ${shapeKey}: '${shapeValue}',`);
        });
        lines.push('  },');
    });

    lines.push('} as const;');

    return lines.join('\n');
}

// Default border radius configuration
export const defaultBorderRadiusConfig = {
    scale: borderRadiusScale,
    componentShapes,
    responsive: responsiveRadius,
    transitions: radiusTransitions,
    themeOverrides: themeRadius,
} as const;

// Component radius getter helper
export function getComponentRadius(
    component: keyof typeof componentShapes,
    variant: string = 'default'
): string {
    const shapes = componentShapes[component];
    if (!shapes) {
        console.warn(`Unknown component: ${component}, using default radius`);
        return borderRadiusScale.md;
    }

    const radius = shapes[variant as keyof typeof shapes];
    return radius ? borderRadiusScale[radius] : borderRadiusScale.md;
}

// Utility to check if radius is valid
export function isValidBorderRadius(value: string): boolean {
    return Object.values(borderRadiusScale).includes(value as BorderRadiusScale);
}

// Convert any value to border radius token if possible
export function toBorderRadiusToken(value: string): BorderRadiusToken | null {
    const entry = Object.entries(borderRadiusScale).find(([, v]) => v === value);
    return entry ? (entry[0] as BorderRadiusToken) : null;
}
