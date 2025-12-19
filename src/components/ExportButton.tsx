import { useState } from "react";
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
import { Download, FileJson, FileCode, Copy, Check, Eye, Layers } from "lucide-react";
import { toast } from "sonner";

interface ExportButtonProps {
  designSystem: GeneratedDesignSystem;
}

type ExportFormat = "json" | "css" | "scss" | "tailwind" | "figma" | "style-dictionary";

interface ExportOption {
  id: ExportFormat;
  label: string;
  filename: string;
  icon: typeof FileJson;
  generator: (ds: GeneratedDesignSystem) => string;
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

const exportOptions: ExportOption[] = [
  { id: "json", label: "JSON", filename: "design-system.json", icon: FileJson, generator: (ds) => JSON.stringify(ds, null, 2) },
  { id: "css", label: "CSS Variables", filename: "design-system.css", icon: FileCode, generator: generateCSSVariables },
  { id: "scss", label: "SCSS", filename: "design-system.scss", icon: FileCode, generator: generateSCSS },
  { id: "tailwind", label: "Tailwind Config", filename: "tailwind.config.js", icon: FileCode, generator: generateTailwindConfig },
  { id: "figma", label: "Figma Tokens", filename: "figma-tokens.json", icon: FileJson, generator: generateFigmaTokens },
  { id: "style-dictionary", label: "Style Dictionary", filename: "tokens.json", icon: Layers, generator: generateStyleDictionary },
];

export function ExportButton({ designSystem }: ExportButtonProps) {
  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFormat, setPreviewFormat] = useState<ExportOption | null>(null);
  const [previewContent, setPreviewContent] = useState("");

  const downloadFile = (content: string, filename: string) => {
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
  };

  const copyJSON = () => {
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
    navigator.clipboard.writeText(previewContent);
    toast.success("Copied to clipboard");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="lg" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {exportOptions.map((option) => (
            <DropdownMenuItem key={option.id} className="flex items-center justify-between">
              <span 
                className="flex items-center flex-1 cursor-pointer"
                onClick={() => downloadFile(option.generator(designSystem), option.filename)}
              >
                <option.icon className="h-4 w-4 mr-2" />
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

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {previewFormat && <previewFormat.icon className="h-5 w-5" />}
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
            </Button>
            <Button onClick={() => {
              if (previewFormat) {
                downloadFile(previewContent, previewFormat.filename);
              }
            }}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
