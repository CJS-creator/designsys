import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Sparkles, Palette, Share2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContainer, CardBody, CardItem } from "@/components/ui/card-3d";
import { cn } from "@/lib/utils";

const steps = [
    {
        id: "01",
        title: "AI Generation",
        heading: "Describe your vision, get a system.",
        description: "Simply tell DesignForge what you need. 'A modern fintech dashboard' or 'Playful educational app'. Our engine generates a comprehensive semantic color palette, typography scale, and spacing system instantly.",
        icon: Sparkles,
        color: "bg-purple-500/10 text-purple-500",
        image: "from-purple-500/20 to-blue-500/20",
    },
    {
        id: "02",
        title: "AI Design Audit",
        heading: "refine with precision AI insights.",
        description: "Our Design Audit Engine automatically scans for accessibility fails, inconsistency, and missed tokens. Apply 'Smart Fixes' to optimize contrast ratios and semantic architecture with one click.",
        icon: Palette,
        color: "bg-blue-500/10 text-blue-500",
        image: "from-blue-500/20 to-cyan-500/20",
    },
    {
        id: "03",
        title: "Enterprise Sync",
        heading: "Deploy to Code and stay in sync.",
        description: "Export production-ready components and tokens. Use the CLI Sync utility or GitHub Actions to automate design delivery to your IDE and CI/CD pipelines. No more manual handoff friction.",
        icon: Share2,
        color: "bg-orange-500/10 text-orange-500",
        image: "from-orange-500/20 to-red-500/20",
    },
];

const TracingBeam = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start center", "end center"]
    });

    const pathLength = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div ref={ref} className="absolute left-1/2 -translate-x-1/2 top-40 bottom-40 w-1 hidden md:block">
            <svg className="w-full h-full" preserveAspectRatio="none">
                <line
                    x1="50%" y1="0" x2="50%" y2="100%"
                    className="stroke-muted-foreground/10"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                />
                <motion.line
                    x1="50%" y1="0" x2="50%" y2="100%"
                    className="stroke-primary"
                    strokeWidth="2"
                    style={{ pathLength }}
                />
            </svg>

            {/* Animated Particle */}
            <motion.div
                style={{ top: useTransform(pathLength, [0, 1], ["0%", "100%"]) }}
                className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_rgba(124,58,237,0.8)] z-20"
            >
                <div className="absolute inset-0 animate-ping bg-primary rounded-full opacity-50" />
            </motion.div>
        </div>
    );
};

export const LandingHowItWorks = () => {
    return (
        <section id="process" className="py-32 overflow-hidden relative bg-background">
            <div className="container mx-auto px-4 relative">
                <TracingBeam />

                <div className="text-center max-w-3xl mx-auto mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        THE WORKFLOW
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">From Logic To Pixels</h2>
                    <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                        Deploy your design system in record time with our streamlined technical workflow.
                    </p>
                </div>

                <div className="space-y-48">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex flex-col items-center gap-16 md:gap-32 relative",
                                index % 2 === 1 ? "md:flex-row-reverse text-right" : "md:flex-row text-left"
                            )}
                        >
                            {/* Text Content */}
                            <motion.div
                                initial={{ opacity: 0, x: index % 2 === 1 ? 60 : -60 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, type: "spring" }}
                                className="flex-1 space-y-6"
                            >
                                <div className={cn(
                                    "inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-black/5",
                                    step.color
                                )}>
                                    <step.icon className="h-4 w-4" />
                                    Step {step.id}
                                </div>
                                <h3 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.1]">
                                    {step.heading}
                                </h3>
                                <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                                    {step.description}
                                </p>
                                <div className={cn(
                                    "flex items-center gap-3 text-sm font-black cursor-pointer group transition-all link-underline pb-1",
                                    index % 2 === 1 ? "justify-end" : "justify-start"
                                )}>
                                    <span className="uppercase tracking-widest group-hover:text-primary transition-all">
                                        Technical Docs
                                    </span>
                                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2 text-primary" />
                                </div>
                            </motion.div>

                            {/* Visual/Image (3D Card) */}
                            <div className="flex-1 w-full flex justify-center">
                                <CardContainer className="inter-var w-full max-w-xl">
                                    <CardBody className={cn(
                                        "relative group/card bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 w-full h-auto rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10",
                                        `bg-gradient-to-br ${step.image}`
                                    )}>
                                        <CardItem
                                            translateZ="60"
                                            className="text-2xl font-black text-foreground tracking-tighter"
                                        >
                                            {step.title.toUpperCase()}
                                        </CardItem>

                                        <CardItem translateZ="100" className="w-full mt-8">
                                            <div className="aspect-[4/3] w-full bg-background/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 flex flex-col gap-6 relative overflow-hidden ring-1 ring-white/20">
                                                {/* Mock UI Structure */}
                                                <div className="flex justify-between items-center">
                                                    <div className="h-1.5 w-24 bg-primary/40 rounded-full" />
                                                    <div className="flex gap-2">
                                                        <div className="h-6 w-6 rounded-full bg-white/10" />
                                                        <div className="h-6 w-6 rounded-full bg-white/10" />
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <motion.div
                                                        animate={{ width: ["10%", "80%", "40%"] }}
                                                        transition={{ duration: 4, repeat: Infinity }}
                                                        className="h-8 bg-primary/20 rounded-xl"
                                                    />
                                                    <div className="h-32 w-full bg-black/5 dark:bg-white/5 rounded-2xl border border-dashed border-white/10 flex items-center justify-center">
                                                        <step.icon className="h-12 w-12 text-primary/30" />
                                                    </div>
                                                </div>

                                                <div className="mt-auto flex justify-between">
                                                    <div className="h-10 w-24 bg-primary rounded-xl" />
                                                    <div className="h-10 w-10 bg-white/10 rounded-xl" />
                                                </div>

                                                {/* Particle decoration inside card */}
                                                <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-[60px]" />
                                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-[60px]" />
                                            </div>
                                        </CardItem>

                                        <div className="flex justify-between items-center mt-12">
                                            <CardItem
                                                translateZ={20}
                                                as="button"
                                                className="px-6 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                Details →
                                            </CardItem>
                                            <CardItem
                                                translateZ={20}
                                                as="button"
                                                className="px-8 py-3 rounded-2xl bg-foreground text-background text-sm font-black transition-transform hover:scale-105"
                                            >
                                                Try It
                                            </CardItem>
                                        </div>
                                    </CardBody>
                                </CardContainer>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
