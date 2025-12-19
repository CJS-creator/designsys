// Color utility functions for accessibility and color manipulation

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 220, s: 85, l: 50 };

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

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
