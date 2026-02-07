import React, { useRef } from "react";
import { motion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export const MagneticButton = ({
    children,
    className,
    distance = 0.5,
}: {
    children: React.ReactNode;
    className?: string;
    distance?: number;
}) => {

    const containerRef = useRef<HTMLDivElement>(null);

    const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });
    const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const distanceX = clientX - centerX;
        const distanceY = clientY - centerY;

        x.set(distanceX * distance);
        y.set(distanceY * distance);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x, y }}
            className={cn("inline-block", className)}
        >
            {children}
        </motion.div>
    );
};
