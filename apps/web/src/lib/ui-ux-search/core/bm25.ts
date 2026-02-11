/**
 * BM25 Search Engine for UI UX Pro Max
 * Ported from Python to TypeScript
 */

import { loadCSV, type CSVRow, type ParsedCSV } from '../csv';

// BM25 Parameters
const K1 = 1.2;
const B = 0.75;

export interface SearchResult {
    score: number;
    row: CSVRow;
}

interface BM25Engine {
    documents: CSVRow[];
    docLengths: number[];
    avgDocLength: number;
    k1: number;
    b: number;
}

/**
 * Create a new BM25 engine with documents
 */
export function createBM25Engine(documents: CSVRow[]): BM25Engine {
    const docLengths = documents.map(doc => {
        // Calculate document length based on all values
        return Object.values(doc).join(' ').length;
    });

    const avgDocLength = docLengths.length > 0
        ? docLengths.reduce((a, b) => a + b, 0) / docLengths.length
        : 0;

    return {
        documents,
        docLengths,
        avgDocLength,
        k1: K1,
        b: B
    };
}

/**
 * Calculate term frequency in a document
 */
function termFrequency(term: string, text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    const filteredWords = words.filter(w => w.includes(term.toLowerCase()));
    return filteredWords.length / words.length;
}

/**
 * Calculate IDF for a term
 */
function idf(term: string, documents: CSVRow[]): number {
    const docsWithTerm = documents.filter(doc =>
        Object.values(doc).some((v: string) => v.toLowerCase().includes(term.toLowerCase()))
    ).length;

    const N = documents.length;
    // BM25 IDF formula with smoothing
    return Math.log((N - docsWithTerm + 0.5) / (docsWithTerm + 0.5) + 1);
}

/**
 * Calculate BM25 score for a query against a document
 */
export function bm25Score(engine: BM25Engine, docId: number, queryTerms: string[]): number {
    const doc = engine.documents[docId];
    const docLen = engine.docLengths[docId];

    let score = 0;
    const docText = Object.values(doc).join(' ').toLowerCase();

    queryTerms.forEach(term => {
        const tf = termFrequency(term, docText);
        const idfVal = idf(term, engine.documents);

        const numerator = tf * (engine.k1 + 1);
        const denominator = tf + engine.k1 * (1 - engine.b + engine.b * (docLen / engine.avgDocLength));

        score += idfVal * (numerator / denominator);
    });

    return score;
}

/**
 * Search documents using BM25
 */
export function search(engine: BM25Engine, query: string, fields: string[], topK: number = 10): SearchResult[] {
    const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 0);

    if (queryTerms.length === 0) {
        return [];
    }

    const scores = engine.documents.map((doc, docId) => {
        const docText = fields.map(f => doc[f] || '').join(' ').toLowerCase();
        const docLen = engine.docLengths[docId];

        let score = 0;
        queryTerms.forEach(term => {
            const tf = termFrequency(term, docText);
            const idfVal = idf(term, engine.documents);

            const numerator = tf * (engine.k1 + 1);
            const denominator = tf + engine.k1 * (1 - engine.b + engine.b * (docLen / engine.avgDocLength));

            score += idfVal * (numerator / denominator);
        });

        return { score, row: doc };
    });

    return scores
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);
}

// Pre-loaded data cache
let stylesCache: ParsedCSV | null = null;
let colorsCache: ParsedCSV | null = null;
let typographyCache: ParsedCSV | null = null;
let uxGuidelinesCache: ParsedCSV | null = null;
let productsCache: ParsedCSV | null = null;
let chartsCache: ParsedCSV | null = null;
let stacksCache: Record<string, ParsedCSV> = {};

/**
 * Get or load styles data
 */
export async function getStylesData(): Promise<ParsedCSV> {
    if (!stylesCache) {
        stylesCache = await loadCSV('styles.csv');
    }
    return stylesCache;
}

/**
 * Get or load colors data
 */
export async function getColorsData(): Promise<ParsedCSV> {
    if (!colorsCache) {
        colorsCache = await loadCSV('colors.csv');
    }
    return colorsCache;
}

/**
 * Get or load typography data
 */
export async function getTypographyData(): Promise<ParsedCSV> {
    if (!typographyCache) {
        typographyCache = await loadCSV('typography.csv');
    }
    return typographyCache;
}

/**
 * Get or load UX guidelines data
 */
export async function getUXGuidelinesData(): Promise<ParsedCSV> {
    if (!uxGuidelinesCache) {
        uxGuidelinesCache = await loadCSV('ux-guidelines.csv');
    }
    return uxGuidelinesCache;
}

/**
 * Get or load products data
 */
