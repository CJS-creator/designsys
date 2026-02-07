export interface DesignSystemInput {
  appType: "mobile" | "web" | "both";
  industry: string;
  brandMood: string[];
  primaryColor?: string;
  description: string;
}

export interface InteractiveColors {
  hover: string;
  active: string;
  disabled: string;
  focus: string;
}

export interface SemanticColors {
  primary: InteractiveColors;
  secondary: InteractiveColors;
  accent: InteractiveColors;
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
  // Semantic tokens
  overlay: string;
  border: string;
  borderLight: string;
  onPrimary: string;
  onSecondary: string;
  onAccent: string;
  onBackground: string;
  onSurface: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  interactive: SemanticColors;
}

export interface DarkModeColors {
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
  overlay: string;
  border: string;
  borderLight: string;
  onPrimary: string;
  onSecondary: string;
  onAccent: string;
  onBackground: string;
  onSurface: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  interactive: SemanticColors;
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

export interface AnimationTokens {
  duration: {
    instant: string;
    fast: string;
    normal: string;
    slow: string;
    slower: string;
  };
  easing: {
    linear: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    spring: string;
    bounce: string;
  };
  transitions: {
    fade: string;
    scale: string;
    slide: string;
    all: string;
    colors: string;
    transform: string;
  };
}

import { UnifiedTokenStore } from "./tokens";

export interface ComponentState {
  default: Record<string, string>;
  hover?: Record<string, string>;
  active?: Record<string, string>;
  focus?: Record<string, string>;
  disabled?: Record<string, string>;
}

export interface ComponentVariant {
  name: string;
  styles: ComponentState;
}

export interface ComponentDefinition {
  name: string;
  description?: string;
  variants: Record<string, ComponentVariant>;
  properties: Record<string, string[]>; // e.g. { size: ['sm', 'md', 'lg'], variant: ['primary', 'secondary'] }
}

export interface GeneratedDesignSystem {
  id?: string;
  name: string;
  description?: string;
  colors: ColorPalette;
  darkColors?: DarkModeColors;
  typography: TypographyScale;
  spacing: SpacingScale;
  shadows: ShadowScale;
  grid: GridSystem;
  borderRadius: BorderRadius;
  animations: AnimationTokens;
  tokenStore?: UnifiedTokenStore;
  components?: Record<string, ComponentDefinition>;
  // Governance
  is_published?: boolean;
  version_number?: string;
  live_version_id?: string;
}
