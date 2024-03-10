import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { a } from '../index';
import { configure } from '../src/internals';
import { defineFunctionStub } from './utils';

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
          onLikePost: a
            .subscription()
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
          onLikePost: a
            .subscription()
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

      test('a.handler.function works', () => {
        const fn1 = defineFunctionStub({});

        const s = a.schema({
          getPostDetails: a
            .query()
            .arguments({})
            .handler(a.handler.function(fn1))
            .authorization([a.allow.private()])
            .returns(a.customType({})),
        });

        const result = s.transform().schema;

        expect(result).toMatchSnapshot();
      });
      test('a.handler.inlineSql works', () => {
        // TODO: This shouldn't work on a DDB schema
        const s = a.schema({
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
      test('a.handler.sqlReference works', () => {
        // TODO: This shouldn't work on a DDB schema
        const s = a.schema({
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
        onLikePost: a
          .subscription()
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
});
