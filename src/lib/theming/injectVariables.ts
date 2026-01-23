import { GeneratedDesignSystem } from "@/types/designSystem";

// Utility to convert hex to HSL for shadcn compatibility
function hexToHSL(hex: string): string {
    if (!hex || !hex.startsWith('#')) return hex;
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;
    if (max === min) h = s = 0;
    else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

import { TokenEngine } from "./tokenEngine";

export function injectDesignSystemVariables(system: GeneratedDesignSystem) {
    // Resolve tokens if store exists
    let resolvedSystem = system;
    if (system.tokenStore) {
        const engine = new TokenEngine(system.tokenStore);
        resolvedSystem = engine.bake(system);
    }

    const root = document.documentElement;
    system = resolvedSystem; // Use resolved system for injection

    // Core shadcn variables mapping
    if (system.colors.primary) root.style.setProperty('--primary', hexToHSL(typeof system.colors.primary === 'string' ? system.colors.primary : (system.colors.primary as any).hover || '#000'));
    if (system.colors.background) root.style.setProperty('--background', hexToHSL(system.colors.background));
    if (system.colors.surface) root.style.setProperty('--card', hexToHSL(system.colors.surface));
    if (system.colors.border) root.style.setProperty('--border', hexToHSL(system.colors.border));
    if (system.colors.text) root.style.setProperty('--foreground', hexToHSL(system.colors.text));

    // Custom DS variables
    Object.entries(system.colors).forEach(([key, value]) => {
        if (typeof value === 'string') root.style.setProperty(`--ds-${key}`, value);
    });

    Object.entries(system.typography.sizes).forEach(([key, value]) => {
        root.style.setProperty(`--ds-font-size-${key}`, value);
    });

    Object.entries(system.spacing.scale).forEach(([key, value]) => {
        root.style.setProperty(`--ds-spacing-${key}`, value);
    });

    Object.entries(system.borderRadius).forEach(([key, value]) => {
        root.style.setProperty(`--ds-radius-${key}`, value);
    });

    Object.entries(system.shadows).forEach(([key, value]) => {
        root.style.setProperty(`--ds-shadow-${key}`, value);
    });

    if (system.borderRadius.md) root.style.setProperty('--radius', system.borderRadius.md);
}
