import { invokeWithRetry } from "./utils";

import { patternRepository } from "./patterns/repository";
import { aiCircuitBreaker } from "./circuitBreaker";
import { typographyPatterns, getTypeScaleRatio, generateTypeScale } from "./patterns/definitions/typography";
import { colorPatterns, moodColorMappings } from "./patterns/definitions/colors";
import { spacingPatterns } from "./patterns/definitions/spacing";
import { trackGeneration } from "./metrics";

export function initializePatterns() {
  patternRepository.registerPatterns(typographyPatterns);
  patternRepository.registerPatterns(colorPatterns);
  patternRepository.registerPatterns(spacingPatterns);
}

export async function generateDesignSystemWithAI(input: DesignSystemInput): Promise<GeneratedDesignSystem> {
  const startTime = performance.now();
  monitor.debug("Calling AI to generate design system...", { input });

  try {
    // Start AI Generation in parallel with Pattern matching
    const aiPromise = aiCircuitBreaker.execute(() => invokeWithRetry("generate-design-system", {
      body: {
        appType: input.appType,
        industry: input.industry,
        brandMood: input.brandMood,
        primaryColor: input.primaryColor,
        description: input.description,
      },
    }));

    // Initialize Pattern Repository with Tier 1 patterns
    initializePatterns();

    // Start Pattern Fetches immediately
    const typographyPromise = patternRepository.findPatterns({
      category: "typography",
      tags: input.brandMood
    });

    const colorPromise = !input.primaryColor
      ? patternRepository.findPatterns({ category: "colors", tags: input.brandMood })
      : Promise.resolve([]);

    const spacingPromise = patternRepository.findPatterns({
      category: "spacing",
      tags: input.brandMood
    });

    // Await all results
    const [aiResult, typographyCandidates, colorCandidates, spacingCandidates] = await Promise.all([
      aiPromise,
      typographyPromise,
      colorPromise,
      spacingPromise
    ]);

    const { data, error } = aiResult;

    if (error) {
      throw new Error(error.message || "Failed to generate design system after retries");
    }

    if (data?.error) {
      throw new Error(data.error);
    }

    if (!data?.designSystem) {
      throw new Error("No design system returned from AI");
    }

    monitor.debug("AI generated design system", { designSystem: data.designSystem });

    const bestTypographyMatch = typographyCandidates[0]?.data;
    const bestColorMatch = colorCandidates[0]?.data;
    const bestSpacingMatch = spacingCandidates[0]?.data;

    const aiSystem = data.designSystem;

    // A/B Test: Log comparison between AI and Pattern suggestions
    monitor.info("[A/B Test] Tier 1 Generation Comparison", {
      industry: input.industry,
      mood: input.brandMood,
      typography: {
        ai: aiSystem.typography?.fontFamily,
        pattern: bestTypographyMatch?.typography?.fontFamily,
        match: aiSystem.typography?.fontFamily?.heading === bestTypographyMatch?.typography?.fontFamily?.heading
      },
      colors: {
        aiPrimary: aiSystem.colors?.primary,
        patternPrimary: bestColorMatch?.colors?.primary,
        match: aiSystem.colors?.primary === bestColorMatch?.colors?.primary
      },
      spacing: {
        aiUnit: aiSystem.spacing?.unit,
        patternUnit: bestSpacingMatch?.spacing?.unit
      }
    });

    // Ensure the AI response has all required fields, fill in missing ones
    const result = await ensureCompleteDesignSystem(aiSystem, input, bestTypographyMatch, bestColorMatch, bestSpacingMatch);

    trackGeneration({
      source: "ai",
      durationMs: performance.now() - startTime,
      success: true,
      metadata: { industry: input.industry }
    });

    return result;

  } catch (err: any) {
    trackGeneration({
      source: "ai",
      durationMs: performance.now() - startTime,
      success: false,
      error: err.message,
      metadata: { industry: input.industry }
    });
    monitor.error("AI Generation failed, falling back...", err);
    throw err;
  }
}

