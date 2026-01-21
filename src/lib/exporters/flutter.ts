import { GeneratedDesignSystem } from "@/types/designSystem";

export function exportToFlutter(ds: GeneratedDesignSystem): string {
  const parseToFlutterColor = (hex: string) => {
    return "Color(0xFF" + hex.replace("#", "").toUpperCase() + ")";
  };

  return `import 'package:flutter/material.dart';

class AppTheme {
  static const Color primary = ${parseToFlutterColor(ds.colors.primary)};
  static const Color secondary = ${parseToFlutterColor(ds.colors.secondary)};
  static const Color accent = ${parseToFlutterColor(ds.colors.accent)};
  static const Color background = ${parseToFlutterColor(ds.colors.background)};
  static const Color surface = ${parseToFlutterColor(ds.colors.surface)};
  static const Color text = ${parseToFlutterColor(ds.colors.text)};
  static const Color textSecondary = ${parseToFlutterColor(ds.colors.textSecondary)};
  
  static const Color success = ${parseToFlutterColor(ds.colors.success)};
  static const Color warning = ${parseToFlutterColor(ds.colors.warning)};
  static const Color error = ${parseToFlutterColor(ds.colors.error)};

  static double borderRadiusMd = ${parseFloat(ds.borderRadius.md)};
  static double spacingUnit = ${ds.spacing.unit};

  static TextStyle get headingStyle => TextStyle(
    fontFamily: '${ds.typography.fontFamily.heading}',
    fontSize: ${parseFloat(ds.typography.sizes.xl)},
    fontWeight: FontWeight.bold,
  );

  static TextStyle get bodyStyle => TextStyle(
    fontFamily: '${ds.typography.fontFamily.body}',
    fontSize: ${parseFloat(ds.typography.sizes.base)},
  );
}
`;
}
