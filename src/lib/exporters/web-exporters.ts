import { GeneratedDesignSystem } from "@/types/designSystem";
import { DesignToken } from "@/types/tokens";

export function generateCSSVariables(ds: GeneratedDesignSystem): string {
    const animationVars = ds.animations ? `
  /* Animation Durations */
${Object.entries(ds.animations.duration || {})
            .map(([key, value]) => `  --duration-${key}: ${value};`)
            .join("\n")}

  /* Animation Easings */
${Object.entries(ds.animations.easing || {})
            .map(([key, value]) => `  --easing-${key}: ${value};`)
            .join("\n")}

  /* Animation Transitions */
${Object.entries(ds.animations.transitions || {})
            .map(([key, value]) => `  --transition-${key}: ${value};`)
            .join("\n")}` : "";

    return `:root {
  /* Colors */
  --color-primary: ${ds.colors.primary};
  --color-secondary: ${ds.colors.secondary};
  --color-accent: ${ds.colors.accent};
  --color-background: ${ds.colors.background};
  --color-surface: ${ds.colors.surface};
  --color-text: ${ds.colors.text};
  --color-text-secondary: ${ds.colors.textSecondary};
  --color-success: ${ds.colors.success};
  --color-warning: ${ds.colors.warning};
  --color-error: ${ds.colors.error};

  /* Typography */
  --font-heading: '${ds.typography.fontFamily.heading}', sans-serif;
  --font-body: '${ds.typography.fontFamily.body}', sans-serif;
  --font-mono: '${ds.typography.fontFamily.mono}', monospace;
  
  /* Font Sizes */
${Object.entries(ds.typography.sizes)
            .map(([key, value]) => `  --text-${key}: ${value};`)
            .join("\n")}

  /* Spacing */
${Object.entries(ds.spacing.scale)
            .map(([key, value]) => `  --spacing-${key}: ${value};`)
            .join("\n")}

  /* Shadows */
${Object.entries(ds.shadows)
            .map(([key, value]) => `  --shadow-${key}: ${value};`)
            .join("\n")}

  /* Border Radius */
${Object.entries(ds.borderRadius)
            .map(([key, value]) => `  --radius-${key}: ${value};`)
            .join("\n")}

  /* Grid */
  --grid-columns: ${ds.grid.columns};
  --grid-gutter: ${ds.grid.gutter};
  --grid-margin: ${ds.grid.margin};
  --grid-max-width: ${ds.grid.maxWidth};
${animationVars}
}`;
}

export function generateTailwindConfig(ds: GeneratedDesignSystem): string {
    const animationConfig = ds.animations ? `
      transitionDuration: {
${Object.entries(ds.animations.duration || {})
            .map(([key, value]) => `        '${key}': '${value}',`)
            .join("\n")}
      },
      transitionTimingFunction: {
${Object.entries(ds.animations.easing || {})
            .map(([key, value]) => `        '${key}': '${value}',`)
            .join("\n")}
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(10px)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fadeIn var(--duration-normal, 0.3s) var(--easing-easeOut, ease-out)',
        'fade-out': 'fadeOut var(--duration-normal, 0.3s) var(--easing-easeOut, ease-out)',
        'scale-in': 'scaleIn var(--duration-fast, 0.15s) var(--easing-easeOut, ease-out)',
        'slide-up': 'slideUp var(--duration-normal, 0.3s) var(--easing-easeOut, ease-out)',
      },` : "";

    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '${ds.colors.primary}',
        secondary: '${ds.colors.secondary}',
        accent: '${ds.colors.accent}',
        background: '${ds.colors.background}',
        surface: '${ds.colors.surface}',
        text: '${ds.colors.text}',
        'text-secondary': '${ds.colors.textSecondary}',
        success: '${ds.colors.success}',
        warning: '${ds.colors.warning}',
        error: '${ds.colors.error}',
      },
      fontFamily: {
        heading: ['${ds.typography.fontFamily.heading}', 'sans-serif'],
        body: ['${ds.typography.fontFamily.body}', 'sans-serif'],
        mono: ['${ds.typography.fontFamily.mono}', 'monospace'],
      },
      fontSize: {
${Object.entries(ds.typography.sizes)
            .map(([key, value]) => `        '${key}': '${value}',`)
            .join("\n")}
      },
      spacing: {
${Object.entries(ds.spacing.scale)
            .map(([key, value]) => `        '${key}': '${value}',`)
            .join("\n")}
      },
      boxShadow: {
${Object.entries(ds.shadows)
            .map(([key, value]) => `        '${key}': '${value}',`)
            .join("\n")}
      },
      borderRadius: {
${Object.entries(ds.borderRadius)
            .map(([key, value]) => `        '${key}': '${value}',`)
            .join("\n")}
      },${animationConfig}
    },
  },
}`;
}

export function generateSCSS(ds: GeneratedDesignSystem): string {
    return `// Design System Variables - Generated by DesignForge

