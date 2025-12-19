import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ColorPalette, DarkModeColors } from "@/types/designSystem";
import { getContrastRatio, getWCAGCompliance, WCAGLevel } from "@/lib/colorUtils";
import { CheckCircle, XCircle, AlertCircle, Eye } from "lucide-react";

interface AccessibilityCheckerProps {
  colors: ColorPalette;
  darkColors?: DarkModeColors;
  isDarkMode?: boolean;
}

interface ContrastCheck {
  name: string;
  foreground: string;
  background: string;
  ratio: number;
  normalText: WCAGLevel;
  largeText: WCAGLevel;
}

function ComplianceBadge({ level, size = "normal" }: { level: WCAGLevel; size?: "normal" | "large" }) {
  const colors: Record<WCAGLevel, string> = {
    AAA: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30",
    AA: "bg-amber-500/20 text-amber-600 border-amber-500/30",
    Fail: "bg-red-500/20 text-red-600 border-red-500/30"
  };

  const icons: Record<WCAGLevel, React.ReactNode> = {
    AAA: <CheckCircle className="h-3 w-3" />,
    AA: <AlertCircle className="h-3 w-3" />,
    Fail: <XCircle className="h-3 w-3" />
  };

  return (
    <Badge variant="outline" className={`${colors[level]} gap-1 text-xs`}>
      {icons[level]}
      {level} {size === "large" ? "(lg)" : "(sm)"}
    </Badge>
  );
}

export function AccessibilityChecker({ colors, darkColors, isDarkMode = false }: AccessibilityCheckerProps) {
  const activeColors = isDarkMode && darkColors ? darkColors : colors;

  const checks: ContrastCheck[] = [
    {
      name: "Primary on Background",
      foreground: activeColors.primary,
      background: activeColors.background,
      ratio: 0,
      normalText: "Fail",
      largeText: "Fail"
    },
    {
      name: "Text on Background",
      foreground: activeColors.text,
      background: activeColors.background,
      ratio: 0,
      normalText: "Fail",
      largeText: "Fail"
    },
    {
      name: "Text Secondary on Background",
      foreground: activeColors.textSecondary,
      background: activeColors.background,
      ratio: 0,
      normalText: "Fail",
      largeText: "Fail"
    },
    {
      name: "Text on Surface",
      foreground: activeColors.text,
      background: activeColors.surface,
      ratio: 0,
      normalText: "Fail",
      largeText: "Fail"
    },
    {
      name: "Primary on Surface",
      foreground: activeColors.primary,
      background: activeColors.surface,
      ratio: 0,
      normalText: "Fail",
      largeText: "Fail"
    },
    {
      name: "Secondary on Background",
      foreground: activeColors.secondary,
      background: activeColors.background,
      ratio: 0,
      normalText: "Fail",
      largeText: "Fail"
    },
    {
      name: "Accent on Background",
      foreground: activeColors.accent,
      background: activeColors.background,
      ratio: 0,
      normalText: "Fail",
      largeText: "Fail"
    },
    {
      name: "Success on Background",
      foreground: activeColors.success,
      background: activeColors.background,
      ratio: 0,
      normalText: "Fail",
      largeText: "Fail"
    },
    {
      name: "Warning on Background",
      foreground: activeColors.warning,
      background: activeColors.background,
      ratio: 0,
      normalText: "Fail",
      largeText: "Fail"
    },
    {
      name: "Error on Background",
      foreground: activeColors.error,
      background: activeColors.background,
      ratio: 0,
      normalText: "Fail",
      largeText: "Fail"
    }
  ].map(check => {
    const ratio = getContrastRatio(check.foreground, check.background);
    return {
      ...check,
      ratio,
      normalText: getWCAGCompliance(ratio, "normal"),
      largeText: getWCAGCompliance(ratio, "large")
    };
  });

  const passCount = checks.filter(c => c.normalText !== "Fail").length;
  const aaaCount = checks.filter(c => c.normalText === "AAA").length;
  const overallScore = Math.round((passCount / checks.length) * 100);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Accessibility Checker
            </CardTitle>
            <CardDescription>WCAG 2.1 color contrast validation</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{overallScore}%</div>
            <div className="text-xs text-muted-foreground">
              {passCount}/{checks.length} pass • {aaaCount} AAA
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {checks.map((check, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20"
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div
                    className="w-6 h-6 rounded border border-border"
                    style={{ background: check.foreground }}
                    title={`Foreground: ${check.foreground}`}
                  />
                  <div
                    className="w-6 h-6 rounded border border-border"
                    style={{ background: check.background }}
                    title={`Background: ${check.background}`}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{check.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Ratio: {check.ratio.toFixed(2)}:1
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <ComplianceBadge level={check.normalText} size="normal" />
                <ComplianceBadge level={check.largeText} size="large" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/50">
          <h4 className="font-medium text-sm mb-2">WCAG 2.1 Guidelines</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• <strong>AAA (Enhanced):</strong> 7:1 for normal text, 4.5:1 for large text</li>
            <li>• <strong>AA (Minimum):</strong> 4.5:1 for normal text, 3:1 for large text</li>
            <li>• Large text is defined as 18pt+ or 14pt+ bold</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
