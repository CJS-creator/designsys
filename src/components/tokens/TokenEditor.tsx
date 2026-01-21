import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { DesignToken, TokenType } from "@/types/tokens";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Palette, Type, Square, Timer, Box, Layers, Image as ImageIcon } from "lucide-react";

const tokenSchema = z.object({
    name: z.string().min(1, "Name is required"),
    path: z.string().min(1, "Path is required"),
    type: z.string(),
    description: z.string().optional(),
    value: z.any(), // Flexible based on type
});

interface TokenEditorProps {
    token?: DesignToken;
    onSave: (token: DesignToken) => void;
    onCancel: () => void;
}

export function TokenEditor({ token, onSave, onCancel }: TokenEditorProps) {
    const [selectedType, setSelectedType] = useState<TokenType>(token?.type || 'color');

    const form = useForm<any>({
        resolver: zodResolver(tokenSchema),
        defaultValues: token || {
            name: "",
            path: "",
            type: "color",
            description: "",
            value: "#000000",
        },
    });

    const onSubmit = (data: any) => {
        onSave(data as DesignToken);
    };

    const renderValueEditor = () => {
        switch (selectedType) {
            case 'color':
                return (
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color Value</FormLabel>
                                    <div className="flex gap-2">
                                        <FormControl>
                                            <Input type="color" {...field} className="w-12 p-1 h-10" />
                                        </FormControl>
                                        <FormControl>
                                            <Input {...field} placeholder="#000000 or hsl(0, 0%, 0%)" />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                );

            case 'dimension':
            case 'spacing':
            case 'borderRadius':
            case 'borderWidth':
                return (
                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="e.g. 16px, 1rem, 4" />
                                </FormControl>
                                <FormDescription>Include units (px, rem, %, etc.)</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                );

            case 'typography':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        {/* Simplified for now, will expand to use full TypographyToken structure */}
                        <FormField
                            control={form.control}
                            name={"value.fontFamily" as any}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Font Family</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={"value.fontSize" as any}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Size</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                );

            default:
                return (
                    <div className="p-4 border border-dashed rounded-lg bg-muted/50 text-center">
                        Editor for <strong>{selectedType}</strong> coming soon in Phase 1.
                    </div>
                );
        }
    };

    const getTokenIcon = (type: TokenType) => {
        switch (type) {
            case 'color': return <Palette className="h-4 w-4" />;
            case 'typography': return <Type className="h-4 w-4" />;
            case 'dimension': return <Square className="h-4 w-4" />;
            case 'duration': return <Timer className="h-4 w-4" />;
            case 'shadow': return <Layers className="h-4 w-4" />;
            case 'asset': return <ImageIcon className="h-4 w-4" />;
            default: return <Box className="h-4 w-4" />;
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg border-primary/20 backdrop-blur-sm bg-card/95">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        {token ? "Edit Token" : "Create New Token"}
                        <Badge variant="outline" className="ml-2 capitalize">
                            {selectedType}
                        </Badge>
                    </CardTitle>
                    {getTokenIcon(selectedType)}
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Token Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Primary Color" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="path"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Token Path</FormLabel>
                                        <FormControl>
                                            <Input placeholder="color.brand.primary" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Token Type</FormLabel>
                                    <Select
                                        onValueChange={(val) => {
                                            field.onChange(val);
                                            setSelectedType(val as TokenType);
                                        }}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="color">Color</SelectItem>
                                            <SelectItem value="dimension">Dimension</SelectItem>
                                            <SelectItem value="typography">Typography</SelectItem>
                                            <SelectItem value="spacing">Spacing</SelectItem>
                                            <SelectItem value="borderRadius">Border Radius</SelectItem>
                                            <SelectItem value="shadow">Shadow</SelectItem>
                                            <SelectItem value="gradient">Gradient</SelectItem>
                                            <SelectItem value="duration">Duration</SelectItem>
                                            <SelectItem value="composition">Composition</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="pt-4 border-t">
                            <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">
                                Value Configuration
                            </h3>
                            {renderValueEditor()}
                        </div>

                        <div className="flex justify-end gap-3 pt-6">
                            <Button type="button" variant="outline" onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-primary hover:bg-primary/90">
                                {token ? "Update Token" : "Create Token"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
