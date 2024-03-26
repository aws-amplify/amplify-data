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
      const baseDefinition = {
        functionSlots: [],
        jsFunctions: [],
        schema: '',
        functionSchemaAccess: [],
        lambdaFunctions: {},
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
        };
      }, baseDefinition);
    },
    ...combinedSchemaBrand,
  };
}
