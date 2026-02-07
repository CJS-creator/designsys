
import { motion } from "framer-motion";
import {
    Figma,
    Slack,
    Github,
    Twitter,
    Twitch,
    Chrome,
    Codepen,
    Dribbble,
    Terminal,
    Cpu,
    Zap,
    Wind,
    Shield,
    Globe,
    Cloud,
    Database
} from "lucide-react";


const logos = [
    { name: "Figma", icon: Figma },
    { name: "Slack", icon: Slack },
    { name: "GitHub", icon: Github },
    { name: "Twitter", icon: Twitter },
    { name: "Twitch", icon: Twitch },
    { name: "Chrome", icon: Chrome },
    { name: "CodePen", icon: Codepen },
    { name: "Dribbble", icon: Dribbble },
];

const secondaryLogos = [
    { name: "DevOps", icon: Terminal },
    { name: "Core", icon: Cpu },
    { name: "Spark", icon: Zap },
    { name: "Flow", icon: Wind },
    { name: "Shield", icon: Shield },
    { name: "Global", icon: Globe },
    { name: "Cloud", icon: Cloud },
    { name: "Stack", icon: Database },
];

const MarqueeRow = ({ items, reverse = false, speed = 40 }: { items: any[], reverse?: boolean, speed?: number }) => {
    return (
        <div className="flex overflow-hidden group select-none py-4">
            <motion.div
                animate={{
                    x: reverse ? [0, -1035] : [-1035, 0],
                }}
                transition={{
                    duration: speed,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="flex flex-none gap-8 pr-8"
            >
                {[...items, ...items, ...items, ...items].map((logo, index) => (
                    <div
                        key={`${logo.name}-${index}`}
                        className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group/logo cursor-pointer"
                    >
                        <logo.icon className="h-6 w-6 text-muted-foreground transition-all duration-300 group-hover/logo:text-primary group-hover/logo:scale-110" />
                        <span className="text-sm font-bold text-muted-foreground/80 tracking-tight transition-colors group-hover/logo:text-foreground">
                            {logo.name}
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export const LandingLogos = () => {
    return (
        <section className="py-24 relative overflow-hidden bg-background">
            <div className="container mx-auto px-4 mb-12 text-center relative z-10">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-4"
                >
                    TRUSTED BY THE INDUSTRY
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl md:text-3xl font-bold tracking-tight"
                >
                    Powers design teams at world-class companies
                </motion.h2>
            </div>

            <div className="relative">
                {/* Side Gradients for fading effect */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                <div className="space-y-4">
                    <MarqueeRow items={logos} speed={30} />
                    <MarqueeRow items={secondaryLogos} reverse speed={35} />
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/5 rounded-full blur-[120px] -z-10" />
        </section>
    );
};
