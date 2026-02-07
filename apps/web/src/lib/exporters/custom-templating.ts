import { DesignToken } from "@/types/tokens";

/**
 * Resolves a Handlebars-lite template against a set of design tokens.
 * Supported placeholders:
 * - {{name}}: Root name
 * - {{json}}: Full tokens as JSON
 * - {{#tokens}} {{path}} {{value}} {{name}} {{type}} {{/tokens}}: Token loop
 */
export function resolveTemplate(template: string, tokens: DesignToken[], rootName: string = "Design System"): string {
    let result = template;

    // Root placeholders
    result = result.replace(/{{name}}/g, rootName);
    result = result.replace(/{{json}}/g, JSON.stringify(tokens, null, 2));

    // Token Loops
    const loopRegex = /{{#tokens}}([\s\S]*?){{\/tokens}}/g;
    result = result.replace(loopRegex, (_, inner) => {
        return tokens.map(token => {
            return inner
                .replace(/{{path}}/g, token.path)
                .replace(/{{name}}/g, token.name)
                .replace(/{{value}}/g, String(token.value))
                .replace(/{{type}}/g, (token as any).token_type || token.type || "unknown");
        }).join('');
    });

    return result;
}
