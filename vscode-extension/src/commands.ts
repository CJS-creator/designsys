import * as vscode from 'vscode';
import axios from 'axios';
import * as fs from 'fs-extra';
import * as path from 'path';

export async function setApiKey(context: vscode.ExtensionContext) {
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
    } catch (error) {
        vscode.window.showErrorMessage('Failed to save API Key.');
    }
}

interface DesignSystemConfig {
    appType: string;
    industry: string;
    brandMood: string[];
    primaryColor?: string;
    description?: string;
}

export async function pullDesignSystem(context: vscode.ExtensionContext) {
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

    // 3. Read Config
    const configPath = path.join(rootPath, '.designsysrc.json');
    if (!fs.existsSync(configPath)) {
        vscode.window.showErrorMessage('Config file .designsysrc.json not found. Please create one.');
        return;
    }

    try {
        const configRaw = fs.readFileSync(configPath, 'utf8');
        const config: DesignSystemConfig = JSON.parse(configRaw);

        // 4. API Call
        const apiUrl = vscode.workspace.getConfiguration('designsys').get<string>('apiUrl');
        if (!apiUrl) {
            vscode.window.showErrorMessage('API URL not configured.');
            return;
        }

        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "DesignSys: Generating Tokens...",
            cancellable: false
        }, async (_progress) => {
            try {
                const response = await axios.post(apiUrl, config, {
                    headers: { 'x-api-key': apiKey }
                });

                if (response.data.success || response.data.designSystem) { // Handle both wrapper styles
                    const ds = response.data.success ? response.data.data : response.data.designSystem;

                    // 5. Save Tokens
                    const tokensDir = path.join(rootPath, '.designsys');
                    fs.ensureDirSync(tokensDir);
                    fs.writeFileSync(path.join(tokensDir, 'tokens.json'), JSON.stringify(ds, null, 2));

                    vscode.window.showInformationMessage(`Design System generated and saved to .designsys/tokens.json`);
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (apiError: any) {
                console.error(apiError);
                const msg = apiError.response?.data?.error || apiError.message;
                vscode.window.showErrorMessage(`Generation Failed: ${msg}`);
            }
        });

    } catch (err: any) {
        vscode.window.showErrorMessage(`Error parsing config: ${err.message}`);
    }
}
