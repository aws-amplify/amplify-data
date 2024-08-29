import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { buildAmplifyConfig, mockedGenerateClient } from '../../utils';

describe('AI Generation Routes', () => {
  // data/resource.ts
  const schema = a.schema({
    Recipe: a.customType({
      directions: a.string(),
    }),

    makeRecipe: a
      .generation({
        aiModel: a.aiModel.anthropic.claude3Haiku(),
        systemPrompt: 'You are a helpful receipe generator.',
      })
      .arguments({
        ingredients: a.string().array(),
      })
      .returns(a.ref('Recipe')),
  });
  type Schema = ClientSchema<typeof schema>;

  beforeEach(async () => {
    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(`['GenerationName']`, () => {
    describe(`['type']`, () => {
      test(`matches result 'data' property`, async () => {
        const { generateClient } = mockedGenerateClient([{ data: null }]);
        const client = generateClient<Schema>();

        // The `makeRecipe` type can be taken from the `Schema`, which can then be
        // used to "type" a variable and receive the `data` from a `create`()`
        type MakeRecipeArgs = Schema['makeRecipe']['args'];
        type MakeRecipeReturnType = Schema['makeRecipe']['returnType'];

        const args: MakeRecipeArgs = { ingredients: ['bacon', 'eggs'] };
        // @ts-expect-error
        const badArgs: MakeRecipeArgs = { ingredients: 'toothpaste' };

        const result = await client.generations.makeRecipe(args);
        const _recipe: MakeRecipeReturnType = result.data!;
      });
    });
  });
});
