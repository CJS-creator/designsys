import { useState } from 'react';
import { GeneratedDesignSystem } from '@/types/designSystem';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, MousePointer2, Sparkles, RefreshCcw, Code } from 'lucide-react';
import { Button as ShBtn } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ComponentSandboxProps {
    designSystem: GeneratedDesignSystem;
}

export const ComponentSandbox = ({ designSystem }: ComponentSandboxProps) => {
    const [selectedId, setSelectedId] = useState('button');
    const [variant, setVariant] = useState('primary');
    const [size, setSize] = useState('md');
    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [label, setLabel] = useState('Action Label');

    const handleReset = () => {
        setVariant('primary');
        setSize('md');
        setIsLoading(false);
        setIsDisabled(false);
        const newLabel = selectedId === 'button' ? 'Action Label' : selectedId === 'badge' ? 'Status' : 'Header Title';
        setLabel(newLabel);
    };

    const renderPreview = () => {
        switch (selectedId) {
            case 'button':
                return (
                    <motion.button
                        layout
                        disabled={isDisabled}
                        className={cn(
                            "flex items-center justify-center font-bold transition-all",
                            size === 'sm' && 'text-xs py-1.5 px-4',
                            size === 'md' && 'px-6 py-2 text-sm',
                            size === 'lg' && 'text-lg py-3 px-8',
                            isDisabled && 'opacity-50 cursor-not-allowed grayscale'
                        )}
                        style={{
                            backgroundColor: variant === 'primary' ? designSystem.colors.primary :
                                variant === 'secondary' ? designSystem.colors.secondary : 'transparent',
                            color: variant === 'primary' ? designSystem.colors.onPrimary :
                                variant === 'secondary' ? designSystem.colors.onSecondary : designSystem.colors.primary,
                            border: variant === 'outline' ? `2px solid ${designSystem.colors.primary}` : 'none',
                            borderRadius: size === 'sm' ? designSystem.borderRadius.sm :
                                size === 'lg' ? designSystem.borderRadius.lg : designSystem.borderRadius.md,
                            fontFamily: designSystem.typography.fontFamily.body,
                            boxShadow: variant === 'ghost' ? 'none' : designSystem.shadows.md
                        }}
                        whileHover={!isDisabled ? { scale: 1.02, opacity: 0.9 } : {}}
                        whileTap={!isDisabled ? { scale: 0.95 } : {}}
                    >
                        {isLoading && <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />}
                        {label}
                    </motion.button>
                );
            case 'badge':
                return (
                    <motion.span
                        layout
                        className="px-3 py-1 text-[10px] font-black uppercase tracking-widest border"
                        style={{
                            backgroundColor: `${variant === 'primary' ? designSystem.colors.primary : designSystem.colors.secondary}20`,
                            color: variant === 'primary' ? designSystem.colors.primary : designSystem.colors.secondary,
                            borderRadius: designSystem.borderRadius.full,
                            borderColor: `${variant === 'primary' ? designSystem.colors.primary : designSystem.colors.secondary}40`
                        }}
                    >
                        {label}
                    </motion.span>
                );
            case 'card':
                return (
                    <motion.div
                        layout
                        className="p-6 w-full max-w-[300px] border border-white/5 relative overflow-hidden"
                        style={{
                            backgroundColor: designSystem.colors.surface,
                            borderRadius: designSystem.borderRadius.lg,
                            boxShadow: designSystem.shadows.lg,
                            fontFamily: designSystem.typography.fontFamily.body
                        }}
                    >
                        <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: designSystem.colors.primary }} />
                        <h4 className="font-bold text-lg mb-2" style={{ color: designSystem.colors.text }}>{label}</h4>
                        <p className="text-xs opacity-60 leading-relaxed" style={{ color: designSystem.colors.text }}>
                            This is an interactive card component reacting to your design system tokens.
                        </p>
                        <div className="mt-4 flex gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10" />
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10" />
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <Card className="glass-card overflow-hidden border-2 border-primary/20 shadow-2xl">
            <CardHeader className="bg-primary/5 pb-2">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <MousePointer2 className="h-5 w-5 text-primary" />
                            Interactive Sandbox
                        </CardTitle>
                        <CardDescription className="text-xs">Dynamic prop editor and live component workshop.</CardDescription>
                    </div>
                    <ShBtn variant="ghost" size="sm" onClick={handleReset} className="h-8 rounded-full gap-2 text-xs">
                        <RefreshCcw className="h-3 w-3" /> Reset
                    </ShBtn>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="grid lg:grid-cols-12 min-h-[500px]">
                    <div className="lg:col-span-4 border-r border-border/50 p-6 space-y-8 bg-muted/10">
                        <div className="space-y-4">
                            <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Select Component</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {['button', 'badge', 'card'].map((id) => (
                                    <button
                                        key={id}
                                        onClick={() => { setSelectedId(id); handleReset(); }}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border",
                                            selectedId === id ? "bg-primary/20 border-primary text-primary" : "bg-card border-border/50 hover:bg-muted"
                                        )}
                                    >
                                        <Layers className="h-3 w-3" /> {id.charAt(0).toUpperCase() + id.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-border/50">
                            <div className="space-y-3">
                                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Variant</Label>
                                <Select value={variant} onValueChange={setVariant}>
                                    <SelectTrigger className="rounded-xl h-9">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="primary">Primary</SelectItem>
                                        <SelectItem value="secondary">Secondary</SelectItem>
                                        <SelectItem value="outline">Outline</SelectItem>
                                        <SelectItem value="ghost">Ghost</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Size</Label>
                                <div className="flex gap-2">
                                    {['sm', 'md', 'lg'].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setSize(s)}
                                            className={cn(
                                                "flex-1 h-9 rounded-xl text-[10px] font-black uppercase transition-all border",
                                                size === s ? "bg-primary text-white border-primary" : "bg-card border-border/50"
                                            )}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Labels & State</Label>
                                <Input
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    className="rounded-xl h-9 text-xs"
                                    placeholder="Enter label..."
                                />
                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-[10px] font-bold">Show Loading</span>
                                    <Switch checked={isLoading} onCheckedChange={setIsLoading} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold">Disabled State</span>
                                    <Switch checked={isDisabled} onCheckedChange={setIsDisabled} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 p-10 flex flex-col items-center justify-center relative bg-muted/5 font-inter">
                        <div className="absolute top-6 left-6 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Live Production Preview</span>
                        </div>

                        <div className="w-full flex items-center justify-center min-h-[200px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${selectedId}-${variant}-${size}-${isLoading}-${isDisabled}`}
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {renderPreview()}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="absolute bottom-6 w-full px-10">
                            <div className="p-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/5 shadow-inner">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Code className="h-3 w-3 text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Generated Markup</span>
                                    </div>
                                    <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                                </div>
                                <code className="text-[10px] font-mono text-primary/80 block break-all">
                                    {`<${selectedId.charAt(0).toUpperCase() + selectedId.slice(1)} variant="${variant}" size="${size}" ${isLoading ? 'loading' : ''} ${isDisabled ? 'disabled' : ''} />`}
                                </code>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
