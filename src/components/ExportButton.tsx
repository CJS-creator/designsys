import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { Download, FileJson, FileCode, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface ExportButtonProps {
  designSystem: GeneratedDesignSystem;
}

function generateCSSVariables(ds: GeneratedDesignSystem): string {
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
}`;
}

function generateTailwindConfig(ds: GeneratedDesignSystem): string {
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
      },
    },
  },
}`;
}

export function ExportButton({ designSystem }: ExportButtonProps) {
  const [copied, setCopied] = useState(false);

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="lg" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => downloadFile(JSON.stringify(designSystem, null, 2), "design-system.json")}>
          <FileJson className="h-4 w-4 mr-2" />
          Download JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => downloadFile(generateCSSVariables(designSystem), "design-system.css")}>
          <FileCode className="h-4 w-4 mr-2" />
          Download CSS
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => downloadFile(generateTailwindConfig(designSystem), "tailwind.config.js")}>
          <FileCode className="h-4 w-4 mr-2" />
          Tailwind Config
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyJSON}>
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          Copy JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
