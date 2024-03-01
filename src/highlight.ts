/* eslint-disable curly */
import * as vscode from "vscode";
import { AllCssVariableMappings } from "./css-types";

/**
 * This function takes the current active document and cssVariable mappings and
 * creates codeLenses for places where css variables could be used
 * @param document active document from the editor
 * @param cssVariables css variable mapping to look at
 * @returns code lenses array or undefined
 * @description This function was made with the help of chatgpt 3.5
 */
export function highlightSimilarVariablesV2(
  document: vscode.TextDocument,
  cssVariables: AllCssVariableMappings | undefined
): vscode.CodeLens[] | undefined {
  if (!cssVariables) return undefined;

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
    let property = match[1].trim(); // Property name
    const values = match[2].trim().split(" "); // Property value

    // override property
    for (let key in cssVariables) {
      if (property.includes(key)) {
        property = key;
        break;
      }
    }
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
            command: "replacecsswithvars.replaceValue",
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
  }
  return codeLenses;
}
