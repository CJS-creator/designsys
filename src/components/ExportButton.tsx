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

interface ExportButtonProps {
  designSystem: GeneratedDesignSystem;
}

type ExportFormat = "json" | "css" | "scss" | "tailwind" | "figma" | "style-dictionary" | "react-native" | "storybook" | "styleguide" | "swiftui" | "compose" | "w3c" | "storybook-pro";

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
  'secondary': $color-color-secondary,
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

const generateSwiftUI = (ds: GeneratedDesignSystem): string => {
  const parseToSwiftColor = (hex: string) => {
    // Simple mock conversion for the demo, ideally parses HSL to RGB
    // Assuming hex is in #RRGGBB format
    const r = parseInt(hex.substring(1, 3), 16) / 255;
    const g = parseInt(hex.substring(3, 5), 16) / 255;
    const b = parseInt(hex.substring(5, 7), 16) / 255;
    return `Color(red: ${r.toFixed(3)}, green: ${g.toFixed(3)}, blue: ${b.toFixed(3)})`;
  };

  return `import SwiftUI

// DesignForge Generated Theme
extension Color {
    static let primaryBrand = ${parseToSwiftColor(ds.colors.primary)}
    static let secondaryBrand = ${parseToSwiftColor(ds.colors.secondary)}
    static let brandAccent = ${parseToSwiftColor(ds.colors.accent)}
    static let brandBackground = ${parseToSwiftColor(ds.colors.background)}
    static let brandSurface = ${parseToSwiftColor(ds.colors.surface)}
    
    // Semantic
    static let brandSuccess = ${parseToSwiftColor(ds.colors.success)}
    static let brandWarning = ${parseToSwiftColor(ds.colors.warning)}
    static let brandError = ${parseToSwiftColor(ds.colors.error)}
}

extension Font {
    static func brandHeading(size: CGFloat) -> Font {
        return Font.custom("${ds.typography.fontFamily.heading}", size: size)
    }
    
    static func brandBody(size: CGFloat) -> Font {
        return Font.custom("${ds.typography.fontFamily.body}", size: size)
    }
}

struct DesignTokens {
    static let borderRadius: CGFloat = ${parseFloat(ds.borderRadius.md)}
    static let spacingUnit: CGFloat = ${ds.spacing.unit}
}
`;
};

const generateCompose = (ds: GeneratedDesignSystem): string => {
  return `package com.designforge.theme

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.font.FontFamily

object DesignTokens {
    val Primary = Color(0xFF${ds.colors.primary.replace('#', '')})
    val Secondary = Color(0xFF${ds.colors.secondary.replace('#', '')})
    val Accent = Color(0xFF${ds.colors.accent.replace('#', '')})
    val Background = Color(0xFF${ds.colors.background.replace('#', '')})
    val Surface = Color(0xFF${ds.colors.surface.replace('#', '')})
    
    val Success = Color(0xFF${ds.colors.success.replace('#', '')})
    val Warning = Color(0xFF${ds.colors.warning.replace('#', '')})
    val Error = Color(0xFF${ds.colors.error.replace('#', '')})

    val SpacingUnit = ${ds.spacing.unit}.dp
    val BorderRadius = ${parseFloat(ds.borderRadius.md)}.dp
}
`;
};

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
  { id: "swiftui", label: "SwiftUI (iOS)", filename: "Theme.swift", icon: <Smartphone className="h-4 w-4" />, generator: generateSwiftUI, description: "Swift extensions for iOS themes" },
  { id: "compose", label: "Compose (Android)", filename: "Theme.kt", icon: <Smartphone className="h-4 w-4" />, generator: generateCompose, description: "Kotlin Compose Color/Type definitions" },
  { id: "storybook", label: "Storybook", filename: "tokens.stories.tsx", icon: <Component className="h-4 w-4" />, generator: generateStorybook, description: "React stories for documentation" },
  { id: "styleguide", label: "Styleguide MD", filename: "STYLEGUIDE.md", icon: <FileText className="h-4 w-4" />, generator: generateStyleguideMD, description: "Professional documentation in Markdown" },
  { id: "figma", label: "Figma Tokens", filename: "figma-tokens.json", icon: <FileJson className="h-4 w-4" />, generator: generateFigmaTokens, description: "Tokens compatible with Figma plugins" },
  { id: "style-dictionary", label: "Style Dictionary", filename: "tokens.json", icon: <Layers className="h-4 w-4" />, generator: generateStyleDictionary, description: "Tokens for Style Dictionary framework" },
  {
    id: "storybook-pro",
    label: "Storybook Pro",
    filename: "storybook-config.zip",
    icon: <BookOpen className="h-4 w-4" />,
    description: "Advanced tokens + preview.js config",
    generator: (ds) => `
/** .storybook/preview.js **/
export const parameters = {
  backgrounds: {
    default: 'surface',
    values: [
      { name: 'surface', value: '${ds.colors.surface}' },
      { name: 'background', value: '${ds.colors.background}' },
      { name: 'primary', value: '${ds.colors.primary}' },
    ],
  },
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/sample',
  },
};

/** Tokens **/
const tokens = ${JSON.stringify(ds, null, 2)};
`,
  },
  {
    id: "w3c",
    label: "W3C Design Tokens",
    icon: <FileJson className="h-4 w-4" />,
    filename: "tokens.w3c.json",
    description: "Industry-standard JSON format",
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
