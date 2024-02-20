import * as vscode from "vscode";
import fs from "fs";

export function readSourceFiles(
  settingsName: string,
  regexMatcher: RegExp,
  properties: { name: string; conditionFn: (() => boolean) | undefined }[]
): Record<string, { name: string; value: string }[]> | undefined {
  const sourceFile =
    vscode.workspace.getConfiguration().get<string>(settingsName) || undefined;

  const cssVariables: Record<string, { name: string; value: string }[]> = {};

  try {
    if (sourceFile === undefined) return undefined;
    const sourceFileContent = fs.readFileSync(sourceFile, "utf-8");

    const matches = sourceFileContent.matchAll(regexMatcher);
    for (const match of matches) {
      const [, name, value] = match;
      // Check if the variable is associated with any checked property for this file
      properties.forEach((cssProperty) => {
        if (!cssVariables[cssProperty.name]) {
          cssVariables[cssProperty.name] = [];
        }

        if (
          !cssProperty.conditionFn ||
          (cssProperty.conditionFn && cssProperty.conditionFn())
        ) {
          cssVariables[cssProperty.name].push({
            name: name.trim(),
            value: value.trim(),
          });
        }
      });
    }
    console.table(cssVariables);
    return cssVariables;
  } catch (error) {
    console.error("Error reading source file:", error);
    return undefined;
  }
}
