import { loadCSV } from "@/lib/ui-ux-search/csv";
import { monitor } from "@/lib/monitoring";

export interface Pattern {
    id: string;
    category: string;
    name: string;
    data: Record<string, any>;
    metadata: {
        source: string;
        version: string;
        lastUpdated: string;
    };
}

export interface PatternQuery {
    category?: string;
    tags?: string[];
    limit?: number;
}

export class PatternRepository {
    private static instance: PatternRepository;
    private cache: Map<string, Pattern[]> = new Map();

    private constructor() { }

    public static getInstance(): PatternRepository {
        if (!PatternRepository.instance) {
            PatternRepository.instance = new PatternRepository();
        }
        return PatternRepository.instance;
    }

    /**
     * Initialize the repository by loading core pattern files
     */
    public async initialize(): Promise<void> {
        try {
            // In a real app, we might load from a DB or file system here.
            // For now, consumers (like 'definitions/typography') will call registerPatterns.
            monitor.debug("Initializing PatternRepository");
        } catch (error) {
            monitor.error("Failed to initialize PatternRepository", error as Error);
        }
    }

    /**
     * Register a batch of patterns
     */
    public registerPatterns(patterns: Pattern[]) {
        patterns.forEach(p => {
            if (!this.cache.has(p.category)) {
                this.cache.set(p.category, []);
            }
            this.cache.get(p.category)?.push(p);
        });
        monitor.debug(`Registered ${patterns.length} patterns`);
    }

    /**
     * Find patterns matching the query
     */
    public async findPatterns(query: PatternQuery): Promise<Pattern[]> {
        const results: Pattern[] = [];

        // 1. Filter by Category
        if (query.category) {
            const categoryPatterns = this.cache.get(query.category) || [];
            results.push(...categoryPatterns);
        } else {
            // Scan all categories if no category specified
            for (const patterns of this.cache.values()) {
                results.push(...patterns);
            }
        }

        // 2. Filter by Tags
        if (query.tags && query.tags.length > 0) {
            return results.filter(p => {
                const patternTags = (p.data.moods || p.data.tags || []) as string[];
                return query.tags?.some(t => patternTags.includes(t));
            });
        }

        return results;
    }

    /**
     * Get a specific pattern by ID
     */
    public async getPattern(id: string): Promise<Pattern | null> {
        for (const patterns of this.cache.values()) {
            const found = patterns.find(p => p.id === id);
            if (found) return found;
        }
        return null;
    }
}

export const patternRepository = PatternRepository.getInstance();
