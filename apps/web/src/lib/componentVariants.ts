import { GeneratedDesignSystem, ComponentDefinition } from "@/types/designSystem";
import { patternRepository } from "./patterns/repository";
import { buttonPatterns } from "./patterns/definitions/components/buttons";


export async function generateComponentVariants(system: GeneratedDesignSystem): Promise<Record<string, ComponentDefinition>> {
    const { colors, typography, borderRadius, spacing, shadows } = system;

    // Register component patterns
    patternRepository.registerPatterns(buttonPatterns);

    // Try to find a button pattern
    // In a real scenario, we might pass mood tags from the design system input, but 'system' object 
    // doesn't currently store the raw input tags directly, although we could infer or pass them.
    // For now, let's assume we can try to find patterns generally or based on loose matching if possible.
    // However, without input tags, we can't search effectively.
    // TODO: Pass 'input' or 'tags' to this function.
    // For now, we will skip pattern lookup if we don't have tags, OR we can try to infer from system name or properties?
    // Actually, 'ensureCompleteDesignSystem' has access to 'input'. We should pass 'tags' to this function.

    // Let's assume we will pass tags in the future. For now, we use defaults to keep signature simple until we update it.
    // OR we can just use the provided override mechanisms from the caller?

    // Better approach: The caller (ensureCompleteDesignSystem) has already fetched patterns if needed.
    // But for components, there are many types. fetching all might be extensive.
    // Let's keep it simple for Tier 1: Just definitions here.

    // Button Component
    const button: ComponentDefinition = {
        name: "Button",
        description: "Interactive element for triggering actions.",
        properties: {
            variant: ["primary", "secondary", "outline", "ghost", "destructive"],
            size: ["sm", "md", "lg"]
        },
        variants: {
            primary: {
                name: "Primary",
                styles: {
                    default: {
                        background: colors.primary,
                        color: colors.onPrimary,
                        border: "none",
                        borderRadius: borderRadius.md,
                    },
                    hover: {
                        background: colors.interactive.primary.hover,
                    },
                    active: {
                        background: colors.interactive.primary.active,
                    },
                    disabled: {
                        background: colors.interactive.primary.disabled,
                        opacity: "0.5"
                    }
                }
            },
            secondary: {
                name: "Secondary",
                styles: {
                    default: {
                        background: colors.secondary,
                        color: colors.onSecondary,
                        border: "none",
                        borderRadius: borderRadius.md,
                    },
                    hover: {
                        background: colors.interactive.secondary.hover,
                    }
                }
            },
            outline: {
                name: "Outline",
                styles: {
                    default: {
                        background: "transparent",
                        color: colors.primary,
                        border: `1px solid ${colors.primary}`,
                        borderRadius: borderRadius.md,
                    },
                    hover: {
                        background: colors.primaryContainer,
                    }
                }
            }
        }
    };

    // Input Component
    const input: ComponentDefinition = {
        name: "Input",
        description: "Form field for user input.",
        properties: {
            size: ["sm", "md", "lg"],
            state: ["default", "error", "disabled"]
        },
        variants: {
            default: {
                name: "Default",
                styles: {
                    default: {
                        background: colors.surface,
                        color: colors.text,
                        border: `1px solid ${colors.border}`,
                        borderRadius: borderRadius.md,
                        padding: `${spacing.scale["2"]} ${spacing.scale["3"]}`,
                        fontFamily: typography.fontFamily.body,
                    },
                    focus: {
                        border: `2px solid ${colors.primary}`,
                        boxShadow: `0 0 0 2px ${colors.primary}33` // 20% opacity
                    },
                    disabled: {
                        background: colors.background,
                        opacity: "0.5",
                        cursor: "not-allowed"
                    }
                }
            },
            error: {
                name: "Error",
                styles: {
                    default: {
                        background: colors.surface,
                        color: colors.text,
                        border: `1px solid ${colors.error}`,
                        borderRadius: borderRadius.md,
                    },
                    focus: {
                        boxShadow: `0 0 0 2px ${colors.error}33`
                    }
                }
            }
        }
    };

    // Card Component
    const card: ComponentDefinition = {
        name: "Card",
        description: "Container for grouped content.",
        properties: {
            variant: ["default", "bordered", "flat"]
        },
        variants: {
            default: {
                name: "Default",
                styles: {
                    default: {
                        background: colors.surface,
                        borderRadius: borderRadius.lg,
                        boxShadow: shadows.md,
                        color: colors.text,
                        padding: spacing.scale["6"]
                    }
                }
            },
            bordered: {
                name: "Bordered",
                styles: {
                    default: {
                        background: colors.surface,
                        borderRadius: borderRadius.lg,
                        border: `1px solid ${colors.border}`,
                        color: colors.text,
                    }
                }
            }
        }
    };

    return {
        Button: button,
        Input: input,
        Card: card,
    };
}
