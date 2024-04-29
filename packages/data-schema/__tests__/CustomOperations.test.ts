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
          'Invalid ref. onLikePost is referencing Post which is not defined in the schema',
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
                a.handler.custom({
                  entry: './filename.js',
                  dataSource: 'CommentTable',
                }),
                // @ts-expect-error
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
        .returns(a.ref('NestedCustomTypes'))
        .handler([a.handler.function(fn1), a.handler.function(fn2)])
        .authorization((allow) => allow.publicApiKey()),
      echoList: a
        .query()
        .arguments({
          content: a.string(),
          int: a.integer(),
          description: a.string(),
        })
        .returns(a.ref('NestedCustomTypes').required().array().required())
        .handler(a.handler.function(fn3))
        .authorization((allow) => allow.publicApiKey()),
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
      myQuery: a.query().for(a.ref('Model')),
    });

    expect(() => schema.transform()).toThrow(
      'The .for() modifier function can only be used with a custom subscription. myQuery is not a custom subscription.',
    );
  });

  it('is unavailable on a.mutation()', () => {
    const schema = a.schema({
      Model: a.customType({ content: a.string() }),
      /// @ts-expect-error .for() is not a valid modifier function of a.mutation()
      myMutation: a.mutation().for(a.ref('Model')),
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
