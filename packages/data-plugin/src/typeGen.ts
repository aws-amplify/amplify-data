import * as ts from 'typescript';
import * as fs from 'fs';

export function generateSchemaTypes(
  schemaFilePath: string,
  outputFilePath: string,
) {
  const schemaContent = fs.readFileSync(schemaFilePath, 'utf-8');

  const sourceFile = ts.createSourceFile(
    'schema.ts',
    schemaContent,
    ts.ScriptTarget.Latest,
    true,
  );

  // Find the schema variable declaration
  let schemaNode: ts.ObjectLiteralExpression | undefined;
  ts.forEachChild(sourceFile, (node) => {
    if (
      ts.isVariableStatement(node) &&
      node.declarationList.declarations[0].name.getText() === 'schema'
    ) {
      const initializer = (
        node.declarationList.declarations[0] as ts.VariableDeclaration
      ).initializer;
      if (initializer && ts.isCallExpression(initializer)) {
        const arg = initializer.arguments[0];
        if (arg && ts.isObjectLiteralExpression(arg)) {
          schemaNode = arg;
        }
      }
    }
  });

  if (!schemaNode) {
    throw new Error('Schema not found in the source file');
  }

  // Generate type declarations
  const typeDeclarations: string[] = ['export type Schema = {'];

  schemaNode.properties.forEach((prop) => {
    if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
      const modelName = prop.name.text;
      typeDeclarations.push(`  ${modelName}: {`);
      typeDeclarations.push(`    __entityType: 'model';`);
      typeDeclarations.push(`    identifier: { readonly id: string; };`);
      typeDeclarations.push(`    secondaryIndexes: unknown;`);
      typeDeclarations.push(`    type: {`);

      if (ts.isCallExpression(prop.initializer)) {
        const modelArg = prop.initializer.arguments[0];
        if (modelArg && ts.isObjectLiteralExpression(modelArg)) {
          const fields = generateFieldTypes(modelArg);
          typeDeclarations.push(...fields.map((f) => `      ${f}`));
        }
      }

      typeDeclarations.push(`      readonly id: string;`);
      typeDeclarations.push(`      readonly createdAt: string;`);
      typeDeclarations.push(`      readonly updatedAt: string;`);
      typeDeclarations.push(`    };`);

      // Generate createType, updateType, and deleteType
      generateCRUDTypes(modelName, prop.initializer, typeDeclarations);

      typeDeclarations.push(`    nestedTypes: {};`);
      typeDeclarations.push(
        `    __meta: { listOptionsPkParams: unknown; disabledOperations: {}; };`,
      );
      typeDeclarations.push(`  };`);
    }
  });

  typeDeclarations.push('};');

  // Add utility types
  typeDeclarations.push(getUtilityTypes());

  // Write the generated types to the output file
  fs.writeFileSync(outputFilePath, typeDeclarations.join('\n'), 'utf-8');
}

function generateFieldTypes(
  modelArg: ts.ObjectLiteralExpression,
  noRelations = false,
): string[] {
  const fields: string[] = [];
  modelArg.properties.forEach((field) => {
    if (ts.isPropertyAssignment(field) && ts.isIdentifier(field.name)) {
      const fieldName = field.name.text;
      let fieldType = 'any'; // Default type
      let isRequired = false;

      let isRelation = false;

      if (ts.isCallExpression(field.initializer)) {
        let methodName = field.initializer.expression.getText();
        isRequired = checkIfRequired(field.initializer);

        if (isRequired) {
          methodName = methodName.replace('().required', '');
        }

        // Extract the relation name for hasMany and belongsTo
        let relationName: string | undefined;
        if (
          methodName === 'a.hasMany' ||
          methodName === 'a.hasOne' ||
          methodName === 'a.belongsTo'
        ) {
          isRelation = true;
          if (field.initializer.arguments.length > 0) {
            const firstArg = field.initializer.arguments[0];
            if (ts.isStringLiteral(firstArg)) {
              relationName = firstArg.text;
            }
          }
        }

        // Use the extracted relationName in getFieldType
        fieldType = getFieldType(methodName, relationName);
      }

      if (noRelations && isRelation) {
        // nothing
      } else {
        fields.push(
          `${fieldName}${isRequired || isRelation ? '' : '?'}: ${fieldType}${
            isRequired || isRelation ? '' : ' | null'
          };`,
        );
      }
    }
  });
  return fields;
}

