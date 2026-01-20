import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
    {
        name: "Free",
        price: "$0",
        description: "Perfect for exploring and small side projects.",
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
        price: "$19",
        description: "For professional designers and growing startups.",
        features: [
            "Everything in Free",
            "Figma variable sync",
            "Custom component blueprints",
            "SwiftUI & Android Compose",
            "W3C Design Token support",
            "Priority email support",
        ],
        cta: "Try Pro Free",
        popular: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "Scale with confidence and enterprise governance.",
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
    return (
        <section id="pricing" className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h2>
                    <p className="text-lg text-muted-foreground">
                        Choose the plan that fits your team's needs. No hidden fees, cancel anytime.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`relative p-8 rounded-3xl border ${plan.popular ? "border-primary bg-background shadow-2xl shadow-primary/10" : "border-border/50 bg-card"} flex flex-col`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">
                                    Most Popular
                                </div>
                            )}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.price !== "Custom" && <span className="text-muted-foreground">/mo</span>}
                                </div>
                                <p className="text-sm text-muted-foreground">{plan.description}</p>
                            </div>

                            <div className="space-y-4 mb-10 flex-grow">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Check className="h-3 w-3 text-primary" />
                                        </div>
                                        <span className="text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant={plan.popular ? "default" : "outline"}
                                className={`w-full rounded-full h-12 text-sm font-semibold transition-all duration-300 ${plan.popular ? "hover:scale-105" : "hover:bg-primary/5"}`}
                            >
                                {plan.cta}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
