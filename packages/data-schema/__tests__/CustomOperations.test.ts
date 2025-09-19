import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { a } from '../src/index';
import { configure } from '../src/internals';
import { defineFunctionStub } from './utils';

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

describe('CustomOperation transform', () => {
  describe('dynamo schema', () => {
    test('Schema w model, custom query, mutation, and subscription', () => {
      const s = a
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
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('Schema w model, custom query, mutation, and subscription and ref of model with array modifier', () => {
      const s = a
        .schema({
          Post: a.model({
            title: a.string(),
          }),
          listPosts: a
            .mutation()
            .returns(a.ref('Post').array())
            .handler(a.handler.function('myFunc')),
          getLikedPost: a
            .query()
            .returns(a.ref('Post').array())
            .handler(a.handler.function('myFunc')),
          onCreatePost: a
            .subscription()
            .for(a.ref('Post').mutations(['create']))
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('Schema w model, custom query, mutation, and subscription and ref of custom type with array modifier', () => {
      const s = a
        .schema({
          PostCustomType: a.customType({
            title: a.string(),
          }),
          listPosts: a
            .mutation()
            .returns(a.ref('PostCustomType').array())
            .handler(a.handler.function('myFunc')),
          getLikedPost: a
            .query()
            .returns(a.ref('PostCustomType').array())
            .handler(a.handler.function('myFunc')),
          onCreatePost: a
            .subscription()
            .for(a.ref('listPosts'))
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('Custom Mutation w Auth rules and no handler should throw', () => {
      const s = a.schema({
        likePost: a
          .mutation()
          .arguments({ postId: a.string() })
          .returns(a.ref('Post'))
          .authorization((allow) => allow.authenticated()),
      });

      expect(() => s.transform()).toThrow(
        'requires both an authorization rule and a handler reference',
      );
    });

    test('Custom Query w/ no return should throw', () => {
      const s = a.schema({
        echo: a
          .query()
          .arguments({
            content: a.string(),
          })
          .authorization((allow) => [allow.publicApiKey()])
          .handler(a.handler.function('someHandler')),
      });

      expect(() => s.transform()).toThrow(
        'Invalid Custom Query definition. A Custom Query must include a return type',
      );
    });

    test('Custom Mutation w/ no return should throw', () => {
      const s = a.schema({
        likePost: a
          .mutation()
          .arguments({ postId: a.string() })
          .authorization((allow) => [allow.publicApiKey()])
          .handler(a.handler.function('myFunc')),
      });

      expect(() => s.transform()).toThrow(
        'Invalid Custom Mutation definition. A Custom Mutation must include a return type',
      );
    });

    test('Custom Mutation w handler, but no auth rules should throw', () => {
      const s = a.schema({
        likePost: a
          .mutation()
          .arguments({ postId: a.string() })
          .returns(a.ref('Post'))
          .handler(a.handler.function('myFunc')),
      });

      expect(() => s.transform()).toThrow(
        'requires both an authorization rule and a handler reference',
      );
    });

    test('Custom Mutation w required arg and enum', () => {
      const s = a.schema({
        Post: a
          .model({ title: a.string() })
          .authorization((allow) => allow.authenticated()),
        likePost: a
          .mutation()
          .arguments({
            postId: a.string().required(),
            reactionType: a.enum([':shipit:', ':risitas:']),
          })
          .returns(a.ref('Post')),
      });

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('Custom Mutation w string function reference', () => {
      const s = a.schema({
        Post: a
          .model({ title: a.string() })
          .authorization((allow) => allow.authenticated()),
        likePost: a
          .mutation()
          .arguments({
            postId: a.string().required(),
          })
          .returns(a.ref('Post'))
          .handler(a.handler.function('myFunc'))
          .authorization((allow) => allow.authenticated()),
      });

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('Custom Mutation w string function reference & auth', () => {
      const s = a.schema({
        Post: a
          .model({ title: a.string() })
          .authorization((allow) => allow.authenticated()),
        likePost: a
          .mutation()
          .arguments({
            postId: a.string().required(),
          })
          .returns(a.ref('Post'))
          .handler(a.handler.function('myFunc'))
          .authorization((allow) => allow.authenticated()),
      });

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('Custom mutation w inline custom return type', () => {
      const s = a.schema({
        likePost: a
          .mutation()
          .arguments({
            postId: a.string().required(),
          })
          .returns(
            a.customType({
              stringField: a.string(),
              intField: a.integer(),
              floatField: a.float(),
              boolField: a.boolean(),
              datetimeField: a.datetime(),
              jsonField: a.json(),
            }),
          ),
      });

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('Custom query w inline custom return type', () => {
      const s = a.schema({
        getPostDetails: a
          .query()
          .arguments({
            postId: a.string().required(),
          })
          .returns(
            a.customType({
              stringField: a.string(),
              intField: a.integer(),
              floatField: a.float(),
              boolField: a.boolean(),
              datetimeField: a.datetime(),
              jsonField: a.json(),
            }),
          ),
      });

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('Custom query w inline custom enum return type', () => {
      const s = a.schema({
        getPostStatus: a
          .query()
          .arguments({
            postId: a.string().required(),
          })
          .returns(a.enum(['draft', 'pending', 'approved'])),
      });

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('Custom query w referenced enum return type', () => {
      const s = a.schema({
        getPostStatus: a
          .query()
          .arguments({
            postId: a.string().required(),
          })
          .returns(a.ref('PostStatus')),
        PostStatus: a.enum(['draft', 'pending', 'approved']),
      });

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('Generation route does not require a handler even when auth is defined', () => {
      const s = a.schema({
        Recipe: a.customType({
          ingredients: a.string().array(),
        }),
        makeRecipe: a
          .generation({
            aiModel: a.ai.model('Claude 3 Haiku'),
            systemPrompt: 'Hello, world!',
          })
          .arguments({
            content: a.string(),
          })
          .returns(a.ref('Recipe'))
          .authorization((allow) => allow.publicApiKey()),
      });

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('Generation route should create directive with inference configuration', () => {
      const s = a.schema({
        Recipe: a.customType({
          ingredients: a.string().array(),
        }),
        makeRecipe: a
          .generation({
            aiModel: a.ai.model('Claude 3 Haiku'),
            systemPrompt: 'Hello, world!',
            inferenceConfiguration: {
              temperature: 0.5,
              maxTokens: 100,
              topP: 1,
            },
          })
          .arguments({
            content: a.string(),
          })
          .returns(a.ref('Recipe'))
          .authorization((allow) => allow.publicApiKey()),
      });

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('Generation route with empty inference configuration should not pass argument along to directive', () => {
      const s = a.schema({
        makeRecipe: a
          .generation({
            aiModel: a.ai.model('Claude 3 Haiku'),
            systemPrompt: 'Hello, world!',
            inferenceConfiguration: {},
          })
          .arguments({
            content: a.string(),
          })
          .returns(a.string())
          .authorization((allow) => allow.publicApiKey()),
      });

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('Generation route with subset of inference configuration should create directive arg', () => {
      const s = a.schema({
        makeRecipe: a
          .generation({
            aiModel: a.ai.model('Claude 3 Haiku'),
            systemPrompt: 'Hello, world!',
            inferenceConfiguration: {
              temperature: 0.5,
            },
          })
          .arguments({
            content: a.string(),
          })
          .returns(a.string())
          .authorization((allow) => allow.publicApiKey()),
      });

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('Generation route w/ no return should throw', () => {
      const s = a.schema({
        makeRecipe: a
          .generation({
            aiModel: a.ai.model('Claude 3 Haiku'),
            systemPrompt: 'Hello, world!',
          })
          .arguments({
            content: a.string(),
          }),
      });

      expect(() => s.transform()).toThrow(
        'Invalid Generation Route definition. A Generation Route must include a return type',
      );
    });

    for (const returnType of [
      'string',
      'integer',
      'float',
      'boolean',
      'datetime',
      'json',
    ] as const) {
      test(`Custom mutation w inline ${returnType} return type`, () => {
        const s = a.schema({
          likePost: a
            .mutation()
            .arguments({
              postId: a.string().required(),
            })
            .returns(a[returnType]()),
        });

        const result = s.transform().schema;

        expect(result).toMatchSnapshot();
      });

      test(`Custom query w inline ${returnType} return type`, () => {
        const s = a.schema({
          getPostDetails: a
            .query()
            .arguments({
              postId: a.string().required(),
            })
            .returns(a[returnType]()),
        });

        const result = s.transform().schema;

        expect(result).toMatchSnapshot();
      });
    }

    describe('custom subscriptions', () => {
      test(`Custom subscription with model single mutation source`, () => {
        const s = a
          .schema({
            Post: a.model({
              title: a.string(),
            }),

            onCreatePost: a
              .subscription()
              .for(a.ref('Post').mutations(['create']))
              .handler(a.handler.function('myFunc')),
          })
          .authorization((allow) => allow.publicApiKey());

        const result = s.transform().schema;

        expect(result).toMatchSnapshot();
      });

      test(`Custom subscription with model multiple mutation sources`, () => {
        const s = a
          .schema({
            Post: a.model({
              title: a.string(),
            }),

            onAnyPostMutation: a
              .subscription()
              .for(a.ref('Post').mutations(['create', 'update', 'delete']))
              .handler(a.handler.function('myFunc')),
          })
          .authorization((allow) => allow.publicApiKey());

        const result = s.transform().schema;

        expect(result).toMatchSnapshot();
      });

      test(`Custom subscription with model ref, but no mutation source throws`, () => {
        const s = a
          .schema({
            Post: a.model({
              title: a.string(),
            }),

            onCreatePost: a
              .subscription()
              .for(a.ref('Post'))
              .handler(a.handler.function('myFunc')),
          })
          .authorization((allow) => allow.publicApiKey());

        expect(() => s.transform()).toThrow(
          'Invalid subscription definition. .mutations() modifier must be used with a Model ref subscription source',
        );
      });

      test(`Custom subscription with custom mutation source`, () => {
        const s = a
          .schema({
            Post: a.model({
              title: a.string(),
            }),

            likePost: a
              .mutation()
              .arguments({ postId: a.string() })
              .handler(a.handler.function('likePost'))
              .returns(a.ref('Post')),

            onLikePost: a
              .subscription()
              .for(a.ref('likePost'))
              .handler(a.handler.function('myFunc')),
          })
          .authorization((allow) => allow.publicApiKey());

        const result = s.transform().schema;

        expect(result).toMatchSnapshot();
      });

      test(`Custom subscription with Model source & custom mutation source`, () => {
        const s = a
          .schema({
            Post: a.model({
              title: a.string(),
            }),

            likePost: a
              .mutation()
              .arguments({ postId: a.string() })
              .handler(a.handler.function('likePost'))
              .returns(a.ref('Post')),

            onLikeOrUpdatePost: a
              .subscription()
              .for([a.ref('likePost'), a.ref('Post').mutations(['update'])])
              .handler(a.handler.function('myFunc')),
          })
          .authorization((allow) => allow.publicApiKey());

        const result = s.transform().schema;

        expect(result).toMatchSnapshot();
      });

      test(`Custom subscription with custom query source throws`, () => {
        const s = a
          .schema({
            Post: a.model({
              title: a.string(),
            }),

            getLikedPosts: a
              .query()
              .handler(a.handler.function('likedPosts'))
              .returns(a.ref('Post').array()),

            onLikePost: a
              .subscription()
              .for(a.ref('getLikedPosts'))
              .handler(a.handler.function('myFunc')),
          })
          .authorization((allow) => allow.publicApiKey());

        expect(() => s.transform()).toThrow(
          'Invalid subscription definition. .for() can only reference a mutation.',
        );
      });

      test(`Custom subscription without source throws`, () => {
        const s = a
          .schema({
            Post: a.model({
              title: a.string(),
            }),

            getLikedPosts: a
              .query()
              .handler(a.handler.function('likedPosts'))
              .returns(a.ref('Post').array()),

            onLikePost: a.subscription().handler(a.handler.function('myFunc')),
          })
          .authorization((allow) => allow.publicApiKey());

        expect(() => s.transform()).toThrow('is missing a mutation source');
      });

      test(`Custom subscription referencing nonexistent type throws`, () => {
        const s = a
          .schema({
            onLikePost: a
              .subscription()
              .for(a.ref('Post').mutations(['create']))
              .handler(a.handler.function('myFunc')),
          })
          .authorization((allow) => allow.publicApiKey());

        expect(() => s.transform()).toThrow(
          'Invalid ref. onLikePost is referring to Post which is not defined in the schema',
        );
      });

      test(`Custom subscription where .for() resources do not have the same return type`, () => {
        const s = a
          .schema({
            Post: a.model({
              title: a.string(),
            }),

            updatePostTitleAndReturn: a
              .mutation()
              .returns(a.string())
              .handler(a.handler.function('updatePostTitleAndReturn')),

            onLikePost: a
              .subscription()
              .for([
                a.ref('Post').mutations(['create']), // returns Post; valid
                a.ref('updatePostTitleAndReturn'), // returns string; invalid
              ])
              .handler(a.handler.function('myFunc')),
          })
          .authorization((allow) => allow.publicApiKey());

        expect(() => s.transform()).toThrow(
          'Invalid subscription definition. .for() can only reference resources that have the same return type. onLikePost is referencing resources that have different return types.',
        );
      });

      test(`Custom subscription where .for() resource has a scalar return type`, () => {
        const s = a
          .schema({
            likePost: a
              .mutation()
              .returns(a.string())
              .handler(a.handler.function('likePost')),

            onLikePost: a
              .subscription()
              .for(a.ref('likePost'))
              .handler(a.handler.function('onLikePost')),
          })
          .authorization((allow) => allow.publicApiKey());

        const result = s.transform().schema;

        expect(result).toMatchSnapshot();
      });

      test(`Custom subscription where .for() resource has a CustomType return type`, () => {
        const s = a
          .schema({
            createCustomTypePost: a
              .mutation()
              .returns(
                a.customType({
                  title: a.string().required(),
                }),
              )
              .handler(a.handler.function('createCustomTypePost')),

            onLikeCustomTypePost: a
              .subscription()
              .for(a.ref('createCustomTypePost'))
              .handler(a.handler.function('onCreateCustomTypePost')),
          })
          .authorization((allow) => allow.publicApiKey());

        const result = s.transform().schema;

        expect(result).toMatchSnapshot();
      });
    });

    describe('handlers', () => {
      describe('general validation', () => {
        test('handler with no auth throws', () => {
          const s = a.schema({
            getPostDetails: a
              .query()
              .arguments({})
              .returns(a.customType({}))
              .handler(
                a.handler.custom({
                  entry: './filename.js',
                  dataSource: 'CommentTable',
                }),
              ),
          });

          expect(() => s.transform()).toThrow(
            'requires both an authorization rule and a handler reference',
          );
        });

        test('auth with no handler throws', () => {
          const s = a.schema({
            getPostDetails: a
              .query()
              .arguments({})
              .returns(a.customType({}))
              .authorization((allow) => allow.publicApiKey()),
          });

          expect(() => s.transform()).toThrow(
            'requires both an authorization rule and a handler reference',
          );
        });

        test('mix of different handler types throws', () => {
          const s = a.schema({
            getPostDetails: a
              .query()
              .arguments({})
              .returns(a.customType({}))
              .authorization((allow) => allow.publicApiKey())
              .handler([
                // @ts-expect-error
                a.handler.custom({
                  entry: './filename.js',
                  dataSource: 'CommentTable',
                }),
                a.handler.function('myFn'),
              ]),
          });

          expect(() => s.transform()).toThrow(
            'Field handlers must be of the same type',
          );
        });
      });

      describe('a.handler.custom', () => {
        test('a.handler.custom with auth works', () => {
          const s = a.schema({
            getPostDetails: a
              .query()
              .arguments({})
              .handler(
                a.handler.custom({
                  entry: './filename.js',
                  dataSource: a.ref('Comment'),
                }),
              )
              .authorization((allow) => allow.groups(['groupA', 'groupB']))
              .returns(a.customType({})),
          });

          const {
            schema,
            jsFunctions: [jsFunction],
          } = s.transform();

          expect(schema).toMatchSnapshot();

          expect(jsFunction).toMatchObject({
            typeName: 'Query',
            fieldName: 'getPostDetails',
            handlers: [
              {
                dataSource: 'CommentTable',
                entry: expect.objectContaining({
                  relativePath: './filename.js',
                  importLine: expect.stringContaining('__tests__'),
                }),
              },
            ],
          });
        });

        test('a.handler.custom with auth and model ref works', () => {
          const s = a
            .schema({
              Post: a.model({
                title: a.string(),
              }),
              getPostDetails: a
                .query()
                .arguments({})
                .handler([
                  a.handler.custom({
                    entry: './filename.js',
                    dataSource: a.ref('Post'),
                  }),
                ])
                .returns(a.customType({})),
            })
            .authorization((allow) => allow.publicApiKey());

          const {
            schema,
            jsFunctions: [jsFunction],
          } = s.transform();

          expect(schema).toMatchSnapshot();

          expect(jsFunction).toMatchObject({
            typeName: 'Query',
            fieldName: 'getPostDetails',
            handlers: [
              {
                dataSource: 'PostTable',
                entry: expect.objectContaining({
                  relativePath: './filename.js',
                  importLine: expect.stringContaining('__tests__'),
                }),
              },
            ],
          });
        });

        test('a.handler.custom with multiple supported auth modes', () => {
          const s = a.schema({
            Post: a
              .model({
                title: a.string(),
              })
              .authorization((allow) => allow.authenticated()),
            customQuery: a
              .query()
              .returns(a.string())
              .handler([
                a.handler.custom({
                  entry: './filename.js',
                  dataSource: a.ref('Post'),
                }),
              ])
              .authorization((allow) => [
                allow.authenticated(),
                allow.groups(['groupA', 'groupB']),
              ]),
          });

          const { schema } = s.transform();

          expect(schema).toMatchSnapshot();
        });

        test('unsupported auth modes throw', () => {
          const s3 = a.schema({
            customQuery: a
              .query()
              .handler([
                a.handler.custom({
                  entry: './filename.js',
                  dataSource: 'CommentTable',
                }),
              ])
              .returns(a.ref('something'))
              .authorization((allow) => allow.groups(['group1'], 'oidc')),
          });

          expect(() => s3.transform()).toThrow(
            'OIDC group auth is not supported with a.handler.custom',
          );
        });
      });

      describe('a.handler.function', () => {
        test('string', () => {
          const s = a.schema({
            getPostDetails: a
              .query()
              .arguments({})
              .handler(a.handler.function('myFunc'))
              .authorization((allow) => allow.authenticated())
              .returns(a.customType({})),
          });

          const { schema, lambdaFunctions } = s.transform();

          expect(schema).toMatchSnapshot();
          expect(lambdaFunctions).toMatchObject({});
        });

        test('defineFunction', () => {
          const fn1 = defineFunctionStub({});

          const s = a.schema({
            getPostDetails: a
              .query()
              .arguments({})
              .handler(a.handler.function(fn1))
              .authorization((allow) => allow.authenticated())
              .returns(a.customType({})),
          });

          const { schema, lambdaFunctions } = s.transform();

          expect(schema).toMatchSnapshot();
          expect(lambdaFunctions).toMatchObject({
            FnGetPostDetails: fn1,
          });
        });

        test('defineFunction event invocation', () => {
          const fn1 = defineFunctionStub({});
          const s = a.schema({
            getPostDetails: a
              .query()
              .arguments({})
              .handler(a.handler.function(fn1).async())
              .authorization((allow) => allow.authenticated()),
          });

          const { schema, lambdaFunctions } = s.transform();
          expect(schema).toMatchSnapshot();
          expect(lambdaFunctions).toMatchObject({
            FnGetPostDetails: fn1,
          });
        });

        test('defineFunction sync - async', () => {
          const fn1 = defineFunctionStub({});
          const s = a.schema({
            getPostDetails: a
              .query()
              .arguments({})
              .handler([
                a.handler.function(fn1),
                a.handler.function(fn1).async(),
              ])
              .authorization((allow) => allow.authenticated()),
          });

          const { schema, lambdaFunctions } = s.transform();
          expect(schema).toMatchSnapshot();
          expect(lambdaFunctions).toMatchObject({
            FnGetPostDetails: fn1,
          });
        });

        test('defineFunction sync - async with returns generates type errors', () => {
          const fn1 = defineFunctionStub({});
          const s = a.schema({
            getPostDetails: a
              .query()
              .arguments({})
              .handler([
                a.handler.function(fn1),
                a.handler.function(fn1).async(),
              ])
              .authorization((allow) => allow.authenticated())
              // @ts-expect-error
              .returns({}),
          });
        });

        test('defineFunction async - async', () => {
          const fn1 = defineFunctionStub({});
          const fn2 = defineFunctionStub({});

          const s = a.schema({
            getPostDetails: a
              .query()
              .arguments({})
              .handler([
                a.handler.function(fn1).async(),
                a.handler.function(fn2).async(),
              ])
              .authorization((allow) => allow.authenticated()),
          });

          const { schema, lambdaFunctions } = s.transform();
          expect(schema).toMatchSnapshot();
          expect(lambdaFunctions).toMatchObject({
            FnGetPostDetails: fn1,
            FnGetPostDetails2: fn2,
          });
        });

        test('defineFunction async - sync', () => {
          const fn1 = defineFunctionStub({});
          const s = a.schema({
            getPostDetails: a
              .query()
              .arguments({})
              .handler([
                a.handler.function(fn1).async(),
                a.handler.function(fn1),
              ])
              .returns(a.customType({}))
              .authorization((allow) => allow.authenticated()),
          });

          const { schema, lambdaFunctions } = s.transform();
          expect(schema).toMatchSnapshot();
        });

        test('pipeline / mix', () => {
          const fn1 = defineFunctionStub({});
          const fn2 = defineFunctionStub({});

          const s = a.schema({
            getPostDetails: a
              .query()
              .arguments({})
              .handler([
                a.handler.function('myFunc'),
                a.handler.function(fn1),
                a.handler.function(fn2),
                a.handler.function('myFunc2'),
              ])
              .authorization((allow) => allow.authenticated())
              .returns(a.customType({})),
          });

          const { schema, lambdaFunctions } = s.transform();

          expect(schema).toMatchSnapshot();
          expect(lambdaFunctions).toMatchObject({
            FnGetPostDetails2: fn1,
            FnGetPostDetails3: fn2,
          });
        });

        test('defineFunction for an async operation that has authorization rules for both group and authenticated', () => {
          const fn1 = defineFunctionStub({});
          const s = a.schema({
            getPostDetails: a
              .query()
              .arguments({})
              .handler([
                a.handler.function(fn1).async(),
              ])
              .authorization((allow) => [allow.authenticated(), allow.group('TestGroup')]),
          });

          const { schema, lambdaFunctions } = s.transform();
          expect(schema).toMatchSnapshot();
        });

        test('defineFunction for two async operations that have authorization rules for either group or authenticated', () => {
          const fn1 = defineFunctionStub({});
          const s = a.schema({
            getPostDetailsA: a
              .query()
              .arguments({})
              .handler([
                a.handler.function(fn1).async(),
              ])
              .authorization((allow) => allow.group('TestGroup')),
            getPostDetailsB: a
              .query()
              .arguments({})
              .handler([
                a.handler.function(fn1).async(),
              ])
              .authorization((allow) => allow.authenticated()),
          });

          const { schema, lambdaFunctions } = s.transform();
          expect(schema).toMatchSnapshot();
        });

        test('invalid', () => {
          const invalidFnDef = {};

          const s = a.schema({
            getPostDetails: a
              .query()
              .arguments({})
              // @ts-expect-error
              .handler([a.handler.function(invalidFnDef)])
              .authorization((allow) => allow.authenticated())
              .returns(a.customType({})),
          });

          expect(() => s.transform()).toThrow(
            'Invalid value specified for getPostDetails handler.function()',
          );
        });
      });

      test('a.handler.inlineSql works', () => {
        const s = aSql.schema({
          getPostDetails: a
            .query()
            .arguments({})
            .handler(a.handler.inlineSql('SELECT * from TESTTABLE;'))
            .authorization((allow) => allow.authenticated())
            .returns(a.customType({})),
        });

        const result = s.transform();

        expect(result).toMatchSnapshot();
      });

      test('a.handler.inlineSql escapes quotes', () => {
        const s = aSql.schema({
          getPostDetails: a
            .query()
            .arguments({})
            .handler(
              a.handler.inlineSql('SELECT * from TESTTABLE status = "active";'),
            )
            .authorization((allow) => allow.authenticated())
            .returns(a.customType({})),
        });

        const result = s.transform().schema;

        expect(result).toMatchSnapshot();
      });

      test('a.handler.sqlReference works', () => {
        const s = aSql.schema({
          getPostDetails: a
            .query()
            .arguments({})
            .handler(a.handler.sqlReference('./testQueryName'))
            .authorization((allow) => allow.authenticated())
            .returns(a.customType({})),
        });

        const result = s.transform().schema;

        expect(result).toMatchSnapshot();
      });
    });
  });

  describe('custom operations with custom types and refs', () => {
    test('custom operation query has inline custom type argument', () => {
      const s = a
        .schema({
          inlineCustomType: a
            .query()
            .arguments({
              arg: a.customType({
                field: a.string(),
              }),
            })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('custom operation query has ref to custom type argument', () => {
      const s = a
        .schema({
          post: a.customType({
            field: a.string(),
          }),
          refCustomType: a
            .query()
            .arguments({ arg: a.ref('post') })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('custom operation mutation has inline custom type argument', () => {
      const s = a
        .schema({
          inlineCustomType: a
            .mutation()
            .arguments({
              arg: a.customType({
                field: a.string(),
              }),
            })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('custom operation mutation has ref to custom type argument', () => {
      const s = a
        .schema({
          post: a.customType({
            field: a.string(),
          }),
          refCustomType: a
            .mutation()
            .arguments({ arg: a.ref('post') })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('custom operation mutation with referenced custom type containing enum ref', () => {
      const s = a
        .schema({
          post: a.customType({
            field: a.string(),
            enumField: a.ref('values'),
          }),
          values: a.enum(['VALUE1', 'VALUE2']),
          refCustomType: a
            .mutation()
            .arguments({ arg: a.ref('post') })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('custom operation query with ref to enum', () => {
      const s = a
        .schema({
          options: a.enum(['OPTION1', 'OPTION2']),
          post: a
            .query()
            .arguments({ arg: a.ref('options') })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('custom operation query with inline enum', () => {
      const s = a
        .schema({
          customOperation: a
            .query()
            .arguments({
              arg: a.enum(['PENDING', 'APPROVED', 'REJECTED']),
            })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('custom operation query with enum in inline custom type argument', () => {
      const s = a
        .schema({
          inlineCustomType: a
            .query()
            .arguments({
              arg: a.customType({
                name: a.string(),
                status: a.enum(['ACTIVE', 'INACTIVE']),
              }),
            })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
      expect(result).toContain('enum InlineCustomTypeArgStatus');
      expect(result).toContain('input InlineCustomTypeArgInput');
      expect(result).toContain(
        'inlineCustomType(arg: InlineCustomTypeArgInput): String',
      );
    });

    test('custom operation query with enum in referenced custom type argument', () => {
      const s = a
        .schema({
          post: a.customType({
            name: a.string(),
            status: a.enum(['NEW', 'IN_PROGRESS', 'COMPLETED']),
          }),
          refCustomType: a
            .query()
            .arguments({
              arg: a.ref('post'),
            })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
      expect(result).toContain('enum PostStatus');
      expect(result).toContain('input postInput');
      expect(result).toContain('refCustomType(arg: postInput): String');
    });

    test('custom operation query with ref to nested custom type argument', () => {
      const s = a
        .schema({
          post: a.customType({
            inner: a.customType({
              filter: a.string().required(),
              e1: a.enum(['a', 'b', 'c']),
            }),
          }),
          fcnCall: a
            .query()
            .arguments({
              arg: a.ref('post'),
            })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
      expect(result).toContain('enum PostInnerE1');
      expect(result).toContain('input PostInnerInput');
      expect(result).toContain('input postInput');
      expect(result).toContain('fcnCall(arg: postInput)');
    });

    test('custom operation mutation with multiple references to the same custom type', () => {
      const s = a
        .schema({
          post: a.customType({
            name: a.string(),
            number: a.integer(),
          }),
          refCustomType: a
            .mutation()
            .arguments({
              arg1: a.ref('post'),
              arg2: a.ref('post'),
            })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
      expect(result).toContain('input postInput');
      expect(result).toContain(
        'refCustomType(arg1: postInput, arg2: postInput)',
      );
    });

    test('multiple custom operations referencing the same custom type', () => {
      const s = a
        .schema({
          post: a.customType({
            name: a.string(),
            number: a.integer(),
          }),
          fnCall1: a
            .mutation()
            .arguments({
              arg: a.ref('post'),
            })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
          fnCall2: a
            .mutation()
            .arguments({
              arg: a.ref('post'),
            })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
      expect(result).toContain('input postInput');
      expect(result).toContain('fnCall1(arg: postInput)');
      expect(result).toContain('fnCall2(arg: postInput)');
    });

    test('custom operation with inline custom type containing reference to another custom type', () => {
      const s = a
        .schema({
          post: a.customType({
            name: a.string(),
          }),
          fnCall: a
            .mutation()
            .arguments({
              arg: a.customType({
                name: a.string(),
                status: a.ref('post'),
              }),
            })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
      expect(result).toContain('input postInput');
      expect(result).toContain('input FnCallArgInput');
      expect(result).toContain('fnCall(arg: FnCallArgInput)');
    });

    test('custom operation with ref to custom type with self-referencing field', () => {
      const s = a
        .schema({
          post: a.customType({
            value: a.string(),
            child: a.ref('post'),
          }),

          inlineCustomType: a
            .mutation()
            .arguments({
              arg: a.ref('post'),
            })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
      expect(result).toContain('input postInput');
      expect(result).toContain('inlineCustomType(arg: postInput)');
    });

    test('custom operation with inline custom type referencing self-referential type', () => {
      const s = a
        .schema({
          post: a.customType({
            value: a.string(),
            child: a.ref('post'),
          }),

          inlineCustomType: a
            .mutation()
            .arguments({
              arg: a.customType({
                inner: a.ref('post'),
              }),
            })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
      expect(result).toContain('input postInput');
      expect(result).toContain('input InlineCustomTypeArgInput');
      expect(result).toContain(
        'inlineCustomType(arg: InlineCustomTypeArgInput)',
      );
    });

    test('custom operation with circular references between custom types', () => {
      const s = a
        .schema({
          post: a.customType({
            value: a.string(),
            child: a.ref('update'),
          }),

          update: a.customType({
            title: a.string(),
            field: a.ref('post'),
          }),
          inlineCustomType: a
            .mutation()
            .arguments({
              arg: a.customType({
                inner: a.ref('post'),
              }),
            })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
      expect(result).toContain('input updateInput');
      expect(result).toContain('input postInput');
      expect(result).toContain('input InlineCustomTypeArgInput');
      expect(result).toContain(
        'inlineCustomType(arg: InlineCustomTypeArgInput)',
      );
    });

    test('custom operation subscription has inline custom type argument', () => {
      const s = a
        .schema({
          mutationCustomOps: a
            .mutation()
            .arguments({
              arg: a.string(),
            })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
          inlineCustomTypeSub: a
            .subscription()
            .arguments({
              arg: a.customType({
                field: a.string(),
              }),
            })
            .handler(a.handler.function('myFunc'))
            .for(a.ref('mutationCustomOps')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('custom operation subscription has ref to a custom type argument', () => {
      const s = a
        .schema({
          mutationCustomOps: a
            .mutation()
            .arguments({
              arg: a.string(),
            })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),

          post: a.customType({
            title: a.string(),
          }),

          refCustomTypeSub: a
            .subscription()
            .arguments({
              arg: a.ref('post'),
            })
            .handler(a.handler.function('myFunc'))
            .for(a.ref('mutationCustomOps')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;
      expect(result).toMatchSnapshot();
    });

    test('custom operation subscription referencing an enum', () => {
      const s = a
        .schema({
          mutationCustomOps: a
            .mutation()
            .arguments({
              arg: a.string(),
            })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),

          statusEnum: a.enum(['OPEN', 'CLOSED']),

          enumRefSub: a
            .subscription()
            .arguments({
              arg: a.ref('statusEnum'),
            })
            .handler(a.handler.function('myFunc'))
            .for(a.ref('mutationCustomOps')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;
      expect(result).toMatchSnapshot();
    });

    test('custom operation subscription with nested custom type argument', () => {
      const s = a
        .schema({
          mutationCustomOps: a
            .mutation()
            .arguments({
              arg: a.string(),
            })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),

          nestedType: a.customType({
            post: a.customType({
              inner: a.string(),
            }),
          }),

          nestedSub: a
            .subscription()
            .arguments({
              arg: a.ref('nestedType'),
            })
            .handler(a.handler.function('myFunc'))
            .for(a.ref('mutationCustomOps')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;
      expect(result).toMatchSnapshot();
    });

    test('custom operation subscription with multiple references to the same custom type', () => {
      const s = a
        .schema({
          mutationCustomOps: a
            .mutation()
            .arguments({
              arg: a.string(),
            })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),

          post: a.customType({
            name: a.string(),
          }),

          multiRefSub: a
            .subscription()
            .arguments({
              arg1: a.ref('post'),
              arg2: a.ref('post'),
            })
            .handler(a.handler.function('myFunc'))
            .for(a.ref('mutationCustomOps')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;
      expect(result).toMatchSnapshot();
    });
  });

  describe('input type metadata preservation', () => {
    test('regression: existing simple input types still work correctly', () => {
      const s = a
        .schema({
          post: a.customType({
            title: a.string(),
            content: a.string(),
          }),
          simpleQuery: a
            .query()
            .arguments({
              simpleArg: a.ref('post'),
            })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      // Verify the input type is generated correctly for simple cases
      expect(result).toContain('input postInput');
      expect(result).toContain('simpleArg: postInput');
      
      expect(result).toMatchSnapshot();
    });

    test('should preserve array and required modifiers in input types', () => {
      // Based on the user's real schema that demonstrates the bug
      const s = a
        .schema({
          TodoTagType: a.customType({
            name: a.string().required(),
            color: a.string().required(),
          }),
          Todo: a
            .model({
              content: a.string(),
              tags: a.ref('TodoTagType').array(),
              updatedTs: a.integer(),
            }),
          TodoUpsert: a.customType({
            content: a.string(),
            tags: a.ref('TodoTagType').array(),
            updatedTs: a.integer(),
          }),
          batchUpsertTodos: a
            .mutation()
            .arguments({
              tableName: a.string().required(),
              items: a.ref('TodoUpsert').array().required(),
            })
            .returns(a.ref('Todo').array())
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      // Verify the input types are generated with proper GraphQL syntax
      expect(result).toContain('input TodoTagTypeInput');
      expect(result).toContain('input TodoUpsertInput');
      
      // The key test: verify that array and required modifiers are preserved
      expect(result).toContain('tableName: String!');
      expect(result).toContain('items: [TodoUpsertInput]!'); // Fixed: array is required but elements are not
      
      // Verify nested structure is correct too
      expect(result).toContain('tags: [TodoTagTypeInput]');
      
      expect(result).toMatchSnapshot();
    });

    test('preserves array().required() modifier on referenced custom type arguments', () => {
      const s = a
        .schema({
          TagType: a.customType({
            name: a.string().required(),
            color: a.string().required(),
          }),
          testMutation: a
            .mutation()
            .arguments({
              requiredTags: a.ref('TagType').array().required(), // Array is required, items are optional
              optionalTags: a.ref('TagType').array(),
              singleRequiredTag: a.ref('TagType').required(),
              singleOptionalTag: a.ref('TagType'),
              bothRequired: a.ref('TagType').required().array().required(), // Both array and items required
            })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      // Verify the input type is generated with proper GraphQL syntax
      expect(result).toContain('input TagTypeInput');
      expect(result).toContain('requiredTags: [TagTypeInput]!'); // Array required, items optional
      expect(result).toContain('optionalTags: [TagTypeInput]'); // Both optional
      expect(result).toContain('singleRequiredTag: TagTypeInput!'); // Single item required
      expect(result).toContain('singleOptionalTag: TagTypeInput'); // Single item optional
      expect(result).toContain('bothRequired: [TagTypeInput!]!'); // Both required
      
      expect(result).toMatchSnapshot();
    });

    test('preserves modifiers on nested custom type references', () => {
      const s = a
        .schema({
          InnerType: a.customType({
            value: a.string(),
          }),
          OuterType: a.customType({
            innerItems: a.ref('InnerType').array(),
            singleInner: a.ref('InnerType').required(),
          }),
          testMutation: a
            .mutation()
            .arguments({
              data: a.ref('OuterType').required(),
              dataArray: a.ref('OuterType').array().required(),
            })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      // Verify all input types are generated
      expect(result).toContain('input InnerTypeInput');
      expect(result).toContain('input OuterTypeInput');
      
      // Verify top-level argument modifiers are preserved
      expect(result).toContain('data: OuterTypeInput!');
      expect(result).toContain('dataArray: [OuterTypeInput]!'); // Array required, items optional
      
      // Verify nested field modifiers are preserved
      expect(result).toContain('innerItems: [InnerTypeInput]');
      expect(result).toContain('singleInner: InnerTypeInput!');
      
      expect(result).toMatchSnapshot();
    });

    test('preserves modifiers in complex batch operation scenarios', () => {
      const s = a
        .schema({
          MetadataType: a.customType({
            version: a.string().required(),
            timestamp: a.integer().required(),
          }),
          ItemType: a.customType({
            id: a.string().required(),
            data: a.string(),
            metadata: a.ref('MetadataType').required(),
            tags: a.ref('MetadataType').array(),
          }),
          batchOperation: a
            .mutation()
            .arguments({
              operationId: a.string().required(),
              itemsToCreate: a.ref('ItemType').array().required(),
              itemsToUpdate: a.ref('ItemType').array(),
              metadataOverride: a.ref('MetadataType'),
            })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      // Verify all input types are generated
      expect(result).toContain('input MetadataTypeInput');
      expect(result).toContain('input ItemTypeInput');
      
      // Verify argument modifiers are preserved
      expect(result).toContain('operationId: String!');
      expect(result).toContain('itemsToCreate: [ItemTypeInput]!'); // Array required, items optional
      expect(result).toContain('itemsToUpdate: [ItemTypeInput]');
      expect(result).toContain('metadataOverride: MetadataTypeInput');
      
      // Verify nested field modifiers are preserved
      expect(result).toContain('metadata: MetadataTypeInput!');
      expect(result).toContain('tags: [MetadataTypeInput]');
      
      expect(result).toMatchSnapshot();
    });

    test('preserves modifiers in subscription arguments', () => {
      const s = a
        .schema({
          FilterType: a.customType({
            category: a.string().required(),
            priority: a.integer(),
          }),
          someMutation: a
            .mutation()
            .arguments({ input: a.string() })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
          subscribeToUpdates: a
            .subscription()
            .arguments({
              filters: a.ref('FilterType').array().required(),
              globalFilter: a.ref('FilterType'),
            })
            .handler(a.handler.function('myFunc'))
            .for(a.ref('someMutation')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      // Verify input types are generated
      expect(result).toContain('input FilterTypeInput');
      
      // Verify subscription argument modifiers are preserved
      expect(result).toContain('filters: [FilterTypeInput]!'); // Array required, items optional
      expect(result).toContain('globalFilter: FilterTypeInput');
      
      expect(result).toMatchSnapshot();
    });
  });

  const fakeSecret = () => ({}) as any;

  const datasourceConfigMySQL = {
    engine: 'mysql',
    connectionUri: fakeSecret(),
  } as const;

  describe('sql schema', () => {
    test('Schema w model, custom query, mutation, and subscription', () => {
      const s = configure({ database: datasourceConfigMySQL }).schema({
        Post: a.model({
          title: a.string(),
        }),
      });
      s.addMutations({
        likePost: a
          .mutation()
          .arguments({ postId: a.string() })
          .returns(a.ref('Post'))
          .handler(a.handler.function('myFunc')),
      });
      s.addQueries({
        getLikedPost: a
          .query()
          .returns(a.ref('Post'))
          .handler(a.handler.function('myFunc')),
      });
      s.addSubscriptions({
        onLikePost: a
          .subscription()
          .for(a.ref('likePost'))
          .handler(a.handler.function('myFunc')),
      });
      s.authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('schema.add* will not accept custom operations of incompatible types', () => {
      const s = configure({ database: datasourceConfigMySQL }).schema({
        Post: a.model({
          title: a.string(),
        }),
      });
      s.addMutations({
        // @ts-expect-error
        getLikedPost: a
          .query()
          .returns(a.ref('Post'))
          .handler(a.handler.function('myFunc')),
        // @ts-expect-error
        onCreatePost: a
          .subscription()
          .for(a.ref('Post').mutations(['create']))
          .handler(a.handler.function('myFunc')),
      });
      s.addQueries({
        // @ts-expect-error
        likePost: a
          .mutation()
          .arguments({ postId: a.string() })
          .returns(a.ref('Post'))
          .handler(a.handler.function('myFunc')),
        // @ts-expect-error
        onLikePost: a
          .subscription()
          .for(a.ref('Post').mutations(['update']))
          .handler(a.handler.function('myFunc')),
      });
      s.addSubscriptions({
        // @ts-expect-error
        likePost: a
          .mutation()
          .arguments({ postId: a.string() })
          .returns(a.ref('Post'))
          .handler(a.handler.function('myFunc')),
        // @ts-expect-error
        getLikedPost: a
          .query()
          .returns(a.ref('Post'))
          .handler(a.handler.function('myFunc')),
      });
      s.authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });
  });

  describe('handler function to lambda function mapping', () => {
    const fn1 = defineFunctionStub({});
    const fn2 = defineFunctionStub({});
    const fn3 = defineFunctionStub({});

    const schema = a.schema({
      echo: a
        .query()
        .arguments({
          content: a.string(),
          int: a.integer(),
          description: a.string(),
        })
        .returns(a.ref('SomeCustomType'))
        .handler([a.handler.function(fn1), a.handler.function(fn2)])
        .authorization((allow) => allow.publicApiKey()),
      echoList: a
        .query()
        .arguments({
          content: a.string(),
          int: a.integer(),
          description: a.string(),
        })
        .returns(a.ref('SomeCustomType').required().array().required())
        .handler(a.handler.function(fn3))
        .authorization((allow) => allow.publicApiKey()),
      SomeCustomType: a.customType({
        fieldA: a.string(),
        fieldB: a.integer(),
      }),
    });

    it('generates 3 lambda functions with expected names aside schema', () => {
      const { lambdaFunctions } = schema.transform();

      expect(lambdaFunctions).toMatchObject({
        FnEcho: fn1,
        FnEcho2: fn2,
        FnEchoList: fn3,
      });
    });
  });
});

describe('.for() modifier', () => {
  it('is unavailable on a.query()', () => {
    const schema = a.schema({
      Model: a.customType({ content: a.string() }),
      /// @ts-expect-error .for() is not a valid modifier function of a.query()
      myQuery: a.query().for(a.ref('Model')).returns(a.ref('something')),
    });

    expect(() => schema.transform()).toThrow(
      'The .for() modifier function can only be used with a custom subscription. myQuery is not a custom subscription.',
    );
  });

  it('is unavailable on a.mutation()', () => {
    const schema = a.schema({
      Model: a.customType({ content: a.string() }),
      /// @ts-expect-error .for() is not a valid modifier function of a.mutation()
      myMutation: a.mutation().for(a.ref('Model')).returns(a.ref('something')),
    });

    expect(() => schema.transform()).toThrow(
      'The .for() modifier function can only be used with a custom subscription. myMutation is not a custom subscription.',
    );
  });

  it('is available only on a.subscription()', () => {
    const schema = a.schema({
      Model: a.customType({ content: a.string() }),
      mySubscription: a.subscription().for(a.ref('Model')),
    });

    expect(() => schema.transform()).not.toThrow();
  });
});

describe('custom operations + custom type auth inheritance', () => {
  test('op returns top-level custom type with 1 auth mode', () => {
    const s = a.schema({
      myQuery: a
        .query()
        .handler(a.handler.function('myFn'))
        .returns(a.ref('QueryReturn'))
        .authorization((allow) => allow.publicApiKey()),
      QueryReturn: a.customType({
        fieldA: a.string(),
        fieldB: a.integer(),
      }),
    });

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
    expect(result).toEqual(
      expect.stringContaining('type QueryReturn @aws_api_key'),
    );
  });

  test('op returns top-level custom type with all supported auth modes', () => {
    const s = a.schema({
      myQuery: a
        .query()
        .handler(a.handler.function('myFn'))
        .returns(a.ref('QueryReturn'))
        .authorization((allow) => [
          allow.publicApiKey(),
          allow.authenticated(),
          allow.groups(['admin', 'superAdmin']),
          allow.guest(),
          allow.authenticated('identityPool'),
        ]),
      QueryReturn: a.customType({
        fieldA: a.string(),
        fieldB: a.integer(),
      }),
    });

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
    expect(result).toEqual(
      expect.stringContaining(
        'type QueryReturn @aws_api_key @aws_cognito_user_pools @aws_iam',
      ),
    );
  });

  test('top-level custom type inherits combined auth rules from referencing ops', () => {
    const s = a.schema({
      myQuery: a
        .query()
        .handler(a.handler.function('myFn'))
        .returns(a.ref('QueryReturn'))
        .authorization((allow) => allow.publicApiKey()),
      myMutation: a
        .query()
        .handler(a.handler.function('myFn'))
        .returns(a.ref('QueryReturn'))
        .authorization((allow) => allow.authenticated()),
      QueryReturn: a.customType({
        fieldA: a.string(),
        fieldB: a.integer(),
      }),
    });

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
    expect(result).toEqual(
      expect.stringContaining(
        'type QueryReturn @aws_api_key @aws_cognito_user_pools',
      ),
    );
  });

  test('implicit custom type inherits auth rules from referencing op', () => {
    const s = a.schema({
      myQuery: a
        .query()
        .handler(a.handler.function('myFn'))
        .returns(
          a.customType({
            fieldA: a.string(),
            fieldB: a.integer(),
          }),
        )
        .authorization((allow) => allow.publicApiKey()),
    });

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
    expect(result).toEqual(
      expect.stringContaining('type MyQueryReturnType @aws_api_key'),
    );
  });

  test('nested custom types inherit auth rules from top-level referencing op', () => {
    const s = a.schema({
      myQuery: a
        .query()
        .handler(a.handler.function('myFn'))
        .returns(
          a.customType({
            fieldA: a.string(),
            fieldB: a.integer(),
            nestedCustomType: a.customType({
              nestedA: a.string(),
              nestedB: a.string(),
              grandChild: a.customType({
                grandA: a.string(),
                grandB: a.string(),
              }),
            }),
          }),
        )
        .authorization((allow) => allow.publicApiKey()),
    });

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
    expect(result).toEqual(
      expect.stringContaining('type MyQueryReturnType @aws_api_key'),
    );
    expect(result).toEqual(
      expect.stringContaining(
        'type MyQueryReturnTypeNestedCustomType @aws_api_key',
      ),
    );
    expect(result).toEqual(
      expect.stringContaining(
        'type MyQueryReturnTypeNestedCustomTypeGrandChild @aws_api_key',
      ),
    );
  });

  test('top-level custom type with nested top-level custom types inherits combined auth rules from referencing ops', () => {
    const s = a.schema({
      myQuery: a
        .query()
        .handler(a.handler.function('myFn'))
        .returns(a.ref('QueryReturn'))
        .authorization((allow) => allow.publicApiKey()),
      myMutation: a
        .query()
        .handler(a.handler.function('myFn'))
        .returns(a.ref('QueryReturn'))
        .authorization((allow) => allow.authenticated()),
      QueryReturn: a.customType({
        fieldA: a.string(),
        fieldB: a.integer(),
        nested: a.ref('LevelOne'),
      }),
      LevelOne: a.customType({
        fieldA: a.string(),
        fieldB: a.integer(),
        nested: a.ref('LevelTwo'),
      }),
      LevelTwo: a.customType({
        fieldA: a.string(),
        fieldB: a.integer(),
      }),
    });

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
    expect(result).toEqual(
      expect.stringContaining(
        'type QueryReturn @aws_api_key @aws_cognito_user_pools',
      ),
    );
    expect(result).toEqual(
      expect.stringContaining(
        'type LevelOne @aws_api_key @aws_cognito_user_pools',
      ),
    );
    expect(result).toEqual(
      expect.stringContaining(
        'type LevelTwo @aws_api_key @aws_cognito_user_pools',
      ),
    );
  });

  test('top-level custom type with nested implicit and explicit custom types inherits combined auth rules from referencing ops', () => {
    const s = a.schema({
      myQuery: a
        .query()
        .handler(a.handler.function('myFn'))
        .returns(a.ref('QueryReturn'))
        .authorization((allow) => allow.publicApiKey()),
      myMutation: a
        .query()
        .handler(a.handler.function('myFn'))
        .returns(a.ref('QueryReturn'))
        .authorization((allow) => allow.authenticated()),
      QueryReturn: a.customType({
        fieldA: a.string(),
        fieldB: a.integer(),
        nested: a.customType({
          fieldA: a.string(),
          fieldB: a.integer(),
          nested: a.ref('LevelTwo'),
        }),
      }),
      LevelTwo: a.customType({
        fieldA: a.string(),
        fieldB: a.integer(),
      }),
    });

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
    expect(result).toEqual(
      expect.stringContaining(
        'type QueryReturn @aws_api_key @aws_cognito_user_pools',
      ),
    );
    expect(result).toEqual(
      expect.stringContaining(
        'type QueryReturnNested @aws_api_key @aws_cognito_user_pools',
      ),
    );
    expect(result).toEqual(
      expect.stringContaining(
        'type LevelTwo @aws_api_key @aws_cognito_user_pools',
      ),
    );
  });
});
