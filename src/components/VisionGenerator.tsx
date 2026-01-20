import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Sparkles, RefreshCcw } from "lucide-react";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { toast } from "sonner";

interface VisionGeneratorProps {
    onDesignGenerated: (color: string) => void;
    isGenerating: boolean;
}

export const VisionGenerator = ({ onDesignGenerated, isGenerating }: VisionGeneratorProps) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [extractedColors, setExtractedColors] = useState<string[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            setImagePreview(result);
            extractColors(result);
        };
        reader.readAsDataURL(file);
    };

    const extractColors = (imgSrc: string) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imgSrc;
        img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Get pixel data from a few points to simulate "dominant" colors
            const points = [
                { x: Math.floor(img.width * 0.5), y: Math.floor(img.height * 0.5) },
                { x: Math.floor(img.width * 0.2), y: Math.floor(img.height * 0.2) },
                { x: Math.floor(img.width * 0.8), y: Math.floor(img.height * 0.8) },
            ];

            const colors = points.map(p => {
                const pixel = ctx.getImageData(p.x, p.y, 1, 1).data;
                return `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
            });

            setExtractedColors(colors);
            toast.success("Design inspiration analyzed!");
        };
    };

    const generateFromVision = () => {
        if (extractedColors.length === 0) {
            toast.error("Please upload an image first");
            return;
        }

        const primaryColor = extractedColors[0];
        toast.success(`Analyzing visual DNA: ${primaryColor}`);
        onDesignGenerated(primaryColor);
    };

    return (
        <div className="space-y-6">
            <Card className="glass-card overflow-hidden">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Vision-to-Design
                            </CardTitle>
                            <CardDescription>Upload an image to extract its mood and color palette</CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isGenerating}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Image
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Preview Area */}
                        <div
                            className={`relative aspect-video rounded-xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center overflow-hidden bg-muted/30 transition-all ${!imagePreview ? 'hover:bg-muted/50 cursor-pointer' : ''}`}
                            onClick={() => !imagePreview && fileInputRef.current?.click()}
                        >
                            {imagePreview ? (
                                <img src={imagePreview} className="w-full h-full object-cover" alt="Source inspiration" />
                            ) : (
                                <div className="flex flex-col items-center gap-3 text-muted-foreground text-center p-4">
                                    <div className="p-4 rounded-full bg-background/50 border shadow-sm">
                                        <ImageIcon className="h-8 w-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-semibold">Drag & drop or click</p>
                                        <p className="text-xs">Supports PNG, JPG, WebP</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Analysis Area */}
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Extracted Palette</h4>
                                <div className="flex gap-4">
                                    {extractedColors.length > 0 ? (
                                        extractedColors.map((color, idx) => (
                                            <div key={idx} className="space-y-2">
                                                <div
                                                    className="h-16 w-16 rounded-xl border shadow-sm transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                                                    style={{ backgroundColor: color }}
                                                    onClick={() => {
                                                        // In a real app this would select the color
                                                        toast.success(`Color ${color} selected as primary seed`);
                                                    }}
                                                />
                                                <p className="text-[10px] font-mono text-center uppercase">{color}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex gap-4">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-16 w-16 rounded-xl bg-muted/30 border border-dashed animate-pulse" />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Predictive Inferences</h4>
                                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-2">
                                    <div className="flex items-center gap-2 text-primary font-medium text-sm">
                                        <Sparkles className="h-4 w-4" />
                                        AI Insights
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {extractedColors.length > 0
                                            ? "The visual mood suggests a deep, modern aesthetic. I recommend high-contrast typography and organic spacing patterns to match this inspiration."
                                            : "Upload an image to see predictive design suggestions based on your visual reference."}
                                    </p>
                                </div>
                            </div>

                            <Button
                                className="w-full h-12 text-md font-semibold"
                                disabled={extractedColors.length === 0 || isGenerating}
                                onClick={generateFromVision}
                            >
                                {isGenerating ? (
                                    <>
                                        <RefreshCcw className="h-5 w-5 mr-2 animate-spin" />
                                        Analyzing Mood...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-5 w-5 mr-2" />
                                        Generate Based on Visuals
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
                <canvas ref={canvasRef} className="hidden" />
            </Card>
        </div>
    );
};
