import {
  CancellationToken,
  CodeLens,
  CodeLensProvider,
  Event,
  ExtensionContext,
  ProviderResult,
  TextDocument,
} from "vscode";
import { highlightSimilarVariablesV2 } from "./highlight";
import { AllCssVariableMappings } from "./css-types";

export class CssVariableSuggestionCodeLensProvider implements CodeLensProvider {
  onDidChangeCodeLenses?: Event<void> | undefined;
  constructor(private context: ExtensionContext) {}

  provideCodeLenses(
    document: TextDocument,
    token: CancellationToken
  ): ProviderResult<CodeLens[]> {
    // Call your analysis function to get potential suggestions
    const allVars: AllCssVariableMappings | undefined =
      this.context.globalState.get("allVariables");
    return highlightSimilarVariablesV2(document, allVars);
  }
  resolveCodeLens?(
    codeLens: CodeLens,
    token: CancellationToken
  ): ProviderResult<CodeLens> {
    return codeLens;
  }
}
