/* eslint-disable curly */
import * as vscode from "vscode";
import fs from "fs";
import { CssVariable, CssVariableMapping } from "./css-types";

/**
 * Function that takes a path to a file and css variable identifiers array and
 * builds an object of css value name mappings
 * @param pathToFile path to the file where the css variable are (absolute or relative both work)
 * @param identifiers the identifiers to be used when reading the path values.
 * @returns An object with css values as keys and then object containing value,
 *  css variable name and replacement
 * @description this function was built with help from chatgpt 3.5
 */
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
