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
    test('a.handler.custom works', () => {
      const s = a.schema({
        getPostDetails: a
          .query()
          .arguments({})
          .handler(a.handler.custom('filename.js'))
          .returns(a.customType({})),
      });

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });
    test('a.handler.function works', () => {
      const s = a.schema({
        getPostDetails: a
          .query()
          .arguments({})
          .handler(a.handler.function(() => {}))
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
          .returns(a.customType({})),
      });

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });
    test('a.handler.sqlReference works', () => {
      // TODO: This shouldn't work on a DDB schema
      const s = a.schema({
        getPostDetails: a
          .query()
          .arguments({})
          .handler(a.handler.sqlReference('testQueryName'))
          .returns(a.customType({})),
      });

      const result = s.transform().schema;

      expect(result).toMatchSnapshot();
    });
  });
});
