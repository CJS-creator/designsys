import { SkillResult } from '@designsys/ui-ux-core';

export interface ExecutionHistoryEntry {
    executionId: string;
    skillId: string;
    status: 'success' | 'error' | 'cancelled';
    timestamp: number;
    duration: number;
}

export class SkillStore {
    private storagePrefix = 'ui-ux-skills:';
    private historyKey = 'execution-history';
    private memoryStore: Map<string, { data: any, expiresAt: number }> = new Map();

    constructor() {
        // Initialize storage if needed
    }

    saveToCache<T>(key: string, data: T, ttlMs: number, persist: 'memory' | 'localStorage'): void {
        const expiresAt = Date.now() + ttlMs;
        const entry = { data, expiresAt };

        if (persist === 'memory') {
            this.memoryStore.set(key, entry);
        } else {
            this.saveToStorage(`cache:${key}`, entry);
        }
    }

    getFromCache<T>(key: string, persist: 'memory' | 'localStorage'): T | null {
        let entry: { data: T, expiresAt: number } | null = null;

        if (persist === 'memory') {
            entry = this.memoryStore.get(key) || null;
        } else {
            entry = this.loadFromStorage<{ data: T, expiresAt: number }>(`cache:${key}`);
        }

        if (!entry) return null;

        if (Date.now() > entry.expiresAt) {
            if (persist === 'memory') {
                this.memoryStore.delete(key);
            }
            // Optional: cleanup localStorage for this key
            return null;
        }

        return entry.data;
    }

    saveExecutionResult(result: SkillResult): void {
        const history = this.getExecutionHistory();
        const entry: ExecutionHistoryEntry = {
            executionId: result.executionId,
            skillId: result.skillId,
            status: result.status,
            timestamp: result.timestamp.getTime(),
            duration: result.duration
        };

        history.unshift(entry);

        // Keep last 100 entries
        if (history.length > 100) {
            history.pop();
        }

        this.saveToStorage(this.historyKey, history);
    }

    getExecutionHistory(skillId?: string): ExecutionHistoryEntry[] {
        const history = this.loadFromStorage<ExecutionHistoryEntry[]>(this.historyKey) || [];

        if (skillId) {
            return history.filter(h => h.skillId === skillId);
        }

        return history;
    }

    private saveToStorage<T>(key: string, data: T): void {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(`${this.storagePrefix}${key}`, JSON.stringify(data));
            }
        } catch (e) {
            console.warn('Failed to save to localStorage', e);
        }
    }

    private loadFromStorage<T>(key: string): T | null {
        try {
            if (typeof localStorage !== 'undefined') {
                const item = localStorage.getItem(`${this.storagePrefix}${key}`);
                return item ? JSON.parse(item) : null;
            }
        } catch (e) {
            console.warn('Failed to load from localStorage', e);
        }
        return null;
    }
}
