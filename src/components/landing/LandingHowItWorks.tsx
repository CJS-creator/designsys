import { motion } from "framer-motion";
import { Sparkles, Palette, Share2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContainer, CardBody, CardItem } from "@/components/ui/card-3d";

const steps = [
    {
        id: "01",
        title: "AI Generation",
        heading: "Describe your vision, get a system.",
        description: "Simply tell DesignForge what you need. 'A modern fintech dashboard with dark mode' or 'Playful educational app for kids'. Watch as it generates a comprehensive semantic color palette, typography scale, and spacing system instantly.",
        icon: Sparkles,
        color: "bg-purple-500/10 text-purple-500",
        image: "from-purple-500/20 to-blue-500/20",
    },
    {
        id: "02",
        title: "Visual Customization",
        heading: "Fine-tune with precision control.",
        description: "Don't like the primary blue? Want rounded corners? Adjust global tokens in real-time. Our smart engine automatically recalculates all dependent variables, ensuring accessible contrast ratios are maintained.",
        icon: Palette,
        color: "bg-blue-500/10 text-blue-500",
        image: "from-blue-500/20 to-cyan-500/20",
    },
    {
        id: "03",
        title: "Multi-Platform Export",
        heading: "Deploy to Code in one click.",
        description: "Export production-ready code for any platform. Get Tailwind config, CSS Variables, JSON for Figma, SwiftUI Color views, or Jetpack Compose themes. Your design tokens are now the single source of truth.",
        icon: Share2,
        color: "bg-orange-500/10 text-orange-500",
        image: "from-orange-500/20 to-red-500/20",
    },
];

export const LandingHowItWorks = () => {
    return (
        <section id="process" className="py-24 overflow-hidden relative bg-background/50">

            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">How it Works</h2>
                    <p className="text-lg text-muted-foreground">
                        From idea to production code in three simple steps.
                    </p>
                </div>

                <div className="space-y-32">
                    {steps.map((step, index) => (
                        <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-24`}>
                            {/* Text Content */}
                            <motion.div
                                initial={{ opacity: 0, x: index % 2 === 1 ? 50 : -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="flex-1"
                            >
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${step.color} text-xs font-bold uppercase tracking-wider mb-6`}>
                                    <step.icon className="h-4 w-4" />
                                    Step {step.id}
                                </div>
                                <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">{step.heading}</h3>
                                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                    {step.description}
                                </p>
                                <div className="flex items-center gap-4 text-sm font-semibold cursor-pointer group">
                                    <span className="border-b-2 border-transparent group-hover:border-primary transition-colors">Learn more about {step.title}</span>
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </motion.div>

                            {/* Visual/Image (3D Card) */}
                            <div className="flex-1 w-full">
                                <CardContainer className="inter-var w-full">
                                    <CardBody className={`bg-gradient-to-br ${step.image} relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border`}>
                                        <CardItem
                                            translateZ="50"
                                            className="text-xl font-bold text-neutral-600 dark:text-white"
                                        >
                                            {step.title}
                                        </CardItem>
                                        <CardItem
                                            as="p"
                                            translateZ="60"
                                            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                                        >
                                            Interactive Preview
                                        </CardItem>
                                        <CardItem translateZ="100" className="w-full mt-4">
                                            <div className="aspect-video w-full bg-background/80 rounded-xl shadow-lg border border-border/50 p-6 flex flex-col gap-4 relative overflow-hidden">
                                                {/* Mock UI */}
                                                <div className="h-8 w-1/3 bg-foreground/10 rounded-full" />
                                                <div className="h-4 w-full bg- foreground/5 rounded-full" />
                                                <div className="space-y-2">
                                                    <div className="h-4 w-full bg-foreground/5 rounded-full" />
                                                    <div className="h-4 w-5/6 bg-foreground/5 rounded-full" />
                                                </div>

                                                <div className="mt-auto flex gap-4">
                                                    <div className="h-8 w-20 bg-primary/80 rounded-md" />
                                                </div>

                                                {/* Floating Element */}
                                                <div className="absolute top-4 right-4 h-12 w-12 bg-primary/20 rounded-full blur-xl" />
                                            </div>
                                        </CardItem>
                                        <div className="flex justify-between items-center mt-8">
                                            <CardItem
                                                translateZ={20}
                                                as="button"
                                                className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                                            >
                                                Try now →
                                            </CardItem>
                                            <CardItem
                                                translateZ={20}
                                                as="button"
                                                className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                                            >
                                                Sign up
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
