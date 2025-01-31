import { parse } from '@typescript-eslint/parser';
import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/types';
import fs from 'fs';
import path from 'path';

function convertAstToJson(node: any): any {
  switch (node.type) {
    case 'ObjectExpression':
      const obj: any = {};
      for (const prop of node.properties) {
        obj[prop.key.name] = convertAstToJson(prop.value);
      }
      return obj;

    case 'ArrayExpression':
      return node.elements.map((element: any) => convertAstToJson(element));

    case 'Literal':
      return node.value;

    case 'Identifier':
      return node.name;

    case 'CallExpression':
      const methodName = node.callee.property.name;
      const args = node.arguments.map((arg: any) => convertAstToJson(arg));
      return {
        type: methodName,
        ...args[0]
      };

    default:
      console.warn(`Unhandled node type: ${node.type}`);
      return null;
  }
}

export function parseMigration(fileContent: string) {
  const ast = parse(fileContent, {
    range: true,
    loc: true,
  });

  const exportDecl = (ast.body as TSESTree.Statement[]).find((node): node is TSESTree.ExportNamedDeclaration =>
    node.type === AST_NODE_TYPES.ExportNamedDeclaration &&
    node.declaration?.type === AST_NODE_TYPES.VariableDeclaration &&
    node.declaration.declarations[0]?.id.type === AST_NODE_TYPES.Identifier &&
    node.declaration.declarations[0].id.name === 'migration'
  );

  if (!exportDecl || !exportDecl.declaration || exportDecl.declaration.type !== AST_NODE_TYPES.VariableDeclaration) {
    throw new Error('Migration export not found');
  }

  const migrationObj = exportDecl.declaration.declarations[0].init;

  return convertAstToJson(migrationObj);
}

export function parseMigrationFile(filePath: string) {
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }

  const content = fs.readFileSync(absolutePath, 'utf-8');
  return parseMigration(content);
}

if (require.main === module) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Please provide a migration file path');
    process.exit(1);
  }

  console.log(JSON.stringify(parseMigrationFile(filePath), null, 2));
}