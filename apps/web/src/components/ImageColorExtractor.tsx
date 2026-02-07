import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Image as ImageIcon, Palette, Copy, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ExtractedColor {
  hex: string;
  count: number;
  percentage: number;
}

interface ImageColorExtractorProps {
  onApplyColors: (colors: { primary: string; secondary: string; accent: string }) => void;
}

export function ImageColorExtractor({ onApplyColors }: ImageColorExtractorProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedColors, setSelectedColors] = useState<{ primary?: string; secondary?: string; accent?: string }>({});
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const extractColors = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize for performance
    const maxSize = 100;
    const scale = Math.min(maxSize / img.width, maxSize / img.height);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Color quantization using simple bucketing
    const colorMap = new Map<string, number>();
    const bucketSize = 24; // Reduce color space

    for (let i = 0; i < data.length; i += 4) {
      const r = Math.round(data[i] / bucketSize) * bucketSize;
      const g = Math.round(data[i + 1] / bucketSize) * bucketSize;
      const b = Math.round(data[i + 2] / bucketSize) * bucketSize;
      const a = data[i + 3];

      // Skip transparent pixels
      if (a < 128) continue;

      // Skip very dark or very light colors (often backgrounds)
      const brightness = (r + g + b) / 3;
      if (brightness < 20 || brightness > 235) continue;

      const hex = `#${[r, g, b].map((x) => Math.min(255, x).toString(16).padStart(2, "0")).join("")}`;
      colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
    }

    // Sort by frequency and get top colors
    const totalPixels = data.length / 4;
    const sortedColors = Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([hex, count]) => ({
        hex,
        count,
        percentage: Math.round((count / totalPixels) * 100 * 10) / 10,
      }));

    setExtractedColors(sortedColors);
    
    // Auto-select first 3 distinct colors
    if (sortedColors.length >= 3) {
      setSelectedColors({
        primary: sortedColors[0].hex,
        secondary: sortedColors[1].hex,
        accent: sortedColors[2].hex,
      });
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setIsExtracting(true);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setImageUrl(url);

      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        extractColors(img);
        setIsExtracting(false);
      };
      img.onerror = () => {
        toast.error("Failed to load image");
        setIsExtracting(false);
      };
      img.src = url;
    };

    reader.onerror = () => {
      toast.error("Failed to read file");
      setIsExtracting(false);
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        handleFileChange({ target: { files: dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  const handleSelectColor = (hex: string, role: "primary" | "secondary" | "accent") => {
    setSelectedColors((prev) => ({ ...prev, [role]: hex }));
    toast.success(`Set as ${role} color`);
  };

  const handleApply = () => {
    if (!selectedColors.primary || !selectedColors.secondary || !selectedColors.accent) {
      toast.error("Please select primary, secondary, and accent colors");
      return;
    }
    onApplyColors({
      primary: selectedColors.primary,
      secondary: selectedColors.secondary,
      accent: selectedColors.accent,
    });
    toast.success("Colors applied to form!");
  };

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    toast.success(`Copied ${hex}`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const clearImage = () => {
    setImageUrl(null);
    setExtractedColors([]);
    setSelectedColors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          Extract Colors from Image
        </CardTitle>
        <CardDescription>
          Upload a logo or image to automatically extract a color palette
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Upload Area */}
        {!imageUrl ? (
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="font-medium">Drop an image here or click to upload</p>
            <p className="text-sm text-muted-foreground mt-1">
              Supports JPG, PNG, GIF, SVG
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Image Preview */}
            <div className="relative">
              <img
                src={imageUrl}
                alt="Uploaded"
                className="w-full max-h-48 object-contain rounded-lg border bg-muted/50"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Loading State */}
            {isExtracting && (
              <div className="flex items-center justify-center gap-2 py-4">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Extracting colors...</span>
              </div>
            )}

            {/* Extracted Colors */}
            {extractedColors.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Extracted Colors</h4>
                  <p className="text-sm text-muted-foreground">
                    Click to assign as Primary (P), Secondary (S), or Accent (A)
                  </p>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {extractedColors.map((color) => {
                    const isPrimary = selectedColors.primary === color.hex;
                    const isSecondary = selectedColors.secondary === color.hex;
                    const isAccent = selectedColors.accent === color.hex;
                    const isSelected = isPrimary || isSecondary || isAccent;

                    return (
                      <div key={color.hex} className="space-y-1">
                        <div
                          className={`relative h-16 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected ? "ring-2 ring-primary ring-offset-2" : "hover:scale-105"
                          }`}
                          style={{ backgroundColor: color.hex }}
                        >
                          {isSelected && (
                            <Badge className="absolute -top-2 -right-2 text-xs">
                              {isPrimary ? "P" : isSecondary ? "S" : "A"}
                            </Badge>
                          )}
                          
                          {/* Role buttons on hover */}
                          <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 hover:opacity-100 bg-background/80 rounded-lg transition-opacity">
                            <Button
                              size="sm"
                              variant={isPrimary ? "default" : "outline"}
                              className="h-6 w-6 p-0 text-xs"
                              onClick={() => handleSelectColor(color.hex, "primary")}
                            >
                              P
                            </Button>
                            <Button
                              size="sm"
                              variant={isSecondary ? "default" : "outline"}
                              className="h-6 w-6 p-0 text-xs"
                              onClick={() => handleSelectColor(color.hex, "secondary")}
                            >
                              S
                            </Button>
                            <Button
                              size="sm"
                              variant={isAccent ? "default" : "outline"}
                              className="h-6 w-6 p-0 text-xs"
                              onClick={() => handleSelectColor(color.hex, "accent")}
                            >
                              A
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <button
                            className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1"
                            onClick={() => copyColor(color.hex)}
                          >
                            {copiedColor === color.hex ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                            {color.hex}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Colors Preview */}
                <div className="p-4 rounded-lg border bg-muted/50">
                  <h4 className="font-medium mb-3">Selected Palette</h4>
                  <div className="flex gap-4 items-center">
                    <div className="flex-1 space-y-1">
                      <div className="flex gap-2">
                        <div
                          className="h-10 flex-1 rounded-lg border"
                          style={{ backgroundColor: selectedColors.primary || "#e5e5e5" }}
                        />
                        <div
                          className="h-10 flex-1 rounded-lg border"
                          style={{ backgroundColor: selectedColors.secondary || "#e5e5e5" }}
                        />
                        <div
                          className="h-10 flex-1 rounded-lg border"
                          style={{ backgroundColor: selectedColors.accent || "#e5e5e5" }}
                        />
                      </div>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span className="flex-1 text-center">Primary</span>
                        <span className="flex-1 text-center">Secondary</span>
                        <span className="flex-1 text-center">Accent</span>
                      </div>
                    </div>
                    <Button
                      onClick={handleApply}
                      disabled={!selectedColors.primary || !selectedColors.secondary || !selectedColors.accent}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Apply Colors
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
