import { a, ClientSchema } from '../src/index';
import { __modelMeta__ } from '../src/runtime';
import { configure } from '../src/internals';
import {
  Expect,
  Equal,
  Prettify,
  ExpectFalse,
  HasKey,
} from '@aws-amplify/data-schema-types';

describe('implied fields', () => {
  describe('CPK model keys', () => {
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
          CPKParentIdFieldA: a.id().required(),
          CPKParentIdFieldB: a.id().required(),
          parent: a.belongsTo('CPKParent', ['CPKParentIdFieldA', 'CPKParentIdFieldB']),
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
    type Schema = ClientSchema<typeof schema>;

    test('repriprocal belongsTo on hasOne has explicitly defined reference fields', () => {
      type belongsToA = Expect<
        Equal<
          Schema['CPKReciprocalChild']['CPKParentIdFieldA'],
          string
        >
      >;
      type belongsToB = Expect<
        Equal<
          Schema['CPKReciprocalChild']['CPKParentIdFieldB'],
          string
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

describe('SQL Schema', () => {
  const fakeSecret = () => ({}) as any;

  const datasourceConfigMySQL = {
    engine: 'mysql',
    connectionUri: fakeSecret(),
  } as const;

  test('.renameModels() on a SQL schema', () => {
    const sqlSchema = configure({ database: datasourceConfigMySQL }).schema({
      post: a
        .model({
          id: a.string().required(),
          title: a.string(),
          author: a.string(),
        })
        .identifier(['id']),
    });

    const modified = sqlSchema
      .renameModels(() => [['post', 'RenamedPost']])
      .setAuthorization((models) =>
        models.RenamedPost.authorization([a.allow.public()]),
      );

    type Schema = typeof modified;

    type Resolved = Prettify<ClientSchema<Schema>>;

    type Expected = {
      RenamedPost: {
        id: string;
        title?: string | null;
        author?: string | null;
      };
      [__modelMeta__]: {
        RenamedPost: {
          identifier: 'id';
        };
        enums: Record<never, never>;
        customTypes: Record<never, never>;
        customOperations: Record<never, never>;
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('sql schema rename multiple models', () => {
    const sqlSchema = configure({ database: datasourceConfigMySQL }).schema({
      post: a
        .model({
          id: a.string().required(),
          title: a.string(),
          author: a.string(),
        })
        .identifier(['id']),
      comment: a
        .model({
          id: a.string().required(),
          title: a.string(),
          author: a.string(),
        })
        .identifier(['id']),
      tags: a
        .model({
          id: a.string().required(),
          title: a.string(),
          author: a.string(),
        })
        .identifier(['id']),
    });

    const modified = sqlSchema
      .renameModels(() => [
        ['post', 'RenamedPost'],
        ['comment', 'RenamedComment'],
      ])
      .setAuthorization((models) => [
        models.RenamedPost.authorization([a.allow.public()]),
        models.RenamedComment.authorization([a.allow.public()]),
        // tags is unchanged, since we didn't rename it
        models.tags.authorization([a.allow.public()]),
      ]);

    type Schema = typeof modified;

    type Resolved = Prettify<ClientSchema<Schema>>;

    type Expected = {
      RenamedPost: {
        id: string;
        title?: string | null;
        author?: string | null;
      };
      RenamedComment: {
        id: string;
        title?: string | null;
        author?: string | null;
      };
      tags: {
        id: string;
        title?: string | null;
        author?: string | null;
      };
      [__modelMeta__]: {
        RenamedPost: {
          identifier: 'id';
        };
        RenamedComment: {
          identifier: 'id';
        };
        tags: {
          identifier: 'id';
        };
        enums: Record<never, never>;
        customTypes: Record<never, never>;
        customOperations: Record<never, never>;
      };
    };

    type test = Expect<Equal<Resolved, Expected>>;
  });

  test('.renameModels() not available on a DDB schema', () => {
    const schema = a.schema({
      post: a
        .model({
          id: a.string().required(),
          title: a.string(),
          author: a.string(),
        })
        .identifier(['id']),
    });

    try {
      // @ts-expect-error
      schema.renameModels(() => [['post', 'RenamedPost']]);
    } catch (error) {
      error;
    }
  });
});
