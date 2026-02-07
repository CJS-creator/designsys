import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

// Map tab values to display names
const TAB_LABELS: Record<string, string> = {
    overview: "Overview",
    colors: "Colors",
    typography: "Typography",
    spacing: "Spacing",
    shadows: "Shadows",
    animations: "Animations",
    tokens: "Design Tokens",
    components: "Components",
    sandbox: "Sandbox",
    accessibility: "Accessibility",
    export: "Export",
    settings: "Settings",
    docs: "Documentation",
    marketplace: "Marketplace",
    assets: "Asset Hub",
    analytics: "Analytics",
    team: "Team",
    git: "Version Control",
    ai: "AI Advisor",
    figma: "Figma Sync",
};

interface AppBreadcrumbProps {
    activeTab?: string;
    designSystemName?: string;
}

export function AppBreadcrumb({ activeTab, designSystemName }: AppBreadcrumbProps) {
    const location = useLocation();

    // Build breadcrumb trail based on current route
    const getBreadcrumbs = (): BreadcrumbItem[] => {
        const crumbs: BreadcrumbItem[] = [];

        // Always start with Dashboard
        if (location.pathname.startsWith("/app")) {
            crumbs.push({ label: "Dashboard", href: "/app" });

            // Add design system name if available
            if (designSystemName) {
                crumbs.push({ label: designSystemName });
            }

            // Add active tab if set
            if (activeTab && TAB_LABELS[activeTab]) {
                crumbs.push({ label: TAB_LABELS[activeTab] });
            }
        }

        return crumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    if (breadcrumbs.length === 0) return null;

    return (
        <Breadcrumb className="mb-4">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link to="/" className="flex items-center gap-1">
                            <Home className="h-3.5 w-3.5" />
                            <span className="sr-only">Home</span>
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <ChevronRight className="h-3.5 w-3.5" />
                </BreadcrumbSeparator>

                {breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;

                    return (
                        <BreadcrumbItem key={index}>
                            {isLast ? (
                                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                            ) : (
                                <>
                                    <BreadcrumbLink asChild>
                                        <Link to={crumb.href || "#"}>{crumb.label}</Link>
                                    </BreadcrumbLink>
                                    <BreadcrumbSeparator>
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    </BreadcrumbSeparator>
                                </>
                            )}
                        </BreadcrumbItem>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
