export interface DesignToken {
    id: string;
    name: string;
    value: string | number;
    type: string;
    description?: string;
    meta?: Record<string, any>;
}

export interface ColorPalette {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    [key: string]: string;
}

export interface TypographyScale {
    baseSize: number;
    ratio: number;
    sizes: Record<string, string>;
}

export interface FontFamily {
    heading: string;
    body: string;
    mono: string;
}

export interface DesignSystem {
    name: string;
    version: string;
    colors: ColorPalette;
    typography: {
        fonts: FontFamily;
        scale: TypographyScale;
    };
    spacing: Record<string, string>;
    breakpoints: Record<string, string>;
    tokens: DesignToken[];
    meta: {
        industry?: string;
        mood?: string[];
        createdAt: string;
        updatedAt: string;
    };
}

export interface ThemeConfig {
    mode: 'light' | 'dark' | 'system';
    overrides?: Partial<DesignSystem>;
}
