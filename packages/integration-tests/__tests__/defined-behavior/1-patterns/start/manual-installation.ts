import { a, ClientSchema } from '@aws-amplify/data-schema';
import { buildAmplifyConfig } from '../../../utils';

describe('Get Started', () => {
  // https://docs.amplify.aws/react/start/manual-installation/
  describe('Manual Installation', () => {
    describe('Manual Setup', () => {
      test('new, sample schema compiles without failures', async () => {
        // #region covers b497a376ca20c1f5
        // Note: A schema cannot be empty.
        const schema = a.schema({
          Todo: a
            .model({
              content: a.string(),
              isDone: a.boolean(),
            })
            .authorization((allow) => [allow.publicApiKey()]),
        });
        type Schema = ClientSchema<typeof schema>;
        // #endregion

        const amplifyconfigurationJson = await buildAmplifyConfig(schema);
        expect(amplifyconfigurationJson).toMatchSnapshot();
      });
    });
  });
});
