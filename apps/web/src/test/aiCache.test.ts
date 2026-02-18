
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AICache } from '../lib/aiCache';

describe('AICache', () => {
    let cache: AICache;

    beforeEach(() => {
        // Short TTL for testing expiration
        cache = new AICache({ ttlMs: 100, maxSize: 3 });
    });

    it('should store and retrieve data', () => {
        cache.set('key1', { value: 1 });
        expect(cache.get('key1')).toEqual({ value: 1 });
    });

    it('should return null for missing keys', () => {
        expect(cache.get('missing')).toBeNull();
    });

    it('should expire entries after TTL', async () => {
        cache.set('key1', { value: 1 });

        // Wait for TTL expiration + buffer
        await new Promise(resolve => setTimeout(resolve, 150));

        expect(cache.get('key1')).toBeNull();
    });

    it('should evict oldest entry when full', () => {
        cache.set('key1', 1);
        cache.set('key2', 2);
        cache.set('key3', 3);

        // Cache is full (maxSize 3)
        cache.set('key4', 4);

        // key1 should be evicted (first inserted)
        expect(cache.get('key1')).toBeNull();
        expect(cache.get('key2')).toBe(2);
        expect(cache.get('key4')).toBe(4);
    });

    it('should generate consistent keys', () => {
        const input1 = { a: 1, b: "test" };
        const input2 = { a: 1, b: "test" };

        expect(cache.generateKey(input1)).toBe(cache.generateKey(input2));
    });
});
