/**
 * UI UX Pro Max Search Engine
 * Main export file
 */

// CSV parsing
export * from './csv';

// BM25 Search Engine
export {
    search,
    createBM25Engine,
    searchStyles,
    searchColors,
    searchTypography,
    searchUXGuidelines,
    searchProducts,
    searchCharts,
    searchStackGuidelines,
    searchAll,
    type SearchResult
} from './core/bm25';

// Design System Generator
export {
    generateDesignSystem,
    generateCSSVariables,
    generateTailwindConfig,
    generateImplementationGuide,
    type DesignSystemInput,
    type DesignSystemRecommendation,
    type StyleRecommendation,
    type ColorPalette,
    type TypographyPairing,
    type UXGuidelines,
    type StackGuidelines
} from './designSystem';
