import { describe, it, expect } from "vitest";
import { TokenEngine } from "@/lib/theming/tokenEngine";
import { UnifiedTokenStore } from "@/types/tokens";

const mockStore: UnifiedTokenStore = {
    collections: {
        foundation: { id: 'f', name: 'Foundation', type: 'foundation', groups: ['colors'] },
        semantic: { id: 's', name: 'Semantic', type: 'semantic', groups: ['brand'] }
    },
    groups: {
        colors: { id: 'colors', name: 'Colors', path: 'colors', tokens: ['colors.blue-500'], groups: [] },
        brand: { id: 'brand', name: 'Brand', path: 'brand', tokens: ['semantic.brand-primary'], groups: [] }
    },
    tokens: {
        'colors.blue-500': { name: 'Blue 500', path: 'colors.blue-500', type: 'color', value: '#3b82f6' },
        'semantic.brand-primary': { name: 'Primary', path: 'semantic.brand-primary', type: 'color', value: '{colors.blue-500}' },
        'components.button-bg': { name: 'Btn BG', path: 'components.button-bg', type: 'color', value: '{semantic.brand-primary}' },
        'typography.h1': {
            name: 'H1',
            path: 'typography.h1',
            type: 'typography',
            value: {
                fontFamily: 'Inter, sans-serif',
                fontSize: '{spacing.xl}',
                fontWeight: '{fontWeights.bold}',
                lineHeight: 1.2
            }
        },
        'spacing.xl': { name: 'XL', path: 'spacing.xl', type: 'spacing', value: '32px' },
        'fontWeights.bold': { name: 'Bold', path: 'fontWeights.bold', type: 'fontWeight', value: 700 },
        'circular.a': { name: 'A', path: 'circular.a', type: 'color', value: '{circular.b}' },
        'circular.b': { name: 'B', path: 'circular.b', type: 'color', value: '{circular.a}' }
    }
};

describe("TokenEngine", () => {
    const engine = new TokenEngine(mockStore);

    it("should resolve simple values correctly", () => {
        const token = engine.resolveToken('colors.blue-500');
        expect(token.value).toBe('#3b82f6');
    });

    it("should resolve single-level aliases", () => {
        const token = engine.resolveToken('semantic.brand-primary');
        expect(token.value).toBe('#3b82f6');
    });

    it("should resolve multi-level chain aliases", () => {
        const token = engine.resolveToken('components.button-bg');
        expect(token.value).toBe('#3b82f6');
    });

    it("should resolve deep object structures", () => {
        const token = engine.resolveToken('typography.h1');
        expect(token.value).toEqual({
            fontFamily: 'Inter, sans-serif',
            fontSize: '32px',
            fontWeight: 700,
            lineHeight: 1.2
        });
    });

    it("should detect circular dependencies", () => {
        expect(() => {
            engine.resolveToken('circular.a');
        }).toThrow(/Circular reference detected/);
    });

    it("should bake templates correctly", () => {
        const template = {
            theme: {
                primary: '{semantic.brand-primary}',
                nested: {
                    size: '{spacing.xl}'
                }
            }
        };
        const baked = engine.bake(template);
        expect(baked).toEqual({
            theme: {
                primary: '#3b82f6',
                nested: {
                    size: '32px'
                }
            }
        });
    });
});
