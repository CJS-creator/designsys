
import { GeneratedDesignSystem } from "@/types/designSystem";

export class ReactNativeExporter {
    static export(ds: GeneratedDesignSystem): string {
        const theme = {
            colors: { ...ds.colors },
            spacing: { ...ds.spacing },
            borderRadius: { ...ds.borderRadius },
            typography: this.formatTypography(ds.typography),
        };

        return `
import { StyleSheet } from 'react-native';

export const theme = ${JSON.stringify(theme, null, 2)};

export const useTheme = () => theme;

// Utility for creating styles with theme info
export const createStyles = (styleBuilder) => StyleSheet.create(styleBuilder(theme));
        `.trim();
    }

    private static formatTypography(typography: GeneratedDesignSystem['typography']) {
        const result: Record<string, any> = {};

        // Convert web typography to RN styles
        Object.entries(typography.sizes).forEach(([key, value]) => {
            result[key] = {
                fontSize: parseInt(String(value).replace('px', '').replace('rem', '')) * 16, // Rough conversion
                fontFamily: typography.fontFamily.primary
            };
        });

        return result;
    }
}
