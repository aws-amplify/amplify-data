import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
} from '../../utils';

describe('AI Generation Routes', () => {
  // data/resource.ts
  const schema = a.schema({
    Recipe: a.customType({
      directions: a.string(),
    }),

    makeRecipe: a
      .generation({
        aiModel: a.ai.model.claude3Haiku(),
        systemPrompt: 'You are a helpful receipe generator.',
      })
      .arguments({
        ingredients: a.string().array(),
      })
      .returns(a.ref('Recipe')),
  });
  type Schema = ClientSchema<typeof schema>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Generations', () => {
    test('Run a generation', async () => {
      // #region mocking
      const sampleRecipe = {
        directions: 'Air fry bacon. Scramble eggs.',
      };
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            makeRecipe: sampleRecipe,
          },
        },
      ]);
      // simulated amplifyconfiguration.json
      const config = await buildAmplifyConfig(schema);
      // #endregion mocking

      // #region api call
      // App.tsx
      Amplify.configure(config);
      const client = generateClient<Schema>();
      // run generation
      const { data: recipe, errors: makeRecipeErrors } =
        await client.generations.makeRecipe({ ingredients: ['bacon', 'eggs'] });
      // #endregion api call

      // #region assertions
      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(makeRecipeErrors).toBeUndefined();
      expect(recipe).toStrictEqual(sampleRecipe);
      // #endregion assertions
    });
  });
});
