import { Range, TextDocument, WorkspaceEdit, workspace } from "vscode";

export const ReplaceValue = (args: ReplaceArgs) => {
  const replacementLine = args.fullMatch.replace(args.value, args.replacement);

  // // Apply the replacement to the document
  const editBuilder = new WorkspaceEdit();
  editBuilder.replace(args.document.uri, args.range, replacementLine);
  workspace.applyEdit(editBuilder);
};

interface ReplaceArgs {
  range: Range;
  fullMatch: string;
  value: string;
  replacement: string;
  document: TextDocument;
}
