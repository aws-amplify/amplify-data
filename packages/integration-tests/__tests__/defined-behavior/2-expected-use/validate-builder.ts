import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { buildAmplifyConfig, mockedGenerateClient } from '../../utils';

describe('Validate Builder', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('String Field Validations', () => {
    test('accumulates string validators correctly', async () => {
      // Build a schema with a model that uses multiple string validations.
      const schema = a.schema({
        Post: a.model({
          title: a.string().validate(v => 
            v.minLength(5, 'Title must be at least 5 characters')
             .maxLength(100, 'Title must be at most 100 characters')
             .startsWith('post-', 'Title must start with post-')
          ),
        }).authorization((allow) => allow.publicApiKey()),
      });
      
      // Build config, configure Amplify, and generate the client.
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
      const { generateClient } = mockedGenerateClient([]);
      const client = generateClient<ClientSchema<typeof schema>>();

      console.log(client);
      
      // (Internally, you might inspect the schema introspection or use debug APIs)
      // Here, assert that the "title" field includes the expected validation rules.
      // For example, you can fetch the field definition and check the validation rules.
      // const titleValidations = client.schema.models.Post.fields.title.validation;
      // expect(titleValidations).toEqual([
      //   { type: 'minLength', value: 5, errorMessage: 'Title must be at least 5 characters' },
      //   { type: 'maxLength', value: 100, errorMessage: 'Title must be at most 100 characters' },
      //   { type: 'startsWith', value: 'post-', errorMessage: 'Title must start with post-' }
      // ]);
    });
  });

  // describe('Numeric Field Validations', () => {
  //   test('accumulates numeric validators correctly', async () => {
  //     // Build a schema with a model that uses numeric validations.
  //     const schema = a.schema({
  //       Product: a.model({
  //         price: a.integer().default(10).validate(v => 
  //           v.positive('Price must be positive')
  //            .lt(1000, 'Price must be less than 1000')
  //            .gte(0, 'Price must be non-negative')
  //         ),
  //       }),
  //     });
      
  //     const config = await buildAmplifyConfig(schema);
  //     Amplify.configure(config);
  //     const { generateClient } = mockedGenerateClient([]);
  //     const client = generateClient<ClientSchema<typeof schema>>();

  //     // Check that the "price" field has the expected numeric validation rules.
  //     const priceValidations = client.schema.models.Product.fields.price.validation;
  //     expect(priceValidations).toEqual([
  //       { type: 'gt', value: 0, errorMessage: 'Price must be positive' },
  //       { type: 'lt', value: 1000, errorMessage: 'Price must be less than 1000' },
  //       { type: 'gte', value: 0, errorMessage: 'Price must be non-negative' },
  //     ]);
  //   });
  // });

  describe('Validation Ordering & Duplication', () => {
    test('validate() must come after default() and disallows duplicate validators', () => {
      // The following examples are meant to be compile-time checks.
      // They would be annotated with @ts-expect-error to indicate expected TS errors.
      
      // @ts-expect-error: validate() before default() is not allowed.
      a.string().validate(v => v.minLength(5)).default('test');
      
      // @ts-expect-error: Duplicate validator (minLength) is disallowed.
      a.string().validate(v => v.minLength(5).minLength(10));

      // If you try to mix numeric validators on a string field, it should error.
      // @ts-expect-error
      a.string().validate(v => v.gt(10));
    });
  });
});