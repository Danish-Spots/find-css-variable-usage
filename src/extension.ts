// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

/**
 * This extension was made using alot of chatGpt 3.5 prompts
 */
import fs from "fs";
import * as vscode from "vscode";
import {
  AllCssVariableMappings,
  readSourceFile,
  readSourceFiles,
} from "./read-files";
import { loadAllSettings } from "./load-all-settings";
import { highlightSimilarVariablesV2 } from "./highlight";
import { CssVariableSuggestionCodeLensProvider } from "./code-lens.provider";

interface CssVariable {
  name: string;
  value: string;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
const settingsValues = loadAllSettings();
export var allVariables: AllCssVariableMappings = {};

export function activate(context: vscode.ExtensionContext) {
  const colorVars = readSourceFile(
    settingsValues.colorSettings.filePath,
    settingsValues.colorSettings.identifiers
  );
  settingsValues.colorSettings.cssProperties?.forEach((prop) => {
    allVariables[prop] = colorVars;
  });
  let codeLensProviderDisposableCss = vscode.languages.registerCodeLensProvider(
    {
      language: "css",
      scheme: "file",
    },
    new CssVariableSuggestionCodeLensProvider()
  );
  let codeLensProviderDisposableScss =
    vscode.languages.registerCodeLensProvider(
      {
        language: "scss",
        scheme: "file",
      },
      new CssVariableSuggestionCodeLensProvider()
    );
  context.subscriptions.push(codeLensProviderDisposableCss);
  context.subscriptions.push(codeLensProviderDisposableScss);

  vscode.commands.registerCommand(
    "findcssvariableusage.replaceValue",
    (args: RepalceArgs) => {
      const replacementLine = args.fullMatch.replace(
        args.value,
        args.replacement
      );

      // // Apply the replacement to the document
      const editBuilder = new vscode.WorkspaceEdit();
      editBuilder.replace(args.document.uri, args.range, replacementLine);
      vscode.workspace.applyEdit(editBuilder);
      // replace logic
    }
  );
}

interface RepalceArgs {
  range: vscode.Range;
  fullMatch: string;
  value: string;
  replacement: string;
  document: vscode.TextDocument;
}
