import { GeneratedDesignSystem, ComponentDefinition } from "@/types/designSystem";

export function generateComponentVariants(system: GeneratedDesignSystem): Record<string, ComponentDefinition> {
    const { colors, typography, borderRadius, spacing, shadows } = system;

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