export async function getProductsData(): Promise<ParsedCSV> {
    if (!productsCache) {
        productsCache = await loadCSV('products.csv');
    }
    return productsCache;
}

/**
 * Get or load charts data
 */
export async function getChartsData(): Promise<ParsedCSV> {
    if (!chartsCache) {
        chartsCache = await loadCSV('charts.csv');
    }
    return chartsCache;
}

/**
 * Get or load stack data
 */
export async function getStackData(stack: string): Promise<ParsedCSV> {
    if (!stacksCache[stack]) {
        stacksCache[stack] = await loadCSV(`stacks/${stack}.csv`);
    }
    return stacksCache[stack];
}

/**
 * Search UI styles
 */
export async function searchStyles(query: string, topK: number = 10): Promise<SearchResult[]> {
    const { rows } = await getStylesData();
    if (rows.length === 0) return [];

    const engine = createBM25Engine(rows);
    return search(engine, query, [
        'Style',
        'Keywords',
        'Best For',
        'Do Not Use For',
        'CSS/Technical Keywords'
    ], topK);
}

/**
 * Search color palettes
 */
export async function searchColors(query: string, topK: number = 10): Promise<SearchResult[]> {
    const { rows } = await getColorsData();
    if (rows.length === 0) return [];

    const engine = createBM25Engine(rows);
    return search(engine, query, [
        'Product Type',
        'Notes',
        'Primary (Hex)'
    ], topK);
}

/**
 * Search typography pairings
 */
export async function searchTypography(query: string, topK: number = 10): Promise<SearchResult[]> {
    const { rows } = await getTypographyData();
    if (rows.length === 0) return [];

    const engine = createBM25Engine(rows);
    return search(engine, query, [
        'Font Pairing Name',
        'Category',
        'Mood/Style Keywords',
        'Best For'
    ], topK);
}

/**
 * Search UX guidelines
 */
export async function searchUXGuidelines(query: string, topK: number = 10): Promise<SearchResult[]> {
    const { rows } = await getUXGuidelinesData();
    if (rows.length === 0) return [];

    const engine = createBM25Engine(rows);
    return search(engine, query, [
        'Category',
        'Guideline',
        'Anti-Pattern',
        'Notes'
    ], topK);
}

/**
 * Search products
 */
export async function searchProducts(query: string, topK: number = 10): Promise<SearchResult[]> {
    const { rows } = await getProductsData();
    if (rows.length === 0) return [];

    const engine = createBM25Engine(rows);
    return search(engine, query, [
        'Product Type',
        'Description',
        'Industry'
    ], topK);
}

/**
 * Search charts recommendations
 */
export async function searchCharts(query: string, topK: number = 10): Promise<SearchResult[]> {
    const { rows } = await getChartsData();
    if (rows.length === 0) return [];

    const engine = createBM25Engine(rows);
    return search(engine, query, [
        'Chart Type',
        'Best For',
        'Library',
        'Example'
    ], topK);
}

/**
 * Search stack guidelines
 */
export async function searchStackGuidelines(stack: string, query: string, topK: number = 10): Promise<SearchResult[]> {
    const { rows } = await getStackData(stack);
    if (rows.length === 0) return [];

    const engine = createBM25Engine(rows);
    return search(engine, query, [
        'Category',
        'Guideline',
        'Example',
        'Notes'
    ], topK);
}

/**
 * Unified search across all domains
 */
export async function searchAll(
    query: string,
    options: {
        domain?: 'style' | 'color' | 'typography' | 'ux' | 'product' | 'chart';
        stack?: string;
        topK?: number;
    } = {}
): Promise<{
    styles?: SearchResult[];
    colors?: SearchResult[];
    typography?: SearchResult[];
    uxGuidelines?: SearchResult[];
    products?: SearchResult[];
    charts?: SearchResult[];
}> {
    const { domain, topK = 5 } = options;

    const results: {
        styles?: SearchResult[];
        colors?: SearchResult[];
        typography?: SearchResult[];
        uxGuidelines?: SearchResult[];
        products?: SearchResult[];
        charts?: SearchResult[];
    } = {};

    if (!domain || domain === 'style') {
        results.styles = await searchStyles(query, topK);
    }
    if (!domain || domain === 'color') {
        results.colors = await searchColors(query, topK);
    }
    if (!domain || domain === 'typography') {
        results.typography = await searchTypography(query, topK);
    }
    if (!domain || domain === 'ux') {
        results.uxGuidelines = await searchUXGuidelines(query, topK);
    }
    if (!domain || domain === 'product') {
        results.products = await searchProducts(query, topK);
    }
    if (!domain || domain === 'chart') {
        results.charts = await searchCharts(query, topK);
    }

    return results;
}
