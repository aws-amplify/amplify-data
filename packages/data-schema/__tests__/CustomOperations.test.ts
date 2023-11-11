import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { a } from '../index';

// evaluates type defs in corresponding test-d.ts file
it('should not produce static type errors', async () => {
  await expectTypeTestsToPassAsync(__filename);
});

describe('CustomOperation transform', () => {
  test('Schema w model, custom query, mutation, and subscription', () => {
    const s = a.schema({
      Post: a.model({
        title: a.string(),
      }),
      likePost: a
        .mutation()
        .arguments({ postId: a.string() })
        .response(a.ref('Post')),
      getLikedPost: a.query().response(a.ref('Post')),
      onLikePost: a.subscription().response(a.ref('Post')),
    });

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });

  test('Custom Mutation w Auth rules', () => {
    const s = a.schema({
      likePost: a
        .mutation()
        .arguments({ postId: a.string() })
        .response(a.ref('Post'))
        .authorization([a.allow.owner()]),
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
        .response(a.ref('Post')),
    });

    const result = s.transform().schema;

    expect(result).toMatchSnapshot();
  });
});
