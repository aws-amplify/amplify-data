import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { Expect, Equal } from '@aws-amplify/data-schema-types';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
  expectGraphqlMatches,
} from '../../utils';

describe('Custom data model identifiers', () => {
  // https://docs.amplify.aws/react/build-a-backend/data/data-modeling/identifiers/

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Single-field identifier', () => {
    // #region covers d619a12c5b9f68b2
    const schema = a.schema({
      Todo: a
        .model({
          todoId: a.id().required(),
          content: a.string(),
          completed: a.boolean(),
        })
        .identifier(['todoId'])
        .authorization((allow) => [allow.publicApiKey()]),
    });
    // #endregion

    type Schema = ClientSchema<typeof schema>;

    describe('types', () => {
      test('custom identifier is surfaced in the type ', () => {
        type _ExpectedCreateInput = Expect<
          Equal<Schema['Todo']['identifier'], { todoId: string }>
        >;
      });
    });

    describe('client runtime', () => {
      test(`can create the record using the custom id`, async () => {
        const { spy, generateClient } = mockedGenerateClient([
          {
            data: {
              createTodo: {
                todoId: 'MyUniqueTodoId',
                content: 'Buy Milk',
                completed: false,
              },
            },
          },
        ]);
        const config = await buildAmplifyConfig(schema);
        Amplify.configure(config);

        // #region covers 6ffb6c45060a39f9
        const client = generateClient<Schema>();

        const { data: todo, errors } = await client.models.Todo.create({
          todoId: 'MyUniqueTodoId',
          content: 'Buy Milk',
          completed: false,
        });

        // TODO: fix missing non-null assertion on docs site
        // https://docs.amplify.aws/react/build-a-backend/data/data-modeling/identifiers/#single-field-identifier
        console.log(`New Todo created: ${todo!.todoId}`); // New Todo created: MyUniqueTodoId
        // #endregion

        expect(todo).toEqual(
          expect.objectContaining({
            todoId: 'MyUniqueTodoId',
            content: 'Buy Milk',
            completed: false,
          }),
        );
      });
    });
  });

  describe('Composite identifier', () => {
    // #region covers dc84893fe413f132
    const schema = a.schema({
      StoreBranch: a
        .model({
          geoId: a.id().required(),
          name: a.string().required(),
          country: a.string(),
          state: a.string(),
          city: a.string(),
          zipCode: a.string(),
          streetAddress: a.string(),
        })
        .identifier(['geoId', 'name'])
        .authorization((allow) => [allow.publicApiKey()]),
    });
    // #endregion

    type Schema = ClientSchema<typeof schema>;

    describe('types', () => {
      test('custom identifier is surfaced in the type ', () => {
        type _ExpectedCreateInput = Expect<
          Equal<
            Schema['StoreBranch']['identifier'],
            {
              geoId: string;
              name: string;
            }
          >
        >;
      });
    });

    describe('client runtime', () => {
      test(`can create the record using the custom id`, async () => {
        const { spy, generateClient } = mockedGenerateClient([
          {
            data: {
              createStoreBranch: {
                geoId: '123',
                name: 'Downtown',
                // etc.
              },
            },
          },
        ]);
        const config = await buildAmplifyConfig(schema);
        Amplify.configure(config);

        // #region covers 7a1fb3aa2c192ea3
        const client = generateClient<Schema>();

        const { data: branch } = await client.models.StoreBranch.get({
          geoId: '123',
          name: 'Downtown',
        }); // All identifier fields are required when retrieving an item
        // #endregion

        expect(branch).toEqual(
          expect.objectContaining({
            geoId: '123',
            name: 'Downtown',
            // etc.
          }),
        );
      });
    });
  });
});
