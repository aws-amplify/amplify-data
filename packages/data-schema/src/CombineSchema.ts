import { DerivedApiDefinition } from '@aws-amplify/data-schema-types';
import { BaseSchema, GenericModelSchema } from './ModelSchema';
import { brand, Brand, IndexLimitUnion } from './util';

const COMBINED_SCHEMA_LIMIT = 50;

export type CombinedSchemaIndexesUnion = IndexLimitUnion<
  typeof COMBINED_SCHEMA_LIMIT
>[number];

const CombinedSchemaBrandName = 'CombinedSchema';
export const combinedSchemaBrand = brand(CombinedSchemaBrandName);
export type CombinedSchemaBrand = Brand<typeof CombinedSchemaBrandName>;

export type CombinedModelSchema<Schemas extends GenericModelSchema<any>[]> =
  CombinedSchemaBrand & { schemas: [...Schemas] } & BaseSchema<any>;

/**
 * The interface for merging up to 50 schemas into a single API.
 * @param schemas The schemas to combine into a single API
 * @returns An API and data model definition to be deployed with Amplify (Gen 2) experience (`processSchema(...)`)
 * or with the Amplify Data CDK construct (`@aws-amplify/data-construct`)
 */
export function combine<Schema extends GenericModelSchema<any>[]>(
  schemas: [...Schema],
): CombinedModelSchema<Schema> {
  return internalCombine(schemas);
}

function internalCombine<
  Schema extends GenericModelSchema<any>[],
  SchemasTuple extends [...Schema],
>(schemas: SchemasTuple): CombinedModelSchema<Schema> {
  return {
    schemas: schemas,
    data: {
      types: schemas.reduce(
        (prev, schema) => ({ ...prev, ...schema.data.types }),
        {},
      ),
    },
    models: schemas.reduce(
      (prev, schema) => ({ ...prev, ...schema.models }),
      {},
    ),
    transform(): DerivedApiDefinition {
      validateDuplicateTypeNames(schemas);

      const baseDefinition = {
        functionSlots: [],
        jsFunctions: [],
        schema: '',
        functionSchemaAccess: [],
        lambdaFunctions: {},
        sqlStatementFolderPaths: [],
      };

      return schemas.reduce<DerivedApiDefinition>((prev, schema) => {
        const transformedSchema = schema.transform();
        return {
          functionSlots: [
            ...prev.functionSlots,
            ...transformedSchema.functionSlots,
          ],
          jsFunctions: [...prev.jsFunctions, ...transformedSchema.jsFunctions],
          schema: [prev.schema, transformedSchema.schema].join('\n'),
          functionSchemaAccess: [
            ...prev.functionSchemaAccess,
            ...transformedSchema.functionSchemaAccess,
          ],
          lambdaFunctions: {
            ...prev.lambdaFunctions,
            ...transformedSchema.lambdaFunctions,
          },
          sqlStatementFolderPaths: {
            ...prev.sqlStatementFolderPaths,
            ...transformedSchema.sqlStatementFolderPaths,
          },
        };
      }, baseDefinition);
    },
    ...combinedSchemaBrand,
  };
}

function validateDuplicateTypeNames<Schema extends GenericModelSchema<any>[]>(
  schemas: [...Schema],
) {
  const allSchemaKeys = schemas.flatMap((s) => Object.keys(s.data.types));
  const keySet = new Set<string>();
  const duplicateKeySet = new Set<string>();
  allSchemaKeys.forEach((key) => {
    if (keySet.has(key)) {
      duplicateKeySet.add(key);
    } else {
      keySet.add(key);
    }
  });
  if (duplicateKeySet.size > 0) {
    throw new Error(
      `The schemas you are attempting to combine have a name collision. Please remove or rename ${Array.from(duplicateKeySet).join(', ')}.`,
    );
  }
}
