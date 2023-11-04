import type {
  Equal,
  Expect,
  UnionToIntersection,
} from '@aws-amplify/amplify-api-next-types-alpha';
import { a, ClientSchema } from '../../index';
import { Prettify } from '@aws-amplify/amplify-api-next-types-alpha';
import { ResolveSchema } from '../../src/MappedTypes/ResolveSchema';
import {
  ModelRelationalTypeArgFactory,
  ModelRelationshipTypes,
  ModelRelationalFieldParamShape,
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

type ImpliedFKs<
  UserSchema extends Record<any, any>,
  ModelName extends
    | Denormalized<UserSchema>['model']
    | Denormalized<UserSchema>['relationName'], // keyof Schema,
  Schema extends Record<any, any> = ResolveSchema<UserSchema>,
  DenormalizedSchema = Denormalized<UserSchema>,
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

//
// sampling from the transformed schema, for reference
//
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
//

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
          relationName: undefined;
        }
      | {
          model: 'TheParent';
          field: 'child';
          identifier: 'id';
          type: TheSchema['TheParent']['child'];
          relatedModel: 'TheChild';
          relationshipType: ModelRelationshipTypes.hasOne;
          relatedModelIdentifier: 'customPkA' | 'customPkB';
          relationName: undefined;
        }
      | {
          model: 'TheChild';
          field: 'customPkA';
          identifier: 'customPkA' | 'customPkB';
          type: TheSchema['TheChild']['customPkA'];
          relatedModel: undefined;
          relationshipType: undefined;
          relatedModelIdentifier: never;
          relationName: undefined;
        }
      | {
          model: 'TheChild';
          field: 'customPkB';
          identifier: 'customPkA' | 'customPkB';
          type: TheSchema['TheChild']['customPkB'];
          relatedModel: undefined;
          relationshipType: undefined;
          relatedModelIdentifier: never;
          relationName: undefined;
        }
      | {
          model: 'TheChild';
          field: 'childField';
          identifier: 'customPkA' | 'customPkB';
          type: TheSchema['TheChild']['childField'];
          relatedModel: undefined;
          relationshipType: undefined;
          relatedModelIdentifier: never;
          relationName: undefined;
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
      relationName: undefined;
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
      relationName: undefined;
    };

    type test = Expect<Equal<Actual, Expected>>;
  });

  test('can extract multiple fields that relate to a model', () => {
    const schema = a.schema({
      MultiParentA: a.model({
        childFromParentA: a.hasMany('MultiChild'),
      }),
      MultiParentB: a
        .model({
          cpkA: a.string().required(),
          cpkB: a.integer().required(),
          childFromParentB: a.hasMany('MultiChild'),
        })
        .identifier(['cpkA', 'cpkB']),
      MultiParentC: a.model({
        childFromParentC: a.hasMany('MultiChild'),
      }),
      MultiChild: a.model({
        parentA: a.belongsTo('MultiParentA'),
        parentB: a.belongsTo('MultiParentB'),
        // intentionally no parentC
      }),
    });

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
          relationName: undefined;
        }
      | {
          model: 'MultiParentB';
          identifier: 'cpkA' | 'cpkB';
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
          relationName: undefined;
        }
      | {
          model: 'MultiParentC';
          identifier: 'id';
          field: 'childFromParentC';
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
          relationName: undefined;
        };

    type test = Expect<Equal<Actual, Expected>>;
  });
});

