import * as ts from 'typescript/lib/tsserverlibrary';

// logger(`File ${fileName} contains valid TypeScript`);

export function isValidTS(fileName: string): boolean {
  // Check if the file contains valid TypeScript
  const program = ts.createProgram([fileName], {});
  const sourceFile = program.getSourceFile(fileName);
  const diagnostics = ts.getPreEmitDiagnostics(program, sourceFile);

  if (diagnostics.length > 0) {
    // logger(`File ${fileName} contains TypeScript errors:`);
    diagnostics.forEach((diagnostic) => {
      if (diagnostic.file) {
        const { line, character } =
          diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
        const message = ts.flattenDiagnosticMessageText(
          diagnostic.messageText,
          '\n'
        );
        // logger(`  Line ${line + 1}, Column ${character + 1}: ${message}`);
      } else {
        // logger(
        //   `  ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`
        // );
      }
    });
    return false; // Skip further processing if there are errors
  }

  return true;
}
