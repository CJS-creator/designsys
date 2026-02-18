import type { ResolvedToken, ResolvedTokenMap } from '@/lib/theming/tokenEngine';

export interface CSSExportOptions {
    /** Prefix for CSS variable names */
    prefix?: string;
    /** CSS scope for variables (default: ':root') */
    scope?: ':root' | ':host' | string;
    /** Output format */
    format?: 'css' | 'scss' | 'less' | 'json';
    /** Token paths to include (whitelist) */
    include?: string[];
    /** Token paths to exclude (blacklist) */
    exclude?: string[];
    /** Add RTL support with logical properties */
    rtl?: boolean;
    /** Minify output */
    minified?: boolean;
    /** Include comments for documentation */
    comments?: boolean;
    /** Include fallback values */
    fallback?: boolean;
    /** Custom property name formatter */
    formatName?: (path: string) => string;
    /** Custom value formatter */
    formatValue?: (value: unknown, token: ResolvedToken) => string;
}

/**
 * Format a token path into a CSS variable name
 */
function defaultFormatName(path: string, prefix: string): string {
    // Convert dot notation to kebab-case
    const kebabPath = path.replace(/\\./g, '-').toLowerCase();
    // Remove any non-alphanumeric characters except hyphens
    const cleanPath = kebabPath.replace(/[^a-z0-9-]/g, '');
    return `--${prefix}-${cleanPath}`;
}

/**
 * Format a token value for CSS output
 */
function defaultFormatValue(value: unknown, token: ResolvedToken): string {
    if (value === null || value === undefined) {
        return 'transparent';
    }

    if (typeof value === 'string') {
        // Check if it's already a CSS variable reference
        if (value.startsWith('var(--')) {
            return value;
        }
        // Check if it contains a CSS variable reference
        if (value.includes('var(--')) {
            return value;
        }
        return value;
    }

    if (typeof value === 'number') {
        // Handle unitless numbers that need units
        const unitlessTokens = ['lineHeight', 'fontWeight', 'opacity', 'zIndex'];
        const pathLower = token.path.toLowerCase();

        if (unitlessTokens.some(t => pathLower.includes(t.toLowerCase()))) {
            return `${value}`;
        }

        // Default to pixels for other numbers
        return `${value}px`;
    }

    if (typeof value === 'object') {
        return JSON.stringify(value);
    }

    return String(value);
}

/**
 * Filter tokens based on include/exclude patterns
 */
function filterTokens(
    path: string,
    include?: string[],
    exclude?: string[]
): boolean {
    if (include && include.length > 0) {
        const matchesInclude = include.some(pattern =>
            path === pattern || path.startsWith(pattern + '.')
        );
        if (!matchesInclude) return false;
    }

    if (exclude && exclude.length > 0) {
        const matchesExclude = exclude.some(pattern =>
            path === pattern || path.startsWith(pattern + '.')
        );
        if (matchesExclude) return false;
    }

    return true;
}

/**
 * Generate CSS custom properties from resolved tokens
 */
export function generateCSSVariables(
    tokens: ResolvedTokenMap,
    options: CSSExportOptions = {}
): string {
    const {
        prefix = 'ds',
        scope = ':root',
        format = 'css',
        include = [],
        exclude = [],
        rtl = false,
        minified = false,
        comments = true,
        fallback = false,
        formatName = (path: string) => defaultFormatName(path, prefix),
        formatValue = defaultFormatValue,
    } = options;

    const filteredTokens = Object.entries(tokens)
        .filter(([path]) => filterTokens(path, include, exclude))
        .sort(([a], [b]) => a.localeCompare(b));

    const lines: string[] = [];

    // Add scope
    if (scope) {
        lines.push(`${scope} {`);
    }

    // Generate CSS custom properties
    filteredTokens.forEach(([path, token]) => {
        const varName = formatName(path);
        const varValue = formatValue(token.value, token);

        // Add comment
        if (comments && token.metadata?.description) {
            const commentText = `  /* ${token.metadata.description} */`;
            if (minified) {
                lines.push(`/* ${token.metadata.description} */`);
            } else {
                lines.push(commentText);
            }
        }

        // Add fallback value if requested
        if (fallback && typeof token.value === 'string' && token.originalValue !== token.value) {
            if (minified) {
                lines.push(`${varName}:${varValue};${varName}-fallback:${token.originalValue};`);
            } else {
                lines.push(`  ${varName}: ${varValue};`);
                lines.push(`  ${varName}-fallback: ${token.originalValue};`);
            }
        } else {
            if (minified) {
                lines.push(`${varName}:${varValue};`);
            } else {
                lines.push(`  ${varName}: ${varValue};`);
            }
        }

        // Add RTL logical property if requested
        if (rtl && isLayoutProperty(path)) {
            const rtlVarName = varName.replace('--', '--rtl-');
            if (minified) {
                lines.push(`${rtlVarName}:${varValue};`);
            } else {
                lines.push(`  ${rtlVarName}: ${varValue};`);
            }
        }
    });

    // Close scope
    if (scope) {
        lines.push('}');
    }

    // Format output based on requested format
    switch (format) {
        case 'scss':
            return formatAsSCSS(lines, minified);
        case 'less':
            return formatAsLESS(lines, minified);
        case 'json':
            return formatAsJSON(tokens, prefix);
        default:
            return minified ? lines.map(l => l.replace(/^ {2}/g, '')).join('') : lines.join('\n');
    }
}

