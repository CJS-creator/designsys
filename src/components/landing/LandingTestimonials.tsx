import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
    {
        quote: "DesignForge has completely transformed how our engineering and design teams collaborate. The AI-generated tokens are incredibly accurate and saved us weeks of manual work.",
        author: "Sarah Chen",
        role: "Design Director at TechFlow",
        avatar: "https://i.pravatar.cc/150?u=sarah",
        companyLogo: "https://logo.clearbit.com/stripe.com",
        rating: 5,
    },
    {
        quote: "The ability to export directly to SwiftUI and Android Compose is a game-changer for our mobile development. It's the design system tool we've been waiting for.",
        author: "James Wilson",
        role: "Lead Developer at AppScale",
        avatar: "https://i.pravatar.cc/150?u=james",
        companyLogo: "https://logo.clearbit.com/airbnb.com",
        rating: 5,
    },
    {
        quote: "Creating a design system used to be a daunting task. With DesignForge, we had our first production-ready version in less than an hour. Simply magical.",
        author: "Elena Rodriguez",
        role: "Founder of CreativeStudio",
        avatar: "https://i.pravatar.cc/150?u=elena",
        companyLogo: "https://logo.clearbit.com/spotify.com",
        rating: 5,
    },
];

export const LandingTestimonials = () => {
    return (
        <section id="testimonials" className="py-24 bg-gradient-to-b from-background to-muted/20">
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
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col p-8 rounded-3xl bg-card border border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group"
                        >
                            {/* Decorative Quote Icon */}
                            <div className="absolute top-6 right-8 text-primary/5 group-hover:text-primary/10 transition-colors">
                                <Quote className="h-24 w-24 fill-current rotate-12" />
                            </div>

                            {/* Stars */}
                            <div className="flex gap-1 mb-6 text-amber-400">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-current" />
                                ))}
                            </div>

                            {/* Content */}
                            <div className="relative z-10 flex-grow">
                                <p className="text-lg leading-relaxed mb-8 font-medium text-foreground/90">
                                    "{testimonial.quote}"
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center gap-4 pt-6 border-t border-border/50 mt-auto">
                                <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                    <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                                    <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-bold text-sm">{testimonial.author}</h4>
                                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
