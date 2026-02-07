/**
 * Design System - Spacing Tokens
 * 
 * Comprehensive spacing system with:
 * - Base spacing scale
 * - Fluid spacing using clamp()
 * - Semantic spacing tokens
 * - Component-specific spacing
 * - Responsive multipliers
 */

// Base spacing scale (in rem, assuming 16px base)
export const spacing = {
    0: '0',
    px: '1px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
} as const;

export type SpacingToken = keyof typeof spacing;

// Fluid spacing using clamp() for responsive design
export const fluidSpacing = {
    xs: 'clamp(0.25rem, 1vw, 0.5rem)',
    sm: 'clamp(0.5rem, 1.5vw, 0.75rem)',
    md: 'clamp(0.75rem, 2vw, 1rem)',
    lg: 'clamp(1rem, 2.5vw, 1.5rem)',
    xl: 'clamp(1.5rem, 3vw, 2rem)',
    '2xl': 'clamp(2rem, 4vw, 2.5rem)',
    '3xl': 'clamp(2.5rem, 5vw, 3rem)',
    '4xl': 'clamp(3rem, 6vw, 4rem)',
} as const;

// Semantic spacing tokens for consistent layouts
export const semanticSpacing = {
    // Container spacing
    containerPadding: '1.5rem',
    containerPaddingSm: '1rem',
    containerPaddingLg: '2rem',
    containerPaddingXl: '3rem',
    containerMaxWidth: '1280px',
    containerMaxWidthSm: '640px',
    containerMaxWidthMd: '768px',
    containerMaxWidthLg: '1024px',
    containerMaxWidthXl: '1280px',
    containerMaxWidth2xl: '1536px',

    // Section spacing
    sectionPaddingY: '4rem',
    sectionPaddingYSnug: '2rem',
    sectionPaddingYRelaxed: '6rem',
    sectionPaddingYLoose: '8rem',

    // Component spacing
    componentGap: '1rem',
    componentGapSm: '0.5rem',
    componentGapMd: '1rem',
    componentGapLg: '1.5rem',
    componentGapXl: '2rem',

    // Layout spacing
    layoutGridGap: '1.5rem',
    layoutGridGapSm: '1rem',
    layoutGridGapLg: '2rem',
    layoutStackGap: '1rem',
    layoutStackGapSm: '0.5rem',
    layoutStackGapLg: '1.5rem',
    layoutStackGapXl: '2rem',

    // Inline spacing
    inlineGap: '0.5rem',
    inlineGapMd: '1rem',
    inlineGapLg: '1.5rem',

    // Text spacing
    textLineHeight: '1.5',
    textParagraphGap: '1em',
    textWordGap: '0.25em',
    textLetterSpacing: '0',

    // Form spacing
    formFieldGap: '0.5rem',
    formFieldGapLg: '1rem',
    formLabelGap: '0.25rem',
    formInputPaddingX: '0.75rem',
    formInputPaddingY: '0.5rem',
    formInputPadding: '0.5rem 0.75rem',
    formInputHeight: '2.5rem',
    formInputHeightSm: '2rem',
    formInputHeightLg: '3rem',

    // Button spacing
    buttonPaddingX: '1rem',
    buttonPaddingY: '0.5rem',
    buttonPadding: '0.5rem 1rem',
    buttonPaddingSm: '0.25rem 0.75rem',
    buttonPaddingLg: '0.75rem 1.5rem',
    buttonIconGap: '0.5rem',
    buttonHeight: '2.5rem',
    buttonHeightSm: '2rem',
    buttonHeightLg: '3rem',

    // Card spacing
    cardPadding: '1.5rem',
    cardPaddingSm: '1rem',
    cardPaddingLg: '2rem',
    cardHeaderGap: '1rem',
    cardFooterGap: '1rem',
    cardFooterPadding: '1rem 1.5rem',

    // Modal spacing
    modalPadding: '1.5rem',
    modalPaddingSm: '1rem',
    modalPaddingLg: '2rem',
    modalHeaderPadding: '1.5rem',
    modalBodyPadding: '1.5rem',
    modalFooterPadding: '1rem 1.5rem',
    modalGap: '1.5rem',
    modalMaxWidth: '500px',
    modalMaxWidthSm: '400px',
    modalMaxWidthLg: '600px',
    modalMaxWidthXl: '800px',

    // Menu/Dropdown spacing
    menuPadding: '0.5rem',
    menuPaddingSm: '0.25rem',
    menuPaddingLg: '0.75rem',
    menuItemGap: '0.25rem',
    menuItemPadding: '0.5rem 1rem',
    menuItemPaddingSm: '0.375rem 0.75rem',
    menuItemPaddingLg: '0.75rem 1.25rem',
    menuWidth: '200px',
    menuWidthSm: '160px',
    menuWidthLg: '240px',

    // Table spacing
    tablePadding: '0.75rem 1rem',
    tablePaddingSm: '0.5rem 0.75rem',
    tablePaddingLg: '1rem 1.25rem',
    tableCellGap: '0.5rem',
    tableHeaderGap: '0.5rem',
    tableRowGap: '0.25rem',

    // Tooltip spacing
    tooltipPadding: '0.5rem 0.75rem',
    tooltipPaddingSm: '0.25rem 0.5rem',
    tooltipPaddingLg: '0.75rem 1rem',
    tooltipGap: '0.25rem',
    tooltipMaxWidth: '200px',
    tooltipMaxWidthSm: '150px',
    tooltipMaxWidthLg: '250px',

    // Badge/Tag spacing
    badgePaddingX: '0.5rem',
    badgePaddingY: '0.125rem',
    badgePadding: '0.125rem 0.5rem',
    badgePaddingSm: '0.0625rem 0.375rem',
    badgePaddingLg: '0.25rem 0.75rem',

    // Avatar spacing
    avatarSize: '2.5rem',
    avatarSizeSm: '2rem',
    avatarSizeLg: '3rem',
    avatarSizeXl: '4rem',
    avatarSize2xl: '5rem',
    avatarGap: '0.5rem',

    // Divider spacing
    dividerMarginY: '1rem',
    dividerMarginYSm: '0.5rem',
    dividerMarginYLg: '1.5rem',

    // List spacing
    listItemPadding: '0.5rem 1rem',
    listItemPaddingSm: '0.375rem 0.75rem',
    listItemPaddingLg: '0.75rem 1.25rem',
    listGap: '0.25rem',
    listGapSm: '0.125rem',
    listGapLg: '0.5rem',

    // Navigation spacing
    navPadding: '0.5rem 1rem',
    navPaddingSm: '0.375rem 0.75rem',
    navPaddingLg: '0.75rem 1.5rem',
    navItemGap: '0.25rem',
    navItemPadding: '0.5rem 0.75rem',
    navHeight: '4rem',
    navHeightSm: '3.5rem',
    navHeightLg: '4.5rem',

    // Sidebar spacing
    sidebarPadding: '1rem',
    sidebarPaddingSm: '0.75rem',
    sidebarPaddingLg: '1.5rem',
    sidebarWidth: '250px',
    sidebarWidthSm: '200px',
    sidebarWidthLg: '300px',
    sidebarWidthXl: '350px',
    sidebarCollapsedWidth: '64px',

    // Overlay spacing
    overlayPadding: '1rem',
    overlayPaddingSm: '0.75rem',
    overlayPaddingLg: '1.5rem',

    // Loading spinner spacing
    spinnerSize: '1.5rem',
    spinnerSizeSm: '1rem',
    spinnerSizeLg: '2rem',
    spinnerSizeXl: '3rem',

    // Icon spacing
    iconSize: '1.25rem',
    iconSizeSm: '1rem',
    iconSizeLg: '1.5rem',
    iconSizeXl: '2rem',
    iconSize2xl: '2.5rem',
    iconGap: '0.5rem',
    iconGapSm: '0.25rem',
    iconGapLg: '0.75rem',
} as const;

