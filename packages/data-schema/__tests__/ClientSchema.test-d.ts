import { a, ClientSchema } from '../index';
import {
  Expect,
  Equal,
  Prettify,
  ExpectFalse,
  HasKey,
  __modelMeta__,
} from '@aws-amplify/data-schema-types';

describe('implied fields', () => {
  describe('boring model keys', () => {
    const schema = a.schema({
      BoringParent: a.model({
        childNormal: a.hasOne('BoringChild'),
        childReciprocal: a.hasOne('BoringReciprocalChild'),
        childHasManyNormal: a.hasMany('BoringHasManyChild'),
        childHasManyReciprocal: a.hasMany('ReciprocalHasManyChild'),
      }),
      BoringChild: a.model({
        value: a.string(),
        json: a.json(),
      }),
      BoringReciprocalChild: a.model({
        parent: a.belongsTo('BoringParent'),
        value: a.string(),
        json: a.json(),
      }),
      BoringHasManyChild: a.model({
        value: a.string(),
        json: a.json(),
      }),
      ReciprocalHasManyChild: a.model({
        value: a.string(),
        json: a.json(),
        parent: a.belongsTo('BoringParent'),
      }),
    });

    type Schema = ClientSchema<typeof schema>;

    test('hasOne FK is implied', () => {
      type assert1 = Expect<
        Equal<
          Schema['BoringParent']['boringParentChildNormalId'],
          string | undefined
        >
      >;
      type assert2 = Expect<
        Equal<
          Schema['BoringParent']['boringParentChildReciprocalId'],
          string | undefined
        >
      >;
    });

    test('repriprocal belongsTo on hasOne implies FK', () => {
      type assert = Expect<
        Equal<
          Schema['BoringReciprocalChild']['boringReciprocalChildParentId'],
          string | undefined
        >
      >;
    });

    test('hasMany FK is implied on children', () => {
      type assert1 = Expect<
        Equal<
          Schema['BoringHasManyChild']['boringParentChildHasManyNormalId'],
          string | undefined
        >
      >;
      type assert2 = Expect<
        Equal<
          Schema['ReciprocalHasManyChild']['boringParentChildHasManyReciprocalId'],
          string | undefined
        >
      >;
    });
  });

  describe('CPK model keys', () => {
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
    type Schema = ClientSchema<typeof schema>;

    test('hasOne FKs are implied', () => {
      type hasOneA = Expect<
        Equal<
          Schema['CPKParent']['cPKParentChildNormalCPKChildIdFieldA'],
          string | undefined
        >
      >;
      type hasOneB = Expect<
        Equal<
          Schema['CPKParent']['cPKParentChildNormalCPKChildIdFieldB'],
          string | undefined
        >
      >;
      type hasOneReciprocatedA = Expect<
        Equal<
          Schema['CPKParent']['cPKParentChildReciprocalCPKReciprocalChildIdFieldA'],
          string | undefined
        >
      >;
      type hasOneReciprocatedB = Expect<
        Equal<
          Schema['CPKParent']['cPKParentChildReciprocalCPKReciprocalChildIdFieldB'],
          string | undefined
        >
      >;
    });

    test('repriprocal belongsTo on hasOne implies FKs', () => {
      type belongsToA = Expect<
        Equal<
          Schema['CPKReciprocalChild']['cPKReciprocalChildParentCPKParentIdFieldA'],
          string | undefined
        >
      >;
      type belongsToB = Expect<
        Equal<
          Schema['CPKReciprocalChild']['cPKReciprocalChildParentCPKParentIdFieldB'],
          string | undefined
        >
      >;
    });

    test('hasMany FK is implied on children', () => {
      type hasManyA = Expect<
        Equal<
          Schema['CPKHasManyChild']['cPKParentChildHasManyNormalCPKParentIdFieldA'],
          string | undefined
        >
      >;
      type hasManyB = Expect<
        Equal<
          Schema['CPKHasManyChild']['cPKParentChildHasManyNormalCPKParentIdFieldB'],
          string | undefined
        >
      >;
      type hasManyReprocatedA = Expect<
        Equal<
          Schema['CPKReciprocalHasManyChild']['cPKParentChildHasManyReciprocalCPKParentIdFieldA'],
          string | undefined
        >
      >;
      type hasManyReprocatedB = Expect<
        Equal<
          Schema['CPKReciprocalHasManyChild']['cPKParentChildHasManyReciprocalCPKParentIdFieldB'],
          string | undefined
        >
      >;
    });
  });

  describe('schemas with owner/group auth models surface ownership fields', () => {
    const schema = a.schema({
      DefaultOwnerField: a
        .model({
          somefield: a.string(),
          jsonfield: a.json(),
        })
        .authorization([a.allow.owner()]),
      CustomOwnerField: a
        .model({
          somefield: a.string(),
          jsonfield: a.json(),
        })
        .authorization([a.allow.owner().inField('customOwnerField')]),
      GroupIn: a
        .model({
          somefield: a.string(),
          jsonfield: a.json(),
        })
        .authorization([a.allow.groupDefinedIn('myGroupField')]),
      GroupsIn: a
        .model({
          somefield: a.string(),
          jsonfield: a.json(),
        })
        .authorization([a.allow.groupsDefinedIn('myGroupsField')]),
    });
    type Schema = ClientSchema<typeof schema>;

    test('default owner', () => {
      type test = Expect<
        Equal<Schema['DefaultOwnerField']['owner'], string | undefined>
      >;
    });

    test('custom owner', () => {
      type test = Expect<
        Equal<
          Schema['CustomOwnerField']['customOwnerField'],
          string | undefined
        >
      >;
    });

    test('group', () => {
      type test = Expect<
        Equal<Schema['GroupIn']['myGroupField'], string | undefined>
      >;
    });

    test('groups', () => {
      type test = Expect<
        Equal<Schema['GroupsIn']['myGroupsField'], string[] | undefined>
      >;
    });
  });

  describe('implicit date fields are surfaced', () => {
    const schema = a.schema({
      // date field customization not yet supported, AFIAK.
      // so, just one model to confirm types on.
      SimpleModel: a.model({
        somefield: a.string(),
      }),
    });

    type Schema = ClientSchema<typeof schema>;

    test('default fields', () => {
      type testCreatedAt = Expect<
        Equal<Schema['SimpleModel']['createdAt'], string>
      >;
      type testUpdatedAt = Expect<
        Equal<Schema['SimpleModel']['updatedAt'], string>
      >;
    });
  });
});

