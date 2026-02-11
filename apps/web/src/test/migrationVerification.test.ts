
import { describe, it, expect } from 'vitest';
import { generateDesignSystemFallback } from '../lib/generateDesignSystem';
import { generateComponentVariants } from '../lib/componentVariants';
import { DesignSystemInput } from '../types/designSystem';

describe('Design System Migration Verification', () => {

    const input: DesignSystemInput = {
        appType: "web",
        industry: "tech",
        brandMood: ["modern", "clean"],
        description: "Test system"
    };

    it('should generate deterministic fallback with patterns', async () => {
        const system = await generateDesignSystemFallback(input);

        expect(system).toBeDefined();
        expect(system.colors).toBeDefined();
        // Check for pattern influence (modern mood -> likely Inter font)
        expect(system.typography.fontFamily.heading).toBe('Inter');
        expect(system.spacing.unit).toBe(4);
    });

    it('should generate component variants using patterns', async () => {
        // First get a basic system
        const system = await generateDesignSystemFallback(input);

        // Then generate components
        const components = await generateComponentVariants(system);

        expect(components).toBeDefined();
        expect(components.Button).toBeDefined();
        expect(components.Button.variants).toBeDefined();
        // Check for specific pattern-based variant if applicable, or just structure
        expect(components.Button.variants.primary).toBeDefined();
        expect(components.Button.properties.variant).toContain('primary');
    });
});
