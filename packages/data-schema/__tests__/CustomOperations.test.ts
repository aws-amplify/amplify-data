import { a } from '../index';

describe('CustomOperation transform', () => {
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
        onLikePost: a.subscription().returns(a.ref('Post')).function('myFunc'),
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
              a.handler.function(() => {}),
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
      const s = a.schema({
        getPostDetails: a
          .query()
          .arguments({})
          .handler(a.handler.function(() => {}))
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
