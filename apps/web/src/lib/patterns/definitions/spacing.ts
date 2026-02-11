import { Pattern } from "../repository";

// Helper to generate a scale
function generateSpacingScale(unit: number): Record<string, string> {
    return {
        "0": "0px",
        "1": `${unit}px`,
        "2": `${unit * 2}px`,
        "3": `${unit * 3}px`,
        "4": `${unit * 4}px`,
        "5": `${unit * 5}px`,
        "6": `${unit * 6}px`,
        "8": `${unit * 8}px`,
        "10": `${unit * 10}px`,
        "12": `${unit * 12}px`,
        "16": `${unit * 16}px`,
        "20": `${unit * 20}px`,
        "24": `${unit * 24}px`,
    };
}

export const spacingPatterns: Pattern[] = [
    {
        id: "spacing-standard-4",
        category: "spacing",
        name: "Standard 4px Grid",
        data: {
            tags: ["standard", "modern", "professional", "tech", "finance"],
            unit: 4,
            scale: generateSpacingScale(4),
        },
        metadata: {
            source: "system",
            version: "1.0.0",
            lastUpdated: new Date().toISOString()
        }
    },
    {
        id: "spacing-compact-2",
        category: "spacing",
        name: "Compact 2px Grid",
        data: {
            tags: ["dense", "dashboard", "data-heavy"],
            unit: 2,
            scale: generateSpacingScale(2),
        },
        metadata: {
            source: "system",
            version: "1.0.0",
            lastUpdated: new Date().toISOString()
        }
    },
    {
        id: "spacing-relaxed-6",
        category: "spacing",
        name: "Relaxed 6px Grid",
        data: {
            tags: ["calm", "elegant", "luxury", "marketing"],
            unit: 6,
            scale: generateSpacingScale(6),
        },
        metadata: {
            source: "system",
            version: "1.0.0",
            lastUpdated: new Date().toISOString()
        }
    }
];
