import { TokenEngine } from "../lib/theming/tokenEngine";
import { UnifiedTokenStore } from "../types/tokens";

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

async function testResolution() {
    console.log("--- Starting TokenEngine Verification ---");
    const engine = new TokenEngine(mockStore);

    // 1. Basic Resolution
    console.log("Test 1: Basic Resolution...");
    const primary = engine.resolveToken('semantic.brand-primary');
    if (primary.value === '#3b82f6') {
        console.log("✅ Success: semantic.brand-primary resolved to #3b82f6");
    } else {
        console.error("❌ Fail: semantic.brand-primary resolved to", primary.value);
    }

    // 2. Chain Resolution
    console.log("Test 2: Chain Resolution...");
    const btnBg = engine.resolveToken('components.button-bg');
    if (btnBg.value === '#3b82f6') {
        console.log("✅ Success: components.button-bg resolved to #3b82f6");
    } else {
        console.error("❌ Fail: components.button-bg resolved to", btnBg.value);
    }

    // 3. Object Deep Resolution
    console.log("Test 3: Object Deep Resolution...");
    const h1 = engine.resolveToken('typography.h1');
    if (h1.value.fontSize === '32px' && h1.value.fontWeight === 700) {
        console.log("✅ Success: typography.h1 deep resolved correctly");
    } else {
        console.error("❌ Fail: typography.h1 deep resolution:", h1.value);
    }

    // 4. Circular Resolution
    console.log("Test 4: Circular Detection...");
    try {
        engine.resolveToken('circular.a');
        console.error("❌ Fail: Circular reference NOT detected");
    } catch (e: any) {
        if (e.message.includes("Circular reference detected")) {
            console.log("✅ Success: Circular reference detected correctly");
        } else {
            console.error("❌ Fail: Wrong error type:", e.message);
        }
    }

    // 5. Baking Template
    console.log("Test 5: Baking Template...");
    const template = {
        theme: {
            primary: '{semantic.brand-primary}',
            nested: {
                size: '{spacing.xl}'
            }
        }
    };
    const baked = engine.bake(template);
    if (baked.theme.primary === '#3b82f6' && baked.theme.nested.size === '32px') {
        console.log("✅ Success: Template baked correctly");
    } else {
        console.error("❌ Fail: Template baking:", baked);
    }

    console.log("--- Verification Complete ---");
}

testResolution();