// Colors
$color-primary: ${ds.colors.primary};
$color-secondary: ${ds.colors.secondary};
$color-accent: ${ds.colors.accent};
$color-background: ${ds.colors.background};
$color-surface: ${ds.colors.surface};
$color-text: ${ds.colors.text};
$color-text-secondary: ${ds.colors.textSecondary};
$color-success: ${ds.colors.success};
$color-warning: ${ds.colors.warning};
$color-error: ${ds.colors.error};

// Typography
$font-heading: '${ds.typography.fontFamily.heading}', sans-serif;
$font-body: '${ds.typography.fontFamily.body}', sans-serif;
$font-mono: '${ds.typography.fontFamily.mono}', monospace;

// Font Sizes
${Object.entries(ds.typography.sizes)
            .map(([key, value]) => `$text-${key}: ${value};`)
            .join("\n")}

// Font Weights
${Object.entries(ds.typography.weights)
            .map(([key, value]) => `$font-${key}: ${value};`)
            .join("\n")}

// Line Heights
${Object.entries(ds.typography.lineHeights)
            .map(([key, value]) => `$leading-${key}: ${value};`)
            .join("\n")}

// Spacing
${Object.entries(ds.spacing.scale)
            .map(([key, value]) => `$spacing-${key}: ${value};`)
            .join("\n")}

// Shadows
${Object.entries(ds.shadows)
            .map(([key, value]) => `$shadow-${key}: ${value};`)
            .join("\n")}

// Border Radius
${Object.entries(ds.borderRadius)
            .map(([key, value]) => `$radius-${key}: ${value};`)
            .join("\n")}

// Grid
$grid-columns: ${ds.grid.columns};
$grid-gutter: ${ds.grid.gutter};
$grid-margin: ${ds.grid.margin};
$grid-max-width: ${ds.grid.maxWidth};

// Breakpoints
${Object.entries(ds.grid.breakpoints)
            .map(([key, value]) => `$breakpoint-${key}: ${value};`)
            .join("\n")}

