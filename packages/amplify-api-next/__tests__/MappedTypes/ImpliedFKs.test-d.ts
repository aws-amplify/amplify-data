import type { Equal, Expect } from '@aws-amplify/amplify-api-next-types-alpha';
import { a, ClientSchema } from '../../index';
import { Prettify } from '@aws-amplify/amplify-api-next-types-alpha';
import { ResolveSchema } from '../../src/MappedTypes/ResolveSchema';
import {
  ModelRelationalTypeArgFactory,
  ModelRelationshipTypes,
} from '../../src/ModelRelationalField';
import { ModelIdentifier } from '../../src/MappedTypes/ModelMetadata';

const schema = a.schema({
  BoringParent: a.model({
    childNormal: a.hasOne('BoringChild'),
    childReciprocal: a.hasOne('BoringReciprocalChild'),
    childHasManyNormal: a.hasMany('BoringHasManyChild'),
    childHasManyReciprocal: a.hasMany('ReciprocalHasManyChild'),
  }),
  BoringChild: a.model({
    value: a.string(),
  }),
  BoringReciprocalChild: a.model({
    parent: a.belongsTo('BoringParent'),
    value: a.string(),
  }),
  BoringHasManyChild: a.model({
    value: a.string(),
  }),
  ReciprocalHasManyChild: a.model({
    value: a.string(),
    parent: a.belongsTo('BoringParent'),
  }),
  CPKParent: a
    .model({
      CPKParentIdFieldA: a.id().required(),
      CPKParentIdFieldB: a.id().required(),
      childNormal: a.hasOne('CPKChild'),
      childReciprocal: a.hasOne('CPKReciprocalChild'),
      childHasManyNormal: a.hasMany('CPKHasManyChild'),
      childHasManyReciprocal: a.hasMany('CPKReciprocalHasManyChild'),
    })
    .identifier(['CPKParentIdFieldA', 'CPKParentIdFieldB']),
  CPKChild: a
    .model({
      CPKChildIdFieldA: a.id().required(),
      CPKChildIdFieldB: a.id().required(),
      value: a.string(),
    })
    .identifier(['CPKChildIdFieldA', 'CPKChildIdFieldB']),
  CPKReciprocalChild: a
    .model({
      CPKReciprocalChildIdFieldA: a.id().required(),
      CPKReciprocalChildIdFieldB: a.id().required(),
      parent: a.belongsTo('CPKParent'),
      value: a.string(),
    })
    .identifier(['CPKReciprocalChildIdFieldA', 'CPKReciprocalChildIdFieldB']),
  CPKHasManyChild: a
    .model({
      CPKHasManyChildIdFieldA: a.id().required(),
      CPKHasManyChildIdFieldB: a.id().required(),
      value: a.string(),
    })
    .identifier(['CPKHasManyChildIdFieldA', 'CPKHasManyChildIdFieldB']),
  CPKReciprocalHasManyChild: a
    .model({
      CPKReciprocalHasManyChildIdFieldA: a.id().required(),
      CPKReciprocalHasManyChildIdFieldB: a.id().required(),
      value: a.string(),
      parent: a.belongsTo('CPKParent'),
    })
    .identifier([
      'CPKReciprocalHasManyChildIdFieldA',
      'CPKReciprocalHasManyChildIdFieldB',
    ]),
  MultiParentA: a.model({
    childFromParentA: a.hasMany('MultiChild'),
  }),
  MultiParentB: a.model({
    childFromParentB: a.hasMany('MultiChild'),
  }),
  MultiChild: a.model({
    parentA: a.belongsTo('MultiParentA'),
    parentB: a.belongsTo('MultiParentB'),
  }),
});

// type ImpliedFKs<Schema extends Record<any, any>> = {};

type IdentifierRecord<
  Identifiers extends Record<string, { identifier: string }>,
  ModelName,
> = Record<IdentifierFields<Identifiers, ModelName>, string>;

type IdentifierFields<
  Identifiers extends Record<string, { identifier: string }>,
  ModelName,
> = ModelName extends keyof Identifiers
  ? Identifiers[ModelName]['identifier']
  : 'id';

type Denormalized<
  UserSchema extends Record<any, any>,
  Schema = ResolveSchema<UserSchema>,
  Identifiers extends Record<string, { identifier: string }> = ModelIdentifier<
    UserSchema['data']['models']
  >,
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

type RelatedModelFields<
  ModelField,
  Identifiers extends Record<string, { identifier: string }>,
> = ModelField extends ModelRelationalTypeArgFactory<
  infer RelatedModel,
  infer RelationshipType,
  any
>
  ? {
      relatedModel: RelatedModel;
      relationshipType: RelationshipType;
      relatedModelIdentifier: IdentifierFields<Identifiers, RelatedModel>;
    }
  : {
      relatedModel: undefined;
      relationshipType: undefined;
      relatedModelIdentifier: never;
    };