/**
 * Check if a token path represents a layout property
 */
function isLayoutProperty(path: string): boolean {
    const layoutProps = [
        'margin', 'padding', 'border', 'gap', 'inset',
        'start', 'end', 'before', 'after',
    ];
    return layoutProps.some(prop => path.toLowerCase().includes(prop.toLowerCase()));
}

/**
 * Format as SCSS
 */
function formatAsSCSS(lines: string[], minified: boolean): string {
    if (minified) {
        return lines.map(l => l.replace(/^ {2}/g, '$')).join('');
    }
    return lines.map(l => {
        if (l.startsWith(':root')) return l;
        if (l.startsWith('}')) return l;
        return l.replace(/^ {2}/g, '$');
    }).join('\n');
}

/**
 * Format as LESS
 */
function formatAsLESS(lines: string[], minified: boolean): string {
    return lines.map(l => {
        if (l.startsWith(':root')) return l.replace(':root', ':root');
        if (l.startsWith('}')) return l;
        if (l.startsWith('  /*')) return '  // ' + l.slice(4, -3);
        return l.replace(/^ {2}/g, '@');
    }).join(minified ? '' : '\n');
}

/**
 * Format as JSON
 */
function formatAsJSON(tokens: ResolvedTokenMap, prefix: string): string {
    const obj: Record<string, string> = {};

    Object.entries(tokens).forEach(([path, token]) => {
        const varName = `--${prefix}-${path.replace(/\\./g, '-').toLowerCase()}`;
        obj[varName] = typeof token.value === 'string' ? token.value : JSON.stringify(token.value);
    });

    return JSON.stringify(obj, null, 2);
}

/**
 * Generate CSS variables file content for export
 */
export interface ExportFile {
    filename: string;
    content: string;
    language: string;
}

export function generateExportFiles(tokens: ResolvedTokenMap, options: CSSExportOptions = {}): ExportFile[] {
    const { prefix = 'ds' } = options;

    const files: ExportFile[] = [];

    // Main CSS file
    files.push({
        filename: `${prefix}-variables.css`,
        content: generateCSSVariables(tokens, { ...options, format: 'css' }),
        language: 'css',
    });

    // SCSS file
    files.push({
        filename: `${prefix}-variables.scss`,
        content: generateCSSVariables(tokens, { ...options, format: 'scss' }),
        language: 'scss',
    });

    // JSON file (for programmatic use)
    files.push({
        filename: `${prefix}-variables.json`,
        content: generateCSSVariables(tokens, { ...options, format: 'json' }),
        language: 'json',
    });

    // Less file
    files.push({
        filename: `${prefix}-variables.less`,
        content: generateCSSVariables(tokens, { ...options, format: 'less' }),
        language: 'less',
    });

    return files;
}

/**
 * Generate CSS module content
 */
export function generateCSSModule(tokens: ResolvedTokenMap, options: CSSExportOptions = {}): string {
    const { prefix = 'ds', comments = true } = options;

    const lines: string[] = [];

    Object.entries(tokens)
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([path, token]) => {
            // Convert path to camelCase for JS export
            const camelCasePath = path
                .split('.')
                .map((segment, index) =>
                    index === 0 ? segment : segment.charAt(0).toUpperCase() + segment.slice(1)
                )
                .join('');

            const varName = `--${prefix}-${path.replace(/\\./g, '-').toLowerCase()}`;
            const value = typeof token.value === 'string' ? `'${token.value}'` : JSON.stringify(token.value);

            if (comments && token.metadata?.description) {
                lines.push(`// ${token.metadata.description}`);
            }

            lines.push(`export const ${camelCasePath} = 'var(${varName})';`);
            lines.push(`export const ${camelCasePath}Value = ${value};`);
            lines.push('');
        });

    return lines.join('\n');
}

/**
 * Generate TypeScript declarations for CSS variables
 */
export function generateTypeScriptDeclarations(tokens: ResolvedTokenMap, options: CSSExportOptions = {}): string {
    const { prefix = 'ds' } = options;

    const lines: string[] = [];
    lines.push('// Auto-generated CSS variable declarations');
    lines.push('// Do not edit manually');
    lines.push('');
    lines.push(`declare const ${prefix}Variables: {`);

    Object.entries(tokens)
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([path, token]) => {
            const camelCasePath = path
                .split('.')
                .map((segment, index) =>
                    index === 0 ? segment : segment.charAt(0).toUpperCase() + segment.slice(1)
                )
                .join('');

            lines.push(`  ${camelCasePath}: string;`);
            lines.push(`  ${camelCasePath}Value: ${typeof token.value === 'number' ? 'number' : 'string'};`);
        });

    lines.push('};');
    lines.push(`export default ${prefix}Variables;`);

    return lines.join('\n');
}
