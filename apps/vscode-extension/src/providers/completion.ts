import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class DesignSysCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {

        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        if (!linePrefix.includes('ds.')) {
            return undefined;
        }

        const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
        if (!workspaceFolder) return undefined;

        const tokensPath = path.join(workspaceFolder.uri.fsPath, '.designsys', 'tokens.json');
        if (!fs.existsSync(tokensPath)) return undefined;

        try {
            const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

            // Extract the part after "ds."
            // e.g. "const c = ds.colors.prim" -> prefix match "ds.colors."
            const regex = /ds\.([\w.]*)$/;
            const match = linePrefix.match(regex);

            if (!match) return undefined;

            const typedPath = match[1]; // e.g. "colors." or "colors.prim" or ""

            // Should valid suggestions require a dot at the end?
            // If I type "ds.co", I want "colors".
            // If I type "ds.colors.", I want "primary".

            // Algorithm:
            // 1. Split typedPath by dot.
            // 2. Traverse token tree.
            // 3. If last part is partial, Suggest keys of the parent matching partial.
            //    If last part is empty (dot ending), Suggest all keys of current node.

            const parts = typedPath.split('.');
            // parts:
            // "ds." -> [""] 
            // "ds.co" -> ["co"]
            // "ds.colors." -> ["colors", ""]
            // "ds.colors.pr" -> ["colors", "pr"]

            let current: any = tokens;
            // Traverse up to the second to last part
            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                if (current[part] && typeof current[part] === 'object') {
                    current = current[part];
                } else {
                    return undefined; // Path not found
                }
            }

            const lastPart = parts[parts.length - 1];

            // "current" is now the object we want to pick from.
            // "lastPart" is the filter.

            if (typeof current !== 'object' || current === null) return undefined;

            return Object.keys(current).map(key => {
                if (key.startsWith(lastPart)) {
                    const val = current[key];
                    const kind = typeof val === 'object' ? vscode.CompletionItemKind.Module : vscode.CompletionItemKind.Color;
                    const item = new vscode.CompletionItem(key, kind);

                    if (typeof val !== 'object') {
                        item.detail = String(val);
                        // Add color preview if it looks like a color
                        if (String(val).startsWith('#') || String(val).startsWith('rgb') || String(val).startsWith('hsl')) {
                            item.documentation = new vscode.MarkdownString(`Preview: <span style="color:${val};background-color:${val};width:20px;height:20px;display:inline-block;border:1px solid #777;"></span> \`${val}\``);
                        }
                    } else {
                        item.detail = "(Group)";
                    }
                    return item;
                }
                return undefined;
            }).filter((item): item is vscode.CompletionItem => item !== undefined);

        } catch (e) {
            console.error(e);
        }
        return undefined;
    }
}

