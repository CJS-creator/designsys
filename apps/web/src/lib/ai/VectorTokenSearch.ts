

import { DesignToken } from "@/types/tokens";

export interface SearchResult {
    tokenName: string;
    value: string;
    path: string;
    relevance: number; // 0-1
    context: string;
}

// Simple semantic map for "vector-like" behavior
const SEMANTIC_MAP: Record<string, string[]> = {
    "error": ["red", "destructive", "danger", "alert", "critical"],
    "success": ["green", "emerald", "safe", "check", "valid"],
    "warning": ["yellow", "amber", "orange", "caution", "attention"],
    "info": ["blue", "sky", "note", "help"],
    "primary": ["brand", "main", "action", "cta"],
    "surface": ["background", "card", "panel", "layer", "white", "slate"],
    "text": ["content", "typography", "copy", "body", "heading"],
    "spacing": ["gap", "margin", "padding", "space"],
    "round": ["radius", "circle", "pill", "rounded"]
};

export class VectorTokenSearch {
    private tokens: DesignToken[];

    constructor(tokens: DesignToken[]) {
        this.tokens = tokens;
    }

    public search(query: string): SearchResult[] {
        const normalizedQuery = query.toLowerCase().trim();
        // If empty query, return empty results (caller handles default view)
        if (!normalizedQuery) return [];

        const expandedTerms = this.expandQuery(normalizedQuery);

        return this.tokens
            .map(token => {
                let score = 0;
                const path = token.path.toLowerCase();
                const value = String(token.value).toLowerCase();
                const type = token.type.toLowerCase();

                // Exact match has highest priority
                if (path.includes(normalizedQuery)) score += 1.0;
                else if (value.includes(normalizedQuery)) score += 0.8;

                // Semantic match
                for (const term of expandedTerms) {
                    if (path.includes(term)) score += 0.5;
                    if (value.includes(term)) score += 0.3;
                    if (type.includes(term)) score += 0.4;
                }

                // Boost if query matches type exactly (e.g. searching "color")
                if (type === normalizedQuery) score += 0.9;

                return {
                    tokenName: token.name,
                    value: String(token.value),
                    path: token.path,
                    relevance: score,
                    context: this.getExplanation(score, expandedTerms)
                };
            })
            .filter(r => r.relevance > 0.3)
            .sort((a, b) => b.relevance - a.relevance);
    }

    private expandQuery(query: string): string[] {
        const terms = [query];
        Object.entries(SEMANTIC_MAP).forEach(([key, values]) => {
            if (key.includes(query) || values.some(v => v.includes(query))) {
                terms.push(...values);
                terms.push(key);
            }
        });
        return [...new Set(terms)];
    }

    private getExplanation(score: number, terms: string[]): string {
        if (score >= 1.0) return "Exact match on token name";
        if (score >= 0.8) return "Match on value";
        if (score >= 0.6) return `Semantic match on related terms: ${terms.slice(0, 3).join(", ")}`;
        return "Possible relation";
    }
}
