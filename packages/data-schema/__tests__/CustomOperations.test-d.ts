import type { Equal, Expect, Prettify } from '@aws-amplify/data-schema-types';
import type {
  AuthMode,
  CustomHeaders,
  ClientExtensions,
  ListReturnValue,
  SingularReturnValue,
} from '../src/runtime';
import { ClientSchema, a } from '../src/index';
import type {
  AppSyncResolverHandler,
  AppSyncResolverEvent,
  Callback,
  Context,
} from 'aws-lambda';
import { configure } from '../src/ModelSchema';
import { Nullable } from '../src/ModelField';
import { defineFunctionStub } from './utils';
import type { CustomOperation } from '../src/CustomOperation';

describe('custom operations return types', () => {
  describe('when .ref() a basic custom type', () => {
    it('generates correct return type', () => {
      const schema = a.schema({
        MyType: a.customType({
          string: a.string().required(),
          enum: a.enum(['hello', 'bye']),
        }),
        aQuery: a
          .query()
          .handler(a.handler.function('someHandler'))
          .returns(a.ref('MyType').required()),
      });

      type ReturnType = Prettify<
        ClientSchema<typeof schema>['aQuery']['returnType']
      >;

      type Expected = {
        enum?: 'hello' | 'bye' | null | undefined;
        string: string;
      };

      type _ = Expect<Equal<ReturnType, Expected>>;
    });

    it('produces function handler types', () => {
      const schema = a.schema({
        MyType: a.customType({
          string: a.string().required(),
          enum: a.enum(['hello', 'bye']),
        }),
        aQuery: a
          .query()
          .handler(a.handler.function('someHandler'))
          .arguments({
            input: a.string(),
            content: a.string().required(),
          })
          .returns(a.ref('MyType').required()),
      });

      type Schema = ClientSchema<typeof schema>;

      type ActualArgs = Prettify<Schema['aQuery']['args']>;
      type ActualResult = Prettify<Schema['aQuery']['returnType']>;
      type ActualHandler = Schema['aQuery']['functionHandler'];

      type ExpectedArgs = {
        input?: string | null | undefined;
        content: string;
      };
      type ExpectedResult = {
        enum?: 'hello' | 'bye' | null | undefined;
        string: string;
      };
      type ExpectedFunctionHandler = AppSyncResolverHandler<
        ActualArgs,
        ActualResult
      >;

      type _T1 = Expect<Equal<ActualArgs, ExpectedArgs>>;
      type _T2 = Expect<Equal<ActualResult, ExpectedResult>>;
      type _T3 = Expect<Equal<ActualHandler, ExpectedFunctionHandler>>;
    });

    it('produces async function handler types', () => {
      const handler = defineFunctionStub({});
      const schema = a.schema({
        aQuery: a
          .query()
          .handler(a.handler.function(handler).async())
          .arguments({
            input: a.string(),
            content: a.string().required(),
          }),
      });

      type Schema = ClientSchema<typeof schema>;

      type ActualArgs = Prettify<Schema['aQuery']['args']>;
      type ActualResult = Prettify<Schema['aQuery']['returnType']>;

      type ActualHandler = Schema['aQuery']['functionHandler'];

      type ExpectedArgs = {
        input?: string | null | undefined;
        content: string;
      };
      type ExpectedResult = {
        success: boolean;
      } | null;
      type ExpectedFunctionHandler = AppSyncResolverHandler<ActualArgs, void>;
      type _T1 = Expect<Equal<ActualArgs, ExpectedArgs>>;
      type _T2 = Expect<Equal<ActualResult, ExpectedResult>>;
      type _T3 = Expect<Equal<ActualHandler, ExpectedFunctionHandler>>;
    });
  });

  describe('when .ref() a nested custom types', () => {
    it('generates correct return type', () => {
      const schema = a.schema({
        Location: a.customType({
          long: a.float(),
          lang: a.float(),
        }),
        MyType: a.customType({
          string: a.string().required(),
          enum: a.enum(['hello', 'bye']),
          meta: a.customType({
            description: a.string().required(),
            location: a.ref('Location'),
          }),
        }),
        aQuery: a
          .query()
          .handler(a.handler.function('someHandler'))
          .returns(a.ref('MyType').required()),
      });

      type ReturnType = Prettify<
        ClientSchema<typeof schema>['aQuery']['returnType']
      >;

      type Expected = {
        enum?: 'hello' | 'bye' | null | undefined;
        meta?:
          | {
              location?:
                | {
                    long?: number | null | undefined;
                    lang?: number | null | undefined;
                  }
                | null
                | undefined;
              description: string;
            }
          | null
          | undefined;
        string: string;
      };

      type _ = Expect<Equal<ReturnType, Expected>>;
    });

    it('produces function handler types', () => {
      const schema = a.schema({
        Location: a.customType({
          long: a.float(),
          lang: a.float(),
        }),
        MyType: a.customType({
          string: a.string().required(),
          enum: a.enum(['hello', 'bye']),
          meta: a.customType({
            description: a.string().required(),
            location: a.ref('Location'),
          }),
        }),
        aQuery: a
          .query()
          .handler(a.handler.function('someHandler'))
          .arguments({
            input: a.string(),
            content: a.string().required(),
          })
          .returns(a.ref('MyType').required()),
      });

      type Schema = ClientSchema<typeof schema>;

      type ActualArgs = Prettify<Schema['aQuery']['args']>;
      type ActualResult = Prettify<Schema['aQuery']['returnType']>;
      type ActualHandler = Prettify<Schema['aQuery']['functionHandler']>;

      type ExpectedArgs = {
        input?: string | null | undefined;
        content: string;
      };
      type ExpectedResult = {
        enum?: 'hello' | 'bye' | null | undefined;
        meta?:
          | {
              location?:
                | {
                    long?: number | null | undefined;
                    lang?: number | null | undefined;
                  }
                | null
                | undefined;
              description: string;
            }
          | null
          | undefined;
        string: string;
      };
      type ExpectedFunctionHandler = AppSyncResolverHandler<
        ActualArgs,
        ActualResult
      >;

      type _T1 = Expect<Equal<ActualArgs, ExpectedArgs>>;
      type _T2 = Expect<Equal<ActualResult, ExpectedResult>>;
      type _T3 = Expect<Equal<ActualHandler, ExpectedFunctionHandler>>;
    });
  });

  describe('when .ref() a basic model', () => {
    it('generates correct return type', () => {
      const schema = a.schema({
        MyModel: a.model({
          string: a.string().required(),
          enum: a.enum(['hello', 'bye']),
        }),
        aQuery: a
          .query()
          .handler(a.handler.function('someHandler'))
          .returns(a.ref('MyModel').required()),
      });

      type ReturnType = Prettify<
        ClientSchema<typeof schema>['aQuery']['returnType']
      >;

      type Expected = {
        string: string;
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
        enum?: 'hello' | 'bye' | null | undefined;
      };

      type _ = Expect<Equal<ReturnType, Expected>>;
    });

    it('produces function handler types', () => {
      const schema = a.schema({
        MyModel: a.model({
          string: a.string().required(),
          enum: a.enum(['hello', 'bye']),
        }),
        aQuery: a
          .query()
          .handler(a.handler.function('someHandler'))
          .arguments({
            input: a.string(),
            content: a.string().required(),
          })
          .returns(a.ref('MyModel').required()),
      });

      type Schema = ClientSchema<typeof schema>;

      type ActualArgs = Prettify<Schema['aQuery']['args']>;
      type ActualResult = Prettify<Schema['aQuery']['returnType']>;
      type ActualHandler = Schema['aQuery']['functionHandler'];

      type ExpectedArgs = {
        input?: string | null | undefined;
        content: string;
      };
      type ExpectedResult = {
        string: string;
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
        enum?: 'hello' | 'bye' | null | undefined;
      };
      type ExpectedFunctionHandler = AppSyncResolverHandler<
        ActualArgs,
        ActualResult
      >;

      type _T1 = Expect<Equal<ActualArgs, ExpectedArgs>>;
      type _T2 = Expect<Equal<ActualResult, ExpectedResult>>;
      type _T3 = Expect<Equal<ActualHandler, ExpectedFunctionHandler>>;
    });
  });

  describe('when .ref() is a model with a relationships', () => {
    const schema = a.schema({
      Post: a.model({
        content: a.string().required(),
        comments: a.hasMany('Comment', 'postId'),
      }),
      Comment: a.model({
        body: a.string().required(),
        postId: a.id().required(),
        post: a.belongsTo('Post', 'postId'),
      }),
      likePost: a
        .mutation()
        .arguments({ postId: a.id().required() })
        .handler(a.handler.function('someHandler'))
        .returns(a.ref('Post').required()),
    });

    type Schema = ClientSchema<typeof schema>;
    type LikePost = Prettify<Schema['likePost']>;

    it('generates correct return type', () => {
      type Expected = {
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
        content: string;
      };

      type _ = Expect<Equal<LikePost['returnType'], Expected>>;
    });

    it('generates the correct type', () => {
      type Expected = {
        content: string;
        comments: (
          options?:
            | {
                authMode?: AuthMode | undefined;
                authToken?: string | undefined;
                limit?: number | undefined;
                nextToken?: string | null | undefined;
                headers?: CustomHeaders | undefined;
              }
            | undefined,
        ) => ListReturnValue<{
          body: string;
          postId: string;
          post: (
            options?:
              | {
                  authMode?: AuthMode | undefined;
                  authToken?: string | undefined;
                  headers?: CustomHeaders | undefined;
                }
              | undefined,
          ) => SingularReturnValue<Schema['Post']['type'] | null>;
          readonly id: string;
          readonly createdAt: string;
          readonly updatedAt: string;
        }>;
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
      };

      type _ = Expect<Equal<LikePost['type'], Expected>>;
    });

    it(`returns Schema['CustomOpName']['type']`, async () => {
      const client = {} as ClientExtensions<Schema>;
      const { data } = await client.mutations.likePost({ postId: 'some-id' });

      // expect no type errors
      const post: Schema['Post']['type'] = data!;
    });
  });

  describe('when .ref() a model that has nested custom type', () => {
    it('generates correct return type', () => {
      const schema = a.schema({
        MyModel: a.model({
          string: a.string().required(),
          enum: a.enum(['hello', 'bye']),
          meta: a.customType({
            description: a.string().required(),
            location: a.ref('Location'),
          }),
        }),
        Location: a.customType({
          long: a.float(),
          lang: a.float(),
        }),
        aQuery: a
          .query()
          .handler(a.handler.function('someHandler'))
          .returns(a.ref('MyModel').required()),
      });

      type ReturnType = Prettify<
        ClientSchema<typeof schema>['aQuery']['returnType']
      >;

      type Expected = {
        string: string;
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
        enum?: 'hello' | 'bye' | null | undefined;
        meta?:
          | {
              location?:
                | {
                    long?: number | null | undefined;
                    lang?: number | null | undefined;
                  }
                | null
                | undefined;
              description: string;
            }
          | null
          | undefined;
      };

      type _ = Expect<Equal<ReturnType, Expected>>;
    });

    it('produces function handler types', () => {
      const schema = a.schema({
        MyModel: a.model({
          string: a.string().required(),
          enum: a.enum(['hello', 'bye']),
          meta: a.customType({
            description: a.string().required(),
            location: a.ref('Location'),
          }),
        }),
        Location: a.customType({
          long: a.float(),
          lang: a.float(),
        }),
        aQuery: a
          .query()
          .handler(a.handler.function('someHandler'))
          .arguments({
            input: a.string(),
            content: a.string().required(),
          })
          .returns(a.ref('MyModel').required()),
      });

      type Schema = ClientSchema<typeof schema>;

      type ActualArgs = Prettify<Schema['aQuery']['args']>;
      type ActualResult = Prettify<Schema['aQuery']['returnType']>;
      type ActualHandler = Prettify<Schema['aQuery']['functionHandler']>;

      type ExpectedArgs = {
        input?: string | null | undefined;
        content: string;
      };
      type ExpectedResult = {
        string: string;
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
        enum?: 'hello' | 'bye' | null | undefined;
        meta?:
          | {
              location?:
                | {
                    long?: number | null | undefined;
                    lang?: number | null | undefined;
                  }
                | null
                | undefined;
              description: string;
            }
          | null
          | undefined;
      };
      type ExpectedFunctionHandler = AppSyncResolverHandler<
        ActualArgs,
        ActualResult
      >;

      type _T1 = Expect<Equal<ActualArgs, ExpectedArgs>>;
      type _T2 = Expect<Equal<ActualResult, ExpectedResult>>;
      type _T3 = Expect<Equal<ActualHandler, ExpectedFunctionHandler>>;
    });
  });

  describe('when.ref() a enum', () => {
    it('generates correct return type', () => {
      const schema = a.schema({
        Value: a.enum(['succeeded', 'failed']),
        aQuery: a
          .query()
          .handler(a.handler.function('someHandler'))
          .returns(a.ref('Value').required()),
      });

      type ReturnType = Prettify<
        ClientSchema<typeof schema>['aQuery']['returnType']
      >;

      type Expected = 'succeeded' | 'failed';

      type _ = Expect<Equal<ReturnType, Expected>>;
    });

    it('produces function handler types', () => {
      const schema = a.schema({
        Value: a.enum(['succeeded', 'failed']),
        aQuery: a
          .query()
          .handler(a.handler.function('someHandler'))
          .arguments({ input: a.string(), content: a.string().required() })
          .returns(a.ref('Value').required()),
      });

      type Schema = ClientSchema<typeof schema>;

      type ActualArgs = Prettify<Schema['aQuery']['args']>;
      type ActualResult = Prettify<Schema['aQuery']['returnType']>;
      type ActualHandler = Schema['aQuery']['functionHandler'];

      type ExpectedArgs = {
        input?: string | null | undefined;
        content: string;
      };
      type ExpectedResult = 'succeeded' | 'failed';
      type ExpectedFunctionHandler = AppSyncResolverHandler<
        ActualArgs,
        ActualResult
      >;

      type _T1 = Expect<Equal<ActualArgs, ExpectedArgs>>;
      type _T2 = Expect<Equal<ActualResult, ExpectedResult>>;
      type _T3 = Expect<Equal<ActualHandler, ExpectedFunctionHandler>>;
    });
  });
});

