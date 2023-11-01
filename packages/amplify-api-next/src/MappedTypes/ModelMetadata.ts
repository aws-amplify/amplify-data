import {
  type UnionToIntersection,
  type ExcludeEmpty,
  __modelMeta__,
} from '@aws-amplify/amplify-api-next-types-alpha';
import type { ModelSchema } from '../ModelSchema';
import type { ModelType } from '../ModelType';
import type {
  ModelRelationalField,
  ModelRelationalFieldParamShape,
} from '../ModelRelationalField';
import type { SchemaTypes, ModelTypes } from './ResolveSchema';
import type { ModelField } from '../ModelField';

export type ModelIdentifier<T> = {
  [Property in keyof T]: T[Property] extends ModelType<infer R, any>
    ? // reduce back to union
      R['identifier'] extends any[]
      ? { identifier: R['identifier'][number] }
      : never
    : never;
};

export type RelationalMetadata<
  ResolvedSchema,
  ResolvedFields extends Record<string, unknown>,
> = UnionToIntersection<
  ExcludeEmpty<
    {
      [ModelName in keyof ResolvedSchema]: {
        [Field in keyof ResolvedSchema[ModelName] as ResolvedSchema[ModelName][Field] extends ModelRelationalFieldParamShape
          ? ResolvedSchema[ModelName][Field]['relationshipType'] extends 'hasMany'
            ? // For hasMany we're adding metadata to the related model
              // E.g. if Post hasMany Comments, we need to add a postCommentsId field to the Comment model
              ResolvedSchema[ModelName][Field]['relatedModel']
            : ResolvedSchema[ModelName][Field]['relationshipType'] extends
                | 'hasOne'
                | 'belongsTo'
            ? // For hasOne we're adding metadata to the model itself
              // E.g. if Post hasOne Author, we need to add a postAuthorId field to the Post model
              ModelName
            : ResolvedSchema[ModelName][Field]['relationshipType'] extends 'manyToMany'
            ? ResolvedSchema[ModelName][Field]['relationName'] extends string
              ? ResolvedSchema[ModelName][Field]['relationName']
              : never
            : never
          : never]: ResolvedSchema[ModelName][Field] extends ModelRelationalFieldParamShape
          ? ResolvedSchema[ModelName][Field] extends ModelRelationalFieldParamShape
            ? ResolvedSchema[ModelName][Field]['relationshipType'] extends
                | 'manyToMany'
                | 'hasMany'
              ? {
                  relationalInputFields: Partial<
                    Record<
                      // For M:N and 1:M result we add a parent model field to the child
                      `${Uncapitalize<ModelName & string>}`,
                      ResolvedFields[ModelName & string]
                    >
                  >;
                }
              : {
                  relationalInputFields: Partial<
                    Record<
                      // For 1:1 and Belongs To we add a child model field to the parent
                      Field,
                      ResolvedFields[ResolvedSchema[ModelName][Field]['relatedModel']]
                    >
                  >;
                }
            : never
          : never;
      };
    }[keyof ResolvedSchema]
  >
>;

export type ExtractExplicitScalarFields<
  Schema extends ModelSchema<any>,
  Scalars = ScalarFieldTypes<ModelTypes<SchemaTypes<Schema>>>,
> = {
  [ModelName in keyof Scalars]: {
    explicitScalarTypes: Scalars[ModelName];
  };
};

type ScalarFieldTypes<T> = {
  [ModelProp in keyof T]: {
    [FieldProp in keyof T[ModelProp] as T[ModelProp][FieldProp] extends ModelRelationalField<
      any,
      any
    >
      ? never
      : FieldProp]: T[ModelProp][FieldProp] extends ModelField<
      infer R,
      any,
      any
    >
      ? R
      : never;
  };
};
