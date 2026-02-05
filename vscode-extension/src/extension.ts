import * as vscode from 'vscode';
import { setApiKey, pullDesignSystem } from './commands';
import { DesignSysCompletionProvider } from './providers/completion';
import { DesignSysHoverProvider } from './providers/hover';

export function activate(context: vscode.ExtensionContext) {
    console.log('DesignSys Extension is now active!');

    // 1. Register Commands
    let setKeyCmd = vscode.commands.registerCommand('designsys.setApiKey', async () => {
        await setApiKey(context);
    });

    let pullCmd = vscode.commands.registerCommand('designsys.pull', async () => {
        await pullDesignSystem(context);
    });

    // 2. Register Providers
    const completionProvider = vscode.languages.registerCompletionItemProvider(
        ['typescript', 'javascript', 'javascriptreact', 'typescriptreact', 'css', 'scss', 'json'],
        new DesignSysCompletionProvider(),
        '.' // Trigger on dot
    );

    const hoverProvider = vscode.languages.registerHoverProvider(
        ['typescript', 'javascript', 'javascriptreact', 'typescriptreact', 'css', 'scss', 'json'],
        new DesignSysHoverProvider()
    );

    context.subscriptions.push(setKeyCmd);
    context.subscriptions.push(pullCmd);
    context.subscriptions.push(completionProvider);
    context.subscriptions.push(hoverProvider);
}

export function deactivate() { }
