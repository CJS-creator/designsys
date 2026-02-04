import { useState } from "react";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Smartphone, Tablet, Monitor, Eye, User, Bell, Search, Menu, ShoppingCart } from "lucide-react";

interface ResponsivePreviewProps {
  designSystem: GeneratedDesignSystem;
}

type DeviceType = "mobile" | "tablet" | "desktop";

const devices: { type: DeviceType; icon: typeof Smartphone; label: string; width: number; height: number }[] = [
  { type: "mobile", icon: Smartphone, label: "Mobile", width: 375, height: 667 },
  { type: "tablet", icon: Tablet, label: "Tablet", width: 768, height: 1024 },
  { type: "desktop", icon: Monitor, label: "Desktop", width: 1280, height: 800 },
];

export const ResponsivePreview = ({ designSystem }: ResponsivePreviewProps) => {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>("mobile");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { typography, borderRadius, shadows } = designSystem;
  const colors = isDarkMode && designSystem.darkColors ? designSystem.darkColors : designSystem.colors;
  const device = devices.find((d) => d.type === selectedDevice)!;
  const scale = selectedDevice === "desktop" ? 0.6 : selectedDevice === "tablet" ? 0.5 : 0.8;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Responsive Preview
            </CardTitle>
            <CardDescription>Preview your design system across different screen sizes</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
              {devices.map((d) => (
                <Button
                  key={d.type}
                  variant={selectedDevice === d.type ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedDevice(d.type)}
                  className="gap-1"
                >
                  <d.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{d.label}</span>
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="dark-mode-resp" className="text-sm">Dark</Label>
              <Switch id="dark-mode-resp" checked={isDarkMode} onCheckedChange={setIsDarkMode} />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center py-8 bg-muted/30 rounded-xl">
          {/* Device Frame */}
          <div
            className="relative bg-foreground rounded-[2.5rem] p-3 shadow-2xl transition-all duration-500"
            style={{ 
              width: device.width * scale + 24, 
              minHeight: Math.min(device.height * scale + 24, 600),
            }}
          >
            {/* Notch for mobile */}
            {selectedDevice === "mobile" && (
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-20 h-5 bg-foreground rounded-b-xl z-10" />
            )}
            
            {/* Screen */}
            <div
              className="overflow-hidden rounded-[2rem] relative"
              style={{ 
                width: device.width * scale, 
                height: Math.min(device.height * scale, 576),
                background: colors.background,
              }}
            >
              <div className="overflow-auto h-full" style={{ color: colors.text }}>
                {/* Mobile/Tablet Navigation */}
                {selectedDevice !== "desktop" && (
                  <nav className="sticky top-0 z-10 flex items-center justify-between p-3" style={{ background: colors.surface, borderBottom: `1px solid ${colors.border}` }}>
                    <Menu className="h-5 w-5" style={{ color: colors.textSecondary }} />
                    <div className="w-6 h-6 rounded-md" style={{ background: colors.primary }} />
                    <div className="flex gap-2">
                      <Search className="h-5 w-5" style={{ color: colors.textSecondary }} />
                      <ShoppingCart className="h-5 w-5" style={{ color: colors.textSecondary }} />
                    </div>
                  </nav>
                )}

                {/* Desktop Navigation */}
                {selectedDevice === "desktop" && (
                  <nav className="sticky top-0 z-10 flex items-center justify-between p-4" style={{ background: colors.surface, borderBottom: `1px solid ${colors.border}` }}>
                    <div className="flex items-center gap-6">
                      <div className="w-8 h-8 rounded-lg" style={{ background: colors.primary }} />
                      {["Home", "Products", "About", "Contact"].map((item) => (
                        <span key={item} className="text-xs cursor-pointer" style={{ color: colors.textSecondary }}>{item}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <Search className="h-4 w-4" style={{ color: colors.textSecondary }} />
                      <Bell className="h-4 w-4" style={{ color: colors.textSecondary }} />
                      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: colors.primary }}>
                        <User className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </nav>
                )}

                {/* Content */}
                <div className="p-4 space-y-4">
                  {/* Hero */}
                  <div className="rounded-xl p-4 text-center" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})` }}>
                    <h1 className="text-white font-bold mb-2" style={{ fontFamily: typography.fontFamily.heading, fontSize: selectedDevice === "mobile" ? "1rem" : "1.25rem" }}>
                      Welcome Back
                    </h1>
                    <p className="text-white/80 text-xs mb-3">Discover what's new today</p>
                    <button className="px-4 py-2 text-xs rounded-full font-medium" style={{ background: "rgba(255,255,255,0.2)", color: "#fff", backdropFilter: "blur(10px)" }}>
                      Get Started
                    </button>
                  </div>

                  {/* Cards Grid */}
                  <div className={`grid gap-3 ${selectedDevice === "mobile" ? "grid-cols-1" : selectedDevice === "tablet" ? "grid-cols-2" : "grid-cols-3"}`}>
                    {[1, 2, 3].map((i) => (
                      <div key={i} style={{ background: colors.surface, borderRadius: borderRadius.lg, padding: "12px", boxShadow: shadows.sm, border: `1px solid ${colors.borderLight}` }}>
                        <div className="h-16 mb-2 rounded-md" style={{ background: i === 1 ? colors.primary : i === 2 ? colors.secondary : colors.accent }} />
                        <h3 className="font-semibold text-xs mb-1" style={{ fontFamily: typography.fontFamily.heading }}>Card {i}</h3>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>Description text</p>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Users", value: "12.5k", color: colors.success },
                      { label: "Revenue", value: "$45k", color: colors.primary },
                    ].map((stat) => (
                      <div key={stat.label} className="p-3 rounded-lg" style={{ background: colors.surface, border: `1px solid ${colors.borderLight}` }}>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>{stat.label}</p>
                        <p className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          {device.width} × {device.height}px
        </div>
      </CardContent>
    </Card>
  );
};
