// Font imports for DesignSys
// Using Fontsource for optimal performance and self-hosting

import '@fontsource/inter/400.css'; // Regular
import '@fontsource/inter/500.css'; // Medium
import '@fontsource/inter/600.css'; // Semibold
import '@fontsource/inter/700.css'; // Bold

// CSS custom properties for font families
export const fontFamilies = {
    body: '"Inter", system-ui, -apple-system, sans-serif',
    heading: '"Inter", system-ui, -apple-system, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
} as const;

// Font weights matching design tokens
export const fontWeights = {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
} as const;

// Font sizes matching design tokens
export const fontSizes = {
    caption: '0.75rem',    // 12px
    bodySmall: '0.875rem', // 14px
    body: '1rem',          // 16px
    bodyLarge: '1.125rem', // 18px
    heading3: '1.5rem',    // 24px
    heading2: '1.875rem',  // 30px
    heading1: '2.25rem',   // 36px
    display: '3.5rem',     // 56px
} as const;