import { GeneratedDesignSystem } from "@/types/designSystem";
import { DesignToken } from "@/types/tokens";

/**
 * Converts internal DesignToken array into W3C DTCG community group format.
 * Supports nesting, aliases, and explicit types.
 */
export const convertToDTCG = (tokens: DesignToken[], dsName: string): Record<string, unknown> => {
    const result: Record<string, any> = {
        _meta: {
            generated_by: "DesignForge AI",
            version: "1.2",
            description: `DTCG Compliant Tokens for ${dsName}`
        }
    };

    tokens.forEach(token => {
        const parts = token.path.split('.');
        let current = result;

        parts.forEach((part, index) => {
            if (index === parts.length - 1) {
                // Last part, add the token object
                current[part] = {
                    $value: token.ref ? token.ref : (token.value || ""),
                    $type: token.type,
                    $description: token.description || undefined,
                    $extensions: token.extensions || undefined
                };
            } else {
                // Not the last part, ensure group exists
                if (!current[part]) {
                    current[part] = {};
                }
                current = current[part];
            }
        });
    });

    return result;
};

/**
 * Legacy converter for GeneratedDesignSystem
 */
export const convertToW3CTokens = (ds: GeneratedDesignSystem): Record<string, unknown> => {
    // Implement using the newer logic for consistency
    const flattenedTokens: DesignToken[] = [];

    // Flatten colors
    Object.entries(ds.colors).forEach(([key, value]) => {
        flattenedTokens.push({
            name: key,
            path: `color.${key}`,
            type: 'color',
            value: value as string
        });
    });

    // Flatten typography
    Object.entries(ds.typography.fontFamily).forEach(([key, value]) => {
        flattenedTokens.push({
            name: key,
            path: `typography.fontFamily.${key}`,
            type: "fontFamily",
            value: value as string
        });
    });

    Object.entries(ds.typography.sizes).forEach(([key, value]) => {
        flattenedTokens.push({
            name: key,
            path: `typography.fontSize.${key}`,
            type: "fontSize",
            value: value as string
        });
    });

    Object.entries(ds.typography.weights).forEach(([key, value]) => {
        flattenedTokens.push({
            name: key,
            path: `typography.fontWeight.${key}`,
            type: "fontWeight",
            value: value.toString()
        });
    });

    // Flatten spacing
    Object.entries(ds.spacing.scale).forEach(([key, value]) => {
        flattenedTokens.push({
            name: key,
            path: `spacing.${key}`,
            type: "spacing",
            value: value as string
        });
    });

    // Flatten Border Radius
    Object.entries(ds.borderRadius).forEach(([key, value]) => {
        flattenedTokens.push({
            name: key,
            path: `borderRadius.${key}`,
            type: "borderRadius",
            value: value as string
        });
    });

    // Flatten Shadows
    Object.entries(ds.shadows).forEach(([key, value]) => {
        flattenedTokens.push({
            name: key,
            path: `shadow.${key}`,
            type: "shadow",
            value: {
                color: "#00000020",
                x: "0px",
                y: "4px",
                blur: "10px",
                spread: "0px",
                type: "drop"
            },
            description: `Shadow style: ${String(value)}`
        });
    });

    return convertToDTCG(flattenedTokens, ds.name);
};

/**
 * Flattens a GeneratedDesignSystem object into an array of DesignTokens
 * This allows the Tokens tab to work with in-memory data before saving to DB
 */
export const flattenDesignSystemToTokens = (ds: GeneratedDesignSystem): DesignToken[] => {
    const tokens: DesignToken[] = [];

    // Colors
    Object.entries(ds.colors).forEach(([key, value]) => {
        if (typeof value === 'string') {
            tokens.push({
                name: key,
                path: `colors.${key}`,
                type: 'color',
                value: value,
                status: 'draft',
                description: `Brand ${key} color`
            });
        } else if (typeof value === 'object') {
            // Handle nested objects like interactive colors
            Object.entries(value).forEach(([subKey, subValue]) => {
                tokens.push({
                    name: `${key} ${subKey}`,
                    path: `colors.${key}.${subKey}`,
                    type: 'color',
                    value: subValue as string,
                    status: 'draft'
                });
            });
        }
    });

    // Typography - Font Families
    Object.entries(ds.typography.fontFamily).forEach(([key, value]) => {
        tokens.push({
            name: `${key} Font`,
            path: `typography.fontFamily.${key}`,
            type: 'fontFamily',
            value: value,
            status: 'draft'
        });
    });

    // Typography - Sizes
    Object.entries(ds.typography.sizes).forEach(([key, value]) => {
        tokens.push({
            name: `Text ${key}`,
            path: `typography.fontSize.${key}`,
            type: 'fontSize',
            value: value,
            status: 'draft'
        });
    });

    // Typography - Weights
    Object.entries(ds.typography.weights).forEach(([key, value]) => {
        tokens.push({
            name: `Weight ${key}`,
            path: `typography.fontWeight.${key}`,
            type: 'fontWeight',
            value: value,
            status: 'draft'
        });
    });

    // Typography - Line Heights
    Object.entries(ds.typography.lineHeights).forEach(([key, value]) => {
        tokens.push({
            name: `Line Height ${key}`,
            path: `typography.lineHeight.${key}`,
            type: 'lineHeight',
            value: value,
            status: 'draft'
        });
    });

    // Spacing
    Object.entries(ds.spacing.scale).forEach(([key, value]) => {
        tokens.push({
            name: `Spacing ${key}`,
            path: `spacing.${key}`,
            type: 'spacing',
            value: value,
            status: 'draft'
        });
    });

    // Border Radius
    Object.entries(ds.borderRadius).forEach(([key, value]) => {
        tokens.push({
            name: `Radius ${key}`,
            path: `borderRadius.${key}`,
            type: 'borderRadius',
            value: value,
            status: 'draft'
        });
    });

    // Shadows
    Object.entries(ds.shadows).forEach(([key, value]) => {
        tokens.push({
            name: `Shadow ${key}`,
            path: `shadows.${key}`,
            type: 'shadow',
            value: {
                color: "#00000020", // Default as string doesn't fully capture shadow object structure, but this is a reasonable default for now
                x: "0px",
                y: "4px",
                blur: "10px",
                spread: "0px",
                type: "drop"
            },
            status: 'draft',
            description: `Shadow style: ${value}` // Storing the original string value in description for reference
        });
    });

    // Animations - Durations
    if (ds.animations?.duration) {
        Object.entries(ds.animations.duration).forEach(([key, value]) => {
            tokens.push({
                name: `Duration ${key}`,
                path: `animations.duration.${key}`,
                type: 'duration',
                value: value,
                status: 'draft'
            });
        });
    }

    return tokens;
};
