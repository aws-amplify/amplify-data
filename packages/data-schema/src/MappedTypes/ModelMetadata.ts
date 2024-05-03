import {
  type UnionToIntersection,
  type ExcludeEmpty,
} from '@aws-amplify/data-schema-types';
import { __modelMeta__, type PrimaryIndexIrShape } from '../runtime/';
import type { ModelType } from '../ModelType';
import type { ModelRelationalFieldParamShape } from '../ModelRelationalField';

export type ModelIdentifier<T> = {
  [Property in keyof T]: T[Property] extends ModelType<infer R, any>
    ? R['identifier'] extends PrimaryIndexIrShape
      ? { identifier: R['identifier'] }
      : never
    : never;
};

export type ModelSecondaryIndexes<T> = {
  [Property in keyof T]: T[Property] extends ModelType<infer R, any>
    ? R['secondaryIndexes'] extends any[]
      ? { secondaryIndexes: R['secondaryIndexes'] }
      : never
    : never;
};

export type RelationalMetadata<
  ResolvedSchema,
  ResolvedFields extends Record<string, unknown>,
  IdentifierMeta extends Record<string, { identifier: PrimaryIndexIrShape }>,
> = UnionToIntersection<
  ExcludeEmpty<
    {
      [ModelName in keyof ResolvedSchema]: {
        [Field in keyof ResolvedSchema[ModelName] as ResolvedSchema[ModelName][Field] extends ModelRelationalFieldParamShape
          ? ResolvedSchema[ModelName][Field]['relationshipType'] extends
              | 'hasOne'
              | 'belongsTo'
            ? // For hasOne we're adding metadata to the model itself
              // E.g. if Post hasOne Author, we need to add a postAuthorId field to the Post model
              ModelName
            : never
          : never]: ResolvedSchema[ModelName][Field] extends ModelRelationalFieldParamShape
          ? ResolvedSchema[ModelName][Field] extends ModelRelationalFieldParamShape
            ? ResolvedSchema[ModelName][Field]['relationshipType'] extends 'hasMany'
              ? {
                  relationalInputFields: Partial<
                    Record<
                      // For M:N and 1:M we add a parent model field to the child
                      `${Uncapitalize<ModelName & string>}`,
                      NormalizeInputFields<
                        ResolvedFields[ModelName & string],
                        ExtractModelIdentifier<ModelName, IdentifierMeta>
                      >
                    >
                  >;
                }
              : {
                  relationalInputFields: Partial<
                    Record<
                      // For 1:1 and Belongs To we add a child model field to the parent
                      Field,
                      NormalizeInputFields<
                        ResolvedFields[ResolvedSchema[ModelName][Field]['relatedModel']],
                        ExtractModelIdentifier<
                          `${Capitalize<Field & string>}`,
                          IdentifierMeta
                        >
                      >
                    >
                  >;
                }
            : never
          : never;
      };
    }[keyof ResolvedSchema]
  >
>;

type ExtractModelIdentifier<
  ModelName,
  IdentifierMeta extends Record<string, { identifier: PrimaryIndexIrShape }>,
> = ModelName extends keyof IdentifierMeta ? IdentifierMeta[ModelName] : never;

type NormalizeInputFields<
  ModelFields,
  IdentifierMeta extends { identifier: PrimaryIndexIrShape },
  IdFields extends keyof ModelFields =
    | (keyof IdentifierMeta['identifier']['pk'] & keyof ModelFields)
    | (IdentifierMeta['identifier']['sk'] extends never
        ? never
        : keyof IdentifierMeta['identifier']['sk'] & keyof ModelFields),
> = Partial<Omit<ModelFields, IdFields>> &
  Required<Pick<ModelFields, IdFields>>;
