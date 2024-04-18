import type {
  Equal,
  Expect,
  ExtractModelMeta,
  Prettify,
} from '@aws-amplify/data-schema-types';
import { ClientSchema, a } from '../index';
import type { AppSyncResolverHandler } from 'aws-lambda';
import { configure } from '../src/ModelSchema';

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
        ExtractModelMeta<
          ClientSchema<typeof schema>
        >['customOperations']['aQuery']['returnType']
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
          .function('someHandler')
          .arguments({
            input: a.string(),
            content: a.string().required(),
          })
          .returns(a.ref('MyType').required()),
      });

      type Schema = ClientSchema<typeof schema>;

      type ActualArgs = Prettify<Schema['aQuery']['functionHandlerArguments']>;
      type ActualResult = Prettify<Schema['aQuery']['functionHandlerResult']>;
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
        ExtractModelMeta<
          ClientSchema<typeof schema>
        >['customOperations']['aQuery']['returnType']
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
          .function('someHandler')
          .arguments({
            input: a.string(),
            content: a.string().required(),
          })
          .returns(a.ref('MyType').required()),
      });

      type Schema = ClientSchema<typeof schema>;

      type ActualArgs = Prettify<Schema['aQuery']['functionHandlerArguments']>;
      type ActualResult = Prettify<Schema['aQuery']['functionHandlerResult']>;
      type ActualHandler = Schema['aQuery']['functionHandler'];

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
        ExtractModelMeta<
          ClientSchema<typeof schema>
        >['customOperations']['aQuery']['returnType']
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
          .function('someHandler')
          .arguments({
            input: a.string(),
            content: a.string().required(),
          })
          .returns(a.ref('MyModel').required()),
      });

      type Schema = ClientSchema<typeof schema>;

      type ActualArgs = Prettify<Schema['aQuery']['functionHandlerArguments']>;
      type ActualResult = Prettify<Schema['aQuery']['functionHandlerResult']>;
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
        ExtractModelMeta<
          ClientSchema<typeof schema>
        >['customOperations']['aQuery']['returnType']
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
          .function('someHandler')
          .arguments({
            input: a.string(),
            content: a.string().required(),
          })
          .returns(a.ref('MyModel').required()),
      });

      type Schema = ClientSchema<typeof schema>;

      type ActualArgs = Prettify<Schema['aQuery']['functionHandlerArguments']>;
      type ActualResult = Prettify<Schema['aQuery']['functionHandlerResult']>;
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
        ExtractModelMeta<
          ClientSchema<typeof schema>
        >['customOperations']['aQuery']['returnType']
      >;

      type Expected = 'succeeded' | 'failed';

      type _ = Expect<Equal<ReturnType, Expected>>;
    });

    it('produces function handler types', () => {
      const schema = a.schema({
        Value: a.enum(['succeeded', 'failed']),
        aQuery: a
          .query()
          .function('someHandler')
          .arguments({ input: a.string(), content: a.string().required() })
          .returns(a.ref('Value').required()),
      });

      type Schema = ClientSchema<typeof schema>;

      type ActualArgs = Prettify<Schema['aQuery']['functionHandlerArguments']>;
      type ActualResult = Prettify<Schema['aQuery']['functionHandlerResult']>;
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

describe('RDS custom operations', () => {
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

  type ResolvedClientSchema = ClientSchema<typeof s>;

  it('adds custom operations to ModelMeta', () => {
    type ModelMeta = ExtractModelMeta<ResolvedClientSchema>;
    type Resolved = Prettify<ModelMeta['customOperations']>;

    type Expected = {
      likePost: {
        arguments: {
          postId?: string | null | undefined;
          content: string;
        };
        returnType: {
          title?: string | null | undefined;
        } | null;
        functionRef: null;
        typeName: 'Mutation';
        authorization: [];
      };
      getLikedPost: {
        arguments: never;
        returnType: {
          title?: string | null | undefined;
        } | null;
        functionRef: null;
        typeName: 'Query';
        authorization: [];
      };
      onLikePost: {
        arguments: never;
        returnType: {
          title?: string | null | undefined;
        } | null;
        functionRef: null;
        typeName: 'Subscription';
        authorization: [];
      };
    };

    type _ = Expect<Equal<Resolved, Expected>>;
  });
});
