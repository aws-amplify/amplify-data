import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { a } from '../index';
import { configure } from '../src/internals';
import { defineFunctionStub } from './utils';

const fakeSecret = () => ({}) as any;

const datasourceConfigMySQL = {
  engine: 'mysql',
  hostname: fakeSecret(),
  username: fakeSecret(),
  password: fakeSecret(),
  port: fakeSecret(),
  databaseName: fakeSecret(),
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
            .returns(a.ref('Post'))
            .handler(a.handler.function('myFunc')),
        })
        .authorization([a.allow.public()]);

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
            .returns(a.ref('Post'))
            .handler(a.handler.function('myFunc')),
        })
        .authorization([a.allow.public()]);

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
            .returns(a.ref('PostCustomType'))
            .handler(a.handler.function('myFunc')),
        })
        .authorization([a.allow.public()]);

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('Custom Mutation w Auth rules and no handler should throw', () => {
      const s = a.schema({
        likePost: a
          .mutation()
          .arguments({ postId: a.string() })
          .returns(a.ref('Post'))
          .authorization([a.allow.private()]),
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
          .authorization([a.allow.private()]),
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
          .authorization([a.allow.private()]),
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
              .returns(a.ref('Post'))
              .handler(a.handler.function('myFunc')),
          })
          .authorization([a.allow.public()]);

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
              .returns(a.ref('Post'))
              .handler(a.handler.function('myFunc')),
          })
          .authorization([a.allow.public()]);

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
              .returns(a.ref('Post'))
              .handler(a.handler.function('myFunc')),
          })
          .authorization([a.allow.public()]);

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
              .returns(a.ref('Post'))
              .handler(a.handler.function('myFunc')),
          })
          .authorization([a.allow.public()]);

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
              .returns(a.ref('Post'))
              .handler(a.handler.function('myFunc')),
          })
          .authorization([a.allow.public()]);

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
              .returns(a.ref('Post'))
              .handler(a.handler.function('myFunc')),
          })
          .authorization([a.allow.public()]);

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

            onLikePost: a
              .subscription()
              .returns(a.ref('Post'))
              .handler(a.handler.function('myFunc')),
          })
          .authorization([a.allow.public()]);

        expect(() => s.transform()).toThrow('is missing a mutation source');
      });

      test(`Custom subscription referencing nonexistent type throws`, () => {
        const s = a
          .schema({
            onLikePost: a
              .subscription()
              .for(a.ref('Post').mutations(['create']))
              .returns(a.ref('Post'))
              .handler(a.handler.function('myFunc')),
          })
          .authorization([a.allow.public()]);

        expect(() => s.transform()).toThrow(
          'Invalid ref. onLikePost is referencing Post which is not defined in the schema',
        );
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
              .authorization([a.allow.public()]),
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
              .authorization([a.allow.public()])
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
              .authorization([a.allow.specificGroups(['groupA', 'groupB'])])
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
            .authorization([a.allow.public()]);

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
              .authorization([a.allow.private()]),
            customQuery: a
              .query()
              .returns(a.string())
              .handler([
                a.handler.custom({
                  entry: './filename.js',
                  dataSource: a.ref('Post'),
                }),
              ])
              .authorization([
                a.allow.private(),
                a.allow.specificGroups(['groupA', 'groupB']),
              ]),
          });

          const { schema } = s.transform();

          expect(schema).toMatchSnapshot();
        });

        test('unsupported auth modes throw', () => {
          const s = a.schema({
            customQuery: a
              .query()
              .handler([
                a.handler.custom({
                  entry: './filename.js',
                  dataSource: 'CommentTable',
                }),
              ])
              .authorization([a.allow.owner()]),
          });

          expect(() => s.transform()).toThrow(
            'Dynamic auth (owner or dynamic groups) is not supported',
          );

          const s2 = a.schema({
            customQuery: a
              .query()
              .handler([
                a.handler.custom({
                  entry: './filename.js',
                  dataSource: 'CommentTable',
                }),
              ])
              .authorization([a.allow.private().to(['read'])]),
          });

          expect(() => s2.transform()).toThrow(
            '.to() modifier is not supported for custom queries/mutations',
          );

          const s3 = a.schema({
            customQuery: a
              .query()
              .handler([
                a.handler.custom({
                  entry: './filename.js',
                  dataSource: 'CommentTable',
                }),
              ])
              .authorization([a.allow.specificGroups(['group1'], 'oidc')]),
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
              .authorization([a.allow.private()])
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
              .authorization([a.allow.private()])
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
              .authorization([a.allow.private()])
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
              .authorization([a.allow.private()])
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
            .authorization([a.allow.private()])
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
            .authorization([a.allow.private()])
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
            .handler(a.handler.sqlReference('testQueryName'))
            .authorization([a.allow.private()])
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
    hostname: fakeSecret(),
    username: fakeSecret(),
    password: fakeSecret(),
    port: fakeSecret(),
    databaseName: fakeSecret(),
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
          .returns(a.ref('Post'))
          .handler(a.handler.function('myFunc')),
      });
      s.authorization([a.allow.public()]);

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
          .returns(a.ref('Post'))
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
          .returns(a.ref('Post'))
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
      s.authorization([a.allow.public()]);

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });
  });

  // Ensure deprecated .function functionality is intact
  // TODO: delete after removing the .function modifier (by GA)
  describe('deprecated .function', () => {
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
            .function('myFunc'),
          getLikedPost: a.query().returns(a.ref('Post')).function('myFunc'),
          onLikePost: a
            .subscription()
            .for(a.ref('likePost'))
            .returns(a.ref('Post'))
            .function('myFunc'),
        })
        .authorization([a.allow.public()]);

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
            .function('myFunc'),
          getLikedPost: a
            .query()
            .returns(a.ref('Post').array())
            .function('myFunc'),
          onLikePost: a
            .subscription()
            .for(a.ref('listPosts'))
            .returns(a.ref('Post'))
            .function('myFunc'),
        })
        .authorization([a.allow.public()]);

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
            .function('myFunc'),
          getLikedPost: a
            .query()
            .returns(a.ref('PostCustomType').array())
            .function('myFunc'),
          onLikePost: a
            .subscription()
            .for(a.ref('listPosts'))
            .returns(a.ref('PostCustomType'))
            .function('myFunc'),
        })
        .authorization([a.allow.public()]);

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });

    test('Custom Mutation w Auth rules and no handler should throw', () => {
      const s = a.schema({
        likePost: a
          .mutation()
          .arguments({ postId: a.string() })
          .returns(a.ref('Post'))
          .authorization([a.allow.private()]),
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
          .function('myFunc'),
      });

      expect(() => s.transform()).toThrow(
        'requires both an authorization rule and a handler reference',
      );
    });

    test('Custom Mutation w string function reference', () => {
      const s = a.schema({
        likePost: a
          .mutation()
          .arguments({
            postId: a.string().required(),
          })
          .returns(a.ref('Post'))
          .function('myFunc')
          .authorization([a.allow.private()]),
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
          .function('myFunc')
          .authorization([a.allow.private()]),
      });

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });
  });
});