// Color Map (for programmatic access)
$colors: (
  'primary': $color-primary,
  'secondary': $color-secondary,
  'accent': $color-accent,
  'background': $color-background,
  'surface': $color-surface,
  'text': $color-text,
  'text-secondary': $color-text-secondary,
  'success': $color-success,
  'warning': $color-warning,
  'error': $color-error,
);`;
}

export function generateFigmaTokens(ds: GeneratedDesignSystem): string {
    const tokens = {
        color: {
            primary: { value: ds.colors.primary, type: "color" },
            secondary: { value: ds.colors.secondary, type: "color" },
            accent: { value: ds.colors.accent, type: "color" },
            background: { value: ds.colors.background, type: "color" },
            surface: { value: ds.colors.surface, type: "color" },
            text: { value: ds.colors.text, type: "color" },
            textSecondary: { value: ds.colors.textSecondary, type: "color" },
            success: { value: ds.colors.success, type: "color" },
            warning: { value: ds.colors.warning, type: "color" },
            error: { value: ds.colors.error, type: "color" },
        },
        fontFamily: {
            heading: { value: ds.typography.fontFamily.heading, type: "fontFamilies" },
            body: { value: ds.typography.fontFamily.body, type: "fontFamilies" },
            mono: { value: ds.typography.fontFamily.mono, type: "fontFamilies" },
        },
        fontSize: Object.fromEntries(
            Object.entries(ds.typography.sizes).map(([key, value]) => [
                key,
                { value, type: "fontSizes" },
            ])
        ),
        fontWeight: Object.fromEntries(
            Object.entries(ds.typography.weights).map(([key, value]) => [
                key,
                { value: String(value), type: "fontWeights" },
            ])
        ),
        lineHeight: Object.fromEntries(
            Object.entries(ds.typography.lineHeights).map(([key, value]) => [
                key,
                { value, type: "lineHeights" },
            ])
        ),
        spacing: Object.fromEntries(
            Object.entries(ds.spacing.scale).map(([key, value]) => [
                key,
                { value, type: "spacing" },
            ])
        ),
        boxShadow: Object.fromEntries(
            Object.entries(ds.shadows).map(([key, value]) => [
                key,
                { value, type: "boxShadow" },
            ])
        ),
        borderRadius: Object.fromEntries(
            Object.entries(ds.borderRadius).map(([key, value]) => [
                key,
                { value, type: "borderRadius" },
            ])
        ),
    };

    return JSON.stringify(tokens, null, 2);
}

export function generateStyleDictionary(ds: GeneratedDesignSystem): string {
    const tokens = {
        color: {
            primary: { value: ds.colors.primary },
            secondary: { value: ds.colors.secondary },
            accent: { value: ds.colors.accent },
            background: { value: ds.colors.background },
            surface: { value: ds.colors.surface },
            text: {
                primary: { value: ds.colors.text },
                secondary: { value: ds.colors.textSecondary },
            },
            feedback: {
                success: { value: ds.colors.success },
                warning: { value: ds.colors.warning },
                error: { value: ds.colors.error },
            },
        },
        font: {
            family: {
                heading: { value: ds.typography.fontFamily.heading },
                body: { value: ds.typography.fontFamily.body },
                mono: { value: ds.typography.fontFamily.mono },
            },
            size: Object.fromEntries(
                Object.entries(ds.typography.sizes).map(([key, value]) => [
                    key,
                    { value },
                ])
            ),
            weight: Object.fromEntries(
                Object.entries(ds.typography.weights).map(([key, value]) => [
                    key,
                    { value },
                ])
            ),
            lineHeight: Object.fromEntries(
                Object.entries(ds.typography.lineHeights).map(([key, value]) => [
                    key,
                    { value },
                ])
            ),
        },
        spacing: Object.fromEntries(
            Object.entries(ds.spacing.scale).map(([key, value]) => [
                key,
                { value },
            ])
        ),
        shadow: Object.fromEntries(
            Object.entries(ds.shadows).map(([key, value]) => [
                key,
                { value },
            ])
        ),
        borderRadius: Object.fromEntries(
            Object.entries(ds.borderRadius).map(([key, value]) => [
                key,
                { value },
            ])
        ),
        grid: {
            columns: { value: ds.grid.columns },
            gutter: { value: ds.grid.gutter },
            margin: { value: ds.grid.margin },
            maxWidth: { value: ds.grid.maxWidth },
            breakpoints: Object.fromEntries(
                Object.entries(ds.grid.breakpoints).map(([key, value]) => [
                    key,
                    { value },
                ])
            ),
        },
    };

    return JSON.stringify(tokens, null, 2);
}

export function generateReactNative(ds: GeneratedDesignSystem): string {
    return `/**
 * React Native Theme - Generated by DesignForge
 */

export const colors = {
  primary: '${ds.colors.primary}',
  secondary: '${ds.colors.secondary}',
  accent: '${ds.colors.accent}',
  background: '${ds.colors.background}',
  surface: '${ds.colors.surface}',
  text: '${ds.colors.text}',
  textSecondary: '${ds.colors.textSecondary}',
  success: '${ds.colors.success}',
  warning: '${ds.colors.warning}',
  error: '${ds.colors.error}',
};

