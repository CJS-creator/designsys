import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Code, Palette, Github, Terminal, Cpu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { MovingBorderButton } from "@/components/ui/moving-border";
import { GradientOrbs } from "@/components/animations/GradientOrbs";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { TextReveal } from "@/components/animations/TextReveal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CodePreview = () => {
    const codeLines = [
        { text: "const designSystem = {", color: "text-blue-400" },
        { text: "  name: 'Forge UI',", color: "text-purple-400" },
        { text: "  colors: {", color: "text-blue-400" },
        { text: "    primary: '#7c3aed',", color: "text-emerald-400" },
        { text: "    accent: '#f43f5e',", color: "text-emerald-400" },
        { text: "    surface: '#0f172a'", color: "text-emerald-400" },
        { text: "  },", color: "text-blue-400" },
        { text: "  spacing: { base: 4 },", color: "text-purple-400" },
        { text: "  borderRadius: '1rem'", color: "text-emerald-400" },
        { text: "};", color: "text-blue-400" },
    ];

    return (
        <div className="font-mono text-[10px] md:text-sm space-y-1">
            {codeLines.map((line, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.1 }}
                    className="flex gap-4"
                >
                    <span className="text-muted-foreground/30 w-4">{i + 1}</span>
                    <span className={line.color}>{line.text}</span>
                </motion.div>
            ))}
            <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-primary ml-1"
            />
        </div>
    );
};

export const LandingHero = () => {
    return (
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-32 overflow-hidden bg-background antialiased flex flex-col items-center justify-center min-h-[90vh]">
            <GradientOrbs />

            {/* Decorative Background Beams */}
            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background -z-10" />

            <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
                {/* Floating Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="mb-8"
                >
                    <MagneticButton>
                        <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium flex items-center gap-2 hover:bg-primary/20 transition-colors shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            The Next Gen AI Design Engine
                        </div>
                    </MagneticButton>
                </motion.div>

                {/* Main Title */}
                <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 max-w-[90rem] leading-[1.1]">
                    <TextReveal text="Build Design Systems" className="justify-center" />
                    <span className="block mt-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-shimmer whitespace-nowrap">
                        <TextReveal text="Faster Than Implementation" className="justify-center" delay={0.3} />
                    </span>
                </h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed font-medium"
                >
                    Forge prod-ready tokens, components, and documentation with an AI that understands your brand's unique soul.
                </motion.p>

                {/* Primary Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 w-full"
                >
                    <MagneticButton distance={0.2} className="w-full sm:w-auto">
                        <Link to="/auth" className="w-full sm:w-auto">
                            <MovingBorderButton
                                borderRadius="1rem"
                                className="bg-primary text-primary-foreground border-none font-bold px-10 h-16 text-lg shadow-xl shadow-primary/20"
                            >
                                Create My Design System
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </MovingBorderButton>
                        </Link>
                    </MagneticButton>

                    <MagneticButton distance={0.3} className="w-full sm:w-auto">
                        <Button
                            size="lg"
                            variant="outline"
                            className="h-16 px-10 rounded-2xl text-lg font-bold border-2 hover:bg-primary/5 group border-muted/50 w-full sm:w-auto"
                            onClick={() => toast.info("Vision video coming soon in the next update!", {
                                description: "We are currently perfecting our product vision video.",
                                icon: <Play className="h-4 w-4" />
                            })}
                        >
                            <Play className="mr-3 h-5 w-5 fill-current group-hover:text-primary transition-colors" />
                            Watch Vision
                        </Button>
                    </MagneticButton>
                </motion.div>

                {/* Hero Visual: Advanced Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 60, rotateX: 10 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 1, delay: 1, type: "spring", bounce: 0.2 }}
                    className="relative w-full max-w-6xl perspective-[1000px]"
                >
                    <div className="relative rounded-[2rem] overflow-hidden border border-border/50 shadow-[0_40px_100px_-20px_rgba(124,58,237,0.3)] bg-card/90 dark:bg-black/80 backdrop-blur-3xl p-6 md:p-10 group cursor-default">
                        {/* Window Chrome */}
                        <div className="absolute top-4 left-6 flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                        </div>

                        <div className="grid md:grid-cols-12 gap-10 mt-6">
                            {/* Code Section */}
                            <div className="md:col-span-4 text-left border-r border-border/50 pr-6 hidden md:block">
                                <div className="flex items-center gap-2 mb-6 text-muted-foreground text-xs uppercase tracking-widest font-bold">
                                    <Terminal className="h-4 w-4" /> design-tokens.ts
                                </div>
                                <CodePreview />
                            </div>

                            {/* Visual Result Section */}
                            <div className="md:col-span-8 space-y-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/20">
                                            <Cpu className="h-5 w-5 text-primary" />
                                        </div>
                                        <span className="font-bold text-sm tracking-wide">SYSTEM PREVIEW</span>
                                    </div>
                                    <div className="flex gap-2 text-[10px] font-bold text-muted-foreground">
                                        <span className="px-2 py-1 rounded bg-muted/30 border border-border/50 uppercase">v2.0.0</span>
                                        <span className="px-2 py-1 rounded bg-muted/30 border border-border/50 uppercase text-primary">ENTERPRISE READY</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {[
                                        { label: "Primary", color: "bg-primary", val: "#7C3AED" },
                                        { label: "Secondary", color: "bg-secondary", val: "#9333EA" },
                                        { label: "Accent", color: "bg-accent", val: "#F43F5E" },
                                        { label: "Surface", color: "bg-card", val: "#0F172A" },
                                    ].map((c, i) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ scale: 1.05 }}
                                            className="p-3 rounded-2xl bg-muted/20 border border-border/50 text-left space-y-3"
                                        >
                                            <div className={cn("h-16 w-full rounded-xl shadow-inner", c.color)} />
                                            <div>
                                                <p className="text-[10px] text-muted-foreground font-bold uppercase">{c.label}</p>
                                                <p className="text-xs font-mono">{c.val}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 grid grid-cols-3 gap-6">
                                    <div className="space-y-3 col-span-2">
                                        <div className="h-3 w-1/3 bg-muted/50 rounded-full" />
                                        <div className="h-8 w-full bg-muted/30 rounded-xl flex items-center px-4 gap-3">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <div className="h-2 w-2/3 bg-muted/50 rounded-full" />
                                        </div>
                                        <div className="h-12 w-full bg-primary/20 rounded-xl border border-primary/20" />
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 bg-muted/30 gap-2">
                                        <Palette className="h-8 w-8 text-primary" />
                                        <span className="text-[10px] font-bold text-center">GENERATING VARIANTS...</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Orbs in Visual */}
                        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-primary/20 rounded-full blur-[100px] -z-10 group-hover:bg-primary/40 transition-colors" />
                        <div className="absolute -top-20 -left-20 w-60 h-60 bg-accent/10 rounded-full blur-[100px] -z-10 group-hover:bg-accent/20 transition-colors" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
