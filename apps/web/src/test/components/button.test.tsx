import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
    describe("Rendering", () => {
        it("renders with default variant and size", () => {
            render(<Button>Click me</Button>);
            const button = screen.getByRole("button", { name: /click me/i });
            expect(button).toBeInTheDocument();
            expect(button).toHaveClass("bg-primary");
        });

        it("renders children correctly", () => {
            render(<Button>Test Label</Button>);
            expect(screen.getByText("Test Label")).toBeInTheDocument();
        });

        it("applies custom className", () => {
            render(<Button className="custom-class">Button</Button>);
            expect(screen.getByRole("button")).toHaveClass("custom-class");
        });
    });

    describe("Variants", () => {
        it("renders default variant", () => {
            render(<Button variant="default">Default</Button>);
            expect(screen.getByRole("button")).toHaveClass("bg-primary");
        });

        it("renders destructive variant", () => {
            render(<Button variant="destructive">Destructive</Button>);
            expect(screen.getByRole("button")).toHaveClass("bg-destructive");
        });

        it("renders outline variant", () => {
            render(<Button variant="outline">Outline</Button>);
            expect(screen.getByRole("button")).toHaveClass("border");
        });

        it("renders secondary variant", () => {
            render(<Button variant="secondary">Secondary</Button>);
            expect(screen.getByRole("button")).toHaveClass("bg-secondary");
        });

        it("renders ghost variant", () => {
            render(<Button variant="ghost">Ghost</Button>);
            expect(screen.getByRole("button")).toHaveClass("hover:bg-accent");
        });

        it("renders link variant", () => {
            render(<Button variant="link">Link</Button>);
            expect(screen.getByRole("button")).toHaveClass("text-primary");
            expect(screen.getByRole("button")).toHaveClass("underline-offset-4");
        });
    });

    describe("Sizes", () => {
        it("renders default size", () => {
            render(<Button size="default">Default</Button>);
            expect(screen.getByRole("button")).toHaveClass("h-10");
        });

        it("renders small size", () => {
            render(<Button size="sm">Small</Button>);
            expect(screen.getByRole("button")).toHaveClass("h-9");
        });

        it("renders large size", () => {
            render(<Button size="lg">Large</Button>);
            expect(screen.getByRole("button")).toHaveClass("h-11");
        });

        it("renders icon size", () => {
            render(<Button size="icon">🔧</Button>);
            const button = screen.getByRole("button");
            expect(button).toHaveClass("h-10");
            expect(button).toHaveClass("w-10");
        });
    });

    describe("States", () => {
        it("handles disabled state", () => {
            render(<Button disabled>Disabled</Button>);
            expect(screen.getByRole("button")).toBeDisabled();
            expect(screen.getByRole("button")).toHaveClass("disabled:opacity-50");
        });

        it("handles click events", () => {
            const handleClick = vi.fn();
            render(<Button onClick={handleClick}>Clickable</Button>);
            fireEvent.click(screen.getByRole("button"));
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it("does not trigger click when disabled", () => {
            const handleClick = vi.fn();
            render(<Button onClick={handleClick} disabled>Disabled</Button>);
            fireEvent.click(screen.getByRole("button"));
            expect(handleClick).not.toHaveBeenCalled();
        });

        it("shows LoadingSpinner and is disabled when loading", () => {
            render(<Button loading>Loading State</Button>);
            const button = screen.getByRole("button");

            expect(button).toBeDisabled();
            expect(screen.getByRole("status", { name: /loading/i })).toBeInTheDocument();
            expect(screen.getByText("Loading State")).toBeInTheDocument();
        });

        it("includes space for spinner when loading", () => {
            render(<Button loading>Submit</Button>);
            const spinner = screen.getByRole("status", { name: /loading/i }).parentElement;
            expect(spinner).toHaveClass("inline-flex");
        });
    });

    describe("asChild prop", () => {
        it("renders as child element when asChild is true", () => {
            render(
                <Button asChild>
                    <a href="/test">Link Button</a>
                </Button>
            );
            expect(screen.getByRole("link")).toBeInTheDocument();
            expect(screen.queryByRole("button")).not.toBeInTheDocument();
        });
    });

    describe("Accessibility", () => {
        it("has correct focus styles", () => {
            render(<Button>Focusable</Button>);
            const button = screen.getByRole("button");
            expect(button).toHaveClass("focus-visible:ring-2");
        });

        it("supports aria-label", () => {
            render(<Button aria-label="Custom label">Icon</Button>);
            expect(screen.getByRole("button", { name: "Custom label" })).toBeInTheDocument();
        });
    });
});
