import { ResolveSchema, SchemaTypes } from './ResolveSchema';
import { ModelIdentifier } from './ModelMetadata';
import {
  Prettify,
  UnionToIntersection,
} from '@aws-amplify/amplify-api-next-types-alpha';
import {
  ModelRelationalFieldParamShape,
  ModelRelationshipTypes,
} from '../ModelRelationalField';

export type AllImpliedFKs<
  ResolvedSchema,
  Identifiers extends Record<string, { identifier: string }>,
  Schema extends Record<any, any> = ResolvedSchema extends ResolveSchema<any>
    ? ResolvedSchema
    : {},
  DenormalizedSchema extends Denormalized<Schema, Identifiers> = Denormalized<
    Schema,
    Identifiers
  >,
  AllModels = DenormalizedSchema['model'] | DenormalizedSchema['relationName'],
> = {
  [K in Extract<AllModels, string>]: ImpliedFKs<
    ResolvedSchema,
    Identifiers,
    K
  > extends never
    ? object
    : ImpliedFKs<ResolvedSchema, Identifiers, K>;
};

export type Denormalized<
  Schema extends Record<any, any>,
  Identifiers extends Record<string, { identifier: string }>,
  // Identifiers extends Record<string, { identifier: string }> = ModelIdentifier<
  //   UserSchema['data']['models']
  // >,
> = {
  [ModelName in keyof Schema]: {
    [FieldName in keyof Schema[ModelName]]: {
      model: ModelName;
      identifier: IdentifierFields<Identifiers, ModelName>;
      field: FieldName;
      type: Schema[ModelName][FieldName];
    } & RelatedModelFields<Schema[ModelName][FieldName], Identifiers>;
  }[keyof Schema[ModelName]];
}[keyof Schema];

export type ImpliedFKs<
  ResolvedSchema,
  Identifiers extends Record<string, { identifier: string }>,
  ModelName,
  Schema extends Record<any, any> = ResolvedSchema extends ResolveSchema<any>
    ? ResolvedSchema
    : {},
  DenormalizedSchema = Denormalized<Schema, Identifiers>,
  HasMany_Model = Extract<
    DenormalizedSchema,
    {
      relatedModel: ModelName;
      relationshipType: ModelRelationshipTypes.hasMany;
    }
  >,
  HasOne_Model = Extract<
    DenormalizedSchema,
    { model: ModelName; relationshipType: ModelRelationshipTypes.hasOne }
  >,
  Model_BelongsTo = Exclude<
    Extract<
      DenormalizedSchema,
      {
        model: ModelName;
        relationshipType: ModelRelationshipTypes.belongsTo;
      }
    >,
    // omit belongsTo's that simply reciprocate hasMany's, since the FK
    // is inferred from that hasMany side.
    ImpliedHasManyBelongsTos<HasMany_Model>
  >,
  ManyToManys = Extract<
    DenormalizedSchema,
    {
      relationName: ModelName; // i.e., the join table name
      relationshipType: ModelRelationshipTypes.manyToMany;
    }
  >,
  InferredFields =
    | HasMany_Model_Keys<Schema, HasMany_Model>
    | HasOne_Model_Keys<Schema, HasOne_Model>
    | Model_BelongsTo_Keys<Schema, Model_BelongsTo>
    | ManyToManyKeys<Schema, ManyToManys>,
> = unknown extends UnionToIntersection<InferredFields>
  ? never
  : Prettify<UnionToIntersection<InferredFields>>;
// : Prettify<UnionToIntersection<InferredFields>>;

type IdentifierFields<
  Identifiers extends Record<string, { identifier: string }>,
  ModelName,
> = ModelName extends keyof Identifiers
  ? Identifiers[ModelName]['identifier']
  : 'id';

type RelatedModelFields<
  ModelField,
  Identifiers extends Record<string, { identifier: string }>,
> = ModelField extends ModelRelationalFieldParamShape
  ? {
      relatedModel: ModelField['relatedModel'];
      relationshipType: ModelField['relationshipType'];
      relationName: ModelField['relationName'];
      relatedModelIdentifier: IdentifierFields<
        Identifiers,
        ModelField['relatedModel']
      >;
    }
  : {
      relatedModel: undefined;
      relationshipType: undefined;
      relationName: undefined;
      relatedModelIdentifier: never;
    };

type FieldWithRelationship<
  Model extends string,
  Identifier extends string,
  Field extends string,
  RelatedModel extends string,
  RelatedModelIdentifier extends string,
  RelationName extends string | undefined,
> = {
  model: Model;
  identifier: Identifier;
  field: Field;
  relatedModel: RelatedModel;
  relatedModelIdentifier: RelatedModelIdentifier;
  relationName: RelationName;
};

/**
 * I.e., creates a "matcher" to identify the belongsTo entries that
 * correspond with the given hasMany relationship.
 *
 * Useful, because the `belongsTo` in these relationships do not actually
 *
 */
type ImpliedHasManyBelongsTos<Relationship> =
  Relationship extends FieldWithRelationship<
    infer Model,
    infer Identifier,
    infer Field,
    infer RelatedModel,
    infer RelatedModelIdentifier,
    infer RelationName
  >
    ? {
        model: RelatedModel;
      }
    : never;

type FKName<
  Model extends string,
  Field extends string,
  Identifier extends string,
> = `${Uncapitalize<Model>}${Capitalize<Field>}${Capitalize<Identifier>}`;

type HasMany_Model_Keys<
  Schema extends Record<any, any>,
  T,
> = T extends FieldWithRelationship<
  infer Model,
  infer Identifier,
  infer Field,
  infer RelatedModel,
  infer RelatedModelIdentifier,
  infer RelationName
>
  ? {
      [K in Identifier as FKName<
        Model,
        Field,
        K
      >]: K extends keyof Schema[Model] ? Schema[Model][K] : string;
    }
  : never;

type HasOne_Model_Keys<
  Schema extends Record<any, any>,
  T,
> = T extends FieldWithRelationship<
  infer Model,
  infer Identifier,
  infer Field,
  infer RelatedModel,
  infer RelatedModelIdentifier,
  infer RelationName
>
  ? {
      [K in RelatedModelIdentifier as FKName<
        Model,
        Field,
        K
      >]: K extends keyof Schema[RelatedModel]
        ? Schema[RelatedModel][K]
        : string;
    }
  : never;

type Model_BelongsTo_Keys<
  Schema extends Record<any, any>,
  T,
> = T extends FieldWithRelationship<
  infer Model,
  infer Identifier,
  infer Field,
  infer RelatedModel,
  infer RelatedModelIdentifier,
  infer RelationName
>
  ? {
      [K in RelatedModelIdentifier as FKName<
        Model,
        Field,
        K
      >]: K extends keyof Schema[Model] ? Schema[Model][K] : string;
    }
  : never;

type ManyToManyKeys<
  Schema extends Record<any, any>,
  T,
> = T extends FieldWithRelationship<
  infer Model,
  infer Identifier,
  infer Field,
  infer RelatedModel,
  infer RelatedModelIdentifier,
  infer RelationName
>
  ? {
      [K in Identifier as FKName<Model, '', K>]: K extends keyof Schema[Model]
        ? Schema[Model][K]
        : string;
    }
  : never;
