import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextReveal = ({
    text,
    className,
    delay = 0,
}: {
    text: string;
    className?: string;
    delay?: number;
}) => {
    const words = text.split(" ");

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: delay * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                damping: 15,
                stiffness: 150,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring" as const,
                damping: 15,
                stiffness: 150,
            },
        },
    };

    return (
        <motion.div
            style={{ display: "flex", flexWrap: "wrap", gap: "0.4em" }}
            variants={container}
            initial="hidden"
            animate="visible"
            className={cn("leading-tight", className)}
        >
            {words.map((word, index) => (
                <motion.span
                    variants={child}
                    key={index}
                    style={{ display: "inline-block" }}
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
};
