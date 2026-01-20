import { Wand2, Twitter, Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export const LandingFooter = () => {
    return (
        <footer className="py-16 border-t border-border/50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
                    <div className="col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-6 group w-fit">
                            <Wand2 className="h-8 w-8 text-primary transition-transform duration-300 group-hover:rotate-12" />
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">DesignForge</span>
                        </Link>
                        <p className="text-muted-foreground text-sm max-w-xs mb-8">
                            The AI-powered design system engine for modern product teams. Build better interfaces, faster.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
                                <Twitter className="h-4 w-4" />
                            </a>
                            <a href="#" className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
                                <Github className="h-4 w-4" />
                            </a>
                            <a href="#" className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
                                <Linkedin className="h-4 w-4" />
                            </a>
                            <a href="#" className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
                                <Mail className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Product</h4>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Generator</Link></li>
                            <li><Link to="/auth" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Roadmap</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Changelog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Resources</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Token Standards</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Community</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">API Reference</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Company</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Careers</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Legal</a></li>
                            <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/50 gap-4">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} DesignForge AI. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-xs text-muted-foreground">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
