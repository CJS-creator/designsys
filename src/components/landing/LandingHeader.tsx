import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wand2, Menu, X, ArrowRight, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export const LandingHeader = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "How it Works", href: "#process" },
        { name: "Pricing", href: "#pricing" },
        { name: "FAQ", href: "#faq" },
    ];

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        setIsOpen(false);
        const element = document.querySelector(href);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                isScrolled
                    ? "bg-background/80 backdrop-blur-md border-border/50 shadow-sm py-3"
                    : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <Wand2 className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-12" />
                    <span className="text-xl font-bold">DesignForge</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors link-underline pb-1"
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <Button variant="ghost" size="sm" onClick={signOut}>
                            Sign Out
                        </Button>
                    ) : (
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/auth">Sign In</Link>
                        </Button>
                    )}
                    <Button size="sm" asChild className="rounded-full px-5">
                        <Link to={user ? "/app" : "/auth"}>
                            {user ? "Go to Dashboard" : "Get Started"}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <SheetHeader className="text-left border-b pb-4 mb-4">
                                <SheetTitle className="flex items-center gap-2">
                                    <Wand2 className="h-5 w-5 text-primary" />
                                    DesignForge
                                </SheetTitle>
                            </SheetHeader>
                            <nav className="flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        onClick={(e) => handleNavClick(e, link.href)}
                                        className="text-lg font-medium text-foreground py-2 border-b border-border/50"
                                    >
                                        {link.name}
                                    </a>
                                ))}
                                <div className="mt-4 flex flex-col gap-3">
                                    {user ? (
                                        <Button variant="outline" onClick={signOut}>
                                            Sign Out
                                        </Button>
                                    ) : (
                                        <Button variant="outline" asChild>
                                            <Link to="/auth">Sign In</Link>
                                        </Button>
                                    )}
                                    <Button asChild className="w-full">
                                        <Link to={user ? "/app" : "/auth"}>
                                            {user ? "Dashboard" : "Get Started Free"}
                                        </Link>
                                    </Button>
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
};
