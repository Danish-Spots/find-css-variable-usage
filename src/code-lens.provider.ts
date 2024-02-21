import {
  CancellationToken,
  CodeLens,
  CodeLensProvider,
  Event,
  ProviderResult,
  TextDocument,
  window,
} from "vscode";
import { highlightSimilarVariablesV2 } from "./highlight";
import { allVariables } from "./extension";

export class CssVariableSuggestionCodeLensProvider implements CodeLensProvider {
  onDidChangeCodeLenses?: Event<void> | undefined;
  provideCodeLenses(
    document: TextDocument,
    token: CancellationToken
  ): ProviderResult<CodeLens[]> {
    const codeLenses: CodeLens[] = [];

    // Call your analysis function to get potential suggestions
    const suggestions = highlightSimilarVariablesV2(document, allVariables, [
      "color",
    ]);
    suggestions?.forEach(({ range, command }) => {
      codeLenses.push(new CodeLens(range, command));
    });

    return codeLenses;
  }
  resolveCodeLens?(
    codeLens: CodeLens,
    token: CancellationToken
  ): ProviderResult<CodeLens> {
    throw new Error("Method not implemented.");
  }
}
