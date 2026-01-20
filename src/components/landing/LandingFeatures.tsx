import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Brain, Zap, Smartphone, Sparkles, Layout, Shield } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        icon: <Brain className="h-6 w-6 text-purple-500" />,
        title: "AI Analysis",
        description: "Our engine understands your brand industry and generates context-aware harmonies automatically.",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-purple-500/20 to-transparent" />,
        className: "md:col-span-2",
    },
    {
        icon: <Zap className="h-6 w-6 text-blue-500" />,
        title: "Instant Tokens",
        description: "Generate W3C-standard design tokens in seconds, not hours.",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-500/20 to-transparent" />,
        className: "md:col-span-1",
    },
    {
        icon: <Smartphone className="h-6 w-6 text-green-500" />,
        title: "Multi-Platform Export",
        description: "Export directly to CSS, Tailwind, SwiftUI, Compose, and more.",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-green-500/20 to-transparent" />,
        className: "md:col-span-1",
    },
    {
        icon: <Sparkles className="h-6 w-6 text-amber-500" />,
        title: "Visionary Generation",
        description: "Upload an image or prompt a mood, and watch as your entire system comes to life.",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-amber-500/20 to-transparent" />,
        className: "md:col-span-2",
    },
    {
        icon: <Layout className="h-6 w-6 text-pink-500" />,
        title: "Figma Sync",
        description: "Two-way sync with Figma variables to keep your design and code always in lockstep.",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-pink-500/20 to-transparent" />,
        className: "md:col-span-1",
    },
    {
        icon: <Shield className="h-6 w-6 text-cyan-500" />,
        title: "Enterprise Governance",
        description: "Role-based access, design audit logs, and project freezing for secure team collaboration.",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-cyan-500/20 to-transparent" />,
        className: "md:col-span-3", // Full width? Or 2? Let's make it 3 to wrap up nicely.
    },
];

export const LandingFeatures = () => {
    return (
        <section id="features" className="py-24 bg-background relative overflow-hidden">

            {/* Global Grid Background on Section */}
            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />

            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Designed for Modern Teams</h2>
                    <p className="text-lg text-muted-foreground">
                        DesignForge provides a comprehensive suite of tools to bridge the gap between design and development.
                    </p>
                </div>

                <BentoGrid className="max-w-4xl mx-auto">
                    {features.map((item, i) => (
                        <BentoGridItem
                            key={i}
                            title={item.title}
                            description={item.description}
                            header={item.header}
                            icon={item.icon}
                            className={item.className}
                        />
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
};
