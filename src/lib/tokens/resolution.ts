
export const TOKEN_REF_REGEX = /\{([^}]+)\}/g;

/**
 * Resolves a token value that may contain references to other tokens.
 * Example: "{colors.primary}" -> "#3b82f6"
 */
export function resolveTokenValue(value: string, tokenStore: Record<string, any>): string {
    if (typeof value !== 'string') return value;

    return value.replace(TOKEN_REF_REGEX, (match, path) => {
        const parts = path.split('.');
        let current = tokenStore;
        
        for (const part of parts) {
            if (current && typeof current === 'object') {
                current = current[part];
            } else {
                return match; // Could not resolve
            }
        }

        return typeof current === 'string' ? resolveTokenValue(current, tokenStore) : String(current);
    });
}

/**
 * Detects circular references in a token graph.
 */
export function detectCircularRefs(path: string, tokenStore: Record<string, any>, visited = new Set<string>()): boolean {
    if (visited.has(path)) return true;
    
    const token = tokenStore[path];
    if (!token || typeof token.value !== 'string') return false;

    visited.add(path);
    const refs = [...token.value.matchAll(TOKEN_REF_REGEX)].map(m => m[1]);

    for (const ref of refs) {
        if (detectCircularRefs(ref, tokenStore, new Set(visited))) return true;
    }

    return false;
}
