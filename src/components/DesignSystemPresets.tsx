import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Palette, Sparkles, Layers, Building, CreditCard, Leaf, Briefcase, Zap, Heart, Music, Code, Search } from "lucide-react";
import { GeneratedDesignSystem } from "@/types/designSystem";

interface DesignSystemPresetsProps {
  onApplyPreset: (preset: GeneratedDesignSystem) => void;
}

const presets: { name: string; description: string; icon: typeof Palette; tags: string[]; category: string; system: GeneratedDesignSystem }[] = [
  {
    name: "Material Design 3",
    description: "Google's latest design system with dynamic color and expressive components",
    icon: Layers,
    tags: ["Modern", "Accessible", "Android"],
    category: "Framework",
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
    category: "Framework",
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
    category: "Framework",
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
  {
    name: "Ant Design",
    description: "Enterprise-class UI design language with comprehensive components",
    icon: Building,
    tags: ["Enterprise", "React", "Professional"],
    category: "Framework",
    system: {
      name: "Ant Design",
      colors: {
        primary: "#1677FF",
        secondary: "#722ED1",
        accent: "#13C2C2",
        background: "#FFFFFF",
        surface: "#FAFAFA",
        text: "#000000E0",
        textSecondary: "#00000073",
        success: "#52C41A",
        warning: "#FAAD14",
        error: "#FF4D4F",
        overlay: "rgba(0, 0, 0, 0.45)",
        border: "#D9D9D9",
        borderLight: "#F0F0F0",
        interactive: {
          primary: { hover: "#4096FF", active: "#0958D9", disabled: "#BAE0FF", focus: "#1677FF" },
          secondary: { hover: "#9254DE", active: "#531DAB", disabled: "#EFDBFF", focus: "#722ED1" },
          accent: { hover: "#36CFC9", active: "#08979C", disabled: "#B5F5EC", focus: "#13C2C2" },
        },
      },
      darkColors: {
        primary: "#1668DC",
        secondary: "#9254DE",
        accent: "#13A8A8",
        background: "#141414",
        surface: "#1F1F1F",
        text: "#FFFFFFD9",
        textSecondary: "#FFFFFF73",
        success: "#49AA19",
        warning: "#D89614",
        error: "#DC4446",
        overlay: "rgba(0, 0, 0, 0.65)",
        border: "#424242",
        borderLight: "#303030",
        interactive: {
          primary: { hover: "#3C89E8", active: "#1554AD", disabled: "#111D2C", focus: "#1668DC" },
          secondary: { hover: "#AB7AE0", active: "#642AB5", disabled: "#1A1325", focus: "#9254DE" },
          accent: { hover: "#33BCB7", active: "#138585", disabled: "#112123", focus: "#13A8A8" },
        },
      },
      typography: {
        fontFamily: { heading: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", mono: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace" },
        sizes: { xs: "12px", sm: "14px", base: "14px", lg: "16px", xl: "20px", "2xl": "24px", "3xl": "30px", "4xl": "38px", "5xl": "46px" },
        weights: { normal: 400, medium: 500, semibold: 600, bold: 700 },
        lineHeights: { tight: "1.35", normal: "1.57", relaxed: "1.75" },
      },
      spacing: { unit: 4, scale: { "0": "0", "1": "4px", "2": "8px", "3": "12px", "4": "16px", "5": "20px", "6": "24px", "8": "32px", "10": "40px", "12": "48px", "16": "64px", "20": "80px", "24": "96px" } },
      shadows: { none: "none", sm: "0 1px 2px 0 rgba(0, 0, 0, 0.03)", md: "0 3px 6px -4px rgba(0, 0, 0, 0.12)", lg: "0 6px 16px 0 rgba(0, 0, 0, 0.08)", xl: "0 9px 28px 8px rgba(0, 0, 0, 0.05)", "2xl": "0 12px 48px 16px rgba(0, 0, 0, 0.03)", inner: "inset 0 2px 4px rgba(0, 0, 0, 0.05)" },
      grid: { columns: 24, gutter: "16px", margin: "24px", maxWidth: "1200px", breakpoints: { sm: "576px", md: "768px", lg: "992px", xl: "1200px", "2xl": "1600px" } },
      borderRadius: { none: "0", sm: "2px", md: "4px", lg: "6px", xl: "8px", "2xl": "12px", full: "9999px" },
      animations: { duration: { instant: "0ms", fast: "100ms", normal: "200ms", slow: "300ms", slower: "500ms" }, easing: { linear: "linear", easeIn: "cubic-bezier(0.55, 0.055, 0.675, 0.19)", easeOut: "cubic-bezier(0.215, 0.61, 0.355, 1)", easeInOut: "cubic-bezier(0.645, 0.045, 0.355, 1)", spring: "cubic-bezier(0.34, 1.56, 0.64, 1)", bounce: "cubic-bezier(0.68, -0.55, 0.27, 1.55)" }, transitions: { fade: "opacity 200ms ease", scale: "transform 200ms ease", slide: "transform 300ms ease", all: "all 200ms ease", colors: "background-color 200ms, color 200ms", transform: "transform 200ms ease" } },
    },
  },
  {
    name: "Bootstrap",
    description: "The world's most popular front-end framework",
    icon: Code,
    tags: ["Popular", "Responsive", "Components"],
    category: "Framework",
    system: {
      name: "Bootstrap",
      colors: {
        primary: "#0D6EFD",
        secondary: "#6C757D",
        accent: "#0DCAF0",
        background: "#FFFFFF",
        surface: "#F8F9FA",
        text: "#212529",
        textSecondary: "#6C757D",
        success: "#198754",
        warning: "#FFC107",
        error: "#DC3545",
        overlay: "rgba(0, 0, 0, 0.5)",
        border: "#DEE2E6",
        borderLight: "#E9ECEF",
        interactive: {
          primary: { hover: "#0B5ED7", active: "#0A58CA", disabled: "#B6D4FE", focus: "#0D6EFD" },
          secondary: { hover: "#5C636A", active: "#565E64", disabled: "#C4C8CB", focus: "#6C757D" },
          accent: { hover: "#31D2F2", active: "#25CFE5", disabled: "#A6E9F5", focus: "#0DCAF0" },
        },
      },
      darkColors: {
        primary: "#6EA8FE",
        secondary: "#A7ACB1",
        accent: "#6EDFF6",
        background: "#212529",
        surface: "#343A40",
        text: "#F8F9FA",
        textSecondary: "#ADB5BD",
        success: "#75B798",
        warning: "#FFDA6A",
        error: "#EA868F",
        overlay: "rgba(0, 0, 0, 0.75)",
        border: "#495057",
        borderLight: "#343A40",
        interactive: {
          primary: { hover: "#8BB9FE", active: "#5294FB", disabled: "#031633", focus: "#6EA8FE" },
          secondary: { hover: "#B8BCC0", active: "#8F959A", disabled: "#343A40", focus: "#A7ACB1" },
          accent: { hover: "#8BE5F8", active: "#50D8F3", disabled: "#032830", focus: "#6EDFF6" },
        },
      },
      typography: {
        fontFamily: { heading: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", body: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace" },
        sizes: { xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.25rem", xl: "1.5rem", "2xl": "2rem", "3xl": "2.5rem", "4xl": "3rem", "5xl": "4rem" },
        weights: { normal: 400, medium: 500, semibold: 600, bold: 700 },
        lineHeights: { tight: "1.2", normal: "1.5", relaxed: "1.75" },
      },
      spacing: { unit: 4, scale: { "0": "0", "1": "0.25rem", "2": "0.5rem", "3": "1rem", "4": "1.5rem", "5": "3rem", "6": "3.5rem", "8": "4rem", "10": "4.5rem", "12": "5rem", "16": "6rem", "20": "8rem", "24": "10rem" } },
      shadows: { none: "none", sm: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)", md: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)", lg: "0 1rem 3rem rgba(0, 0, 0, 0.175)", xl: "0 1.5rem 4rem rgba(0, 0, 0, 0.2)", "2xl": "0 2rem 6rem rgba(0, 0, 0, 0.25)", inner: "inset 0 1px 2px rgba(0, 0, 0, 0.075)" },
      grid: { columns: 12, gutter: "1.5rem", margin: "0.75rem", maxWidth: "1320px", breakpoints: { sm: "576px", md: "768px", lg: "992px", xl: "1200px", "2xl": "1400px" } },
      borderRadius: { none: "0", sm: "0.25rem", md: "0.375rem", lg: "0.5rem", xl: "1rem", "2xl": "2rem", full: "50rem" },
      animations: { duration: { instant: "0ms", fast: "150ms", normal: "300ms", slow: "500ms", slower: "1000ms" }, easing: { linear: "linear", easeIn: "ease-in", easeOut: "ease-out", easeInOut: "ease-in-out", spring: "cubic-bezier(0.68, -0.55, 0.27, 1.55)", bounce: "cubic-bezier(0.68, -0.55, 0.27, 1.55)" }, transitions: { fade: "opacity 150ms linear", scale: "transform 300ms ease", slide: "transform 300ms ease-in-out", all: "all 300ms ease", colors: "background-color 150ms, color 150ms", transform: "transform 300ms ease" } },
    },
  },
  {
    name: "Stripe",
    description: "Elegant, professional design inspired by Stripe's clean aesthetic",
    icon: CreditCard,
    tags: ["Elegant", "Professional", "Fintech"],
    category: "Inspired",
    system: {
      name: "Stripe",
      colors: {
        primary: "#635BFF",
        secondary: "#0A2540",
        accent: "#00D4FF",
        background: "#FFFFFF",
        surface: "#F6F9FC",
        text: "#0A2540",
        textSecondary: "#425466",
        success: "#30BE7B",
        warning: "#F5A524",
        error: "#DF1B41",
        overlay: "rgba(10, 37, 64, 0.6)",
        border: "#E3E8EE",
        borderLight: "#F0F3F7",
        interactive: {
          primary: { hover: "#7A73FF", active: "#4B44E0", disabled: "#C9C6FF", focus: "#635BFF" },
          secondary: { hover: "#1A3550", active: "#081E30", disabled: "#A3ACB9", focus: "#0A2540" },
          accent: { hover: "#33DDFF", active: "#00B8E6", disabled: "#99EFFF", focus: "#00D4FF" },
        },
      },
      darkColors: {
        primary: "#7A73FF",
        secondary: "#ADBDCC",
        accent: "#00D4FF",
        background: "#0A2540",
        surface: "#15395B",
        text: "#FFFFFF",
        textSecondary: "#ADBDCC",
        success: "#4CD994",
        warning: "#FFB84D",
        error: "#FF6B87",
        overlay: "rgba(0, 0, 0, 0.7)",
        border: "#2D4D6B",
        borderLight: "#1E3A57",
        interactive: {
          primary: { hover: "#9A94FF", active: "#635BFF", disabled: "#2D2B66", focus: "#7A73FF" },
          secondary: { hover: "#C4D1DD", active: "#8FA3B5", disabled: "#1E3A57", focus: "#ADBDCC" },
          accent: { hover: "#33DDFF", active: "#00B8E6", disabled: "#003D4D", focus: "#00D4FF" },
        },
      },
      typography: {
        fontFamily: { heading: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif", body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif", mono: "'Söhne Mono', Monaco, 'Andale Mono', monospace" },
        sizes: { xs: "12px", sm: "13px", base: "15px", lg: "17px", xl: "21px", "2xl": "28px", "3xl": "36px", "4xl": "48px", "5xl": "60px" },
        weights: { normal: 400, medium: 500, semibold: 600, bold: 700 },
        lineHeights: { tight: "1.2", normal: "1.6", relaxed: "1.8" },
      },
      spacing: { unit: 4, scale: { "0": "0", "1": "4px", "2": "8px", "3": "12px", "4": "16px", "5": "20px", "6": "24px", "8": "32px", "10": "40px", "12": "48px", "16": "64px", "20": "80px", "24": "96px" } },
      shadows: { none: "none", sm: "0 2px 5px 0 rgba(60, 66, 87, 0.08)", md: "0 4px 12px 0 rgba(60, 66, 87, 0.12)", lg: "0 7px 30px 0 rgba(60, 66, 87, 0.15)", xl: "0 15px 45px 0 rgba(60, 66, 87, 0.2)", "2xl": "0 30px 60px 0 rgba(60, 66, 87, 0.25)", inner: "inset 0 2px 4px rgba(60, 66, 87, 0.06)" },
      grid: { columns: 12, gutter: "24px", margin: "16px", maxWidth: "1080px", breakpoints: { sm: "576px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1440px" } },
      borderRadius: { none: "0", sm: "4px", md: "6px", lg: "8px", xl: "12px", "2xl": "16px", full: "9999px" },
      animations: { duration: { instant: "0ms", fast: "100ms", normal: "200ms", slow: "400ms", slower: "600ms" }, easing: { linear: "linear", easeIn: "cubic-bezier(0.4, 0, 1, 1)", easeOut: "cubic-bezier(0, 0, 0.2, 1)", easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)", spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)", bounce: "cubic-bezier(0.68, -0.55, 0.27, 1.55)" }, transitions: { fade: "opacity 200ms ease", scale: "transform 200ms ease", slide: "transform 400ms ease", all: "all 200ms ease", colors: "background-color 200ms, color 200ms, border-color 200ms", transform: "transform 200ms ease" } },
    },
  },
  {
    name: "Linear",
    description: "Sleek, modern design inspired by Linear's minimalist interface",
    icon: Zap,
    tags: ["Minimal", "Modern", "SaaS"],
    category: "Inspired",
    system: {
      name: "Linear",
      colors: {
        primary: "#5E6AD2",
        secondary: "#26B5CE",
        accent: "#F2C94C",
        background: "#FFFFFF",
        surface: "#F9FAFB",
        text: "#1D1F26",
        textSecondary: "#5E6068",
        success: "#0EA770",
        warning: "#F5A623",
        error: "#E5484D",
        overlay: "rgba(0, 0, 0, 0.4)",
        border: "#E6E8EB",
        borderLight: "#F1F3F5",
        interactive: {
          primary: { hover: "#7580DB", active: "#4A54BD", disabled: "#CBCEF0", focus: "#5E6AD2" },
          secondary: { hover: "#3DC3D8", active: "#1EA1B9", disabled: "#B8E8EF", focus: "#26B5CE" },
          accent: { hover: "#F5D56E", active: "#E8BC2E", disabled: "#FAECC1", focus: "#F2C94C" },
        },
      },
      darkColors: {
        primary: "#8D93E4",
        secondary: "#4DCDE3",
        accent: "#F5D56E",
        background: "#0A0B0D",
        surface: "#13141A",
        text: "#E8ECF0",
        textSecondary: "#8E929A",
        success: "#34C38F",
        warning: "#F8B64C",
        error: "#EF6467",
        overlay: "rgba(0, 0, 0, 0.7)",
        border: "#2E3038",
        borderLight: "#1E2028",
        interactive: {
          primary: { hover: "#A5AAF0", active: "#7580DB", disabled: "#2A2D45", focus: "#8D93E4" },
          secondary: { hover: "#6DD8EB", active: "#33C2D8", disabled: "#1A3A40", focus: "#4DCDE3" },
          accent: { hover: "#F8DE8E", active: "#F2C94C", disabled: "#3D3520", focus: "#F5D56E" },
        },
      },
      typography: {
        fontFamily: { heading: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", body: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", mono: "'JetBrains Mono', 'Fira Code', monospace" },
        sizes: { xs: "11px", sm: "12px", base: "14px", lg: "16px", xl: "20px", "2xl": "24px", "3xl": "32px", "4xl": "40px", "5xl": "48px" },
        weights: { normal: 400, medium: 500, semibold: 600, bold: 700 },
        lineHeights: { tight: "1.25", normal: "1.5", relaxed: "1.65" },
      },
      spacing: { unit: 4, scale: { "0": "0", "1": "4px", "2": "8px", "3": "12px", "4": "16px", "5": "20px", "6": "24px", "8": "32px", "10": "40px", "12": "48px", "16": "64px", "20": "80px", "24": "96px" } },
      shadows: { none: "none", sm: "0 1px 2px rgba(0, 0, 0, 0.04)", md: "0 2px 8px rgba(0, 0, 0, 0.08)", lg: "0 4px 16px rgba(0, 0, 0, 0.12)", xl: "0 8px 32px rgba(0, 0, 0, 0.16)", "2xl": "0 16px 48px rgba(0, 0, 0, 0.2)", inner: "inset 0 1px 2px rgba(0, 0, 0, 0.04)" },
      grid: { columns: 12, gutter: "16px", margin: "16px", maxWidth: "1200px", breakpoints: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1440px" } },
      borderRadius: { none: "0", sm: "4px", md: "6px", lg: "8px", xl: "10px", "2xl": "12px", full: "9999px" },
      animations: { duration: { instant: "0ms", fast: "80ms", normal: "160ms", slow: "320ms", slower: "480ms" }, easing: { linear: "linear", easeIn: "cubic-bezier(0.4, 0, 1, 1)", easeOut: "cubic-bezier(0, 0, 0.2, 1)", easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)", spring: "cubic-bezier(0.34, 1.56, 0.64, 1)", bounce: "cubic-bezier(0.68, -0.55, 0.27, 1.55)" }, transitions: { fade: "opacity 160ms ease", scale: "transform 160ms ease", slide: "transform 320ms ease", all: "all 160ms ease", colors: "background-color 160ms, color 160ms", transform: "transform 160ms ease" } },
    },
  },
  {
    name: "Notion",
    description: "Clean, content-focused design inspired by Notion's simplicity",
    icon: Briefcase,
    tags: ["Clean", "Content", "Productivity"],
    category: "Inspired",
    system: {
      name: "Notion",
      colors: {
        primary: "#2F3437",
        secondary: "#0077D4",
        accent: "#EB5757",
        background: "#FFFFFF",
        surface: "#FBFBFA",
        text: "#37352F",
        textSecondary: "#787774",
        success: "#0F7B6C",
        warning: "#CB912F",
        error: "#E03E3E",
        overlay: "rgba(15, 15, 15, 0.6)",
        border: "#E9E9E7",
        borderLight: "#F1F1EF",
        interactive: {
          primary: { hover: "#454B4E", active: "#1E2224", disabled: "#B8BAB9", focus: "#2F3437" },
          secondary: { hover: "#1A8FE3", active: "#0066B8", disabled: "#99CCEE", focus: "#0077D4" },
          accent: { hover: "#EF7070", active: "#D94040", disabled: "#F5BBBB", focus: "#EB5757" },
        },
      },
      darkColors: {
        primary: "#FFFFFF",
        secondary: "#529CCA",
        accent: "#EB5757",
        background: "#191919",
        surface: "#202020",
        text: "#E8E7E4",
        textSecondary: "#9B9A97",
        success: "#4DAB9A",
        warning: "#D9A53F",
        error: "#E05454",
        overlay: "rgba(0, 0, 0, 0.8)",
        border: "#373737",
        borderLight: "#2D2D2D",
        interactive: {
          primary: { hover: "#E8E7E4", active: "#CCCCCC", disabled: "#555555", focus: "#FFFFFF" },
          secondary: { hover: "#6DB0D9", active: "#3F89BE", disabled: "#2A4A5F", focus: "#529CCA" },
          accent: { hover: "#EF7070", active: "#D94040", disabled: "#4D2222", focus: "#EB5757" },
        },
      },
      typography: {
        fontFamily: { heading: "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI Variable Display', 'Segoe UI', Helvetica, sans-serif", body: "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI Variable Display', 'Segoe UI', Helvetica, sans-serif", mono: "iawriter-mono, Nitti, Menlo, Courier, monospace" },
        sizes: { xs: "11px", sm: "12px", base: "14px", lg: "16px", xl: "18px", "2xl": "24px", "3xl": "30px", "4xl": "40px", "5xl": "48px" },
        weights: { normal: 400, medium: 500, semibold: 600, bold: 700 },
        lineHeights: { tight: "1.3", normal: "1.5", relaxed: "1.7" },
      },
      spacing: { unit: 4, scale: { "0": "0", "1": "4px", "2": "8px", "3": "12px", "4": "16px", "5": "20px", "6": "24px", "8": "32px", "10": "40px", "12": "48px", "16": "64px", "20": "80px", "24": "96px" } },
      shadows: { none: "none", sm: "0 1px 1px rgba(0, 0, 0, 0.03)", md: "0 1px 3px rgba(0, 0, 0, 0.05)", lg: "0 2px 6px rgba(0, 0, 0, 0.07)", xl: "0 4px 12px rgba(0, 0, 0, 0.1)", "2xl": "0 8px 24px rgba(0, 0, 0, 0.15)", inner: "inset 0 1px 2px rgba(0, 0, 0, 0.03)" },
      grid: { columns: 12, gutter: "16px", margin: "96px", maxWidth: "900px", breakpoints: { sm: "480px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1440px" } },
      borderRadius: { none: "0", sm: "3px", md: "4px", lg: "5px", xl: "6px", "2xl": "8px", full: "9999px" },
      animations: { duration: { instant: "0ms", fast: "100ms", normal: "200ms", slow: "300ms", slower: "400ms" }, easing: { linear: "linear", easeIn: "cubic-bezier(0.4, 0, 1, 1)", easeOut: "cubic-bezier(0, 0, 0.2, 1)", easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)", spring: "cubic-bezier(0.34, 1.56, 0.64, 1)", bounce: "cubic-bezier(0.68, -0.55, 0.27, 1.55)" }, transitions: { fade: "opacity 200ms ease", scale: "transform 200ms ease", slide: "transform 300ms ease", all: "all 200ms ease", colors: "background-color 200ms, color 200ms", transform: "transform 200ms ease" } },
    },
  },
  {
    name: "Healthcare",
    description: "Calming, trustworthy design for healthcare and medical applications",
    icon: Heart,
    tags: ["Medical", "Calming", "Trust"],
    category: "Industry",
    system: {
      name: "Healthcare",
      colors: {
        primary: "#0077B6",
        secondary: "#00B4D8",
        accent: "#48CAE4",
        background: "#FFFFFF",
        surface: "#F8FAFC",
        text: "#1E3A5F",
        textSecondary: "#5A7A9C",
        success: "#059669",
        warning: "#D97706",
        error: "#DC2626",
        overlay: "rgba(30, 58, 95, 0.5)",
        border: "#E2E8F0",
        borderLight: "#F1F5F9",
        interactive: {
          primary: { hover: "#0096C7", active: "#005F92", disabled: "#B8DDF0", focus: "#0077B6" },
          secondary: { hover: "#23C8E6", active: "#009FB8", disabled: "#B8EFF5", focus: "#00B4D8" },
          accent: { hover: "#63D4E9", active: "#2EBDD5", disabled: "#C2EEF5", focus: "#48CAE4" },
        },
      },
      darkColors: {
        primary: "#48CAE4",
        secondary: "#90E0EF",
        accent: "#ADE8F4",
        background: "#0A1929",
        surface: "#132F4C",
        text: "#E8F4F8",
        textSecondary: "#94A3B8",
        success: "#34D399",
        warning: "#FBBF24",
        error: "#F87171",
        overlay: "rgba(0, 0, 0, 0.7)",
        border: "#1E3A5F",
        borderLight: "#163251",
        interactive: {
          primary: { hover: "#63D4E9", active: "#2EBDD5", disabled: "#0C3552", focus: "#48CAE4" },
          secondary: { hover: "#A6E7F3", active: "#76D7EB", disabled: "#0C3552", focus: "#90E0EF" },
          accent: { hover: "#BEF0F8", active: "#9CE3F1", disabled: "#0C3552", focus: "#ADE8F4" },
        },
      },
      typography: {
        fontFamily: { heading: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif", body: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif", mono: "'IBM Plex Mono', monospace" },
        sizes: { xs: "12px", sm: "14px", base: "16px", lg: "18px", xl: "20px", "2xl": "24px", "3xl": "32px", "4xl": "40px", "5xl": "48px" },
        weights: { normal: 400, medium: 500, semibold: 600, bold: 700 },
        lineHeights: { tight: "1.25", normal: "1.5", relaxed: "1.75" },
      },
      spacing: { unit: 4, scale: { "0": "0", "1": "4px", "2": "8px", "3": "12px", "4": "16px", "5": "20px", "6": "24px", "8": "32px", "10": "40px", "12": "48px", "16": "64px", "20": "80px", "24": "96px" } },
      shadows: { none: "none", sm: "0 1px 2px rgba(30, 58, 95, 0.04)", md: "0 4px 6px rgba(30, 58, 95, 0.06)", lg: "0 10px 15px rgba(30, 58, 95, 0.08)", xl: "0 20px 25px rgba(30, 58, 95, 0.1)", "2xl": "0 25px 50px rgba(30, 58, 95, 0.15)", inner: "inset 0 2px 4px rgba(30, 58, 95, 0.04)" },
      grid: { columns: 12, gutter: "24px", margin: "16px", maxWidth: "1280px", breakpoints: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px" } },
      borderRadius: { none: "0", sm: "4px", md: "8px", lg: "12px", xl: "16px", "2xl": "24px", full: "9999px" },
      animations: { duration: { instant: "0ms", fast: "150ms", normal: "250ms", slow: "400ms", slower: "600ms" }, easing: { linear: "linear", easeIn: "cubic-bezier(0.4, 0, 1, 1)", easeOut: "cubic-bezier(0, 0, 0.2, 1)", easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)", spring: "cubic-bezier(0.34, 1.56, 0.64, 1)", bounce: "cubic-bezier(0.68, -0.55, 0.27, 1.55)" }, transitions: { fade: "opacity 250ms ease", scale: "transform 250ms ease", slide: "transform 400ms ease", all: "all 250ms ease", colors: "background-color 250ms, color 250ms", transform: "transform 250ms ease" } },
    },
  },
  {
    name: "Eco Friendly",
    description: "Natural, sustainable design for eco-conscious brands",
    icon: Leaf,
    tags: ["Natural", "Sustainable", "Green"],
    category: "Industry",
    system: {
      name: "Eco Friendly",
      colors: {
        primary: "#16A34A",
        secondary: "#65A30D",
        accent: "#0D9488",
        background: "#FEFEFE",
        surface: "#F7FDF9",
        text: "#14532D",
        textSecondary: "#4D7C5D",
        success: "#15803D",
        warning: "#CA8A04",
        error: "#DC2626",
        overlay: "rgba(20, 83, 45, 0.5)",
        border: "#D1E7DD",
        borderLight: "#E8F5EC",
        interactive: {
          primary: { hover: "#22C55E", active: "#15803D", disabled: "#BBF7D0", focus: "#16A34A" },
          secondary: { hover: "#84CC16", active: "#4D7C0F", disabled: "#D9F99D", focus: "#65A30D" },
          accent: { hover: "#14B8A6", active: "#0F766E", disabled: "#99F6E4", focus: "#0D9488" },
        },
      },
      darkColors: {
        primary: "#4ADE80",
        secondary: "#A3E635",
        accent: "#2DD4BF",
        background: "#052E16",
        surface: "#14532D",
        text: "#DCFCE7",
        textSecondary: "#86EFAC",
        success: "#4ADE80",
        warning: "#EAB308",
        error: "#F87171",
        overlay: "rgba(0, 0, 0, 0.7)",
        border: "#166534",
        borderLight: "#14532D",
        interactive: {
          primary: { hover: "#86EFAC", active: "#22C55E", disabled: "#14532D", focus: "#4ADE80" },
          secondary: { hover: "#BEF264", active: "#84CC16", disabled: "#1A3309", focus: "#A3E635" },
          accent: { hover: "#5EEAD4", active: "#14B8A6", disabled: "#134E4A", focus: "#2DD4BF" },
        },
      },
      typography: {
        fontFamily: { heading: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif", body: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif", mono: "'Fira Code', monospace" },
        sizes: { xs: "12px", sm: "14px", base: "16px", lg: "18px", xl: "20px", "2xl": "24px", "3xl": "32px", "4xl": "40px", "5xl": "48px" },
        weights: { normal: 400, medium: 500, semibold: 600, bold: 700 },
        lineHeights: { tight: "1.25", normal: "1.5", relaxed: "1.75" },
      },
      spacing: { unit: 4, scale: { "0": "0", "1": "4px", "2": "8px", "3": "12px", "4": "16px", "5": "20px", "6": "24px", "8": "32px", "10": "40px", "12": "48px", "16": "64px", "20": "80px", "24": "96px" } },
      shadows: { none: "none", sm: "0 1px 2px rgba(22, 101, 52, 0.04)", md: "0 4px 6px rgba(22, 101, 52, 0.06)", lg: "0 10px 15px rgba(22, 101, 52, 0.08)", xl: "0 20px 25px rgba(22, 101, 52, 0.1)", "2xl": "0 25px 50px rgba(22, 101, 52, 0.15)", inner: "inset 0 2px 4px rgba(22, 101, 52, 0.04)" },
      grid: { columns: 12, gutter: "24px", margin: "16px", maxWidth: "1280px", breakpoints: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px" } },
      borderRadius: { none: "0", sm: "6px", md: "10px", lg: "14px", xl: "18px", "2xl": "24px", full: "9999px" },
      animations: { duration: { instant: "0ms", fast: "150ms", normal: "250ms", slow: "400ms", slower: "600ms" }, easing: { linear: "linear", easeIn: "cubic-bezier(0.4, 0, 1, 1)", easeOut: "cubic-bezier(0, 0, 0.2, 1)", easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)", spring: "cubic-bezier(0.34, 1.56, 0.64, 1)", bounce: "cubic-bezier(0.68, -0.55, 0.27, 1.55)" }, transitions: { fade: "opacity 250ms ease", scale: "transform 250ms ease", slide: "transform 400ms ease", all: "all 250ms ease", colors: "background-color 250ms, color 250ms", transform: "transform 250ms ease" } },
    },
  },
  {
    name: "Creative Studio",
    description: "Bold, expressive design for creative agencies and portfolios",
    icon: Music,
    tags: ["Bold", "Creative", "Expressive"],
    category: "Industry",
    system: {
      name: "Creative Studio",
      colors: {
        primary: "#8B5CF6",
        secondary: "#EC4899",
        accent: "#F59E0B",
        background: "#FFFFFF",
        surface: "#FAFAF9",
        text: "#18181B",
        textSecondary: "#52525B",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        overlay: "rgba(24, 24, 27, 0.6)",
        border: "#E4E4E7",
        borderLight: "#F4F4F5",
        interactive: {
          primary: { hover: "#A78BFA", active: "#7C3AED", disabled: "#DDD6FE", focus: "#8B5CF6" },
          secondary: { hover: "#F472B6", active: "#DB2777", disabled: "#FBCFE8", focus: "#EC4899" },
          accent: { hover: "#FCD34D", active: "#D97706", disabled: "#FEF3C7", focus: "#F59E0B" },
        },
      },
      darkColors: {
        primary: "#A78BFA",
        secondary: "#F472B6",
        accent: "#FBBF24",
        background: "#09090B",
        surface: "#18181B",
        text: "#FAFAFA",
        textSecondary: "#A1A1AA",
        success: "#34D399",
        warning: "#FBBF24",
        error: "#F87171",
        overlay: "rgba(0, 0, 0, 0.8)",
        border: "#27272A",
        borderLight: "#18181B",
        interactive: {
          primary: { hover: "#C4B5FD", active: "#8B5CF6", disabled: "#3B2B66", focus: "#A78BFA" },
          secondary: { hover: "#F9A8D4", active: "#EC4899", disabled: "#5C1F40", focus: "#F472B6" },
          accent: { hover: "#FDE68A", active: "#F59E0B", disabled: "#4D3B12", focus: "#FBBF24" },
        },
      },
      typography: {
        fontFamily: { heading: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif", body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", mono: "'Space Mono', monospace" },
        sizes: { xs: "12px", sm: "14px", base: "16px", lg: "18px", xl: "24px", "2xl": "32px", "3xl": "40px", "4xl": "56px", "5xl": "72px" },
        weights: { normal: 400, medium: 500, semibold: 600, bold: 700 },
        lineHeights: { tight: "1.1", normal: "1.5", relaxed: "1.7" },
      },
      spacing: { unit: 4, scale: { "0": "0", "1": "4px", "2": "8px", "3": "12px", "4": "16px", "5": "20px", "6": "24px", "8": "32px", "10": "40px", "12": "48px", "16": "64px", "20": "80px", "24": "96px" } },
      shadows: { none: "none", sm: "0 2px 4px rgba(139, 92, 246, 0.08)", md: "0 4px 12px rgba(139, 92, 246, 0.12)", lg: "0 8px 24px rgba(139, 92, 246, 0.16)", xl: "0 16px 40px rgba(139, 92, 246, 0.2)", "2xl": "0 24px 60px rgba(139, 92, 246, 0.25)", inner: "inset 0 2px 4px rgba(139, 92, 246, 0.06)" },
      grid: { columns: 12, gutter: "32px", margin: "24px", maxWidth: "1440px", breakpoints: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px" } },
      borderRadius: { none: "0", sm: "8px", md: "12px", lg: "16px", xl: "24px", "2xl": "32px", full: "9999px" },
      animations: { duration: { instant: "0ms", fast: "100ms", normal: "200ms", slow: "400ms", slower: "600ms" }, easing: { linear: "linear", easeIn: "cubic-bezier(0.4, 0, 1, 1)", easeOut: "cubic-bezier(0, 0, 0.2, 1)", easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)", spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)", bounce: "cubic-bezier(0.68, -0.55, 0.27, 1.55)" }, transitions: { fade: "opacity 200ms ease", scale: "transform 200ms ease", slide: "transform 400ms ease", all: "all 200ms ease", colors: "background-color 200ms, color 200ms", transform: "transform 200ms ease" } },
    },
  },
];

const categories = ["All", "Framework", "Inspired", "Industry"];

export const DesignSystemPresets = ({ onApplyPreset }: DesignSystemPresetsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPresets = presets.filter((preset) => {
    const matchesSearch = 
      preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || preset.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Design System Presets
        </CardTitle>
        <CardDescription>Start from popular design systems and customize to your needs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search presets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Presets Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPresets.map((preset) => (
            <Card key={preset.name} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ background: preset.system.colors.primary + "20" }}>
                    <preset.icon className="h-5 w-5" style={{ color: preset.system.colors.primary }} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{preset.name}</h3>
                    <Badge variant="outline" className="text-xs mt-1">{preset.category}</Badge>
                  </div>
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

        {filteredPresets.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No presets found matching your search.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
