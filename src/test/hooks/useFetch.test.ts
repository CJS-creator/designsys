import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useFetch } from "@/hooks/useFetch";

describe("useFetch Hook", () => {
    const mockData = { id: 1, name: "Test" };

    beforeEach(() => {
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("Initial state", () => {
        it("starts with loading state when immediate is true", () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(mockData),
            });

            const { result } = renderHook(() => useFetch("/api/test"));

            expect(result.current.isLoading).toBe(true);
            expect(result.current.data).toBe(null);
            expect(result.current.error).toBe(null);
        });

        it("starts without loading when immediate is false", () => {
            const { result } = renderHook(() =>
                useFetch("/api/test", { immediate: false })
            );

            expect(result.current.isLoading).toBe(false);
        });

        it("uses initialData when provided", () => {
            const initialData = { id: 0, name: "Initial" };
            const { result } = renderHook(() =>
                useFetch("/api/test", { initialData, immediate: false })
            );

            expect(result.current.data).toEqual(initialData);
        });
    });

    describe("Successful fetch", () => {
        it("fetches data and updates state", async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(mockData),
            });

            const { result } = renderHook(() => useFetch<typeof mockData>("/api/test"));

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toEqual(mockData);
            expect(result.current.isSuccess).toBe(true);
            expect(result.current.isError).toBe(false);
        });

        it("applies transform function", async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ nested: mockData }),
            });

            const { result } = renderHook(() =>
                useFetch<typeof mockData>("/api/test", {
                    transform: (data: unknown) => (data as { nested: typeof mockData }).nested,
                })
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toEqual(mockData);
        });
    });

    describe("Error handling", () => {
        it("handles HTTP errors", async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: false,
                status: 404,
            });

            const { result } = renderHook(() => useFetch("/api/test"));

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.isError).toBe(true);
            expect(result.current.error?.message).toContain("404");
        });

        it("handles network errors", async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
                new Error("Network error")
            );

            const { result } = renderHook(() => useFetch("/api/test"));

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.isError).toBe(true);
            expect(result.current.error?.message).toBe("Network error");
        });
    });

    describe("Refetch", () => {
        it("refetches data when called", async () => {
            let callCount = 0;
            (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(() => {
                callCount++;
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ count: callCount }),
                });
            });

            const { result } = renderHook(() => useFetch<{ count: number }>("/api/test"));

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data?.count).toBe(1);

            await act(async () => {
                await result.current.refetch();
            });

            expect(result.current.data?.count).toBe(2);
        });
    });

    describe("Reset", () => {
        it("resets state to initial values", async () => {
            (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(mockData),
            });

            const { result } = renderHook(() =>
                useFetch<typeof mockData>("/api/test", { initialData: null })
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toEqual(mockData);

            act(() => {
                result.current.reset();
            });

            expect(result.current.data).toBe(null);
            expect(result.current.isSuccess).toBe(false);
        });
    });

    describe("Null URL", () => {
        it("does not fetch when URL is null", () => {
            const { result } = renderHook(() => useFetch(null));

            expect(result.current.isLoading).toBe(false);
            expect(global.fetch).not.toHaveBeenCalled();
        });
    });
});
