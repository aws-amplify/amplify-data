import * as ts from "typescript";
import { AddColumnTransformation, CreateTableTransformation, DropTableTransformation, MigrationCommand, RemoveColumnTransformation } from "./build";

type MigrationInput = {
  up: MigrationCommand[],
  down: MigrationCommand[],
}

const factory = ts.factory;

function buildCommandNode(command: MigrationCommand): ts.Expression {
    switch (command.type) {
        case 'addColumn':
            return buildAddColumnCommand(command.content)
        case 'createTable':
            return buildCreateTableCommand(command.content)
        case 'removeColumn':
            return buildRemoveColumnCommand(command.content)
        case 'dropTable':
            return buildDropTableCommand(command.content)
    }
}

function buildAddColumnCommand(commandContent: AddColumnTransformation): ts.Expression {
    return factory.createCallExpression(
        factory.createPropertyAccessExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier("a"),
            factory.createIdentifier("sqlMigration")
          ),
          factory.createIdentifier("addColumn")
        ),
        undefined,
        [factory.createObjectLiteralExpression(
          [
            factory.createPropertyAssignment(
              factory.createIdentifier("table"),
              factory.createStringLiteral(commandContent.tableName)
            ),
            factory.createPropertyAssignment(
              factory.createIdentifier("column"),
              factory.createObjectLiteralExpression(
                [
                  factory.createPropertyAssignment(
                    factory.createIdentifier("name"),
                    factory.createStringLiteral(commandContent.columnDefinition.name)
                  ),
                  factory.createPropertyAssignment(
                    factory.createIdentifier("type"),
                    factory.createStringLiteral(commandContent.columnDefinition.type)
                  )
                ],
                true
              )
            )
          ],
          true
        )]
      )
}

function buildCreateTableCommand(commandContent: CreateTableTransformation): ts.Expression {
    return factory.createCallExpression(
        factory.createPropertyAccessExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier("a"),
            factory.createIdentifier("sqlMigration")
          ),
          factory.createIdentifier("createTable")
        ),
        undefined,
        [factory.createObjectLiteralExpression(
          [
            factory.createPropertyAssignment(
              factory.createIdentifier("name"),
              factory.createStringLiteral(commandContent.tableName)
            ),
            factory.createPropertyAssignment(
              factory.createIdentifier("columns"),
              factory.createArrayLiteralExpression(
                    commandContent.columns.map((columnInfo) => (
                        factory.createObjectLiteralExpression(
                            [
                              factory.createPropertyAssignment(
                                factory.createIdentifier("name"),
                                factory.createStringLiteral(columnInfo.name)
                              ),
                              factory.createPropertyAssignment(
                                factory.createIdentifier("type"),
                                factory.createStringLiteral(columnInfo.type)
                              )
                            ],
                            false
                          )
                    )),
                true
              )
            )
          ],
          true
        )]
      )
}

function buildRemoveColumnCommand(commandContent: RemoveColumnTransformation): ts.Expression {
    return factory.createCallExpression(
        factory.createPropertyAccessExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier("a"),
            factory.createIdentifier("sqlMigration")
          ),
          factory.createIdentifier("dropColumn")
        ),
        undefined,
        [factory.createObjectLiteralExpression(
          [
            factory.createPropertyAssignment(
              factory.createIdentifier("table"),
              factory.createStringLiteral(commandContent.tableName)
            ),
            factory.createPropertyAssignment(
              factory.createIdentifier("column"),
              factory.createObjectLiteralExpression(
                [factory.createPropertyAssignment(
                  factory.createIdentifier("name"),
                  factory.createStringLiteral(commandContent.columnName)
                )],
                true
              )
            )
          ],
          true
        )]
      )
}

function buildDropTableCommand(commandContent: DropTableTransformation): ts.Expression {
    return factory.createCallExpression(
        factory.createPropertyAccessExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier("a"),
            factory.createIdentifier("sqlMigration")
          ),
          factory.createIdentifier("dropTable")
        ),
        undefined,
        [factory.createObjectLiteralExpression(
          [factory.createPropertyAssignment(
            factory.createIdentifier("name"),
            factory.createStringLiteral(commandContent.tableName)
          )],
          true
        )]
      )
}

export function migrationFactory(migrationContent: MigrationInput): ts.Node[] {
    const upNodes = migrationContent.up.map((upCommand) => buildCommandNode(upCommand));
    const downNodes = migrationContent.down.map((downCommand) => buildCommandNode(downCommand));

    return [
        factory.createImportDeclaration(
          undefined,
          factory.createImportClause(
            false,
            undefined,
            factory.createNamedImports([
              factory.createImportSpecifier(
                false,
                undefined,
                factory.createIdentifier("a")
              ),
              factory.createImportSpecifier(
                true,
                undefined,
                factory.createIdentifier("AmplifySqlMigration")
              )
            ])
          ),
          factory.createStringLiteral("@aws-amplify/data-schema"),
          undefined
        ),
        factory.createVariableStatement(
          [factory.createToken(ts.SyntaxKind.ExportKeyword)],
          factory.createVariableDeclarationList(
            [factory.createVariableDeclaration(
              factory.createIdentifier("migration"),
              undefined,
              factory.createTypeReferenceNode(
                factory.createIdentifier("AmplifySqlMigration"),
                undefined
              ),
              factory.createObjectLiteralExpression(
                [factory.createPropertyAssignment(
                  factory.createIdentifier("steps"),
                  factory.createArrayLiteralExpression(
                    [factory.createObjectLiteralExpression(
                      [
                        factory.createPropertyAssignment(
                          factory.createIdentifier("up"),
                          factory.createArrayLiteralExpression(
                            upNodes,
                            true
                          )
                        ),
                        factory.createPropertyAssignment(
                          factory.createIdentifier("down"),
                          factory.createArrayLiteralExpression(
                            downNodes,
                            true
                          )
                        )
                      ],
                      true
                    )],
                    true
                  )
                )],
                true
              )
            )],
            ts.NodeFlags.Const | ts.NodeFlags.Constant | ts.NodeFlags.Constant
          )
        )
      ];
}

export function renderAstToString(nodes: ts.Node[]): string {
    // Create a virtual source file
    const sourceFile = ts.createSourceFile(
      "virtualFile.ts",
      "",
      ts.ScriptTarget.Latest,
      false,
      ts.ScriptKind.TS
    );
  
    // Create a printer
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  
    // Print each node and join the results
    const result = nodes.map(node => 
      printer.printNode(ts.EmitHint.Unspecified, node, sourceFile)
    ).join("\n");
  
    return result;
  }
