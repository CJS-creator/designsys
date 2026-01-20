import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin, Slack } from "lucide-react";

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

const SocialLink = ({ icon: Icon, href }: { icon: any, href: string }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="h-10 w-10 rounded-full flex items-center justify-center bg-muted hover:bg-primary/10 hover:text-primary transition-all duration-300"
    >
        <Icon className="h-5 w-5" />
    </a>
);

export const LandingFooter = () => {
    return (
        <footer className="bg-background border-t border-border pt-20 pb-10">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-6 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="md:col-span-2 space-y-6">
                        <Link to="/" className="flex items-center gap-2 font-bold text-2xl">
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                                D
                            </div>
                            <span className="tracking-tighter">DesignForge</span>
                        </Link>
                        <p className="text-muted-foreground leading-relaxed max-w-sm">
                            The AI-powered design system engine that bridges the gap between design and engineering. Built for teams who ship fast.
                        </p>
                        <div className="flex gap-4">
                            <SocialLink icon={Twitter} href="#" />
                            <SocialLink icon={Github} href="#" />
                            <SocialLink icon={Linkedin} href="#" />
                            <SocialLink icon={Slack} href="#" />
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="font-bold mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            {links.product.map((link, i) => (
                                <li key={i}>
                                    <a href={link.href} className="hover:text-primary transition-colors">{link.label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            {links.company.map((link, i) => (
                                <li key={i}>
                                    <a href={link.href} className="hover:text-primary transition-colors">{link.label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Resources</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            {links.resources.map((link, i) => (
                                <li key={i}>
                                    <a href={link.href} className="hover:text-primary transition-colors">{link.label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            {links.legal.map((link, i) => (
                                <li key={i}>
                                    <a href={link.href} className="hover:text-primary transition-colors">{link.label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} DesignForge Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        {/* Can add extra bottom links here if needed */}
                    </div>
                </div>
            </div>
        </footer>
    );
};
