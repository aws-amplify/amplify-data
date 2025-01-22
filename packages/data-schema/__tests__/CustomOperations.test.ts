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
    test('Schema with custom query using custom type argument', () => {
      const s = a
        .schema({
          CustomArgType: a.customType({
            field: a.string(),
          }),
          queryWithCustomTypeArg: a
            .query()
            .arguments({ customArg: a.ref('CustomArgType') })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('Schema with custom query using ref argument', () => {
      const s = a
        .schema({
          RefArgType: a.customType({
            field: a.string(),
          }),
          queryWithRefArg: a
            .query()
            .arguments({ refArg: a.ref('RefArgType') })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('Schema with custom mutation using custom type argument', () => {
      const s = a
        .schema({
          CustomArgType: a.customType({
            field: a.string(),
          }),
          mutateWithCustomTypeArg: a
            .mutation()
            .arguments({ customArg: a.ref('CustomArgType') })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('Schema with custom mutation using ref argument', () => {
      const s = a
        .schema({
          RefArgType: a.customType({
            field: a.string(),
          }),
          mutationWithRefArg: a
            .mutation()
            .arguments({ refArg: a.ref('RefArgType') })
            .returns(a.string())
            .handler(a.handler.function('myFunc')),
        })
        .authorization((allow) => allow.publicApiKey());

      const result = s.transform().schema;

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
        'type QueryReturn @aws_api_key @aws_cognito_user_pools @aws_cognito_user_pools(cognito_groups: ["admin", "superAdmin"]) @aws_iam',
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
