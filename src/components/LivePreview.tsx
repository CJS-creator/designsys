import { useState } from "react";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGenerator } from "./LayoutGenerator";
import { Eye, Monitor, Layout as LayoutIcon, Briefcase, ShoppingBag } from "lucide-react";

interface LivePreviewProps {
  designSystem: GeneratedDesignSystem;
}

export const LivePreview = ({ designSystem }: LivePreviewProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [layoutType, setLayoutType] = useState<"standard" | "saas" | "portfolio" | "ecommerce">("standard");
  const { typography, borderRadius, shadows, animations } = designSystem;
  const colors = isDarkMode && designSystem.darkColors ? designSystem.darkColors : designSystem.colors;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/20 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Environment Preview
            </CardTitle>
            <CardDescription>Live simulation of your design system in real-world contexts</CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Tabs
              value={layoutType}
              onValueChange={(v) => setLayoutType(v as "standard" | "saas" | "portfolio" | "ecommerce")}
              className="w-auto"
            >
              <TabsList className="h-8 p-1">
                <TabsTrigger value="standard" className="text-xs px-2 h-6">Classic</TabsTrigger>
                <TabsTrigger value="saas" className="text-xs px-2 h-6 gap-1">
                  <Monitor className="h-3 w-3" /> SaaS
                </TabsTrigger>
                <TabsTrigger value="portfolio" className="text-xs px-2 h-6 gap-1">
                  <Briefcase className="h-3 w-3" /> Portfolio
                </TabsTrigger>
                <TabsTrigger value="ecommerce" className="text-xs px-2 h-6 gap-1">
                  <ShoppingBag className="h-3 w-3" /> Shop
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2 border-l pl-6">
              <Label htmlFor="preview-dark-mode" className="text-xs font-medium cursor-pointer">Preview Dark</Label>
              <Switch
                id="preview-dark-mode"
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
                className="scale-75"
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="p-8 bg-muted/40 min-h-[600px] flex items-center justify-center transition-colors duration-500">
          <div
            className="w-full max-w-5xl shadow-2xl transition-all duration-500 overflow-hidden"
            style={{
              borderRadius: borderRadius.xl,
              boxShadow: shadows["2xl"] || shadows.xl
            }}
          >
            {layoutType === "standard" ? (
              <div className="rounded-xl overflow-hidden border" style={{ background: colors.background, color: colors.text }}>
                {/* Navigation Bar */}
                <nav className="flex items-center justify-between p-4" style={{ background: colors.surface, borderBottom: `1px solid ${colors.border || 'rgba(128,128,128,0.1)'}` }}>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg" style={{ background: colors.primary }} />
                    <span style={{ fontFamily: typography.fontFamily.heading, fontWeight: 600 }}>StandardView</span>
                  </div>
                  <div className="hidden md:flex items-center gap-6">
                    {["Home", "Products", "About"].map((item) => (
                      <span key={item} className="cursor-pointer text-sm" style={{ color: colors.textSecondary }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </nav>

                <div className="p-12 space-y-12">
                  <div className="space-y-4">
                    <h2 style={{ fontFamily: typography.fontFamily.heading, fontSize: typography.sizes["3xl"] }} className="font-bold">
                      Interface Elements
                    </h2>
                    <p style={{ color: colors.textSecondary }}>A display of your core atoms working together.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <h4 className="text-sm font-bold uppercase tracking-wider opacity-50">Typography & Actions</h4>
                      <h1 style={{ fontFamily: typography.fontFamily.heading, fontSize: typography.sizes["4xl"] }}>
                        The future is <span style={{ color: colors.primary }}>coordinated.</span>
                      </h1>
                      <div className="flex gap-3">
                        <button style={{ background: colors.primary, color: "#fff", borderRadius: borderRadius.md, padding: "10px 20px", fontFamily: typography.fontFamily.body, fontWeight: 600 }}>
                          Get Started
                        </button>
                        <button style={{ border: `2px solid ${colors.primary}`, color: colors.primary, borderRadius: borderRadius.md, padding: "10px 20px", fontFamily: typography.fontFamily.body, fontWeight: 600 }}>
                          Learn More
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4 p-6 rounded-xl border flex flex-col justify-center" style={{ background: colors.surface, borderRadius: borderRadius.lg, borderColor: colors.border || 'rgba(128,128,128,0.1)' }}>
                      <div className="w-12 h-12 rounded-full mb-2 flex items-center justify-center" style={{ background: colors.accent + '20', color: colors.accent }}>
                        <Eye className="h-6 w-6" />
                      </div>
                      <h3 style={{ fontFamily: typography.fontFamily.heading }} className="font-bold text-lg">Visual Audit</h3>
                      <p style={{ color: colors.textSecondary }} className="text-sm">This component demonstrates your chosen elevation, border-radius, and secondary color balance.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <LayoutGenerator
                designSystem={designSystem}
                type={layoutType}
                isDark={isDarkMode}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
