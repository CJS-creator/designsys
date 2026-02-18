// Shared Token Types (inlined from @designsys/shared)

export type TokenType =
    | 'color' | 'dimension' | 'fontFamily' | 'fontWeight'
    | 'fontSize' | 'lineHeight' | 'letterSpacing' | 'paragraph'
    | 'textCase' | 'textDecoration' | 'number' | 'percentage'
    | 'duration' | 'cubicBezier' | 'spacing' | 'borderRadius'
    | 'borderWidth' | 'shadow' | 'gradient' | 'typography'
    | 'composition' | 'asset' | 'border';

export type TokenStatus = 'draft' | 'published' | 'deprecated' | 'archived';

export interface BaseToken {
    id?: string;
    name: string;
    path: string;
    type: TokenType;
    description?: string;
    ref?: string; // Standard reference syntax: {namespace.path.to.token}
    extensions?: Record<string, unknown>;
    status?: TokenStatus;
    stagingValue?: unknown; // The draft value currently being edited
    publishedValue?: unknown; // The currently active/live value (if different from staging)
    syncStatus?: 'synced' | 'changed';
}

export interface ColorToken extends BaseToken {
    type: 'color';
    value: string; // HSL, RGB, or HEX
}

export interface GradientToken extends BaseToken {
    type: 'gradient';
    value: {
        type: 'linear' | 'radial' | 'conic';
        angle?: number;
        stops: Array<{ color: string; position: number }>;
    };
}

export interface DimensionToken extends BaseToken {
    type: 'dimension' | 'spacing' | 'borderRadius' | 'borderWidth' | 'fontSize' | 'lineHeight' | 'letterSpacing' | 'paragraph';
    value: string; // e.g., "16px", "1rem"
}

export interface NumberToken extends BaseToken {
    type: 'number' | 'fontWeight';
    value: number | string; // Allows for references like "{fontWeights.bold}"
}

export interface PercentageToken extends BaseToken {
    type: 'percentage';
    value: string; // e.g. "50%"
}

export interface TypographyToken extends BaseToken {
    type: 'typography';
    value: {
        fontFamily: string;
        fontSize: string;
        fontWeight: number | string;
        lineHeight: string | number;
        letterSpacing?: string;
        textCase?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
        textDecoration?: 'none' | 'underline' | 'line-through';
    };
}

export interface ShadowToken extends BaseToken {
    type: 'shadow';
    value: {
        color: string;
        x: string;
        y: string;
        blur: string;
        spread: string;
        type?: 'inner' | 'drop';
    } | Array<{
        color: string;
        x: string;
        y: string;
        blur: string;
        spread: string;
        type?: 'inner' | 'drop';
    }>;
}

export interface CubicBezierToken extends BaseToken {
    type: 'cubicBezier';
    value: [number, number, number, number];
}

export interface DurationToken extends BaseToken {
    type: 'duration';
    value: string; // e.g., "300ms"
}

export interface CompositionToken extends BaseToken {
    type: 'composition';
    value: Record<string, string>; // References to other tokens (paths)
}

export interface AssetToken extends BaseToken {
    type: 'asset';
    value: string; // URL or path to asset
}

export interface BorderToken extends BaseToken {
    type: 'border';
    value: {
        color: string;
        width: string;
        style: 'solid' | 'dashed' | 'dotted';
    };
}

export interface TextCaseToken extends BaseToken {
    type: 'textCase';
    value: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

export interface TextDecorationToken extends BaseToken {
    type: 'textDecoration';
    value: 'none' | 'underline' | 'line-through';
}

export type DesignToken =
    | ColorToken
    | GradientToken
    | DimensionToken
    | NumberToken
    | PercentageToken
    | TypographyToken
    | ShadowToken
    | CubicBezierToken
    | DurationToken
    | CompositionToken
    | AssetToken
    | TextCaseToken
    | TextDecorationToken
    | BorderToken;

export type TokenMap = Record<string, DesignToken>;

export interface TokenGroup {
    id: string;
    name: string;
    path: string;
    description?: string;
    parentId?: string;
    tokens: string[]; // List of token paths
    groups: string[]; // List of subgroup IDs
}

export type TokenCollectionType = 'foundation' | 'semantic' | 'component';

export interface TokenCollection {
    id: string;
    name: string;
    type: TokenCollectionType;
    description?: string;
    groups: string[]; // Root IDs of TokenGroups
}

export interface UnifiedTokenStore {
    collections: Record<string, TokenCollection>;
    groups: Record<string, TokenGroup>;
    tokens: Record<string, DesignToken>;
}
