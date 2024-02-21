/* eslint-disable curly */
import * as vscode from "vscode";
import { AllCssVariableMappings, CssVariableMapping } from "./read-files";

export function highlightSimilarVariablesV2(
  document: vscode.TextDocument,
  cssVariables: AllCssVariableMappings | undefined,
  cssProperties: String[]
): vscode.CodeLens[] | undefined {
  if (!cssVariables || !cssProperties) return undefined;

  const decorations: vscode.DecorationOptions[] = [];
  // Iterate over each line in the document
  // Regular expression to match CSS properties and values in the entire document
  const propertyRegex = /([a-zA-Z-]+)\s*:\s*([^;]+)/g;

  // Array to store code lenses
  let codeLenses = [];
  // Combine all lines into a single string
  const entireDocumentText = document.getText();

  // Match properties and values using the regular expression
  let match;
  while ((match = propertyRegex.exec(entireDocumentText)) !== null) {
    const fullMatch = match[0];
    const property = match[1].trim(); // Property name
    const values = match[2].trim().split(" "); // Property value
    const variableMappings = cssVariables[property];
    if (variableMappings) {
      for (const value of values) {
        const removedPound = value.replace("#", "");
        const matchingValue = variableMappings[removedPound];
        if (matchingValue) {
          const matchStart = document.offsetAt(
            document.getWordRangeAtPosition(
              document.positionAt(match.index).translate(0, 1)
            )?.start || document.positionAt(match.index).translate(0, 1)
          );
          const matchEnd = matchStart + fullMatch.length;
          const range = new vscode.Range(
            document.positionAt(matchStart),
            document.positionAt(matchEnd)
          );
          const codeLens = new vscode.CodeLens(range);
          codeLens.command = {
            title: "Replace with css variable",
            tooltip: "Replaces the current css value with a css variable",
            command: "findcssvariableusage.replaceValue",
            arguments: [
              {
                range,
                fullMatch,
                value,
                replacement: matchingValue.replacement,
                document,
              },
            ],
          };

          // Add the code lens to the array
          codeLenses.push(codeLens);
        }
      }
    }

    // Process the property-value pair as needed
  }
  return codeLenses;
}

// decorations.push({
//   range,
//   renderOptions: {
//     after: {
//       contentText: `    Replace with: ${matchingValue.name}`,
//       color: textColor,
//     },
//   },
// });

// valueRegex.lastIndex = match.index + 1;
