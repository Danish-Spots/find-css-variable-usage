// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

/**
 * This extension was made using alot of chatGpt 3.5 prompts
 */
import fs from "fs";
import * as vscode from "vscode";
import { AllCssVariableMappings, readSourceFile } from "./read-files";
import { loadAllSettings } from "./load-all-settings";
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
  createVariables();
  console.log(allVariables);

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

function createVariables() {
  // read all files
  const colorVars = readSourceFile(
    settingsValues.colorSettings.filePath,
    settingsValues.colorSettings.identifiers
  );
  const borderRadiiVars = readSourceFile(
    settingsValues.borderRadiiSettings.filePath,
    settingsValues.borderRadiiSettings.identifiers
  );
  const fontSizeVars = readSourceFile(
    settingsValues.fontSizeSettings.filePath,
    settingsValues.fontSizeSettings.identifiers
  );
  const fontWeightVars = readSourceFile(
    settingsValues.fontWeightSettings.filePath,
    settingsValues.fontWeightSettings.identifiers
  );
  const fontFamilyVars = readSourceFile(
    settingsValues.fontFamilySettings.filePath,
    settingsValues.fontFamilySettings.identifiers
  );
  const lineHeightVars = readSourceFile(
    settingsValues.lineHeightSettings.filePath,
    settingsValues.lineHeightSettings.identifiers
  );
  const spacingVars = readSourceFile(
    settingsValues.spacingSettings.filePath,
    settingsValues.spacingSettings.identifiers
  );

  // set variables
  settingsValues.colorSettings.cssProperties?.forEach((prop) => {
    allVariables[prop] = colorVars;
  });
  settingsValues.borderRadiiSettings.cssProperties?.forEach((prop) => {
    allVariables[prop] = { ...allVariables[prop], ...borderRadiiVars };
  });
  settingsValues.fontSizeSettings.cssProperties?.forEach((prop) => {
    allVariables[prop] = { ...allVariables[prop], ...fontSizeVars };
  });
  settingsValues.fontFamilySettings.cssProperties?.forEach((prop) => {
    allVariables[prop] = { ...allVariables[prop], ...fontFamilyVars };
  });
  settingsValues.fontWeightSettings.cssProperties?.forEach((prop) => {
    allVariables[prop] = { ...allVariables[prop], ...fontWeightVars };
  });
  settingsValues.lineHeightSettings.cssProperties?.forEach((prop) => {
    allVariables[prop] = { ...allVariables[prop], ...lineHeightVars };
  });
  settingsValues.spacingSettings.cssProperties?.forEach((prop) => {
    allVariables[prop] = { ...allVariables[prop], ...spacingVars };
  });
}
