import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "@/hooks/useDebounce";

describe("useDebounce Hook", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("returns initial value immediately", () => {
        const { result } = renderHook(() => useDebounce("test", 500));
        expect(result.current).toBe("test");
    });

    it("debounces value changes", () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: "initial", delay: 500 } }
        );

        expect(result.current).toBe("initial");

        // Update the value
        rerender({ value: "updated", delay: 500 });

        // Value should not change immediately
        expect(result.current).toBe("initial");

        // Advance timers by 500ms
        act(() => {
            vi.advanceTimersByTime(500);
        });

        // Now the value should be updated
        expect(result.current).toBe("updated");
    });

    it("resets timer on rapid value changes", () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 500),
            { initialProps: { value: "initial" } }
        );

        rerender({ value: "first" });
        act(() => {
            vi.advanceTimersByTime(300);
        });

        rerender({ value: "second" });
        act(() => {
            vi.advanceTimersByTime(300);
        });

        // Should still be initial because timer was reset
        expect(result.current).toBe("initial");

        // Wait for the full delay
        act(() => {
            vi.advanceTimersByTime(500);
        });

        // Should now be the latest value
        expect(result.current).toBe("second");
    });

    it("handles different delay values", () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: "initial", delay: 1000 } }
        );

        rerender({ value: "updated", delay: 1000 });

        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(result.current).toBe("initial");

        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(result.current).toBe("updated");
    });

    it("handles zero delay", () => {
        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 0),
            { initialProps: { value: "initial" } }
        );

        rerender({ value: "updated" });

        act(() => {
            vi.advanceTimersByTime(0);
        });

        expect(result.current).toBe("updated");
    });

    it("handles object values", () => {
        const initialObj = { name: "test" };
        const updatedObj = { name: "updated" };

        const { result, rerender } = renderHook(
            ({ value }) => useDebounce(value, 500),
            { initialProps: { value: initialObj } }
        );

        expect(result.current).toBe(initialObj);

        rerender({ value: updatedObj });

        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(result.current).toBe(updatedObj);
    });
});
