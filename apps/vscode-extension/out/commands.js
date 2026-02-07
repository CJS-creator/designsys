"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setApiKey = setApiKey;
exports.pullDesignSystem = pullDesignSystem;
const vscode = require("vscode");
const axios_1 = require("axios");
const fs = require("fs-extra");
const path = require("path");
async function setApiKey(context) {
    const apiKey = await vscode.window.showInputBox({
        title: 'DesignSys API Key',
        prompt: 'Enter your DesignSys API Key (start with ds_live_)',
        password: true,
        ignoreFocusOut: true
    });
    if (!apiKey) {
        return;
    }
    try {
        await context.secrets.store('designsys.apiKey', apiKey);
        vscode.window.showInformationMessage('DesignSys API Key saved successfully!');
    }
    catch (error) {
        vscode.window.showErrorMessage('Failed to save API Key.');
    }
}
// Helper to unflatten tokens
function unflattenTokens(tokens) {
    const root = {};
    tokens.forEach(token => {
        // Strip initial "ds." if present for cleaner hierarchy, or keep it.
        // Paths are like "colors.primary.500".
        const parts = token.path.split('.');
        let current = root;
        parts.forEach((part, index) => {
            if (index === parts.length - 1) {
                current[part] = token.value; // Leaf node
            }
            else {
                current[part] = current[part] || {};
                current = current[part];
            }
        });
    });
    return root;
}
async function pullDesignSystem(context) {
    // 1. Check workspace
    if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
        vscode.window.showErrorMessage('Please open a folder or workspace first.');
        return;
    }
    const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    // 2. Get API Key
    const apiKey = await context.secrets.get('designsys.apiKey');
    if (!apiKey) {
        const result = await vscode.window.showErrorMessage('API Key not found. Set it now?', 'Yes', 'No');
        if (result === 'Yes') {
            await setApiKey(context);
        }
        return;
    }
    // 3. API Call
    let apiUrl = vscode.workspace.getConfiguration('designsys').get('apiUrl');
    if (!apiUrl || apiUrl.includes('[YOUR_PROJECT_ID]')) {
        apiUrl = await vscode.window.showInputBox({
            prompt: 'Enter your DesignSys API URL (e.g., https://<project>.functions.supabase.co/v1-api/v1/tokens)',
            value: apiUrl,
            ignoreFocusOut: true
        });
        if (apiUrl) {
            await vscode.workspace.getConfiguration('designsys').update('apiUrl', apiUrl, vscode.ConfigurationTarget.Global);
        }
        else {
            return;
        }
    }
    if (!apiUrl)
        return;
    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "DesignSys: Pulling Tokens...",
        cancellable: false
    }, async (_progress) => {
        try {
            // Fix: remove /generate if present, ensure we hit /tokens
            // User might enter base URL. Let's try to be smart or just trust them.
            // Assumption: User provides the full endpoint or we construct it.
            // Let's assume standard endpoint for now.
            const response = await axios_1.default.get(apiUrl, {
                headers: { 'x-api-key': apiKey }
            });
            if (response.data.data) {
                const tokens = response.data.data;
                const tokenTree = unflattenTokens(tokens);
                // 4. Save Tokens
                const tokensDir = path.join(rootPath, '.designsys');
                fs.ensureDirSync(tokensDir);
                fs.writeFileSync(path.join(tokensDir, 'tokens.json'), JSON.stringify(tokenTree, null, 2));
                vscode.window.showInformationMessage(`Successfully pulled ${tokens.length} tokens to .designsys/tokens.json`);
            }
            else {
                throw new Error('Invalid response format: data property missing');
            }
        }
        catch (apiError) {
            console.error(apiError);
            const msg = apiError.response?.data?.error || apiError.message;
            vscode.window.showErrorMessage(`Pull Failed: ${msg}`);
        }
    });
}
//# sourceMappingURL=commands.js.map