describe('RDS custom operations - current DX', () => {
  const s = configure({
    database: {
      engine: 'mysql',
      connectionUri: 'fake' as any,
    },
  })
    .schema({
      Post: a.model({
        title: a.string(),
      }),
    })
    .addToSchema({
      likePost: a
        .mutation()
        .arguments({ postId: a.string(), content: a.string().required() })
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
    .authorization((allow) => allow.publicApiKey());

  type Schema = ClientSchema<typeof s>;

  it('adds custom operations to ModelMeta', () => {
    type ActualLikePost = Prettify<Schema['likePost']>;
    type ActualGetLikedPost = Prettify<Schema['getLikedPost']>;
    type ActualOnLikePost = Prettify<Schema['onLikePost']>;

    type ExpectedLikePost = {
      __entityType: 'customMutation';
      operationType: 'Mutation';
      functionHandler: (
        event: AppSyncResolverEvent<
          {
            postId?: Nullable<string> | undefined;
            content: string;
          },
          Record<string, any> | null
        >,
        context: Context,
        callback: Callback<
          | {
              title?: Nullable<string> | undefined;
            }
          | null
          | undefined
        >,
      ) => void | Promise<
        | {
            title?: Nullable<string> | undefined;
          }
        | null
        | undefined
      >;
      args: {
        postId?: Nullable<string> | undefined;
        content: string;
      };
      returnType:
        | {
            title?: Nullable<string> | undefined;
          }
        | null
        | undefined;
      type:
        | {
            title?: Nullable<string> | undefined;
          }
        | null
        | undefined;
    };

    type ExpectedGetLikedPost = {
      __entityType: 'customQuery';
      operationType: 'Query';
      functionHandler: (
        event: AppSyncResolverEvent<never, Record<string, any> | null>,
        context: Context,
        callback: Callback<
          | {
              title?: Nullable<string> | undefined;
            }
          | null
          | undefined
        >,
      ) => void | Promise<
        | {
            title?: Nullable<string> | undefined;
          }
        | null
        | undefined
      >;
      args: never;
      returnType:
        | {
            title?: Nullable<string> | undefined;
          }
        | null
        | undefined;
      type:
        | {
            title?: Nullable<string> | undefined;
          }
        | null
        | undefined;
    };

    type ExpectedOnLikePost = {
      __entityType: 'customSubscription';
      operationType: 'Subscription';
      functionHandler: (
        event: AppSyncResolverEvent<never, Record<string, any> | null>,
        context: Context,
        callback: Callback<{
          title?: Nullable<string> | undefined;
        }>,
      ) => void | Promise<{
        title?: Nullable<string> | undefined;
      }>;
      args: never;
      returnType: {
        title?: Nullable<string> | undefined;
      };
      type: {
        title?: Nullable<string> | undefined;
      };
    };

    type testLikePost = Expect<Equal<ActualLikePost, ExpectedLikePost>>;
    type testGetLikedPost = Expect<
      Equal<ActualGetLikedPost, ExpectedGetLikedPost>
    >;
    type testOnLikePost = Expect<Equal<ActualOnLikePost, ExpectedOnLikePost>>;
  });
});

describe('RDS custom operations - deprecated DX', () => {
  const s = configure({
    database: {
      engine: 'mysql',
      connectionUri: 'fake' as any,
    },
  })
    .schema({
      Post: a.model({
        title: a.string(),
      }),
    })
    .addMutations({
      likePost: a
        .mutation()
        .arguments({ postId: a.string(), content: a.string().required() })
        .returns(a.ref('Post'))
        .handler(a.handler.function('myFunc')),
    })
    .addQueries({
      getLikedPost: a
        .query()
        .returns(a.ref('Post'))
        .handler(a.handler.function('myFunc')),
    })
    .addSubscriptions({
      onLikePost: a
        .subscription()
        .for(a.ref('likePost'))
        .handler(a.handler.function('myFunc')),
    })
    .authorization((allow) => allow.publicApiKey());

  type Schema = ClientSchema<typeof s>;

  it('adds custom operations to ModelMeta', () => {
    type ActualLikePost = Prettify<Schema['likePost']>;
    type ActualGetLikedPost = Prettify<Schema['getLikedPost']>;
    type ActualOnLikePost = Prettify<Schema['onLikePost']>;

    type ExpectedLikePost = {
      __entityType: 'customMutation';
      operationType: 'Mutation';
      functionHandler: (
        event: AppSyncResolverEvent<
          {
            postId?: Nullable<string> | undefined;
            content: string;
          },
          Record<string, any> | null
        >,
        context: Context,
        callback: Callback<
          | {
              title?: Nullable<string> | undefined;
            }
          | null
          | undefined
        >,
      ) => void | Promise<
        | {
            title?: Nullable<string> | undefined;
          }
        | null
        | undefined
      >;
      args: {
        postId?: Nullable<string> | undefined;
        content: string;
      };
      returnType:
        | {
            title?: Nullable<string> | undefined;
          }
        | null
        | undefined;
      type:
        | {
            title?: Nullable<string> | undefined;
          }
        | null
        | undefined;
    };

    type ExpectedGetLikedPost = {
      __entityType: 'customQuery';
      operationType: 'Query';
      functionHandler: (
        event: AppSyncResolverEvent<never, Record<string, any> | null>,
        context: Context,
        callback: Callback<
          | {
              title?: Nullable<string> | undefined;
            }
          | null
          | undefined
        >,
      ) => void | Promise<
        | {
            title?: Nullable<string> | undefined;
          }
        | null
        | undefined
      >;
      args: never;
      returnType:
        | {
            title?: Nullable<string> | undefined;
          }
        | null
        | undefined;
      type:
        | {
            title?: Nullable<string> | undefined;
          }
        | null
        | undefined;
    };

    type ExpectedOnLikePost = {
      __entityType: 'customSubscription';
      operationType: 'Subscription';
      functionHandler: (
        event: AppSyncResolverEvent<never, Record<string, any> | null>,
        context: Context,
        callback: Callback<{
          title?: Nullable<string> | undefined;
        }>,
      ) => void | Promise<{
        title?: Nullable<string> | undefined;
      }>;
      args: never;
      returnType: {
        title?: Nullable<string> | undefined;
      };
      type: {
        title?: Nullable<string> | undefined;
      };
    };

    type testLikePost = Expect<Equal<ActualLikePost, ExpectedLikePost>>;
    type testGetLikedPost = Expect<
      Equal<ActualGetLikedPost, ExpectedGetLikedPost>
    >;
    type testOnLikePost = Expect<Equal<ActualOnLikePost, ExpectedOnLikePost>>;
  });
});

describe('.for() modifier', () => {
  it('is unavailable on a.query()', () => {
    // @ts-expect-error .for() is not a valid modifier function of a.query()
    a.query().for();
  });

  it('is unavailable on a.mutation()', () => {
    // @ts-expect-error .for() is not a valid modifier function of a.mutation()
    a.mutation().for();
  });

  it('is unavailable on a.generation()', () => {
    a.generation({
      aiModel: a.ai.model('Claude 3 Haiku'),
      systemPrompt: 'Hello, world!',
      // @ts-expect-error .for() is not a valid modifier function of a.generation()
    }).for();
  });

  it('is available only on a.subscription()', () => {
    a.subscription().for(a.ref('Model'));
  });
});

describe('.arguments() modifier', () => {
  // Test to verify that CustomType can be used as an argument in custom operations
  it('accepts CustomType in arguments', () => {
    const operation: CustomOperation<
      any,
      'arguments' | 'for',
      'queryCustomOperation'
    > = a.query().arguments({
      customArg: a.customType({
        field1: a.string(),
        field2: a.integer(),
      }),
    });
  });

  // Test to verify that RefType can be used as an argument in custom operations
  it('accepts RefType in arguments', () => {
    const operation: CustomOperation<
      any,
      'arguments' | 'for',
      'queryCustomOperation'
    > = a.query().arguments({
      refArg: a.ref('SomeType'),
    });
  });

  it('handles deeply nested custom types', () => {
    const schema = a.schema({
      DeepNested: a.customType({
        level1: a.customType({
          level2: a.customType({
            level3: a.string(),
          }),
        }),
      }),
      deepQuery: a
        .query()
        .arguments({
          input: a.ref('DeepNested'),
        })
        .returns(a.string()),
    });

    type Schema = ClientSchema<typeof schema>;

    type ExpectedArgs = {
      input?: {
        level1?: {
          level2?: {
            level3?: string | null;
          } | null;
        } | null;
      } | null;
    };

    type ActualArgs = Schema['deepQuery']['args'];

    type Test = Expect<Equal<ActualArgs, ExpectedArgs>>;
  });

  it('handles mixed custom types and refs', () => {
    const schema = a.schema({
      RefType: a.customType({
        field: a.string(),
      }),
      MixedType: a.customType({
        nested: a.customType({
          refField: a.ref('RefType'),
          customField: a.customType({
            deepField: a.integer(),
          }),
        }),
      }),
      mixedQuery: a
        .query()
        .arguments({
          input: a.ref('MixedType'),
        })
        .returns(a.string()),
    });

    type Schema = ClientSchema<typeof schema>;

    type ExpectedArgs = {
      input?: {
        nested?: {
          refField?: {
            field?: string | null;
          } | null;
          customField?: {
            deepField?: number | null;
          } | null;
        } | null;
      } | null;
    };

    type ActualArgs = Schema['mixedQuery']['args'];

    type Test = Expect<Equal<ActualArgs, ExpectedArgs>>;
  });

  it('handles RefType with multi-layered custom types in nested structures', () => {
    const schema = a.schema({
      NestedCustomType: a.customType({
        nestedField: a.string(),
      }),
      RefType: a.customType({
        field: a.string(),
        nestedCustom: a.ref('NestedCustomType'),
      }),
      OuterType: a.customType({
        refField: a.ref('RefType'),
        otherField: a.integer(),
      }),
      complexQuery: a
        .query()
        .arguments({
          input: a.ref('OuterType'),
        })
        .returns(a.string()),
    });

    type Schema = ClientSchema<typeof schema>;

    type ExpectedArgs = {
      input?: {
        refField?: {
          field?: string | null;
          nestedCustom?: {
            nestedField?: string | null;
          } | null;
        } | null;
        otherField?: number | null;
      } | null;
    };

    type ActualArgs = Schema['complexQuery']['args'];

    type Test = Expect<Equal<ActualArgs, ExpectedArgs>>;
  });
});