function getFieldType(methodName: string, relationName?: string): string {
  switch (methodName) {
    case 'a.id':
    case 'a.string':
      return 'string';
    case 'a.integer':
      return 'number';
    case 'a.boolean':
      return 'boolean';
    case 'a.hasMany':
      return `(options?: { authMode?: AuthMode; authToken?: string; limit?: number; nextToken?: string | null; headers?: CustomHeaders; } | undefined) => ListReturnValue<Schema['${relationName}']>`;
    case 'a.hasOne':
      return `(options?: { authMode?: AuthMode; authToken?: string; headers?: CustomHeaders; } | undefined) => SingularReturnValue<Schema['${relationName}']>`;
    case 'a.belongsTo':
      return `(options?: { authMode?: AuthMode; authToken?: string; headers?: CustomHeaders; } | undefined) => SingularReturnValue<Schema['${relationName}']>`;
    default:
      return 'any';
  }
}

function checkIfRequired(node: ts.CallExpression): boolean {
  let current: ts.Expression = node;
  while (ts.isCallExpression(current)) {
    if (
      ts.isPropertyAccessExpression(current.expression) &&
      current.expression.name.text === 'required'
    ) {
      return true;
    }
    current = current.expression;
  }
  return false;
}

function generateCRUDTypes(
  modelName: string,
  initializer: ts.Expression,
  typeDeclarations: string[],
) {
  if (ts.isCallExpression(initializer)) {
    const modelArg = initializer.arguments[0];
    if (modelArg && ts.isObjectLiteralExpression(modelArg)) {
      const fields = generateFieldTypes(modelArg, true);

      // createType
      typeDeclarations.push(`    createType: {`);
      typeDeclarations.push(...fields.map((f) => `      ${f}`));
      typeDeclarations.push(`      id?: string | undefined;`);
      typeDeclarations.push(`    };`);

      // updateType
      typeDeclarations.push(`    updateType: {`);
      typeDeclarations.push(`      id: string;`);
      typeDeclarations.push(
        ...fields.map(
          (f) => `      ${f.includes('?:') ? f : f.replace(':', '?:')}`,
        ),
      );
      typeDeclarations.push(`    };`);

      // deleteType
      typeDeclarations.push(`    deleteType: {`);
      typeDeclarations.push(`      readonly id: string;`);
      typeDeclarations.push(`    };`);
    }
  }
}

function getUtilityTypes(): string {
  return `
// util types

type ListReturnValue<T> = Promise<{
  data: Array<T>;
  nextToken?: string | null;
  errors?: GraphQLFormattedError[];
  extensions?: {
    [key: string]: any;
  };
}>;

type SingularReturnValue<T> = Promise<{
  data: T | null;
  errors?: GraphQLFormattedError[];
  extensions?: {
    [key: string]: any;
  };
}>;

type AuthMode =
  | 'apiKey'
  | 'iam'
  | 'identityPool'
  | 'oidc'
  | 'userPool'
  | 'lambda'
  | 'none';

type RequestOptions = {
  url: string;
  queryString: string;
  method?: string;
};

type CustomHeaders =
  | Record<string, string>
  | ((requestOptions?: RequestOptions) => Promise<Record<string, string>>);

interface SourceLocation {
  readonly line: number;
  readonly column: number;
}

interface GraphQLFormattedError {
  readonly message: string;
  readonly errorType: string;
  readonly errorInfo: null | { [key: string]: unknown };
  readonly locations?: ReadonlyArray<SourceLocation>;
  readonly path?: ReadonlyArray<string | number>;
  readonly extensions?: { [key: string]: unknown };
}`;
}