async function ensureCompleteDesignSystem(
  aiSystem: Partial<GeneratedDesignSystem>,
  input: DesignSystemInput,
  typographyOverride?: any,
  colorOverride?: any,
  spacingOverride?: any
): Promise<GeneratedDesignSystem> {
  const fallback = await generateDesignSystemFallback(input, typographyOverride, colorOverride, spacingOverride); // This is effectively our base pattern  


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

  const result: GeneratedDesignSystem = {
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

  // Add tokenStore for semantic resolution
  result.tokenStore = organizeTokens(result);

  // Add component variants
  result.components = await generateComponentVariants(result);

  // Legacy fallback for engine (optional, can be removed if Engine uses store)
  // result.tokenStore = TokenEngine.fromDesignSystem(result); 

  return result;
}

// import { TokenEngine } from "./theming/tokenEngine";
import { generateComponentVariants } from "./componentVariants";
import { organizeTokens } from "./tokenCollections";

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

export async function generateDesignSystemFallback(
  input: DesignSystemInput,
  typographyOverride?: any,
  colorOverride?: any,
  spacingOverride?: any
): Promise<GeneratedDesignSystem> {
  // 1. Smart Colors with Harmony
  let primaryHue = 220;
  let primarySaturation = 85;

  initializePatterns();

  // Pattern Fetching (if overrides not provided)
  let bestColorMatch = colorOverride;
  let bestTypographyMatch = typographyOverride;
  let bestSpacingMatch = spacingOverride;

  if (!bestColorMatch && !input.primaryColor) {
    const candidates = await patternRepository.findPatterns({ category: "colors", tags: input.brandMood });
    bestColorMatch = candidates[0]?.data;
  }
  if (!bestTypographyMatch) {
    const candidates = await patternRepository.findPatterns({ category: "typography", tags: input.brandMood });
    bestTypographyMatch = candidates[0]?.data;
  }
  if (!bestSpacingMatch) {
    const candidates = await patternRepository.findPatterns({ category: "spacing", tags: input.brandMood });
    bestSpacingMatch = candidates[0]?.data;
  }

  if (input.primaryColor) {
    const hsl = hexToHsl(input.primaryColor);
    primaryHue = hsl.h;
    primarySaturation = hsl.s;
  } else if (bestColorMatch && bestColorMatch.primary) {
    // Use Pattern Override
    primaryHue = bestColorMatch.primary.hue;
    primarySaturation = bestColorMatch.primary.saturation;
    monitor.info("Using Pattern-based Colors", { primary: bestColorMatch.primary });
  } else if (input.brandMood.length > 0) {
    // Find best matching mood (using imported map)
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
  // Use override if provided (from Pattern Engine), otherwise fallback to hardcoded default
  let headingFont = "Inter";
  let bodyFont = "Inter";

  if (bestTypographyMatch) {
    headingFont = bestTypographyMatch.heading || "Inter";
    bodyFont = bestTypographyMatch.body || "Inter";
    monitor.info("Using Pattern-based Typography", { heading: headingFont, body: bodyFont });
  } else {
    // Minimal fallback if no pattern provided
    headingFont = "Inter";
    bodyFont = "Inter";
  }

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

  let spacing: SpacingScale;

  if (bestSpacingMatch) {
    spacing = bestSpacingMatch as SpacingScale;
    monitor.info("Using Pattern-based Spacing", { unit: spacing.unit });
  } else {
    const spacingUnit = 4;
    spacing = {
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
  }


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
    monitor.info("[Predictive Trend] Applying Fintech Glassmorphism tokens");
  } else if (input.brandMood.includes("brutalism")) {
    // Trend: "Neo-brutalism"
    radiusBase = 2;
    monitor.info("[Predictive Trend] Applying Neo-brutalism sharp tokens");
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
