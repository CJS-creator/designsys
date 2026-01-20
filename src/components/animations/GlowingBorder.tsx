import React from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export const GlowingBorder = ({
    className,
    containerClassName,
    children,
    borderRadius = "1.75rem",
    duration = 2000,
}: {
    className?: string;
    containerClassName?: string;
    children: React.ReactNode;
    borderRadius?: string;
    duration?: number;
}) => {
    return (
        <div
            className={cn(
                "relative bg-transparent overflow-hidden p-[1px]",
                containerClassName
            )}
            style={{
                borderRadius: borderRadius,
            }}
        >
            <div
                className="absolute inset-0"
                style={{
                    borderRadius: borderRadius,
                }}
            >
                <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: duration / 1000,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{
                        background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 90deg, #7c3aed 180deg, transparent 270deg, transparent 360deg)",
                        width: "200%",
                        height: "200%",
                        position: "absolute",
                        top: "-50%",
                        left: "-50%",
                    }}
                />
            </div>
            <div
                className={cn(
                    "relative bg-slate-950/90 backdrop-blur-xl border border-slate-800 text-white w-full h-full",
                    className
                )}
                style={{
                    borderRadius: borderRadius,
                }}
            >
                {children}
            </div>
        </div>
    );
};
