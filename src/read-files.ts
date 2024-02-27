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

    let fileContent;
    if (pathToFile.startsWith("./")) {
      if (vscode.workspace.workspaceFolders) {
        let f = vscode.workspace.workspaceFolders[0].uri.fsPath;
        // relative file path reading
        fileContent = fs.readFileSync(f + pathToFile.slice(1), "utf-8");
      }
    } else {
      // absolute file path
      fileContent = fs.readFileSync(pathToFile, "utf-8");
    }
    if (!fileContent) return cssVariables;

    const matches = fileContent.matchAll(/(--[\w-]+):([^;]+);/g);
    if (!matches) return cssVariables;
    for (let [_match, name, value] of matches) {
      // # is a private identifier in json objects
      value = value.replace("#", "").trim();
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
