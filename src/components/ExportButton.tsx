import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GeneratedDesignSystem } from "@/types/designSystem";
import {
  Download,
  FileJson,
  FileCode,
  Copy,
  Check,
  Eye,
  Layers,
  Lock,
  User,
  Smartphone,
  Component,
  FileText,
  BookOpen,
  Github,
  RefreshCw
} from "lucide-react";
import { exportToGitHub } from "@/lib/git/sync";
import { toast } from "sonner";
// convertToW3CTokens - available for future use
import { exportToFlutterPro as exportToFlutter } from "@/lib/exporters/flutter";
import { exportToSwiftUIPro as exportToSwiftUI } from "@/lib/exporters/swiftui";
import { exportToKotlinPro as exportToKotlin } from "@/lib/exporters/kotlin";
import { exportToCSSJSPro as exportToCSSJS } from "@/lib/exporters/css-in-js";
import { exportToFigmaVariables } from "@/lib/exporters/figma-variables";
import { exportToStaticDocs } from "@/lib/exporters/static-docs";
import {
  generateCSSVariables,
  generateTailwindConfig,
  generateSCSS,
  generateFigmaTokens,
  generateStyleDictionary,
  generateReactNative,
  generateStorybook,
  generateStyleguideMD
} from "@/lib/exporters/web-exporters";


// generateGitHubAction - available for future use
import { exportToStorybookAdvanced } from "@/lib/exporters/storybook-advanced";
import { exportToDTCG } from "@/lib/exporters/dtcg";
import { trackEvent, AnalyticsEvent } from "@/lib/analytics";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { resolveTemplate } from "@/lib/exporters/custom-templating";
import { DesignToken } from "@/types/tokens";
import { Separator } from "@/components/ui/separator";
import { buildTokensPayload, tokensToYaml } from "@/lib/exporters/tokensPayload";
import { exportDesignSystemToPdf } from "@/lib/exporters/designSystemPdf";

interface ExportButtonProps {
  designSystem: GeneratedDesignSystem;
  tokens?: DesignToken[];
}

type ExportFormat = "json" | "css" | "scss" | "tailwind" | "figma" | "style-dictionary" | "react-native" | "storybook" | "styleguide" | "swiftui" | "compose" | "w3c" | "storybook-pro" | "flutter" | "css-in-js" | "figma-variables";

interface ExportOption {
  id: ExportFormat;
  label: string;
  filename: string;
  icon: React.ReactNode;
  generator: (ds: GeneratedDesignSystem, tokens?: DesignToken[]) => string;
  description?: string;
}

