import { GeneratedDesignSystem } from "@/types/designSystem";
import { DesignToken } from "@/types/tokens";
import { exportToPDF, exportToWord } from "./asset-exporters";
import { exportToDTCG } from "./dtcg";
import { exportToVSCodeSnippets } from "./vscode-snippets";
import { 
    generateCSSVariables, 
    generateSCSS, 
    generateTailwindConfig, 
    generateFigmaTokens, 
    generateStyleDictionary, 
    generateReactNative,
    generateStorybook,
    generateTokensReference,
    generateREADME,
    generateBrandGuidelines
} from "./web-exporters";
import { exportToFlutterPro } from "./flutter";
import { exportToSwiftUIPro } from "./swiftui";
import { exportToKotlinPro } from "./kotlin";
import { exportToCSSJSPro } from "./css-in-js";
import { exportToFigmaVariables } from "./figma-variables";
import { exportToStorybookAdvanced } from "./storybook-advanced";
import { exportToStaticDocs } from "./static-docs";
import { 
    generateColorSwatchesSVG, 
    renderSwatchesToPNG, 
    generateTypographyPreviewSVG, 
    generateSingleSwatchSVG 
} from "./swatch-renderer";

export type BulkExportCategory = 'all' | 'documentation' | 'tokens' | 'web' | 'mobile' | 'assets';

interface BulkExportOptions {
    onProgress?: (percent: number) => void;
    category?: BulkExportCategory;
}

/**
 * Advanced Packaging Engine
 * Generates a comprehensive design system bundle.
 */
export async function generateBulkBundle(
    ds: GeneratedDesignSystem,
    tokens: DesignToken[],
    options: BulkExportOptions = {}
): Promise<Blob> {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    const category = options.category || 'all';
    
    // Steps estimation for progress
    const steps: { name: string; action: () => Promise<void> }[] = [];
    const errors: string[] = [];

    const safeAdd = async (name: string, fn: () => Promise<void> | void) => {
        try {
            await fn();
        } catch (err: any) {
            console.error(`Exporter Error [${name}]:`, err);
            errors.push(`${name}: ${err.message || 'Unknown error'}`);
        }
    };

    // 1. Documentation
    if (category === 'all' || category === 'documentation') {
        steps.push({ name: "PDF Specification", action: async () => {
            const pdf = await exportToPDF(ds, tokens);
            zip.file("documentation/specification.pdf", pdf);
        }});
        steps.push({ name: "Word Specification", action: async () => {
            const word = await exportToWord(ds, tokens);
            zip.file("documentation/specification.docx", word);
        }});
        steps.push({ name: "Brand Guidelines HTML", action: async () => {
            zip.file("documentation/brand-guidelines.html", generateBrandGuidelines(ds));
        }});
        steps.push({ name: "Tokens Reference MD", action: async () => {
            zip.file("documentation/tokens-reference.md", generateTokensReference(ds, tokens));
        }});
    }

    // 2. Tokens
    if (category === 'all' || category === 'tokens') {
        steps.push({ name: "Raw JSON", action: async () => {
            zip.file("tokens/tokens.json", JSON.stringify(tokens, null, 2));
        }});
        steps.push({ name: "W3C DTCG JSON", action: async () => {
            zip.file("tokens/tokens.dtcg.json", exportToDTCG(tokens));
        }});
        steps.push({ name: "Style Dictionary", action: async () => {
            zip.file("tokens/style-dictionary.json", generateStyleDictionary(ds));
        }});
        steps.push({ name: "Figma Tokens", action: async () => {
            zip.file("tokens/figma-tokens.json", generateFigmaTokens(ds));
        }});
        steps.push({ name: "Figma Variables", action: async () => {
            zip.file("tokens/figma-variables.json", exportToFigmaVariables(ds));
        }});
    }

    // 3. Web
    if (category === 'all' || category === 'web') {
        steps.push({ name: "CSS Variables", action: async () => {
            zip.file("web/variables.css", generateCSSVariables(ds));
        }});
        steps.push({ name: "SCSS Variables", action: async () => {
            zip.file("web/variables.scss", generateSCSS(ds));
        }});
        steps.push({ name: "Tailwind Config", action: async () => {
            zip.file("web/tailwind.config.js", generateTailwindConfig(ds));
        }});
        steps.push({ name: "CSS-in-JS", action: async () => {
            zip.file("web/theme.css-in-js.ts", exportToCSSJSPro(tokens, ds.name));
        }});
        steps.push({ name: "VSCode Snippets", action: async () => {
            zip.file("web/designforge.code-snippets", exportToVSCodeSnippets(ds));
        }});
    }

    // 4. Mobile
    if (category === 'all' || category === 'mobile') {
        steps.push({ name: "React Native", action: async () => {
            zip.file("mobile/theme.react-native.ts", generateReactNative(ds));
        }});
        steps.push({ name: "SwiftUI", action: async () => {
            zip.file("mobile/Theme.swift", exportToSwiftUIPro(tokens, ds.name));
        }});
        steps.push({ name: "Kotlin Compose", action: async () => {
            zip.file("mobile/Theme.kt", exportToKotlinPro(tokens, ds.name));
        }});
        steps.push({ name: "Flutter", action: async () => {
            zip.file("mobile/theme.flutter.dart", exportToFlutterPro(tokens, ds.name));
        }});
    }

    // 5. Assets
    if (category === 'all' || category === 'assets') {
        steps.push({ name: "Color Swatches SVG", action: async () => {
            zip.file("assets/color-swatches.svg", generateColorSwatchesSVG(ds));
        }});
        steps.push({ name: "Color Swatches PNG", action: async () => {
            const png = await renderSwatchesToPNG(ds);
            zip.file("assets/color-swatches.png", png);
        }});
        steps.push({ name: "Typography Preview SVG", action: async () => {
            zip.file("assets/typography-preview.svg", generateTypographyPreviewSVG(ds));
        }});
        steps.push({ name: "Individual Color SVGs", action: async () => {
            Object.entries(ds.colors).forEach(([name, val]) => {
                if (typeof val === 'string') {
                    zip.file(`assets/palette/${name}.svg`, generateSingleSwatchSVG(name, val));
                }
            });
        }});
    }

    // 6. Extras (Static Docs & Storybook)
    if (category === 'all') {
        steps.push({ name: "Static Docs", action: async () => {
            const docsHtml = exportToStaticDocs(ds);
            zip.file("docs-site/index.html", docsHtml);
        }});
        steps.push({ name: "Storybook", action: async () => {
            zip.file("storybook/DesignTokens.stories.tsx", generateStorybook(ds));
            zip.file("storybook/AdvancedTokens.js", exportToStorybookAdvanced(ds));
        }});
    }

    // Process all steps
    const total = steps.length;
    for (let i = 0; i < total; i++) {
        await safeAdd(steps[i].name, steps[i].action);
        if (options.onProgress) {
            options.onProgress(Math.round(((i + 1) / total) * 100));
        }
    }

    // Manifest and README
    if (category === 'all') {
        zip.file("README.md", generateREADME(ds));
        zip.file("manifest.json", JSON.stringify({
            name: ds.name,
            exportedAt: new Date().toISOString(),
            version: "1.2.0",
            category,
            files: Object.keys(zip.files),
            errors: errors.length > 0 ? errors : undefined
        }, null, 2));
    }

    return await zip.generateAsync({ type: "blob" });
}
