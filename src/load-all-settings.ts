import * as vscode from "vscode";

export function loadAllSettings() {
  return {
    colorFilePath: getSettingsValue(
      "findcssvariableusage.colorSettings.filePath"
    ),
    fontFilePath: getSettingsValue(
      "findcssvariableusage.fontSettings.filePath"
    ),
    fontSizeIdentifer: getSettingsValue(
      "findcssvariableusage.fontSettings.fontSizeIdentifier"
    ),
    fontWeightIdentifier: getSettingsValue(
      "findcssvariableusage.fontSettings.fontWeightIdentifier"
    ),
    lineHeightIdentifer: getSettingsValue(
      "findcssvariableusage.fontSettings.lineHeightIdentifier"
    ),
    spacingFilePath: getSettingsValue(
      "findcssvariableusage.spacingSettings.FilePath"
    ),
    spacingApplyTo: getSettingsValue<string[]>(
      "findcssvariableusage.spacingSettings.applyToProperties"
    ),
  };
}

function getSettingsValue<T = string>(settingName: string) {
  return vscode.workspace.getConfiguration().get<T>(settingName);
}
