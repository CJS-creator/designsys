import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const BackgroundBeams = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                "absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none flex items-center justify-center",
                className
            )}
        >
            <div className="absolute w-[200%] h-[100%] bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 rotate-[-45deg] blur-3xl animate-pulse-soft opacity-50 md:opacity-100" />
            <div className="absolute w-[200%] h-[50%] bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 rotate-[-125deg] blur-3xl hidden md:block" />
        </div>
    );
};
