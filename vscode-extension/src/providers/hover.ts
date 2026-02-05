import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class DesignSysHoverProvider implements vscode.HoverProvider {
    provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.ProviderResult<vscode.Hover> {
        const range = document.getWordRangeAtPosition(position, /ds\.colors\.[\w\.]+/);
        if (!range) return undefined;

        const word = document.getText(range); // e.g., ds.colors.primary

        const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
        if (!workspaceFolder) return undefined;

        const tokensPath = path.join(workspaceFolder.uri.fsPath, '.designsys', 'tokens.json');
        if (!fs.existsSync(tokensPath)) return undefined;

        try {
            const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
            const pathParts = word.replace('ds.', '').split('.'); // [colors, primary]
            const value = pathParts.reduce((o: any, i: string) => (o ? o[i] : null), tokens);

            if (value && typeof value === 'string') {
                const markdown = new vscode.MarkdownString();
                markdown.appendMarkdown(`**${word}**\n\n`);
                markdown.appendMarkdown(`\`${value}\` `);
                // Create a color preview square
                markdown.appendMarkdown(`<span style="background-color:${value};color:${value};border:1px solid #777;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>`);
                markdown.supportHtml = true;
                return new vscode.Hover(markdown);
            }
        } catch (e) {
            console.error(e);
        }
        return undefined;
    }
}
