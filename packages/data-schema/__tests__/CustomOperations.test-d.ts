import type { Equal, Expect, Prettify } from '@aws-amplify/data-schema-types';
import type {
  AuthMode,
  CustomHeaders,
  ClientExtensions,
  ListReturnValue,
  SelectionSet,
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

  describe('when using custom types with refs in function arguments', () => {
    it('resolves nested types correctly in functionHandler', () => {
      const schema = a.schema({
        Location: a.customType({
          coordinates: a.integer(),
        }),
        myQuery: a
          .query()
          .arguments({
            wrapper: a.customType({
              location: a.ref('Location'),
            }),
          })
          .handler(a.handler.function('myFunc'))
          .returns(a.string()),
      });

      type Schema = ClientSchema<typeof schema>;

      type ActualArgs = Prettify<Schema['myQuery']['args']>;
      type ActualResult = Prettify<Schema['myQuery']['returnType']>;
      type ActualHandler = Schema['myQuery']['functionHandler'];

      type ExpectedArgs = {
        wrapper?:
          | {
              location?:
                | {
                    coordinates?: number | null | undefined;
                  }
                | null
                | undefined;
            }
          | null
          | undefined;
      };
      type ExpectedResult = string | null;
      type ExpectedHandler = AppSyncResolverHandler<ActualArgs, ActualResult>;

      type _T1 = Expect<Equal<ActualArgs, ExpectedArgs>>;
      type _T2 = Expect<Equal<ActualResult, ExpectedResult>>;
      type _T3 = Expect<Equal<ActualHandler, ExpectedHandler>>;
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
      __meta: {
        returnModel: {
          flatModel: Prettify<Schema['Post']['__meta']['flatModel']>;
          isArray: false;
        };
      };
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
      __meta: {
        returnModel: {
          flatModel: Prettify<Schema['Post']['__meta']['flatModel']>;
          isArray: false;
        };
      };
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
      __meta: {
        returnModel: {
          flatModel: Prettify<Schema['Post']['__meta']['flatModel']>;
          isArray: false;
        };
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
      __meta: {
        returnModel: {
          flatModel: Prettify<Schema['Post']['__meta']['flatModel']>;
          isArray: false;
        };
      };
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
      __meta: {
        returnModel: {
          flatModel: Prettify<Schema['Post']['__meta']['flatModel']>;
          isArray: false;
        };
      };
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
      __meta: {
        returnModel: {
          flatModel: Prettify<Schema['Post']['__meta']['flatModel']>;
          isArray: false;
        };
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
    type ExpectedType = CustomOperation<
      any,
      'arguments' | 'for',
      'queryCustomOperation'
    >;

    const operation = a.query().arguments({
      customArg: a.customType({
        field1: a.string(),
        field2: a.integer(),
      }),
    });

    type test = Expect<Equal<ExpectedType, typeof operation>>;
  });

  // Test to verify that RefType can be used as an argument in custom operations
  it('accepts RefType in arguments', () => {
    type ExpectedType = CustomOperation<
      any,
      'arguments' | 'for',
      'queryCustomOperation'
    >;

    const operation = a.query().arguments({
      refArg: a.ref('SomeType'),
    });

    type test = Expect<Equal<ExpectedType, typeof operation>>;
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

// shared by the __meta.returnModel and selectionSet on custom operations blocks
const schema = a.schema({
  Author: a.model({
    name: a.string().required(),
    posts: a.hasMany('Post', 'authorId'),
  }),
  Post: a.model({
    title: a.string().required(),
    authorId: a.id().required(),
    author: a.belongsTo('Author', 'authorId'),
    comments: a.hasMany('Comment', 'postId'),
  }),
  Comment: a.model({
    body: a.string().required(),
    postId: a.id().required(),
    post: a.belongsTo('Post', 'postId'),
  }),
  EchoResult: a.customType({ value: a.string() }),
  getPost: a
    .query()
    .arguments({ id: a.id().required() })
    .returns(a.ref('Post'))
    .handler(a.handler.function('fn')),
  listPosts: a
    .query()
    .returns(a.ref('Post').array())
    .handler(a.handler.function('fn')),
  likePost: a
    .mutation()
    .arguments({ postId: a.id().required() })
    .returns(a.ref('Post'))
    .handler(a.handler.function('fn')),
  likePosts: a
    .mutation()
    .returns(a.ref('Post').array())
    .handler(a.handler.function('fn')),
  echo: a
    .query()
    .arguments({ value: a.string() })
    .returns(a.ref('EchoResult'))
    .handler(a.handler.function('fn')),
  echoString: a
    .query()
    .arguments({ value: a.string() })
    .returns(a.string())
    .handler(a.handler.function('fn')),
  echoMutation: a
    .mutation()
    .arguments({ value: a.string() })
    .returns(a.ref('EchoResult'))
    .handler(a.handler.function('fn')),
  onUpdatePost: a
    .subscription()
    .for(a.ref('Post').mutations(['update']))
    .handler(a.handler.function('fn')),
  onLikePost: a
    .subscription()
    .for(a.ref('likePost'))
    .handler(a.handler.function('fn')),
  onLikePosts: a
    .subscription()
    .for(a.ref('likePosts'))
    .handler(a.handler.function('fn')),
  onPostChange: a
    .subscription()
    .for([a.ref('Post').mutations(['delete']), a.ref('likePost')])
    .handler(a.handler.function('fn')),
  onEcho: a
    .subscription()
    .for(a.ref('echoMutation'))
    .handler(a.handler.function('fn')),
  makePost: a
    .generation({ aiModel: a.ai.model('Claude 3 Haiku'), systemPrompt: 'p' })
    .returns(a.ref('Post')),
});
type Schema = ClientSchema<typeof schema>;

describe('__meta.returnModel', () => {
  it('resolves the referenced model and array-ness', () => {
    type _1 = Expect<
      Equal<
        Schema['getPost']['__meta']['returnModel'],
        { flatModel: Schema['Post']['__meta']['flatModel']; isArray: false }
      >
    >;
    type _2 = Expect<
      Equal<Schema['listPosts']['__meta']['returnModel']['isArray'], true>
    >;
    type _3 = Expect<
      Equal<
        Schema['likePost']['__meta']['returnModel'],
        Schema['getPost']['__meta']['returnModel']
      >
    >;
  });

  it('is never for non-model returns', () => {
    type _1 = Expect<Equal<Schema['echo']['__meta']['returnModel'], never>>;
    type _2 = Expect<Equal<Schema['onEcho']['__meta']['returnModel'], never>>;
  });

  it('resolves subscription sources of every form', () => {
    type _1 = Expect<
      Equal<
        Schema['onUpdatePost']['__meta']['returnModel'],
        Schema['getPost']['__meta']['returnModel']
      >
    >;
    type _2 = Expect<
      Equal<
        Schema['onLikePost']['__meta']['returnModel'],
        Schema['likePost']['__meta']['returnModel']
      >
    >;
    type _3 = Expect<
      Equal<Schema['onLikePosts']['__meta']['returnModel']['isArray'], true>
    >;
    type _4 = Expect<
      Equal<
        Schema['onPostChange']['__meta']['returnModel'],
        Schema['getPost']['__meta']['returnModel']
      >
    >;
  });
});

describe('selectionSet on custom operations', () => {
  const client = {} as ClientExtensions<Schema>;
  const sel = ['id', 'title', 'comments.*'] as const;

  it('query data equals model get data for the same paths', async () => {
    const { data: custom } = await client.queries.getPost(
      { id: 'p1' },
      { selectionSet: sel },
    );
    const { data: viaModel } = await client.models.Post.get(
      { id: 'p1' },
      { selectionSet: sel },
    );
    type _1 = Expect<Equal<typeof custom, typeof viaModel>>;
    type _2 = Expect<
      Equal<typeof custom, SelectionSet<Schema['Post'], typeof sel> | null>
    >;
  });

  it('mutation data equals model get data for the same paths', async () => {
    const { data: custom } = await client.mutations.likePost(
      { postId: 'p1' },
      { selectionSet: sel },
    );
    const { data: viaModel } = await client.models.Post.get(
      { id: 'p1' },
      { selectionSet: sel },
    );
    type _ = Expect<Equal<typeof custom, typeof viaModel>>;
  });

  it('array data elements equal model list elements, and the array itself is nullable', async () => {
    const { data: custom } = await client.queries.listPosts({
      selectionSet: sel,
    });
    const { data: listed } = await client.models.Post.list({
      selectionSet: sel,
    });
    type _1 = Expect<
      Equal<NonNullable<typeof custom>[number], (typeof listed)[number]>
    >;
    type _2 = Expect<
      Equal<
        typeof custom,
        Array<SelectionSet<Schema['Post'], typeof sel>> | null
      >
    >;
  });

  it('subscription events are the selected shape for every source form', () => {
    client.subscriptions.onUpdatePost({ selectionSet: sel }).subscribe({
      next: (e) => {
        type _ = Expect<
          Equal<typeof e, SelectionSet<Schema['Post'], typeof sel>>
        >;
      },
    });
    client.subscriptions.onLikePost({ selectionSet: sel }).subscribe({
      next: (e) => {
        type _ = Expect<
          Equal<typeof e, SelectionSet<Schema['Post'], typeof sel>>
        >;
      },
    });
    client.subscriptions.onPostChange({ selectionSet: sel }).subscribe({
      next: (e) => {
        type _ = Expect<
          Equal<typeof e, SelectionSet<Schema['Post'], typeof sel>>
        >;
      },
    });
    client.subscriptions.onLikePosts({ selectionSet: sel }).subscribe({
      next: (e) => {
        type _ = Expect<
          Equal<typeof e, Array<SelectionSet<Schema['Post'], typeof sel>>>
        >;
      },
    });
  });

  it('leaves the return type unchanged when no selection set is passed', async () => {
    const { data } = await client.queries.getPost({ id: 'p1' });
    type _ = Expect<Equal<typeof data, Schema['getPost']['type'] | null>>;
  });

  it('does not offer selectionSet where the return is not a model', async () => {
    // @ts-expect-error selectionSet is not an option on a custom type return
    await client.queries.echo({ value: 'x' }, { selectionSet: ['value'] });
    await client.queries.echoString(
      { value: 'x' },
      // @ts-expect-error selectionSet is not an option on a primitive return
      { selectionSet: ['value'] },
    );
    // @ts-expect-error selectionSet is not an option when the source mutation returns a custom type
    client.subscriptions.onEcho({ selectionSet: ['value'] });
    // @ts-expect-error selectionSet is not an option on generations
    await client.generations.makePost({ selectionSet: ['id'] });
  });

  it('offers selectionSet only where the return resolves to a model', () => {
    type HasSelectionSet<
      Fn extends (...args: any) => any,
      I extends number,
    > = 'selectionSet' extends keyof NonNullable<Parameters<Fn>[I]>
      ? true
      : false;

    type _getPost = Expect<
      Equal<HasSelectionSet<typeof client.queries.getPost, 1>, true>
    >;
    type _listPosts = Expect<
      Equal<HasSelectionSet<typeof client.queries.listPosts, 0>, true>
    >;
    type _onLikePosts = Expect<
      Equal<HasSelectionSet<typeof client.subscriptions.onLikePosts, 0>, true>
    >;
    type _echo = Expect<
      Equal<HasSelectionSet<typeof client.queries.echo, 1>, false>
    >;
    type _echoString = Expect<
      Equal<HasSelectionSet<typeof client.queries.echoString, 1>, false>
    >;
    type _onEcho = Expect<
      Equal<HasSelectionSet<typeof client.subscriptions.onEcho, 0>, false>
    >;
    type _makePost = Expect<
      Equal<HasSelectionSet<typeof client.generations.makePost, 0>, false>
    >;
  });

  it('rejects paths that are not on the model', async () => {
    // @ts-expect-error not a field of Post
    await client.queries.getPost({ id: 'p1' }, { selectionSet: ['nope'] });
  });

  it('follows selectionSetDepth exactly as the model op does', async () => {
    type SchemaDepth1 = ClientSchema<typeof schema, { selectionSetDepth: 1 }>;
    const d1 = {} as ClientExtensions<SchemaDepth1>;
    await d1.queries.getPost(
      { id: 'p1' },
      { selectionSet: ['id', 'author.*'] },
    );
    await d1.queries.getPost(
      { id: 'p1' },
      // @ts-expect-error second hop is stripped at depth 1
      { selectionSet: ['id', 'author.posts.*'] },
    );
    await d1.models.Post.get(
      { id: 'p1' },
      // @ts-expect-error second hop is stripped at depth 1 on the model op too
      { selectionSet: ['id', 'author.posts.*'] },
    );
    type SchemaDepth0 = ClientSchema<typeof schema, { selectionSetDepth: 0 }>;
    const d0 = {} as ClientExtensions<SchemaDepth0>;
    await d0.queries.getPost(
      { id: 'p1' },
      // @ts-expect-error relationships are lazy loaders at depth 0
      { selectionSet: ['id', 'comments.*'] },
    );
  });
});
