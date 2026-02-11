import { Pattern } from "../../repository";

export const buttonPatterns: Pattern[] = [
    {
        id: "button-modern-rounded",
        category: "components-button",
        name: "Modern Rounded Button",
        data: {
            tags: ["modern", "rounded", "friendly"],
            variants: {
                primary: {
                    borderRadius: "md", // Refers to system token
                    styles: {
                        default: { border: "none" },
                        hover: { opacity: "0.9" }
                    }
                }
            }
        },
        metadata: {
            source: "system",
            version: "1.0.0",
            lastUpdated: new Date().toISOString()
        }
    },
    {
        id: "button-sharp-brutalist",
        category: "components-button",
        name: "Sharp Brutalist Button",
        data: {
            tags: ["brutalist", "sharp", "bold"],
            variants: {
                primary: {
                    borderRadius: "none",
                    styles: {
                        default: { border: "2px solid black", boxShadow: "4px 4px 0px black" },
                        hover: { transform: "translate(-2px, -2px)", boxShadow: "6px 6px 0px black" },
                        active: { transform: "translate(0, 0)", boxShadow: "0px 0px 0px black" }
                    }
                }
            }
        },
        metadata: {
            source: "system",
            version: "1.0.0",
            lastUpdated: new Date().toISOString()
        }
    }
];
