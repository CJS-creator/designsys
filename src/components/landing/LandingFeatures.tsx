import { useRef, useState } from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Brain, Zap, Smartphone, Sparkles, Layout, Shield, Network, Orbit, RefreshCw } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
            }}
            className={cn("relative h-full w-full", className)}
        >
            <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }} className="h-full w-full">
                {children}
            </div>
        </motion.div>
    );
};

const FeatureHeader = ({ icon: Icon, color }: { icon: any, color: string }) => (
    <div className="relative flex flex-1 w-full h-full min-h-[8rem] rounded-xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-primary/50 transition-colors flex-col items-center justify-center gap-4">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <motion.div
            animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={cn("p-4 rounded-2xl bg-white/5 shadow-2xl relative z-10", color)}
        >
            <Icon className="h-10 w-10" />
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
);

const features = [
    {
        icon: <Brain className="h-6 w-6 text-purple-500" />,
        title: "AI Analysis",
        description: "Our engine understands your brand industry and generates context-aware harmonies automatically.",
        header: <FeatureHeader icon={Network} color="text-purple-500" />,
        className: "md:col-span-2",
    },
    {
        icon: <Zap className="h-6 w-6 text-blue-500" />,
        title: "Instant Tokens",
        description: "Generate W3C-standard design tokens in seconds, not hours.",
        header: <FeatureHeader icon={Zap} color="text-blue-500" />,
        className: "md:col-span-1",
    },
    {
        icon: <Smartphone className="h-6 w-6 text-green-500" />,
        title: "Multi-Platform Export",
        description: "Export directly to CSS, Tailwind, SwiftUI, Compose, and more.",
        header: <FeatureHeader icon={Smartphone} color="text-green-500" />,
        className: "md:col-span-1",
    },
    {
        icon: <Sparkles className="h-6 w-6 text-amber-500" />,
        title: "Visionary Generation",
        description: "Upload an image or prompt a mood, and watch as your entire system comes to life.",
        header: <FeatureHeader icon={Orbit} color="text-amber-500" />,
        className: "md:col-span-2",
    },
    {
        icon: <Layout className="h-6 w-6 text-pink-500" />,
        title: "Figma Sync",
        description: "Two-way sync with Figma variables to keep your design and code always in lockstep.",
        header: <FeatureHeader icon={RefreshCw} color="text-pink-500" />,
        className: "md:col-span-1",
    },
    {
        icon: <Shield className="h-6 w-6 text-cyan-500" />,
        title: "Enterprise Governance",
        description: "Role-based access, design audit logs, and project freezing for secure team collaboration.",
        header: <FeatureHeader icon={Shield} color="text-cyan-500" />,
        className: "md:col-span-3", // Now it fits better in a 3-col grid
    },
];

export const LandingFeatures = () => {
    return (
        <section id="features" className="py-32 bg-background relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />

            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        BEYOND TRADITIONAL GENERATION
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">The Future of Design Ops</h2>
                    <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                        DesignForge provides a comprehensive suite of tools to bridge the gap between design and development.
                    </p>
                </div>

                <BentoGrid className="max-w-6xl mx-auto md:auto-rows-[25rem]">
                    {features.map((item, i) => (
                        <TiltCard key={i} className={item.className}>
                            <BentoGridItem
                                title={item.title}
                                description={item.description}
                                header={item.header}
                                icon={item.icon}
                                className="h-full group-hover:shadow-2xl group-hover:shadow-primary/10 transition-all duration-500"
                            />
                        </TiltCard>
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
};
