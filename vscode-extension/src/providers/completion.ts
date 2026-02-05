import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class DesignSysCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {

        // 1. Check if user typed 'ds.'
        const linePrefix = document.lineAt(position).text.substr(0, position.character);

        // Simple regex to match: "ds." or "ds.colors."
        if (!linePrefix.includes('ds.')) {
            return undefined;
        }

        const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
        if (!workspaceFolder) return undefined;

        const tokensPath = path.join(workspaceFolder.uri.fsPath, '.designsys', 'tokens.json');
        if (!fs.existsSync(tokensPath)) return undefined;

        try {
            const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

            // Top level: "ds." -> returns colors, typography, etc.
            if (linePrefix.endsWith('ds.')) {
                return Object.keys(tokens).map(key => {
                    const item = new vscode.CompletionItem(key, vscode.CompletionItemKind.Module);
                    item.detail = `Design System ${key}`;
                    return item;
                });
            }

            // Nested: "ds.colors."
            if (linePrefix.endsWith('ds.colors.')) {
                return this.flattenKeys(tokens.colors).map(key => {
                    const item = new vscode.CompletionItem(key, vscode.CompletionItemKind.Color);
                    // Show color preview block
                    // Note: We can only show true preview in documentation, but kind Color helps
                    const val = this.getValue(tokens.colors, key);
                    item.detail = val;
                    item.documentation = new vscode.MarkdownString(`Preview: <span style="color:${val};background-color:${val};width:20px;height:20px;display:inline-block;border:1px solid #777;"></span> \`${val}\``);
                    return item;
                });
            }

            // Typography: "ds.typography."
            // Simplified logic for MVP

        } catch (e) {
            console.error(e);
        }
        return undefined;
    }

    private flattenKeys(obj: any, prefix = ''): string[] {
        let keys: string[] = [];
        for (const k in obj) {
            if (typeof obj[k] === 'object' && obj[k] !== null) {
                // If it's a color object/map
                keys = keys.concat(this.flattenKeys(obj[k], prefix + k + '.'));
            } else {
                keys.push(prefix + k);
            }
        }
        return keys;
    }

    private getValue(obj: any, path: string): string {
        return path.split('.').reduce((o, i) => o[i], obj);
    }
}
