/**
 * Security utilities for sanitizing user-provided data and preventing XSS.
 */

/**
 * Validates if a string is a safe CSS color value.
 * This prevents style-based XSS attacks through malicious values like:
 * url("javascript:alert(1)") or -moz-binding
 */
export const isValidColor = (color: string): boolean => {
    if (typeof color !== 'string') return false;

    // Regular expression for common CSS color formats:
    // - Hex: #fff, #ffffff, #ffffff00
    // - RGB/RGBA: rgb(0,0,0), rgba(0,0,0,0)
    // - HSL/HSLA: hsl(0,0%,0%), hsla(0,0%,0%,0)
    // - Basic color names (approximate)
    const colorRegex = /^(#(?:[0-9a-fA-F]{3,4}){1,2}|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d.]+%?\))$/i;

    // Named colors list (subset for common use)
    const namedColors = new Set([
        'transparent', 'inherit', 'currentcolor',
        'black', 'white', 'gray', 'silver', 'maroon', 'red', 'purple', 'fuchsia',
        'green', 'lime', 'olive', 'yellow', 'navy', 'blue', 'teal', 'aqua',
        'orange', 'aliceblue', 'antiquewhite', 'aquamarine', 'azure', 'beige',
        'bisque', 'blanchedalmond', 'blueviolet', 'brown', 'burlywood', 'cadetblue'
        // ... add more if needed, or stick to regex for most cases
    ]);

    const trimmed = color.trim().toLowerCase();

    if (namedColors.has(trimmed)) return true;
    if (colorRegex.test(trimmed)) return true;

    return false;
};

/**
 * Sanitizes a style object by filtering out potentially dangerous properties.
 */
export const sanitizeStyle = (style: Record<string, unknown>): React.CSSProperties => {
    const safeStyle: Record<string, unknown> = {};
    if (!style || typeof style !== 'object') return safeStyle;

    const dangerousKeys = ['behavior', 'expression', 'moz-binding'];

    Object.entries(style).forEach(([key, value]) => {
        // Filter out dangerous keys
        if (dangerousKeys.some(dk => key.toLowerCase().includes(dk))) return;

        // If it's a color property, validate the value
        if (key.toLowerCase().includes('color') || key.toLowerCase().includes('background')) {
            if (typeof value === 'string' && isValidColor(value)) {
                safeStyle[key] = value;
            } else if (typeof value === 'string' && (value.startsWith('var(') || value.includes(' '))) {
                // Allow CSS variables and complex values like '1px solid black' (could be further refined)
                safeStyle[key] = value;
            }
        } else {
            safeStyle[key] = value;
        }
    });

    return safeStyle;
};
