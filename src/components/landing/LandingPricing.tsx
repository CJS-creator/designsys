import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Shield, Zap, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/animations/MagneticButton";

const plans = [
    {
        name: "Free",
        price: { monthly: 0, yearly: 0 },
        description: "Perfect for exploring and side projects.",
        icon: Rocket,
        features: [
            "AI design system generation",
            "Unlimited token exports",
            "Basic component previews",
            "CSS & JSON exports",
            "Community support",
        ],
        cta: "Get Started",
        popular: false,
    },
    {
        name: "Pro",
        price: { monthly: 19, yearly: 15 },
        description: "For professional designers and startups.",
        icon: Zap,
        features: [
            "Everything in Free",
            "Figma variable sync",
            "Custom component blueprints",
            "SwiftUI & Android Compose",
            "W3C Design Token support",
            "Priority email support",
        ],
        cta: "Start Free Trial",
        popular: true,
    },
    {
        name: "Enterprise",
        price: { monthly: "Custom", yearly: "Custom" },
        description: "Scale with absolute governance.",
        icon: Shield,
        features: [
            "Everything in Pro",
            "Design audit logs",
            "RBAC & Team management",
            "SLA & Dedicated support",
            "Custom AI training",
            "On-premise deployment",
        ],
        cta: "Contact Sales",
        popular: false,
    },
];

export const LandingPricing = () => {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

    return (
        <section id="pricing" className="py-32 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        ROI-DRIVEN PRICING
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Flexible Plans For Teams</h2>
                    <p className="text-lg text-muted-foreground font-medium leading-relaxed mb-10">
                        Choose the plan that fits your team's needs. Save 20% with yearly billing.
                    </p>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <span className={cn("text-sm font-bold transition-colors", billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground")}>Monthly</span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                            className="relative w-14 h-8 rounded-full bg-muted border border-border p-1 transition-colors hover:bg-muted/80"
                        >
                            <motion.div
                                animate={{ x: billingCycle === "monthly" ? 0 : 24 }}
                                className="w-6 h-6 rounded-full bg-primary shadow-lg"
                            />
                        </button>
                        <span className={cn("text-sm font-bold transition-colors", billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground")}>
                            Yearly <span className="text-emerald-500 ml-1">(-20%)</span>
                        </span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={cn(
                                "relative p-10 rounded-[2.5rem] border bg-card/50 backdrop-blur-xl flex flex-col transition-all duration-500 hover:shadow-2xl",
                                plan.popular ? "border-primary/40 shadow-xl shadow-primary/10 ring-1 ring-primary/20" : "border-border/50"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 rounded-full bg-primary text-primary-foreground text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 flex items-center gap-2">
                                    <Sparkles className="h-3 w-3" />
                                    MOST POPULAR
                                </div>
                            )}

                            <div className="mb-10 text-center">
                                <div className={cn("w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-muted/50 border border-border/50", plan.popular && "bg-primary/10 border-primary/20 text-primary")}>
                                    <plan.icon className="h-7 w-7" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 tracking-tight">{plan.name}</h3>
                                <div className="flex items-baseline justify-center gap-1 mb-4 h-12">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={billingCycle}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="text-5xl font-black tracking-tighter"
                                        >
                                            {typeof plan.price[billingCycle] === "number" ? `$${plan.price[billingCycle]}` : plan.price[billingCycle]}
                                        </motion.span>
                                    </AnimatePresence>
                                    {typeof plan.price[billingCycle] === "number" && (
                                        <span className="text-muted-foreground font-bold italic">/mo</span>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground font-medium px-4">{plan.description}</p>
                            </div>

                            <div className="space-y-5 mb-12 flex-grow">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <Check className="h-3 w-3 text-emerald-500" />
                                        </div>
                                        <span className="text-sm font-medium text-foreground/80 leading-relaxed">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <MagneticButton className="w-full">
                                <Button
                                    variant={plan.popular ? "default" : "outline"}
                                    className={cn(
                                        "w-full rounded-2xl h-14 text-md font-black uppercase tracking-widest transition-all duration-300",
                                        plan.popular ? "shadow-xl shadow-primary/30" : "border-2 border-muted hover:bg-muted/50"
                                    )}
                                >
                                    {plan.cta}
                                </Button>
                            </MagneticButton>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] -z-10" />
        </section>
    );
};
