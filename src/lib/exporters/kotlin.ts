import { GeneratedDesignSystem } from "@/types/designSystem";

export function exportToKotlin(ds: GeneratedDesignSystem): string {
    const parseToKotlinColor = (hex: string) => {
        return "Color(0xFF" + hex.replace("#", "").toUpperCase() + ")";
    };

    return `package com.designforge.generated

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.Font

object DesignTokens {
    object Colors {
        val Primary = ${parseToKotlinColor(ds.colors.primary)}
        val Secondary = ${parseToKotlinColor(ds.colors.secondary)}
        val Accent = ${parseToKotlinColor(ds.colors.accent)}
        val Background = ${parseToKotlinColor(ds.colors.background)}
        val Surface = ${parseToKotlinColor(ds.colors.surface)}
        val Text = ${parseToKotlinColor(ds.colors.text)}
        
        val Success = ${parseToKotlinColor(ds.colors.success)}
        val Warning = ${parseToKotlinColor(ds.colors.warning)}
        val Error = ${parseToKotlinColor(ds.colors.error)}
    }

    object Spacing {
        val Unit = ${ds.spacing.unit}.dp
        ${Object.entries(ds.spacing.scale).map(([key, val]) => `val ${key.charAt(0).toUpperCase() + key.slice(1)} = ${parseFloat(val as string)}.dp`).join("\n        ")}
    }

    object Radius {
        ${Object.entries(ds.borderRadius).map(([key, val]) => `val ${key.charAt(0).toUpperCase() + key.slice(1)} = ${parseFloat(val)}.dp`).join("\n        ")}
    }

    object Typography {
        val HeadingSize = ${parseFloat(ds.typography.sizes.xl)}.sp
        val BodySize = ${parseFloat(ds.typography.sizes.base)}.sp
    }
}
`;
}
