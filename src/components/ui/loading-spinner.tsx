import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const spinnerVariants = cva(
    "animate-spin rounded-full border-2 border-current border-t-transparent",
    {
        variants: {
            size: {
                sm: "h-4 w-4",
                default: "h-6 w-6",
                lg: "h-8 w-8",
                xl: "h-12 w-12",
            },
            variant: {
                default: "text-primary",
                secondary: "text-secondary-foreground",
                muted: "text-muted-foreground",
                destructive: "text-destructive",
            },
        },
        defaultVariants: {
            size: "default",
            variant: "default",
        },
    }
);

export interface LoadingSpinnerProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
    /** Text to display next to the spinner */
    label?: string;
    /** Position of the label relative to spinner */
    labelPosition?: "right" | "bottom";
}

/**
 * Loading spinner component for indicating loading states
 * 
 * @example
 * <LoadingSpinner />
 * <LoadingSpinner size="lg" label="Loading..." />
 * <LoadingSpinner variant="muted" labelPosition="bottom" />
 */
const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
    ({ className, size, variant, label, labelPosition = "right", ...props }, ref) => {
        const isVertical = labelPosition === "bottom";

        return (
            <div
                ref={ref}
                role="status"
                aria-label={label || "Loading"}
                className={cn(
                    "inline-flex items-center gap-2",
                    isVertical && "flex-col",
                    className
                )}
                {...props}
            >
                <div
                    className={cn(spinnerVariants({ size, variant }))}
                    aria-hidden="true"
                />
                {label ? (
                    <span className={cn(
                        "text-sm",
                        variant === "muted" && "text-muted-foreground",
                        variant === "destructive" && "text-destructive"
                    )}>
                        {label}
                    </span>
                ) : (
                    <span className="sr-only">Loading</span>
                )}
            </div>
        );
    }
);
LoadingSpinner.displayName = "LoadingSpinner";

export { LoadingSpinner, spinnerVariants };
