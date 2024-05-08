import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { a, ClientSchema } from '../src/index';
import {
  Expect,
  Equal,
  Prettify,
  DerivedCombinedSchema,
  DerivedModelSchema,
} from '@aws-amplify/data-schema-types';
import {
  AuthMode,
  CustomHeaders,
  SingularReturnValue,
  __modelMeta__,
} from '../src/runtime';
import { configure } from '../src/internals';
import { Nullable } from '../src/ModelField';

const fakeSecret = () => ({}) as any;

const datasourceConfigMySQL = {
  engine: 'mysql',
  connectionUri: fakeSecret(),
} as const;

const aSql = configure({ database: datasourceConfigMySQL });

// evaluates type defs in corresponding test-d.ts file
it('should not produce static type errors', async () => {
  await expectTypeTestsToPassAsync(__filename);
});

describe('schema generation', () => {
  test('matches shared backend type', () => {
    const schema: DerivedModelSchema = a.schema({
      A: a
        .model({
          field: a.string(),
        })
        .authorization((allow) => allow.publicApiKey()),
    });
  });

  test('with relationships', () => {
    const schema = a
      .schema({
        BoringParent: a.model({
          childNormal: a.hasOne('BoringChild', 'boringParentId'),
          childReciprocal: a.hasOne('BoringReciprocalChild', 'boringParentId'),
          childHasManyNormal: a.hasMany('BoringHasManyChild', 'boringParentId'),
          childHasManyReciprocal: a.hasMany(
            'ReciprocalHasManyChild',
            'boringParentId',
          ),
        }),
        BoringChild: a.model({
          value: a.string(),
          boringParentId: a.id(),
          boringParent: a.belongsTo('BoringParent', 'boringParentId'),
        }),
        BoringReciprocalChild: a.model({
          value: a.string(),
          boringParentId: a.id(),
          parent: a.belongsTo('BoringParent', 'boringParentId'),
        }),
        BoringHasManyChild: a.model({
          value: a.string(),
          boringParentId: a.id(),
          parent: a.belongsTo('BoringParent', 'boringParentId'),
        }),
        ReciprocalHasManyChild: a.model({
          value: a.string(),
          boringParentId: a.id(),
          parent: a.belongsTo('BoringParent', 'boringParentId'),
        }),
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
            value: a.string(),
            CPKChildIdFieldA: a.id().required(),
            CPKChildIdFieldB: a.id().required(),
            CPKParentIdFieldA: a.id(),
            CPKParentIdFieldB: a.id(),
            cpkParent: a.belongsTo('CPKParent', [
              'CPKParentIdFieldA',
              'CPKParentIdFieldB',
            ]),
          })
          .identifier(['CPKChildIdFieldA', 'CPKChildIdFieldB']),
        CPKReciprocalChild: a
          .model({
            CPKReciprocalChildIdFieldA: a.id().required(),
            CPKReciprocalChildIdFieldB: a.id().required(),
            CPKParentIdFieldA: a.id(),
            CPKParentIdFieldB: a.id(),
            cpkParent: a.belongsTo('CPKParent', [
              'CPKParentIdFieldA',
              'CPKParentIdFieldB',
            ]),
            value: a.string(),
          })
          .identifier([
            'CPKReciprocalChildIdFieldA',
            'CPKReciprocalChildIdFieldB',
          ]),
        CPKHasManyChild: a
          .model({
            value: a.string(),
            CPKHasManyChildIdFieldA: a.id().required(),
            CPKHasManyChildIdFieldB: a.id().required(),
            CPKParentIdFieldA: a.id(),
            CPKParentIdFieldB: a.id(),
            cpkParent: a.belongsTo('CPKParent', [
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
            CPKParentIdFieldA: a.id().required(),
            CPKParentIdFieldB: a.id().required(),
            parent: a.belongsTo('CPKParent', [
              'CPKParentIdFieldA',
              'CPKParentIdFieldB',
            ]),
          })
          .identifier([
            'CPKReciprocalHasManyChildIdFieldA',
            'CPKReciprocalHasManyChildIdFieldB',
          ]),
      })
      .authorization((allow) => allow.publicApiKey());
    expect(schema.transform().schema).toMatchSnapshot();
  });
});

