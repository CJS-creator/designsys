// Color utility functions for accessibility and color manipulation

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 220, s: 85, l: 50 };

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToString(h: number, s: number, l: number): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function parseHslString(hslString: string): { h: number; s: number; l: number } | null {
  const match = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return null;
  return { h: parseInt(match[1]), s: parseInt(match[2]), l: parseInt(match[3]) };
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

// Get relative luminance of a color (for WCAG calculations)
export function getRelativeLuminance(r: number, g: number, b: number): number {
  const sRGB = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

// Calculate contrast ratio between two colors
export function getContrastRatio(color1: string, color2: string): number {
  const hsl1 = parseHslString(color1);
  const hsl2 = parseHslString(color2);

  if (!hsl1 || !hsl2) return 1;

  const rgb1 = hslToRgb(hsl1.h, hsl1.s, hsl1.l);
  const rgb2 = hslToRgb(hsl2.h, hsl2.s, hsl2.l);

  const L1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const L2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);

  return (lighter + 0.05) / (darker + 0.05);
}

// Get WCAG compliance level
export type WCAGLevel = "AAA" | "AA" | "Fail";
export type TextSize = "normal" | "large";

export function getWCAGCompliance(ratio: number, textSize: TextSize = "normal"): WCAGLevel {
  if (textSize === "large") {
    if (ratio >= 4.5) return "AAA";
    if (ratio >= 3) return "AA";
    return "Fail";
  } else {
    if (ratio >= 7) return "AAA";
    if (ratio >= 4.5) return "AA";
    return "Fail";
  }
}

// Generate interactive color states
export function generateInteractiveStates(baseColor: string): {
  hover: string;
  active: string;
  disabled: string;
  focus: string;
} {
  const hsl = parseHslString(baseColor);
  if (!hsl) {
    return {
      hover: baseColor,
      active: baseColor,
      disabled: "hsl(0, 0%, 70%)",
      focus: baseColor
    };
  }

  return {
    hover: hslToString(hsl.h, Math.min(hsl.s + 5, 100), Math.max(hsl.l - 5, 0)),
    active: hslToString(hsl.h, Math.min(hsl.s + 10, 100), Math.max(hsl.l - 10, 0)),
    disabled: hslToString(hsl.h, Math.max(hsl.s - 40, 10), Math.min(hsl.l + 30, 90)),
    focus: hslToString(hsl.h, Math.min(hsl.s + 15, 100), hsl.l)
  };
}

// Generate dark mode colors from light mode
export function generateDarkModeColor(lightColor: string): string {
  const hsl = parseHslString(lightColor);
  if (!hsl) return lightColor;

  // Invert lightness while preserving hue and saturation
  const newL = Math.abs(100 - hsl.l);
  // Slightly reduce saturation for dark mode
  const newS = Math.max(hsl.s - 10, 0);

  return hslToString(hsl.h, newS, newL);
}

// Phase 3: Advanced Color Algorithms
export type HarmonyType = "complementary" | "split-complementary" | "triadic" | "analogous" | "monochromatic";

export function getHarmoniousColors(baseColor: string, type: HarmonyType): string[] {
  const hsl = parseHslString(baseColor);
  if (!hsl) return [baseColor, baseColor, baseColor];

  const { h, s, l } = hsl;
  const colors: string[] = [];

  switch (type) {
    case "complementary":
      // Base + Complement (180deg)
      colors.push(hslToString((h + 180) % 360, s, l));
      break;

    case "split-complementary":
      // Base + Two adjacent to complement (150deg, 210deg)
      colors.push(hslToString((h + 150) % 360, s, l));
      colors.push(hslToString((h + 210) % 360, s, l));
      break;

    case "triadic":
      // Three colors evenly spaced (120deg, 240deg)
      colors.push(hslToString((h + 120) % 360, s, l));
      colors.push(hslToString((h + 240) % 360, s, l));
      break;

    case "analogous":
      // Three adjacent colors (30deg, -30deg)
      colors.push(hslToString((h + 30) % 360, s, l));
      colors.push(hslToString((h + 330) % 360, s, l));
      break;

    case "monochromatic":
      // Variations in lightness/saturation
      colors.push(hslToString(h, s, Math.max(l - 20, 10)));
      colors.push(hslToString(h, Math.max(s - 30, 10), Math.min(l + 20, 90)));
      break;
  }

  return colors;
}

// Get standard palette roles based on brand mood
export function generatePaletteFromMood(baseColor: string, mood: "energetic" | "trust" | "creative" | "calm" | "modern"): { secondary: string; accent: string } {
  const mapping: Record<string, HarmonyType> = {
    energetic: "triadic", // High contrast, vibrant
    trust: "monochromatic", // Stable, safe
    creative: "split-complementary", // Interesting but balanced
    calm: "analogous", // Harmonious, low tension
    modern: "complementary", // Bold, striking
  };

  const harmonyType = mapping[mood] || "complementary";
  const harmonies = getHarmoniousColors(baseColor, harmonyType);

  // Assign based on generated harmonies
  if (harmonyType === "monochromatic") {
    return {
      secondary: harmonies[0], // Darker/Lighter variation
      accent: harmonies[1],    // Another variation
    };
  } else if (harmonyType === "analogous") {
    return {
      secondary: harmonies[0],
      accent: harmonies[1],
    };
  } else {
    // For contrasting schemes, use the harmonies directly
    return {
      secondary: harmonies[0],
      accent: harmonies.length > 1 ? harmonies[1] : harmonies[0], // Fallback
    };
  }
}
// Phase 7: The Native Tier & AI Refinement
export function fixContrast(
  color: string,
  background: string,
  targetLevel: WCAGLevel = "AA",
  textSize: TextSize = "normal"
): string {
  const hsl = parseHslString(color);
  const bgHsl = parseHslString(background);
  if (!hsl || !bgHsl) return color;

  const { h, s } = hsl;
  let l = hsl.l;
  const targetRatio = targetLevel === "AAA" ? (textSize === "large" ? 4.5 : 7) : (textSize === "large" ? 3 : 4.5);

  let currentRatio = getContrastRatio(hslToString(h, s, l), background);
  if (currentRatio >= targetRatio) return color;

  // Determine if we should lighten or darken
  const isBackgroundDark = bgHsl.l < 50;

  // Iterative adjustment
  let attempts = 0;
  while (currentRatio < targetRatio && attempts < 50) {
    if (isBackgroundDark) {
      l = Math.min(l + 2, 98); // Lighten if bg is dark
    } else {
      l = Math.max(l - 2, 2);  // Darken if bg is light
    }

    currentRatio = getContrastRatio(hslToString(h, s, l), background);
    attempts++;

    if (l >= 98 || l <= 2) break; // Reached limits
  }

  return hslToString(h, s, l);
}

// Phase 13: Semantic Token Helpers
export const getOnColor = (bgHex: string): string => {
  const hsl = hexToHsl(bgHex);
  return hsl.l > 60 ? "#000000" : "#ffffff";
};

export const getContainerColor = (hex: string, isDark: boolean = false): string => {
  const { h, s, l } = hexToHsl(hex);
  if (isDark) {
    return hslToString(h, Math.max(s - 20, 10), 20);
  }
  return hslToString(h, Math.max(s - 10, 5), 92);
};

