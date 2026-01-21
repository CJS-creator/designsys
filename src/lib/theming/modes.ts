import { GeneratedDesignSystem, ColorPalette, ShadowScale, BorderRadius } from "@/types/designSystem";

export type VisualMode = 'default' | 'brutalism' | 'glassmorphism' | 'minimalist' | 'high-contrast';

export const MODE_OVERRIDES: Record<Exclude<VisualMode, 'default'>, any> = {
    brutalism: {
        borderRadius: {
            none: "0px",
            sm: "0px",
            md: "0px",
            lg: "0px",
            xl: "0px",
            "2xl": "0px",
            full: "0px"
        },
        shadows: {
            none: "none",
            sm: "2px 2px 0px 0px #000",
            md: "4px 4px 0px 0px #000",
            lg: "8px 8px 0px 0px #000",
            xl: "12px 12px 0px 0px #000",
            "2xl": "16px 16px 0px 0px #000",
            inner: "inset 2px 2px 0px 0px #000"
        }
    },
    glassmorphism: {
        shadows: {
            none: "none",
            sm: "0 4px 12px 0 rgba(0, 0, 0, 0.05)",
            md: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
            lg: "0 8px 32px 0 rgba(31, 38, 135, 0.25)",
            xl: "0 8px 32px 0 rgba(31, 38, 135, 0.35)",
            "2xl": "0 8px 32px 0 rgba(31, 38, 135, 0.45)",
            inner: "inset 0 2px 4px 0 rgba(255, 255, 255, 0.3)"
        }
    },
    minimalist: {
        borderRadius: {
            none: "0px",
            sm: "1px",
            md: "2px",
            lg: "4px",
            xl: "6px",
            "2xl": "8px",
            full: "9999px"
        },
        shadows: {
            none: "none",
            sm: "none",
            md: "none",
            lg: "none",
            xl: "none",
            "2xl": "none",
            inner: "none"
        }
    },
    'high-contrast': {
        colors: {
            primary: "#000000",
            secondary: "#FFFFFF",
            accent: "#FF00FF",
            background: "#FFFFFF",
            surface: "#FFFFFF",
            text: "#000000",
            textSecondary: "#000000",
            border: "#000000",
            interactive: {
                primary: { hover: "#333333", active: "#000000", disabled: "#999999", focus: "#000000" }
            }
        }
    }
};

export function mergeTheme(base: GeneratedDesignSystem, brandOverrides: any, mode: VisualMode): GeneratedDesignSystem {
    const themed = JSON.parse(JSON.stringify(base)) as GeneratedDesignSystem;

    // Apply Mode Overrides first
    if (mode !== 'default') {
        const modeData = MODE_OVERRIDES[mode as Exclude<VisualMode, 'default'>];
        if (modeData.borderRadius) themed.borderRadius = { ...themed.borderRadius, ...modeData.borderRadius };
        if (modeData.shadows) themed.shadows = { ...themed.shadows, ...modeData.shadows };
        if (modeData.colors) themed.colors = { ...themed.colors, ...modeData.colors };
    }

    // Apply Brand Overrides
    if (brandOverrides) {
        if (brandOverrides.colors) {
            // If it's a simple string (legacy/simple override), wrap it or handle it
            if (typeof brandOverrides.colors === 'string') {
                themed.colors.primary = brandOverrides.colors;
            } else {
                themed.colors = { ...themed.colors, ...brandOverrides.colors };
            }
        }
        if (brandOverrides.borderRadius) themed.borderRadius = { ...themed.borderRadius, ...brandOverrides.borderRadius };
        if (brandOverrides.shadows) themed.shadows = { ...themed.shadows, ...brandOverrides.shadows };
    }

    return themed;
}