describe('schema auth rules', () => {
  test('can define public auth with no provider', () => {
    const schema = a.schema({
      A: a
        .model({
          field: a.string(),
        })
        .authorization((allow) => allow.publicApiKey()),
    });

    type Actual_A = Prettify<ClientSchema<typeof schema>['A']['type']>;

    type Expected_A = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      field?: string | null | undefined;
      // no implied owner field
    };

    type test = Expect<Equal<Actual_A, Expected_A>>;

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  test('allows public', () => {
    const schema = a
      .schema({
        A: a.model({
          field: a.string(),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    type Actual_A = Prettify<ClientSchema<typeof schema>['A']['type']>;

    type Expected_A = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      field?: string | null | undefined;
      // no implied owner field
    };

    type test = Expect<Equal<Actual_A, Expected_A>>;

    expect(schema.transform()).toMatchSnapshot();
  });

  test('global public auth - multiple models', () => {
    const schema = a
      .schema({
        A: a.model({
          field: a.string(),
        }),
        B: a.model({
          field: a.json(),
        }),
        C: a.model({
          d: a.hasOne('D', 'cId'),
        }),
        D: a.model({
          can: a.integer(),
          you: a.boolean(),
          tell: a.float(),
          i: a.date(),
          am: a.ipAddress(),
          getting: a.url(),
          tired: a.enum(['?']),
          cId: a.id(),
          c: a.belongsTo('C', 'cId'),
        }),
      })
      .authorization((allow) => allow.publicApiKey());
    expect(schema.transform()).toMatchSnapshot();
  });

  test('allows multiple entries', () => {
    const schema = a
      .schema({
        A: a.model({
          field: a.string(),
        }),
      })
      .authorization((allow) => [allow.publicApiKey(), allow.authenticated()]);

    type Actual_A = Prettify<ClientSchema<typeof schema>['A']['type']>;

    type Expected_A = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      field?: string | null | undefined;
      // no implied owner field
    };

    type test = Expect<Equal<Actual_A, Expected_A>>;

    expect(schema.transform()).toMatchSnapshot();
  });

  test('allows private', () => {
    const schema = a
      .schema({
        A: a.model({
          field: a.string(),
        }),
      })
      .authorization((allow) => allow.authenticated());

    type Actual_A = Prettify<ClientSchema<typeof schema>['A']['type']>;

    type Expected_A = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      field?: string | null | undefined;
      // no implied owner field
    };

    type test = Expect<Equal<Actual_A, Expected_A>>;

    expect(schema.transform()).toMatchSnapshot();
  });

  test('allows guest', () => {
    const schema = a
      .schema({
        A: a.model({
          field: a.string(),
        }),
      })
      .authorization((allow) => allow.guest());

    type Actual_A = Prettify<ClientSchema<typeof schema>['A']['type']>;

    type Expected_A = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      field?: string | null | undefined;
      // no implied owner field
    };

    type test = Expect<Equal<Actual_A, Expected_A>>;

    expect(schema.transform()).toMatchSnapshot();
  });

  test('allows owner', () => {
    const schema = a
      .schema({
        A: a.model({
          field: a.string(),
        }),
      })
      .authorization((allow) => allow.owner());

    type Actual_A = Prettify<ClientSchema<typeof schema>['A']['type']>;

    type Expected_A = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      field?: string | null | undefined;

      // implied owner field
      owner?: string | undefined;
    };

    type test = Expect<Equal<Actual_A, Expected_A>>;

    expect(schema.transform()).toMatchSnapshot();
  });

  test('allows multipleOwners', () => {
    const schema = a
      .schema({
        A: a.model({
          field: a.string(),
        }),
      })
      .authorization((allow) => allow.ownersDefinedIn('owner'));

    type Actual_A = Prettify<ClientSchema<typeof schema>['A']['type']>;

    type Expected_A = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      field?: string | null | undefined;

      // implied owner field
      owner?: string[] | undefined;
    };

    type test = Expect<Equal<Actual_A, Expected_A>>;

    expect(schema.transform()).toMatchSnapshot();
  });

  test('allows custom', () => {
    const schema = a
      .schema({
        A: a.model({
          field: a.string(),
        }),
      })
      .authorization((allow) => allow.custom());

    type Actual_A = Prettify<ClientSchema<typeof schema>['A']['type']>;

    type Expected_A = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      field?: string | null | undefined;
      // no implied owner field
    };

    type test = Expect<Equal<Actual_A, Expected_A>>;

    expect(schema.transform()).toMatchSnapshot();
  });

  test('allows groupDefinedIn', () => {
    const schema = a
      .schema({
        A: a.model({
          field: a.string(),
        }),
      })
      .authorization((allow) => allow.ownerDefinedIn('someField'));

    type Actual_A = Prettify<ClientSchema<typeof schema>['A']['type']>;

    type Expected_A = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      field?: string | null | undefined;

      // implied owner field
      someField?: string | undefined;
    };

    type test = Expect<Equal<Actual_A, Expected_A>>;

    expect(schema.transform()).toMatchSnapshot();
  });

  test('allows groupsDefinedIn', () => {
    const schema = a
      .schema({
        A: a.model({
          field: a.string(),
        }),
      })
      .authorization((allow) => allow.groupsDefinedIn('someField'));

    type Actual_A = Prettify<ClientSchema<typeof schema>['A']['type']>;

    type Expected_A = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      field?: string | null | undefined;

      // implied groups field
      someField?: string[] | undefined;
    };

    type test = Expect<Equal<Actual_A, Expected_A>>;

    expect(schema.transform()).toMatchSnapshot();
  });

  test('disallows specificGroup', () => {
    const schema = a
      .schema({
        A: a.model({
          field: a.string(),
        }),
      })
      .authorization((allow) => allow.group('group'));

    type Actual_A = Prettify<ClientSchema<typeof schema>['A']['type']>;

    type Expected_A = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      field?: string | null | undefined;
      // no implied owner field
    };

    type test = Expect<Equal<Actual_A, Expected_A>>;

    expect(schema.transform()).toMatchSnapshot();
  });

  test('allows specificGroups', () => {
    const schema = a
      .schema({
        A: a.model({
          field: a.string(),
        }),
      })
      .authorization((allow) => allow.groups(['a', 'b']));

    type Actual_A = Prettify<ClientSchema<typeof schema>['A']['type']>;

    type Expected_A = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      field?: string | null | undefined;
      // no implied owner field
    };

    type test = Expect<Equal<Actual_A, Expected_A>>;

    expect(schema.transform()).toMatchSnapshot();
  });

  describe('prefers model auth over global auth', () => {
    test('public auth on model vs owner auth on schema', () => {
      const schema = a
        .schema({
          A: a
            .model({
              field: a.string(),
            })
            .authorization((allow) => allow.publicApiKey()),
        })
        .authorization((allow) => allow.owner());

      type Actual_A = Prettify<ClientSchema<typeof schema>['A']['type']>;

      type Expected_A = {
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
        field?: string | null | undefined;
        // no implied owner field
      };

      type test = Expect<Equal<Actual_A, Expected_A>>;

      expect(schema.transform()).toMatchSnapshot();
    });

    test('owner auth on model vs public auth on schema', () => {
      const schema = a
        .schema({
          A: a
            .model({
              field: a.string(),
            })
            .authorization((allow) => allow.owner()),
        })
        .authorization((allow) => allow.publicApiKey());

      type Actual_A = Prettify<ClientSchema<typeof schema>['A']['type']>;

      type Expected_A = {
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
        field?: string | null | undefined;
        owner?: string | undefined;
      };

      type test = Expect<Equal<Actual_A, Expected_A>>;

      expect(schema.transform()).toMatchSnapshot();
    });

    test('owner auth on model vs owner auth on schema', () => {
      const schema = a
        .schema({
          A: a
            .model({
              field: a.string(),
            })
            .authorization((allow) => allow.ownerDefinedIn('modelOwnerField')),
        })
        .authorization((allow) => allow.ownerDefinedIn('schemaOwnerField'));

      type Actual_A = Prettify<ClientSchema<typeof schema>['A']['type']>;

      type Expected_A = {
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
        field?: string | null | undefined;
        modelOwnerField?: string | undefined;
      };

      type test = Expect<Equal<Actual_A, Expected_A>>;

      expect(schema.transform()).toMatchSnapshot();
    });
  });

  test('do not pull out custom operations', () => {
    const schema = a
      .schema({
        Post: a.model({
          title: a.string(),
        }),
        likePost: a
          .mutation()
          .arguments({ postId: a.string() })
          .returns(a.ref('Post'))
          .handler(a.handler.function('myFunc')),
        getLikedPost: a
          .query()
          .returns(a.ref('Post'))
          .handler(a.handler.function('myFunc')),
        onLikePost: a
          .subscription()
          .for(a.ref('likePost'))
          .handler(a.handler.function('myFunc')),
      })
      .authorization((allow) => allow.owner());

    expect(schema.transform()).toMatchSnapshot();
  });
});

