import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    Plus,
    GripVertical,
    Trash2,
    Type,
    Palette,
    Image as ImageIcon,
    Save,
    Monitor,
    Eye
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type BlockType = 'text' | 'token' | 'image' | 'heading';

interface DocBlock {
    id: string;
    type: BlockType;
    content: any;
}

export function DocEditor({ designSystemId }: { designSystemId: string }) {
    const [title, setTitle] = useState("Untitled Page");
    const [blocks, setBlocks] = useState<DocBlock[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const addBlock = (type: BlockType) => {
        const newBlock: DocBlock = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            content: type === 'text' ? "" : type === 'heading' ? "Heading" : {}
        };
        setBlocks([...blocks, newBlock]);
    };

    const updateBlock = (id: string, content: any) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
    };

    const removeBlock = (id: string) => {
        setBlocks(blocks.filter(b => b.id !== id));
    };

    const handleSave = async () => {
        if (!designSystemId) return;
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from("documentation_pages" as any)
                .upsert({
                    design_system_id: designSystemId,
                    title,
                    slug: title.toLowerCase().replace(/ /g, '-'),
                    content: blocks,
                    is_published: true
                });

            if (error) throw error;
            toast.success("Documentation saved successfully");
        } catch (error: any) {
            toast.error("Error saving: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-background rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b bg-card/30 flex items-center justify-between">
                <div className="flex-1 max-w-md">
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-xl font-bold bg-transparent border-none focus-visible:ring-0 px-0 h-auto"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" /> Preview
                    </Button>
                    <Button
                        size="sm"
                        className="gap-2"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        <Save className="h-4 w-4" />
                        {isSaving ? "Saving..." : "Save Page"}
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full space-y-6">
                {blocks.map((block) => (
                    <div key={block.id} className="relative group">
                        <div className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6 cursor-grab">
                                <GripVertical className="h-3 w-3" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive"
                                onClick={() => removeBlock(block.id)}
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>

                        <Card className="border-border/50 group-hover:border-primary/30 transition-colors">
                            <CardContent className="p-4">
                                {block.type === 'heading' && (
                                    <Input
                                        value={block.content}
                                        onChange={(e) => updateBlock(block.id, e.target.value)}
                                        className="text-2xl font-bold border-none focus-visible:ring-0 p-0"
                                        placeholder="Enter heading..."
                                    />
                                )}
                                {block.type === 'text' && (
                                    <textarea
                                        value={block.content}
                                        onChange={(e) => updateBlock(block.id, e.target.value)}
                                        className="w-full min-h-[100px] bg-transparent border-none focus:ring-0 p-0 resize-none text-muted-foreground leading-relaxed"
                                        placeholder="Start typing..."
                                    />
                                )}
                                {block.type === 'token' && (
                                    <div className="p-12 border-2 border-dashed rounded-lg text-center bg-muted/20">
                                        <Palette className="h-8 w-8 mx-auto mb-2 text-primary opacity-50" />
                                        <p className="text-sm font-medium">Token Swatch Area</p>
                                        <p className="text-xs text-muted-foreground">Token picker coming soon</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                ))}

                {blocks.length === 0 && (
                    <div className="text-center py-20 bg-muted/10 rounded-2xl border-2 border-dashed border-border/50">
                        <h3 className="font-bold text-lg mb-2">Build your documentation</h3>
                        <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
                            Add blocks below to document your design tokens, components, and guidelines.
                        </p>
                    </div>
                )}

                <div className="flex justify-center gap-4 pt-8 border-t">
                    <Button variant="outline" size="sm" onClick={() => addBlock('heading')} className="gap-2">
                        <Type className="h-4 w-4" /> Heading
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => addBlock('text')} className="gap-2">
                        <Monitor className="h-4 w-4" /> Text
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => addBlock('token')} className="gap-2">
                        <Palette className="h-4 w-4" /> Token
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => addBlock('image')} className="gap-2">
                        <ImageIcon className="h-4 w-4" /> Image
                    </Button>
                </div>
            </div>
        </div>
    );
}