export type SemanticSpacingToken = keyof typeof semanticSpacing;

// Component-specific spacing configurations
export const componentSpacing = {
    accordion: {
        itemPadding: '0.75rem 0',
        triggerPadding: '1rem',
        contentPadding: '1rem 1.25rem',
        iconGap: '0.75rem',
    },
    alert: {
        padding: '1rem',
        paddingSm: '0.75rem',
        paddingLg: '1.25rem',
        gap: '0.75rem',
        iconGap: '0.5rem',
        titleGap: '0.25rem',
        contentGap: '0',
    },
    avatar: {
        sizes: {
            xs: '1.5rem',
            sm: '2rem',
            md: '2.5rem',
            lg: '3rem',
            xl: '4rem',
            '2xl': '5rem',
        },
        gap: '0.5rem',
        badgeGap: '0.25rem',
    },
    badge: {
        padding: '0.125rem 0.5rem',
        paddingSm: '0.0625rem 0.375rem',
        paddingLg: '0.25rem 0.75rem',
        gap: '0.25rem',
        radius: '9999px',
    },
    breadcrumb: {
        gap: '0.5rem',
        separatorGap: '0.5rem',
        itemPadding: '0.25rem 0.5rem',
        itemPaddingSm: '0.125rem 0.375rem',
    },
    button: {
        paddingX: '1rem',
        paddingY: '0.5rem',
        paddingSm: '0.25rem 0.75rem',
        paddingLg: '0.75rem 1.5rem',
        gap: '0.5rem',
        gapSm: '0.25rem',
        gapLg: '0.75rem',
        height: '2.5rem',
        heightSm: '2rem',
        heightLg: '3rem',
    },
    card: {
        padding: '1.5rem',
        paddingSm: '1rem',
        paddingLg: '2rem',
        headerGap: '1rem',
        footerGap: '1rem',
        titleGap: '0.5rem',
        descriptionGap: '0.75rem',
        contentGap: '1rem',
    },
    checkbox: {
        size: '1.25rem',
        sizeSm: '1rem',
        sizeLg: '1.5rem',
        gap: '0.5rem',
        gapSm: '0.375rem',
        gapLg: '0.75rem',
        labelGap: '0.375rem',
    },
    dialog: {
        padding: '1.5rem',
        paddingSm: '1rem',
        paddingLg: '2rem',
        gap: '1.5rem',
        headerGap: '1rem',
        bodyGap: '1.5rem',
        footerGap: '1rem',
        footerPadding: '1rem 1.5rem',
        titleGap: '0.5rem',
        descriptionGap: '0.75rem',
    },
    dropdown: {
        padding: '0.5rem',
        paddingSm: '0.25rem',
        paddingLg: '0.75rem',
        itemGap: '0.25rem',
        itemPadding: '0.5rem 1rem',
        itemPaddingSm: '0.375rem 0.75rem',
        itemPaddingLg: '0.75rem 1.25rem',
        separatorMargin: '0.5rem',
        width: '200px',
        widthSm: '160px',
        widthLg: '240px',
    },
    form: {
        labelGap: '0.25rem',
        descriptionGap: '0.25rem',
        errorGap: '0.25rem',
        fieldGap: '0.75rem',
        inputPadding: '0.5rem 0.75rem',
        inputPaddingSm: '0.375rem 0.625rem',
        inputPaddingLg: '0.75rem 1rem',
        inputHeight: '2.5rem',
        inputHeightSm: '2rem',
        inputHeightLg: '3rem',
        helperGap: '0.25rem',
    },
    input: {
        padding: '0.5rem 0.75rem',
        paddingSm: '0.375rem 0.625rem',
        paddingLg: '0.75rem 1rem',
        height: '2.5rem',
        heightSm: '2rem',
        heightLg: '3rem',
        gap: '0.5rem',
        addonGap: '0.75rem',
    },
    menu: {
        padding: '0.5rem',
        paddingSm: '0.25rem',
        paddingLg: '0.75rem',
        itemGap: '0.25rem',
        itemPadding: '0.5rem 1rem',
        itemPaddingSm: '0.375rem 0.75rem',
        itemPaddingLg: '0.75rem 1.25rem',
        separatorMargin: '0.5rem',
        iconGap: '0.75rem',
        shortcutGap: '1rem',
    },
    modal: {
        padding: '1.5rem',
        paddingSm: '1rem',
        paddingLg: '2rem',
        gap: '1.5rem',
        headerGap: '1rem',
        bodyGap: '1.5rem',
        footerGap: '1rem',
        width: '500px',
        widthSm: '400px',
        widthLg: '600px',
        widthXl: '800px',
    },
    navigation: {
        padding: '0.5rem 1rem',
        paddingSm: '0.375rem 0.75rem',
        paddingLg: '0.75rem 1.5rem',
        itemGap: '0.25rem',
        itemPadding: '0.5rem 0.75rem',
        height: '4rem',
        heightSm: '3.5rem',
        heightLg: '4.5rem',
        logoGap: '1rem',
        collapseGap: '1rem',
    },
    pagination: {
        gap: '0.25rem',
        itemPadding: '0.375rem 0.75rem',
        itemPaddingSm: '0.25rem 0.5rem',
        itemPaddingLg: '0.5rem 1rem',
        prevNextGap: '0.5rem',
        infoGap: '0.75rem',
    },
    popover: {
        padding: '0.75rem 1rem',
        paddingSm: '0.5rem 0.75rem',
        paddingLg: '1rem 1.25rem',
        gap: '0.5rem',
        titleGap: '0.25rem',
        contentGap: '0',
        width: '250px',
        widthSm: '200px',
        widthLg: '300px',
    },
    progress: {
        height: '0.5rem',
        heightSm: '0.25rem',
        heightLg: '0.75rem',
        radius: '9999px',
        labelGap: '0.5rem',
    },
    radio: {
        size: '1.25rem',
        sizeSm: '1rem',
        sizeLg: '1.5rem',
        gap: '0.5rem',
        gapSm: '0.375rem',
        gapLg: '0.75rem',
        labelGap: '0.375rem',
    },
    select: {
        padding: '0.5rem 2rem 0.5rem 0.75rem',
        paddingSm: '0.375rem 1.75rem 0.375rem 0.625rem',
        paddingLg: '0.75rem 2.25rem 0.75rem 1rem',
        gap: '0.5rem',
        height: '2.5rem',
        heightSm: '2rem',
        heightLg: '3rem',
        triggerGap: '0.5rem',
    },
    separator: {
        margin: '1rem',
        marginSm: '0.5rem',
        marginLg: '1.5rem',
    },
    skeleton: {
        height: '1rem',
        heightSm: '0.75rem',
        heightLg: '1.25rem',
        radius: '0.25rem',
        gap: '0.5rem',
    },
    slider: {
        height: '0.5rem',
        heightSm: '0.25rem',
        heightLg: '0.75rem',
        thumbSize: '1rem',
        thumbSizeSm: '0.75rem',
        thumbSizeLg: '1.25rem',
        trackGap: '0.5rem',
        valueGap: '0.5rem',
    },
    switch: {
        width: '2.5rem',
        widthSm: '2rem',
        widthLg: '3rem',
        height: '1.25rem',
        heightSm: '1rem',
        heightLg: '1.5rem',
        thumbSize: '1rem',
        thumbSizeSm: '0.75rem',
        thumbSizeLg: '1.25rem',
        gap: '0.5rem',
        gapSm: '0.375rem',
        gapLg: '0.75rem',
    },
    table: {
        padding: '0.75rem 1rem',
        paddingSm: '0.5rem 0.75rem',
        paddingLg: '1rem 1.25rem',
        cellGap: '0.5rem',
        headerGap: '0.5rem',
        rowGap: '0.25rem',
        borderSpacing: '0',
    },
    tabs: {
        gap: '0.25rem',
        itemPadding: '0.5rem 1rem',
        itemPaddingSm: '0.375rem 0.75rem',
        itemPaddingLg: '0.75rem 1.25rem',
        contentPadding: '1rem',
        contentPaddingSm: '0.75rem',
        contentPaddingLg: '1.25rem',
        listGap: '0.5rem',
        listGapSm: '0.25rem',
        listGapLg: '0.75rem',
    },
    textarea: {
        padding: '0.5rem 0.75rem',
        paddingSm: '0.375rem 0.625rem',
        paddingLg: '0.75rem 1rem',
        minHeight: '5rem',
        minHeightSm: '4rem',
        minHeightLg: '6rem',
        height: 'auto',
        gap: '0.5rem',
    },
    toast: {
        padding: '1rem',
        paddingSm: '0.75rem',
        paddingLg: '1.25rem',
        gap: '0.75rem',
        iconGap: '0.5rem',
        titleGap: '0.25rem',
        contentGap: '0',
        actionGap: '0.5rem',
        width: '350px',
        widthSm: '300px',
        widthLg: '400px',
    },
    toggle: {
        padding: '0.25rem',
        paddingSm: '0.125rem',
        paddingLg: '0.375rem',
        gap: '0.5rem',
        gapSm: '0.375rem',
        gapLg: '0.75rem',
        height: '1.5rem',
        heightSm: '1.25rem',
        heightLg: '1.75rem',
    },
    tooltip: {
        padding: '0.5rem 0.75rem',
        paddingSm: '0.25rem 0.5rem',
        paddingLg: '0.75rem 1rem',
        gap: '0.25rem',
        arrowSize: '0.5rem',
        width: '200px',
        widthSm: '150px',
        widthLg: '250px',
    },
} as const;

