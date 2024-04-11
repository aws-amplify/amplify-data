import type { Equal, Expect, Prettify } from '@aws-amplify/data-schema-types';
import { a, ClientSchema } from '../../index';
import {
  ResolveSchema,
  SchemaTypes,
} from '../../src/MappedTypes/ResolveSchema';
import { ModelRelationshipTypes } from '../../src/ModelRelationalField';
import {
  Denormalized,
  ImpliedFKs,
  AllImpliedFKs,
} from '../../src/MappedTypes/ForeignKeys';
import { ModelIdentifier } from '../../src/MappedTypes/ModelMetadata';
import { Json } from '../../src/ModelField';

const schema = a.schema({
  BoringParent: a.model({
    childNormal: a.hasOne('BoringChild', 'boringParentId'),
    childReciprocal: a.hasOne('BoringReciprocalChild', 'boringParentId'),
    childHasManyNormal: a.hasMany('BoringHasManyChild', 'boringParentId'),
    childHasManyReciprocal: a.hasMany('ReciprocalHasManyChild', 'boringParentId'),
  }),

  // Including json fields to these relationship tests since this more
  //   complicated primative type can cause type issues. Think of this as
  //   a different type of value field that gives us added coverage confidence

  BoringChild: a.model({
    value: a.string(),
    json: a.json(),
    boringParentId: a.id(),
    parent: a.belongsTo('BoringParent', 'boringParentId'),
  }),
  BoringReciprocalChild: a.model({
    value: a.string(),
    json: a.json(),
    boringParentId: a.id(),
    parent: a.belongsTo('BoringParent', 'boringParentId'),
  }),
  BoringHasManyChild: a.model({
    value: a.string(),
    json: a.json(),
    boringParentId: a.id(),
    parent: a.belongsTo('BoringParent', 'boringParentId')
  }),
  ReciprocalHasManyChild: a.model({
    value: a.string(),
    boringParentId: a.id(),
    parent: a.belongsTo('BoringParent', 'boringParentId')
  }),
  CPKParent: a
    .model({
      CPKParentIdFieldA: a.id().required(),
      CPKParentIdFieldB: a.id().required(),
      childNormal: a.hasOne('CPKChild', ['CPKParentIdFieldA', 'CPKParentIdFieldB']),
      childReciprocal: a.hasOne('CPKReciprocalChild', ['CPKParentIdFieldA', 'CPKParentIdFieldB']),
      childHasManyNormal: a.hasMany('CPKHasManyChild', ['CPKParentIdFieldA', 'CPKParentIdFieldB']),
      childHasManyReciprocal: a.hasMany('CPKReciprocalHasManyChild', ['CPKParentIdFieldA', 'CPKParentIdFieldB']),
    })
    .identifier(['CPKParentIdFieldA', 'CPKParentIdFieldB']),
  CPKChild: a
    .model({
      CPKChildIdFieldA: a.id().required(),
      CPKChildIdFieldB: a.id().required(),
      value: a.string(),
      CPKParentIdFieldA: a.id(),
      CPKParentIdFieldB: a.id(),
      parent: a.belongsTo('CPKParent', ['CPKParentIdFieldA', 'CPKParentIdFieldB']),
    })
    .identifier(['CPKChildIdFieldA', 'CPKChildIdFieldB']),
  CPKReciprocalChild: a
    .model({
      CPKReciprocalChildIdFieldA: a.id().required(),
      CPKReciprocalChildIdFieldB: a.id().required(),
      value: a.string(),
      CPKParentIdFieldA: a.id(),
      CPKParentIdFieldB: a.id(),
      parent: a.belongsTo('CPKParent', ['CPKParentIdFieldA', 'CPKParentIdFieldB']),
    })
    .identifier(['CPKReciprocalChildIdFieldA', 'CPKReciprocalChildIdFieldB']),
  CPKHasManyChild: a
    .model({
      CPKHasManyChildIdFieldA: a.id().required(),
      CPKHasManyChildIdFieldB: a.id().required(),
      value: a.string(),
      json: a.json(),
      CPKParentIdFieldA: a.id(),
      CPKParentIdFieldB: a.id(),
      parent: a.belongsTo('CPKParent', ['CPKParentIdFieldA', 'CPKParentIdFieldB']),
    })
    .identifier(['CPKHasManyChildIdFieldA', 'CPKHasManyChildIdFieldB']),
  CPKReciprocalHasManyChild: a
    .model({
      CPKReciprocalHasManyChildIdFieldA: a.id().required(),
      CPKReciprocalHasManyChildIdFieldB: a.id().required(),
      value: a.string(),
      CPKParentIdFieldA: a.id(),
      CPKParentIdFieldB: a.id(),
      parent: a.belongsTo('CPKParent', ['CPKParentIdFieldA', 'CPKParentIdFieldB']),
    })
    .identifier([
      'CPKReciprocalHasManyChildIdFieldA',
      'CPKReciprocalHasManyChildIdFieldB',
    ]),
});

