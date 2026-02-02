import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GeneratedDesignSystem } from "@/types/designSystem";
import {
  Download,
  FileJson,
  FileCode,
  Copy,
  Check,
  Eye,
  Layers,
  Lock,
  User,
  Smartphone,
  Component,
  FileText,
  BookOpen
} from "lucide-react";
import { toast } from "sonner";
import { convertToW3CTokens } from "@/lib/token-utils";
import { exportToFlutter } from "@/lib/exporters/flutter";
import { exportToSwiftUI } from "@/lib/exporters/swiftui";
import { exportToKotlin } from "@/lib/exporters/kotlin";
import { exportToCSSJS } from "@/lib/exporters/css-in-js";
import { exportToFigmaVariables } from "@/lib/exporters/figma-variables";
import { exportToStaticDocs } from "@/lib/exporters/static-docs";
import { generateCLISyncScript } from "@/lib/cli/designforge-cli";
import { exportToVSCodeSnippets } from "@/lib/exporters/vscode-snippets";
import { generateGitHubAction } from "@/lib/exporters/ci-cd-templates";
import { exportToStorybookAdvanced } from "@/lib/exporters/storybook-advanced";
import { trackEvent, AnalyticsEvent } from "@/lib/analytics";
import { useSearchParams } from "react-router-dom";

interface ExportButtonProps {
  designSystem: GeneratedDesignSystem;
}

type ExportFormat = "json" | "css" | "scss" | "tailwind" | "figma" | "style-dictionary" | "react-native" | "storybook" | "styleguide" | "swiftui" | "compose" | "w3c" | "storybook-pro" | "flutter" | "css-in-js" | "figma-variables";

interface ExportOption {
  id: ExportFormat;
  label: string;
  filename: string;
  icon: React.ReactNode;
  generator: (ds: GeneratedDesignSystem) => string;
  description?: string; // Added description as optional
}

