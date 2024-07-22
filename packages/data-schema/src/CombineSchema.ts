import { GenericModelSchema } from './builder/ModelSchema';
import { brand, Brand, IndexLimitUnion } from './util';

const COMBINED_SCHEMA_LIMIT = 50;

export type CombinedSchemaIndexesUnion = IndexLimitUnion<
  typeof COMBINED_SCHEMA_LIMIT
>[number];

const CombinedSchemaBrandName = 'CombinedSchema';
export const combinedSchemaBrand = brand(CombinedSchemaBrandName);
export type CombinedSchemaBrand = Brand<typeof CombinedSchemaBrandName>;

export type CombinedModelSchema<Schemas extends GenericModelSchema<any>[]> =
  CombinedSchemaBrand & { schemas: [...Schemas] };

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
  validateDuplicateTypeNames(schemas);
  return {
    ...combinedSchemaBrand,
    schemas: schemas,
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
