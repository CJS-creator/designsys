import { Pattern } from "../repository";

// Extended Mood Mapping (for primary color selection)
// Moved from generateDesignSystem.ts to be a shared pattern resource
export const moodColorMappings: Record<string, { hue: number; saturation: number }> = {
    modern: { hue: 220, saturation: 85 },
    playful: { hue: 340, saturation: 80 },
    professional: { hue: 215, saturation: 60 },
    elegant: { hue: 280, saturation: 30 },
    minimalist: { hue: 0, saturation: 0 },
    bold: { hue: 10, saturation: 90 },
    calm: { hue: 190, saturation: 40 },
    energetic: { hue: 35, saturation: 95 },
    luxurious: { hue: 45, saturation: 70 },
    friendly: { hue: 150, saturation: 60 },
    trust: { hue: 210, saturation: 65 },
    creative: { hue: 260, saturation: 75 },
};

// Define standard Color Patterns
export const colorPatterns: Pattern[] = [
    {
        id: "colors-modern-blue",
        category: "colors",
        name: "Modern Blue Palette",
        data: {
            tags: ["modern", "tech", "professional"],
            primary: { hue: 220, saturation: 85, lightness: 50 },
            // We can define semantic roles or full palettes here
            // For Tier 1, we might just define the primary anchor and let the Harmony Engine (helper) generate the rest
            // Or we can define full overrides.
            // Let's define primary attributes for now to guide the generator.
        },
        metadata: {
            source: "system",
            version: "1.0.0",
            lastUpdated: new Date().toISOString()
        }
    },
    {
        id: "colors-forest-calm",
        category: "colors",
        name: "Forest Calm Palette",
        data: {
            tags: ["calm", "nature", "health"],
            primary: { hue: 150, saturation: 40, lightness: 45 }
        },
        metadata: {
            source: "system",
            version: "1.0.0",
            lastUpdated: new Date().toISOString()
        }
    },
    {
        id: "colors-energetic-orange",
        category: "colors",
        name: "Energetic Orange",
        data: {
            tags: ["energetic", "bold", "fitness"],
            primary: { hue: 25, saturation: 90, lightness: 55 }
        },
        metadata: {
            source: "system",
            version: "1.0.0",
            lastUpdated: new Date().toISOString()
        }
    },
    {
        id: "colors-elegant-purple",
        category: "colors",
        name: "Elegant Purple",
        data: {
            tags: ["elegant", "luxury"],
            primary: { hue: 270, saturation: 50, lightness: 40 }
        },
        metadata: {
            source: "system",
            version: "1.0.0",
            lastUpdated: new Date().toISOString()
        }
    }
];

// Helper to find a pattern-based color (simulating a smart lookup)
export function getPatternColor(moods: string[]): { hue: number, saturation: number } | null {
    // 1. Try to find a direct pattern match for the mood
    // In a real system, we'd query the repo. Here we just query the static list for a 'primary' definition
    // accessible via the pattern data.

    // For now, we reuse the existing moodColorMappings as a fallback or "Pattern definition"
    // The moodColorMappings IS effectively a pattern map.

    for (const mood of moods) {
        if (moodColorMappings[mood]) {
            return moodColorMappings[mood];
        }
    }
    return null;
}
