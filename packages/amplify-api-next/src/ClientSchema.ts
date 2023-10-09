import type { Authorization, ImpliedAuthFields } from './Authorization';
import type { Prettify, UnionToIntersection, ExcludeEmpty } from './util';
import type { ModelField } from './ModelField';
import type {
  ModelRelationalField,
  ModelRelationalFieldParamShape,
  ModelRelationalTypeArgFactory,
} from './ModelRelationalField';
import type { ModelType, ModelTypeParamShape } from './ModelType';
import type { ModelSchema } from './ModelSchema';
import { __modelMeta__ } from '@aws-amplify/amplify-api-next-types-alpha';

/**
 * Types for unwrapping generic type args into client-consumable types
 *
 * @typeParam Schema - Type Beast schema type
 *
 * The following params are used solely as variables in order to simplify mapped type usage.
 * They should not receive external type args.
 *
 * @typeParam Fields - flattened Schema/Models/Fields structure with field type params extracted
 * @typeParam FieldsWithRelationships - Fields + resolved relational fields
 * @typeParam ResolvedFields - optionality enforced on nullable types (+?); These are the client-facing types used for CRUDL response shapes
 *
 * @typeParam Meta - Stores schema metadata: identifier, relationship metadata;
 * used by `API.generateClient` to craft strongly typed mutation inputs; hidden from customer-facing types behind __modelMeta__ symbol
 *
 */
export type ClientSchema<
  Schema extends ModelSchema<any>,
  // Todo: rename Fields to FlattenedSchema
  Fields = FieldTypes<ModelTypes<SchemaTypes<Schema>>>,
  FieldsWithInjectedModels = InjectImplicitModels<Fields>,
  FieldsWithRelationships = ResolveRelationships<FieldsWithInjectedModels>,
  FlatFieldsWithRelationships = ResolveRelationships<
    FieldsWithInjectedModels,
    true
  >,
  ResolvedFields extends Record<string, unknown> = Intersection<
    FilterFieldTypes<RequiredFieldTypes<FieldsWithRelationships>>,
    FilterFieldTypes<OptionalFieldTypes<FieldsWithRelationships>>,
    FilterFieldTypes<ModelImpliedAuthFields<Schema>>
  >,
  IdentifierMeta = ModelMeta<SchemaTypes<Schema>>,
  RelationshipMeta = ExtractRelationalMetadata<Fields, ResolvedFields>,
  Meta = IdentifierMeta &
    RelationshipMeta & { FlatSchema: FlatFieldsWithRelationships },
> = Prettify<
  ResolvedFields & {
    [__modelMeta__]: Meta;
  }
>;

type ExtractRelationalMetadata<
  FlattenedSchema,
  ResolvedFields extends Record<string, unknown>,
> = UnionToIntersection<
  ExcludeEmpty<
    {
      [ModelName in keyof FlattenedSchema]: {
        [Field in keyof FlattenedSchema[ModelName] as FlattenedSchema[ModelName][Field] extends ModelRelationalFieldParamShape
          ? FlattenedSchema[ModelName][Field]['relationshipType'] extends 'hasMany'
            ? // For hasMany we're adding metadata to the related model
              // E.g. if Post hasMany Comments, we need to add a postCommentsId field to the Comment model
              FlattenedSchema[ModelName][Field]['relatedModel']
            : FlattenedSchema[ModelName][Field]['relationshipType'] extends
                | 'hasOne'
                | 'belongsTo'
            ? // For hasOne we're adding metadata to the model itself
              // E.g. if Post hasOne Author, we need to add a postAuthorId field to the Post model
              ModelName
            : FlattenedSchema[ModelName][Field]['relationshipType'] extends 'manyToMany'
            ? FlattenedSchema[ModelName][Field]['connectionName'] extends string
              ? FlattenedSchema[ModelName][Field]['connectionName']
              : never
            : never
          : never]: FlattenedSchema[ModelName][Field] extends ModelRelationalFieldParamShape
          ? FlattenedSchema[ModelName][Field] extends ModelRelationalFieldParamShape
            ? FlattenedSchema[ModelName][Field]['relationshipType'] extends 'manyToMany'
              ? {
                  relationships: Record<
                    `${Lowercase<ModelName & string>}`,
                    ResolvedFields[ModelName & string]
                  >;
                }
              : {
                  relationships: Partial<
                    Record<
                      Field,
                      ResolvedFields[FlattenedSchema[ModelName][Field]['relatedModel']]
                    >
                  >;
                }
            : never
          : never;
      };
    }[keyof FlattenedSchema]
  >
