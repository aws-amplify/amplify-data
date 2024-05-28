import { a, ClientSchema } from '../src/index';
import { __modelMeta__, type ExtractModelMeta } from '../src/runtime';
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
          childNormal: a.hasOne('CPKChild', [
            'CPKParentIdFieldA',
            'CPKParentIdFieldB',
          ]),
          childReciprocal: a.hasOne('CPKReciprocalChild', [
            'CPKParentIdFieldA',
            'CPKParentIdFieldB',
          ]),
          childHasManyNormal: a.hasMany('CPKHasManyChild', [
            'CPKParentIdFieldA',
            'CPKParentIdFieldB',
          ]),
          childHasManyReciprocal: a.hasMany('CPKReciprocalHasManyChild', [
            'CPKParentIdFieldA',
            'CPKParentIdFieldB',
          ]),
        })
        .identifier(['CPKParentIdFieldA', 'CPKParentIdFieldB']),
      CPKChild: a
        .model({
          CPKChildIdFieldA: a.id().required(),
          CPKChildIdFieldB: a.id().required(),
          value: a.string(),
          CPKParentIdFieldA: a.id(),
          CPKParentIdFieldB: a.id(),
          parent: a.belongsTo('CPKParent', [
            'CPKParentIdFieldA',
            'CPKParentIdFieldB',
          ]),
        })
        .identifier(['CPKChildIdFieldA', 'CPKChildIdFieldB']),
      CPKReciprocalChild: a
        .model({
          CPKReciprocalChildIdFieldA: a.id().required(),
          CPKReciprocalChildIdFieldB: a.id().required(),
          value: a.string(),
          CPKParentIdFieldA: a.id().required(),
          CPKParentIdFieldB: a.id().required(),
          parent: a.belongsTo('CPKParent', [
            'CPKParentIdFieldA',
            'CPKParentIdFieldB',
          ]),
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
          parent: a.belongsTo('CPKParent', [
            'CPKParentIdFieldA',
            'CPKParentIdFieldB',
          ]),
        })
        .identifier(['CPKHasManyChildIdFieldA', 'CPKHasManyChildIdFieldB']),
      CPKReciprocalHasManyChild: a
        .model({
          CPKReciprocalHasManyChildIdFieldA: a.id().required(),
          CPKReciprocalHasManyChildIdFieldB: a.id().required(),
          value: a.string(),
          CPKParentIdFieldA: a.id(),
          CPKParentIdFieldB: a.id(),
          parent: a.belongsTo('CPKParent', [
            'CPKParentIdFieldA',
            'CPKParentIdFieldB',
          ]),
        })
        .identifier([
          'CPKReciprocalHasManyChildIdFieldA',
          'CPKReciprocalHasManyChildIdFieldB',
        ]),
    });
    type Schema = ClientSchema<typeof schema>;

    test('repriprocal belongsTo on hasOne has explicitly defined reference fields', () => {
      type belongsToA = Expect<
        Equal<Schema['CPKReciprocalChild']['type']['CPKParentIdFieldA'], string>
      >;
      type belongsToB = Expect<
        Equal<Schema['CPKReciprocalChild']['type']['CPKParentIdFieldB'], string>
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
        .authorization((allow) => allow.owner()),
      CustomOwnerField: a
        .model({
          somefield: a.string(),
          jsonfield: a.json(),
        })
        .authorization((allow) => allow.ownerDefinedIn('customOwnerField')),
      GroupIn: a
        .model({
          somefield: a.string(),
          jsonfield: a.json(),
        })
        .authorization((allow) => allow.groupDefinedIn('myGroupField')),
      GroupsIn: a
        .model({
          somefield: a.string(),
          jsonfield: a.json(),
        })
        .authorization((allow) => allow.groupsDefinedIn('myGroupsField')),
    });
    type Schema = ClientSchema<typeof schema>;

    test('default owner', () => {
      type test = Expect<
        Equal<Schema['DefaultOwnerField']['type']['owner'], string | undefined>
      >;
    });

    test('custom owner', () => {
      type test = Expect<
        Equal<
          Schema['CustomOwnerField']['type']['customOwnerField'],
          string | undefined
        >
      >;
    });

    test('group', () => {
      type test = Expect<
        Equal<Schema['GroupIn']['type']['myGroupField'], string | undefined>
      >;
    });

    test('groups', () => {
      type test = Expect<
        Equal<Schema['GroupsIn']['type']['myGroupsField'], string[] | undefined>
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
        Equal<Schema['SimpleModel']['type']['createdAt'], string>
      >;
      type testUpdatedAt = Expect<
        Equal<Schema['SimpleModel']['type']['updatedAt'], string>
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

    type Resolved = Prettify<ClientSchema<Schema>['Post']['type']>;

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

    type Resolved = Prettify<ClientSchema<Schema>['Post']['type']>;

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

    type Resolved = Prettify<ClientSchema<Schema>['Post']['type']>;

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
        type: {
          readonly id: string;
          readonly createdAt: string;
          readonly updatedAt: string;
          title: string;
          status: 'draft' | 'pending' | 'published';
        };
      };
      Comment: {
        type: {
          readonly id: string;
          readonly createdAt: string;
          readonly updatedAt: string;
          content: string;
          status?: 'draft' | 'pending' | 'published' | null;
        };
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
        models.RenamedPost.authorization((allow) => allow.publicApiKey()),
      );

    type Schema = typeof modified;

    type Resolved = Prettify<ClientSchema<Schema>>;

    type Expected = {
      RenamedPost: {
        type: {
          id: string;
          title?: string | null;
          author?: string | null;
        };
      };
      [__modelMeta__]: {
        RenamedPost: {
          identifier: { pk: { id: string }; sk: never; compositeSk: never };
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
        models.RenamedPost.authorization((allow) => allow.publicApiKey()),
        models.RenamedComment.authorization((allow) => allow.publicApiKey()),
        // tags is unchanged, since we didn't rename it
        models.tags.authorization((allow) => allow.publicApiKey()),
        // @ts-expect-error
        models.tags.secondaryIndexes,
      ]);

    type Schema = typeof modified;

    type Resolved = Prettify<ClientSchema<Schema>>;

    type Expected = {
      RenamedPost: {
        type: {
          id: string;
          title?: string | null;
          author?: string | null;
        };
      };
      RenamedComment: {
        type: {
          id: string;
          title?: string | null;
          author?: string | null;
        };
      };
      tags: {
        type: {
          id: string;
          title?: string | null;
          author?: string | null;
        };
      };
      [__modelMeta__]: {
        RenamedPost: {
          identifier: { pk: { id: string }; sk: never; compositeSk: never };
        };
        RenamedComment: {
          identifier: { pk: { id: string }; sk: never; compositeSk: never };
        };
        tags: {
          identifier: { pk: { id: string }; sk: never; compositeSk: never };
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

  test('.addToSchema() adds custom types and enums to client schema', () => {
    const sqlSchema = configure({ database: datasourceConfigMySQL }).schema({
      post: a
        .model({
          id: a.string().required(),
          title: a.string(),
          author: a.string(),
        })
        .identifier(['id']),
    });

    const modified = sqlSchema.addToSchema({
      PostMeta: a.customType({
        viewCount: a.integer(),
        approvedOn: a.date(),
      }),
      PostStatus: a.enum(['draft', 'pending', 'approved', 'published']),
    });

    type ResolvedClientSchema = ClientSchema<typeof modified>;

    type ModelMeta = ExtractModelMeta<ResolvedClientSchema>;
    type ResolvedCustomTypes = Prettify<ModelMeta['customTypes']>;
    type ResolvedEnums = Prettify<ModelMeta['enums']>;

    type ExpectedCustomTypes = {
      PostMeta: {
        viewCount: number | null;
        approvedOn: string | null;
      };
    };

    type ExpectedEnums = {
      PostStatus: 'draft' | 'pending' | 'approved' | 'published';
    };

    type _ = Expect<Equal<ResolvedCustomTypes, ExpectedCustomTypes>>;
    type _2 = Expect<Equal<ResolvedEnums, ExpectedEnums>>;
  });
});