describe('ImpliedFK mapped type', () => {
  test('parent with implied hasOne keys', () => {
    type Actual = ImpliedFKs<typeof schema, 'BoringParent'>;
    type Expected = {
      boringParentChildNormalId: string;
      boringParentChildReciprocalId: string;
    };
    type test = Expect<Equal<Actual, Expected>>;
  });

  test('child with no implied keys', () => {
    type Actual = ImpliedFKs<typeof schema, 'BoringChild'>;
    type Expected = never;
    type test = Expect<Equal<Actual, Expected>>;
  });

  test('child with hasOne:belongsTo key', () => {
    type Actual = ImpliedFKs<typeof schema, 'BoringReciprocalChild'>;
    type Expected = {
      boringReciprocalChildParentId: string;
    };
    type test = Expect<Equal<Actual, Expected>>;
  });

  test('child with implied FK from hasMany', () => {
    type Actual = ImpliedFKs<typeof schema, 'BoringHasManyChild'>;
    type Expected = {
      boringParentChildHasManyNormalId: string;
    };
    type test = Expect<Equal<Actual, Expected>>;
  });

  test('child with implied FK from hasMany, with reciprocal belongsTo', () => {
    type Actual = ImpliedFKs<typeof schema, 'ReciprocalHasManyChild'>;
    type Expected = {
      boringParentChildHasManyReciprocalId: string;
    };
    type test = Expect<Equal<Actual, Expected>>;
  });

  test('CPK hasOne', () => {
    const schema = a.schema({
      CPKParent: a
        .model({
          CPKParentIdFieldA: a.id().required(),
          CPKParentIdFieldB: a.id().required(),
          childNormal: a.hasOne('CPKChild'),
        })
        .identifier(['CPKParentIdFieldA', 'CPKParentIdFieldB']),
      CPKChild: a
        .model({
          CPKChildIdFieldA: a.id().required(),
          CPKChildIdFieldB: a.id().required(),
          value: a.string(),
        })
        .identifier(['CPKChildIdFieldA', 'CPKChildIdFieldB']),
    });

    type ParentActual = ImpliedFKs<typeof schema, 'CPKParent'>;
    type ParentExpected = {
      cPKParentChildNormalCPKChildIdFieldA: string;
      cPKParentChildNormalCPKChildIdFieldB: string;
    };
    type testParent = Expect<Equal<ParentActual, ParentExpected>>;

    type ChildActual = ImpliedFKs<typeof schema, 'CPKChild'>;
    type ChildExpected = never;
    type testChild = Expect<Equal<ParentActual, ParentExpected>>;
  });

  test('cpk hasOne:belongsTo', () => {
    const schema = a.schema({
      CPKParent: a
        .model({
          CPKParentIdFieldA: a.id().required(),
          CPKParentIdFieldB: a.id().required(),
          childReciprocal: a.hasOne('CPKReciprocalChild'),
        })
        .identifier(['CPKParentIdFieldA', 'CPKParentIdFieldB']),
      CPKReciprocalChild: a
        .model({
          CPKReciprocalChildIdFieldA: a.id().required(),
          CPKReciprocalChildIdFieldB: a.id().required(),
          parent: a.belongsTo('CPKParent'),
          value: a.string(),
        })
        .identifier([
          'CPKReciprocalChildIdFieldA',
          'CPKReciprocalChildIdFieldB',
        ]),
    });

    type ParentActual = ImpliedFKs<typeof schema, 'CPKParent'>;
    type ParentExpected = {
      cPKParentChildReciprocalCPKReciprocalChildIdFieldA: string;
      cPKParentChildReciprocalCPKReciprocalChildIdFieldB: string;
    };
    type testParent = Expect<Equal<ParentActual, ParentExpected>>;

    type ChildActual = ImpliedFKs<typeof schema, 'CPKReciprocalChild'>;
    type ChildExpected = {
      // cPKReciprocalChildParentCPKReciprocalChildIdFieldA;
      cPKReciprocalChildParentCPKParentIdFieldA: string;
      cPKReciprocalChildParentCPKParentIdFieldB: string;
    };
    type testChild = Expect<Equal<ChildActual, ChildExpected>>;
  });

  test('cpk hasMany', () => {
    const schema = a.schema({
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
        .identifier([
          'CPKReciprocalChildIdFieldA',
          'CPKReciprocalChildIdFieldB',
        ]),
    });
  });

  test('child with implied FKs multiple parents, mixed reciprocality and types', () => {
    const schema = a.schema({
      MultiParentA: a.model({
        childFromParentA: a.hasMany('MultiChild'),
      }),
      MultiParentB: a
        .model({
          cpkA: a.string().required(),
          cpkB: a.integer().required(),
          childFromParentB: a.hasMany('MultiChild'),
        })
        .identifier(['cpkA', 'cpkB']),
      MultiParentC: a.model({
        childFromParentC: a.hasMany('MultiChild'),
      }),
      MultiChild: a.model({
        parentA: a.belongsTo('MultiParentA'),
        parentB: a.belongsTo('MultiParentB'),
        // intentionally no parentC
      }),
    });
    type Actual = ImpliedFKs<typeof schema, 'MultiChild'>;
    type Expected = {
      multiParentAChildFromParentAId: string;
      multiParentBChildFromParentBCpkA: string;
      multiParentBChildFromParentBCpkB: number;
      multiParentCChildFromParentCId: string;
    };
    type test = Expect<Equal<Actual, Expected>>;
  });

  test('manyToMany', () => {
    const schema = a.schema({
      ManyToManyLeft: a.model({
        value: a.string(),
        right: a.manyToMany('ManyToManyRight', { relationName: 'ChuckNorris' }),
      }),
      ManyToManyRight: a.model({
        value: a.string(),
        left: a.manyToMany('ManyToManyLeft', { relationName: 'ChuckNorris' }),
      }),
    });

    type LeftActual = ImpliedFKs<typeof schema, 'ManyToManyLeft'>;
    type LeftExpected = never;
    type testLeft = Expect<Equal<LeftActual, LeftExpected>>;

    type RightActual = ImpliedFKs<typeof schema, 'ManyToManyRight'>;
    type RightExpected = never;
    type testRight = Expect<Equal<RightActual, RightExpected>>;

    type JoinTableActual = ImpliedFKs<typeof schema, 'ChuckNorris'>;
    type JoinTableExected = {
      manyToManyLeftId: string;
      manyToManyRightId: string;
    };
    type testJoin = Expect<Equal<JoinTableActual, JoinTableExected>>;
  });

  test('manyToMany CPK', () => {
    const schema = a.schema({
      ManyToManyLeft: a
        .model({
          leftIdA: a.id().required(),
          leftIdB: a.integer().required(),
          right: a.manyToMany('ManyToManyRight', {
            relationName: 'Wolverine',
          }),
        })
        .identifier(['leftIdA', 'leftIdB']),
      ManyToManyRight: a
        .model({
          rightIdA: a.id().required(),
          rightIdB: a.integer().required(),
          left: a.manyToMany('ManyToManyLeft', { relationName: 'Wolverine' }),
        })
        .identifier(['rightIdA', 'rightIdB']),
    });

    type LeftActual = ImpliedFKs<typeof schema, 'ManyToManyLeft'>;
    type LeftExpected = never;
    type testLeft = Expect<Equal<LeftActual, LeftExpected>>;

    type RightActual = ImpliedFKs<typeof schema, 'ManyToManyRight'>;
    type RightExpected = never;
    type testRight = Expect<Equal<RightActual, RightExpected>>;

    type JoinTableActual = ImpliedFKs<typeof schema, 'Wolverine'>;
    type JoinTableExected = {
      manyToManyLeftLeftIdA: string;
      manyToManyLeftLeftIdB: number;
      manyToManyRightRightIdA: string;
      manyToManyRightRightIdB: number;
    };
    type testJoin = Expect<Equal<JoinTableActual, JoinTableExected>>;
  });
});
