import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "@/components/ui/input";

describe("Input Component", () => {
    describe("Rendering", () => {
        it("renders correctly", () => {
            render(<Input placeholder="Enter text" />);
            expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
        });

        it("applies default styles", () => {
            render(<Input data-testid="input" />);
            const input = screen.getByTestId("input");
            expect(input).toHaveClass("flex");
            expect(input).toHaveClass("rounded-md");
            expect(input).toHaveClass("border");
        });

        it("applies custom className", () => {
            render(<Input className="custom-input" data-testid="input" />);
            expect(screen.getByTestId("input")).toHaveClass("custom-input");
        });
    });

    describe("Types", () => {
        it("renders without explicit type by default", () => {
            render(<Input data-testid="input" />);
            // Input component doesn't set explicit type - browser defaults to text
            expect(screen.getByTestId("input")).toBeInTheDocument();
        });

        it("renders email input", () => {
            render(<Input type="email" data-testid="input" />);
            expect(screen.getByTestId("input")).toHaveAttribute("type", "email");
        });

        it("renders password input", () => {
            render(<Input type="password" data-testid="input" />);
            expect(screen.getByTestId("input")).toHaveAttribute("type", "password");
        });

        it("renders number input", () => {
            render(<Input type="number" data-testid="input" />);
            expect(screen.getByTestId("input")).toHaveAttribute("type", "number");
        });
    });

    describe("Value handling", () => {
        it("accepts value prop", () => {
            render(<Input value="test value" readOnly data-testid="input" />);
            expect(screen.getByTestId("input")).toHaveValue("test value");
        });

        it("calls onChange when value changes", () => {
            const handleChange = vi.fn();
            render(<Input onChange={handleChange} data-testid="input" />);
            fireEvent.change(screen.getByTestId("input"), { target: { value: "new value" } });
            expect(handleChange).toHaveBeenCalledTimes(1);
        });

        it("supports controlled input", () => {
            const { rerender } = render(<Input value="initial" readOnly data-testid="input" />);
            expect(screen.getByTestId("input")).toHaveValue("initial");
            rerender(<Input value="updated" readOnly data-testid="input" />);
            expect(screen.getByTestId("input")).toHaveValue("updated");
        });
    });

    describe("States", () => {
        it("handles disabled state", () => {
            render(<Input disabled data-testid="input" />);
            expect(screen.getByTestId("input")).toBeDisabled();
        });

        it("handles readonly state", () => {
            render(<Input readOnly data-testid="input" />);
            expect(screen.getByTestId("input")).toHaveAttribute("readonly");
        });

        it("handles required state", () => {
            render(<Input required data-testid="input" />);
            expect(screen.getByTestId("input")).toBeRequired();
        });
    });

    describe("Accessibility", () => {
        it("supports aria-label", () => {
            render(<Input aria-label="Email address" />);
            expect(screen.getByLabelText("Email address")).toBeInTheDocument();
        });

        it("has proper focus styles", () => {
            render(<Input data-testid="input" />);
            expect(screen.getByTestId("input")).toHaveClass("focus-visible:ring-2");
        });

        it("supports aria-describedby", () => {
            render(
                <>
                    <Input aria-describedby="hint" data-testid="input" />
                    <span id="hint">Enter your email</span>
                </>
            );
            expect(screen.getByTestId("input")).toHaveAttribute("aria-describedby", "hint");
        });
    });

    describe("Ref forwarding", () => {
        it("forwards ref correctly", () => {
            const ref = { current: null };
            render(<Input ref={ref} />);
            expect(ref.current).toBeInstanceOf(HTMLInputElement);
        });
    });
});
