import { default as a, defineData } from '../index';

import type { ModelSchema } from '../src/ModelSchema';
import { type ModelType } from '../src/ModelType';
import type { ModelField, InternalField } from '../src/ModelField';
import type {
  ModelRelationalField,
  ModelRelationalFieldParamShape,
  ModelRelationalTypeArgFactory,
} from '../src/ModelRelationalField';
import type { Prettify, UnionToIntersection, ExcludeEmpty } from '../src/util';
import { __modelMeta__ } from '@aws-amplify/types-package-alpha';
import type { ImpliedAuthFields } from '../src/Authorization';

const schema = a.schema({
  Post: a
    .model({
      postId: a.id(),
      title: a.string(),
      summary: a.string().optional(),
      viewCount: a.integer().optional(),
      comments: a.hasMany('Comment'),
      comments2: a.hasMany('Comment'),
      // author: a.hasOne('User'),
      tags: a.manyToMany('Tag', { connectionName: 'PostTags' }),
    })
    .identifier(['postId', 'title'])
    .authorization([a.allow.public()]),
  Comment: a
    .model({
      id: a.id(),
      bingo: a.string(),
      anotherField: a.string().optional(),
      post: a.belongsTo('Post'),
      tag: a.manyToMany('Tag', { connectionName: 'CommentTags' }),
    })
    .authorization([a.allow.public()]),
  // User: a
  //   .model({
  //     id: a.id(),
  //     name: a.string(),
  //     post: a.belongsTo('Post'),
  //   })
  //   .authorization([a.allow.public()]),
  Tag: a
    .model({
      name: a.string(),
      posts: a.manyToMany('Post', { connectionName: 'PostTags' }),
    })
    .authorization([a.allow.public()]),
  CTag: a
    .model({
      name: a.string(),
      comments: a.manyToMany('Comment', { connectionName: 'CommentTags' }),
    })
    .authorization([a.allow.public()]),
});

type TSchema = typeof schema;
export type Schema = ClientSchema<TSchema>;

type TFields = Prettify<FieldTypes<ModelTypes<SchemaTypes<TSchema>>>>;
type TTT = TFields['Post'];

type TFieldsWithRelationships = ResolveRelationships<TFields>;

type TFieldsWithRelationshipsFlat = Prettify<
  ResolveRelationships<TFields, true>
>;

type FlatComment = TFieldsWithRelationshipsFlat['Comment'];

type TResolvedFields = Intersection<
  FilterFieldTypes<RequiredFieldTypes<TFieldsWithRelationships>>,
  FilterFieldTypes<OptionalFieldTypes<TFieldsWithRelationships>>,
  FilterFieldTypes<ModelImpliedAuthFields<TSchema>>
>;

type TPost = Schema['Post'];

type MMeta = Schema[typeof __modelMeta__];
type MPost = MMeta['Post'];
type MComment = MMeta['Comment'];
type MCRels = MComment['relationships'];
type MTag = MMeta['Tag'];
type MPostTags = MMeta['PostTags'];
type MFlat = MMeta['FlatSchema'];
type MFlatPostTags = MFlat['PostTags'];
// type MUser = MMeta['User'];

type ClientSchema<
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
    RelationshipMeta & { FlatSchema: FlatFieldsWithRelationships }
> = Prettify<
  ResolvedFields & {
    [__modelMeta__]: Meta;
  }
>;

type ExtractRelationalMetadata<
  FlattenedSchema,
  ResolvedFields extends Record<string, unknown>
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

type ModelTypes<Schema> = {
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
    infer A,
    any
  >
    ? ImpliedAuthFields<A['authorization'][number]>
    : never;
};

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
// type ExtractImplicitModelNames<Schema> = UnionToIntersection<
//   ExcludeEmpty<
//     {
//       [ModelProp in keyof Schema]: {
//         [FieldProp in keyof Schema[ModelProp] as Schema[ModelProp][FieldProp] extends ModelRelationalFieldParamShape
//           ? Schema[ModelProp][FieldProp]['connectionName'] extends string
//             ? Schema[ModelProp][FieldProp]['connectionName'] extends keyof Schema
//               ? never
//               : Schema[ModelProp][FieldProp]['connectionName']
//             : never
//           : never]: { id?: string } & Record<
//           `${Lowercase<ModelProp & string>}`,
//           GetRelationshipRef<
//             Schema,
//             ModelProp,
//             Schema[ModelProp][FieldProp] & ModelRelationalFieldParamShape,
//             false
//           >
//         >; // implicit model will always have id: string as the PK
//       };
//     }[keyof Schema]
//   >
// >;

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
  Model = TypeArg['valueOptional'] extends true
    ? ResolvedModel | null | undefined
    : ResolvedModel,
  Value = TypeArg['array'] extends true
    ? TypeArg['arrayOptional'] extends true
      ? Array<Model> | null | undefined
      : Array<Model>
    : Model
  // future: we can add an arg here for pagination and other options
> = Flat extends true ? Value : () => Promise<Prettify<Value>>;

type ResolveRelationalFieldsForModel<
  Schema,
  ModelName extends keyof Schema,
  Flat extends boolean
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
      never
    >
      ? R
      : T[ModelProp][FieldProp] extends ModelField<infer R, any>
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
