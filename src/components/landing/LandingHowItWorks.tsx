import { motion } from "framer-motion";

const steps = [
    {
        number: "01",
        title: "Define Your Vision",
        description: "Enter your brand description, industry, or even upload an inspiration image. Our AI analyzes your intent in real-time.",
    },
    {
        number: "02",
        title: "Automate the Mundane",
        description: "Watch as DesignForge generates a complete system: semantic colors, accessible typography, spacing, and interactive components.",
    },
    {
        number: "03",
        title: "Sync & Scale",
        description: "Export tokens to your favorite frameworks or sync with Figma. Your design and code are now perfectly aligned forever.",
    },
];

export const LandingHowItWorks = () => {
    return (
        <section className="py-24 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8">
                    <div className="max-w-xl">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">How It Works</h2>
                        <p className="text-lg text-muted-foreground">
                            We've simplified the complex process of design system creation into three intuitive steps.
                        </p>
                    </div>
                    <div className="hidden md:block w-32 h-px bg-gradient-to-r from-primary to-transparent" />
                </div>

                <div className="grid md:grid-cols-3 gap-12 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-dashed border-t border-dashed border-border pointer-events-none z-0" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="relative z-10"
                        >
                            <div className="h-16 w-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-black mb-8 shadow-lg shadow-primary/20">
                                {step.number}
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
