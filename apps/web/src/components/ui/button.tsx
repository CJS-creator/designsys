import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Enhanced button variants with state, responsive, and compound variants
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-md hover:-translate-y-0.5",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20 hover:shadow-sm",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // NEW: Enhanced variants
        glass: "bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 shadow-lg",
        gradient: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:-translate-y-0.5",
        soft: "bg-primary/10 text-primary hover:bg-primary/20",
        ring: "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-8 text-base",
        xl: "h-12 rounded-xl px-10 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
      // NEW: State variants for loading, success, error states
      state: {
        idle: "",
        loading: "relative overflow-hidden cursor-wait",
        loadingWithText: "[&_.spinner]:absolute [&_.spinner]:inset-0 [&_.spinner]:flex [&_.spinner]:items-center [&_.spinner]:justify-center [&_span]:opacity-0",
        success: "bg-green-500 text-white hover:bg-green-600",
        error: "bg-red-500 text-white hover:bg-red-600",
        disabled: "opacity-50 cursor-not-allowed",
      },
      // NEW: Responsive variants
      responsive: {
        mobile: "flex-col",
        tablet: "flex-row",
        desktop: "flex-row",
      },
      // NEW: Shape variants
      shape: {
        default: "rounded-lg",
        pill: "rounded-full",
        square: "rounded-none",
        circle: "rounded-full aspect-square p-0",
      },
    },
    // NEW: Compound variants for valid combinations
    compoundVariants: [
      {
        variant: ["gradient"],
        size: ["sm"],
        className: "bg-gradient-to-r from-primary/80 to-secondary/80",
      },
      {
        variant: ["gradient"],
        size: ["lg"],
        className: "bg-gradient-to-r from-primary to-secondary",
      },
      {
        variant: ["glass"],
        state: ["loading"],
        className: "backdrop-blur-xl",
      },
      {
        size: ["icon"],
        shape: ["circle"],
        className: "rounded-full aspect-square p-0",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "idle",
      shape: "default",
    },
  }
);

// Button loading spinner component
export function ButtonSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin h-4 w-4", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    state,
    shape,
    responsive,
    asChild = false,
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button";

    const isLoading = loading || state === "loading";
    const currentState = disabled ? "disabled" : (isLoading ? state : "idle");

    return (
      <Comp
        className={cn(buttonVariants({
          variant,
          size,
          state: currentState,
          shape,
          responsive,
          className
        }))}
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        aria-live={isLoading ? "polite" : undefined}
        {...props}
      >
        {isLoading ? (
          <>
            <span className={cn(state === "loadingWithText" && "sr-only")}>
              {loadingText || "Loading..."}
            </span>
            <ButtonSpinner className={cn("h-4 w-4", loadingText && "mr-2")} />
            {state === "loadingWithText" && (
              <span className="absolute inset-0 flex items-center justify-center opacity-100">
                {loadingText || "Loading..."}
              </span>
            )}
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
