import { GeneratedDesignSystem } from "@/types/designSystem";

interface FigmaColor {
    r: number;
    g: number;
    b: number;
    a: number;
}

function hexToFigmaColor(hex: string): FigmaColor {
    if (!hex || !hex.startsWith('#')) return { r: 0, g: 0, b: 0, a: 1 };

    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    return { r, g, b, a: 1 };
}

function parsePx(value: string): number {
    return parseFloat(value.replace('px', '')) || 0;
}

export function exportToFigmaVariables(system: GeneratedDesignSystem) {
    const payload: any = {
        collections: [
            {
                name: "Brand Tokens",
                modes: ["Default"],
                variables: []
            }
        ]
    };

    const collection = payload.collections[0];

    // Colors
    Object.entries(system.colors).forEach(([key, value]) => {
        if (typeof value === 'string' && value.startsWith('#')) {
            collection.variables.push({
                name: `colors/${key}`,
                type: "COLOR",
                valuesByMode: {
                    "Default": hexToFigmaColor(value)
                }
            });
        }
    });

    // Typography (Sizes only, as Figma Variables don't support Font Family yet, usually handled via Styles or specialized plugins)
    Object.entries(system.typography.sizes).forEach(([key, value]) => {
        collection.variables.push({
            name: `typography/size/${key}`,
            type: "FLOAT",
            valuesByMode: {
                "Default": parsePx(value)
            }
        });
    });

    // Spacing
    Object.entries(system.spacing.scale).forEach(([key, value]) => {
        collection.variables.push({
            name: `spacing/${key}`,
            type: "FLOAT",
            valuesByMode: {
                "Default": parsePx(value)
            }
        });
    });

    // Border Radius
    Object.entries(system.borderRadius).forEach(([key, value]) => {
        collection.variables.push({
            name: `radius/${key}`,
            type: "FLOAT",
            valuesByMode: {
                "Default": parsePx(value)
            }
        });
    });

    return JSON.stringify(payload, null, 2);
}
