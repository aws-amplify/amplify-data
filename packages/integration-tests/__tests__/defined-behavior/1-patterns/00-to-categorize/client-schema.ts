import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { buildAmplifyConfig, mockedGenerateClient } from '../../../utils';

describe('ClientSchema', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(`['ModelName']`, () => {
    describe(`['type']`, () => {
      const schema = a
        .schema({
          Post: a.model({
            title: a.string().required(),
            body: a.string().required(),
          }),
        })
        .authorization((allow) => [allow.publicApiKey()]);
      type Schema = ClientSchema<typeof schema>;

      beforeEach(async () => {
        const config = await buildAmplifyConfig(schema);
        Amplify.configure(config);
      });

      test(`matches scalar results`, async () => {
        const { generateClient } = mockedGenerateClient([{ data: null }]);
        const client = generateClient<Schema>();

        // We can grab the `Post` type from the Schema like this:
        type Post = Schema['Post']['type'];

        // We can perform scalar operations against client models as usual:
        const result = await client.models.Post.get({ id: 'abc' });

        // And then use the `Post` type to receive result data. Notably, graphql
        // scalar result data is always nullable. So we non-null assert (!) here.
        const _post: Post = result.data!;
      });

      test(`matches list-like results`, async () => {
        const { generateClient } = mockedGenerateClient([
          { data: { listPosts: [] } },
        ]);
        const client = generateClient<Schema>();

        // We can grab the `Post` type from the Schema like this:
        type Post = Schema['Post']['type'];

        // We can perform list-like operations against client models as usual:
        const result = await client.models.Post.list();

        // And then use the `Post` type to receive result data.
        const _posts: Post[] = result.data;
      });
    });
  });

  describe(`['CustomOperationName']`, () => {
    const schema = a.schema({
      myQuery: a
        .query()
        .arguments({
          input: a.string(),
        })
        .returns(
          a.customType({
            output: a.string(),
          }),
        ),
    });
    type Schema = ClientSchema<typeof schema>;

    /**
     * Just used to create a client with the correct type signature that will
     * not throw an error upon invocation. Not for checking runtime behavior.
     */
    async function getMockClient() {
      const { spy, generateClient } = mockedGenerateClient([{ data: null }]);
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const client = generateClient<Schema>();
      return client;
    }

    test(`['returnType'] matches the operation return type`, async () => {
      const client = await getMockClient();

      // We can grab the args and return types from the schema
      type myQueryArgs = Schema['myQuery']['args'];
      type myQueryResult = Schema['myQuery']['returnType'];

      // We can create strongly typed arguments ahead of time:
      const args: myQueryArgs = {
        // ctrl + space in VS Code auto-suggests `input: ...`
        input: 'some string',
      };

      // Our custom operation accepts the pre-built, typed args
      const result = await client.queries.myQuery(args);

      // And we can then use the return type for variables, useStates, etc.
      const out: myQueryResult = result.data;
    });

    test(`['functionHandler'] can be used add typing to lambda handlers`, async () => {
      // We can grab the full handler type from the Schema:
      type myQueryHandler = Schema['myQuery']['functionHandler'];

      // For demonstration, we'll also grab the args and return types:
      type myQueryArgs = Schema['myQuery']['args'];
      type myQueryResult = Schema['myQuery']['returnType'];

      // We can then define a function handler, which will normally will be defined
      // in your `amplify/` folder, and we can add our `myQueryHandler` type:
      const handler: myQueryHandler = async (event, context) => {
        // The `event` arg is now fully typed. And `event.arguments` will match
        // the `args` type from the custom operation.
        const args: myQueryArgs = event.arguments;

        // We can build our result using the result type:
        const result: myQueryResult = {
          // ctrl + space in VS Code auto-suggests `output: ...`
          output: 'some output',
        };

        // And we can return `result`, which matches the output demanded by
        // the function signature.
        return result;
      };
    });
  });
});
