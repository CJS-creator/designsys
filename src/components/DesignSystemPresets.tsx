import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, Sparkles, Layers } from "lucide-react";
import { GeneratedDesignSystem } from "@/types/designSystem";

interface DesignSystemPresetsProps {
  onApplyPreset: (preset: GeneratedDesignSystem) => void;
}

const presets: { name: string; description: string; icon: typeof Palette; tags: string[]; system: GeneratedDesignSystem }[] = [
  {
    name: "Material Design 3",
    description: "Google's latest design system with dynamic color and expressive components",
    icon: Layers,
    tags: ["Modern", "Accessible", "Android"],
    system: {
      name: "Material Design 3",
      colors: {
        primary: "#6750A4",
        secondary: "#625B71",
        accent: "#7D5260",
        background: "#FFFBFE",
        surface: "#FFFBFE",
        text: "#1C1B1F",
        textSecondary: "#49454F",
        success: "#4CAF50",
        warning: "#FF9800",
        error: "#B3261E",
        overlay: "rgba(0, 0, 0, 0.32)",
        border: "#CAC4D0",
        borderLight: "#E7E0EC",
        interactive: {
          primary: { hover: "#7965AF", active: "#5B4A94", disabled: "#E8DEF8", focus: "#6750A4" },
          secondary: { hover: "#7A7289", active: "#4A4458", disabled: "#E8E0EB", focus: "#625B71" },
          accent: { hover: "#986A78", active: "#633B48", disabled: "#F2DEE4", focus: "#7D5260" },
        },
      },
      darkColors: {
        primary: "#D0BCFF",
        secondary: "#CCC2DC",
        accent: "#EFB8C8",
        background: "#1C1B1F",
        surface: "#2B2930",
        text: "#E6E1E5",
        textSecondary: "#CAC4D0",
        success: "#81C784",
        warning: "#FFB74D",
        error: "#F2B8B5",
        overlay: "rgba(0, 0, 0, 0.64)",
        border: "#49454F",
        borderLight: "#313033",
        interactive: {
          primary: { hover: "#E4D4FF", active: "#BEABDF", disabled: "#4A4458", focus: "#D0BCFF" },
          secondary: { hover: "#DED4EE", active: "#B5ABCA", disabled: "#49454F", focus: "#CCC2DC" },
          accent: { hover: "#FFCBD8", active: "#D49AAC", disabled: "#4A4458", focus: "#EFB8C8" },
        },
      },
      typography: {
        fontFamily: { heading: "Roboto, sans-serif", body: "Roboto, sans-serif", mono: "Roboto Mono, monospace" },
        sizes: { xs: "11px", sm: "12px", base: "14px", lg: "16px", xl: "22px", "2xl": "28px", "3xl": "36px", "4xl": "45px", "5xl": "57px" },
        weights: { normal: 400, medium: 500, semibold: 600, bold: 700 },
        lineHeights: { tight: "1.2", normal: "1.5", relaxed: "1.75" },
      },
      spacing: { unit: 4, scale: { "0": "0px", "1": "4px", "2": "8px", "3": "12px", "4": "16px", "5": "20px", "6": "24px", "8": "32px", "10": "40px", "12": "48px", "16": "64px", "20": "80px", "24": "96px" } },
      shadows: { none: "none", sm: "0 1px 2px rgba(0,0,0,0.05)", md: "0 1px 3px rgba(0,0,0,0.1)", lg: "0 4px 6px rgba(0,0,0,0.1)", xl: "0 10px 15px rgba(0,0,0,0.1)", "2xl": "0 25px 50px rgba(0,0,0,0.25)", inner: "inset 0 2px 4px rgba(0,0,0,0.05)" },
      grid: { columns: 12, gutter: "16px", margin: "24px", maxWidth: "1280px", breakpoints: { sm: "600px", md: "905px", lg: "1240px", xl: "1440px", "2xl": "1920px" } },
      borderRadius: { none: "0px", sm: "8px", md: "12px", lg: "16px", xl: "20px", "2xl": "28px", full: "9999px" },
      animations: { duration: { instant: "0ms", fast: "100ms", normal: "200ms", slow: "300ms", slower: "500ms" }, easing: { linear: "linear", easeIn: "cubic-bezier(0.4, 0, 1, 1)", easeOut: "cubic-bezier(0, 0, 0.2, 1)", easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)", spring: "cubic-bezier(0.68, -0.55, 0.27, 1.55)", bounce: "cubic-bezier(0.68, -0.55, 0.27, 1.55)" }, transitions: { fade: "opacity 200ms ease", scale: "transform 200ms ease", slide: "transform 300ms ease", all: "all 200ms ease", colors: "background-color 200ms, color 200ms", transform: "transform 200ms ease" } },
    },
  },
  {
    name: "Tailwind UI",
    description: "Clean, utility-first design with balanced aesthetics and flexibility",
    icon: Sparkles,
    tags: ["Minimal", "Flexible", "Web"],
    system: {
      name: "Tailwind UI",
      colors: {
        primary: "#4F46E5",
        secondary: "#7C3AED",
        accent: "#0EA5E9",
        background: "#FFFFFF",
        surface: "#F9FAFB",
        text: "#111827",
        textSecondary: "#6B7280",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        overlay: "rgba(0, 0, 0, 0.5)",
        border: "#E5E7EB",
        borderLight: "#F3F4F6",
        interactive: {
          primary: { hover: "#4338CA", active: "#3730A3", disabled: "#C7D2FE", focus: "#4F46E5" },
          secondary: { hover: "#6D28D9", active: "#5B21B6", disabled: "#DDD6FE", focus: "#7C3AED" },
          accent: { hover: "#0284C7", active: "#0369A1", disabled: "#BAE6FD", focus: "#0EA5E9" },
        },
      },
      darkColors: {
        primary: "#818CF8",
        secondary: "#A78BFA",
        accent: "#38BDF8",
        background: "#111827",
        surface: "#1F2937",
        text: "#F9FAFB",
        textSecondary: "#9CA3AF",
        success: "#34D399",
        warning: "#FBBF24",
        error: "#F87171",
        overlay: "rgba(0, 0, 0, 0.75)",
        border: "#374151",
        borderLight: "#1F2937",
        interactive: {
          primary: { hover: "#A5B4FC", active: "#6366F1", disabled: "#3730A3", focus: "#818CF8" },
          secondary: { hover: "#C4B5FD", active: "#8B5CF6", disabled: "#5B21B6", focus: "#A78BFA" },
          accent: { hover: "#7DD3FC", active: "#0EA5E9", disabled: "#0369A1", focus: "#38BDF8" },
        },
      },
      typography: {
        fontFamily: { heading: "Inter, sans-serif", body: "Inter, sans-serif", mono: "JetBrains Mono, monospace" },
        sizes: { xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem", "5xl": "3rem" },
        weights: { normal: 400, medium: 500, semibold: 600, bold: 700 },
        lineHeights: { tight: "1.25", normal: "1.5", relaxed: "1.625" },
      },
      spacing: { unit: 4, scale: { "0": "0", "1": "0.25rem", "2": "0.5rem", "3": "0.75rem", "4": "1rem", "5": "1.25rem", "6": "1.5rem", "8": "2rem", "10": "2.5rem", "12": "3rem", "16": "4rem", "20": "5rem", "24": "6rem" } },
      shadows: { none: "none", sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)", md: "0 4px 6px -1px rgb(0 0 0 / 0.1)", lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)", xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)", "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)", inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)" },
      grid: { columns: 12, gutter: "1.5rem", margin: "1rem", maxWidth: "80rem", breakpoints: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px" } },
      borderRadius: { none: "0", sm: "0.125rem", md: "0.375rem", lg: "0.5rem", xl: "0.75rem", "2xl": "1rem", full: "9999px" },
      animations: { duration: { instant: "0ms", fast: "75ms", normal: "150ms", slow: "300ms", slower: "500ms" }, easing: { linear: "linear", easeIn: "cubic-bezier(0.4, 0, 1, 1)", easeOut: "cubic-bezier(0, 0, 0.2, 1)", easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)", spring: "cubic-bezier(0.68, -0.6, 0.32, 1.6)", bounce: "cubic-bezier(0.68, -0.6, 0.32, 1.6)" }, transitions: { fade: "opacity 150ms ease", scale: "transform 150ms ease", slide: "transform 300ms ease", all: "all 150ms ease", colors: "color 150ms, background-color 150ms", transform: "transform 150ms ease" } },
    },
  },
  {
    name: "Chakra UI",
    description: "Accessible, modular design system with great developer experience",
    icon: Palette,
    tags: ["Accessible", "Modular", "React"],
    system: {
      name: "Chakra UI",
      colors: {
        primary: "#319795",
        secondary: "#805AD5",
        accent: "#DD6B20",
        background: "#FFFFFF",
        surface: "#F7FAFC",
        text: "#1A202C",
        textSecondary: "#718096",
        success: "#38A169",
        warning: "#D69E2E",
        error: "#E53E3E",
        overlay: "rgba(0, 0, 0, 0.48)",
        border: "#E2E8F0",
        borderLight: "#EDF2F7",
        interactive: {
          primary: { hover: "#2C7A7B", active: "#285E61", disabled: "#B2F5EA", focus: "#319795" },
          secondary: { hover: "#6B46C1", active: "#553C9A", disabled: "#E9D8FD", focus: "#805AD5" },
          accent: { hover: "#C05621", active: "#9C4221", disabled: "#FEEBC8", focus: "#DD6B20" },
        },
      },
      darkColors: {
        primary: "#4FD1C5",
        secondary: "#B794F4",
        accent: "#ED8936",
        background: "#1A202C",
        surface: "#2D3748",
        text: "#F7FAFC",
        textSecondary: "#A0AEC0",
        success: "#68D391",
        warning: "#ECC94B",
        error: "#FC8181",
        overlay: "rgba(0, 0, 0, 0.72)",
        border: "#4A5568",
        borderLight: "#2D3748",
        interactive: {
          primary: { hover: "#81E6D9", active: "#38B2AC", disabled: "#234E52", focus: "#4FD1C5" },
          secondary: { hover: "#D6BCFA", active: "#9F7AEA", disabled: "#44337A", focus: "#B794F4" },
          accent: { hover: "#F6AD55", active: "#DD6B20", disabled: "#7B341E", focus: "#ED8936" },
        },
      },
      typography: {
        fontFamily: { heading: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif", body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif", mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace" },
        sizes: { xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem", "5xl": "3rem" },
        weights: { normal: 400, medium: 500, semibold: 600, bold: 700 },
        lineHeights: { tight: "1.2", normal: "1.5", relaxed: "1.625" },
      },
      spacing: { unit: 4, scale: { "0": "0", "1": "0.25rem", "2": "0.5rem", "3": "0.75rem", "4": "1rem", "5": "1.25rem", "6": "1.5rem", "8": "2rem", "10": "2.5rem", "12": "3rem", "16": "4rem", "20": "5rem", "24": "6rem" } },
      shadows: { none: "none", sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)", inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)" },
      grid: { columns: 12, gutter: "1.5rem", margin: "1rem", maxWidth: "1280px", breakpoints: { sm: "30em", md: "48em", lg: "62em", xl: "80em", "2xl": "96em" } },
      borderRadius: { none: "0", sm: "0.125rem", md: "0.375rem", lg: "0.5rem", xl: "0.75rem", "2xl": "1rem", full: "9999px" },
      animations: { duration: { instant: "0ms", fast: "100ms", normal: "200ms", slow: "400ms", slower: "700ms" }, easing: { linear: "linear", easeIn: "cubic-bezier(0.4, 0, 1, 1)", easeOut: "cubic-bezier(0, 0, 0.2, 1)", easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)", spring: "cubic-bezier(0.68, -0.55, 0.27, 1.55)", bounce: "cubic-bezier(0.68, -0.55, 0.27, 1.55)" }, transitions: { fade: "opacity 200ms ease-out", scale: "transform 200ms ease-out", slide: "transform 400ms ease", all: "all 200ms ease", colors: "background-color 200ms, border-color 200ms, color 200ms", transform: "transform 200ms ease-out" } },
    },
  },
];

export const DesignSystemPresets = ({ onApplyPreset }: DesignSystemPresetsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Design System Presets
        </CardTitle>
        <CardDescription>Start from popular design systems and customize to your needs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {presets.map((preset) => (
            <Card key={preset.name} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ background: preset.system.colors.primary + "20" }}>
                    <preset.icon className="h-5 w-5" style={{ color: preset.system.colors.primary }} />
                  </div>
                  <h3 className="font-semibold">{preset.name}</h3>
                </div>
                
                <p className="text-sm text-muted-foreground">{preset.description}</p>
                
                <div className="flex flex-wrap gap-1">
                  {preset.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
                
                <div className="flex gap-1">
                  {[preset.system.colors.primary, preset.system.colors.secondary, preset.system.colors.accent, preset.system.colors.success].map((color, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-background shadow-sm" style={{ background: color }} />
                  ))}
                </div>
                
                <Button className="w-full" onClick={() => onApplyPreset(preset.system)}>
                  Use This Preset
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
