import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Code2, Play, Save, Trash2, HelpCircle, FileJson, FileCode, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DesignToken } from "@/types/tokens";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { resolveTemplate } from "@/lib/exporters/custom-templating";

interface CustomExporterEditorProps {
    designSystemId: string;
    tokens: DesignToken[];
}

interface ExportTemplate {
    id: string;
    name: string;
    template: string;
    extension: string;
}

export function CustomExporterEditor({ designSystemId, tokens }: CustomExporterEditorProps) {
    const [templates, setTemplates] = useState<ExportTemplate[]>([]);
    const [currentTemplate, setCurrentTemplate] = useState<Partial<ExportTemplate>>({
        name: "",
        template: "/* {{name}} - Custom Export */\n\n{{#tokens}}\n${{path}}: {{value}};\n{{/tokens}}",
        extension: "scss"
    });
    const [previewContent, setPreviewContent] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTemplates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [designSystemId]);

    const fetchTemplates = async () => {
        const { data, error } = await supabase
            .from("export_templates" as any)
            .select("*")
            .eq("design_system_id", designSystemId);

        if (data && !error) setTemplates(data as unknown as ExportTemplate[]);
        setIsLoading(false);
    };

    const handlePreview = () => {
        const content = resolveTemplate(currentTemplate.template || "", tokens);
        setPreviewContent(content);
    };

    const handleSave = async () => {
        if (!currentTemplate.name || !currentTemplate.template) {
            toast.error("Please provide a name and template");
            return;
        }

        setIsSaving(true);
        try {
            const { data, error } = await supabase
                .from("export_templates" as any)
                .upsert({
                    id: currentTemplate.id,
                    design_system_id: designSystemId,
                    name: currentTemplate.name,
                    template: currentTemplate.template,
                    extension: currentTemplate.extension || "json"
                } as any)
                .select()
                .single();

            if (error) throw error;

            toast.success("Template saved!");
            fetchTemplates();
            if (data) setCurrentTemplate(data as unknown as ExportTemplate);
        } catch (error) {
            toast.error("Failed to save template");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase
            .from("export_templates" as any)
            .delete()
            .eq("id", id);

        if (!error) {
            toast.success("Template deleted");
            fetchTemplates();
            if (currentTemplate.id === id) {
                setCurrentTemplate({ name: "", template: "", extension: "json" });
            }
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Code2 className="h-5 w-5 text-primary" />
                                Custom Exporters
                            </CardTitle>
                            <CardDescription>Create custom file formats for your design system.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setCurrentTemplate({ name: "", template: "", extension: "json" })}>
                            New Template
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Template Name</Label>
                        <Input
                            value={currentTemplate.name}
                            onChange={(e) => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
                            placeholder="e.g., Tailwind Config, Global SCSS"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>File Extension</Label>
                        <Input
                            value={currentTemplate.extension}
                            onChange={(e) => setCurrentTemplate({ ...currentTemplate, extension: e.target.value })}
                            placeholder="js, scss, json, swift..."
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Template (Handlebars Lite)</Label>
                            <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Template help">
                                <HelpCircle className="h-3 w-3" />
                            </Button>
                        </div>
                        <Textarea
                            value={currentTemplate.template}
                            onChange={(e) => setCurrentTemplate({ ...currentTemplate, template: e.target.value })}
                            className="font-mono text-xs min-h-[200px]"
                            placeholder="{{#tokens}}\n${{path}}: {{value}};\n{{/tokens}}"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button className="flex-1 gap-2" onClick={handlePreview}>
                            <Play className="h-4 w-4" /> Preview
                        </Button>
                        <Button variant="secondary" className="gap-2" onClick={handleSave} disabled={isSaving}>
                            <Save className="h-4 w-4" /> Save
                        </Button>
                    </div>

                    <div className="pt-4 border-t space-y-2">
                        <Label className="text-xs text-muted-foreground uppercase font-bold">Your Templates</Label>
                        {templates.map(t => (
                            <div key={t.id} className="flex items-center justify-between p-2 rounded border bg-muted/20 text-xs">
                                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentTemplate(t)}>
                                    <FileCode className="h-3 w-3 text-primary" />
                                    <span className="font-bold">{t.name}</span>
                                    <span className="text-muted-foreground">.{t.extension}</span>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => handleDelete(t.id)} aria-label="Delete template">
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <FileJson className="h-5 w-5 text-green-500" />
                        Export Preview
                    </CardTitle>
                    <CardDescription>Live output of your custom template.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col min-h-[400px]">
                    <ScrollArea className="flex-1 rounded-xl border bg-black/90 p-4 font-mono text-xs text-green-400">
                        <pre className="whitespace-pre-wrap lowercase">{previewContent || "Click Preview to see result..."}</pre>
                    </ScrollArea>
                    <div className="mt-4 flex gap-2">
                        <Button variant="outline" className="flex-1 gap-2" disabled={!previewContent} onClick={() => {
                            navigator.clipboard.writeText(previewContent);
                            toast.success("Copied to clipboard");
                        }}>
                            <Copy className="h-4 w-4" /> Copy
                        </Button>
                        <Button variant="outline" className="flex-1 gap-2" disabled={!previewContent} onClick={() => {
                            const blob = new Blob([previewContent], { type: "text/plain" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `${currentTemplate.name || 'export'}.${currentTemplate.extension || 'json'}`;
                            a.click();
                        }}>
                            <Download className="h-4 w-4" /> Download
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function Download({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
    )
}
