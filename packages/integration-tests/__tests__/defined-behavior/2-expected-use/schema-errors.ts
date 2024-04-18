import { a } from '@aws-amplify/data-schema';

/**
 * Things we expect customers might try that are invalid and should throw.
 */
describe('validated on execution', () => {
  test('Throws on missing auth', async () => {
    const schema = a.schema({
      Todo: a.model({
        content: a.string(),
      }),
    });

    expect(schema.transform).toThrow('missing authorization rules');
  });

  /**
   * Example of a test for a feature request.
   *
   * E.g., if a customer bypasses the TS errors in any way.
   */
  test.skip('Throws in identifier naming a non-required field', async () => {
    const schema = a.schema({
      Todo: a
        .model({
          content: a.string(),
        })
        .authorization((allow) => allow.publicApiKey())
        // @ts-ignore
        .identifier(['content']),
    });

    expect(schema.transform).toThrow('Invalid identifier');
  });
});

describe('static (type) validation', () => {
  test('type error on identifier naming a non-required field', () => {
    const schema = a.schema({
      Todo: a
        .model({
          content: a.string(),
        })
        // @ts-expect-error
        .identifier(['content']),
    });
  });
});
