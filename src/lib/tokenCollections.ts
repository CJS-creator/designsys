import { GeneratedDesignSystem } from "@/types/designSystem";
import { UnifiedTokenStore, TokenGroup, DesignToken } from "@/types/tokens";
import { v4 as uuidv4 } from "uuid";

export function organizeTokens(system: GeneratedDesignSystem): UnifiedTokenStore {
    const store: UnifiedTokenStore = {
        collections: {},
        groups: {},
        tokens: {}
    };

    // Helper to create token
    const createToken = (name: string, path: string, type: any, value: any): DesignToken => {
        return {
            name,
            path,
            type,
            value,
            description: `Generated ${name} token`,
            status: 'published'
        } as DesignToken;
    };

    // Helper to add group
    const addGroup = (collectionId: string, name: string, parentId?: string): string => {
        const id = uuidv4();
        const group: TokenGroup = {
            id,
            name,
            path: parentId ? `${store.groups[parentId].path}.${name.toLowerCase()}` : name.toLowerCase(),
            parentId,
            tokens: [],
            groups: []
        };
        store.groups[id] = group;

        if (parentId) {
            store.groups[parentId].groups.push(id);
        } else {
            store.collections[collectionId].groups.push(id);
        }
        return id;
    };

    // Helper to add token to group
    const addTokenToGroup = (groupId: string, token: DesignToken) => {
        store.tokens[token.path] = token;
        store.groups[groupId].tokens.push(token.path);
    };

    // 1. Foundation Collection
    const foundationId = uuidv4();
    store.collections[foundationId] = {
        id: foundationId,
        name: "Foundation",
        type: "foundation",
        groups: []
    };

    // Colors Group
    const colorsId = addGroup(foundationId, "Colors");
    Object.entries(system.colors).forEach(([key, value]) => {
        if (typeof value === 'string') {
            addTokenToGroup(colorsId, createToken(key, `colors.${key}`, 'color', value));
        }
    });

    // Typography Group
    const typoId = addGroup(foundationId, "Typography");
    Object.entries(system.typography.fontFamily).forEach(([key, value]) => {
        addTokenToGroup(typoId, createToken(key, `typography.fontFamily.${key}`, 'fontFamily', value));
    });

    // Spacing Group
    const spacingId = addGroup(foundationId, "Spacing");
    Object.entries(system.spacing.scale).forEach(([key, value]) => {
        addTokenToGroup(spacingId, createToken(key, `spacing.${key}`, 'spacing', value));
    });

    // 2. Semantic Collection
    const semanticId = uuidv4();
    store.collections[semanticId] = {
        id: semanticId,
        name: "Semantic",
        type: "semantic",
        groups: []
    };

    // Interactive Group
    const interactiveId = addGroup(semanticId, "Interactive");
    Object.entries(system.colors.interactive).forEach(([key, value]) => {
        const variantId = addGroup(semanticId, key, interactiveId);
        Object.entries(value as any).forEach(([state, color]) => {
            addTokenToGroup(variantId, createToken(state, `interactive.${key}.${state}`, 'color', color));
        });
    });

    // 3. Component Collection (Placeholder for now, populated by component variants logic later if needed)
    const componentId = uuidv4();
    store.collections[componentId] = {
        id: componentId,
        name: "Component",
        type: "component",
        groups: []
    };

    return store;
}
