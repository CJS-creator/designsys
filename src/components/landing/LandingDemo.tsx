import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Wand2, RefreshCw, Layers, Type, Palette, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

const TypewriterCode = ({ code }: { code: string }) => {
    const [displayCode, setDisplayCode] = useState("");

    useEffect(() => {
        let i = 0;
        setDisplayCode("");
        const interval = setInterval(() => {
            if (i < code.length) {
                setDisplayCode(prev => prev + code.charAt(i));
                i++;
            } else {
                clearInterval(interval);
            }
        }, 20); // Typing speed
        return () => clearInterval(interval);
    }, [code]);

    return (
        <pre className="font-mono text-xs text-blue-300 overflow-x-auto whitespace-pre-wrap break-all">
            {displayCode}
            <span className="animate-pulse inline-block w-2 H-4 bg-primary ml-1">|</span>
        </pre>
    );
};

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

    // Dynamic particle explosion effect on theme change
    const Particles = () => (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                    animate={{ opacity: 0, scale: Math.random() * 2, x: (Math.random() - 0.5) * 400, y: (Math.random() - 0.5) * 400 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full"
                    style={{ backgroundColor: i % 2 === 0 ? theme.primary : theme.secondary }}
                />
            ))}
        </div>
    );

    return (
        <section className="py-32 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-20">

                    {/* Left Side: Controls */}
                    <div className="flex-1 max-w-xl relative">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-8"
                        >
                            <Wand2 className="h-3 w-3" />
                            Live Preview
                        </motion.div>

                        <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight">
                            One Click, <br />
                            <span className="text-primary">Infinite Possibilities</span>
                        </h2>

                        <p className="text-xl text-muted-foreground mb-10 leading-relaxed font-medium">
                            Don't just take our word for it. Click the button to see how DesignForge instantly reimagines an entire interface with semantic consistency.
                        </p>

                        <div className="flex gap-4 mb-12 relative z-10">
                            <Button
                                size="lg"
                                onClick={generateTheme}
                                disabled={isAnimating}
                                className="h-16 px-10 text-lg rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105 active:scale-95 font-bold uppercase tracking-wide"
                            >
                                <RefreshCw className={cn("mr-3 h-5 w-5", isAnimating && "animate-spin")} />
                                {isAnimating ? "Generating..." : "Generate System"}
                            </Button>
                        </div>

                        {/* Interactive particles container */}
                        <AnimatePresence>
                            {isAnimating && <Particles />}
                        </AnimatePresence>

                        <div className="grid grid-cols-3 gap-8 border-t border-border/50 pt-8">
                            {[
                                { icon: Palette, label: "Colors", desc: "Semantic HSL palettes" },
                                { icon: Type, label: "Typography", desc: "Fluid type scales" },
                                { icon: Layers, label: "Tokens", desc: "W3C standard export" },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col gap-3 group cursor-default">
                                    <div className="flex items-center gap-2 text-foreground font-bold group-hover:text-primary transition-colors">
                                        <item.icon className="h-5 w-5" /> {item.label}
                                    </div>
                                    <div className="text-xs text-muted-foreground font-medium leading-relaxed">{item.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Preview Card */}
                    <div className="flex-1 w-full relative perspective-[2000px]">
                        {/* Background Decorations */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-full blur-[120px] -z-10 animate-pulse-soft" />

                        <motion.div
                            layout
                            key={currentTheme} // Force re-render for clean transition
                            initial={{ rotateY: -5, opacity: 0, scale: 0.9 }}
                            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            className="bg-zinc-950/90 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden p-8 md:p-10 relative ring-1 ring-white/20"
                            style={{
                                fontFamily: theme.font,
                            }}
                        >
                            {/* Window Chrome */}
                            <div className="flex items-center gap-2 mb-8 opacity-50">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>

                            {/* Mini App Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 shadow-lg" style={{ backgroundColor: theme.primary, borderRadius: theme.radius }} />
                                    <div>
                                        <div className="font-bold text-lg leading-none">Dashboard</div>
                                        <div className="text-xs opacity-50 mt-1">v2.4.0</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 rounded-full p-1 pr-4 border border-white/5">
                                    <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">JD</div>
                                    <span className="text-xs font-medium opacity-70">John Doe</span>
                                    <ChevronRight className="h-3 w-3 opacity-50 ml-auto" />
                                </div>
                            </div>

                            {/* Mini App Content */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div
                                    className="p-5 border transition-all duration-500 shadow-lg relative overflow-hidden group"
                                    style={{
                                        borderColor: `${theme.primary}30`,
                                        backgroundColor: `${theme.primary}10`,
                                        borderRadius: theme.radius
                                    }}
                                >
                                    <div className="text-xs font-bold opacity-60 mb-1 uppercase tracking-wider">Revenue</div>
                                    <div className="text-3xl font-black tracking-tight" style={{ color: theme.primary }}>$84k</div>
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-30" style={{ color: theme.primary }} />
                                </div>
                                <div
                                    className="p-5 border transition-all duration-500 shadow-lg"
                                    style={{
                                        borderColor: `${theme.secondary}30`,
                                        backgroundColor: `${theme.secondary}10`,
                                        borderRadius: theme.radius
                                    }}
                                >
                                    <div className="text-xs font-bold opacity-60 mb-1 uppercase tracking-wider">Growth</div>
                                    <div className="text-3xl font-black tracking-tight" style={{ color: theme.secondary }}>+24%</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="h-28 bg-white/5 w-full animate-pulse border border-white/5" style={{ borderRadius: theme.radius }} />
                                <div className="flex gap-4 pt-4">
                                    <Button
                                        className="flex-1 h-12 font-bold shadow-lg transition-all duration-500 hover:brightness-110"
                                        style={{
                                            backgroundColor: theme.primary,
                                            borderRadius: theme.radius
                                        }}
                                    >
                                        Edit Profile
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-12 font-bold bg-transparent transition-all duration-500 hover:bg-white/5"
                                        style={{
                                            borderColor: theme.primary,
                                            color: theme.primary,
                                            borderRadius: theme.radius
                                        }}
                                    >
                                        Settings
                                    </Button>
                                </div>
                            </div>

                        </motion.div>

                        {/* Floating Live Code Snippet */}
                        <motion.div
                            key={`code-${currentTheme}`}
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="absolute -bottom-8 -right-8 md:-right-12 bg-zinc-950 p-6 rounded-2xl shadow-2xl border border-zinc-800 hidden sm:block w-72"
                        >
                            <div className="text-[10px] uppercase text-zinc-500 font-bold mb-2 tracking-widest flex items-center gap-2">
                                <Wand2 className="h-3 w-3" /> Generated Output
                            </div>
                            <TypewriterCode
                                code={`const theme = {\n  primary: "${theme.primary}",\n  radius: "${theme.radius}",\n  font: "${theme.font}"\n};`}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
