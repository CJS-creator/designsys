import { motion } from "framer-motion";
import { Users, Code2, Zap, Clock } from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";

const stats = [
    {
        icon: Code2,
        number: 50,
        suffix: "k+",
        label: "Tokens Generated",
        description: "Across thousands of projects",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        icon: Users,
        number: 200,
        suffix: "+",
        label: "Design Teams",
        description: "Trust DesignForge daily",
        color: "text-purple-500",
        bg: "bg-purple-500/10",
    },
    {
        icon: Zap,
        number: 98,
        suffix: "%",
        label: "Efficiency Boost",
        description: "Reported by our users",
        color: "text-amber-500",
        bg: "bg-amber-500/10",
    },
    {
        icon: Clock,
        number: 2,
        suffix: "hr",
        label: "Saved Daily",
        description: "Per designer on average",
        color: "text-green-500",
        bg: "bg-green-500/10",
    },
];

export const LandingStats = () => {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative p-6 rounded-2xl border border-border/50 bg-card/50 hover:bg-card hover:shadow-lg transition-all duration-300 group"
                        >
                            <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}>
                                <stat.icon className="h-6 w-6" />
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-3xl font-bold tracking-tight flex items-baseline">
                                    <NumberTicker value={stat.number} />
                                    <span>{stat.suffix}</span>
                                </h3>
                                <p className="font-semibold text-foreground/80">{stat.label}</p>
                                <p className="text-sm text-muted-foreground">{stat.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