export type ComponentSpacingToken = keyof typeof componentSpacing;

// Responsive spacing multipliers
export const responsiveSpacingMultipliers = {
    mobile: 0.875,
    tablet: 1,
    desktop: 1,
    wide: 1.125,
    ultra: 1.25,
} as const;

// Generate CSS custom properties for spacing
export function generateSpacingCSS(prefix: string = 'space'): string {
    const lines: string[] = [':root {'];

    // Base spacing
    Object.entries(spacing).forEach(([key, value]) => {
        lines.push(`  --${prefix}-${key}: ${value};`);
    });

    // Semantic spacing
    Object.entries(semanticSpacing).forEach(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        lines.push(`  --${prefix}-${cssKey}: ${value};`);
    });

    lines.push('}');

    return lines.join('\n');
}

// Generate Tailwind config extension for spacing
export function generateTailwindSpacingConfig(): Record<string, string> {
    const config: Record<string, string> = {};

    // Add base spacing
    Object.entries(spacing).forEach(([key, value]) => {
        config[key] = value;
    });

    // Add semantic spacing
    Object.entries(semanticSpacing).forEach(([key, value]) => {
        config[`${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`] = value;
    });

    return config;
}

// Spacing utility functions
export function getSpacing(token: SpacingToken | SemanticSpacingToken): string {
    if (token in spacing) {
        return spacing[token as SpacingToken];
    }
    if (token in semanticSpacing) {
        return semanticSpacing[token as SemanticSpacingToken];
    }
    console.warn(`Unknown spacing token: ${token}`);
    return spacing[4];
}

