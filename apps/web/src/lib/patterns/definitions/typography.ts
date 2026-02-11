import { Pattern } from "../repository";

const fontLibrary = {
    sans: [
        { name: "Inter", mood: ["modern", "minimalist", "professional", "technology"] },
        { name: "DM Sans", mood: ["friendly", "modern", "creative"] },
        { name: "Outfit", mood: ["modern", "creative", "bold"] },
        { name: "Nunito", mood: ["friendly", "playful", "healthcare"] },
        { name: "Open Sans", mood: ["professional", "neutral", "education"] },
        { name: "Lato", mood: ["professional", "corporate", "fitness"] },
        { name: "Roboto", mood: ["neutral", "technology", "ecommerce"] },
    ],
    serif: [
        { name: "Playfair Display", mood: ["elegant", "luxurious", "fashion"] },
        { name: "Merriweather", mood: ["trust", "professional", "education"] },
        { name: "Lora", mood: ["calm", "elegant", "creative"] },
    ],
    display: [
        { name: "Oswald", mood: ["bold", "fitness", "energetic"] },
        { name: "Montserrat", mood: ["modern", "bold", "food"] },
        { name: "Quicksand", mood: ["friendly", "playful", "modern"] },
        { name: "Josefin Sans", mood: ["elegant", "creative", "travel"] },
        { name: "Raleway", mood: ["minimalist", "elegant", "creative"] },
    ],
    mono: [
        { name: "JetBrains Mono", mood: ["technology"] },
        { name: "Fira Code", mood: ["technology"] },
    ]
};

export const typographyPatterns: Pattern[] = [
    // --- Modern / Sans Pairings ---
    {
        id: "typography-modern-inter",
        category: "typography",
        name: "Modern Inter System",
        data: {
            heading: "Inter",
            body: "Inter",
            moods: ["modern", "minimalist", "professional", "technology"]
        },
        metadata: { source: "google-fonts", version: "1.0.0", lastUpdated: "2024-01-01" }
    },
    {
        id: "typography-friendly-dm-sans",
        category: "typography",
        name: "Friendly DM Sans",
        data: {
            heading: "DM Sans",
            body: "DM Sans",
            moods: ["friendly", "modern", "creative"]
        },
        metadata: { source: "google-fonts", version: "1.0.0", lastUpdated: "2024-01-01" }
    },
    // --- Elegant / Serif Pairings ---
    {
        id: "typography-elegant-playfair",
        category: "typography",
        name: "Elegant Playfair",
        data: {
            heading: "Playfair Display",
            body: "Inter", // Pairing from filtered logic
            moods: ["elegant", "luxurious", "fashion"]
        },
        metadata: { source: "google-fonts", version: "1.0.0", lastUpdated: "2024-01-01" }
    },
    {
        id: "typography-trust-merriweather",
        category: "typography",
        name: "Trustworthy Merriweather",
        data: {
            heading: "Merriweather",
            body: "Open Sans",
            moods: ["trust", "professional", "education"]
        },
        metadata: { source: "google-fonts", version: "1.0.0", lastUpdated: "2024-01-01" }
    },
    // --- Bold / Display Pairings ---
    {
        id: "typography-bold-oswald",
        category: "typography",
        name: "Bold Oswald Impact",
        data: {
            heading: "Oswald",
            body: "Roboto",
            moods: ["bold", "fitness", "energetic"]
        },
        metadata: { source: "google-fonts", version: "1.0.0", lastUpdated: "2024-01-01" }
    },
    {
        id: "typography-creative-montserrat",
        category: "typography",
        name: "Creative Montserrat",
        data: {
            heading: "Montserrat",
            body: "Open Sans",
            moods: ["modern", "bold", "food"]
        },
        metadata: { source: "google-fonts", version: "1.0.0", lastUpdated: "2024-01-01" }
    }
];

// Helper to generate scale (moved from generateDesignSystem)
export function getTypeScaleRatio(moods: string[]): number {
    if (moods.includes("elegant") || moods.includes("luxurious")) return 1.618;
    if (moods.includes("bold") || moods.includes("energetic")) return 1.333;
    if (moods.includes("modern") || moods.includes("playful")) return 1.25;
    if (moods.includes("calm") || moods.includes("professional")) return 1.2;
    return 1.25;
}

export function generateTypeScale(baseSize: number, ratio: number) {
    const round = (val: number) => Math.round(val);
    return {
        xs: `${round(baseSize / ratio)}px`,
        sm: `${round(baseSize / Math.sqrt(ratio))}px`,
        base: `${baseSize}px`,
        lg: `${round(baseSize * ratio)}px`,
        xl: `${round(baseSize * ratio * ratio)}px`,
        "2xl": `${round(baseSize * Math.pow(ratio, 3))}px`,
        "3xl": `${round(baseSize * Math.pow(ratio, 4))}px`,
        "4xl": `${round(baseSize * Math.pow(ratio, 5))}px`,
        "5xl": `${round(baseSize * Math.pow(ratio, 6))}px`,
    };
}
