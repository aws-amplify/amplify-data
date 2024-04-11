import { a, ClientSchema } from '@aws-amplify/data-schema';
import {
  __modelMeta__,
  type ExtractModelMeta,
  type CustomQueries,
  type CustomMutations,
  type CustomSubscriptions,
  type ModelTypes,
  type GraphQLFormattedError,
} from '@aws-amplify/data-schema/runtime';
import type {
  Expect,
  ExpectFalse,
  Equal,
  HasKey,
  Prettify,
} from '@aws-amplify/data-schema-types';

type FilteredKeys<T> = {
  [P in keyof T]: T[P] extends never ? never : P;
}[keyof T];

type ExcludeNeverFields<O> = {
  [K in FilteredKeys<O>]: O[K];
};

type PartialClient<T extends Record<any, any> = never> = ExcludeNeverFields<{
  models: ModelTypes<T>;
  queries: CustomQueries<T>;
  mutations: CustomMutations<T>;
  subscriptions: CustomSubscriptions<T>;
}>;

function generateClient<T extends Record<any, any>>() {
  return {} as PartialClient<T>;
}

describe('client', () => {
  test('query returning a primitive type', async () => {
    const schema = a.schema({
      echo: a
        .query()
        .arguments({
          inputContent: a.string().required(),
        })
        .returns(a.string().required())
        .handler(a.handler.function('echoFunction'))
        .authorization([a.allow.public()]),
    });

    type Schema = ClientSchema<typeof schema>;
    const client = generateClient<Schema>();

    const response = await client.queries.echo({
      inputContent: 'some content',
    });

    type ResponseType = typeof response;
    type Expected = {
      data: string;
      errors?: GraphQLFormattedError[] | undefined;
      extensions?:
        | {
            [key: string]: any;
          }
        | undefined;
    };

    type test = Expect<Equal<ResponseType, Expected>>;
  });

  test('query returning an enum', async () => {
    const schema = a.schema({
      Status: a.enum(['Active', 'Inactive', 'Unknown']),
      getStatus: a
        .query()
        .arguments({
          itemId: a.string().required(),
        })
        .returns(a.ref('Status').required())
        .handler(a.handler.function('echoFunction'))
        .authorization([a.allow.public()]),
    });

    type Schema = ClientSchema<typeof schema>;
    const client = generateClient<Schema>();

    const response = await client.queries.getStatus({
      itemId: 'some-id',
    });

    type ResponseType = typeof response;
    type Expected = {
      data: 'Active' | 'Inactive' | 'Unknown';
      errors?: GraphQLFormattedError[] | undefined;
      extensions?:
        | {
            [key: string]: any;
          }
        | undefined;
    };

    type test = Expect<Equal<ResponseType, Expected>>;
  });

  test('query returning a custom type', async () => {
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
        .authorization([a.allow.public()]),
    });

    type Schema = ClientSchema<typeof schema>;
    const client = generateClient<Schema>();

    const response = await client.queries.echo({
      inputContent: 'some content',
    });

    type ResponseType = typeof response;
    type Expected = {
      data: {
        resultContent?: string | null | undefined;
      } | null;
      errors?: GraphQLFormattedError[] | undefined;
      extensions?:
        | {
            [key: string]: any;
          }
        | undefined;
    };

    type test = Expect<Equal<ResponseType, Expected>>;
  });

  test('query returning a model type', async () => {
    const schema = a.schema({
      DataModel: a.model({
        resultContent: a.string(),
      }),

      getDataModel: a
        .query()
        .arguments({
          modelId: a.string().required(),
        })
        .returns(a.ref('DataModel'))
        .handler(a.handler.function('echoFunction'))
        .authorization([a.allow.public()]),

      getAllDataModels: a
        .query()
        .returns(a.ref('DataModel').array())
        .handler(a.handler.function('echoFunction'))
        .authorization([a.allow.public()]),
    });

    type Schema = ClientSchema<typeof schema>;
    const client = generateClient<Schema>();

    const response = await client.queries.getDataModel({
      modelId: 'some-id',
    });

    type ResponseType = typeof response;

    type T = ResponseType['data'];

    type Expected = {
      data: Schema['DataModel'] | null;
      errors?: GraphQLFormattedError[] | undefined;
      extensions?:
        | {
            [key: string]: any;
          }
        | undefined;
    };

    type test = Expect<Equal<ResponseType, Expected>>;

    // tests custom query w/ no args
    const response2 = await client.queries.getAllDataModels();

    type Response2Type = typeof response2;

    type Expected2 = {
      data: (Schema['DataModel'] | null)[] | null;
      errors?: GraphQLFormattedError[] | undefined;
      extensions?:
        | {
            [key: string]: any;
          }
        | undefined;
    };

    type test2 = Expect<Equal<Response2Type, Expected2>>;
  });

  test('mutation', async () => {
    const schema = a.schema({
      LikeResult: a.customType({
        likes: a.integer().required(),
      }),
      likePost: a
        .mutation()
        .arguments({
          postId: a.string().required(),
        })
        .returns(a.ref('LikeResult'))
        .handler(a.handler.function('likePost'))
        .authorization([a.allow.public()]),

      likeAllPosts: a
        .mutation()
        .returns(a.ref('LikeResult').array())
        .handler(a.handler.function('likeAllPosts'))
        .authorization([a.allow.public()]),
    });

    type Schema = ClientSchema<typeof schema>;
    const client = generateClient<Schema>();

    const response = await client.mutations.likePost({
      postId: 'some-id',
    });

    type ResponseType = typeof response;
    type Expected = {
      data: {
        likes: number;
      } | null;
      errors?: GraphQLFormattedError[] | undefined;
      extensions?:
        | {
            [key: string]: any;
          }
        | undefined;
    };

    type test = Expect<Equal<ResponseType, Expected>>;

    // Tests custom mutation w/ no args
    const response2 = await client.mutations.likeAllPosts();

    type Response2Type = typeof response2;
    type Expected2 = {
      data:
        | ({
            likes: number;
          } | null)[]
        | null;
      errors?: GraphQLFormattedError[] | undefined;
      extensions?:
        | {
            [key: string]: any;
          }
        | undefined;
    };

    type test2 = Expect<Equal<Response2Type, Expected2>>;
  });

  describe('Subscription', () => {
    test('without .arguments() modifier', async () => {
      const schema = a
        .schema({
          Post: a.model({
            title: a.string(),
            liked: a.boolean(),
          }),

          onCreateOrUpdatePost: a
            .subscription()
            .for(a.ref('Post').mutations(['create', 'update']))
            .handler(a.handler.function('onCreateOrUpdatePost')),
        })
        .authorization([a.allow.public()]);

      type Schema = ClientSchema<typeof schema>;
      const client = generateClient<Schema>();

      client.subscriptions.onCreateOrUpdatePost().subscribe({
        next: (data) => {
          type ResponseType = Prettify<typeof data>;
          type ExpectedType = {
            readonly id: string;
            readonly createdAt: string;
            readonly updatedAt: string;
            title?: string | null;
            liked?: boolean | null;
          } | null;
          type test = Expect<Equal<ResponseType, ExpectedType>>;
        },
        error: (error) => {},
      });

      // Accepts options
      client.subscriptions.onCreateOrUpdatePost({
        authMode: 'apiKey',
        authToken: 'abc123',
        headers: { someHeader: 'someValue' },
      });
    });

    test('with .arguments() modifier', async () => {
      const schema = a
        .schema({
          Post: a.model({
            title: a.string(),
            liked: a.boolean(),
          }),

          onCreateOrUpdatePost: a
            .subscription()
            .for(a.ref('Post').mutations(['create', 'update']))
            .arguments({
              postId: a.string().required(),
            })
            .handler(a.handler.function('onCreateOrUpdatePost')),
        })
        .authorization([a.allow.public()]);

      type Schema = ClientSchema<typeof schema>;
      const client = generateClient<Schema>();

      type ModelMeta =
        ExtractModelMeta<Schema>['customOperations']['onCreateOrUpdatePost'];

      const sub = client.subscriptions
        .onCreateOrUpdatePost({ postId: 'abc' })
        .subscribe({
          next: (data) => {
            type ResponseType = Prettify<typeof data>;
            type ExpectedType = {
              readonly id: string;
              readonly createdAt: string;
              readonly updatedAt: string;
              title?: string | null;
              liked?: boolean | null;
            } | null;
            type test = Expect<Equal<ResponseType, ExpectedType>>;
          },
          error: (error) => {},
        });

      // Accepts options
      client.subscriptions.onCreateOrUpdatePost(
        { postId: 'abc' },
        {
          authMode: 'apiKey',
          authToken: 'abc123',
          headers: { someHeader: 'someValue' },
        },
      );
    });

    test(".for() resource's return type is a model field", async () => {
      const schema = a
        .schema({
          createString: a
            .mutation()
            .arguments({
              input: a.string().required(),
            })
            .returns(a.string().required())
            .handler(a.handler.function('createStringAndReturn')),
          onCreateString: a
            .subscription()
            .for(a.ref('createString'))
            .handler(a.handler.function('onCreateString')),
        })
        .authorization([a.allow.public()]);

      type Schema = ClientSchema<typeof schema>;
      const client = generateClient<Schema>();

      client.subscriptions.onCreateString().subscribe({
        next: (data) => {
          type ResponseType = typeof data;
          type ExpectedType = string;
          type _ = Expect<Equal<ResponseType, ExpectedType>>;
        },
      });
    });

    test(".for() resources' return types are a model field", async () => {
      const schema = a
        .schema({
          createString: a
            .mutation()
            .arguments({
              input: a.string().required(),
            })
            .returns(a.string().required())
            .handler(a.handler.function('createStringAndReturn')),
          updateString: a
            .mutation()
            .arguments({
              input: a.string().required(),
            })
            .returns(a.string().required())
            .handler(a.handler.function('updateStringAndReturn')),
          onCreateString: a
            .subscription()
            .for([a.ref('createString'), a.ref('updateString')])
            .handler(a.handler.function('onCreateString')),
        })
        .authorization([a.allow.public()]);

      type Schema = ClientSchema<typeof schema>;
      const client = generateClient<Schema>();

      client.subscriptions.onCreateString().subscribe({
        next: (data) => {
          type ResponseType = typeof data;
          type ExpectedType = string;
          type _ = Expect<Equal<ResponseType, ExpectedType>>;
        },
      });
    });

    test(".for() resource's return type is a custom type", async () => {
      const schema = a
        .schema({
          createProduct: a
            .mutation()
            .arguments({
              title: a.string().required(),
              description: a.string(),
            })
            .returns(
              a.customType({
                title: a.string().required(),
                description: a.string(),
              }),
            )
            .handler(a.handler.function('createProduct')),
          onCreateProduct: a
            .subscription()
            .for(a.ref('createProduct'))
            .handler(a.handler.function('onCreateProduct')),
        })
        .authorization([a.allow.public()]);

      type Schema = ClientSchema<typeof schema>;
      const client = generateClient<Schema>();

      client.subscriptions.onCreateProduct().subscribe({
        next: (data) => {
          type ResponseType = Prettify<typeof data>;
          type ExpectedType = {
            description?: string | null | undefined;
            title: string;
          } | null;
          type _ = Expect<Equal<ResponseType, ExpectedType>>;
        },
      });
    });

    test(".for() resources' return types are a custom type", async () => {
      const schema = a
        .schema({
          Product: a.customType({
            title: a.string().required(),
            description: a.string(),
          }),
          createProduct: a
            .mutation()
            .arguments({
              title: a.string().required(),
              description: a.string(),
            })
            .returns(a.ref('Product'))
            .handler(a.handler.function('createProduct')),
          updateProductDescription: a
            .mutation()
            .arguments({
              description: a.string(),
            })
            .returns(a.ref('Product'))
            .handler(a.handler.function('updateProductDescription')),
          onProductChanges: a
            .subscription()
            .for([a.ref('createProduct'), a.ref('updateProductDescription')])
            .handler(a.handler.function('onProductChanges')),
        })
        .authorization([a.allow.public()]);

      type Schema = ClientSchema<typeof schema>;
      const client = generateClient<Schema>();

      client.subscriptions.onProductChanges().subscribe({
        next: (data) => {
          type ResponseType = Prettify<typeof data>;
          type ExpectedType = {
            description?: string | null | undefined;
            title: string;
          } | null;
          type _ = Expect<Equal<ResponseType, ExpectedType>>;
        },
      });
    });

    test('.for() resources are a mix of CustomOperation and Mutation that return the same model type', async () => {
      const schema = a
        .schema({
          Post: a.model({
            title: a.string().required(),
            content: a.string(),
          }),
          createPostWithTitlePrefix: a
            .mutation()
            .arguments({
              prefix: a.string().required(),
            })
            .returns(a.ref('Post')),
          onCreatePost: a
            .subscription()
            .for([
              a.ref('Post').mutations(['create']),
              a.ref('createPostWithTitlePrefix'),
            ])
            .handler(a.handler.function('onCreateString')),
        })
        .authorization([a.allow.public()]);

      type Schema = ClientSchema<typeof schema>;
      const client = generateClient<Schema>();

      client.subscriptions.onCreatePost().subscribe({
        next: (data) => {
          type ResponseType = Prettify<typeof data>;
          type ExpectedType = {
            title: string;
            readonly id: string;
            readonly createdAt: string;
            readonly updatedAt: string;
            content?: string | null | undefined;
          } | null;
          type _ = Expect<Equal<ResponseType, ExpectedType>>;
        },
      });
    });

    test('.for() resources are a mix of Mutation and CustomOperation that return the same model type', async () => {
      const schema = a
        .schema({
          Post: a.model({
            title: a.string().required(),
            content: a.string(),
          }),
          createPostWithTitlePrefix: a
            .mutation()
            .arguments({
              prefix: a.string().required(),
            })
            .returns(a.ref('Post')),
          onCreatePost: a
            .subscription()
            .for([
              a.ref('createPostWithTitlePrefix'),
              a.ref('Post').mutations(['create']),
            ])
            .handler(a.handler.function('onCreateString')),
        })
        .authorization([a.allow.public()]);

      type Schema = ClientSchema<typeof schema>;
      const client = generateClient<Schema>();

      client.subscriptions.onCreatePost().subscribe({
        next: (data) => {
          type ResponseType = Prettify<typeof data>;
          type ExpectedType = {
            title: string;
            readonly id: string;
            readonly createdAt: string;
            readonly updatedAt: string;
            content?: string | null | undefined;
          } | null;
          type _ = Expect<Equal<ResponseType, ExpectedType>>;
        },
      });
    });
  });

  test('custom ops are absent from models property', async () => {
    const schema = a
      .schema({
        MyModel: a.model({
          content: a.string(),
        }),
        myQuery: a.query().arguments({ input: a.string() }).returns(a.string()),
        myMutation: a
          .mutation()
          .arguments({ input: a.string() })
          .returns(a.string()),
        mySubscription: a.subscription().arguments({ input: a.string() }),
      })
      .authorization([a.allow.public()]);

    type Schema = ClientSchema<typeof schema>;
    const client = generateClient<Schema>();

    type ClientModels = typeof client.models;

    type _T1 = ExpectFalse<HasKey<ClientModels, 'myQuery'>>;
    type _T2 = ExpectFalse<HasKey<ClientModels, 'myMutation'>>;
    type _T3 = ExpectFalse<HasKey<ClientModels, 'mySubscription'>>;
  });
});
