import { motion } from "framer-motion";
import {
    Figma,
    Slack,
    Github,
    Twitter,
    Twitch,
    Chrome,
    Codepen,
    Dribbble
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

export const LandingLogos = () => {
    return (
        <section className="py-12 border-y border-border/50 bg-muted/20 overflow-hidden relative">
            <div className="container mx-auto px-4 mb-8 text-center">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                    Trusted by innovative teams everywhere
                </p>
            </div>

            <div className="flex relative overflow-hidden mask-linear-gradient">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

                {/* Marquee Track - Duplicate lists for seamless loop */}
                <div className="flex gap-16 min-w-full animate-marquee items-center justify-around whitespace-nowrap">
                    {[...logos, ...logos].map((logo, index) => (
                        <div
                            key={`${logo.name}-${index}`}
                            className="flex items-center gap-2 group cursor-default"
                        >
                            <logo.icon className="h-8 w-8 text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:scale-110" />
                            <span className="text-lg font-bold text-muted-foreground/80 transition-colors group-hover:text-foreground">
                                {logo.name}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Duplicate track for continuity if needed, handled by CSS animation usually but flex gap approach works well enough for simple marquee if track is long enough. 
            For true infinite scroll, we often use two identical divs translating.
        */}
            </div>

            <style>{`
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
        </section>
    );
};
