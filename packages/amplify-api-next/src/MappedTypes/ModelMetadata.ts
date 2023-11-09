import {
  type UnionToIntersection,
  type ExcludeEmpty,
  __modelMeta__,
} from '@aws-amplify/amplify-api-next-types-alpha';
import type { ModelType } from '../ModelType';
import type { ModelRelationalFieldParamShape } from '../ModelRelationalField';

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
  IdentifierMeta extends Record<string, any>,
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

type ExtractModelIdentifier<ModelName, IdentifierMeta> =
  ModelName extends keyof IdentifierMeta ? IdentifierMeta[ModelName] : never;

type NormalizeInputFields<
  ModelFields,
  IdentifierMeta extends Record<string, any>,
> = Partial<Omit<ModelFields, IdentifierMeta['identifier']>> &
  Required<Pick<ModelFields, IdentifierMeta['identifier']>>;