describe('custom operations', () => {
  test('custom query', () => {
    const schema = a.schema({
      EchoResult: a.customType({
        resultContent: a.string(),
      }),
      echo: a
        .query()
        .arguments({
          inputContent: a.string().required(),
        })
        .returns(a.ref('EchoResult'))
        .handler(a.handler.function('echoFunction'))
        .authorization((allow) => allow.publicApiKey()),
    });

    type Schema = ClientSchema<typeof schema>;
    type ActualEcho = Schema[typeof __modelMeta__]['customOperations']['echo'];

    type Expected = {
      arguments: {
        inputContent: string;
      };
      typeName: 'Query';
      returnType: {
        resultContent?: string | null | undefined;
      } | null;
    };

    type ActualEchoInterface = Pick<ActualEcho, keyof Expected>;

    type test = Expect<Equal<ActualEchoInterface, Expected>>;

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  test('custom mutation', () => {
    const schema = a.schema({
      LikePostResult: a.customType({
        likes: a.integer().required(),
      }),
      likePost: a
        .mutation()
        .arguments({
          postId: a.string().required(),
        })
        .returns(a.ref('LikePostResult'))
        .handler(a.handler.function('likePost'))
        .authorization((allow) => allow.publicApiKey()),
    });

    type Schema = ClientSchema<typeof schema>;
    type ActualLikePost =
      Schema[typeof __modelMeta__]['customOperations']['likePost'];

    type Expected = {
      arguments: {
        postId: string;
      };
      typeName: 'Mutation';
      returnType: {
        likes: number;
      } | null;
    };

    type ActualLikePostInterface = Pick<ActualLikePost, keyof Expected>;

    type test = Expect<Equal<ActualLikePostInterface, Expected>>;

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  describe('for an rds schema', () => {
    test('can define public auth with no provider', () => {
      const schema = aSql.schema({
        A: a
          .model({
            id: a.string().required(),
            field: a.string(),
          })
          .identifier(['id']),
      });

      schema.setAuthorization((models) => [
        models.A.authorization((allow) => allow.publicApiKey()),
      ]);

      type Actual_A = Prettify<ClientSchema<typeof schema>['A']['type']>;

      type Expected_A = {
        id: string;
        field?: string | null | undefined;
        // doesn't imply id field
        // doesn't imply timestamp fields
      };

      type test = Expect<Equal<Actual_A, Expected_A>>;

      const graphql = schema.transform().schema;
      expect(graphql).toMatchSnapshot();
    });

    test('allows owner', () => {
      const schema = aSql.schema({
        A: a.model({
          field: a.string(),
        }),
      });

      schema.setAuthorization((models) => [
        models.A.authorization((allow) => allow.owner()),
      ]);

      type Actual_A = Prettify<ClientSchema<typeof schema>['A']['type']>;

      type Expected_A = {
        field?: string | null | undefined;
        // doesn't imply id field
        // doesn't imply timestamp fields
        // doesn't imply owner field
      };

      type test = Expect<Equal<Actual_A, Expected_A>>;

      expect(() => schema.transform().schema).toThrowError(
        "Field owner isn't defined.",
      );
    });

    test('allows id to be specified', () => {
      const schema = aSql.schema({
        A: a
          .model({
            idNum: a.integer().required(),
            field: a.string(),
          })
          .identifier(['idNum']),
      });

      schema.setAuthorization((_, schema) => [
        schema.authorization((allow) => allow.owner()),
      ]);

      type Actual_A = Prettify<ClientSchema<typeof schema>['A']['type']>;

      type Expected_A = {
        idNum: number;
        field?: string | null | undefined;
        // doesn't imply timestamp fields
        // doesn't imply owner field
      };

      type test = Expect<Equal<Actual_A, Expected_A>>;

      expect(() => schema.transform().schema).toThrowError(
        "Field owner isn't defined.",
      );
    });

    test('related models', () => {
      const schema = aSql.schema({
        B: a
          .model({
            id: a.string().required(),
            title: a.string(),
          })
          .identifier(['id']),
        A: a
          .model({
            idNum: a.integer().required(),
            field: a.string(),
            bId: a.string(),
            b: a.belongsTo('B', 'bId'),
          })
          .identifier(['idNum']),
      });

      schema.setAuthorization((_, schema) => [
        schema.authorization((allow) => allow.owner()),
      ]);

      type Actual_A = Prettify<ClientSchema<typeof schema>['A']['type']>;

      type Expected_A = {
        idNum: number;
        field?: string | null | undefined;
        bId?: string | null | undefined;
        b: (
          options?:
            | {
                authMode?: AuthMode | undefined;
                authToken?: string | undefined;
                headers?: CustomHeaders | undefined;
              }
            | undefined,
        ) => SingularReturnValue<
          | {
              id: string;
              title: Nullable<string>;
            }
          | null
          | undefined
        >;
        // doesn't imply id field
        // doesn't imply timestamp fields
        // doesn't imply owner field
      };

      type test = Expect<Equal<Actual_A, Expected_A>>;

      expect(() => schema.transform().schema).toThrowError(
        "Field owner isn't defined.",
      );
    });

    test('related models with missing foreign keys', () => {
      const schema = aSql.schema({
        B: a
          .model({
            id: a.string().required(),
            title: a.string(),
          })
          .identifier(['id']),
        A: a
          .model({
            idNum: a.integer().required(),
            field: a.string(),
            bId: a.id(),
            b: a.belongsTo('B', 'bId'),
          })
          .identifier(['idNum']),
      });

      schema.setAuthorization((_, schema) => [
        schema.authorization((allow) => allow.owner()),
      ]);

      type Actual_A = Prettify<ClientSchema<typeof schema>['A']['type']>;

      type Expected_A = {
        idNum: number;
        field?: string | null | undefined;
        bId?: string | null | undefined;
        b: (
          options?:
            | {
                authMode?: AuthMode | undefined;
                authToken?: string | undefined;
                headers?: CustomHeaders | undefined;
              }
            | undefined,
        ) => SingularReturnValue<
          | {
              id: string;
              title: string | null;
            }
          | null
          | undefined
        >;
        // doesn't imply id field
        // doesn't imply timestamp fields
        // doesn't imply owner field
      };

      type test = Expect<Equal<Actual_A, Expected_A>>;
    });

    test('sql schema field-level auth', () => {
      const sqlSchema = configure({ database: datasourceConfigMySQL }).schema({
        post: a
          .model({
            id: a.string().required(),
            title: a.string(),
            author: a.string(),
          })
          .identifier(['id']),
      });

      sqlSchema.setAuthorization((models) => [
        models.post.authorization((allow) => allow.publicApiKey()),
        models.post.fields.id.authorization((allow) => allow.authenticated()),
        models.post.fields.title.authorization((allow) => allow.publicApiKey()),
        models.post.fields.author.authorization((allow) =>
          allow.ownerDefinedIn('author'),
        ),
      ]);

      const graphql = sqlSchema.transform().schema;
      expect(graphql).toMatchSnapshot();
    });

    test('sql schema rename', () => {
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

      const graphql = modified.transform().schema;
      expect(graphql).toMatchSnapshot();
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

      const graphql = modified.transform().schema;
      expect(graphql).toMatchSnapshot();

      // ensure old models are no longer accessible
      // @ts-expect-error
      expect(modified.models.post).toBeUndefined();
      // @ts-expect-error
      expect(modified.models.comment).toBeUndefined();
    });

    test('sql schema rename new model name validation', () => {
      const sqlSchema = configure({ database: datasourceConfigMySQL }).schema({
        post: a
          .model({
            id: a.string().required(),
            title: a.string(),
            author: a.string(),
          })
          .identifier(['id']),
      });

      expect(() => sqlSchema.renameModels(() => [['post', '']])).toThrowError(
        'Invalid renameModels call. New name must be a non-empty string. Received: ""',
      );
    });

    test('sql schema rename nonexistent model validation', () => {
      const sqlSchema = configure({ database: datasourceConfigMySQL }).schema({
        post: a
          .model({
            id: a.string().required(),
            title: a.string(),
            author: a.string(),
          })
          .identifier(['id']),
      });

      expect(() =>
        // @ts-expect-error - the first element in the tuple is typed to keysof schema, so we get TS validation here as well
        sqlSchema.renameModels(() => [['does-not-exist', 'RenamedPost']]),
      ).toThrowError(
        'Invalid renameModels call. does-not-exist is not defined in the schema',
      );
    });

    // TODO: delete test after removing API
    describe('custom operations - deprecated', () => {
      test('custom query', () => {
        const initial = aSql.schema({
          EchoResult: a.customType({
            resultContent: a.string(),
          }),
        });

        const schema = initial.addQueries({
          echo: a
            .query()
            .arguments({
              inputContent: a.string().required(),
            })
            .returns(a.ref('EchoResult'))
            .handler(a.handler.function('echoFunction'))
            .authorization((allow) => allow.publicApiKey()),
        });

        type Schema = ClientSchema<typeof schema>;
        type ActualEcho =
          Schema[typeof __modelMeta__]['customOperations']['echo'];

        type Expected = {
          arguments: {
            inputContent: string;
          };
          typeName: 'Query';
          returnType: {
            resultContent?: string | null | undefined;
          } | null;
        };

        type ActualEchoInterface = Pick<ActualEcho, keyof Expected>;

        type test = Expect<Equal<ActualEchoInterface, Expected>>;

        const graphql = schema.transform().schema;
        expect(graphql).toMatchSnapshot();
      });
    });
  });

  describe('Add entities to SQL schema', () => {
    const initial = aSql.schema({
      post: a.model({
        title: a.string().required(),
        description: a.string(),
        author: a.string(),
      }),
    });

    test('add custom type, enum, and custom query to generated SQL schema', () => {
      const modified = initial
        .authorization((allow) => allow.authenticated())
        .addToSchema({
          PostMeta: a.customType({
            viewCount: a.integer(),
            approvedOn: a.date(),
          }),
          PostStatus: a.enum(['draft', 'pending', 'approved', 'published']),
          getPostMeta: a
            .query()
            .arguments({ id: a.string() })
            .returns(a.ref('PostMeta'))
            .authorization((allow) => allow.authenticated())
            .handler(
              a.handler.inlineSql(
                'SELECT viewCount, approvedOn FROM some_table',
              ),
            ),
        });

      const graphql = modified.transform().schema;
      expect(graphql).toMatchSnapshot();
    });

    test('should throw if adding Model to SQL schema', () => {
      expect(() =>
        initial
          .authorization((allow) => allow.authenticated())
          .addToSchema({
            // @ts-ignore
            Comment: a.model({
              content: a.string(),
            }),
          }),
      ).toThrowError(
        'Invalid value specified for Comment in addToSchema(). Models cannot be manually added to a SQL schema.',
      );
    });
  });

  describe('for a.combine schema', () => {
    test('matches shared backend type', () => {
      const schemaA = a.schema({
        A: a
          .model({
            field: a.string(),
          })
          .authorization((allow) => allow.publicApiKey()),
      });

      const schemaB = a.schema({
        B: a
          .model({
            field: a.string(),
          })
          .authorization((allow) => allow.publicApiKey()),
      });

      const _schema: DerivedCombinedSchema = a.combine([schemaA, schemaB]);
    });
    test('two schemas combine without issues', () => {
      const schemaA = a.schema({
        A: a
          .model({
            field: a.string(),
          })
          .authorization((allow) => allow.publicApiKey()),
      });

      const schemaB = a.schema({
        B: a
          .model({
            field: a.string(),
          })
          .authorization((allow) => allow.publicApiKey()),
      });

      const schema = a.combine([schemaA, schemaB]);

      type Actual_A = Prettify<ClientSchema<typeof schema>['A']['type']>;

      type Expected_A = {
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
        field?: string | null | undefined;
        // no implied owner field
      };

      type testA = Expect<Equal<Actual_A, Expected_A>>;

      type Actual_B = Prettify<ClientSchema<typeof schema>['B']['type']>;

      type Expected_B = {
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
        field?: string | null | undefined;
        // no implied owner field
      };

      type testB = Expect<Equal<Actual_B, Expected_B>>;

      const graphql = schema.schemas
        .map((schema) => schema.transform().schema)
        .join('\n');
      expect(graphql).toMatchSnapshot();
    });

    test('a ddb and sql schemas combine without issues', () => {
      const schemaA = aSql.schema({
        A: a
          .model({
            field: a.string(),
          })
          .authorization((allow) => allow.publicApiKey()),
      });

      const schemaB = a.schema({
        B: a
          .model({
            field: a.string(),
          })
          .authorization((allow) => allow.publicApiKey()),
      });

      const schema = a.combine([schemaA, schemaB]);

      type Actual_A = Prettify<ClientSchema<typeof schema>['A']['type']>;

      type Expected_A = {
        field?: string | null | undefined;
        // no implied owner field
      };

      type testA = Expect<Equal<Actual_A, Expected_A>>;

      type Actual_B = Prettify<ClientSchema<typeof schema>['B']['type']>;

      type Expected_B = {
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
        field?: string | null | undefined;
        // no implied owner field
      };

      type testB = Expect<Equal<Actual_B, Expected_B>>;

      const graphql = schema.schemas
        .map((schema) => schema.transform().schema)
        .join('\n');
      expect(graphql).toMatchSnapshot();
    });

    test('combining two schemas with custom mutation results in customTypes and customOperations that intersect the separate schemas', () => {
      const schemaA = a.schema({
        LikePostResult: a.customType({
          likes: a.integer().required(),
        }),
        likePost: a
          .mutation()
          .arguments({
            postId: a.string().required(),
          })
          .returns(a.ref('LikePostResult'))
          .handler(a.handler.function('likePost'))
          .authorization((allow) => allow.publicApiKey()),
        A: a
          .model({
            fieldA: a.string(),
          })
          .authorization((allow) => allow.publicApiKey()),
      });

      const schemaB = a.schema({
        DislikePostResult: a.customType({
          likes: a.integer().required(),
        }),
        dislikePost: a
          .mutation()
          .arguments({
            postId: a.string().required(),
          })
          .returns(a.ref('DislikePostResult'))
          .handler(a.handler.function('dislikePost'))
          .authorization((allow) => allow.publicApiKey()),
        B: a
          .model({
            fieldB: a.string(),
          })
          .authorization((allow) => allow.publicApiKey()),
      });

      const schema = a.combine([schemaA, schemaB]);

      type SchemaA = ClientSchema<typeof schemaA>;
      type SchemaB = ClientSchema<typeof schemaB>;
      type Schema = ClientSchema<typeof schema>;

      type CustomOperationsA =
        SchemaA[typeof __modelMeta__]['customOperations'];
      type CustomOperationsB =
        SchemaB[typeof __modelMeta__]['customOperations'];
      type CustomTypesA = SchemaA[typeof __modelMeta__]['customTypes'];
      type CustomTypesB = SchemaB[typeof __modelMeta__]['customTypes'];
      type ExpectedCustomTypes = CustomTypesA & CustomTypesB;
      type ExpectedCustomOperations = CustomOperationsA & CustomOperationsB;

      type ActualCustomOperations =
        Schema[typeof __modelMeta__]['customOperations'];
      type ActualCustomTypes = Schema[typeof __modelMeta__]['customTypes'];

      type testCustomTypes = Expect<
        Equal<ExpectedCustomTypes, ActualCustomTypes>
      >;
      type testCustomOperations = Expect<
        Equal<ExpectedCustomOperations, ActualCustomOperations>
      >;

      const graphql = schema.schemas
        .map((schema) => schema.transform().schema)
        .join('\n');
      expect(graphql).toMatchSnapshot();
    });

    test('a ddb and sql schemas raise an error on transform when they have a model name collision', () => {
      const schemaA = aSql.schema({
        DupTest: a
          .model({
            fieldB: a.string(),
          })
          .authorization((allow) => allow.publicApiKey()),
      });

      const schemaB = a.schema({
        DupTest: a
          .model({
            fieldA: a.string(),
          })
          .authorization((allow) => allow.publicApiKey()),
      });

      expect(() => a.combine([schemaA, schemaB])).toThrowError(
        'The schemas you are attempting to combine have a name collision. Please remove or rename DupTest.',
      );
    });
  });
});

describe('SQL Schema with sql statement references', () => {
  const fakeSecret = () => ({}) as any;

  const datasourceConfigMySQL = {
    engine: 'mysql',
    connectionUri: fakeSecret(),
  } as const;

  const aSql = configure({ database: datasourceConfigMySQL });

  it('schema with full path sql reference', () => {
    const rdsSchema = aSql
      .schema({
        widget: a.model({
          title: a.string().required(),
          someOwnerField: a.string(),
        }),
        callSql: a
          .query()
          .arguments({})
          .returns(a.ref('widget'))
          .handler(
            a.handler.sqlReference(
              '/full/path/to/sql/statement/directory/testReferenceName',
            ),
          ),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(rdsSchema.transform()).toMatchSnapshot();
  });

  it('schema with relative path sql reference', () => {
    const rdsSchema = aSql
      .schema({
        widget: a.model({
          title: a.string().required(),
          someOwnerField: a.string(),
        }),
        callSql: a
          .query()
          .arguments({})
          .returns(a.ref('widget'))
          .handler(a.handler.sqlReference('./testReferenceName')),
      })
      .authorization((allow) => allow.publicApiKey());

    const { customSqlDataSourceStrategies } = rdsSchema.transform();

    expect(customSqlDataSourceStrategies).not.toBeUndefined();

    expect(customSqlDataSourceStrategies![0]).toMatchObject({
      typeName: 'Query',
      fieldName: 'callSql',
      entry: {
        relativePath: './testReferenceName',
        importLine: expect.stringContaining('__tests__'),
      },
    });
  });
});
