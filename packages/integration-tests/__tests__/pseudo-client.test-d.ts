import { a, ClientSchema } from '@aws-amplify/data-schema';
import {
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
import { generateClient } from 'aws-amplify/api';

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
        .authorization((allow) => allow.publicApiKey()),
    });

    type Schema = ClientSchema<typeof schema>;
    const client = generateClient<Schema>();

    const response = await client.queries.echo({
      inputContent: 'some content',
    });

    type ResponseType = typeof response;
    type Expected = {
      data: string | null;
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
        .authorization((allow) => allow.publicApiKey()),
    });

    type Schema = ClientSchema<typeof schema>;
    const client = generateClient<Schema>();

    const response = await client.queries.getStatus({
      itemId: 'some-id',
    });

    type ResponseType = typeof response;
    type Expected = {
      data: 'Active' | 'Inactive' | 'Unknown' | null;
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
        .authorization((allow) => allow.publicApiKey()),
    });

    type Schema = ClientSchema<typeof schema>;
    const client = generateClient<Schema>();

    const response = await client.queries.echo({
      inputContent: 'some content',
    });

    type ResponseType = typeof response;
    type Expected = {
      data: {
        resultContent: string | null;
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
        .authorization((allow) => allow.publicApiKey()),

      getAllDataModels: a
        .query()
        .returns(a.ref('DataModel').array())
        .handler(a.handler.function('echoFunction'))
        .authorization((allow) => allow.publicApiKey()),
    });

    type Schema = ClientSchema<typeof schema>;
    const client = generateClient<Schema>();

    const response = await client.queries.getDataModel({
      modelId: 'some-id',
    });

    type ResponseType = typeof response;

    type T = ResponseType['data'];

    type Expected = {
      data: Schema['DataModel']['type'] | null;
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
      data: (Schema['DataModel']['type'] | null)[] | null;
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
        .authorization((allow) => allow.publicApiKey()),

      likeAllPosts: a
        .mutation()
        .returns(a.ref('LikeResult').array())
        .handler(a.handler.function('likeAllPosts'))
        .authorization((allow) => allow.publicApiKey()),
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
    type Response2Data = Prettify<Exclude<typeof response2.data, null>>;

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
        .authorization((allow) => allow.publicApiKey());

      type Schema = ClientSchema<typeof schema>;
      const client = generateClient<Schema>();

      client.subscriptions.onCreateOrUpdatePost().subscribe({
        next: (data) => {
          type ResponseType = Prettify<typeof data>;
          type ExpectedType = {
            readonly id: string;
            readonly createdAt: string;
            readonly updatedAt: string;
            title: string | null;
            liked: boolean | null;
          };
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
        .authorization((allow) => allow.publicApiKey());

      type Schema = ClientSchema<typeof schema>;
      const client = generateClient<Schema>();

      const sub = client.subscriptions
        .onCreateOrUpdatePost({ postId: 'abc' })
        .subscribe({
          next: (data) => {
            type ResponseType = Prettify<typeof data>;
            type ExpectedType = {
              readonly id: string;
              readonly createdAt: string;
              readonly updatedAt: string;
              title: string | null;
              liked: boolean | null;
            };
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
        .authorization((allow) => allow.publicApiKey());

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
        .authorization((allow) => allow.publicApiKey());

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
        .authorization((allow) => allow.publicApiKey());

      type Schema = ClientSchema<typeof schema>;
      const client = generateClient<Schema>();

      client.subscriptions.onCreateProduct().subscribe({
        next: (data) => {
          type ResponseType = Prettify<typeof data>;
          type ExpectedType = {
            description?: string | null | undefined;
            title: string;
          };
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
        .authorization((allow) => allow.publicApiKey());

      type Schema = ClientSchema<typeof schema>;
      const client = generateClient<Schema>();

      client.subscriptions.onProductChanges().subscribe({
        next: (data) => {
          type ResponseType = Prettify<typeof data>;
          type ExpectedType = {
            description: string | null;
            title: string;
          };
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
        .authorization((allow) => allow.publicApiKey());

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
            content: string | null;
          };
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
        .authorization((allow) => allow.publicApiKey());

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
            content: string | null;
          };
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
      .authorization((allow) => allow.publicApiKey());

    type Schema = ClientSchema<typeof schema>;
    const client = generateClient<Schema>();

    type ClientModels = typeof client.models;

    type _T1 = ExpectFalse<HasKey<ClientModels, 'myQuery'>>;
    type _T2 = ExpectFalse<HasKey<ClientModels, 'myMutation'>>;
    type _T3 = ExpectFalse<HasKey<ClientModels, 'mySubscription'>>;
  });
});
