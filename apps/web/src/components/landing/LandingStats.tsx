import { motion } from "framer-motion";
import { Code2, Zap, Rocket, TrendingUp } from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";

const stats = [
    {
        icon: Code2,
        number: 1200,
        suffix: "k+",
        label: "Tokens Generated",
        description: "Scale-ready architectures",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        progress: 95,
    },
    {
        icon: Rocket,
        number: 92,
        suffix: "%",
        label: "Fewer Code Drifts",
        description: "Automated CI/CD Sync",
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        progress: 92,
    },
    {
        icon: Zap,
        number: 85,
        suffix: "%",
        label: "Handoff Automation",
        description: "Design-to-IDE Velocity",
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        progress: 85,
    },
    {
        icon: TrendingUp,
        number: 90,
        suffix: "%",
        label: "Time Reductions",
        description: "Vs manual creation",
        color: "text-green-500",
        bg: "bg-green-500/10",
        progress: 90,
    },
];

const ProgressRing = ({ progress, color }: { progress: number, color: string }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
                className="text-muted/10"
                strokeWidth="4"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="60"
                cy="60"
            />
            <motion.circle
                className={color}
                strokeWidth="4"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                whileInView={{ strokeDashoffset: offset }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="60"
                cy="60"
            />
        </svg>
    );
};

export const LandingStats = () => {
    return (
        <section className="py-32 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative p-8 rounded-[2rem] border border-border/50 glass-card hover:bg-card/50 hover:border-primary/30 transition-all duration-500 group overflow-hidden"
                        >
                            {/* Icon & Progress Container */}
                            <div className="relative w-24 h-24 mb-8 mx-auto flex items-center justify-center">
                                <ProgressRing progress={stat.progress} color={stat.color} />
                                <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110 duration-500 shadow-lg`}>
                                    <stat.icon className="h-7 w-7" />
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <h3 className="text-4xl font-bold tracking-tighter flex items-baseline justify-center gap-1 whitespace-nowrap">
                                    <NumberTicker value={stat.number} />
                                    <span className="text-2xl text-muted-foreground">{stat.suffix}</span>
                                </h3>
                                <div className="space-y-1">
                                    <p className="font-bold text-foreground text-lg tracking-tight uppercase">{stat.label}</p>
                                    <p className="text-sm text-muted-foreground font-medium leading-relaxed capitalize">{stat.description}</p>
                                </div>
                            </div>

                            {/* Background Glow */}
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
