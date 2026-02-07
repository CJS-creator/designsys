import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, Hash, Palette } from "lucide-react";

interface ColorPickerProps {
    color: string;
    onChange: (color: string) => void;
    className?: string;
}

const PRESET_COLORS = [
    "#000000", "#ffffff", "#ef4444", "#f97316", "#f59e0b", "#eab308",
    "#84cc16", "#22c55e", "#10b981", "#06b6d4", "#0ea5e9", "#3b82f6",
    "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e",
    "#64748b", "#71717a", "#737373", "#78716c", "#475569", "#4b5563"
];

export function ColorPicker({ color, onChange, className }: ColorPickerProps) {
    const [inputValue, setInputValue] = React.useState(color);

    React.useEffect(() => {
        setInputValue(color);
    }, [color]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        // Simple hex validation
        if (/^#[0-9A-Fa-f]{3}$|^#[0-9A-Fa-f]{6}$/.test(value)) {
            onChange(value);
        }
    };

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-[120px] justify-start gap-2 h-10 px-2"
                        aria-label="Select color"
                    >
                        <div
                            className="h-4 w-4 rounded border border-border shrink-0"
                            style={{ backgroundColor: color }}
                        />
                        <span className="truncate font-mono text-xs uppercase">{color}</span>
                        <Palette className="h-3 w-3 ml-auto text-muted-foreground" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-3 space-y-3">
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                                <Input
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    className="pl-7 h-8 font-mono text-xs"
                                    placeholder="#000000"
                                />
                            </div>
                            <div
                                className="h-8 w-8 rounded border border-border shrink-0"
                                style={{ backgroundColor: color }}
                            />
                        </div>

                        <div className="grid grid-cols-8 gap-1.5 mt-2">
                            {PRESET_COLORS.map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    className={cn(
                                        "h-5 w-5 rounded-md border border-border/50 transition-all hover:scale-110 active:scale-95 flex items-center justify-center",
                                        color.toLowerCase() === preset.toLowerCase() && "ring-2 ring-primary ring-offset-1"
                                    )}
                                    style={{ backgroundColor: preset }}
                                    onClick={() => {
                                        onChange(preset);
                                        setInputValue(preset);
                                    }}
                                >
                                    {color.toLowerCase() === preset.toLowerCase() && (
                                        <Check className={cn(
                                            "h-3 w-3",
                                            preset.toLowerCase() === "#ffffff" ? "text-black" : "text-white"
                                        )} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
            <Input
                type="color"
                value={color.startsWith("#") ? color : "#000000"}
                onChange={(e) => {
                    onChange(e.target.value);
                    setInputValue(e.target.value);
                }}
                className="w-10 h-10 p-1 cursor-pointer border-border/50 shrink-0"
            />
        </div>
    );
}
