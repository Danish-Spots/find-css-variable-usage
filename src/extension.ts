// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

/**
 * This extension was made using alot of chatGpt 3.5 prompts
 */
import * as vscode from "vscode";
import fs from "fs";

const variableDecorationType = vscode.window.createTextEditorDecorationType({
  overviewRulerLane: vscode.OverviewRulerLane.Right, // Set the overview ruler lane
});

const textColor =
  vscode.workspace
    .getConfiguration()
    .get<string>("findcssvariableusage.textColor") || "rgba(255, 255, 255, 1)";
let activeEditor = vscode.window.activeTextEditor;
const variableFilePath =
  vscode.workspace
    .getConfiguration()
    .get<string>("findcssvariableusage.variableFilePath") ||
  "path/to/default/variable/file.css";
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Register a listener for text editor changes

  // Register your command (optional)
  vscode.commands.registerCommand(
    "findcssvariableusage.highlightSimilarVariables",
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
    "findcssvariableusage.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from FindCssVariableUsage!"
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
        (document.languageId === "css" || document.languageId === "scss") &&
        activeEditor
      ) {
        highlightSimilarVariables(activeEditor);
      }
    })
  );
}

function highlightSimilarVariables(editor: vscode.TextEditor): void {
  const absolutePath =
    vscode.workspace
      .getConfiguration()
      .get<string>("findcssvariableusage.variableFilePath") ||
    "path/to/default/variable/file.css";

  try {
    const sourceFileContent = fs.readFileSync(absolutePath, "utf-8");

    // Extract CSS variables within :root selector
    const rootSelectorMatch = sourceFileContent.match(/:root\s*\{([\s\S]*?)\}/);
    const cssVariables = rootSelectorMatch
      ? rootSelectorMatch[1].match(/(--[\w-]+:[^;]+;)/g)
      : null;

    if (cssVariables) {
      const decorations = cssVariables.flatMap((variableDeclaration) => {
        const valueMatch = variableDeclaration.match(/(--[\w-]+):([^;]+);/);
        if (valueMatch) {
          const variableName = valueMatch[1];
          const variableValue = valueMatch[2];

          const escapedValue = variableValue.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          );
          const valueRegex = new RegExp(`${escapedValue}`, "g");

          let match;
          const matches = [];

          // Iterate over all matches in the document
          while ((match = valueRegex.exec(editor.document.getText()))) {
            const matchStart = editor.document.offsetAt(
              editor.document.getWordRangeAtPosition(
                editor.document.positionAt(match.index).translate(0, 1)
              )?.start ||
                editor.document.positionAt(match.index).translate(0, 1)
            );
            const matchEnd = matchStart + match[0].length;

            const range = new vscode.Range(
              editor.document.positionAt(matchStart),
              editor.document.positionAt(matchEnd)
            );
            matches.push({
              range,
              renderOptions: {
                after: {
                  contentText: `	Replace with: ${variableName.trim()}`,
                  color: textColor,
                },
              },
            });

            // Update lastIndex for the next search
            valueRegex.lastIndex = matchEnd;
          }

          return matches;
        }
        return [];
      });
      editor.setDecorations(variableDecorationType, decorations);
    }
  } catch (error) {
    console.error("Error reading source file:", error);
  }
}
