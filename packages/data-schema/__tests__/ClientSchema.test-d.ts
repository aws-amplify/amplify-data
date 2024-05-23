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
  // });

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
        Equal<
          Schema['DefaultOwnerField']['type']['owner'],
          string | null | undefined
        >
      >;
    });

    test('custom owner', () => {
      type test = Expect<
        Equal<
          Schema['CustomOwnerField']['type']['customOwnerField'],
          string | null | undefined
        >
      >;
    });

    test('group', () => {
      type test = Expect<
        Equal<
          Schema['GroupIn']['type']['myGroupField'],
          string | null | undefined
        >
      >;
    });

    test('groups', () => {
      type test = Expect<
        Equal<
          Schema['GroupsIn']['type']['myGroupsField'],
          string[] | null | undefined
        >
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
      status?: 'draft' | 'pending' | 'published' | null | undefined;
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

    type Schema = ClientSchema<typeof s>;

    type ActualPost = Prettify<Schema['Post']['type']>;
    type ActualComment = Prettify<Schema['Comment']['type']>;
    type ActualStatus = Schema['Status']['type'];

    type ExpectedPost = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      title: string;
      status: 'draft' | 'pending' | 'published';
    };
      
    type ExpectedComment = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      content: string;
      status?: 'draft' | 'pending' | 'published' | null;
    };

    type ExpectedStatus = 'draft' | 'pending' | 'published';

    type testPost = Expect<Equal<ActualPost, ExpectedPost>>;
    type testComment = Expect<Equal<ActualComment, ExpectedComment>>
    type testStatus = Expect<Equal<ActualStatus, ExpectedStatus>>;
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

    type Schema = ClientSchema<typeof modified>;

    type ActualModel = Prettify<Schema['RenamedPost']['type']>
    type ActualModelPK = Schema['RenamedPost']['identifier'];

    type ExpectedModel = {
      id: string;
      title?: string | null;
      author?: string | null;
    };
    
    type ExpectedModelPK = {
      id: string
    }

    type testModel = Expect<Equal<ActualModel, ExpectedModel>>;
    type testModelPK = Expect<Equal<ActualModelPK, ExpectedModelPK>>;
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
      ]);

    type Schema = ClientSchema<typeof modified>;

    type ActualRenamedPost = Prettify<Schema['RenamedPost']['type']>;
    type ActualRenamedComment = Prettify<Schema['RenamedComment']['type']>;
    type ActualTags = Prettify<Schema['tags']['type']>;

    type ExpectedPost = {
          id: string;
          title?: string | null;
          author?: string | null;
    };
    type ExpectedComment = {
          id: string;
          title?: string | null;
          author?: string | null;
        };
    type ExpectedTags = {
          id: string;
          title?: string | null;
          author?: string | null;
    };

    type ActualPostId = Schema['RenamedPost']['identifier'];
    type ActualCommentId = Schema['RenamedComment']['identifier'];
    type ActualTagsId = Schema['tags']['identifier'];
    type ExpectedPostId = { id: string };
    type ExpectedCommentId = { id: string };
    type ExpectedTagsId = { id: string };
      
    type testPostModel = Expect<Equal<ActualRenamedPost, ExpectedPost>>;
    type testCommentModel = Expect<Equal<ActualRenamedComment, ExpectedComment>>;
    type testTagsModel = Expect<Equal<ActualTags, ExpectedTags>>;

    type testPostPK = Expect<Equal<ActualPostId, ExpectedPostId>>;
    type testCommentPK = Expect<Equal<ActualCommentId, ExpectedCommentId>>;
    type testTagsPK = Expect<Equal<ActualTagsId, ExpectedTagsId>>;
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

    type Schema = ClientSchema<typeof modified>;

    type ActualPostMeta = Schema['PostMeta']['type'];
    type ActualPostStatus = Schema['PostStatus']['type'];

    type ExpectedPostMeta = {
      viewCount?: number | null | undefined;
      approvedOn?: string | null | undefined;
    };

    type ExpectedPostStatus = 'draft' | 'pending' | 'approved' | 'published';

    type testPostMeta = Expect<Equal<ActualPostMeta, ExpectedPostMeta>>;
    type testPostStatus = Expect<Equal<ActualPostStatus, ExpectedPostStatus>>;
  });
});
