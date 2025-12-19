export interface DesignSystemInput {
  appType: "mobile" | "web" | "both";
  industry: string;
  brandMood: string[];
  primaryColor?: string;
  description: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  success: string;
  warning: string;
  error: string;
}

export interface TypographyScale {
  fontFamily: {
    heading: string;
    body: string;
    mono: string;
  };
  sizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    "4xl": string;
    "5xl": string;
  };
  weights: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeights: {
    tight: string;
    normal: string;
    relaxed: string;
  };
}

export interface SpacingScale {
  unit: number;
  scale: {
    "0": string;
    "1": string;
    "2": string;
    "3": string;
    "4": string;
    "5": string;
    "6": string;
    "8": string;
    "10": string;
    "12": string;
    "16": string;
    "20": string;
    "24": string;
  };
}

export interface ShadowScale {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  inner: string;
}

export interface GridSystem {
  columns: number;
  gutter: string;
  margin: string;
  maxWidth: string;
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
  };
}

export interface BorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  full: string;
}

export interface GeneratedDesignSystem {
  name: string;
  colors: ColorPalette;
  typography: TypographyScale;
  spacing: SpacingScale;
  shadows: ShadowScale;
  grid: GridSystem;
  borderRadius: BorderRadius;
}
