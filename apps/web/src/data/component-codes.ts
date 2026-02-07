
export const spotlightCode = `import React from "react";
import { cn } from "@/lib/utils";

type SpotlightProps = {
    className?: string;
    fill?: string;
};

export const Spotlight = ({ className, fill = "white" }: SpotlightProps) => {
    return (
        <svg
            className={cn(
                "animate-spotlight pointer-events-none absolute z-[1]  h-[169%] w-[138%] lg:w-[84%] opacity-0",
                className
            )}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 3787 2842"
            fill="none"
        >
            <g filter="url(#filter0_f_29_205)">
                <ellipse
                    cx="1924.71"
                    cy="273.501"
                    rx="1924.71"
                    ry="273.501"
                    transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
                    fill={fill}
                    fillOpacity="0.21"
                />
            </g>
            <defs>
                <filter
                    id="filter0_f_29_205"
                    x="0.860352"
                    y="0.838989"
                    width="3785.16"
                    height="2840.26"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feGaussianBlur
                        stdDeviation="151"
                        result="effect1_foregroundBlur_29_205"
                    />
                </filter>
            </defs>
        </svg>
    );
};`;

export const movingBorderCode = `import React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = {
    borderRadius?: string;
    children: React.ReactNode;
    as?: any;
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
                style={{ borderRadius: \`calc(\${borderRadius} * 0.96)\` }}
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-[inherit]",
                        "bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]",
                        "animate-spin-slow"
                    )}
                    style={{
                        animation: \`spin \${duration}ms linear infinite\`
                    }}
                />
            </div>

            <div
                className={cn(
                    "relative bg-slate-900/[0.8] border border-slate-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm antialiased",
                    className
                )}
                style={{
                    borderRadius: \`calc(\${borderRadius} * 0.96)\`,
                }}
            >
                {children}
            </div>
        </Component>
    );
};`;

export const bentoGridCode = `import { cn } from "@/lib/utils";

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
            className= {
            cn(
                "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
                className
            )
        }
        >
        { children }
        </div>
    );
};

export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
}) => {
    return (
        <div
            className= {
            cn(
                "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-card border border-border/50 justify-between flex flex-col space-y-4 hover:border-primary/50",
                className
            )
        }
        >
        { header }
        < div className = "group-hover/bento:translate-x-2 transition duration-200" >
            <div className="mb-2" >
                { icon }
                </div>
                < div className = "font-sans font-bold text-foreground mb-2 mt-2" >
                    { title }
                    </div>
                    < div className = "font-sans font-normal text-muted-foreground text-xs leading-relaxed" >
                        { description }
                        </div>
                        </div>
                        </div>
    );
};`;

export const card3dCode = `import { cn } from "@/lib/utils";
import React, {
    createContext,
    useState,
    useContext,
    useRef,
    useEffect,
} from "react";

const MouseEnterContext = createContext<
    [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

export const CardContainer = ({
    children,
    className,
    containerClassName,
}: {
    children?: React.ReactNode;
    className?: string;
    containerClassName?: string;
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMouseEntered, setIsMouseEntered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const { left, top, width, height } =
            containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) / 25;
        const y = (e.clientY - top - height / 2) / 25;
        containerRef.current.style.transform = \`rotateY(\${x}deg) rotateX(\${y}deg)\`;
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsMouseEntered(true);
        if (!containerRef.current) return;
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        setIsMouseEntered(false);
        containerRef.current.style.transform = \`rotateY(0deg) rotateX(0deg)\`;
    };

    return (
        <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
            <div
                className={cn(
                    "flex items-center justify-center",
                    containerClassName
                )}
                style={{
                    perspective: "1000px",
                }}
            >
                <div
                    ref={containerRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className={cn(
                        "flex items-center justify-center relative transition-all duration-200 ease-linear",
                        className
                    )}
                    style={{
                        transformStyle: "preserve-3d",
                    }}
                >
                    {children}
                </div>
            </div>
        </MouseEnterContext.Provider>
    );
};

export const CardBody = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                "h-96 w-96 [transform-style:preserve-3d]  [&>*]:[transform-style:preserve-3d]",
                className
            )}
        >
            {children}
        </div>
    );
};

export const CardItem = ({
    as: Tag = "div",
    children,
    className,
    translateX = 0,
    translateY = 0,
    translateZ = 0,
    rotateX = 0,
    rotateY = 0,
    rotateZ = 0,
    ...rest
}: {
    as?: React.ElementType;
    children: React.ReactNode;
    className?: string;
    translateX?: number | string;
    translateY?: number | string;
    translateZ?: number | string;
    rotateX?: number | string;
    rotateY?: number | string;
    rotateZ?: number | string;
    [key: string]: any;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isMouseEntered] = useMouseEnter();

    useEffect(() => {
        handleAnimations();
    }, [isMouseEntered]);

    const handleAnimations = () => {
        if (!ref.current) return;
        if (isMouseEntered) {
            ref.current.style.transform = \`translateX(\${translateX}px) translateY(\${translateY}px) translateZ(\${translateZ}px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg) rotateZ(\${rotateZ}deg)\`;
        } else {
            ref.current.style.transform = \`translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)\`;
        }
    };

    return (
        <Tag
            ref={ref}
            className={cn("w-fit transition-transform duration-200 ease-linear", className)}
            {...rest}
        >
            {children}
        </Tag>
    );
};

export const useMouseEnter = () => {
    const context = useContext(MouseEnterContext);
    if (context === undefined) {
        throw new Error("useMouseEnter must be used within a MouseEnterProvider");
    }
    return context;
};`;


export const numberTickerCode = `import { useEffect, useRef, useState } from "react";
        import { useInView, useMotionValue, useSpring } from "framer-motion";

        export const NumberTicker = ({
            value,
            direction = "up",
            delay = 0,
            className,
            decimalPlaces = 0,
        }: {
            value: number;
            direction?: "up" | "down";
            className?: string;
            delay?: number;
            decimalPlaces?: number;
        }) => {
            const ref = useRef<HTMLSpanElement>(null);
            const motionValue = useMotionValue(direction === "down" ? value : 0);
            const springValue = useSpring(motionValue, {
                damping: 60,
                stiffness: 100,
            });
            const isInView = useInView(ref, { once: true, margin: "0px" });

            useEffect(() => {
                if (isInView) {
                    setTimeout(() => {
                        motionValue.set(direction === "down" ? 0 : value);
                    }, delay * 1000);
                }
            }, [motionValue, isInView, delay, value, direction]);

            useEffect(() => {
                springValue.on("change", (latest) => {
                    if (ref.current) {
                        ref.current.textContent = Intl.NumberFormat("en-US", {
                            minimumFractionDigits: decimalPlaces,
                            maximumFractionDigits: decimalPlaces,
                        }).format(Number(latest.toFixed(decimalPlaces)));
                    }
                });
            }, [springValue, decimalPlaces]);

            return <span className={ className } ref = { ref } />;
        };`;

export const backgroundBeamsCode = `import React from "react";
        import { cn } from "@/lib/utils";
        import { motion } from "framer-motion";

        export const BackgroundBeams = ({ className }: { className?: string }) => {
            return (
                <div
            className= {
                    cn(
                "absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none flex items-center justify-center",
                        className
                    )
                }
                >
                <div className="absolute w-[200%] h-[100%] bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 rotate-[-45deg] blur-3xl animate-pulse-soft" />
                    <div className="absolute w-[200%] h-[50%] bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 rotate-[-125deg] blur-3xl" />
                        </div>
    );
};`;
