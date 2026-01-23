import { UnifiedTokenStore, DesignToken, TokenType } from "@/types/tokens";

const REF_REGEX = /^\{([^}]+)\}$/;

export interface ResolvedToken {
    name: string;
    path: string;
    type: TokenType;
    value: any;
    originalValue: any;
    metadata?: Record<string, any>;
}

export type ResolvedTokenMap = Record<string, ResolvedToken>;

export class TokenEngine {
    private store: UnifiedTokenStore;
    private resolvedCache: Map<string, any> = new Map();

    constructor(store: UnifiedTokenStore) {
        this.store = store;
    }

    /**
     * Resolves all tokens in the store and returns a flattened map.
     */
    public resolveAll(): ResolvedTokenMap {
        const result: ResolvedTokenMap = {};
        this.resolvedCache.clear();

        Object.keys(this.store.tokens).forEach(path => {
            result[path] = this.resolveToken(path);
        });

        return result;
    }

    /**
     * Resolves a single token by its path.
     */
    public resolveToken(path: string, seen: Set<string> = new Set()): ResolvedToken {
        if (seen.has(path)) {
            throw new Error(`Circular reference detected: ${Array.from(seen).join(' -> ')} -> ${path}`);
        }

        const token = this.store.tokens[path];
        if (!token) {
            throw new Error(`Token not found at path: ${path}`);
        }

        seen.add(path);

        const resolvedValue = this.resolveValue(token.value, seen);

        return {
            name: token.name,
            path: token.path,
            type: token.type,
            value: resolvedValue,
            originalValue: token.value,
            metadata: token.extensions
        };
    }

    /**
     * Deeply resolves a value, handling strings, numbers, arrays, and objects.
     */
    private resolveValue(value: any, seen: Set<string>): any {
        if (typeof value === 'string') {
            const match = value.match(REF_REGEX);
            if (match) {
                const refPath = match[1];
                // Check cache first to avoid redundant deep resolution
                if (this.resolvedCache.has(refPath)) {
                    return this.resolvedCache.get(refPath);
                }
                const resolved = this.resolveToken(refPath, new Set(seen)).value;
                this.resolvedCache.set(refPath, resolved);
                return resolved;
            }
            return value;
        }

        if (Array.isArray(value)) {
            return value.map(item => this.resolveValue(item, seen));
        }

        if (typeof value === 'object' && value !== null) {
            const resolvedObj: any = {};
            Object.entries(value).forEach(([key, val]) => {
                resolvedObj[key] = this.resolveValue(val, seen);
            });
            return resolvedObj;
        }

        return value;
    }

    /**
     * Bakes the resolved tokens into a structured object matching the target design system interface.
     */
    public bake<T>(template: T): T {
        // This helper will take a structured object (like GeneratedDesignSystem) 
        // and replace any string values that look like references with their resolved counterparts.
        return this.resolveValue(template, new Set());
    }

    /**
     * Migrates a legacy GeneratedDesignSystem into a UnifiedTokenStore.
     */
    public static fromDesignSystem(ds: any): UnifiedTokenStore {
        const store: UnifiedTokenStore = {
            collections: {
                foundation: {
                    id: 'foundation',
                    name: 'Foundation',
                    type: 'foundation',
                    groups: ['colors', 'typography', 'spacing', 'radius', 'shadows']
                },
                semantic: {
                    id: 'semantic',
                    name: 'Semantic',
                    type: 'semantic',
                    groups: []
                }
            },
            groups: {},
            tokens: {}
        };

        const addToken = (group: string, name: string, type: any, value: any) => {
            const path = `${group}.${name}`;
            if (!store.groups[group]) {
                store.groups[group] = { id: group, name: group.charAt(0).toUpperCase() + group.slice(1), path: group, tokens: [], groups: [] };
            }
            store.tokens[path] = { name, path, type, value };
            store.groups[group].tokens.push(path);
        };

        // Migrate Colors
        Object.entries(ds.colors || {}).forEach(([key, value]) => {
            if (typeof value === 'string') addToken('colors', key, 'color', value);
        });

        // Migrate Typography
        Object.entries(ds.typography?.sizes || {}).forEach(([key, value]) => {
            addToken('typography', `size-${key}`, 'fontSize', value);
        });

        // Migrate Spacing
        Object.entries(ds.spacing?.scale || {}).forEach(([key, value]) => {
            addToken('spacing', key, 'spacing', value);
        });

        // Migrate Radius
        Object.entries(ds.borderRadius || {}).forEach(([key, value]) => {
            if (typeof value === 'string') addToken('radius', key, 'borderRadius', value);
        });

        // Migrate Shadows
        Object.entries(ds.shadows || {}).forEach(([key, value]) => {
            if (typeof value === 'string') addToken('shadows', key, 'shadow', value);
        });

        return store;
    }
}