type ImpliedFKs<
  UserSchema extends Record<any, any>,
  ModelName extends keyof Schema,
  Schema extends Record<any, any> = ResolveSchema<UserSchema>,
  DenormalizedSchema = Denormalized<UserSchema>,
  HasManys = Extract<
    DenormalizedSchema,
    {
      relatedModel: ModelName;
      relationshipType: ModelRelationshipTypes.hasMany;
    }
  >,
  HasOnes = Extract<
    DenormalizedSchema,
    { model: ModelName; relationshipType: ModelRelationshipTypes.hasOne }
  >,
  BelongsTos = Exclude<
    Extract<
      DenormalizedSchema,
      {
        model: ModelName;
        relationshipType: ModelRelationshipTypes.belongsTo;
      }
    >,
    ImpliedHasManyBelongsTos<HasManys>
  >,
  ManyToManys = Extract<
    DenormalizedSchema,
    | { model: ModelName; relationshipType: ModelRelationshipTypes.manyToMany }
    | {
        relatedModel: ModelName;
        relationshipType: ModelRelationshipTypes.manyToMany;
      }
  >,
> =
  | HasManyKeys<Schema, HasManys>
  | HasOneKeys<Schema, HasOnes>
  | BelongsToKeys<Schema, BelongsTos>
  | ManyToManyKeys<Schema, ManyToManys>;

type FieldWithRelationship<
  Model extends string,
  Identifier extends string,
  Field extends string,
  RelatedModel extends string,
  RelatedModelIdentifier extends string,
> = {
  model: Model;
  identifier: Identifier;
  field: Field;
  relatedModel: RelatedModel;
  relatedModelIdentifier: RelatedModelIdentifier;
};

type ImpliedHasManyBelongsTos<Relationship> =
  Relationship extends FieldWithRelationship<
    infer Model,
    infer Identifier,
    infer Field,
    infer RelatedModel,
    infer RelatedModelIdentifier
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

type HasManyKeys<
  Schema extends Record<any, any>,
  T,
> = T extends FieldWithRelationship<
  infer Model,
  infer Identifier,
  infer Field,
  infer RelatedModel,
  infer RelatedModelIdentifier
>
  ? {
      [K in Identifier as FKName<
        Model,
        Field,
        K
      >]: K extends keyof Schema[Model] ? Schema[Model][K] : string;
    }
  : object;

type HasOneKeys<
  Schema extends Record<any, any>,
  T,
> = T extends FieldWithRelationship<
  infer Model,
  infer Identifier,
  infer Field,
  infer RelatedModel,
  infer RelatedModelIdentifier
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
  : object;

type BelongsToKeys<
  Schema extends Record<any, any>,
  T,
> = T extends FieldWithRelationship<
  infer Model,
  infer Identifier,
  infer Field,
  infer RelatedModel,
  infer RelatedModelIdentifier
>
  ? {
      [K in Identifier as FKName<
        Model,
        Field,
        K
      >]: K extends keyof Schema[Model] ? Schema[Model][K] : string;
    }
  : object;

type ManyToManyKeys<
  Schema extends Record<any, any>,
  T,
> = T extends FieldWithRelationship<
  infer Model,
  infer Identifier,
  infer Field,
  infer RelatedModel,
  infer RelatedModelIdentifier
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
  : object;

// type BoringChild {
//  id: ID!
//  // hasMany child without belongsTo has no FK
// }
//
// type BoringReciprocalChild {
// 	parent: BoringParent
// 	id: ID!
// 	boringReciprocalChild  Parent        Id: ID
//  ^ this model           ^ this field  ^ this PK
// }
//
// type BoringHasManyChild {
//  id: ID!
//
//  // this field comes from parent's has-many
//  boringParent         ChildHasManyNormal   Id: ID
//  ^ parent model name  ^ parent mode field  ^ child PK
//
// }
//
// type ReciprocalHasManyChild {
//  parent: BoringParent
//  id: ID!
//
//  // this field comes from parent's has-many
//  boringParent         ChildHasManyReciprocal  Id: ID
//  ^ parent model name  ^ parent mode field     ^ child PK
// }

type D = Denormalized<typeof schema>;
type T = Extract<D, { relatedModel: 'ReciprocalHasManyChild' }>;

type BoringChild = ImpliedFKs<typeof schema, 'BoringChild'>;
type BoringReciprocalChild = ImpliedFKs<typeof schema, 'BoringReciprocalChild'>;
type BoringHasManyChild = ImpliedFKs<typeof schema, 'BoringHasManyChild'>;
type ReciprocalHasManyChild = ImpliedFKs<
  typeof schema,
  'ReciprocalHasManyChild'
>;

