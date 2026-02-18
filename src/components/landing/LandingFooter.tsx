import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin, Slack, ArrowUp } from "lucide-react";
import { MagneticButton } from "@/components/animations/MagneticButton";

const links = {
    product: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Integrations", href: "#" },
        { label: "Changelog", href: "#" },
        { label: "Roadmap", href: "#" },
    ],
    company: [
        { label: "About Us", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Contact", href: "#" },
    ],
    resources: [
        { label: "Documentation", href: "#" },
        { label: "API Reference", href: "#" },
        { label: "Community", href: "#" },
        { label: "Help Center", href: "#" },
    ],
    legal: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
    ],
};

const SocialLink = ({ icon: Icon, href }: { icon: React.ElementType, href: string }) => (
    <MagneticButton distance={0.2}>
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 rounded-full flex items-center justify-center bg-muted hover:bg-primary/20 hover:text-primary transition-all duration-300 hover:scale-110 active:scale-95"
        >
            <Icon className="h-5 w-5" />
        </a>
    </MagneticButton>
);

const FooterLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <a href={href} className="text-muted-foreground hover:text-primary transition-colors relative group inline-block">
        {children}
        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-primary transition-all group-hover:w-full" />
    </a>
);

export const LandingFooter = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="bg-background border-t border-border pt-24 pb-12 relative overflow-hidden">
            {/* Gradient Mesh Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-[radial-gradient(circle_at_bottom,rgba(124,58,237,0.05),transparent_70%)] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid md:grid-cols-6 gap-12 mb-20">

                    {/* Brand Column */}
                    <div className="md:col-span-2 space-y-6">
                        <Link to="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter">
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                                D
                            </div>
                            <span>DesignForge</span>
                        </Link>
                        <p className="text-muted-foreground leading-relaxed max-w-sm font-medium">
                            The AI-powered design system engine that bridges the gap between design and engineering. Built for teams who ship fast.
                        </p>
                        <div className="flex gap-3 pt-4">
                            <SocialLink icon={Twitter} href="#" />
                            <SocialLink icon={Github} href="#" />
                            <SocialLink icon={Linkedin} href="#" />
                            <SocialLink icon={Slack} href="#" />
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-foreground mb-8">Product</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            {links.product.map((link, i) => (
                                <li key={i}>
                                    <FooterLink href={link.href}>{link.label}</FooterLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-foreground mb-8">Company</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            {links.company.map((link, i) => (
                                <li key={i}>
                                    <FooterLink href={link.href}>{link.label}</FooterLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-foreground mb-8">Resources</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            {links.resources.map((link, i) => (
                                <li key={i}>
                                    <FooterLink href={link.href}>{link.label}</FooterLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-foreground mb-8">Legal</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            {links.legal.map((link, i) => (
                                <li key={i}>
                                    <FooterLink href={link.href}>{link.label}</FooterLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground font-medium">
                        © {new Date().getFullYear()} DesignForge Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <MagneticButton>
                            <button
                                onClick={scrollToTop}
                                className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors px-4 py-2 rounded-full hover:bg-muted"
                            >
                                Back to top
                                <ArrowUp className="h-4 w-4" />
                            </button>
                        </MagneticButton>
                    </div>
                </div>
            </div>
        </footer>
    );
};
