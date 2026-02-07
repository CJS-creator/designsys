import { useState } from "react";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BrandGuidelinesPDFProps {
  designSystem: GeneratedDesignSystem;
}

export const BrandGuidelinesPDF = ({ designSystem }: BrandGuidelinesPDFProps) => {
  const [companyName, setCompanyName] = useState("");
  const [tagline, setTagline] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const generateHTMLContent = () => {
    const { colors, typography, spacing, shadows, borderRadius } = designSystem;
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${companyName || designSystem.name} - Brand Guidelines</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; color: #1a1a1a; line-height: 1.6; }
    .page { padding: 48px; max-width: 800px; margin: 0 auto; page-break-after: always; }
    .cover { height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: linear-gradient(135deg, ${colors.primary}, ${colors.accent}); color: white; text-align: center; }
    .cover h1 { font-size: 48px; margin-bottom: 16px; }
    .cover p { font-size: 20px; opacity: 0.9; }
    h2 { font-size: 28px; margin-bottom: 24px; color: ${colors.primary}; border-bottom: 2px solid ${colors.primary}; padding-bottom: 8px; }
    h3 { font-size: 18px; margin: 24px 0 12px; }
    .section { margin-bottom: 48px; }
    .color-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 16px; }
    .color-swatch { border-radius: 8px; overflow: hidden; border: 1px solid #e5e5e5; }
    .color-swatch-color { height: 80px; }
    .color-swatch-info { padding: 8px; background: #f9f9f9; }
    .color-swatch-name { font-weight: 600; font-size: 12px; }
    .color-swatch-value { font-size: 11px; color: #666; font-family: monospace; }
    .typography-sample { margin: 16px 0; padding: 16px; border: 1px solid #e5e5e5; border-radius: 8px; }
    .font-name { font-size: 12px; color: #666; margin-bottom: 8px; }
    .spacing-grid { display: flex; align-items: end; gap: 8px; flex-wrap: wrap; }
    .spacing-item { display: flex; flex-direction: column; align-items: center; }
    .spacing-box { background: ${colors.primary}; }
    .spacing-label { font-size: 10px; color: #666; margin-top: 4px; }
    .shadow-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .shadow-item { padding: 24px; border-radius: 8px; background: white; text-align: center; }
    .shadow-name { font-size: 12px; color: #666; margin-top: 8px; }
    .radius-grid { display: flex; gap: 16px; flex-wrap: wrap; }
    .radius-item { display: flex; flex-direction: column; align-items: center; }
    .radius-box { width: 60px; height: 60px; background: ${colors.primary}; }
    .radius-label { font-size: 10px; color: #666; margin-top: 4px; }
    @media print { .page { page-break-after: always; } }
  </style>
</head>
<body>
  <div class="cover page">
    <h1>${companyName || designSystem.name}</h1>
    ${tagline ? `<p>${tagline}</p>` : ""}
    <p style="margin-top: 48px; font-size: 14px;">Brand Guidelines</p>
  </div>

  ${brandDescription ? `
  <div class="page">
    <div class="section">
      <h2>Brand Overview</h2>
      <p>${brandDescription}</p>
    </div>
  </div>
  ` : ""}

  <div class="page">
    <div class="section">
      <h2>Color Palette</h2>
      <h3>Primary Colors</h3>
      <div class="color-grid">
        ${Object.entries({ primary: colors.primary, secondary: colors.secondary, accent: colors.accent })
          .map(([name, value]) => `
            <div class="color-swatch">
              <div class="color-swatch-color" style="background: ${value}"></div>
              <div class="color-swatch-info">
                <div class="color-swatch-name">${name.charAt(0).toUpperCase() + name.slice(1)}</div>
                <div class="color-swatch-value">${value}</div>
              </div>
            </div>
          `).join("")}
      </div>
      <h3>Semantic Colors</h3>
      <div class="color-grid">
        ${Object.entries({ success: colors.success, warning: colors.warning, error: colors.error })
          .map(([name, value]) => `
            <div class="color-swatch">
              <div class="color-swatch-color" style="background: ${value}"></div>
              <div class="color-swatch-info">
                <div class="color-swatch-name">${name.charAt(0).toUpperCase() + name.slice(1)}</div>
                <div class="color-swatch-value">${value}</div>
              </div>
            </div>
          `).join("")}
      </div>
      <h3>Neutral Colors</h3>
      <div class="color-grid">
        ${Object.entries({ background: colors.background, surface: colors.surface, text: colors.text, textSecondary: colors.textSecondary, border: colors.border })
          .map(([name, value]) => `
            <div class="color-swatch">
              <div class="color-swatch-color" style="background: ${value}"></div>
              <div class="color-swatch-info">
                <div class="color-swatch-name">${name}</div>
                <div class="color-swatch-value">${value}</div>
              </div>
            </div>
          `).join("")}
      </div>
    </div>
  </div>

  <div class="page">
    <div class="section">
      <h2>Typography</h2>
      <div class="typography-sample">
        <div class="font-name">Heading: ${typography.fontFamily.heading}</div>
        <div style="font-family: ${typography.fontFamily.heading}; font-size: 32px; font-weight: 700;">The quick brown fox</div>
      </div>
      <div class="typography-sample">
        <div class="font-name">Body: ${typography.fontFamily.body}</div>
        <div style="font-family: ${typography.fontFamily.body}; font-size: 16px;">The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.</div>
      </div>
      <div class="typography-sample">
        <div class="font-name">Mono: ${typography.fontFamily.mono}</div>
        <div style="font-family: ${typography.fontFamily.mono}; font-size: 14px;">const design = "system";</div>
      </div>
      <h3>Type Scale</h3>
      <div style="display: grid; grid-template-columns: 100px 1fr; gap: 8px;">
        ${Object.entries(typography.sizes).map(([name, size]) => `
          <div style="font-size: 12px; color: #666;">${name} (${size})</div>
          <div style="font-size: ${size}; font-family: ${typography.fontFamily.body};">Sample Text</div>
        `).join("")}
      </div>
    </div>
  </div>

  <div class="page">
    <div class="section">
      <h2>Spacing</h2>
      <p style="margin-bottom: 24px;">Base unit: ${spacing.unit}px</p>
      <div class="spacing-grid">
        ${Object.entries(spacing.scale).slice(0, 10).map(([name, value]) => `
          <div class="spacing-item">
            <div class="spacing-box" style="width: ${value}; height: ${value}; min-width: 4px; min-height: 4px;"></div>
            <div class="spacing-label">${name} (${value})</div>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="section">
      <h2>Shadows</h2>
      <div class="shadow-grid">
        ${Object.entries(shadows).filter(([name]) => name !== "none" && name !== "inner").map(([name, value]) => `
          <div class="shadow-item" style="box-shadow: ${value};">
            <div class="shadow-name">${name}</div>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="section">
      <h2>Border Radius</h2>
      <div class="radius-grid">
        ${Object.entries(borderRadius).filter(([name]) => name !== "none").map(([name, value]) => `
          <div class="radius-item">
            <div class="radius-box" style="border-radius: ${value};"></div>
            <div class="radius-label">${name} (${value})</div>
          </div>
        `).join("")}
      </div>
    </div>
  </div>

  <div class="cover page" style="background: #f9f9f9; color: #1a1a1a;">
    <p style="font-size: 14px;">Generated with DesignForge</p>
    <p style="font-size: 12px; opacity: 0.6; margin-top: 8px;">${new Date().toLocaleDateString()}</p>
  </div>
</body>
</html>
    `;
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const htmlContent = generateHTMLContent();
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(companyName || designSystem.name).replace(/\s+/g, "-").toLowerCase()}-brand-guidelines.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Brand Guidelines Export
        </CardTitle>
        <CardDescription>Generate a comprehensive brand guidelines document</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              placeholder={designSystem.name}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline (optional)</Label>
            <Input
              id="tagline"
              placeholder="Your brand tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand-description">Brand Description (optional)</Label>
          <Textarea
            id="brand-description"
            placeholder="Describe your brand's mission, values, and personality..."
            value={brandDescription}
            onChange={(e) => setBrandDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Document Includes:</h4>
          <div className="flex flex-wrap gap-2">
            {["Cover Page", "Color Palette", "Typography", "Spacing", "Shadows", "Border Radius"].map((item) => (
              <Badge key={item} variant="secondary">{item}</Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Brand Guidelines Preview</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[70vh]">
                <iframe
                  srcDoc={generateHTMLContent()}
                  className="w-full h-[600px] border rounded-lg"
                  title="Brand Guidelines Preview"
                />
              </ScrollArea>
            </DialogContent>
          </Dialog>

          <Button onClick={handleDownload} disabled={isGenerating} className="gap-2">
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download HTML
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Tip: Open the HTML file in your browser and use Print → Save as PDF for a PDF version
        </p>
      </CardContent>
    </Card>
  );
};
