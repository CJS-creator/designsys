import { useState } from "react";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye, User, Bell, ShoppingCart, Menu, Search, X, ChevronDown } from "lucide-react";

interface LivePreviewProps {
  designSystem: GeneratedDesignSystem;
}

export const LivePreview = ({ designSystem }: LivePreviewProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { typography, borderRadius, shadows, animations } = designSystem;
  const colors = isDarkMode && designSystem.darkColors ? designSystem.darkColors : designSystem.colors;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Live Preview
            </CardTitle>
            <CardDescription>See your design system applied to UI components</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="dark-mode" className="text-sm">Dark Mode</Label>
            <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={setIsDarkMode} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl overflow-hidden border border-border" style={{ background: colors.background, color: colors.text }}>
          
          {/* Navigation Bar */}
          <nav className="flex items-center justify-between p-4" style={{ background: colors.surface, borderBottom: `1px solid ${colors.border}` }}>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg" style={{ background: colors.primary }} />
              <span style={{ fontFamily: typography.fontFamily.heading, fontWeight: 600 }}>AppName</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              {["Home", "Products", "About", "Contact"].map((item) => (
                <span key={item} className="cursor-pointer text-sm" style={{ color: colors.textSecondary, transition: animations.transitions.colors }}>
                  {item}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5" style={{ color: colors.textSecondary }} />
              <Bell className="h-5 w-5" style={{ color: colors.textSecondary }} />
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: colors.primary }}>
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </nav>

          <div className="p-6 space-y-6">
            {/* Buttons */}
            <div className="space-y-3">
              <h4 style={{ fontFamily: typography.fontFamily.heading }} className="font-semibold">Buttons</h4>
              <div className="flex flex-wrap gap-2">
                <button style={{ background: colors.primary, color: "#fff", borderRadius: borderRadius.md, padding: "8px 16px", fontFamily: typography.fontFamily.body, boxShadow: shadows.sm, transition: animations.transitions.all }}>
                  Primary
                </button>
                <button style={{ background: colors.secondary, color: "#fff", borderRadius: borderRadius.md, padding: "8px 16px", fontFamily: typography.fontFamily.body }}>
                  Secondary
                </button>
                <button style={{ background: "transparent", color: colors.primary, borderRadius: borderRadius.md, padding: "8px 16px", fontFamily: typography.fontFamily.body, border: `2px solid ${colors.primary}` }}>
                  Outline
                </button>
                <button style={{ background: colors.interactive?.primary?.disabled || colors.textSecondary, color: colors.textSecondary, borderRadius: borderRadius.md, padding: "8px 16px", fontFamily: typography.fontFamily.body, cursor: "not-allowed" }} disabled>
                  Disabled
                </button>
              </div>
            </div>

            {/* Data Table */}
            <div className="space-y-3">
              <h4 style={{ fontFamily: typography.fontFamily.heading }} className="font-semibold">Data Table</h4>
              <div style={{ background: colors.surface, borderRadius: borderRadius.lg, overflow: "hidden", border: `1px solid ${colors.border}` }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: colors.background, borderBottom: `1px solid ${colors.border}` }}>
                      {["Name", "Status", "Role", "Actions"].map((h) => (
                        <th key={h} className="text-left p-3 font-medium" style={{ color: colors.textSecondary }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Alice Johnson", status: "Active", role: "Admin" },
                      { name: "Bob Smith", status: "Pending", role: "User" },
                      { name: "Carol White", status: "Inactive", role: "Editor" },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${colors.borderLight}` }}>
                        <td className="p-3" style={{ fontFamily: typography.fontFamily.body }}>{row.name}</td>
                        <td className="p-3">
                          <span style={{ background: row.status === "Active" ? colors.success : row.status === "Pending" ? colors.warning : colors.error, color: "#fff", padding: "2px 8px", borderRadius: borderRadius.full, fontSize: typography.sizes.xs }}>
                            {row.status}
                          </span>
                        </td>
                        <td className="p-3" style={{ color: colors.textSecondary }}>{row.role}</td>
                        <td className="p-3">
                          <button style={{ color: colors.primary, fontSize: typography.sizes.sm }}>Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="space-y-3">
              <h4 style={{ fontFamily: typography.fontFamily.heading }} className="font-semibold">Cards</h4>
              <div className="grid md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ background: colors.surface, borderRadius: borderRadius.lg, padding: "16px", boxShadow: shadows.md, border: `1px solid ${colors.borderLight}` }}>
                    <div className="h-24 mb-3 rounded-md" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})` }} />
                    <h5 style={{ fontFamily: typography.fontFamily.heading, fontWeight: 600, marginBottom: "4px" }}>Card Title {i}</h5>
                    <p style={{ color: colors.textSecondary, fontSize: typography.sizes.sm }}>Description text goes here.</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="space-y-3">
              <h4 style={{ fontFamily: typography.fontFamily.heading }} className="font-semibold">Form</h4>
              <div className="max-w-md space-y-3">
                <input type="email" placeholder="Email" style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: borderRadius.md, padding: "10px 14px", fontFamily: typography.fontFamily.body, width: "100%", color: colors.text }} />
                <button style={{ background: colors.primary, color: "#fff", borderRadius: borderRadius.md, padding: "10px 20px", fontFamily: typography.fontFamily.body, width: "100%", boxShadow: shadows.sm }}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
