import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Moon, Sun, Smartphone, Tablet, Monitor, Maximize2 } from "lucide-react";
import { GeneratedDesignSystem } from "@/types/designSystem";

interface RealTimePreviewProps {
  designSystem: GeneratedDesignSystem;
  formValues?: {
    primaryColor?: string;
    brandMood?: string[];
    industry?: string;
  };
}

type DeviceType = "mobile" | "tablet" | "desktop" | "fullscreen";

const DEVICE_SIZES: Record<DeviceType, { width: string; height: string }> = {
  mobile: { width: "375px", height: "667px" },
  tablet: { width: "768px", height: "600px" },
  desktop: { width: "100%", height: "600px" },
  fullscreen: { width: "100%", height: "800px" },
};

export function RealTimePreview({ designSystem, formValues }: RealTimePreviewProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [device, setDevice] = useState<DeviceType>("desktop");

  const colors = useMemo(() => {
    if (isDarkMode && designSystem.darkColors) {
      return designSystem.darkColors;
    }
    return designSystem.colors;
  }, [isDarkMode, designSystem]);

  const { typography, borderRadius, shadows } = designSystem;
  const deviceSize = DEVICE_SIZES[device];

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          Real-Time Preview
        </CardTitle>
        <div className="flex items-center gap-2">
          {/* Device Selector */}
          <div className="flex items-center rounded-lg border border-border bg-background p-1">
            <Button
              variant={device === "mobile" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setDevice("mobile")}
              aria-label="Mobile preview"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
            <Button
              variant={device === "tablet" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setDevice("tablet")}
              aria-label="Tablet preview"
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={device === "desktop" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setDevice("desktop")}
              aria-label="Desktop preview"
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={device === "fullscreen" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setDevice("fullscreen")}
              aria-label="Fullscreen preview"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Dark Mode Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <div
            className="overflow-hidden transition-all duration-300 rounded-lg border border-border shadow-xl"
            style={{
              width: deviceSize.width,
              maxWidth: "100%",
              height: deviceSize.height,
            }}
          >
            {/* Preview Content */}
            <div
              className="h-full overflow-auto"
              style={{
                backgroundColor: colors.background,
                color: colors.text,
                fontFamily: typography.fontFamily.body,
              }}
            >
              {/* Header */}
              <header
                className="sticky top-0 z-10 p-4 border-b"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg"
                      style={{ backgroundColor: colors.primary }}
                    />
                    <span
                      className="font-semibold"
                      style={{
                        fontFamily: typography.fontFamily.heading,
                        fontSize: typography.sizes.lg,
                      }}
                    >
                      {designSystem.name}
                    </span>
                  </div>
                  <nav className="flex items-center gap-4">
                    {["Home", "About", "Contact"].map((item) => (
                      <span
                        key={item}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          fontSize: typography.sizes.sm,
                          color: colors.textSecondary,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </nav>
                </div>
              </header>

              {/* Hero Section */}
              <section className="p-6 md:p-8" style={{ backgroundColor: colors.background }}>
                <div className="max-w-2xl">
                  <h1
                    style={{
                      fontFamily: typography.fontFamily.heading,
                      fontSize: device === "mobile" ? typography.sizes["3xl"] : typography.sizes["4xl"],
                      fontWeight: typography.weights.bold,
                      lineHeight: typography.lineHeights.tight,
                      marginBottom: "1rem",
                    }}
                  >
                    Build Beautiful Interfaces
                  </h1>
                  <p
                    style={{
                      fontSize: typography.sizes.lg,
                      color: colors.textSecondary,
                      lineHeight: typography.lineHeights.relaxed,
                      marginBottom: "1.5rem",
                    }}
                  >
                    Create stunning design systems with AI-powered generation.
                    Your brand, your style, automatically.
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <button
                      className="px-6 py-3 font-medium transition-all hover:opacity-90"
                      style={{
                        backgroundColor: colors.primary,
                        color: "#fff",
                        borderRadius: borderRadius.lg,
                        boxShadow: shadows.md,
                        fontSize: typography.sizes.base,
                      }}
                    >
                      Get Started
                    </button>
                    <button
                      className="px-6 py-3 font-medium transition-all hover:opacity-90"
                      style={{
                        backgroundColor: "transparent",
                        color: colors.primary,
                        borderRadius: borderRadius.lg,
                        border: `2px solid ${colors.primary}`,
                        fontSize: typography.sizes.base,
                      }}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </section>

              {/* Cards Section */}
              <section
                className="p-6 md:p-8"
                style={{ backgroundColor: colors.surface }}
              >
                <h2
                  style={{
                    fontFamily: typography.fontFamily.heading,
                    fontSize: typography.sizes["2xl"],
                    fontWeight: typography.weights.semibold,
                    marginBottom: "1.5rem",
                  }}
                >
                  Features
                </h2>
                <div
                  className="grid gap-4"
                  style={{
                    gridTemplateColumns: device === "mobile" ? "1fr" : "repeat(3, 1fr)",
                  }}
                >
                  {[
                    { title: "AI Generation", color: colors.primary, desc: "Smart color palettes" },
                    { title: "Typography", color: colors.secondary, desc: "Perfect type scales" },
                    { title: "Components", color: colors.accent, desc: "Ready to use" },
                  ].map((card) => (
                    <div
                      key={card.title}
                      className="p-5 transition-all hover:translate-y-[-2px]"
                      style={{
                        backgroundColor: colors.background,
                        borderRadius: borderRadius.xl,
                        boxShadow: shadows.sm,
                        border: `1px solid ${colors.borderLight}`,
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center"
                        style={{ backgroundColor: `${card.color}20` }}
                      >
                        <div
                          className="w-5 h-5 rounded"
                          style={{ backgroundColor: card.color }}
                        />
                      </div>
                      <h3
                        style={{
                          fontFamily: typography.fontFamily.heading,
                          fontSize: typography.sizes.lg,
                          fontWeight: typography.weights.semibold,
                          marginBottom: "0.5rem",
                        }}
                      >
                        {card.title}
                      </h3>
                      <p
                        style={{
                          fontSize: typography.sizes.sm,
                          color: colors.textSecondary,
                        }}
                      >
                        {card.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Status Section */}
              <section className="p-6 md:p-8">
                <div className="flex flex-wrap gap-3">
                  <span
                    className="px-3 py-1 text-sm font-medium"
                    style={{
                      backgroundColor: `${colors.success}20`,
                      color: colors.success,
                      borderRadius: borderRadius.full,
                    }}
                  >
                    Success
                  </span>
                  <span
                    className="px-3 py-1 text-sm font-medium"
                    style={{
                      backgroundColor: `${colors.warning}20`,
                      color: colors.warning,
                      borderRadius: borderRadius.full,
                    }}
                  >
                    Warning
                  </span>
                  <span
                    className="px-3 py-1 text-sm font-medium"
                    style={{
                      backgroundColor: `${colors.error}20`,
                      color: colors.error,
                      borderRadius: borderRadius.full,
                    }}
                  >
                    Error
                  </span>
                </div>
              </section>

              {/* Form Section */}
              <section
                className="p-6 md:p-8"
                style={{ backgroundColor: colors.surface }}
              >
                <h2
                  style={{
                    fontFamily: typography.fontFamily.heading,
                    fontSize: typography.sizes.xl,
                    fontWeight: typography.weights.semibold,
                    marginBottom: "1rem",
                  }}
                >
                  Contact Form
                </h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label
                      className="block mb-1"
                      style={{
                        fontSize: typography.sizes.sm,
                        fontWeight: typography.weights.medium,
                      }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full px-4 py-2 outline-none transition-all"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.border}`,
                        borderRadius: borderRadius.md,
                        fontSize: typography.sizes.base,
                        color: colors.text,
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="block mb-1"
                      style={{
                        fontSize: typography.sizes.sm,
                        fontWeight: typography.weights.medium,
                      }}
                    >
                      Message
                    </label>
                    <textarea
                      placeholder="Your message..."
                      rows={3}
                      className="w-full px-4 py-2 outline-none transition-all resize-none"
                      style={{
                        backgroundColor: colors.background,
                        border: `1px solid ${colors.border}`,
                        borderRadius: borderRadius.md,
                        fontSize: typography.sizes.base,
                        color: colors.text,
                      }}
                    />
                  </div>
                  <button
                    className="px-6 py-2 font-medium transition-all hover:opacity-90"
                    style={{
                      backgroundColor: colors.primary,
                      color: "#fff",
                      borderRadius: borderRadius.md,
                      fontSize: typography.sizes.base,
                    }}
                  >
                    Send Message
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Device Info */}
        <div className="mt-4 flex justify-center">
          <div className="text-xs text-muted-foreground flex items-center gap-4">
            <span>
              {device === "mobile" && "iPhone SE (375×667)"}
              {device === "tablet" && "iPad Mini (768×600)"}
              {device === "desktop" && "Desktop (Fluid)"}
              {device === "fullscreen" && "Full Width"}
            </span>
            <span>•</span>
            <span>{isDarkMode ? "Dark Mode" : "Light Mode"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
