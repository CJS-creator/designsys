import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useToast } from "@/hooks/use-toast";

describe("useToast Hook", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset count if possible or just expect incrementing IDs
    });

    it("initializes with empty toasts array", () => {
        const { result } = renderHook(() => useToast());
        expect(result.current.toasts).toEqual([]);
    });

    it("adds a toast when called", () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.toast({
                title: "Test Toast",
                description: "This is a test",
            });
        });

        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0]).toMatchObject({
            title: "Test Toast",
            description: "This is a test",
            open: true,
        });
    });

    it("dismisses a toast", () => {
        const { result } = renderHook(() => useToast());

        let toastId = "";
        act(() => {
            const { id } = result.current.toast({ title: "To Dismiss" });
            toastId = id;
        });

        expect(result.current.toasts[0].open).toBe(true);

        act(() => {
            result.current.dismiss(toastId);
        });

        expect(result.current.toasts[0].open).toBe(false);
    });

    it("updates a toast", () => {
        const { result } = renderHook(() => useToast());

        let toastObj: any;
        act(() => {
            toastObj = result.current.toast({ title: "Original Title" });
        });

        act(() => {
            toastObj.update({ ...toastObj, title: "Updated Title" });
        });

        expect(result.current.toasts[0].title).toBe("Updated Title");
    });

    it("respects TOAST_LIMIT", () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.toast({ title: "First" });
        });
        act(() => {
            result.current.toast({ title: "Second" });
        });

        // TOAST_LIMIT is 1 in the hook
        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0].title).toBe("Second");
    });
});
