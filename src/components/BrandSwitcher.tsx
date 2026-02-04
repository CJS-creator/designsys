import { useBrands, BrandTheme } from "@/hooks/useBrands";

import { Button } from "@/components/ui/button";
import { Plus, Globe, Moon, Sun, Contrast, ChevronDown, Check } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

interface BrandSwitcherProps {
    designSystemId: string;
    onBrandChange?: (brand: BrandTheme) => void;
}

export function BrandSwitcher({ designSystemId, onBrandChange }: BrandSwitcherProps) {
    const { brands, activeBrand, setActiveBrandId, createBrand, loading } = useBrands(designSystemId);


    if (loading) return <div className="h-9 w-32 bg-muted animate-pulse rounded-md" />;

    const handleCreateBrand = async () => {
        const name = prompt("Enter brand name:");
        if (name) {
            await createBrand(name);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 gap-2 px-3 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
                        <Globe className="h-4 w-4 text-primary" />
                        <span className="font-bold text-xs uppercase tracking-tight">
                            {activeBrand?.name || "Select Brand"}
                        </span>
                        <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                        Available Brands
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {brands.map((brand) => (
                        <DropdownMenuItem
                            key={brand.id}
                            onClick={() => {
                                setActiveBrandId(brand.id);
                                onBrandChange?.(brand);
                            }}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${brand.is_default ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                                <span className={brand.id === activeBrand?.id ? "font-bold" : ""}>
                                    {brand.name}
                                </span>
                            </div>
                            {brand.id === activeBrand?.id && <Check className="h-3 w-3 text-primary" />}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleCreateBrand} className="gap-2 text-primary focus:text-primary font-medium">
                        <Plus className="h-4 w-4" />
                        Add New Brand
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center p-1 bg-muted/50 rounded-lg border border-border/50">
                <Button
                    variant="ghost"
                    size="icon"
                    className={`h-7 w-7 rounded-md transition-all ${activeBrand?.mode === 'light' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}
                    title="Light Mode"
                >
                    <Sun className="h-3.5 w-3.5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`h-7 w-7 rounded-md transition-all ${activeBrand?.mode === 'dark' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}
                    title="Dark Mode"
                >
                    <Moon className="h-3.5 w-3.5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`h-7 w-7 rounded-md transition-all ${activeBrand?.mode === 'high-contrast' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}
                    title="High Contrast"
                >
                    <Contrast className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    );
}