const exportOptions: ExportOption[] = [
  { id: "json" as ExportFormat, label: "Tokens (JSON)", filename: "tokens.json", icon: <FileJson className="h-4 w-4" />, generator: (ds) => JSON.stringify(buildTokensPayload(ds), null, 2), description: "Flat tokens — colors, type, spacing, shadows, grid" },
  { id: "json" as ExportFormat, label: "Tokens (YAML)", filename: "tokens.yaml", icon: <FileText className="h-4 w-4" />, generator: (ds) => tokensToYaml(buildTokensPayload(ds)), description: "Same tokens as JSON but in YAML" },
  { id: "json", label: "Full JSON", filename: "design-system.json", icon: <FileJson className="h-4 w-4" />, generator: (ds, tokens) => tokens ? JSON.stringify(tokens, null, 2) : JSON.stringify(ds, null, 2), description: "Raw design system data in JSON format" },
  { id: "css", label: "CSS Variables", filename: "design-system.css", icon: <FileCode className="h-4 w-4" />, generator: (ds) => generateCSSVariables(ds), description: "CSS custom properties for easy theming" },
  { id: "scss", label: "SCSS", filename: "design-system.scss", icon: <FileCode className="h-4 w-4" />, generator: (ds) => generateSCSS(ds), description: "SCSS variables for Sass-based projects" },
  { id: "tailwind", label: "Tailwind Config", filename: "tailwind.config.js", icon: <FileCode className="h-4 w-4" />, generator: (ds) => generateTailwindConfig(ds), description: "Tailwind CSS configuration file" },
  { id: "react-native", label: "React Native", filename: "theme.ts", icon: <Smartphone className="h-4 w-4" />, generator: (ds) => generateReactNative(ds), description: "StyleSheet tokens for React Native" },
  { id: "swiftui", label: "SwiftUI (iOS)", filename: "DesignTokens.swift", icon: <Smartphone className="h-4 w-4" />, generator: (ds, tokens) => exportToSwiftUI(tokens || [], ds.name), description: "Advanced Swift extensions for iOS" },
  { id: "compose", label: "Compose (Android)", filename: "DesignTokens.kt", icon: <Smartphone className="h-4 w-4" />, generator: (ds, tokens) => exportToKotlin(tokens || [], ds.name), description: "Advanced Kotlin Compose definitions" },
  { id: "flutter", label: "Flutter (Dart)", filename: "design_tokens.dart", icon: <Smartphone className="h-4 w-4" />, generator: (ds, tokens) => exportToFlutter(tokens || [], ds.name), description: "Complete Flutter theme tokens" },
  { id: "css-in-js", label: "CSS-in-JS", filename: "theme.ts", icon: <FileCode className="h-4 w-4" />, generator: (ds, tokens) => exportToCSSJS(tokens || [], ds.name), description: "Typed theme for Styled Components/Emotion" },
  { id: "storybook", label: "Storybook", filename: "tokens.stories.tsx", icon: <Component className="h-4 w-4" />, generator: (ds) => generateStorybook(ds), description: "React stories for documentation" },
  { id: "styleguide", label: "Styleguide MD", filename: "STYLEGUIDE.md", icon: <FileText className="h-4 w-4" />, generator: (ds) => generateStyleguideMD(ds), description: "Professional documentation in Markdown" },
  { id: "figma", label: "Figma Tokens", filename: "figma-tokens.json", icon: <FileJson className="h-4 w-4" />, generator: (ds) => generateFigmaTokens(ds), description: "Tokens compatible with Figma plugins" },
  { id: "figma-variables", label: "Figma Variables", filename: "figma-variables.json", icon: <FileJson className="h-4 w-4" />, generator: (ds) => exportToFigmaVariables(ds), description: "Tokens compatible with Figma Variables REST API" },
  { id: "style-dictionary", label: "Style Dictionary", filename: "tokens.json", icon: <Layers className="h-4 w-4" />, generator: (ds) => generateStyleDictionary(ds), description: "Tokens for Style Dictionary framework" },
  { id: "storybook-pro", label: "Storybook Pro", filename: "storybook-theme.js", icon: <BookOpen className="h-4 w-4" />, generator: (ds) => exportToStorybookAdvanced(ds), description: "Advanced tokens + preview.js config" },
  { id: "w3c", label: "DTCG (W3C Standard)", icon: <FileJson className="h-4 w-4" />, filename: "tokens.dtcg.json", description: "Design Tokens Community Group standard", generator: (_ds, tokens) => exportToDTCG(tokens || []) },
  { id: "styleguide", label: "HTML Documentation", filename: "docs.html", icon: <FileText className="h-4 w-4" />, generator: (ds) => exportToStaticDocs(ds), description: "Self-contained HTML documentation" },
];

