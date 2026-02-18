import { useState, useEffect, useCallback, useRef } from "react";

interface FetchState<T> {
    data: T | null;
    error: Error | null;
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
}

interface UseFetchOptions<T> {
    /** Initial data before fetch completes */
    initialData?: T | null;
    /** Whether to fetch immediately on mount */
    immediate?: boolean;
    /** Dependencies that trigger refetch when changed */
    deps?: unknown[];
    /** Transform function for response data */
    transform?: (data: unknown) => T;
    /** Cache key for caching responses */
    cacheKey?: string;
    /** Cache time in milliseconds */
    cacheTime?: number;
}

interface UseFetchReturn<T> extends FetchState<T> {
    /** Trigger a refetch */
    refetch: () => Promise<void>;
    /** Reset state to initial */
    reset: () => void;
    /** Abort the current request */
    abort: () => void;
}

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();

/**
 * Custom hook for data fetching with loading/error states
 * 
 * @example
 * const { data, isLoading, error, refetch } = useFetch<User[]>("/api/users");
 * 
 * @example
 * const { data } = useFetch<User>("/api/user/1", {
 *   immediate: false,
 *   transform: (data) => data.user
 * });
 */
export function useFetch<T>(
    url: string | null,
    options: UseFetchOptions<T> = {}
): UseFetchReturn<T> {
    const {
        initialData = null,
        immediate = true,
        deps = [],
        transform,
        cacheKey,
        cacheTime = 5 * 60 * 1000, // 5 minutes default
    } = options;

    const [state, setState] = useState<FetchState<T>>({
        data: initialData as T | null,
        error: null,
        isLoading: immediate && url !== null,
        isError: false,
        isSuccess: false,
    });

    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchData = useCallback(async () => {
        if (!url) return;

        // Check cache first
        if (cacheKey) {
            const cached = cache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < cacheTime) {
                setState({
                    data: cached.data as T,
                    error: null,
                    isLoading: false,
                    isError: false,
                    isSuccess: true,
                });
                return;
            }
        }

        // Abort previous request if still pending
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        setState((prev) => ({
            ...prev,
            isLoading: true,
            isError: false,
            error: null,
        }));

        try {
            const response = await fetch(url, {
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let data = await response.json();

            if (transform) {
                data = transform(data);
            }

            // Save to cache
            if (cacheKey) {
                cache.set(cacheKey, { data, timestamp: Date.now() });
            }

            setState({
                data,
                error: null,
                isLoading: false,
                isError: false,
                isSuccess: true,
            });
        } catch (error) {
            if (error instanceof Error && error.name === "AbortError") {
                // Request was aborted, don't update state
                return;
            }

            setState({
                data: null,
                error: error instanceof Error ? error : new Error("Unknown error"),
                isLoading: false,
                isError: true,
                isSuccess: false,
            });
        }
    }, [url, cacheKey, cacheTime, transform]);

    const refetch = useCallback(async () => {
        // Clear cache for this key before refetching
        if (cacheKey) {
            cache.delete(cacheKey);
        }
        await fetchData();
    }, [fetchData, cacheKey]);

    const reset = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setState({
            data: initialData as T | null,
            error: null,
            isLoading: false,
            isError: false,
            isSuccess: false,
        });
    }, [initialData]);

    const abort = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setState((prev) => ({
            ...prev,
            isLoading: false,
        }));
    }, []);

    // Fetch on mount and when deps change
    useEffect(() => {
        if (immediate && url) {
            fetchData();
        }

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
         
    }, [url, immediate, ...deps]);

    return {
        ...state,
        refetch,
        reset,
        abort,
    };
}

export default useFetch;