describe('Custom operations hidden from ClientSchema', () => {
  test('Custom mutation', () => {
    const schema = a.schema({
      Post: a.model({
        title: a.string(),
      }),
      likePost: a
        .mutation()
        .arguments({ postId: a.string() })
        .returns(a.ref('Post'))
        .function('fnLikePost'),
    });

    type Schema = ClientSchema<typeof schema>;
    type Test = ExpectFalse<HasKey<Schema, 'likePost'>>;
  });
  test('Custom query', () => {
    const schema = a.schema({
      Post: a.model({
        title: a.string(),
      }),
      getLiked: a.query().returns(a.ref('Post')).function('fnGetLiked'),
    });

    type Schema = ClientSchema<typeof schema>;
    type Test = ExpectFalse<HasKey<Schema, 'getLiked'>>;
  });
  test('Custom subscription', () => {
    const schema = a.schema({
      Post: a.model({
        title: a.string(),
      }),
      onLiked: a.subscription().returns(a.ref('Post')).function('fnOnLiked'),
    });

    type Schema = ClientSchema<typeof schema>;
    type Test = ExpectFalse<HasKey<Schema, 'onLiked'>>;
  });
});

describe('Enum types', () => {
  test('Inline Enum Type', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string().required(),
        status: a.enum(['draft', 'pending', 'published']),
      }),
    });

    type Schema = typeof s;

    type Resolved = Prettify<ClientSchema<Schema>['Post']>;

    type Expected = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      title: string;
      status?: 'draft' | 'pending' | 'published' | null;
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Explicit Enum Type', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string().required(),
        status: a.ref('Status'),
      }),
      Status: a.enum(['draft', 'pending', 'published']),
    });

    type Schema = typeof s;

    type Resolved = Prettify<ClientSchema<Schema>['Post']>;

    type Expected = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      title: string;
      status?: 'draft' | 'pending' | 'published' | null;
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Explicit Enum Type; required field', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string().required(),
        status: a.ref('Status').required(),
      }),
      Status: a.enum(['draft', 'pending', 'published']),
    });

    type Schema = typeof s;

    type Resolved = Prettify<ClientSchema<Schema>['Post']>;

    type Expected = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      title: string;
      status: 'draft' | 'pending' | 'published';
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('Explicit Enum Type; multiple models', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string().required(),
        status: a.ref('Status').required(),
      }),
      Comment: a.model({
        content: a.string().required(),
        status: a.ref('Status'),
      }),
      Status: a.enum(['draft', 'pending', 'published']),
    });

    type Schema = typeof s;

    type Resolved = Prettify<Pick<ClientSchema<Schema>, 'Post' | 'Comment'>>;

    type Expected = {
      Post: {
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
        title: string;
        status: 'draft' | 'pending' | 'published';
      };
      Comment: {
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
        content: string;
        status?: 'draft' | 'pending' | 'published' | null;
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;

    type ResolvedEnumMeta = ClientSchema<Schema>[typeof __modelMeta__]['enums'];

    type ExpectedEnumMeta = {
      Status: 'draft' | 'pending' | 'published';
    };

    type test2 = Expect<Equal<ResolvedEnumMeta, ExpectedEnumMeta>>;
  });
});
