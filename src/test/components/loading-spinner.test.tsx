import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

describe("LoadingSpinner Component", () => {
    describe("Rendering", () => {
        it("renders correctly", () => {
            render(<LoadingSpinner />);
            expect(screen.getByRole("status")).toBeInTheDocument();
        });

        it("has sr-only loading text by default", () => {
            render(<LoadingSpinner />);
            expect(screen.getByText("Loading")).toHaveClass("sr-only");
        });

        it("renders with visible label", () => {
            render(<LoadingSpinner label="Loading data..." />);
            expect(screen.getByText("Loading data...")).toBeInTheDocument();
            expect(screen.getByText("Loading data...")).not.toHaveClass("sr-only");
        });
    });

    describe("Sizes", () => {
        it("renders small size", () => {
            render(<LoadingSpinner size="sm" data-testid="spinner" />);
            const spinner = screen.getByTestId("spinner").querySelector("div");
            expect(spinner).toHaveClass("h-4", "w-4");
        });

        it("renders default size", () => {
            render(<LoadingSpinner size="default" data-testid="spinner" />);
            const spinner = screen.getByTestId("spinner").querySelector("div");
            expect(spinner).toHaveClass("h-6", "w-6");
        });

        it("renders large size", () => {
            render(<LoadingSpinner size="lg" data-testid="spinner" />);
            const spinner = screen.getByTestId("spinner").querySelector("div");
            expect(spinner).toHaveClass("h-8", "w-8");
        });

        it("renders xl size", () => {
            render(<LoadingSpinner size="xl" data-testid="spinner" />);
            const spinner = screen.getByTestId("spinner").querySelector("div");
            expect(spinner).toHaveClass("h-12", "w-12");
        });
    });

    describe("Variants", () => {
        it("renders default variant", () => {
            render(<LoadingSpinner variant="default" data-testid="spinner" />);
            const spinner = screen.getByTestId("spinner").querySelector("div");
            expect(spinner).toHaveClass("text-primary");
        });

        it("renders secondary variant", () => {
            render(<LoadingSpinner variant="secondary" data-testid="spinner" />);
            const spinner = screen.getByTestId("spinner").querySelector("div");
            expect(spinner).toHaveClass("text-secondary-foreground");
        });

        it("renders muted variant", () => {
            render(<LoadingSpinner variant="muted" data-testid="spinner" />);
            const spinner = screen.getByTestId("spinner").querySelector("div");
            expect(spinner).toHaveClass("text-muted-foreground");
        });

        it("renders destructive variant", () => {
            render(<LoadingSpinner variant="destructive" data-testid="spinner" />);
            const spinner = screen.getByTestId("spinner").querySelector("div");
            expect(spinner).toHaveClass("text-destructive");
        });
    });

    describe("Label positioning", () => {
        it("renders label on the right by default", () => {
            render(<LoadingSpinner label="Loading" data-testid="spinner" />);
            const container = screen.getByTestId("spinner");
            expect(container).not.toHaveClass("flex-col");
        });

        it("renders label at the bottom when specified", () => {
            render(<LoadingSpinner label="Loading" labelPosition="bottom" data-testid="spinner" />);
            const container = screen.getByTestId("spinner");
            expect(container).toHaveClass("flex-col");
        });
    });

    describe("Accessibility", () => {
        it("has role status", () => {
            render(<LoadingSpinner />);
            expect(screen.getByRole("status")).toBeInTheDocument();
        });

        it("has aria-label", () => {
            render(<LoadingSpinner />);
            expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Loading");
        });

        it("uses custom label as aria-label", () => {
            render(<LoadingSpinner label="Fetching users" />);
            expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Fetching users");
        });

        it("spinner animation is hidden from screen readers", () => {
            render(<LoadingSpinner data-testid="spinner" />);
            const spinner = screen.getByTestId("spinner").querySelector("div");
            expect(spinner).toHaveAttribute("aria-hidden", "true");
        });
    });

    describe("Custom styling", () => {
        it("applies custom className", () => {
            render(<LoadingSpinner className="my-custom-class" data-testid="spinner" />);
            expect(screen.getByTestId("spinner")).toHaveClass("my-custom-class");
        });
    });
});
