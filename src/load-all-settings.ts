import * as vscode from "vscode";

export function loadAllSettings() {
  return {
    colorSettings: loadCategorySettings("colorSettings"),
    fontSizeSettings: loadCategorySettings("fontSizeSettings"),
    fontWeightSettings: loadCategorySettings("fontWeightSettings"),
    fontFamilySettings: loadCategorySettings("fontFamilySettings"),
    lineHeightSettings: loadCategorySettings("lineHeightSettings"),
    spacingSettings: loadCategorySettings("spacingSettings"),
    borderRadiiSettings: loadCategorySettings("borderRadiiSettings"),
  };
}

function getSettingsValue<T = string>(settingName: string) {
  return vscode.workspace.getConfiguration().get<T>(settingName);
}

type ConfigSettings =
  | "colorSettings"
  | "fontSizeSettings"
  | "fontWeightSettings"
  | "fontFamilySettings"
  | "lineHeightSettings"
  | "spacingSettings"
  | "borderRadiiSettings";

function loadCategorySettings(settingsName: ConfigSettings) {
  return {
    filePath: getSettingsValue(`findcssvariableusage.${settingsName}.filePath`),
    cssProperties: getSettingsValue<string[]>(
      `findcssvariableusage.${settingsName}.cssProperties`
    ),
    identifiers: getSettingsValue<string[]>(
      `findcssvariableusage.${settingsName}.identifiers`
    ),
  };
}
