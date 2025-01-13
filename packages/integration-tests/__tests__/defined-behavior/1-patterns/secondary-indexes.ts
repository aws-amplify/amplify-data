import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import { Expect, Equal } from '@aws-amplify/data-schema-types';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
  expectGraphqlMatches,
} from '../../utils';

describe('Custom secondary indexes', () => {
  // https://docs.amplify.aws/react/build-a-backend/data/data-modeling/secondary-index/

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('main example', () => {
    // #region covers 22ba8c0684be1400
    const schema = a.schema({
      Customer: a
        .model({
          name: a.string(),
          phoneNumber: a.phone(),
          accountRepresentativeId: a.id().required(),
        })
        .secondaryIndexes((index) => [index('accountRepresentativeId')])
        .authorization((allow) => [allow.publicApiKey()]),
    });
    // #endregion

    type Schema = ClientSchema<typeof schema>;

    test(`can retrieve records using the custom index`, async () => {
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            listCustomerByAccountRepresentativeId: {
              items: [
                {
                  name: 'name value',
                  phoneNumber: '555-555-5555',
                  accountRepresentativeId: 'one',
                },
              ],
            },
          },
        },
        {
          data: null,
          errors: [
            {
            path: null,
            locations: []
            } as any
          ]
          },
      ]);
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);

      // #region covers 00052f6a61b4a992
      const client = generateClient<Schema>();

      const { data, errors } =
        await client.models.Customer.listCustomerByAccountRepresentativeId({
          accountRepresentativeId: 'YOUR_REP_ID',
        });

      // #endregion

      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(data).toEqual(
        expect.objectContaining([
          {
            name: 'name value',
            phoneNumber: '555-555-5555',
            accountRepresentativeId: 'one',
          },
        ]),
      );

      // Ensuring `data: null` does not throw exception
      // https://github.com/aws-amplify/amplify-js/issues/13941
      expect(async () => {
        const { data: nullDataResponse, errors: nullDataError } =
          await client.models.Customer.listCustomerByAccountRepresentativeId({
            accountRepresentativeId: 'YOUR_REP_ID',
          });
      }).not.toThrow();
    });
  });

  describe('Add sort keys to secondary indexes', () => {
    // #region covers 956e34083f456707
    const schema = a.schema({
      Customer: a
        .model({
          name: a.string(),
          phoneNumber: a.phone(),
          accountRepresentativeId: a.id().required(),
        })
        .secondaryIndexes((index) => [
          index('accountRepresentativeId').sortKeys(['name']),
        ])
        .authorization((allow) => [allow.owner()]),
    });
    // #endregion

    type Schema = ClientSchema<typeof schema>;

    test(`can retrieve records using the custom index`, async () => {
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            listCustomerByAccountRepresentativeIdAndName: {
              items: [
                {
                  name: `Rene's name`,
                  phoneNumber: '555-555-5555',
                  accountRepresentativeId: 'one',
                },
              ],
            },
          },
        },
      ]);
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);

      // #region covers d839094b3650525c
      const client = generateClient<Schema>();

      const { data, errors } =
        await client.models.Customer.listCustomerByAccountRepresentativeIdAndName(
          {
            accountRepresentativeId: 'YOUR_REP_ID',
            name: {
              beginsWith: 'Rene',
            },
          },
        );

      // #endregion

      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(data).toEqual(
        expect.objectContaining([
          {
            name: `Rene's name`,
            phoneNumber: '555-555-5555',
            accountRepresentativeId: 'one',
          },
        ]),
      );
    });
  });

  describe('Customize the query field for secondary indexes', () => {
    // #region covers 1b750f5a650f2978
    const schema = a.schema({
      Customer: a
        .model({
          name: a.string(),
          phoneNumber: a.phone(),
          accountRepresentativeId: a.id().required(),
        })
        .secondaryIndexes((index) => [
          index('accountRepresentativeId').queryField('listByRep'),
        ])
        .authorization((allow) => [allow.owner()]),
    });

    // #endregion

    type Schema = ClientSchema<typeof schema>;

    test(`can retrieve records using the custom index`, async () => {
      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            listCustomerByAccountRepresentativeIdAndName: {
              items: [
                {
                  name: `Rene's name`,
                  phoneNumber: '555-555-5555',
                  accountRepresentativeId: 'one',
                },
              ],
            },
          },
        },
      ]);
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);

      // #region covers 4df128e1af50d457
      const client = generateClient<Schema>();

      const { data, errors } = await client.models.Customer.listByRep({
        accountRepresentativeId: 'YOUR_REP_ID',
      });
      // #endregion

      expect(optionsAndHeaders(spy)).toMatchSnapshot();
      expect(data).toEqual(
        expect.objectContaining([
          {
            name: `Rene's name`,
            phoneNumber: '555-555-5555',
            accountRepresentativeId: 'one',
          },
        ]),
      );
    });
  });

  describe('Customize the name of secondary indexes', () => {
    test(`generated graphql schema uses the provided name`, async () => {
      // #region covers 295dee0505f4abd0
      const schema = a.schema({
        Customer: a
          .model({
            name: a.string(),
            phoneNumber: a.phone(),
            accountRepresentativeId: a.id().required(),
          })
          .secondaryIndexes((index) => [
            index('accountRepresentativeId').name('MyCustomIndexName'),
          ])
          .authorization((allow) => [allow.owner()]),
      });

      expectGraphqlMatches(
        schema.transform().schema,
        `type Customer @model @auth(rules: [{allow: owner, ownerField: "owner"}])
        {
          name: String
          phoneNumber: AWSPhone
          accountRepresentativeId: ID! @index(name: "MyCustomIndexName", queryField: "listCustomerByAccountRepresentativeId")
        }`,
      );
      // #endregion
    });
  });
});