>;

type SchemaTypes<T> = T extends ModelSchema<infer R> ? R['models'] : never;

export type ModelTypes<Schema> = {
  [Property in keyof Schema]: Schema[Property] extends ModelType<infer R, any>
    ? R['fields']
    : never;
};

type ModelMeta<T> = {
  [Property in keyof T]: T[Property] extends ModelType<infer R, any>
    ? // reduce back to union
      R['identifier'] extends any[]
      ? { identifier: R['identifier'][number] }
      : never
    : never;
};

type ModelImpliedAuthFields<Schema extends ModelSchema<any>> = {
  [ModelKey in keyof Schema['data']['models']]: Schema['data']['models'][ModelKey] extends ModelType<
    infer Model,
    any
  >
    ? ImpliedAuthFields<Model['authorization'][number]> &
        ImpliedAuthFieldsFromFields<Model>
    : object;
};

type ImpliedAuthFieldsFromFields<T> = UnionToIntersection<
  T extends ModelTypeParamShape
    ? T['fields'][keyof T['fields']] extends
        | ModelField<any, any, infer Auth>
        | ModelRelationalField<any, any, any, infer Auth>
      ? Auth extends Authorization<any, any>
        ? ImpliedAuthFields<Auth>
        : object
      : object
    : object
>;

/**
 * infer and massage field types
 */

type ExtractImplicitModelNames<Schema> = UnionToIntersection<
  ExcludeEmpty<
    {
      [ModelProp in keyof Schema]: {
        [FieldProp in keyof Schema[ModelProp] as Schema[ModelProp][FieldProp] extends ModelRelationalFieldParamShape
          ? Schema[ModelProp][FieldProp]['connectionName'] extends string
            ? Schema[ModelProp][FieldProp]['connectionName'] extends keyof Schema
              ? never
              : Schema[ModelProp][FieldProp]['connectionName']
            : never
          : never]: { id?: string } & Record<
          `${Lowercase<ModelProp & string>}`,
          ModelRelationalTypeArgFactory<ModelProp & string, 'hasMany', true>
        >; // implicit model will always have id: string as the PK
      };
    }[keyof Schema]
  >
>;

type InjectImplicitModels<Schema> = Prettify<
  Schema & ExtractImplicitModelNames<Schema>
>;

/* 
  Flat === true => custom sel set output
*/
type GetRelationshipRef<
  T,
  RM extends keyof T,
  TypeArg extends ModelRelationalFieldParamShape,
  Flat extends boolean,
  ResolvedModel = ResolveRelationalFieldsForModel<T, RM, Flat>,
  Model = TypeArg['valueRequired'] extends true
    ? ResolvedModel
    : ResolvedModel | null | undefined,
  Value = TypeArg['array'] extends true
    ? TypeArg['arrayRequired'] extends true
      ? Array<Model>
      : Array<Model> | null | undefined
    : Model,
  // future: we can add an arg here for pagination and other options
> = Flat extends true ? Value : () => Promise<Prettify<Value>>;

type ResolveRelationalFieldsForModel<
  Schema,
  ModelName extends keyof Schema,
  Flat extends boolean,
> = {
  [FieldName in keyof Schema[ModelName]]: Schema[ModelName][FieldName] extends ModelRelationalFieldParamShape
    ? Schema[ModelName][FieldName]['relatedModel'] extends keyof Schema
      ? GetRelationshipRef<
          Schema,
          Schema[ModelName][FieldName]['relatedModel'],
          Schema[ModelName][FieldName],
          Flat
        >
      : never
    : Schema[ModelName][FieldName];
};

// pre-M:N resolve mapper
// type ResolveRelationships<Schema> = {
//   [ModelProp in keyof Schema]: {
//     [FieldProp in keyof Schema[ModelProp]]: Schema[ModelProp][FieldProp] extends ModelRelationalFieldParamShape
//       ? Schema[ModelProp][FieldProp]['relatedModel'] extends keyof Schema
//         ? GetRelationshipRef<
//             Schema,
//             Schema[ModelProp][FieldProp]['relatedModel'],
//             Schema[ModelProp][FieldProp]
//           >
//         : never // if the field value extends ModelRelationalFieldShape "relatedModel" should always point to a Model (keyof Schema)
//       : Schema[ModelProp][FieldProp];
//   };
// };

