import { motion } from "framer-motion";
import { Brain, Zap, Smartphone, Sparkles, Layout, Shield } from "lucide-react";

const features = [
    {
        icon: Brain,
        title: "AI Analysis",
        description: "Our engine understands your brand industry and generates context-aware harmonies.",
        color: "bg-purple-500/10 text-purple-500",
    },
    {
        icon: Zap,
        title: "Instant Tokens",
        description: "Generate W3C-standard design tokens in seconds, not hours. Ready for any build tool.",
        color: "bg-blue-500/10 text-blue-500",
    },
    {
        icon: Smartphone,
        title: "Multi-Platform Export",
        description: "Export directly to CSS, Tailwind, SwiftUI, Compose, and more with one click.",
        color: "bg-green-500/10 text-green-500",
    },
    {
        icon: Sparkles,
        title: "Visionary Generation",
        description: "Upload an image or prompt a mood, and watch as your entire system comes to life.",
        color: "bg-amber-500/10 text-amber-500",
    },
    {
        icon: Layout,
        title: "Figma Sync",
        description: "Two-way sync with Figma variables to keep your design and code always in lockstep.",
        color: "bg-pink-500/10 text-pink-500",
    },
    {
        icon: Shield,
        title: "Enterprise Governance",
        description: "Role-based access, design audit logs, and project freezing for secure team collaboration.",
        color: "bg-cyan-500/10 text-cyan-500",
    },
];

export const LandingFeatures = () => {
    return (
        <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Designed for Modern Teams</h2>
                    <p className="text-lg text-muted-foreground">
                        DesignForge provides a comprehensive suite of tools to bridge the gap between design and development.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="p-8 rounded-2xl bg-card border border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group"
                        >
                            <div className={`h-12 w-12 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
