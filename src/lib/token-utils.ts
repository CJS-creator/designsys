import { GeneratedDesignSystem } from "@/types/designSystem";

/**
 * Converts the GeneratedDesignSystem into the Draft W3C Design Token format.
 * https://tr.designtokens.org/format/
 */
export const convertToW3CTokens = (ds: GeneratedDesignSystem): Record<string, unknown> => {
    const tokens = {
        _meta: {
            generated_by: "DesignForge AI",
            version: "1.0",
            description: `W3C Design Tokens for ${ds.name}`
        },
        color: {},
        typography: {
            fontFamily: {},
            fontSize: {},
            fontWeight: {},
            lineHeight: {}
        },
        spacing: {},
        borderRadius: {},
        shadow: {}
    };

    // 1. Colors
    Object.entries(ds.colors).forEach(([key, value]) => {
        if (typeof value === "string") {
            tokens.color[key] = {
                $value: value,
                $type: "color"
            };
        }
    });

    // 2. Typography
    Object.entries(ds.typography.fontFamily).forEach(([key, value]) => {
        tokens.typography.fontFamily[key] = {
            $value: value,
            $type: "fontFamily"
        };
    });

    Object.entries(ds.typography.sizes).forEach(([key, value]) => {
        tokens.typography.fontSize[key] = {
            $value: value,
            $type: "dimension"
        };
    });

    Object.entries(ds.typography.weights).forEach(([key, value]) => {
        tokens.typography.fontWeight[key] = {
            $value: value.toString(),
            $type: "fontWeight"
        };
    });

    // 3. Spacing
    Object.entries(ds.spacing.scale).forEach(([key, value]) => {
        tokens.spacing[key] = {
            $value: value,
            $type: "dimension"
        };
    });

    // 4. Border Radius
    Object.entries(ds.borderRadius).forEach(([key, value]) => {
        tokens.borderRadius[key] = {
            $value: value,
            $type: "dimension"
        };
    });

    // 5. Shadows
    Object.entries(ds.shadows).forEach(([key, value]) => {
        tokens.shadow[key] = {
            $value: value,
            $type: "shadow"
        };
    });

    return tokens;
};
