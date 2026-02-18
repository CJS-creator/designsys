import { DesignToken } from "@/types/tokens";

/**
 * Exports DesignToken[] to W3C Design Token Community Group (DTCG) standard format.
 * Format: { tokenPath: { $value: value, $type: type, $description: description } }
 */
export function exportToDTCG(tokens: DesignToken[]): string {
    const dtcg: any = {};

    tokens.forEach(token => {
        const parts = token.path.split('.');
        let current = dtcg;

        parts.forEach((part, index) => {
            if (index === parts.length - 1) {
                current[part] = {
                    $value: token.ref ? `{${token.ref.replace(/[{}]/g, '')}}` : token.value,
                    $type: mapToDTCGType(token.type),
                    $description: token.description || ""
                };
            } else {
                if (!current[part]) {
                    current[part] = {};
                }
                current = current[part];
            }
        });
    });

    return JSON.stringify(dtcg, null, 2);
}

function mapToDTCGType(type: string): string {
    switch (type) {
        case 'color': return 'color';
        case 'dimension':
        case 'spacing':
        case 'borderRadius':
        case 'borderWidth': return 'dimension';
        case 'fontFamily': return 'fontFamily';
        case 'fontWeight': return 'fontWeight';
        case 'boxShadow':
        case 'shadow': return 'shadow';
        case 'cubicBezier': return 'cubicBezier';
        case 'duration': return 'duration';
        default: return type;
    }
}
