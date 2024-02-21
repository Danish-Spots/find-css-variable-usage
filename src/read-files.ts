/* eslint-disable curly */
import * as vscode from "vscode";
import fs from "fs";

export interface CssVariable {
  /**
   * Value of css variable, eg #fff
   */
  value: string;
  /**
   * Name of css variable, eg --name-of-var
   */
  name: string;
  /**
   * Replacement suggestion, eg var(--name-of-var)
   */
  replacement: string;
}
export type CssVariableMapping = Record<string, CssVariable>;
/**
 * Interface representing all css variables mapped out of all files
 * To avoid conflicts between spacing and font sizes, they are mapped by keys
 * @interface
 */
export interface AllCssVariableMappings {
  /**
   * record of css properties with record of mappings
   * @type
   */
  [key: string]: CssVariableMapping | undefined;
}
export function readSourceFile(
  pathToFile: string | undefined,
  identifiers: string[] | undefined
): CssVariableMapping | undefined {
  const cssVariables: Record<string, CssVariable> = {};

  try {
    if (!pathToFile || pathToFile === "absolute-path/to/src/file")
      return cssVariables;

    const fileContent = fs.readFileSync(pathToFile, "utf-8");
    const matches = fileContent.matchAll(/(--[\w-]+):([^;]+);/g);
    if (matches)
      for (let [_match, name, value] of matches) {
        value = value.replace("#", "").trim();
        cssVariables[value] = createValue(name.trim(), value);
        if (identifiers) {
          if (identifiers.some((identifier) => name.includes(identifier))) {
            cssVariables[value] = createValue(name.trim(), value);
          }
        } else {
          cssVariables[value] = createValue(name.trim(), value);
        }
      }
    return cssVariables;
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error reading source file (path: ${pathToFile}): ${error}`
    );
    return undefined;
  }
}

function createValue(name: string, value: string) {
  return { value, name, replacement: `var(${name})` };
  // cssVariables[value] = { value, name, replacement: `var(${name})` };
}

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