// sampling from the transformed schema, for reference
//
// type BoringChild {
//  id: ID!
//  // hasMany child without belongsTo has no FK
// }
//
// type BoringReciprocalChild {
//  parent: BoringParent
//  id: ID!
//  boringReciprocalChild  Parent        Id: ID
//  ^ this model           ^ this field  ^ parent PK
// }
//
// type BoringHasManyChild {
//  id: ID!
//  // this field comes from parent's has-many
//  boringParent         ChildHasManyNormal    Id: ID
//  ^ parent model name  ^ parent model field  ^ parent PK
// }
//
// type ReciprocalHasManyChild {
//  parent: BoringParent
//  id: ID!
//  // this field comes from parent's has-many
//  boringParent         ChildHasManyReciprocal  Id: ID
//  ^ parent model name  ^ parent model field    ^ parent PK
// }

describe('Denormalized mapped type', () => {
  test('can map a small sample schema', () => {
    const schema = a.schema({
      TheParent: a.model({
        child: a.hasOne('TheChild', 'theParentId'),
        parentField: a.integer(),
      }),
      TheChild: a
        .model({
          customPkA: a.string().required(),
          customPkB: a.string().required(),
          childField: a.string(),
          theParentId: a.id().required(),
          parent: a.belongsTo('TheParent', 'theParentId'),
        })
        .identifier(['customPkA', 'customPkB']),
    });

    type Schema = ResolveSchema<typeof schema>;
    type Identifiers = ModelIdentifier<SchemaTypes<typeof schema>>;

    type Actual = Prettify<Denormalized<Schema, Identifiers>>;
    type T = Extract<Actual, { model: 'TheParent'; field: 'parentField' }>;

    type Expected =
      | {
          model: 'TheParent';
          identifier: 'id';
          field: 'parentField';
          type: Schema['TheParent']['parentField'];
          relatedModel: undefined;
          relationshipType: undefined;
          relatedModelIdentifier: never;
          relationName: undefined;
        }
      | {
          model: 'TheParent';
          field: 'child';
          identifier: 'id';
          type: Schema['TheParent']['child'];
          relatedModel: 'TheChild';
          relationshipType: ModelRelationshipTypes.hasOne;
          relatedModelIdentifier: 'customPkA' | 'customPkB';
          relationName: undefined;
        }
      | {
          model: 'TheChild';
          field: 'customPkA';
          identifier: 'customPkA' | 'customPkB';
          type: Schema['TheChild']['customPkA'];
          relatedModel: undefined;
          relationshipType: undefined;
          relatedModelIdentifier: never;
          relationName: undefined;
        }
      | {
          model: 'TheChild';
          field: 'customPkB';
          identifier: 'customPkA' | 'customPkB';
          type: Schema['TheChild']['customPkB'];
          relatedModel: undefined;
          relationshipType: undefined;
          relatedModelIdentifier: never;
          relationName: undefined;
        }
      | {
          model: 'TheChild';
          field: 'childField';
          identifier: 'customPkA' | 'customPkB';
          type: Schema['TheChild']['childField'];
          relatedModel: undefined;
          relationshipType: undefined;
          relatedModelIdentifier: never;
          relationName: undefined;
        };

    // FIXME: Udpate Expected to reflect new relationship modeling
    // type test = Expect<Equal<Actual, Expected>>;
  });

  test('can extract all model fields from a larger schema', () => {
    type Schema = ResolveSchema<typeof schema>;
    type Identifiers = ModelIdentifier<SchemaTypes<typeof schema>>;

    type D = Denormalized<Schema, Identifiers>;

    type Actual = Prettify<Extract<D, { model: 'BoringChild' }>>;

    type Expected =
      | {
          model: 'BoringChild';
          identifier: 'id';
          field: 'value';
          type: string | null;
          relatedModel: undefined;
          relationshipType: undefined;
          relatedModelIdentifier: never;
          relationName: undefined;
        }
      | {
          model: 'BoringChild';
          identifier: 'id';
          field: 'json';
          type: Json | null;
          relatedModel: undefined;
          relationshipType: undefined;
          relationName: undefined;
          relatedModelIdentifier: never;
        };

    // FIXME: Udpate Expected to reflect new relationship modeling
    // type test = Expect<Equal<Actual, Expected>>;
  });

  test('can extract a field that relates to a model', () => {
    type Schema = ResolveSchema<typeof schema>;
    type Identifiers = ModelIdentifier<SchemaTypes<typeof schema>>;

    type D = Denormalized<Schema, Identifiers>;

    type Actual = Prettify<Extract<D, { relatedModel: 'BoringChild' }>>;

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
        references: string[];
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
        childFromParentA: a.hasMany('MultiChild', 'multiParentAId'),
      }),
      MultiParentB: a
        .model({
          cpkA: a.string().required(),
          cpkB: a.integer().required(),
          childFromParentB: a.hasMany('MultiChild', ['multiParentBCpkA', 'multiParentBCpkB']),
        })
        .identifier(['cpkA', 'cpkB']),
      MultiParentC: a.model({
        childFromParentC: a.hasMany('MultiChild', 'multiParentCId'),
      }),
      MultiChild: a.model({
        multiParentAId: a.id(),
        multiParentBCpkA: a.id(),
        multiParentBCpkB: a.id(),
        multiParentCId: a.id(),
        parentA: a.belongsTo('MultiParentA', 'multiParentAId'),
        parentB: a.belongsTo('MultiParentB', ['multiParentBCpkA', 'multiParentBCpkB']),
        parentC: a.belongsTo('MultiParentB', 'multiParentCId'),
      }),
    });

    type Schema = ResolveSchema<typeof schema>;
    type Identifiers = ModelIdentifier<SchemaTypes<typeof schema>>;

    type D = Denormalized<Schema, Identifiers>;

    type Actual = Prettify<Extract<D, { relatedModel: 'MultiChild' }>>;

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
            references: string[];
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
            references: string[];
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
            references: string[];
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
    type Schema = ResolveSchema<typeof schema>;
    type Identifiers = ModelIdentifier<SchemaTypes<typeof schema>>;

    type Actual = Prettify<ImpliedFKs<Schema, Identifiers, 'BoringParent'>>;
    type Expected = {
      boringParentChildNormalId?: string;
      boringParentChildReciprocalId?: string;
    };
    type test = Expect<Equal<Actual, Expected>>;
  });

  test('child with no implied keys', () => {
    type Schema = ResolveSchema<typeof schema>;
    type Identifiers = ModelIdentifier<SchemaTypes<typeof schema>>;

    type Actual = ImpliedFKs<Schema, Identifiers, 'BoringChild'>;
    type Expected = never;
    // FIXME: Udpate Expected to reflect new relationship modeling
    // type test = Expect<Equal<Actual, Expected>>;
  });

  test('child with hasOne:belongsTo key', () => {
    type Schema = ResolveSchema<typeof schema>;
    type Identifiers = ModelIdentifier<SchemaTypes<typeof schema>>;

    type Actual = ImpliedFKs<Schema, Identifiers, 'BoringReciprocalChild'>;
    type Expected = {
      boringReciprocalChildParentId?: string;
    };
    type test = Expect<Equal<Actual, Expected>>;
  });

  test('child with implied FK from hasMany', () => {
    type Schema = ResolveSchema<typeof schema>;
    type Identifiers = ModelIdentifier<SchemaTypes<typeof schema>>;

    type Actual = ImpliedFKs<Schema, Identifiers, 'BoringHasManyChild'>;
    type Expected = {
      boringParentChildHasManyNormalId?: string;
    };
    type test = Expect<Equal<Actual, Expected>>;
  });

  test('child with implied FK from hasMany, with reciprocal belongsTo', () => {
    type Schema = ResolveSchema<typeof schema>;
    type Identifiers = ModelIdentifier<SchemaTypes<typeof schema>>;

    type Actual = ImpliedFKs<Schema, Identifiers, 'ReciprocalHasManyChild'>;
    type Expected = {
      boringParentChildHasManyReciprocalId?: string;
    };
    type test = Expect<Equal<Actual, Expected>>;
  });

  test('CPK hasOne', () => {
    const schema = a.schema({
      CPKParent: a
        .model({
          CPKParentIdFieldA: a.id().required(),
          CPKParentIdFieldB: a.id().required(),
          childNormal: a.hasOne('CPKChild', ['CPKParentIdFieldA', 'CPKParentIdFieldB']),
        })
        .identifier(['CPKParentIdFieldA', 'CPKParentIdFieldB']),
      CPKChild: a
        .model({
          CPKChildIdFieldA: a.id().required(),
          CPKChildIdFieldB: a.id().required(),
          value: a.string(),
          CPKParentIdFieldA: a.id().required(),
          CPKParentIdFieldB: a.id().required(),
          parent: a.belongsTo('CPKParent', ['CPKParentIdFieldA', 'CPKParentIdFieldB'])
        })
        .identifier(['CPKChildIdFieldA', 'CPKChildIdFieldB']),
    });

    type Schema = ResolveSchema<typeof schema>;
    type Identifiers = ModelIdentifier<SchemaTypes<typeof schema>>;

    type ParentActual = ImpliedFKs<Schema, Identifiers, 'CPKParent'>;
    type ParentExpected = {
      cPKParentChildNormalCPKChildIdFieldA?: string;
      cPKParentChildNormalCPKChildIdFieldB?: string;
    };
    type testParent = Expect<Equal<ParentActual, ParentExpected>>;

    type ChildActual = ImpliedFKs<Schema, Identifiers, 'CPKChild'>;
    type ChildExpected = never;
    type testChild = Expect<Equal<ParentActual, ParentExpected>>;
  });

  test('cpk hasOne:belongsTo', () => {
    const schema = a.schema({
      CPKParent: a
        .model({
          CPKParentIdFieldA: a.id().required(),
          CPKParentIdFieldB: a.id().required(),
          childReciprocal: a.hasOne('CPKReciprocalChild', ['CPKParentIdFieldA', 'CPKParentIdFieldB']),
        })
        .identifier(['CPKParentIdFieldA', 'CPKParentIdFieldB']),
      CPKReciprocalChild: a
        .model({
          CPKReciprocalChildIdFieldA: a.id().required(),
          CPKReciprocalChildIdFieldB: a.id().required(),
          value: a.string(),
          CPKParentIdFieldA: a.id().required(),
          CPKParentIdFieldB: a.id().required(),
          parent: a.belongsTo('CPKParent', ['CPKParentIdFieldA', 'CPKParentIdFieldB']),
        })
        .identifier([
          'CPKReciprocalChildIdFieldA',
          'CPKReciprocalChildIdFieldB',
        ]),
    });

    type Schema = ResolveSchema<typeof schema>;
    type Identifiers = ModelIdentifier<SchemaTypes<typeof schema>>;

    type ParentActual = ImpliedFKs<Schema, Identifiers, 'CPKParent'>;
    type ParentExpected = {
      cPKParentChildReciprocalCPKReciprocalChildIdFieldA?: string;
      cPKParentChildReciprocalCPKReciprocalChildIdFieldB?: string;
    };
    type testParent = Expect<Equal<ParentActual, ParentExpected>>;

    type ChildActual = ImpliedFKs<Schema, Identifiers, 'CPKReciprocalChild'>;
    type ChildExpected = {
      // cPKReciprocalChild Parent CPKParentIdFieldA;
      cPKReciprocalChildParentCPKParentIdFieldA?: string;
      cPKReciprocalChildParentCPKParentIdFieldB?: string;
    };
    type testChild = Expect<Equal<ChildActual, ChildExpected>>;
  });

  test('cpk hasMany', () => {
    const schema = a.schema({
      CPKParent: a
        .model({
          CPKParentIdFieldA: a.id().required(),
          CPKParentIdFieldB: a.id().required(),
          childNormal: a.hasOne('CPKChild', ['CPKParentIdFieldA', 'CPKParentIdFieldB']),
          childReciprocal: a.hasOne('CPKReciprocalChild', ['CPKParentIdFieldA', 'CPKParentIdFieldB']),
          childHasManyNormal: a.hasMany('CPKHasManyChild', ['CPKParentIdFieldA', 'CPKParentIdFieldB']),
          childHasManyReciprocal: a.hasMany('CPKReciprocalHasManyChild', ['CPKParentIdFieldA', 'CPKParentIdFieldB']),
        })
        .identifier(['CPKParentIdFieldA', 'CPKParentIdFieldB']),
      CPKChild: a
        .model({
          CPKChildIdFieldA: a.id().required(),
          CPKChildIdFieldB: a.id().required(),
          value: a.string(),
          CPKParentIdFieldA: a.id().required(),
          CPKParentIdFieldB: a.id().required(),
          parent: a.belongsTo('CPKParent', ['CPKParentIdFieldA', 'CPKParentIdFieldB'])
        })
        .identifier(['CPKChildIdFieldA', 'CPKChildIdFieldB']),
      CPKReciprocalChild: a
        .model({
          CPKReciprocalChildIdFieldA: a.id().required(),
          CPKReciprocalChildIdFieldB: a.id().required(),
          value: a.string(),
          CPKParentIdFieldA: a.id().required(),
          CPKParentIdFieldB: a.id().required(),
          parent: a.belongsTo('CPKParent', ['CPKParentIdFieldA', 'CPKParentIdFieldB'])
        })
        .identifier([
          'CPKReciprocalChildIdFieldA',
          'CPKReciprocalChildIdFieldB',
        ]),
    });

    type Schema = ResolveSchema<typeof schema>;
    type Identifiers = ModelIdentifier<SchemaTypes<typeof schema>>;

    type ParentActual = Prettify<ImpliedFKs<Schema, Identifiers, 'CPKParent'>>;
    type ParentExpected = {
      cPKParentChildNormalCPKChildIdFieldA?: string;
      cPKParentChildNormalCPKChildIdFieldB?: string;
      cPKParentChildReciprocalCPKReciprocalChildIdFieldA?: string;
      cPKParentChildReciprocalCPKReciprocalChildIdFieldB?: string;
    };
    type testParent = Expect<Equal<ParentActual, ParentExpected>>;

    type ChildActual = ImpliedFKs<Schema, Identifiers, 'CPKReciprocalChild'>;
    type ChildExpected = {
      cPKReciprocalChildParentCPKParentIdFieldA?: string;
      cPKReciprocalChildParentCPKParentIdFieldB?: string;
    };
    type testChild = Expect<Equal<ChildActual, ChildExpected>>;
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

    type Schema = ResolveSchema<typeof schema>;
    type Identifiers = ModelIdentifier<SchemaTypes<typeof schema>>;

    type LeftActual = ImpliedFKs<Schema, Identifiers, 'ManyToManyLeft'>;
    type LeftExpected = never;
    type testLeft = Expect<Equal<LeftActual, LeftExpected>>;

    type RightActual = ImpliedFKs<Schema, Identifiers, 'ManyToManyRight'>;
    type RightExpected = never;
    type testRight = Expect<Equal<RightActual, RightExpected>>;

    type JoinTableActual = Prettify<
      ImpliedFKs<Schema, Identifiers, 'ChuckNorris'>
    >;
    type JoinTableExected = {
      manyToManyLeftId?: string;
      manyToManyRightId?: string;
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

    type Schema = ResolveSchema<typeof schema>;
    type Identifiers = ModelIdentifier<SchemaTypes<typeof schema>>;

    type LeftActual = ImpliedFKs<Schema, Identifiers, 'ManyToManyLeft'>;
    type LeftExpected = never;
    type testLeft = Expect<Equal<LeftActual, LeftExpected>>;

    type RightActual = ImpliedFKs<Schema, Identifiers, 'ManyToManyRight'>;
    type RightExpected = never;
    type testRight = Expect<Equal<RightActual, RightExpected>>;

    type JoinTableActual = Prettify<
      ImpliedFKs<Schema, Identifiers, 'Wolverine'>
    >;
    type JoinTableExected = {
      manyToManyLeftLeftIdA?: string;
      manyToManyLeftLeftIdB?: number;
      manyToManyRightRightIdA?: string;
      manyToManyRightRightIdB?: number;
    };
    type testJoin = Expect<Equal<JoinTableActual, JoinTableExected>>;
  });
});
