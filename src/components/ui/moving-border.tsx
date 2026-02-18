import React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = {
    borderRadius?: string;
    children: React.ReactNode;
    as?: React.ElementType;
    containerClassName?: string;
    borderClassName?: string;
    duration?: number;
    className?: string;
     
    [key: string]: any;
};

export const MovingBorderButton = ({
    borderRadius = "1.75rem",
    children,
    as: Component = "button",
    containerClassName,
    borderClassName,
    duration = 2000,
    className,
    ...otherProps
}: ButtonProps) => {
    return (
        <Component
            className={cn(
                "bg-transparent relative text-xl  p-[1px] overflow-hidden ",
                containerClassName
            )}
            style={{
                borderRadius: borderRadius,
            }}
            {...otherProps}
        >
            <div
                className="absolute inset-0"
                style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-[inherit]",
                        "bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]",
                        "animate-spin-slow" // Need to ensure this animation exists or add inline style
                    )}
                    style={{
                        animation: `spin ${duration}ms linear infinite`
                    }}
                />
            </div>

            <div
                className={cn(
                    "relative bg-slate-900/[0.8] border border-slate-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm antialiased",
                    className
                )}
                style={{
                    borderRadius: `calc(${borderRadius} * 0.96)`,
                }}
            >
                {children}
            </div>
        </Component>
    );
};
