import { GeneratedDesignSystem } from "@/types/designSystem";
import { DesignToken, TokenType } from "@/types/tokens";

/**
 * Converts internal DesignToken array into W3C DTCG community group format.
 * Supports nesting, aliases, and explicit types.
 */
export const convertToDTCG = (tokens: DesignToken[], dsName: string): Record<string, any> => {
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
            type: 'fontFamily' as any,
            value: value as string
        });
    });

    Object.entries(ds.typography.sizes).forEach(([key, value]) => {
        flattenedTokens.push({
            name: key,
            path: `typography.fontSize.${key}`,
            type: 'dimension' as any,
            value: value as string
        });
    });

    Object.entries(ds.typography.weights).forEach(([key, value]) => {
        flattenedTokens.push({
            name: key,
            path: `typography.fontWeight.${key}`,
            type: 'fontWeight' as any,
            value: value.toString()
        });
    });

    // Flatten spacing
    Object.entries(ds.spacing.scale).forEach(([key, value]) => {
        flattenedTokens.push({
            name: key,
            path: `spacing.${key}`,
            type: 'dimension' as any,
            value: value as string
        });
    });

    // Flatten Border Radius
    Object.entries(ds.borderRadius).forEach(([key, value]) => {
        flattenedTokens.push({
            name: key,
            path: `borderRadius.${key}`,
            type: 'dimension' as any,
            value: value as string
        });
    });

    // Flatten Shadows
    Object.entries(ds.shadows).forEach(([key, value]) => {
        flattenedTokens.push({
            name: key,
            path: `shadow.${key}`,
            type: 'shadow' as any,
            value: value as string
        });
    });

    return convertToDTCG(flattenedTokens, ds.name);
};
