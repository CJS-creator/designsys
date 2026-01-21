import { GeneratedDesignSystem } from "@/types/designSystem";

export function generateCLISyncScript(ds: GeneratedDesignSystem): string {
    const tick = '`';
    return `#!/usr/bin/env node
/**
 * DesignForge Sync CLI
 * Generated for: ${ds.name}
 * Usage: node designforge-sync.js --output ./tokens
 */

const fs = require('fs');
const path = require('path');

const designSystem = ${JSON.stringify(ds, null, 2)};

const args = process.argv.slice(2);
const outputDir = args.indexOf('--output') !== -1 ? args[args.indexOf('--output') + 1] : './design-tokens';

console.log('🚀 Syncing Design System: ${ds.name}...');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Export JSON
fs.writeFileSync(path.join(outputDir, 'tokens.json'), JSON.stringify(designSystem, null, 2));

// 2. Export CSS Variables
const cssVars = ${tick}:root {
${Object.entries(ds.colors).map(([k, v]) => `  --ds-color-${k}: ${v};`).join('\n')}
${Object.entries(ds.spacing.scale).map(([k, v]) => `  --ds-spacing-${k}: ${v};`).join('\n')}
${Object.entries(ds.borderRadius).map(([k, v]) => `  --ds-radius-${k}: ${v};`).join('\n')}
}${tick};

fs.writeFileSync(path.join(outputDir, 'tokens.css'), cssVars);

console.log('✅ Found ' + Object.keys(designSystem.colors).length + ' colors');
console.log('✅ Found ' + Object.keys(designSystem.typography.sizes).length + ' typography scales');
console.log('📦 Design tokens synced to: ' + path.resolve(outputDir));
`;
}
