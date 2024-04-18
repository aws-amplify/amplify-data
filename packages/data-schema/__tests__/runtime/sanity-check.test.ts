import { a, ClientSchema } from '../../src/index';

describe('a', () => {
  test('b', async () => {
    const schema = a.schema({
      Model: a
        .model({
          field: a.string(),
        })
        .authorization((allow) => [allow.publicApiKey()]),
    });
    type Schema = ClientSchema<typeof schema>;
  });
});
