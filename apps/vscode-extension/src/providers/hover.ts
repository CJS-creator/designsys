import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class DesignSysHoverProvider implements vscode.HoverProvider {
    provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.ProviderResult<vscode.Hover> {
        // Match any sequence starting with ds. and containing alphanumeric, dots, or underscores
        const range = document.getWordRangeAtPosition(position, /ds\.[\w\.]+/);
        if (!range) return undefined;

        const word = document.getText(range); // e.g., ds.colors.primary.500

        const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
        if (!workspaceFolder) return undefined;

        const tokensPath = path.join(workspaceFolder.uri.fsPath, '.designsys', 'tokens.json');
        if (!fs.existsSync(tokensPath)) return undefined;

        try {
            const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
            const pathParts = word.replace('ds.', '').split('.'); // [colors, primary, 500]

            // Traverse safely
            let value = tokens;
            for (const part of pathParts) {
                if (value && typeof value === 'object') {
                    value = value[part];
                } else {
                    value = undefined;
                    break;
                }
            }

            if (value !== undefined && (typeof value === 'string' || typeof value === 'number')) {
                const markdown = new vscode.MarkdownString();
                markdown.appendMarkdown(`**${word}**\n\n`);
                markdown.appendMarkdown(`\`${value}\` `);

                // Create a color preview square if it looks like a color
                const strVal = String(value);
                if (strVal.startsWith('#') || strVal.startsWith('rgb') || strVal.startsWith('hsl')) {
                    markdown.appendMarkdown(`<span style="background-color:${strVal};color:${strVal};border:1px solid #777;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>`);
                    markdown.supportHtml = true;
                }

                return new vscode.Hover(markdown);
            }
        } catch (e) {
            console.error(e);
        }
        return undefined;
    }
}

