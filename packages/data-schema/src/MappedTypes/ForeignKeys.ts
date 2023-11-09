import { ResolveSchema } from './ResolveSchema';
import { Prettify, UnionToIntersection } from '@aws-amplify/data-schema-types';
import {
  ModelRelationalFieldParamShape,
  ModelRelationshipTypes,
} from '../ModelRelationalField';

export type AllImpliedFKs<
  ResolvedSchema,
  Identifiers extends Record<string, { identifier: string }>,
  Schema extends Record<any, any> = ResolvedSchema extends ResolveSchema<any>
    ? ResolvedSchema
    : object,
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
> = {
  [ModelName in keyof Schema]: {
    [FieldName in keyof Schema[ModelName]]: Prettify<
      {
        model: ModelName;
        identifier: IdentifierFields<Identifiers, ModelName>;
        field: FieldName;
        type: Schema[ModelName][FieldName];
      } & RelatedModelFields<Schema[ModelName][FieldName], Identifiers>
    >;
  }[keyof Schema[ModelName]];
}[keyof Schema];

export type ImpliedFKs<
  ResolvedSchema,
  Identifiers extends Record<string, { identifier: string }>,
  ModelName,
  Schema extends Record<any, any> = ResolvedSchema extends ResolveSchema<any>
    ? ResolvedSchema
    : object,
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

type FieldWithRelationship = {
  model: string;
  identifier: string;
  field: string;
  relatedModel: string;
  relatedModelIdentifier: string;
  relationName: string | undefined;
};

/**
 * I.e., creates a "matcher" to identify the belongsTo entries that correspond with
 * the given hasMany relationship.
 *
 * The `belongsTo` side of these relationships can be ignored. The FK comes from the
 * `hasMany` side of the relationship.
 */
type ImpliedHasManyBelongsTos<Relationship> =
  Relationship extends FieldWithRelationship
    ? {
        model: Relationship['relatedModel'];
      }
    : never;

type FKName<
  Model extends string,
  Field extends string,
  Identifier extends string,
> = `${Uncapitalize<Model>}${Capitalize<Field>}${Capitalize<Identifier>}`;

type HasMany_Model_Keys<
  Schema extends Record<any, any>,
  RelDef,
> = RelDef extends FieldWithRelationship
  ? {
      [IDField in RelDef['identifier'] as FKName<
        RelDef['model'],
        RelDef['field'],
        IDField
      >]?: IDField extends keyof Schema[RelDef['model']]
        ? Schema[RelDef['model']][IDField]
        : string;
    }
  : never;

type HasOne_Model_Keys<
  Schema extends Record<any, any>,
  RelDef,
> = RelDef extends FieldWithRelationship
  ? {
      [IDField in RelDef['relatedModelIdentifier'] as FKName<
        RelDef['model'],
        RelDef['field'],
        IDField
      >]?: IDField extends keyof Schema[RelDef['relatedModel']]
        ? Schema[RelDef['relatedModel']][IDField]
        : string;
    }
  : never;

type Model_BelongsTo_Keys<
  Schema extends Record<any, any>,
  RelDef,
> = RelDef extends FieldWithRelationship
  ? {
      [IDField in RelDef['relatedModelIdentifier'] as FKName<
        RelDef['model'],
        RelDef['field'],
        IDField
      >]?: IDField extends keyof Schema[RelDef['model']]
        ? Schema[RelDef['model']][IDField]
        : string;
    }
  : never;

type ManyToManyKeys<
  Schema extends Record<any, any>,
  RelDef,
> = RelDef extends FieldWithRelationship
  ? {
      [IDField in RelDef['identifier'] as FKName<
        RelDef['model'],
        '',
        IDField
      >]?: IDField extends keyof Schema[RelDef['model']]
        ? Schema[RelDef['model']][IDField]
        : string;
    }
  : never;
