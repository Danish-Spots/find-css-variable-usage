/* eslint-disable curly */
import * as vscode from "vscode";
import { AllCssVariableMappings, CssVariableMapping } from "./read-files";

export function highlightSimilarVariablesV2(
  editor: vscode.TextEditor,
  cssVariables: AllCssVariableMappings | undefined,
  cssProperties: String[]
): void {
  if (!cssVariables || !cssProperties) return;

  const decorations: vscode.DecorationOptions[] = [];
  // Iterate over each line in the document
  // Regular expression to match CSS properties and values in the entire document
  const propertyRegex = /([a-zA-Z-]+)\s*:\s*([^;]+)/g;
  // Array to store code lenses
  let codeLenses = [];
  // Combine all lines into a single string
  const entireDocumentText = editor.document.getText();

  // Match properties and values using the regular expression
  let match;
  while ((match = propertyRegex.exec(entireDocumentText)) !== null) {
    const fullMatch = match[0];
    const property = match[1]; // Property name
    const value = match[2]; // Property value
    const variableMappings = cssVariables[property];

    if (variableMappings) {
      const matchingValue = variableMappings[value];
      if (matchingValue) {
        console.log(matchingValue);
        const matchStart = editor.document.offsetAt(
          editor.document.getWordRangeAtPosition(
            editor.document.positionAt(match.index).translate(0, 1)
          )?.start || editor.document.positionAt(match.index).translate(0, 1)
        );
        const matchEnd = matchStart + fullMatch.length;
        const range = new vscode.Range(
          editor.document.positionAt(matchStart),
          editor.document.positionAt(matchEnd)
        );

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

        const codeLens = new vscode.CodeLens(range);
        codeLens.command = {
          title: "Replace with modified value",
          command: "extension.replaceValue",
          arguments: [range, property, value],
        };

        // Add the code lens to the array
        codeLenses.push(codeLens);
        console.log(matchStart);
      }
    }

    // Process the property-value pair as needed
    // console.log(`Match: ${fullMatch}, Property: ${property}, Value: ${value}`);
  }

  editor.codeLenses;
  //   editor.document.cssVariables.forEach(({ name, value }) => {
  //     const valueRegex = new RegExp(`${value}`, "g");

  //     let match;
  //     while ((match = valueRegex.exec(editor.document.getText()))) {
  //       const matchStart = editor.document.offsetAt(
  //         editor.document.getWordRangeAtPosition(
  //           editor.document.positionAt(match.index).translate(0, 1)
  //         )?.start || editor.document.positionAt(match.index).translate(0, 1)
  //       );
  //       const matchEnd = matchStart + match[0].length;

  //       const range = new vscode.Range(
  //         editor.document.positionAt(matchStart),
  //         editor.document.positionAt(matchEnd)
  //       );

  //       decorations.push({
  //         range,
  //         renderOptions: {
  //           after: {
  //             contentText: `    Replace with: ${name}`,
  //             color: textColor,
  //           },
  //         },
  //       });

  //       valueRegex.lastIndex = match.index + 1;
  //       console.log(decorations);
  //     }
  //   });

  //   editor.setDecorations(variableDecorationType, decorations);
}

// Potential autocomplete/intellisense for css variables
//  const completionProvider = vscode.languages.registerCompletionItemProvider(
//    { language: "css" },
//    {
//      provideCompletionItems: (document, position, token, context) => {
//        const linePrefix = document
//          .lineAt(position)
//          .text.substr(0, position.character);

//        // Regular expression to match CSS properties and values
//        const propertyRegex = /([a-zA-Z-]+)\s*:\s*([^;]*)/;

//        // Match properties and values using the regular expression
//        let match = propertyRegex.exec(linePrefix);
//        if (match) {
//          const property = match[1]; // Property name
//          const value = match[2]; // Property value

//          // Create a completion item with a modified value
//          const suggestedReplacement = `${property}: ${modifyValue(value)}`;
//          const completionItem = new vscode.CompletionItem(suggestedReplacement);
//          completionItem.insertText = new vscode.SnippetString(
//            suggestedReplacement
//          );
//          completionItem.documentation = "Replace with modified value";

//          return [completionItem];
//        }

//        return [];
//      },
//    }
//  );
