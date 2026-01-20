import { supabase } from "@/integrations/supabase/client";
import { DesignSystemInput, GeneratedDesignSystem, SemanticColors, ColorPalette, DarkModeColors, AnimationTokens } from "@/types/designSystem";
import { generateInteractiveStates, hslToString, parseHslString, hexToHsl, getOnColor, getContainerColor } from "./colorUtils";

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
    onPrimary: getOnColor(aiSystem.colors?.primary || fallback.colors.primary),
    onSecondary: getOnColor(aiSystem.colors?.secondary || fallback.colors.secondary),
    onAccent: getOnColor(aiSystem.colors?.accent || fallback.colors.accent),
    onBackground: getOnColor(aiSystem.colors?.background || fallback.colors.background),
    onSurface: getOnColor(aiSystem.colors?.surface || fallback.colors.surface),
    primaryContainer: getContainerColor(aiSystem.colors?.primary || fallback.colors.primary),
    onPrimaryContainer: getOnColor(getContainerColor(aiSystem.colors?.primary || fallback.colors.primary)),
    secondaryContainer: getContainerColor(aiSystem.colors?.secondary || fallback.colors.secondary),
    onSecondaryContainer: getOnColor(getContainerColor(aiSystem.colors?.secondary || fallback.colors.secondary)),
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

// Helper Functions
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
    onPrimary: getOnColor(darkPrimary),
    onSecondary: getOnColor(darkSecondary),
    onAccent: getOnColor(darkAccent),
    onBackground: "#ffffff",
    onSurface: "#ffffff",
    primaryContainer: getContainerColor(darkPrimary, true),
    onPrimaryContainer: getOnColor(getContainerColor(darkPrimary, true)),
    secondaryContainer: getContainerColor(darkSecondary, true),
    onSecondaryContainer: getOnColor(getContainerColor(darkSecondary, true)),
    interactive: generateSemanticColors(darkPrimary, darkSecondary, darkAccent),
  };
}

