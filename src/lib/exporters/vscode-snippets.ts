import { GeneratedDesignSystem } from "@/types/designSystem";

export function exportToVSCodeSnippets(ds: GeneratedDesignSystem): string {
    const snippets: Record<string, any> = {};

    // Colors
    Object.entries(ds.colors).forEach(([name, value]) => {
        snippets[`Color: ${name}`] = {
            prefix: `ds-color-${name}`,
            body: [`${value}`],
            description: `DesignForge ${name} color: ${value}`
        };
    });

    // Spacing
    Object.entries(ds.spacing.scale).forEach(([name, value]) => {
        snippets[`Spacing: ${name}`] = {
            prefix: `ds-spacing-${name}`,
            body: [`${value}`],
            description: `DesignForge ${name} spacing: ${value}`
        };
    });

    // Typography
    Object.entries(ds.typography.sizes).forEach(([name, value]) => {
        snippets[`Text Size: ${name}`] = {
            prefix: `ds-text-${name}`,
            body: [`${value}`],
            description: `DesignForge ${name} text size: ${value}`
        };
    });

    return JSON.stringify(snippets, null, 2);
}