describe('Denormalized mapped type', () => {
  test('can map a small sample schema', () => {
    const smallSchema = a.schema({
      TheParent: a.model({
        child: a.hasOne('TheChild'),
        parentField: a.integer(),
      }),
      TheChild: a
        .model({
          customPkA: a.string().required(),
          customPkB: a.string().required(),
          childField: a.string(),
        })
        .identifier(['customPkA', 'customPkB']),
    });

    type TheSchema = ResolveSchema<typeof smallSchema>;

    type Actual = Denormalized<typeof smallSchema>;

    type Expected =
      | {
          model: 'TheParent';
          identifier: 'id';
          field: 'parentField';
          type: TheSchema['TheParent']['parentField'];
          relatedModel: undefined;
          relationshipType: undefined;
          relatedModelIdentifier: never;
        }
      | {
          model: 'TheParent';
          field: 'child';
          identifier: 'id';
          type: TheSchema['TheParent']['child'];
          relatedModel: 'TheChild';
          relationshipType: ModelRelationshipTypes.hasOne;
          relatedModelIdentifier: 'customPkA' | 'customPkB';
        }
      | {
          model: 'TheChild';
          field: 'customPkA';
          identifier: 'customPkA' | 'customPkB';
          type: TheSchema['TheChild']['customPkA'];
          relatedModel: undefined;
          relationshipType: undefined;
          relatedModelIdentifier: never;
        }
      | {
          model: 'TheChild';
          field: 'customPkB';
          identifier: 'customPkA' | 'customPkB';
          type: TheSchema['TheChild']['customPkB'];
          relatedModel: undefined;
          relationshipType: undefined;
          relatedModelIdentifier: never;
        }
      | {
          model: 'TheChild';
          field: 'childField';
          identifier: 'customPkA' | 'customPkB';
          type: TheSchema['TheChild']['childField'];
          relatedModel: undefined;
          relationshipType: undefined;
          relatedModelIdentifier: never;
        };

    type test = Expect<Equal<Actual, Expected>>;
  });

  test('can extract all model fields from a larger schema', () => {
    type D = Denormalized<typeof schema>;

    type Actual = Extract<D, { model: 'BoringChild' }>;

    type Expected = {
      model: 'BoringChild';
      identifier: 'id';
      field: 'value';
      type: string | null;
      relatedModel: undefined;
      relationshipType: undefined;
      relatedModelIdentifier: never;
    };

    type test = Expect<Equal<Actual, Expected>>;
  });

  test('can extract a field that relates to a model', () => {
    type D = Denormalized<typeof schema>;

    type Actual = Extract<D, { relatedModel: 'BoringChild' }>;

    type Expected = {
      model: 'BoringParent';
      identifier: 'id';
      field: 'childNormal';
      type: {
        type: 'model';
        relatedModel: 'BoringChild';
        relationshipType: ModelRelationshipTypes.hasOne;
        array: false;
        valueRequired: false;
        arrayRequired: false;
        relationName: undefined;
      };
      relatedModel: 'BoringChild';
      relationshipType: ModelRelationshipTypes.hasOne;
      relatedModelIdentifier: 'id';
    };

    type test = Expect<Equal<Actual, Expected>>;
  });

  test('can extract multiple fields that relate to a model', () => {
    type D = Denormalized<typeof schema>;

    type Actual = Extract<D, { relatedModel: 'MultiChild' }>;

    type Expected =
      | {
          model: 'MultiParentA';
          identifier: 'id';
          field: 'childFromParentA';
          type: {
            type: 'model';
            relatedModel: 'MultiChild';
            relationshipType: ModelRelationshipTypes.hasMany;
            array: true;
            valueRequired: false;
            arrayRequired: false;
            relationName: undefined;
          };
          relatedModel: 'MultiChild';
          relationshipType: ModelRelationshipTypes.hasMany;
          relatedModelIdentifier: 'id';
        }
      | {
          model: 'MultiParentB';
          identifier: 'id';
          field: 'childFromParentB';
          type: {
            type: 'model';
            relatedModel: 'MultiChild';
            relationshipType: ModelRelationshipTypes.hasMany;
            array: true;
            valueRequired: false;
            arrayRequired: false;
            relationName: undefined;
          };
          relatedModel: 'MultiChild';
          relationshipType: ModelRelationshipTypes.hasMany;
          relatedModelIdentifier: 'id';
        };

    type test = Expect<Equal<Actual, Expected>>;
  });
});

describe('ImpliedFK mapped type', () => {
  test('hasOne(implicitPK)', () => {
    const schema = a.schema({
      TheParent: a.model({
        child: a.hasOne('TheChild'),
      }),
      TheChild: a.model({
        someField: a.string(),
      }),
    });

    type Actual = ImpliedFKs<typeof schema>;

    type Expected = {
      TheParent: {
        theParentChildId: string;
      };
      TheChild: {};
    };

    type test = Expect<Equal<Actual, Expected>>;
  });
});
