import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.05 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={cn(
                "absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none flex items-center justify-center",
                className
            )}
        >
            <div className={cn(
                "absolute w-[200%] h-[100%] bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 rotate-[-45deg] blur-3xl opacity-50 md:opacity-100",
                isVisible && "animate-pulse-soft"
            )} />
            <div className="absolute w-[200%] h-[50%] bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 rotate-[-125deg] blur-3xl hidden md:block" />
        </div>
    );
};
