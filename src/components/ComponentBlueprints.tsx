import { useState } from "react";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Code2, Copy, Check, Terminal, Layout, Layers, Type } from "lucide-react";
import { toast } from "sonner";

interface ComponentBlueprintsProps {
    designSystem: GeneratedDesignSystem;
}

export const ComponentBlueprints = ({ designSystem }: ComponentBlueprintsProps) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Blueprint copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    const snippets = {
        button: `import React from 'react';

export const Button = ({ children, variant = 'primary', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-${designSystem.borderRadius.md} font-${designSystem.typography.fontFamily.body} transition-all duration-${designSystem.animations.duration.normal}';
  
  const variants = {
    primary: 'bg-[${designSystem.colors.primary}] text-[${designSystem.colors.onPrimary}] hover:opacity-90 active:scale-95',
    secondary: 'bg-[${designSystem.colors.secondary}] text-[${designSystem.colors.onSecondary}] hover:opacity-90',
    outline: 'border-2 border-[${designSystem.colors.primary}] text-[${designSystem.colors.primary}] hover:bg-[${designSystem.colors.primary}] hover:text-[${designSystem.colors.onPrimary}]'
  };

  return (
    <button className={\`\${baseStyles} \${variants[variant]}\`} {...props}>
      {children}
    </button>
  );
};`,

        card: `import React from 'react';

export const Card = ({ title, description, children }) => {
  return (
    <div className="bg-[${designSystem.colors.surface}] border border-[${designSystem.colors.border}] rounded-[${designSystem.borderRadius.lg}] shadow-[${designSystem.shadows.md}] overflow-hidden">
      <div className="p-6">
        <h3 className="text-[${designSystem.colors.text}] font-[${designSystem.typography.weights.bold}] text-xl mb-2">{title}</h3>
        <p className="text-[${designSystem.colors.textSecondary}] text-sm">{description}</p>
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
};`,

        input: `import React from 'react';

export const Input = ({ label, ...props }) => {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-[${designSystem.colors.textSecondary}] px-1">
        {label}
      </label>
      <input 
        className="w-full px-4 py-2 bg-[${designSystem.colors.background}] border border-[${designSystem.colors.border}] rounded-[${designSystem.borderRadius.md}] focus:ring-2 focus:ring-[${designSystem.colors.primary}] focus:border-[${designSystem.colors.primary}] outline-none transition-all shadow-[${designSystem.shadows.sm}]"
        {...props}
      />
    </div>
  );
};`,
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="glass-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <Code2 className="h-6 w-6 text-primary" />
                                Component Blueprints
                            </CardTitle>
                            <CardDescription>
                                Ready-to-use React components pre-wired with your design system tokens.
                            </CardDescription>
                        </div>
                        <div className="flex bg-muted/30 p-1 rounded-lg">
                            <div className="px-3 py-1 text-xs font-mono flex items-center gap-2">
                                <Terminal className="h-3 w-3" />
                                Tailwind + React
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="button" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/20 p-1">
                            <TabsTrigger value="button" className="gap-2"><Layers className="h-4 w-4" /> Button</TabsTrigger>
                            <TabsTrigger value="card" className="gap-2"><Layout className="h-4 w-4" /> Card</TabsTrigger>
                            <TabsTrigger value="input" className="gap-2"><Type className="h-4 w-4" /> Input</TabsTrigger>
                        </TabsList>

                        {(Object.entries(snippets) as [keyof typeof snippets, string][]).map(([key, code]) => (
                            <TabsContent key={key} value={key} className="relative mt-0">
                                <div className="absolute top-4 right-4 z-10 flex gap-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="h-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 shadow-xl"
                                        onClick={() => copyToClipboard(code)}
                                    >
                                        {copied ? <Check className="h-3.5 w-3.5 mr-2" /> : <Copy className="h-3.5 w-3.5 mr-2" />}
                                        {copied ? "Copied" : "Copy Code"}
                                    </Button>
                                </div>
                                <pre className="p-6 rounded-xl overflow-auto max-h-[500px] bg-zinc-950 text-zinc-300 font-mono text-xs leading-relaxed border border-zinc-800 shadow-inner">
                                    {code}
                                </pre>
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-primary/5 border-primary/10">
                    <CardContent className="pt-6 space-y-2">
                        <h5 className="font-semibold text-sm flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Semantic Logic
                        </h5>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            These blueprints automatically use semantic roles like <strong>onPrimary</strong> for text, ensuring perfect contrast regardless of the colors you've generated.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-muted/30 border-dashed">
                    <CardContent className="pt-6 space-y-2">
                        <h5 className="font-semibold text-sm">Framework Support</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Currently generating React + Tailwind. Vue, Svelte, and Native Mobile blueprints are coming in Phase 14.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

import { Sparkles } from "lucide-react";