export function ExportButton({ designSystem, tokens }: ExportButtonProps) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFormat, setPreviewFormat] = useState<ExportOption | null>(null);
  const [previewContent, setPreviewContent] = useState("");
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [, setIsDownloading] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const dsId = searchParams.get("id") || "";
  const [isSyncing, setIsSyncing] = useState(false);

  const handleGitHubSync = async () => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }

    // First check if git connection exists
    const { data: connection } = await supabase
      .from("git_connections" as any)
      .select("repo_full_name, default_branch")
      .eq("design_system_id", dsId)
      .maybeSingle() as { data: { repo_full_name: string; default_branch: string } | null };

    if (!connection) {
      toast.error("GitHub not connected. Please go to Settings > Git to link a repository.");
      return;
    }

    setIsSyncing(true);
    const toastId = toast.loading(`Pushing to ${connection.repo_full_name}...`);

    try {
      const result = await exportToGitHub(dsId, tokens || [], connection.repo_full_name, connection.default_branch);

      if (result.success) {
        toast.success(result.message, { id: toastId });
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch (error) {
      toast.error("An unexpected error occurred during sync", { id: toastId });
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    const fetchCustomTemplates = async () => {
      if (!dsId) return;
      const { data } = await supabase
        .from("export_templates" as any)
        .select("*")
        .eq("design_system_id", dsId);

      if (data) setCustomTemplates(data);
    };

    fetchCustomTemplates();
  }, [dsId]);

  const customOptions: ExportOption[] = customTemplates.map(t => ({
    id: `custom-${t.id}` as any,
    label: t.name,
    filename: `${t.name}.${t.extension}`,
    icon: <FileCode className="h-4 w-4 text-primary" />,
    generator: (ds, tokens) => resolveTemplate(t.template, tokens || [], ds.name),
    description: `Custom format: ${t.name}`
  }));


  const downloadFile = (option: ExportOption) => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }
    const content = option.generator(designSystem, tokens);
    const filename = option.filename;

    const dsIdFromParams = searchParams.get("id") || "";
    trackEvent(dsIdFromParams, `exported_${filename.split('.')[1]}` as AnalyticsEvent, { filename });

    setIsDownloading(true);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
    setIsDownloading(false);
  };

  const copyJSON = () => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }
    navigator.clipboard.writeText(JSON.stringify(designSystem, null, 2));
    const dsIdFromParams = searchParams.get("id") || "";
    trackEvent(dsIdFromParams, "exported_json", { method: "copy" });
    setCopied(true);
    toast.success("Copied JSON to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const openPreview = (option: ExportOption) => {
    const content = option.generator(designSystem, tokens);
    setPreviewFormat(option);
    setPreviewContent(content);
    setPreviewOpen(true);
  };

  const copyPreviewContent = () => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }
    navigator.clipboard.writeText(previewContent);
    toast.success("Copied to clipboard");
  };

  const handleDownloadFromPreview = () => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }
    if (previewFormat) {
      const blob = new Blob([previewContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = previewFormat.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${previewFormat.filename}`);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="lg" className="gap-2">
            <Download className="h-4 w-4" />
            Export
            {!user && <Lock className="h-3 w-3 ml-1" />}
            {user && !designSystem.is_published && (
              <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">DRAFT</span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {user && !designSystem.is_published && (
            <div className="p-2 m-1 mb-2 rounded bg-yellow-500/10 border border-yellow-500/20 text-[10px] text-yellow-600">
              <strong>Warning:</strong> You are exporting a Draft version. This has not been approved for production.
            </div>
          )}
          {customOptions.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Custom Exporters</div>
              {customOptions.map((option) => (
                <DropdownMenuItem key={option.id} className="flex items-center justify-between">
                  <span
                    className="flex items-center flex-1 cursor-pointer"
                    onClick={() => downloadFile(option)}
                  >
                    <span className="mr-2">{option.icon}</span>
                    {option.label}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      openPreview(option);
                    }}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </DropdownMenuItem>
              ))}
              <Separator className="my-1" />
            </>
          )}
          <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Built-in Formats</div>
          {exportOptions.map((option) => (
            <DropdownMenuItem key={option.id} className="flex items-center justify-between">
              <span
                className="flex items-center flex-1 cursor-pointer"
                onClick={() => downloadFile(option)}
              >
                <span className="mr-2">{option.icon}</span>
                {option.label}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 ml-2"
                aria-label={`Preview ${option.label} format`}
                onClick={(e) => {
                  e.stopPropagation();
                  openPreview(option);
                }}
              >
                <Eye className="h-3 w-3" />
              </Button>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem onClick={copyJSON}>
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            Copy JSON
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (!user) { setAuthDialogOpen(true); return; }
              try {
                exportDesignSystemToPdf(designSystem);
                toast.success("PDF downloaded");
              } catch (e) {
                toast.error("Could not generate PDF", { description: e instanceof Error ? e.message : undefined });
              }
            }}
          >
            <FileText className="h-4 w-4 mr-2" />
            Download PDF
          </DropdownMenuItem>
          <Separator className="my-1" />
          <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Git Integration</div>
          <DropdownMenuItem
            className="flex items-center gap-2 text-primary font-bold focus:text-primary"
            onClick={handleGitHubSync}
            disabled={isSyncing}
          >
            {isSyncing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />}
            Push to GitHub
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="h-5 w-5">{previewFormat?.icon}</span>
              {previewFormat?.label} Preview
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[50vh] rounded-md border bg-muted/50 p-4">
            <pre className="text-xs font-mono whitespace-pre-wrap break-all">
              {previewContent}
            </pre>
          </ScrollArea>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={copyPreviewContent}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
              {!user && <Lock className="h-3 w-3 ml-1" />}
            </Button>
            <Button onClick={handleDownloadFromPreview}>
              <Download className="h-4 w-4 mr-2" />
              Download
              {!user && <Lock className="h-3 w-3 ml-1" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Auth Required Dialog */}
      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Sign In Required
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              Create a free account to export and save your design systems.
            </p>
            <Button asChild className="w-full">
              <Link to="/auth">
                <User className="mr-2 h-4 w-4" />
                Sign In to Export
              </Link>
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  GitHub Sync
                </h4>
                <p className="text-xs text-muted-foreground">Push tokens directly to a repository</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info("GitHub integration coming soon in the next update!")}
              >
                Connect Repository
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
