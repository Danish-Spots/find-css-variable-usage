// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

/**
 * This extension was made using alot of chatGpt 3.5 prompts
 */
import fs from 'fs';
import * as vscode from 'vscode';

interface CssVariable {
  name: string;
  value: string;
}
const variableDecorationType = vscode.window.createTextEditorDecorationType({
  overviewRulerLane: vscode.OverviewRulerLane.Right, // Set the overview ruler lane
});
const absolutePath =
  vscode.workspace
    .getConfiguration()
    .get<string>('findcssvariableusage.variableFilePath') ||
  'path/to/default/variable/file.css';
let cssVariables: CssVariable[];
const cssVarTokenRegex = /(--[\w-]+):([^;]+);/;
const cssVarTokenRegexGlobal = /(--[\w-]+):([^;]+);/g;

const textColor =
  vscode.workspace
    .getConfiguration()
    .get<string>('findcssvariableusage.textColor') || 'rgba(255, 255, 255, 1)';

let activeEditor = vscode.window.activeTextEditor;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Read source files initially
  readSourceFiles();

  // Register your command (optional)
  vscode.commands.registerCommand(
    'findcssvariableusage.highlightSimilarVariables',
    () => {
      if (activeEditor) {
        highlightSimilarVariables(activeEditor);
      }
    }
  );
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "findcssvariableusage" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'findcssvariableusage.helloWorld',
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        'Hello World from FindCssVariableUsage!'
      );
    }
  );

  context.subscriptions.push(disposable);
  // Register the decoration type
  context.subscriptions.push(variableDecorationType);

  // Register onDidSaveTextDocument event handler
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
      if (
        (document.languageId === 'css' || document.languageId === 'scss') &&
        activeEditor
      ) {
        highlightSimilarVariables(activeEditor);
      }
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(() => {
      readSourceFiles();
    })
  );
}

function highlightSimilarVariables(editor: vscode.TextEditor): void {
  if (cssVariables.length === 0) return;

  const decorations: vscode.DecorationOptions[] = [];

  cssVariables.forEach(({ name, value }) => {
    const valueRegex = new RegExp(`${value}`, 'g');

    let match;
    while ((match = valueRegex.exec(editor.document.getText()))) {
      const matchStart = editor.document.offsetAt(
        editor.document.getWordRangeAtPosition(
          editor.document.positionAt(match.index).translate(0, 1)
        )?.start || editor.document.positionAt(match.index).translate(0, 1)
      );
      const matchEnd = matchStart + match[0].length;

      const range = new vscode.Range(
        editor.document.positionAt(matchStart),
        editor.document.positionAt(matchEnd)
      );

      decorations.push({
        range,
        renderOptions: {
          after: {
            contentText: `    Replace with: ${name}`,
            color: textColor,
          },
        },
      });

      valueRegex.lastIndex = match.index + 1;
      console.log(decorations);
    }
  });

  editor.setDecorations(variableDecorationType, decorations);
}

function readSourceFiles(): void {
  const sourceFileProperties =
    vscode.workspace
      .getConfiguration()
      .get<{ [filePath: string]: string[] }>(
        'findcssvariableusage.sourceFileProperties'
      ) || {};

  cssVariables = [];

  Object.entries(sourceFileProperties).forEach(([filePath, properties]) => {
    try {
      const sourceFileContent = fs.readFileSync(filePath, 'utf-8');
      const matches = sourceFileContent.matchAll(cssVarTokenRegexGlobal);
      for (const match of matches) {
        const [, name, value] = match;
        // Check if the variable is associated with any checked property for this file
        if (
          properties.some((prop) =>
            sourceFileContent.includes(`${prop}: var(${name})`)
          )
        ) {
          cssVariables.push({ name: name.trim(), value: value.trim() });
        }
      }
    } catch (error) {
      console.error('Error reading source file:', error);
    }
  });
}