function generateAnimationTokens(brandMood: string[]): AnimationTokens {
  const isPlayful = brandMood.includes("playful") || brandMood.includes("friendly");
  const isEnergetic = brandMood.includes("energetic") || brandMood.includes("bold");
  const isElegant = brandMood.includes("elegant") || brandMood.includes("luxurious");
  const isMinimal = brandMood.includes("minimalist") || brandMood.includes("professional");

  return {
    duration: {
      instant: "50ms",
      fast: isPlayful ? "120ms" : "150ms",
      normal: isMinimal ? "200ms" : "300ms",
      slow: isElegant ? "500ms" : "400ms",
      slower: "700ms",
    },
    easing: {
      linear: "linear",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      easeOut: "cubic-bezier(0, 0, 0.2, 1)",
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      spring: isPlayful
        ? "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
        : isEnergetic
          ? "cubic-bezier(0.42, 1.3, 0.58, 1)"
          : "cubic-bezier(0.34, 1.56, 0.64, 1)",
      bounce: isPlayful
        ? "cubic-bezier(0.68, -0.6, 0.32, 1.6)"
        : "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },
    transitions: {
      fade: `opacity ${isMinimal ? "200ms" : "300ms"} ease-out`,
      scale: `transform ${isPlayful ? "300ms" : "200ms"} ${isPlayful ? "cubic-bezier(0.175, 0.885, 0.32, 1.275)" : "ease-out"}`,
      slide: `transform ${isMinimal ? "200ms" : "300ms"} cubic-bezier(0.16, 1, 0.3, 1)`,
      all: isElegant ? "all 400ms ease-in-out" : "all 300ms ease-in-out",
      colors: "color 200ms ease, background-color 200ms ease, border-color 200ms ease",
      transform: isPlayful ? "transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1)" : "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
  };
}

// Fallback local generation (used if AI fails)
// Now powered by Smarter Algorithms (Phase 3)

import { generatePaletteFromMood } from "./colorUtils";

// Extended Mood Mapping (for primary color selection)
const moodColorMappings: Record<string, { hue: number; saturation: number }> = {
  modern: { hue: 220, saturation: 85 },
  playful: { hue: 340, saturation: 80 },
  professional: { hue: 215, saturation: 60 },
  elegant: { hue: 280, saturation: 30 },
  minimalist: { hue: 0, saturation: 0 },
  bold: { hue: 10, saturation: 90 },
  calm: { hue: 190, saturation: 40 },
  energetic: { hue: 35, saturation: 95 },
  luxurious: { hue: 45, saturation: 70 },
  friendly: { hue: 150, saturation: 60 },
  trust: { hue: 210, saturation: 65 },
  creative: { hue: 260, saturation: 75 },
};

// Phase 3: Smart Font Pairing Library
// Categorized by style and suitable moods
const fontLibrary = {
  sans: [
    { name: "Inter", mood: ["modern", "minimalist", "professional", "technology"] },
    { name: "DM Sans", mood: ["friendly", "modern", "creative"] },
    { name: "Outfit", mood: ["modern", "creative", "bold"] },
    { name: "Nunito", mood: ["friendly", "playful", "healthcare"] },
    { name: "Open Sans", mood: ["professional", "neutral", "education"] },
    { name: "Lato", mood: ["professional", "corporate", "fitness"] },
    { name: "Roboto", mood: ["neutral", "technology", "ecommerce"] },
  ],
  serif: [
    { name: "Playfair Display", mood: ["elegant", "luxurious", "fashion"] },
    { name: "Merriweather", mood: ["trust", "professional", "education"] },
    { name: "Lora", mood: ["calm", "elegant", "creative"] },
  ],
  display: [
    { name: "Oswald", mood: ["bold", "fitness", "energetic"] },
    { name: "Montserrat", mood: ["modern", "bold", "food"] },
    { name: "Quicksand", mood: ["friendly", "playful", "modern"] },
    { name: "Josefin Sans", mood: ["elegant", "creative", "travel"] },
    { name: "Raleway", mood: ["minimalist", "elegant", "creative"] },
  ],
  mono: [
    { name: "JetBrains Mono", mood: ["technology"] },
    { name: "Fira Code", mood: ["technology"] },
  ]
};

function selectSmartFontPair(industry: string, moods: string[]): { heading: string; body: string } {
  // Determine primary mood match
  const primaryMood = moods[0] || "modern";

  // Strategy: 
  // - "Elegant"/"Luxury" -> Serif Heading + Sans Body
  // - "Creative" -> Display Heading + Sans Body
  // - "Tech"/"Modern" -> Sans Heading + Sans Body
  // - "Bold" -> Heavy Sans Heading + Neutral Sans Body

  let headingFont = "Inter";
  let bodyFont = "Inter";

  // Check for specific industry overrides first (legacy support)
  const isSerifIndustry = ["finance", "education", "fashion", "legal"].includes(industry.toLowerCase());
  const isDisplayIndustry = ["food", "fitness", "travel", "music"].includes(industry.toLowerCase());

  if (moods.includes("elegant") || moods.includes("luxurious") || isSerifIndustry) {
    // Serif + Sans pairing
    const serifOption = fontLibrary.serif.find(f => f.mood.some(m => moods.includes(m))) || fontLibrary.serif[0];
    const sansOption = fontLibrary.sans.find(f => f.mood.some(m => moods.includes(m))) || fontLibrary.sans[0];
    headingFont = serifOption.name;
    bodyFont = sansOption.name;
  } else if (moods.includes("bold") || moods.includes("energetic") || isDisplayIndustry) {
    // Display + Sans pairing
    const displayOption = fontLibrary.display.find(f => f.mood.some(m => moods.includes(m))) || fontLibrary.display[0];
    const sansOption = fontLibrary.sans.find(f => f.mood.some(m => moods.includes(m))) || fontLibrary.sans[2]; // Outcome/Inter
    headingFont = displayOption.name;
    bodyFont = sansOption.name;
  } else {
    // Sans + Sans pairing (Safe, Modern)
    // Try to find two different sans fonts for contrast, or just use one good super-family
    const sansHeading = fontLibrary.sans.find(f => f.mood.some(m => moods.includes(m))) || fontLibrary.sans[0];
    const sansBody = fontLibrary.sans.find(f => f.name !== sansHeading.name && f.mood.includes("neutral")) || fontLibrary.sans[4]; // Open Sans
    headingFont = sansHeading.name;
    bodyFont = sansHeading.name === "Inter" ? "Inter" : sansBody.name; // If Inter, use Inter for both
  }

  return { heading: headingFont, body: bodyFont };
}

// Phase 3: Dynamic Typography Scales
function getTypeScaleRatio(moods: string[]): number {
  if (moods.includes("elegant") || moods.includes("luxurious")) return 1.618; // Golden Ratio
  if (moods.includes("bold") || moods.includes("energetic")) return 1.333; // Perfect Fourth
  if (moods.includes("modern") || moods.includes("playful")) return 1.25; // Major Third
  if (moods.includes("calm") || moods.includes("professional")) return 1.2; // Minor Third
  return 1.25; // Default Major Third
}

function generateTypeScale(baseSize: number, ratio: number) {
  const round = (val: number) => Math.round(val);
  return {
    xs: `${round(baseSize / ratio)}px`,
    sm: `${round(baseSize / Math.sqrt(ratio))}px`, // Between base and xs
    base: `${baseSize}px`,
    lg: `${round(baseSize * ratio)}px`,
    xl: `${round(baseSize * ratio * ratio)}px`,
    "2xl": `${round(baseSize * Math.pow(ratio, 3))}px`,
    "3xl": `${round(baseSize * Math.pow(ratio, 4))}px`,
    "4xl": `${round(baseSize * Math.pow(ratio, 5))}px`,
    "5xl": `${round(baseSize * Math.pow(ratio, 6))}px`,
  };
}

export function generateDesignSystemFallback(input: DesignSystemInput): GeneratedDesignSystem {
  // 1. Smart Colors with Harmony
  let primaryHue = 220;
  let primarySaturation = 85;

  if (input.primaryColor) {
    const hsl = hexToHsl(input.primaryColor);
    primaryHue = hsl.h;
    primarySaturation = hsl.s;
  } else if (input.brandMood.length > 0) {
    // Find best matching mood
    const matchedMood = input.brandMood.find(m => moodColorMappings[m]) || "modern";
    const moodParams = moodColorMappings[matchedMood];
    primaryHue = moodParams.hue;
    primarySaturation = moodParams.saturation;
  }

  const primaryColor = hslToString(primaryHue, primarySaturation, 50);

  // Use the new Harmony Engine
  // Map user moods to our harmony types
  const dominantMood = (input.brandMood[0] || "modern") as "energetic" | "trust" | "creative" | "calm" | "modern";
  const { secondary: secondaryColor, accent: accentColor } = generatePaletteFromMood(primaryColor, dominantMood);

  const backgroundColor = hslToString(primaryHue, 10, 98);
  const surfaceColor = hslToString(primaryHue, 10, 100);

  const colors: ColorPalette = {
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
    background: backgroundColor,
    surface: surfaceColor,
    text: hslToString(primaryHue, 15, 15),
    textSecondary: hslToString(primaryHue, 10, 45),
    success: hslToString(145, 65, 42),
    warning: hslToString(38, 92, 50),
    error: hslToString(0, 72, 51),
    overlay: `hsla(${primaryHue}, 20%, 10%, 0.6)`,
    border: hslToString(primaryHue, 15, 80),
    borderLight: hslToString(primaryHue, 10, 90),
    onPrimary: getOnColor(primaryColor),
    onSecondary: getOnColor(secondaryColor),
    onAccent: getOnColor(accentColor),
    onBackground: getOnColor(backgroundColor),
    onSurface: getOnColor(surfaceColor),
    primaryContainer: getContainerColor(primaryColor),
    onPrimaryContainer: getOnColor(getContainerColor(primaryColor)),
    secondaryContainer: getContainerColor(secondaryColor),
    onSecondaryContainer: getOnColor(getContainerColor(secondaryColor)),
    interactive: generateSemanticColors(primaryColor, secondaryColor, accentColor),
  };

  // 2. Smart Font Pairing
  const { heading: headingFont, body: bodyFont } = selectSmartFontPair(input.industry, input.brandMood);

  // 3. Dynamic Typography Scale
  const baseSize = input.appType === "mobile" ? 16 : 16;
  const scaleRatio = getTypeScaleRatio(input.brandMood);
  const typeSizes = generateTypeScale(baseSize, scaleRatio);

  const typography = {
    fontFamily: {
      heading: headingFont,
      body: bodyFont,
      mono: "JetBrains Mono",
    },
    sizes: typeSizes,
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
  let radiusBase = isPlayful ? 16 : input.brandMood.includes("minimalist") ? 4 : 8;

  // Predictive Trends (Phase 11)
  const isFinance = input.industry.toLowerCase().includes("finance");
  const isModern = input.brandMood.includes("modern") || input.brandMood.includes("tech");

  if (isFinance && isModern) {
    // Trend: "Glassmorphism" / Subtle depth for Fintech
    radiusBase = 12;
    console.log("[Predictive Trend] Applying Fintech Glassmorphism tokens");
  } else if (input.brandMood.includes("brutalism")) {
    // Trend: "Neo-brutalism"
    radiusBase = 2;
    console.log("[Predictive Trend] Applying Neo-brutalism sharp tokens");
  }

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
    name: input.industry ? `${input.industry.charAt(0).toUpperCase() + input.industry.slice(1)} Design System` : "Custom Design System",
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