export function getResponsiveSpacing(
    token: SpacingToken | SemanticSpacingToken,
    multiplier: keyof typeof responsiveSpacingMultipliers = 'desktop'
): string {
    const baseSpacing = getSpacing(token);
    const scaleFactor = responsiveSpacingMultipliers[multiplier];

    // Convert rem to numeric value
    const numericValue = parseFloat(baseSpacing);
    const unit = baseSpacing.replace(numericValue.toString(), '');

    return `${numericValue * scaleFactor}${unit}`;
}

export function getComponentSpacing(
    component: ComponentSpacingToken,
    prop: string
): string {
    if (component in componentSpacing) {
        const componentConfig = componentSpacing[component];
        if (prop in componentConfig) {
            return (componentConfig as Record<string, unknown>)[prop] as string;
        }
    }
    console.warn(`Unknown component spacing: ${component}.${prop}`);
    return '0.5rem';
}

// Spacing scale with T-shirt sizing
export const tshirtSpacing = {
    xs: spacing[1],
    sm: spacing[2],
    md: spacing[4],
    lg: spacing[6],
    xl: spacing[8],
    '2xl': spacing[12],
    '3xl': spacing[16],
    '4xl': spacing[24],
} as const;

export type TshirtSpacingToken = keyof typeof tshirtSpacing;

// Layout spacing patterns
export const layoutPatterns = {
    center: 'mx-auto',
    full: 'w-full',
    content: 'max-w-content',
    stack: 'flex flex-col gap-{gap}',
    inline: 'flex items-center gap-{gap}',
    grid: 'grid gap-{gap}',
    sidebar: 'grid grid-cols-[250px_1fr]',
    split: 'flex justify-between',
    balanced: 'flex items-center justify-between',
} as const;

// Export complete spacing configuration
export const defaultSpacingConfig = {
    base: spacing,
    fluid: fluidSpacing,
    semantic: semanticSpacing,
    component: componentSpacing,
    tshirt: tshirtSpacing,
    responsive: responsiveSpacingMultipliers,
    utilities: {
        generateCSS: generateSpacingCSS,
        generateTailwindConfig: generateTailwindSpacingConfig,
        get: getSpacing,
        getResponsive: getResponsiveSpacing,
        getComponent: getComponentSpacing,
    },
} as const;
