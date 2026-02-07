
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Brain, Zap, Smartphone, Sparkles, Layout, Shield, Network, Orbit, RefreshCw, Terminal } from "lucide-react";
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
    <div className="relative flex flex-1 w-full h-full min-h-[10rem] rounded-xl overflow-hidden bg-muted/30 border border-border/50 group-hover:border-primary/50 transition-colors flex-col items-center justify-center gap-6 p-6">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
        <motion.div
            animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className={cn("p-5 rounded-3xl bg-muted/30 shadow-2xl relative z-10 border border-border/50", color)}
        >
            <Icon className="h-12 w-12" />
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
);

const features = [
    {
        icon: <Brain className="h-6 w-6 text-purple-500" />,
        title: "AI Design Audit",
        description: "Automated WCAG contrast checking, consistency analysis, and smart-fix recommendations for your entire system.",
        header: <FeatureHeader icon={Shield} color="text-purple-500" />,
        className: "md:col-span-2",
    },
    {
        icon: <Zap className="h-6 w-6 text-blue-500" />,
        title: "Semantic Architecture",
        description: "Industry-standard token aliasing from primitives to semantic layers, visualized in a live relationship graph.",
        header: <FeatureHeader icon={Network} color="text-blue-500" />,
        className: "md:col-span-1",
    },
    {
        icon: <Smartphone className="h-6 w-6 text-green-500" />,
        title: "Enterprise Sync CLI",
        description: "A production-ready Node.js CLI to sync tokens, CSS variables, and Storybook configs directly to your IDE.",
        header: <FeatureHeader icon={Terminal} color="text-green-500" />,
        className: "md:col-span-1",
    },
    {
        icon: <Sparkles className="h-6 w-6 text-amber-500" />,
        title: "Component Fabric",
        description: "Interactive sandbox to preview components with your tokens. Export production-ready React, Vue, or SwiftUI code.",
        header: <FeatureHeader icon={Layout} color="text-amber-500" />,
        className: "md:col-span-2",
    },
    {
        icon: <Orbit className="h-6 w-6 text-pink-500" />,
        title: "CI/CD Integration",
        description: "Automated GitHub Actions templates to trigger design system updates on every brand refinement.",
        header: <FeatureHeader icon={RefreshCw} color="text-pink-500" />,
        className: "md:col-span-1",
    },
    {
        icon: <Shield className="h-6 w-6 text-cyan-500" />,
        title: "Unified Documentation",
        description: "Self-hosted, living documentation sites generated with one click, including tokens, components, and usage guides.",
        header: <FeatureHeader icon={Orbit} color="text-cyan-500" />,
        className: "md:col-span-3",
    },
];

export const LandingFeatures = () => {
    return (
        <section id="features" className="py-32 bg-background relative overflow-hidden gpu-accelerated">
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
                    <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">The Future of Design Ops</h2>
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
                                className="h-full group-hover:shadow-2xl group-hover:shadow-primary/10 transition-all duration-500 card-interactive"
                            />
                        </TiltCard>
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
};
