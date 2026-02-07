import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

describe("useLocalStorage Hook", () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        vi.clearAllMocks();
    });

    describe("Initial value", () => {
        it("returns initial value when localStorage is empty", () => {
            const { result } = renderHook(() => useLocalStorage("test-key", "default"));
            expect(result.current[0]).toBe("default");
        });

        it("returns stored value when localStorage has data", () => {
            localStorage.setItem("test-key", JSON.stringify("stored-value"));
            const { result } = renderHook(() => useLocalStorage("test-key", "default"));
            expect(result.current[0]).toBe("stored-value");
        });

        it("handles complex objects", () => {
            const initialValue = { name: "test", count: 42 };
            const { result } = renderHook(() => useLocalStorage("complex-key", initialValue));
            expect(result.current[0]).toEqual(initialValue);
        });
    });

    describe("setValue", () => {
        it("updates state and localStorage", () => {
            const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

            act(() => {
                result.current[1]("updated");
            });

            expect(result.current[0]).toBe("updated");
            expect(localStorage.getItem("test-key")).toBe(JSON.stringify("updated"));
        });

        it("accepts a function updater", () => {
            const { result } = renderHook(() => useLocalStorage("counter", 0));

            act(() => {
                result.current[1]((prev) => prev + 1);
            });

            expect(result.current[0]).toBe(1);
        });

        it("handles objects correctly", () => {
            const { result } = renderHook(() => useLocalStorage<Record<string, number>>("obj-key", { a: 1 }));

            act(() => {
                result.current[1]({ a: 2, b: 3 });
            });

            expect(result.current[0]).toEqual({ a: 2, b: 3 });
        });
    });

    describe("removeValue", () => {
        it("removes value from localStorage and resets to initial", () => {
            localStorage.setItem("test-key", JSON.stringify("stored"));
            const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

            expect(result.current[0]).toBe("stored");

            act(() => {
                result.current[2]();
            });

            expect(result.current[0]).toBe("initial");
            expect(localStorage.getItem("test-key")).toBeNull();
        });
    });

    describe("Error handling", () => {
        it("handles JSON parse errors gracefully", () => {
            // Set invalid JSON
            localStorage.setItem("bad-key", "not-valid-json");
            const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => { });

            const { result } = renderHook(() => useLocalStorage("bad-key", "fallback"));

            expect(result.current[0]).toBe("fallback");
            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe("Type safety", () => {
        it("maintains type through updates (number)", () => {
            const { result } = renderHook(() => useLocalStorage<number>("number-key", 0));

            act(() => {
                result.current[1](42);
            });

            expect(typeof result.current[0]).toBe("number");
            expect(result.current[0]).toBe(42);
        });

        it("maintains type through updates (boolean)", () => {
            const { result } = renderHook(() => useLocalStorage<boolean>("bool-key", false));

            act(() => {
                result.current[1](true);
            });

            expect(typeof result.current[0]).toBe("boolean");
            expect(result.current[0]).toBe(true);
        });

        it("maintains type through updates (array)", () => {
            const { result } = renderHook(() => useLocalStorage<string[]>("array-key", []));

            act(() => {
                result.current[1](["a", "b", "c"]);
            });

            expect(Array.isArray(result.current[0])).toBe(true);
            expect(result.current[0]).toEqual(["a", "b", "c"]);
        });
    });
});
