
import { monitor } from "./monitoring";

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiresAt: number;
}

interface CacheConfig {
    ttlMs: number; // Time to live in milliseconds
    maxSize: number; // Maximum number of entries
}

export class AICache {
    private cache: Map<string, CacheEntry<any>> = new Map();
    private config: CacheConfig;

    constructor(config: CacheConfig = { ttlMs: 1000 * 60 * 60, maxSize: 100 }) { // Default 1 hour TTL
        this.config = config;
    }

    /**
     * Generates a cache key from the input object
     */
    public generateKey(input: any): string {
        try {
            return JSON.stringify(input);
        } catch (e) {
            monitor.error("Failed to generate cache key", e as Error);
            return "";
        }
    }

    public get<T>(key: string): T | null {
        if (!key) return null;

        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            monitor.debug("Cache miss (expired)", { key });
            return null;
        }

        monitor.debug("Cache hit", { key });
        return entry.data as T;
    }

    public set<T>(key: string, data: T): void {
        if (!key) return;

        // Evict oldest if full
        if (this.cache.size >= this.config.maxSize) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey) {
                this.cache.delete(firstKey);
            }
        }

        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            expiresAt: Date.now() + this.config.ttlMs
        });
    }

    public clear(): void {
        this.cache.clear();
    }
}

export const aiCache = new AICache();
