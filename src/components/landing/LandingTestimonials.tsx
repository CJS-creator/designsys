import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
    {
        quote: "DesignForge has completely transformed how our engineering and design teams collaborate. The AI-generated tokens are incredibly accurate and saved us weeks of manual work.",
        author: "Sarah Chen",
        role: "Design Director at TechFlow",
        avatar: "https://i.pravatar.cc/150?u=sarah",
    },
    {
        quote: "The ability to export directly to SwiftUI and Android Compose is a game-changer for our mobile development. It's the design system tool we've been waiting for.",
        author: "James Wilson",
        role: "Lead Developer at AppScale",
        avatar: "https://i.pravatar.cc/150?u=james",
    },
    {
        quote: "Creating a design system used to be a daunting task. With DesignForge, we had our first production-ready version in less than an hour. Simply magical.",
        author: "Elena Rodriguez",
        role: "Founder of CreativeStudio",
        avatar: "https://i.pravatar.cc/150?u=elena",
    },
];

export const LandingTestimonials = () => {
    return (
        <section className="py-24">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Loved by Product Teams</h2>
                    <p className="text-lg text-muted-foreground">
                        See why leading companies choose DesignForge for their mission-critical design systems.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="p-8 rounded-3xl bg-card border border-border/50 relative"
                        >
                            <div className="absolute top-8 right-8 text-primary/10">
                                <Quote className="h-12 w-12 fill-current" />
                            </div>

                            <div className="relative z-10">
                                <p className="text-lg leading-relaxed mb-8 italic">
                                    "{testimonial.quote}"
                                </p>

                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full overflow-hidden border border-border">
                                        <img src={testimonial.avatar} alt={testimonial.author} className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{testimonial.author}</h4>
                                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
