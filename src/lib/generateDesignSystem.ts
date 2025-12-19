import { supabase } from "@/integrations/supabase/client";
import { DesignSystemInput, GeneratedDesignSystem, SemanticColors, ColorPalette, DarkModeColors, AnimationTokens } from "@/types/designSystem";
import { generateInteractiveStates, hslToString, parseHslString, hexToHsl } from "./colorUtils";

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
  
  // Ensure the AI response has all required fields, fill in missing ones
  const aiSystem = data.designSystem;
  return ensureCompleteDesignSystem(aiSystem, input);
}

function ensureCompleteDesignSystem(aiSystem: Partial<GeneratedDesignSystem>, input: DesignSystemInput): GeneratedDesignSystem {
  const fallback = generateDesignSystemFallback(input);
  
  // Merge colors with interactive states
  const colors: ColorPalette = {
    primary: aiSystem.colors?.primary || fallback.colors.primary,
    secondary: aiSystem.colors?.secondary || fallback.colors.secondary,
    accent: aiSystem.colors?.accent || fallback.colors.accent,
    background: aiSystem.colors?.background || fallback.colors.background,
    surface: aiSystem.colors?.surface || fallback.colors.surface,
    text: aiSystem.colors?.text || fallback.colors.text,
    textSecondary: aiSystem.colors?.textSecondary || fallback.colors.textSecondary,
    success: aiSystem.colors?.success || fallback.colors.success,
    warning: aiSystem.colors?.warning || fallback.colors.warning,
    error: aiSystem.colors?.error || fallback.colors.error,
    overlay: aiSystem.colors?.overlay || fallback.colors.overlay,
    border: aiSystem.colors?.border || fallback.colors.border,
    borderLight: aiSystem.colors?.borderLight || fallback.colors.borderLight,
    interactive: aiSystem.colors?.interactive || generateSemanticColors(
      aiSystem.colors?.primary || fallback.colors.primary,
      aiSystem.colors?.secondary || fallback.colors.secondary,
      aiSystem.colors?.accent || fallback.colors.accent
    ),
  };

  return {
    name: aiSystem.name || fallback.name,
    colors,
    darkColors: aiSystem.darkColors || generateDarkModeColors(colors),
    typography: aiSystem.typography || fallback.typography,
    spacing: aiSystem.spacing || fallback.spacing,
    shadows: aiSystem.shadows || fallback.shadows,
    grid: aiSystem.grid || fallback.grid,
    borderRadius: aiSystem.borderRadius || fallback.borderRadius,
    animations: aiSystem.animations || fallback.animations,
  };
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

function generateSemanticColors(primary: string, secondary: string, accent: string): SemanticColors {
  return {
    primary: generateInteractiveStates(primary),
    secondary: generateInteractiveStates(secondary),
    accent: generateInteractiveStates(accent),
  };
}

function generateDarkModeColors(lightColors: ColorPalette): DarkModeColors {
  const primaryHsl = parseHslString(lightColors.primary);
  const secondaryHsl = parseHslString(lightColors.secondary);
  const accentHsl = parseHslString(lightColors.accent);
  
  const darkPrimary = primaryHsl ? hslToString(primaryHsl.h, Math.min(primaryHsl.s + 10, 100), Math.min(primaryHsl.l + 15, 70)) : lightColors.primary;
  const darkSecondary = secondaryHsl ? hslToString(secondaryHsl.h, Math.min(secondaryHsl.s + 10, 100), Math.min(secondaryHsl.l + 15, 70)) : lightColors.secondary;
  const darkAccent = accentHsl ? hslToString(accentHsl.h, Math.min(accentHsl.s + 10, 100), Math.min(accentHsl.l + 15, 70)) : lightColors.accent;
  
  return {
    primary: darkPrimary,
    secondary: darkSecondary,
    accent: darkAccent,
    background: "hsl(220, 20%, 10%)",
    surface: "hsl(220, 18%, 14%)",
    text: "hsl(220, 15%, 95%)",
    textSecondary: "hsl(220, 10%, 65%)",
    success: "hsl(145, 70%, 50%)",
    warning: "hsl(38, 95%, 55%)",
    error: "hsl(0, 75%, 55%)",
    overlay: "hsla(220, 20%, 5%, 0.8)",
    border: "hsl(220, 15%, 25%)",
    borderLight: "hsl(220, 15%, 20%)",
    interactive: generateSemanticColors(darkPrimary, darkSecondary, darkAccent),
  };
}

function generateAnimationTokens(brandMood: string[]): AnimationTokens {
  const isPlayful = brandMood.includes("playful") || brandMood.includes("energetic");
  const isElegant = brandMood.includes("elegant") || brandMood.includes("luxurious");
  const isMinimal = brandMood.includes("minimalist");
  
  return {
    duration: {
      instant: "50ms",
      fast: isPlayful ? "100ms" : "150ms",
      normal: isMinimal ? "200ms" : "300ms",
      slow: isElegant ? "500ms" : "400ms",
      slower: "600ms",
    },
    easing: {
      linear: "linear",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      easeOut: "cubic-bezier(0, 0, 0.2, 1)",
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      spring: isPlayful ? "cubic-bezier(0.175, 0.885, 0.32, 1.275)" : "cubic-bezier(0.34, 1.56, 0.64, 1)",
      bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },
    transitions: {
      fade: isMinimal ? "opacity 200ms ease-out" : "opacity 300ms ease-out",
      scale: "transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
      slide: "transform 300ms ease-out",
      all: isElegant ? "all 400ms ease-in-out" : "all 300ms ease-in-out",
      colors: "color 200ms ease, background-color 200ms ease, border-color 200ms ease",
      transform: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
  };
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

  const primaryColor = hslToString(primaryHue, primarySaturation, 50);
  const secondaryColor = hslToString((primaryHue + 30) % 360, primarySaturation - 20, 55);
  const accentColor = hslToString((primaryHue + 180) % 360, primarySaturation, 55);

  const colors: ColorPalette = {
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
    background: hslToString(primaryHue, 10, 98),
    surface: hslToString(primaryHue, 10, 100),
    text: hslToString(primaryHue, 15, 15),
    textSecondary: hslToString(primaryHue, 10, 45),
    success: hslToString(145, 65, 42),
    warning: hslToString(38, 92, 50),
    error: hslToString(0, 72, 51),
    overlay: `hsla(${primaryHue}, 20%, 10%, 0.6)`,
    border: hslToString(primaryHue, 15, 80),
    borderLight: hslToString(primaryHue, 10, 90),
    interactive: generateSemanticColors(primaryColor, secondaryColor, accentColor),
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

  const animations = generateAnimationTokens(input.brandMood);
  const darkColors = generateDarkModeColors(colors);

  return {
    name: `${input.industry.charAt(0).toUpperCase() + input.industry.slice(1)} Design System`,
    colors,
    darkColors,
    typography,
    spacing,
    shadows,
    grid,
    borderRadius,
    animations,
  };
}
