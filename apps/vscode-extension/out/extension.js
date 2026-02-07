"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const commands_1 = require("./commands");
const completion_1 = require("./providers/completion");
const hover_1 = require("./providers/hover");
function activate(context) {
    console.log('DesignSys Extension is now active!');
    // 1. Register Commands
    let setKeyCmd = vscode.commands.registerCommand('designsys.setApiKey', async () => {
        await (0, commands_1.setApiKey)(context);
    });
    let pullCmd = vscode.commands.registerCommand('designsys.pull', async () => {
        await (0, commands_1.pullDesignSystem)(context);
    });
    // 2. Register Providers
    const completionProvider = vscode.languages.registerCompletionItemProvider(['typescript', 'javascript', 'javascriptreact', 'typescriptreact', 'css', 'scss', 'json'], new completion_1.DesignSysCompletionProvider(), '.' // Trigger on dot
    );
    const hoverProvider = vscode.languages.registerHoverProvider(['typescript', 'javascript', 'javascriptreact', 'typescriptreact', 'css', 'scss', 'json'], new hover_1.DesignSysHoverProvider());
    context.subscriptions.push(setKeyCmd);
    context.subscriptions.push(pullCmd);
    context.subscriptions.push(completionProvider);
    context.subscriptions.push(hoverProvider);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map