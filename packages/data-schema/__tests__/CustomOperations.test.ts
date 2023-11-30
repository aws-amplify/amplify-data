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
          .returns(a.ref('Post')),
        getLikedPost: a.query().returns(a.ref('Post')),
        onLikePost: a.subscription().returns(a.ref('Post')),
      })
      .authorization([a.allow.public()]);

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Custom Mutation w Auth rules', () => {
    const s = a.schema({
      likePost: a
        .mutation()
        .arguments({ postId: a.string() })
        .returns(a.ref('Post'))
        .authorization([a.allow.private()]),
    });

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
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
        .function('myFunc'),
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
            field: a.string(),
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
            field: a.string(),
          }),
        ),
    });

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });
});
