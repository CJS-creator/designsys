import { GeneratedDesignSystem } from "@/types/designSystem";

export function exportToCSSJS(ds: GeneratedDesignSystem): string {
  return `export const theme = {
  colors: {
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
  },
  typography: {
    fonts: {
      heading: '${ds.typography.fontFamily.heading}',
      body: '${ds.typography.fontFamily.body}',
      mono: '${ds.typography.fontFamily.mono}',
    },
    sizes: {
${Object.entries(ds.typography.sizes).map(([key, val]) => `      ${key}: '${val}',`).join("\n")}
    },
    weights: {
${Object.entries(ds.typography.weights).map(([key, val]) => `      ${key}: ${val},`).join("\n")}
    },
  },
  spacing: {
${Object.entries(ds.spacing.scale).map(([key, val]) => `    ${key}: '${val}',`).join("\n")}
  },
  borderRadius: {
${Object.entries(ds.borderRadius).map(([key, val]) => `    ${key}: '${val}',`).join("\n")}
  },
  shadows: {
${Object.entries(ds.shadows).map(([key, val]) => `    ${key}: '${val}',`).join("\n")}
  }
};

export type Theme = typeof theme;
`;
}
