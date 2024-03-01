// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

/**
 * This extension was made using alot of chatGpt 3.5 prompts
 */
import * as vscode from "vscode";
import { CssVariableSuggestionCodeLensProvider } from "./code-lens.provider";
import { cssSupport, scssSupport } from "./file-support";
import { ReplaceValue } from "./replace-value";
import { ConfigChange, reloadSettings } from "./update-data";
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {
  // Setup initial state
  reloadSettings(context);

  // Setup code lens
  const codeLensProvider = new CssVariableSuggestionCodeLensProvider(context);
  let codeLensProviderDisposableCss = vscode.languages.registerCodeLensProvider(
    cssSupport,
    codeLensProvider
  );
  let codeLensProviderDisposableScss =
    vscode.languages.registerCodeLensProvider(scssSupport, codeLensProvider);
  context.subscriptions.push(codeLensProviderDisposableCss);
  context.subscriptions.push(codeLensProviderDisposableScss);

  // Setup replace command
  const replaceValueDisposable = vscode.commands.registerCommand(
    "replacecsswithvars.replaceValue",
    ReplaceValue
  );
  context.subscriptions.push(replaceValueDisposable);

  // Setup change config
  const configChangeDisposable = vscode.workspace.onDidChangeConfiguration(
    ConfigChange(context)
  );

  context.subscriptions.push(configChangeDisposable);
}
