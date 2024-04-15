import { a, ClientSchema } from '@aws-amplify/data-schema';
import { buildAmplifyConfig } from '../../utils';

describe('getting started guides', () => {
  test('Todo schema', async () => {
    // https://docs.amplify.aws/gen2/start/quickstart/nextjs-app-router-client-components/

    // #region docs code
    // data/resource.ts
    const schema = a.schema({
      Todo: a
        .model({
          content: a.string(),
          done: a.boolean(),
          priority: a.enum(['low', 'medium', 'high']),
        })
        .authorization((allow) => [
          allow.owner(),
          allow.publicApiKey().to(['read']),
        ]),
    });
    type Schema = ClientSchema<typeof schema>;

    // TODO: can we include the documented defineData call + snapshot test
    // without creating dep conflicts?

    // #endregion docs code

    // assert
    // backend generation of amplify config
    const amplifyconfigurationJson = await buildAmplifyConfig(schema);
    expect(amplifyconfigurationJson).toMatchSnapshot();
  });
});
