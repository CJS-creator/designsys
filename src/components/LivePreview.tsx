import { GeneratedDesignSystem } from "@/types/designSystem";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Eye, ShoppingCart, User, Bell } from "lucide-react";

interface LivePreviewProps {
  designSystem: GeneratedDesignSystem;
}

export const LivePreview = ({ designSystem }: LivePreviewProps) => {
  const { colors, typography, borderRadius, shadows } = designSystem;

  const previewStyles = {
    "--preview-primary": colors.primary,
    "--preview-secondary": colors.secondary,
    "--preview-accent": colors.accent,
    "--preview-background": colors.background,
    "--preview-surface": colors.surface,
    "--preview-text": colors.text,
    "--preview-text-secondary": colors.textSecondary,
    "--preview-success": colors.success,
    "--preview-warning": colors.warning,
    "--preview-error": colors.error,
    "--preview-font-heading": typography.fontFamily.heading,
    "--preview-font-body": typography.fontFamily.body,
    "--preview-radius": borderRadius.md,
    "--preview-radius-lg": borderRadius.lg,
  } as React.CSSProperties;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Live Preview
        </CardTitle>
        <CardDescription>See your design system applied to sample UI elements</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          style={previewStyles}
          className="p-6 rounded-lg space-y-6"
          css-style={`background: ${colors.background}; color: ${colors.text};`}
        >
          {/* Preview Container */}
          <div className="p-6 space-y-6 rounded-xl" style={{ background: colors.background, color: colors.text }}>
            
            {/* Sample Buttons */}
            <div className="space-y-3">
              <h4 style={{ fontFamily: typography.fontFamily.heading }} className="font-semibold">Buttons</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  style={{
                    background: colors.primary,
                    color: "#fff",
                    borderRadius: borderRadius.md,
                    padding: "8px 16px",
                    fontFamily: typography.fontFamily.body,
                    boxShadow: shadows.sm,
                  }}
                >
                  Primary
                </button>
                <button
                  style={{
                    background: colors.secondary,
                    color: "#fff",
                    borderRadius: borderRadius.md,
                    padding: "8px 16px",
                    fontFamily: typography.fontFamily.body,
                  }}
                >
                  Secondary
                </button>
                <button
                  style={{
                    background: "transparent",
                    color: colors.primary,
                    borderRadius: borderRadius.md,
                    padding: "8px 16px",
                    fontFamily: typography.fontFamily.body,
                    border: `2px solid ${colors.primary}`,
                  }}
                >
                  Outline
                </button>
              </div>
            </div>

            {/* Sample Card */}
            <div className="space-y-3">
              <h4 style={{ fontFamily: typography.fontFamily.heading }} className="font-semibold">Card</h4>
              <div
                style={{
                  background: colors.surface,
                  borderRadius: borderRadius.lg,
                  padding: "20px",
                  boxShadow: shadows.md,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    style={{
                      background: colors.accent,
                      borderRadius: borderRadius.full,
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <User className="h-5 w-5" style={{ color: colors.primary }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: typography.fontFamily.heading, fontWeight: 600 }}>John Doe</p>
                    <p style={{ color: colors.textSecondary, fontSize: typography.sizes.sm }}>Product Designer</p>
                  </div>
                </div>
                <p style={{ color: colors.textSecondary, fontFamily: typography.fontFamily.body, fontSize: typography.sizes.sm }}>
                  Creating beautiful design systems with AI-powered tools.
                </p>
              </div>
            </div>

            {/* Sample Form */}
            <div className="space-y-3">
              <h4 style={{ fontFamily: typography.fontFamily.heading }} className="font-semibold">Form</h4>
              <div className="space-y-3">
                <div>
                  <label
                    style={{
                      fontFamily: typography.fontFamily.body,
                      fontSize: typography.sizes.sm,
                      color: colors.textSecondary,
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    style={{
                      background: colors.surface,
                      border: `1px solid ${colors.secondary}`,
                      borderRadius: borderRadius.md,
                      padding: "10px 14px",
                      fontFamily: typography.fontFamily.body,
                      width: "100%",
                      color: colors.text,
                    }}
                  />
                </div>
                <button
                  style={{
                    background: colors.primary,
                    color: "#fff",
                    borderRadius: borderRadius.md,
                    padding: "10px 20px",
                    fontFamily: typography.fontFamily.body,
                    width: "100%",
                    boxShadow: shadows.sm,
                  }}
                >
                  Subscribe
                </button>
              </div>
            </div>

            {/* Sample Badges */}
            <div className="space-y-3">
              <h4 style={{ fontFamily: typography.fontFamily.heading }} className="font-semibold">Badges</h4>
              <div className="flex flex-wrap gap-2">
                <span
                  style={{
                    background: colors.success,
                    color: "#fff",
                    borderRadius: borderRadius.full,
                    padding: "4px 12px",
                    fontSize: typography.sizes.xs,
                    fontFamily: typography.fontFamily.body,
                  }}
                >
                  Success
                </span>
                <span
                  style={{
                    background: colors.warning,
                    color: "#000",
                    borderRadius: borderRadius.full,
                    padding: "4px 12px",
                    fontSize: typography.sizes.xs,
                    fontFamily: typography.fontFamily.body,
                  }}
                >
                  Warning
                </span>
                <span
                  style={{
                    background: colors.error,
                    color: "#fff",
                    borderRadius: borderRadius.full,
                    padding: "4px 12px",
                    fontSize: typography.sizes.xs,
                    fontFamily: typography.fontFamily.body,
                  }}
                >
                  Error
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
