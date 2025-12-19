import { supabase } from "@/integrations/supabase/client";
import { DesignSystemInput, GeneratedDesignSystem } from "@/types/designSystem";

export async function generateDesignSystemWithAI(input: DesignSystemInput): Promise<GeneratedDesignSystem> {
  console.log("Calling AI to generate design system...", input);
  
  const { data, error } = await supabase.functions.invoke("generate-design-system", {
    body: {
      appType: input.appType,
      industry: input.industry,
      brandMood: input.brandMood,
      primaryColor: input.primaryColor,
      description: input.description,
    },
  });

  if (error) {
    console.error("Edge function error:", error);
    throw new Error(error.message || "Failed to generate design system");
  }

  if (data?.error) {
    console.error("AI generation error:", data.error);
    throw new Error(data.error);
  }

  if (!data?.designSystem) {
    throw new Error("No design system returned from AI");
  }

  console.log("AI generated design system:", data.designSystem);
  return data.designSystem;
}

// Fallback local generation (used if AI fails)
const moodColorMappings: Record<string, { hue: number; saturation: number }> = {
  modern: { hue: 220, saturation: 85 },
  playful: { hue: 340, saturation: 80 },
  professional: { hue: 215, saturation: 60 },
  elegant: { hue: 280, saturation: 30 },
  minimalist: { hue: 0, saturation: 0 },
  bold: { hue: 10, saturation: 90 },
  calm: { hue: 180, saturation: 40 },
  energetic: { hue: 35, saturation: 95 },
  luxurious: { hue: 45, saturation: 70 },
  friendly: { hue: 150, saturation: 60 },
};

const industryFonts: Record<string, { heading: string; body: string }> = {
  technology: { heading: "Inter", body: "Inter" },
  healthcare: { heading: "Nunito", body: "Open Sans" },
  finance: { heading: "Playfair Display", body: "Lato" },
  education: { heading: "Merriweather", body: "Source Sans Pro" },
  ecommerce: { heading: "Poppins", body: "Roboto" },
  creative: { heading: "Outfit", body: "DM Sans" },
  food: { heading: "Montserrat", body: "Quicksand" },
  travel: { heading: "Josefin Sans", body: "Raleway" },
  fitness: { heading: "Oswald", body: "Lato" },
  other: { heading: "Poppins", body: "Inter" },
};

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 220, s: 85, l: 50 };

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToString(h: number, s: number, l: number): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function generateDesignSystemFallback(input: DesignSystemInput): GeneratedDesignSystem {
  let primaryHue = 220;
  let primarySaturation = 85;

  if (input.primaryColor) {
    const hsl = hexToHsl(input.primaryColor);
    primaryHue = hsl.h;
    primarySaturation = hsl.s;
  } else if (input.brandMood.length > 0) {
    const mood = moodColorMappings[input.brandMood[0]] || moodColorMappings.modern;
    primaryHue = mood.hue;
    primarySaturation = mood.saturation;
  }

  const colors = {
    primary: hslToString(primaryHue, primarySaturation, 50),
    secondary: hslToString((primaryHue + 30) % 360, primarySaturation - 20, 55),
    accent: hslToString((primaryHue + 180) % 360, primarySaturation, 55),
    background: hslToString(primaryHue, 10, 98),
    surface: hslToString(primaryHue, 10, 100),
    text: hslToString(primaryHue, 15, 15),
    textSecondary: hslToString(primaryHue, 10, 45),
    success: hslToString(145, 65, 42),
    warning: hslToString(38, 92, 50),
    error: hslToString(0, 72, 51),
  };

  const fonts = industryFonts[input.industry] || industryFonts.other;
  const baseSize = input.appType === "mobile" ? 16 : 16;

  const typography = {
    fontFamily: {
      heading: fonts.heading,
      body: fonts.body,
      mono: "JetBrains Mono",
    },
    sizes: {
      xs: `${baseSize * 0.75}px`,
      sm: `${baseSize * 0.875}px`,
      base: `${baseSize}px`,
      lg: `${baseSize * 1.125}px`,
      xl: `${baseSize * 1.25}px`,
      "2xl": `${baseSize * 1.5}px`,
      "3xl": `${baseSize * 1.875}px`,
      "4xl": `${baseSize * 2.25}px`,
      "5xl": `${baseSize * 3}px`,
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.75",
    },
  };

  const spacingUnit = 4;
  const spacing = {
    unit: spacingUnit,
    scale: {
      "0": "0px",
      "1": `${spacingUnit}px`,
      "2": `${spacingUnit * 2}px`,
      "3": `${spacingUnit * 3}px`,
      "4": `${spacingUnit * 4}px`,
      "5": `${spacingUnit * 5}px`,
      "6": `${spacingUnit * 6}px`,
      "8": `${spacingUnit * 8}px`,
      "10": `${spacingUnit * 10}px`,
      "12": `${spacingUnit * 12}px`,
      "16": `${spacingUnit * 16}px`,
      "20": `${spacingUnit * 20}px`,
      "24": `${spacingUnit * 24}px`,
    },
  };

  const isMinimal = input.brandMood.includes("minimalist");
  const shadows = {
    none: "none",
    sm: isMinimal
      ? "0 1px 2px 0 rgb(0 0 0 / 0.03)"
      : "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: isMinimal
      ? "0 2px 4px -1px rgb(0 0 0 / 0.06)"
      : "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: isMinimal
      ? "0 4px 6px -2px rgb(0 0 0 / 0.05)"
      : "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  };

  const grid = {
    columns: input.appType === "mobile" ? 4 : 12,
    gutter: input.appType === "mobile" ? "16px" : "24px",
    margin: input.appType === "mobile" ? "16px" : "32px",
    maxWidth: input.appType === "mobile" ? "100%" : "1280px",
    breakpoints: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  };

  const isPlayful = input.brandMood.includes("playful") || input.brandMood.includes("friendly");
  const radiusBase = isPlayful ? 16 : input.brandMood.includes("minimalist") ? 4 : 8;

  const borderRadius = {
    none: "0px",
    sm: `${radiusBase * 0.5}px`,
    md: `${radiusBase}px`,
    lg: `${radiusBase * 1.5}px`,
    xl: `${radiusBase * 2}px`,
    "2xl": `${radiusBase * 3}px`,
    full: "9999px",
  };

  return {
    name: `${input.industry.charAt(0).toUpperCase() + input.industry.slice(1)} Design System`,
    colors,
    typography,
    spacing,
    shadows,
    grid,
    borderRadius,
  };
}
