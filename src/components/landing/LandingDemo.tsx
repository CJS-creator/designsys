import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Wand2, RefreshCw, Layers, Type, Palette } from "lucide-react";

const themes = [
    {
        name: "Modern Purple",
        primary: "#8b5cf6",
        secondary: "#10b981",
        radius: "0.75rem",
        font: "Inter",
    },
    {
        name: "Corporate Blue",
        primary: "#3b82f6",
        secondary: "#f59e0b",
        radius: "0.25rem",
        font: "Roboto",
    },
    {
        name: "Elegant Serif",
        primary: "#be123c",
        secondary: "#1e293b",
        radius: "0px",
        font: "Playfair Display",
    },
    {
        name: "Cyber Neon",
        primary: "#d946ef",
        secondary: "#22d3ee",
        radius: "1.5rem",
        font: "JetBrains Mono",
    },
];

export const LandingDemo = () => {
    const [currentTheme, setCurrentTheme] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const generateTheme = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentTheme((prev) => (prev + 1) % themes.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const theme = themes[currentTheme];

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Left Side: Controls */}
                    <div className="flex-1 max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6"
                        >
                            <Wand2 className="h-3 w-3" />
                            Live Preview
                        </motion.div>

                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Experience the Magic of <br />
                            <span className="text-primary">Instant Generation</span>
                        </h2>

                        <p className="text-lg text-muted-foreground mb-8">
                            Don't just take our word for it. Click the button to see how DesignForge instantly reimagines an entire interface with semantic consistency.
                        </p>

                        <div className="flex gap-4">
                            <Button
                                size="lg"
                                onClick={generateTheme}
                                disabled={isAnimating}
                                className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-1"
                            >
                                <RefreshCw className={`mr-2 h-5 w-5 ${isAnimating ? "animate-spin" : ""}`} />
                                {isAnimating ? "Generating..." : "Generate New System"}
                            </Button>
                        </div>

                        <div className="mt-12 grid grid-cols-3 gap-6">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-primary font-semibold">
                                    <Palette className="h-4 w-4" /> Colors
                                </div>
                                <div className="text-sm text-muted-foreground">Semantic HSL palettes generated automatically.</div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-primary font-semibold">
                                    <Type className="h-4 w-4" /> Typography
                                </div>
                                <div className="text-sm text-muted-foreground">Perfectly scaled type ramps and pairings.</div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-primary font-semibold">
                                    <Layers className="h-4 w-4" /> Tokens
                                </div>
                                <div className="text-sm text-muted-foreground">W3C standard tokens ready for export.</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Preview Card */}
                    <div className="flex-1 w-full relative perspective-1000">
                        {/* Background Decorations */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-[100px] -z-10" />

                        <motion.div
                            layout
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden p-6 md:p-8"
                            style={{
                                fontFamily: theme.font,
                            }}
                        >
                            {/* Mini App Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg" style={{ backgroundColor: theme.primary, borderRadius: theme.radius }} />
                                    <div className="font-bold text-lg">App UI</div>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>Dashboard</span>
                                    <span>Settings</span>
                                    <div className="h-8 w-8 rounded-full bg-muted" />
                                </div>
                            </div>

                            {/* Mini App Content */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div
                                    className="p-4 rounded-xl border transition-colors duration-500"
                                    style={{
                                        borderColor: `${theme.primary}40`,
                                        backgroundColor: `${theme.primary}10`,
                                        borderRadius: theme.radius
                                    }}
                                >
                                    <div className="text-sm text-muted-foreground mb-1">Total Revenue</div>
                                    <div className="text-2xl font-bold" style={{ color: theme.primary }}>$45,231</div>
                                </div>
                                <div
                                    className="p-4 rounded-xl border transition-colors duration-500"
                                    style={{
                                        borderColor: `${theme.secondary}40`,
                                        backgroundColor: `${theme.secondary}10`,
                                        borderRadius: theme.radius
                                    }}
                                >
                                    <div className="text-sm text-muted-foreground mb-1">Active Users</div>
                                    <div className="text-2xl font-bold" style={{ color: theme.secondary }}>+2,543</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="h-32 rounded-xl bg-muted/50 w-full animate-pulse" style={{ borderRadius: theme.radius }} />
                                <div className="flex gap-4">
                                    <Button
                                        className="flex-1 transition-all duration-500"
                                        style={{
                                            backgroundColor: theme.primary,
                                            borderRadius: theme.radius
                                        }}
                                    >
                                        Primary Action
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 transition-all duration-500"
                                        style={{
                                            borderColor: theme.primary,
                                            color: theme.primary,
                                            borderRadius: theme.radius
                                        }}
                                    >
                                        Secondary
                                    </Button>
                                </div>
                            </div>

                        </motion.div>

                        {/* Floating Code Snippet */}
                        <motion.div
                            key={currentTheme}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="absolute -bottom-6 -right-6 md:right-0 bg-zinc-900 text-zinc-100 p-4 rounded-xl shadow-xl text-xs font-mono border border-zinc-700 hidden sm:block"
                        >
                            <div className="flex gap-1.5 mb-3">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                            </div>
                            <div>
                                <span className="text-purple-400">const</span> <span className="text-blue-400">theme</span> = {"{"}
                            </div>
                            <div className="pl-4">
                                <span className="text-blue-300">primary</span>: <span className="text-orange-300">"{theme.primary}"</span>,
                            </div>
                            <div className="pl-4">
                                <span className="text-blue-300">fontFamily</span>: <span className="text-orange-300">"{theme.font}"</span>,
                            </div>
                            <div className="pl-4">
                                <span className="text-blue-300">radius</span>: <span className="text-orange-300">"{theme.radius}"</span>
                            </div>
                            <div>{"}"};</div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
