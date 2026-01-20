import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Quote, Star, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const testimonials = [
    {
        quote: "DesignForge has completely transformed how our engineering and design teams collaborate. The AI-generated tokens are incredibly accurate and saved us weeks of manual work.",
        author: "Sarah Chen",
        role: "Design Director at TechFlow",
        avatar: "https://i.pravatar.cc/150?u=sarah",
        rating: 5,
    },
    {
        quote: "The ability to export directly to SwiftUI and Android Compose is a game-changer for our mobile development. It's the design system tool we've been waiting for.",
        author: "James Wilson",
        role: "Lead Developer at AppScale",
        avatar: "https://i.pravatar.cc/150?u=james",
        rating: 5,
    },
    {
        quote: "Creating a design system used to be a daunting task. With DesignForge, we had our first production-ready version in less than an hour. Simply magical.",
        author: "Elena Rodriguez",
        role: "Founder of CreativeStudio",
        avatar: "https://i.pravatar.cc/150?u=elena",
        rating: 5,
    },
    {
        quote: "Finally, a tool that understands semantic tokens. The export quality is pristine and the Figma sync works flawlessly.",
        author: "Marcus Johnson",
        role: "CTO at Nexus",
        avatar: "https://i.pravatar.cc/150?u=marcus",
        rating: 5,
    },
    {
        quote: "We migrated our entire legacy system to DesignForge in a weekend. The ROI was immediate.",
        author: "Olivia Parker",
        role: "Product Lead at Zenith",
        avatar: "https://i.pravatar.cc/150?u=olivia",
        rating: 5,
    }
];

const TestimonialCard = ({ testimonial, className }: { testimonial: any, className?: string }) => {
    return (
        <div className={cn("flex flex-col p-8 rounded-[2rem] bg-card border border-border/50 hover:border-primary/30 transition-colors relative group min-w-[350px] md:min-w-[400px]", className)}>
            <div className="absolute top-8 right-8 text-primary/10 group-hover:text-primary/20 transition-colors">
                <Quote className="h-12 w-12 fill-current rotate-12" />
            </div>

            <div className="flex gap-1 mb-6 text-amber-400">
                {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Star className="h-4 w-4 fill-current" />
                    </motion.div>
                ))}
            </div>

            <p className="text-lg leading-relaxed mb-8 font-medium text-foreground/90 relative z-10">
                "{testimonial.quote}"
            </p>

            <div className="flex items-center gap-4 mt-auto">
                <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                    <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                </Avatar>
                <div>
                    <h4 className="font-bold text-sm">{testimonial.author}</h4>
                    <p className="text-xs text-muted-foreground font-medium">{testimonial.role}</p>
                </div>
            </div>
        </div>
    );
};

export const LandingTestimonials = () => {
    return (
        <section id="testimonials" className="py-32 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4 mb-16 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                    <MessageSquare className="h-3 w-3" />
                    Community Love
                </div>
                <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Loved by Product Teams</h2>
                <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
                    See why leading companies choose DesignForge for their mission-critical design systems.
                </p>
            </div>

            {/* Infinite Marquee */}
            <div className="relative flex overflow-hidden mask-linear-gradient-sides">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                <div className="flex gap-8 animate-marquee pl-4">
                    {[...testimonials, ...testimonials, ...testimonials].map((testimonial, i) => (
                        <TestimonialCard key={i} testimonial={testimonial} />
                    ))}
                </div>
            </div>
        </section>
    );
};
