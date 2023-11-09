import type {
  Equal,
  Expect,
  UnionToIntersection,
} from '@aws-amplify/amplify-data-next-types';
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

    type Schema = ResolveSchema<typeof schema>;
    type Identifiers = ModelIdentifier<SchemaTypes<typeof schema>>;

    type Actual = Denormalized<Schema, Identifiers>;
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

    type test = Expect<Equal<Actual, Expected>>;
  });

  test('can extract all model fields from a larger schema', () => {
    type Schema = ResolveSchema<typeof schema>;
    type Identifiers = ModelIdentifier<SchemaTypes<typeof schema>>;

    type D = Denormalized<Schema, Identifiers>;

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
    type Schema = ResolveSchema<typeof schema>;
    type Identifiers = ModelIdentifier<SchemaTypes<typeof schema>>;

    type D = Denormalized<Schema, Identifiers>;

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

    type Schema = ResolveSchema<typeof schema>;
    type Identifiers = ModelIdentifier<SchemaTypes<typeof schema>>;

    type D = Denormalized<Schema, Identifiers>;

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
    type Schema = ResolveSchema<typeof schema>;
    type Identifiers = ModelIdentifier<SchemaTypes<typeof schema>>;

    type Actual = ImpliedFKs<Schema, Identifiers, 'BoringParent'>;
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
    type test = Expect<Equal<Actual, Expected>>;
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

    type Schema = ResolveSchema<typeof schema>;
    type Identifiers = ModelIdentifier<SchemaTypes<typeof schema>>;

    type ParentActual = ImpliedFKs<Schema, Identifiers, 'CPKParent'>;
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

    type Schema = ResolveSchema<typeof schema>;
    type Identifiers = ModelIdentifier<SchemaTypes<typeof schema>>;

    type Actual = ImpliedFKs<Schema, Identifiers, 'MultiChild'>;
    type Expected = {
      multiParentAChildFromParentAId?: string;
      multiParentBChildFromParentBCpkA?: string;
      multiParentBChildFromParentBCpkB?: number;
      multiParentCChildFromParentCId?: string;
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

    type Schema = ResolveSchema<typeof schema>;
    type Identifiers = ModelIdentifier<SchemaTypes<typeof schema>>;

    type LeftActual = ImpliedFKs<Schema, Identifiers, 'ManyToManyLeft'>;
    type LeftExpected = never;
    type testLeft = Expect<Equal<LeftActual, LeftExpected>>;

    type RightActual = ImpliedFKs<Schema, Identifiers, 'ManyToManyRight'>;
    type RightExpected = never;
    type testRight = Expect<Equal<RightActual, RightExpected>>;

    type JoinTableActual = ImpliedFKs<Schema, Identifiers, 'ChuckNorris'>;
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

    type JoinTableActual = ImpliedFKs<Schema, Identifiers, 'Wolverine'>;
    type JoinTableExected = {
      manyToManyLeftLeftIdA?: string;
      manyToManyLeftLeftIdB?: number;
      manyToManyRightRightIdA?: string;
      manyToManyRightRightIdB?: number;
    };
    type testJoin = Expect<Equal<JoinTableActual, JoinTableExected>>;
  });
});
