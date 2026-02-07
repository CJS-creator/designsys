import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorBoundary from "@/components/ErrorBoundary";
import React from "react";

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
        throw new Error("Test Error");
    }
    return <div>Normal Content</div>;
};

const RecoverableApp = () => {
    const [shouldThrow, setShouldThrow] = React.useState(true);
    return (
        <ErrorBoundary variant="component" onReset={() => setShouldThrow(false)}>
            <ThrowError shouldThrow={shouldThrow} />
        </ErrorBoundary>
    );
};

describe("ErrorBoundary", () => {
    it("renders children when no error occurs", () => {
        render(
            <ErrorBoundary>
                <div>Safe Content</div>
            </ErrorBoundary>
        );
        expect(screen.getByText("Safe Content")).toBeInTheDocument();
    });

    it("renders full-page error state by default", () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => { });
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );
        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
        spy.mockRestore();
    });

    it("renders component-level error state", () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => { });
        render(
            <ErrorBoundary variant="component">
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );
        expect(screen.getByText("Content failed to load")).toBeInTheDocument();
        spy.mockRestore();
    });

    it("recovers from error when reset", async () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => { });
        render(<RecoverableApp />);

        expect(screen.getByText("Content failed to load")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Retry Section"));

        expect(screen.getByText("Normal Content")).toBeInTheDocument();
        spy.mockRestore();
    });
});