export const spacing = {
${Object.entries(ds.spacing.scale)
            .map(([key, value]) => `  '${key}': '${value}',`)
            .join("\n")}
};

export const typography = {
  fontFamily: {
    heading: '${ds.typography.fontFamily.heading}',
    body: '${ds.typography.fontFamily.body}',
    mono: '${ds.typography.fontFamily.mono}',
  },
  sizes: {
${Object.entries(ds.typography.sizes)
            .map(([key, value]) => `    '${key}': '${value}',`)
            .join("\n")}
  },
};

export const borderRadius = {
${Object.entries(ds.borderRadius)
            .map(([key, value]) => `  '${key}': '${value}',`)
            .join("\n")}
};

export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
};

export default theme;
`;
}

export function generateStorybook(ds: GeneratedDesignSystem): string {
    return `import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

/**
 * Design System Tokens - Generated by DesignForge
 */
const DesignTokens = () => (
  <div style={{ padding: '2rem', fontFamily: '${ds.typography.fontFamily.body}' }}>
    <h1 style={{ fontFamily: '${ds.typography.fontFamily.heading}', fontSize: '${ds.typography.sizes['3xl']}' }}>
      Design System Tokens
    </h1>
    
    <section style={{ marginTop: '2rem' }}>
      <h2 style={{ fontSize: '${ds.typography.sizes.xl}', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Colors</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        ${Object.entries(ds.colors)
            .map(([name, value]) => {
                const colorValue = typeof value === 'string' ? value : (value as any).active || (value as any).primary?.active;
                return `
        <div key="${name}">
          <div style={{ backgroundColor: '${colorValue}', height: '60px', borderRadius: '${ds.borderRadius.md}', border: '1px solid #ddd' }} />
          <p style={{ fontSize: '12px', marginTop: '4px' }}><strong>${name}</strong></p>
          <p style={{ fontSize: '10px', color: '#666' }}>${colorValue}</p>
        </div>`;
            })
            .join("")}
      </div>
    </section>

    <section style={{ marginTop: '3rem' }}>
      <h2 style={{ fontSize: '${ds.typography.sizes.xl}', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Typography</h2>
      <div style={{ marginTop: '1rem' }}>
        ${Object.entries(ds.typography.sizes)
            .map(([size, value]) => `
        <p style={{ fontSize: '${value}', margin: '1rem 0' }}>The quick brown fox jumps over the lazy dog (${size}: ${value})</p>`).join("")}
      </div>
    </section>
  </div>
);

const meta: Meta<typeof DesignTokens> = {
  title: 'Design System/Tokens',
  component: DesignTokens,
};

export default meta;
type Story = StoryObj<typeof DesignTokens>;

export const Default: Story = {};
`;
}

export function generateTokensReference(ds: GeneratedDesignSystem, _tokens: DesignToken[]): string {
    return `# Design Tokens Reference: ${ds.name}

Generated on ${new Date().toLocaleDateString()}

## 🎨 Color Palette

| Token | Type | Value | Description |
|-------|------|-------|-------------|
${Object.entries(ds.colors).map(([name, val]) => {
        const value = typeof val === 'string' ? val : 'Complex Token';
        return `| **${name}** | Color | \`${value}\` | Base design system color |`;
    }).join("\n")}

## 🔠 Typography

- **Heading Font:** ${ds.typography.fontFamily.heading}
- **Body Font:** ${ds.typography.fontFamily.body}
- **Mono Font:** ${ds.typography.fontFamily.mono}

### Scale
| Name | Value |
|------|-------|
${Object.entries(ds.typography.sizes).map(([name, val]) => `| ${name} | ${val} |`).join("\n")}

## 📏 Spacing
Base unit: \`${ds.spacing.unit}px\`

| Scale | Value |
|-------|-------|
${Object.entries(ds.spacing.scale).map(([name, val]) => `| ${name} | ${val} |`).join("\n")}

## 🪄 Effects
### Border Radius
| Name | Value |
|------|-------|
${Object.entries(ds.borderRadius).map(([name, val]) => `| ${name} | ${val} |`).join("\n")}

### Shadows
| Name | Value |
|------|-------|
${Object.entries(ds.shadows).map(([name, val]) => `| ${name} | ${val} |`).join("\n")}
`;
}

export function generateREADME(ds: GeneratedDesignSystem): string {
    return `# ${ds.name} Design System Assets

This bundle contains all the generated assets for the **${ds.name}** design system.

## 📁 Directory Structure

- \`documentation/\`: PDF/Word specs and human-readable guides.
- \`tokens/\`: Machine-readable tokens in multiple formats (JSON, Style Dictionary, Figma).
- \`web/\`: Ready-to-use styles for web projects (CSS, SCSS, Tailwind).
- \`mobile/\`: Theming files for iOS, Android, Flutter, and React Native.
- \`assets/\`: Visual representations (swatches, palettes).
- \`docs-site/\`: Self-contained static documentation.
- \`storybook/\`: Design token stories for React projects.

## 🚀 Getting Started

1. **Web**: Import \`web/variables.css\` into your project or copy \`web/tailwind.config.js\`.
2. **Design**: Import \`tokens/figma-tokens.json\` into your Figma project via valid plugins.
3. **Mobile**: Use the relevant file in the \`mobile/\` folder for your platform.

Generated by [DesignForge](https://designforge.ai)
`;
}

export function generateBrandGuidelines(ds: GeneratedDesignSystem): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${ds.name} - Brand Guidelines</title>
    <style>
        body { font-family: '${ds.typography.fontFamily.body}', sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 40px; }
        h1, h2, h3 { font-family: '${ds.typography.fontFamily.heading}', sans-serif; color: #111; }
        .swatch-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 20px; margin: 20px 0; }
        .swatch { border-radius: 8px; border: 1px solid #eee; overflow: hidden; }
        .swatch-color { height: 80px; }
        .swatch-info { padding: 10px; font-size: 12px; }
        .token { font-family: '${ds.typography.fontFamily.mono}', monospace; background: #f7f7f7; padding: 2px 4px; border-radius: 4px; }
    </style>
</head>
<body>
    <h1>${ds.name} Brand Guidelines</h1>
    <p>Generated by DesignForge</p>

    <h2>Primary Colors</h2>
    <div class="swatch-grid">
        <div class="swatch">
            <div class="swatch-color" style="background-color: ${ds.colors.primary}"></div>
            <div class="swatch-info">
                <strong>Primary</strong><br>
                <span class="token">${ds.colors.primary}</span>
            </div>
        </div>
        <div class="swatch">
            <div class="swatch-color" style="background-color: ${ds.colors.secondary}"></div>
            <div class="swatch-info">
                <strong>Secondary</strong><br>
                <span class="token">${ds.colors.secondary}</span>
            </div>
        </div>
        <div class="swatch">
            <div class="swatch-color" style="background-color: ${ds.colors.accent}"></div>
            <div class="swatch-info">
                <strong>Accent</strong><br>
                <span class="token">${ds.colors.accent}</span>
            </div>
        </div>
    </div>

    <h2>Typography</h2>
    <div style="font-family: '${ds.typography.fontFamily.heading}'; font-size: ${ds.typography.sizes['4xl']};">Heading Font: ${ds.typography.fontFamily.heading}</div>
    <div style="font-family: '${ds.typography.fontFamily.body}'; font-size: ${ds.typography.sizes.xl}; margin-top: 20px;">Body Font: ${ds.typography.fontFamily.body}</div>
    <p>The quick brown fox jumps over the lazy dog.</p>

    <h2>Spacing Scale</h2>
    <div style="display: flex; gap: 10px; align-items: flex-end;">
        ${Object.entries(ds.spacing.scale).map(([name, val]) => `
            <div style="text-align: center;">
                <div style="background: ${ds.colors.primary}; width: ${val}; height: ${val}; margin: 0 auto 5px;"></div>
                <div style="font-size: 10px;">${name}</div>
            </div>
        `).join('')}
    </div>
</body>
</html>`;
}
