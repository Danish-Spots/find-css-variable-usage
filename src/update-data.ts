import { ConfigurationChangeEvent, ExtensionContext } from "vscode";
import { readSourceFile } from "./read-files";
import { ConfigSettings, loadAllSettings } from "./load-all-settings";
import { AllCssVariableMappings, CssVariableMapping } from "./css-types";

let settingsValues = loadAllSettings();
let allVariables: AllCssVariableMappings = {};

export const ConfigChange =
  (context: ExtensionContext) => (event: ConfigurationChangeEvent) => {
    if (event.affectsConfiguration("replacecsswithvars")) {
      // Read files when the relevant configuration is changed
      reloadSettings(context);
    }
  };

export function reloadSettings(context: ExtensionContext) {
  settingsValues = loadAllSettings();
  createVariables();
  context.globalState.update("allVariables", allVariables);
}

function createVariables() {
  // Reset allVariables variable
  allVariables = {};

  // read all files
  const colorVars = readByKey("colorSettings");
  const borderRadiiVars = readByKey("borderRadiiSettings");
  const fontSizeVars = readByKey("fontSizeSettings");
  const fontWeightVars = readByKey("fontWeightSettings");
  const fontFamilyVars = readByKey("fontFamilySettings");
  const lineHeightVars = readByKey("lineHeightSettings");
  const spacingVars = readByKey("spacingSettings");

  // set variables
  mapCssVars("colorSettings", colorVars);
  mapCssVars("borderRadiiSettings", borderRadiiVars);
  mapCssVars("fontSizeSettings", fontSizeVars);
  mapCssVars("fontWeightSettings", fontWeightVars);
  mapCssVars("fontFamilySettings", fontFamilyVars);
  mapCssVars("lineHeightSettings", lineHeightVars);
  mapCssVars("spacingSettings", spacingVars);
}

function readByKey(key: ConfigSettings): CssVariableMapping | undefined {
  return readSourceFile(
    settingsValues[key].filePath,
    settingsValues[key].identifiers
  );
}

function mapCssVars(
  key: ConfigSettings,
  properties: CssVariableMapping | undefined
) {
  settingsValues[key].cssProperties?.forEach((prop) => {
    allVariables[prop] = properties;
  });
}