// resolves fieldName to connectionName, e.g. post.postTags instead of post.tags
// type ResolveRelationships<Schema> = {
//   [ModelProp in keyof Schema]: {
//     [FieldProp in keyof Schema[ModelProp] as Schema[ModelProp][FieldProp] extends ModelRelationalFieldParamShape
//       ? Schema[ModelProp][FieldProp]['connectionName'] extends string &
//           keyof Schema
//         ? `${Uncapitalize<Schema[ModelProp][FieldProp]['connectionName']>}`
//         : FieldProp
//       : FieldProp]: Schema[ModelProp][FieldProp] extends ModelRelationalFieldParamShape
//       ? Schema[ModelProp][FieldProp]['relatedModel'] extends keyof Schema
//         ? Schema[ModelProp][FieldProp]['relationshipType'] extends 'manyToMany'
//           ? Schema[ModelProp][FieldProp]['connectionName'] extends keyof Schema
//             ? GetRelationshipRef<
//                 Schema,
//                 Schema[ModelProp][FieldProp]['connectionName'],
//                 Schema[ModelProp][FieldProp]
//               >
//             : never
//           : GetRelationshipRef<
//               Schema,
//               Schema[ModelProp][FieldProp]['relatedModel'],
//               Schema[ModelProp][FieldProp]
//             >
//         : never // if the field value extends ModelRelationalFieldShape "relatedModel" should always point to a Model (keyof Schema)
//       : Schema[ModelProp][FieldProp];
//   };
// };

type ResolveRelationships<Schema, Flat extends boolean = false> = {
  [ModelProp in keyof Schema]: {
    [FieldProp in keyof Schema[ModelProp]]: Schema[ModelProp][FieldProp] extends ModelRelationalFieldParamShape
      ? Schema[ModelProp][FieldProp]['relatedModel'] extends keyof Schema
        ? Schema[ModelProp][FieldProp]['relationshipType'] extends 'manyToMany'
          ? Schema[ModelProp][FieldProp]['connectionName'] extends keyof Schema
            ? GetRelationshipRef<
                Schema,
                Schema[ModelProp][FieldProp]['connectionName'],
                Schema[ModelProp][FieldProp],
                Flat
              >
            : never
          : GetRelationshipRef<
              Schema,
              Schema[ModelProp][FieldProp]['relatedModel'],
              Schema[ModelProp][FieldProp],
              Flat
            >
        : never // if the field value extends ModelRelationalFieldShape "relatedModel" should always point to a Model (keyof Schema)
      : Schema[ModelProp][FieldProp];
  };
};

type FieldTypes<T> = {
  [ModelProp in keyof T]: {
    [FieldProp in keyof T[ModelProp]]: T[ModelProp][FieldProp] extends ModelRelationalField<
      infer R,
      string,
      never,
      any
    >
      ? R
      : T[ModelProp][FieldProp] extends ModelField<infer R, any, any>
      ? R
      : never;
  };
};

type FilterFieldTypes<Schema> = {
  [ModelProp in keyof Schema]: {
    [FieldProp in keyof Schema[ModelProp] as Schema[ModelProp][FieldProp] extends undefined
      ? never
      : FieldProp]: Schema[ModelProp][FieldProp];
  };
};

type OptionalFieldTypes<Schema> = {
  [ModelProp in keyof Schema]: Partial<{
    [FieldProp in keyof Schema[ModelProp]]: null extends Schema[ModelProp][FieldProp]
      ? Schema[ModelProp][FieldProp]
      : never;
  }>;
};

type RequiredFieldTypes<Schema> = {
  [ModelProp in keyof Schema]: {
    [FieldProp in keyof Schema[ModelProp]]: null extends Schema[ModelProp][FieldProp]
      ? never
      : Schema[ModelProp][FieldProp];
  };
};

type Intersection<A, B, C> = A & B & C extends infer U
  ? { [P in keyof U]: U[P] }
  : never;
