import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { MovingBorderButton } from "@/components/ui/moving-border";

const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
    const [displayText, setDisplayText] = useState("");

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        const startTimeout = setTimeout(() => {
            let i = 0;
            const interval = setInterval(() => {
                setDisplayText(text.substring(0, i + 1));
                i++;
                if (i === text.length) clearInterval(interval);
            }, 50); // Speed of typing
            return () => clearInterval(interval);
        }, delay * 1000);

        return () => {
            clearTimeout(startTimeout);
            clearTimeout(timeout);
        };
    }, [text, delay]);

    return <span>{displayText}</span>;
}

export const LandingHero = () => {
    return (
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-background antialiased">
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 hidden dark:block" fill="white" />
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 block dark:hidden" fill="#7c3aed" />

            {/* Multi-layered Animated Background Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden bg-grid-black/[0.02] dark:bg-grid-white/[0.02]">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0.2, 0.5, 0.2],
                            scale: [1, 1.5, 1],
                            x: Math.random() * 800 - 400,
                            y: Math.random() * 600 - 300,
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "easeInOut"
                        }}
                        className="absolute w-2 h-2 rounded-full bg-primary/20 left-1/2 top-1/2"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6 relative hover:scale-105 transition-transform cursor-pointer"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span>Trusted by 500+ design teams worldwide</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70"
                    >
                        Design Systems at the <br />
                        <span className="text-primary h-[1.2em] inline-block">
                            <TypewriterText text="Speed of Thought" delay={0.8} />
                            <span className="animate-pulse ml-1">|</span>
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
                    >
                        The world's first AI-powered design system engine. Generate, document, and sync production-ready tokens across all your platforms in seconds.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <Link to="/auth">
                            <MovingBorderButton
                                borderRadius="1.75rem"
                                className="bg-background text-foreground border-neutral-200 dark:border-slate-800 font-semibold"
                            >
                                Start Building Free
                            </MovingBorderButton>
                        </Link>

                        <Button size="lg" variant="ghost" className="h-12 px-8 rounded-full text-base font-semibold hover:bg-muted/50 group">
                            <Play className="mr-2 h-4 w-4 fill-current group-hover:text-primary transition-colors" />
                            Watch Demo
                        </Button>
                    </motion.div>
                </div>

                {/* Hero Image / Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="relative max-w-5xl mx-auto"
                >
                    <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/10 bg-card/50 backdrop-blur-sm p-4 ring-1 ring-white/10">
                        {/* CSS Dashboard Mockup */}
                        <div className="aspect-[16/9] w-full bg-background/50 rounded-xl overflow-hidden relative">
                            {/* Sidebar */}
                            <div className="absolute top-0 left-0 w-[20%] h-full border-r border-border/50 bg-background/30 p-3 hidden sm:block">
                                <div className="w-8 h-8 rounded bg-primary/20 mb-6" />
                                <div className="space-y-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-2 w-full rounded bg-muted/50" />
                                    ))}
                                </div>
                            </div>

                            {/* Header */}
                            <div className="absolute top-0 left-0 sm:left-[20%] right-0 h-14 border-b border-border/50 bg-background/30 flex items-center px-4 justify-between">
                                <div className="h-4 w-24 bg-muted/50 rounded" />
                                <div className="flex gap-2">
                                    <div className="h-8 w-8 rounded-full bg-purple-500/10" />
                                    <div className="h-8 w-8 rounded-full bg-muted/50" />
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="absolute top-14 left-0 sm:left-[20%] right-0 bottom-0 p-4 sm:p-6 grid grid-cols-12 gap-4">
                                {/* Chart 1 */}
                                <div className="col-span-12 sm:col-span-8 rounded-lg border border-border/50 bg-background/30 p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="h-3 w-32 bg-muted/50 rounded" />
                                        <div className="h-3 w-16 bg-primary/20 rounded" />
                                    </div>
                                    <div className="flex items-end gap-2 h-32 mt-4 px-2">
                                        {[40, 70, 45, 90, 60, 80, 50, 75, 60, 95].map((h, i) => (
                                            <div key={i} className="flex-1 bg-gradient-to-t from-primary/50 to-primary/10 rounded-t-sm" style={{ height: `${h}%` }} />
                                        ))}
                                    </div>
                                </div>

                                {/* Stats Cards */}
                                <div className="col-span-6 sm:col-span-4 space-y-4">
                                    <div className="rounded-lg border border-border/50 bg-background/30 p-4">
                                        <div className="h-2 w-16 bg-muted/50 rounded mb-2" />
                                        <div className="h-6 w-24 bg-foreground/10 rounded" />
                                    </div>
                                    <div className="rounded-lg border border-border/50 bg-background/30 p-4">
                                        <div className="h-2 w-16 bg-muted/50 rounded mb-2" />
                                        <div className="h-6 w-24 bg-accent/20 rounded" />
                                    </div>
                                    <div className="rounded-lg border border-border/50 bg-background/30 p-4">
                                        <div className="h-2 w-16 bg-muted/50 rounded mb-2" />
                                        <div className="h-6 w-24 bg-primary/20 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Glossy Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
