import { Sparkles, Palette, Type, Ruler, Layers, Grid3X3 } from "lucide-react";

const features = [
    { icon: Palette, title: "Smart Colors", desc: "Accessible, on-brand palettes generated from your inputs." },
    { icon: Type, title: "Typography Pairings", desc: "Curated font pairings tuned for readability." },
    { icon: Ruler, title: "Spacing Scale", desc: "Consistent spatial system across components." },
    { icon: Layers, title: "Elevation", desc: "Shadow tokens for depth and hierarchy." },
    { icon: Grid3X3, title: "Layout Grid", desc: "Responsive grid foundations." },
    { icon: Sparkles, title: "AI Powered", desc: "Tailored to your industry and brand mood." },
];

export function FeaturesSection() {
    return (
        <section aria-labelledby="features-heading" className="space-y-8">
            <div className="text-center">
                <h2 id="features-heading" className="text-2xl md:text-3xl font-bold mb-2">Everything in one system</h2>
                <p className="text-muted-foreground">Tokens, components, and guidance — generated for you.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {features.map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur p-5">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                            <Icon className="h-4 w-4" />
                        </div>
                        <h3 className="text-sm font-semibold mb-1">{title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