function generateCSSVariables(ds: GeneratedDesignSystem): string {
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

function generateTailwindConfig(ds: GeneratedDesignSystem): string {
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

function generateSCSS(ds: GeneratedDesignSystem): string {
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

function generateFigmaTokens(ds: GeneratedDesignSystem): string {
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

function generateStyleDictionary(ds: GeneratedDesignSystem): string {
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

function generateReactNative(ds: GeneratedDesignSystem): string {
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

function generateStorybook(ds: GeneratedDesignSystem): string {
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
        const colorValue = typeof value === 'string' ? value : (value as { active?: string; primary?: { active?: string } }).active || (value as { active?: string; primary?: { active?: string } }).primary?.active;
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

const generateCompose = exportToKotlin;
const generateSwiftUI = exportToSwiftUI;
const generateFlutter = exportToFlutter;

function generateStyleguideMD(ds: GeneratedDesignSystem): string {
  return `# Design System Styleguide: ${ds.name}

Generated by **DesignForge** on ${new Date().toLocaleDateString()}

## 🎨 Color Palette

| Token | Value |
|-------|-------|
${Object.entries(ds.colors).map(([name, val]) => {
    const value = typeof val === 'string' ? val : 'Complex Token';
    return `| **${name}** | \`${value}\` |`;
  }).join("\n")}

## 🔠 Typography

- **Heading Font:** ${ds.typography.fontFamily.heading}
- **Body Font:** ${ds.typography.fontFamily.body}
- **Mono Font:** ${ds.typography.fontFamily.mono}

### Font Sizes
${Object.entries(ds.typography.sizes).map(([name, val]) => `- **${name}**: ${val}`).join("\n")}

## 📏 Spacing & Layout
Scale based on \`${ds.spacing.unit}px\` base unit.

${Object.entries(ds.spacing.scale).map(([name, val]) => `- **${name}**: ${val}`).join("\n")}

## 🪄 Effects
### Border Radius
${Object.entries(ds.borderRadius).map(([name, val]) => `- **${name}**: ${val}`).join("\n")}

### Shadows
${Object.entries(ds.shadows).map(([name, val]) => `- **${name}**: ${val}`).join("\n")}
`;
}

const exportOptions: ExportOption[] = [
  { id: "json", label: "JSON", filename: "design-system.json", icon: <FileJson className="h-4 w-4" />, generator: (ds) => JSON.stringify(ds, null, 2), description: "Raw design system data in JSON format" },
  { id: "css", label: "CSS Variables", filename: "design-system.css", icon: <FileCode className="h-4 w-4" />, generator: generateCSSVariables, description: "CSS custom properties for easy theming" },
  { id: "scss", label: "SCSS", filename: "design-system.scss", icon: <FileCode className="h-4 w-4" />, generator: generateSCSS, description: "SCSS variables for Sass-based projects" },
  { id: "tailwind", label: "Tailwind Config", filename: "tailwind.config.js", icon: <FileCode className="h-4 w-4" />, generator: generateTailwindConfig, description: "Tailwind CSS configuration file" },
  { id: "react-native", label: "React Native", filename: "theme.ts", icon: <Smartphone className="h-4 w-4" />, generator: generateReactNative, description: "StyleSheet tokens for React Native" },
  { id: "swiftui", label: "SwiftUI (iOS)", filename: "Theme.swift", icon: <Smartphone className="h-4 w-4" />, generator: exportToSwiftUI, description: "Advanced Swift extensions for iOS" },
  { id: "compose", label: "Compose (Android)", filename: "Theme.kt", icon: <Smartphone className="h-4 w-4" />, generator: exportToKotlin, description: "Advanced Kotlin Compose definitions" },
  { id: "flutter", label: "Flutter (Dart)", filename: "tokens.dart", icon: <Smartphone className="h-4 w-4" />, generator: exportToFlutter, description: "Complete Flutter theme tokens" },
  { id: "css-in-js", label: "CSS-in-JS", filename: "theme.ts", icon: <FileCode className="h-4 w-4" />, generator: exportToCSSJS, description: "Typed theme for Styled Components/Emotion" },
  { id: "storybook", label: "Storybook", filename: "tokens.stories.tsx", icon: <Component className="h-4 w-4" />, generator: generateStorybook, description: "React stories for documentation" },
  { id: "styleguide", label: "Styleguide MD", filename: "STYLEGUIDE.md", icon: <FileText className="h-4 w-4" />, generator: generateStyleguideMD, description: "Professional documentation in Markdown" },
  { id: "figma", label: "Figma Tokens", filename: "figma-tokens.json", icon: <FileJson className="h-4 w-4" />, generator: generateFigmaTokens, description: "Tokens compatible with Figma plugins" },
  { id: "figma-variables", label: "Figma Variables", filename: "figma-variables.json", icon: <FileJson className="h-4 w-4" />, generator: exportToFigmaVariables, description: "Tokens compatible with Figma Variables REST API" },
  { id: "style-dictionary", label: "Style Dictionary", filename: "tokens.json", icon: <Layers className="h-4 w-4" />, generator: generateStyleDictionary, description: "Tokens for Style Dictionary framework" },
  { id: "styleguide", label: "Static Docs (HTML)", filename: "index.html", icon: <BookOpen className="h-4 w-4" />, generator: exportToStaticDocs, description: "Self-hosted documentation site" },
  { id: "storybook-pro", label: "Storybook Pro", filename: "storybook-theme.js", icon: <BookOpen className="h-4 w-4" />, generator: exportToStorybookAdvanced, description: "Advanced tokens + preview.js config" },
  { id: "styleguide", label: "Static Docs (HTML)", filename: "index.html", icon: <BookOpen className="h-4 w-4" />, generator: exportToStaticDocs, description: "Self-hosted documentation site" },
  { id: "json", label: "VS Code Snippets", filename: "designforge.code-snippets", icon: <FileCode className="h-4 w-4" />, generator: exportToVSCodeSnippets, description: "IntelliSense for design tokens" },
  { id: "tailwind", label: "Sync Script (Node)", filename: "designforge-sync.js", icon: <FileCode className="h-4 w-4" />, generator: generateCLISyncScript, description: "Local sync utility for developers" },
  { id: "w3c", label: "GitHub Action (Sync)", filename: "design-sync.yml", icon: <Layers className="h-4 w-4" />, generator: generateGitHubAction, description: "Automated CI/CD pipeline template" },
  {
    id: "w3c",
    label: "DTCG (W3C Standard)",
    icon: <FileJson className="h-4 w-4" />,
    filename: "tokens.dtcg.json",
    description: "Design Tokens Community Group standard",
    generator: (ds) => JSON.stringify(convertToW3CTokens(ds), null, 2),
  },
];

export function ExportButton({ designSystem }: ExportButtonProps) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFormat, setPreviewFormat] = useState<ExportOption | null>(null);
  const [previewContent, setPreviewContent] = useState("");
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);


  const downloadFile = (content: string, filename: string) => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }
    const [searchParams] = useSearchParams();
    const dsId = searchParams.get("id") || "";
    trackEvent(dsId, `exported_${filename.split('.')[1]}` as AnalyticsEvent, { filename });

    setIsDownloading(true);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
    setIsDownloading(false);
  };

  const copyJSON = () => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }
    navigator.clipboard.writeText(JSON.stringify(designSystem, null, 2));
    const [searchParams] = useSearchParams();
    trackEvent(searchParams.get("id") || "", "exported_json", { method: "copy" });
    setCopied(true);
    toast.success("Copied JSON to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const openPreview = (option: ExportOption) => {
    const content = option.generator(designSystem);
    setPreviewFormat(option);
    setPreviewContent(content);
    setPreviewOpen(true);
  };

  const copyPreviewContent = () => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }
    navigator.clipboard.writeText(previewContent);
    toast.success("Copied to clipboard");
  };

  const handleDownloadFromPreview = () => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }
    if (previewFormat) {
      const blob = new Blob([previewContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = previewFormat.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${previewFormat.filename}`);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="lg" className="gap-2">
            <Download className="h-4 w-4" />
            Export
            {!user && <Lock className="h-3 w-3 ml-1" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {exportOptions.map((option) => (
            <DropdownMenuItem key={option.id} className="flex items-center justify-between">
              <span
                className="flex items-center flex-1 cursor-pointer"
                onClick={() => downloadFile(option.generator(designSystem), option.filename)}
              >
                <span className="mr-2">{option.icon}</span>
                {option.label}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 ml-2"
                aria-label={`Preview ${option.label} format`}
                onClick={(e) => {
                  e.stopPropagation();
                  openPreview(option);
                }}
              >
                <Eye className="h-3 w-3" />
              </Button>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem onClick={copyJSON}>
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            Copy JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="h-5 w-5">{previewFormat?.icon}</span>
              {previewFormat?.label} Preview
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[50vh] rounded-md border bg-muted/50 p-4">
            <pre className="text-xs font-mono whitespace-pre-wrap break-all">
              {previewContent}
            </pre>
          </ScrollArea>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={copyPreviewContent}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
              {!user && <Lock className="h-3 w-3 ml-1" />}
            </Button>
            <Button onClick={handleDownloadFromPreview}>
              <Download className="h-4 w-4 mr-2" />
              Download
              {!user && <Lock className="h-3 w-3 ml-1" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Auth Required Dialog */}
      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Sign In Required
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              Create a free account to export and save your design systems.
            </p>
            <Button asChild className="w-full">
              <Link to="/auth">
                <User className="mr-2 h-4 w-4" />
                Sign In to Export
              </Link>
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  GitHub Sync
                </h4>
                <p className="text-xs text-muted-foreground">Push tokens directly to a repository</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info("GitHub integration coming soon in the next update!")}
              >
                Connect Repository
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
