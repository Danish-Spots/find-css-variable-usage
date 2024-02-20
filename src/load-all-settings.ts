import * as vscode from "vscode";

export function loadAllSettings() {
  return {
    colorSettings: {
      filePath: getSettingsValue("findcssvariableusage.colorSettings.filePath"),
    },
    fontSettings: {
      filePath: getSettingsValue("findcssvariableusage.fontSettings.filePath"),
      fontSize: getSettingsValue(
        "findcssvariableusage.fontSettings.fontSizeIdentifier"
      ),
      fontWeight: getSettingsValue(
        "findcssvariableusage.fontSettings.fontWeightIdentifier"
      ),
      lineHeight: getSettingsValue(
        "findcssvariableusage.fontSettings.lineHeightIdentifier"
      ),
      fontFamily: getSettingsValue(
        "findcssvariableusage.fontSettings.fontFamilyIdentifier"
      ),
    },
    spacingSettings: {
      filePath: getSettingsValue(
        "findcssvariableusage.spacingSettings.FilePath"
      ),
      spacingApplyTo: getSettingsValue<string[]>(
        "findcssvariableusage.spacingSettings.applyToProperties"
      ),
    },
    otherSettings: {
      cssPropertiesToLookAt: getSettingsValue<string[]>(
        "findcssvariableusage.otherSettings.cssProperties"
      ),
    },
  };
}

function getSettingsValue<T = string>(settingName: string) {
  return vscode.workspace.getConfiguration().get<T>(settingName);
}
