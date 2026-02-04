import { GeneratedDesignSystem } from "@/types/designSystem";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart } from "lucide-react";

interface LayoutGeneratorProps {
    designSystem: GeneratedDesignSystem;
    type: "saas" | "portfolio" | "ecommerce";
    isDark?: boolean;
}

export const LayoutGenerator = ({ designSystem, type, isDark = false }: LayoutGeneratorProps) => {
    const { colors, typography, spacing, borderRadius, shadows } = designSystem;

    // Dynamic styles based on theme
    const bgColor = isDark ? colors.background : colors.surface;
    const textColor = isDark ? "#ffffff" : colors.text;
    const mutedTextColor = isDark ? "rgba(255,255,255,0.7)" : colors.textSecondary;
    // cardBg available for future use: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)"

    const containerStyle = {
        fontFamily: typography.fontFamily.body,
        backgroundColor: bgColor,
        color: textColor,
        minHeight: "400px",
        padding: spacing.scale["8"],
        borderRadius: borderRadius.lg,
        transition: "all 0.3s ease",
    };

    if (type === "saas") {
        return (
            <div style={containerStyle} className="space-y-12">
                {/* Navigation Placeholder */}
                <nav className="flex items-center justify-between">
                    <div className="font-bold text-xl" style={{ fontFamily: typography.fontFamily.heading, color: colors.primary }}>
                        DesignForge.ai
                    </div>
                    <div className="hidden md:flex gap-6 text-sm font-medium">
                        <span>Features</span>
                        <span>Pricing</span>
                        <span>About</span>
                    </div>
                    <Button style={{ backgroundColor: colors.primary, borderRadius: borderRadius.md }}>Get Started</Button>
                </nav>

                {/* Hero Section */}
                <div className="text-center space-y-6 max-w-3xl mx-auto py-12">
                    <h1
                        style={{
                            fontFamily: typography.fontFamily.heading,
                            fontSize: typography.sizes["5xl"],
                            lineHeight: 1.1,
                            letterSpacing: "-0.02em"
                        }}
                        className="font-bold"
                    >
                        Ship beautiful interfaces <span style={{ color: colors.primary }}>faster than ever</span>
                    </h1>
                    <p className="text-lg opacity-80" style={{ color: mutedTextColor }}>
                        DesignForge uses intelligent algorithms to generate cohesive design systems and production-ready components in seconds.
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <Button size="lg" style={{ backgroundColor: colors.primary, borderRadius: borderRadius.md }} className="gap-2">
                            Start Building <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="lg" style={{ borderRadius: borderRadius.md }}>
                            View Demo
                        </Button>
                    </div>
                </div>

                {/* Dashboard Preview Mockup */}
                <div
                    className="w-full aspect-video rounded-xl border p-4 shadow-2xl relative overflow-hidden"
                    style={{
                        backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "white",
                        borderColor: "rgba(128,128,128,0.2)",
                        borderRadius: borderRadius.xl
                    }}
                >
                    <div className="flex gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1 space-y-4">
                            <div className="h-8 w-full rounded bg-muted/50" />
                            <div className="h-40 w-full rounded bg-muted/30" />
                        </div>
                        <div className="col-span-3 space-y-4">
                            <div className="h-12 w-full rounded bg-primary/10" />
                            <div className="grid grid-cols-3 gap-4">
                                <div className="h-32 rounded bg-muted/20" />
                                <div className="h-32 rounded bg-muted/20" />
                                <div className="h-32 rounded bg-muted/20" />
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
                </div>
            </div>
        );
    }

    if (type === "portfolio") {
        return (
            <div style={containerStyle} className="max-w-4xl mx-auto py-20">
                <div className="space-y-16">
                    <header className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-1 w-8" style={{ backgroundColor: colors.accent }} />
                            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: colors.accent }}>Product Designer</span>
                        </div>
                        <h1 style={{ fontFamily: typography.fontFamily.heading, fontSize: typography.sizes["5xl"] }} className="font-bold">
                            Alex Rivera
                        </h1>
                    </header>

                    <section className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <p className="text-xl leading-relaxed italic" style={{ borderLeft: `4px solid ${colors.primary}`, paddingLeft: spacing.scale["4"] }}>
                                "Building digital products that feel human, using math, design, and a bit of magic."
                            </p>
                            <div className="flex gap-4">
                                <Button variant="link" className="p-0 h-auto" style={{ color: colors.primary }}>Twitter</Button>
                                <Button variant="link" className="p-0 h-auto" style={{ color: colors.primary }}>Dribbble</Button>
                                <Button variant="link" className="p-0 h-auto" style={{ color: colors.primary }}>GitHub</Button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg" style={{ fontFamily: typography.fontFamily.heading }}>Latest Work</h3>
                            <div className="space-y-2">
                                {["DesignForge Mobile", "Fintech Dashboard", "Crypto Wallet UX"].map(job => (
                                    <div key={job} className="flex justify-between items-center py-2 border-b border-muted">
                                        <span className="font-medium text-sm">{job}</span>
                                        <span className="text-xs opacity-60">2024</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-[4/5] rounded-lg overflow-hidden bg-muted/20" style={{ borderRadius: borderRadius["2xl"] }} />
                        <div className="aspect-[4/5] rounded-lg overflow-hidden bg-muted/20" style={{ borderRadius: borderRadius["2xl"] }} />
                    </div>
                </div>
            </div>
        );
    }

    if (type === "ecommerce") {
        return (
            <div style={containerStyle}>
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h2 style={{ fontFamily: typography.fontFamily.heading, fontSize: typography.sizes["3xl"] }} className="font-bold">
                            Featured Products
                        </h2>
                        <p className="opacity-60">Explore our seasonal collection of handcrafted essentials.</p>
                    </div>
                    <Button variant="ghost" className="gap-2">View All <ArrowRight className="h-4 w-4" /></Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { name: "Minimalist Watch", price: "$120", tag: "Hot" },
                        { name: "Leather Tote", price: "$85", tag: "New" },
                        { name: "Studio Speaker", price: "$340", tag: "Featured" }
                    ].map((product, i) => (
                        <div
                            key={i}
                            className="group cursor-pointer transition-all duration-300"
                            style={{ padding: spacing.scale["2"] }}
                        >
                            <div
                                className="aspect-square w-full mb-4 relative overflow-hidden flex items-center justify-center bg-muted/20"
                                style={{
                                    borderRadius: borderRadius.xl,
                                    boxShadow: shadows.md
                                }}
                            >
                                <div className="h-24 w-24 rounded-full bg-primary/10 group-hover:scale-110 transition-transform" />
                                <Badge
                                    className="absolute top-4 left-4"
                                    style={{ backgroundColor: i % 2 === 0 ? colors.primary : colors.accent }}
                                >
                                    {product.tag}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-sm">{product.name}</h3>
                                    <p className="text-lg font-bold" style={{ color: colors.primary }}>{product.price}</p>
                                </div>
                                <Button size="icon" variant="secondary" className="rounded-full h-8 w-8">
                                    <ShoppingCart className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return null;
};

const Badge = ({ children, style, className }: { children: React.ReactNode, style?: React.CSSProperties, className?: string }) => (
    <span
        className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded text-white ${className}`}
        style={style}
    >
        {children}
    </span>
);
