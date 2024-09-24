import { a, ClientSchema } from '@aws-amplify/data-schema';
import { buildAmplifyConfig } from '../../../utils';

describe('Get Started', () => {
  // https://docs.amplify.aws/react/start/manual-installation/
  describe('Manual Installation', () => {
    describe('Manual Setup', () => {
      test.skip('new, sample schema compiles without failures', async () => {
        // TODO
        // #region covers HASH-TO_COME
        // current example is an empty schema, which does NOT work.
        // @ts-ignore
        const schema = a.schema({});
        type Schema = ClientSchema<typeof schema>;
        const amplifyconfigurationJson = await buildAmplifyConfig(schema);
        expect(amplifyconfigurationJson).toMatchSnapshot();
        // #endregion
      });
    });
  });
});
