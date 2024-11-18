import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import type {
  SelectionSet,
  Expect,
  Equal,
} from '@aws-amplify/data-schema-types';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
  useState,
  expectGraphqlMatches,
  expectSelectionSetEquals,
} from '../../utils';

describe('custom type', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('with cycles as refs between custom types definitions', () => {
    const schema = a.schema({
      SomeModel: a
        .model({
          modelName: a.string(),
          company: a.ref('Company'),
        })
        .authorization((allow) => [allow.publicApiKey()]),
      Tenant: a.customType({
        tenantName: a.string(),
        company: a.ref('Company'),
      }),
      Company: a.customType({
        companyName: a.string(),
        tenants: a.ref('Tenant').array(),
      }),
      listByModelName: a
        .query()
        .arguments({
          someModelName: a.string().required(),
        })
        .returns(a.ref('Company').array())
        .authorization((allow) => allow.guest())
        .handler(a.handler.function('something')),
    });

    type Schema = ClientSchema<typeof schema>;

    beforeEach(async () => {
      const config = await buildAmplifyConfig(schema);
      Amplify.configure(config);
    });

    test('successfully produces a valid graphql schema', async () => {
      expectGraphqlMatches(
        schema.transform().schema,
        `
          type SomeModel @model @auth(rules: [{allow: public, provider: apiKey}])
          {
            modelName: String
            company: Company
          }
          
          type Tenant @aws_iam
          {
            tenantName: String
            company: Company
          }
          
          type Company @aws_iam
          {
            companyName: String
            tenants: [Tenant]
          }
          
          type Query {
            listByModelName(someModelName: String!): [Company]
              @function(name: "something")
              @auth(rules: [{allow: public, provider: iam}])
          }
      `,
      );
    });

    test('throws instructive error on model operations', async () => {
      const { generateClient } = mockedGenerateClient([
        { data: { getSomeModel: [] } },
      ]);
      const client = generateClient<Schema>();

      await expect(() =>
        client.models.SomeModel.get({
          id: 'anything',
        }),
      ).rejects.toThrow(
        'Cyclical custom types detected. A custom selection set is required here.',
      );
    });

    /**
     * If nothing else, there's no reason this shouldn't work today with custom selection set.
     *
     * This part of the problem is 100% a bug.
     */
    test('can be selected with model ops using custom selection set', async () => {
      const { spy, generateClient } = mockedGenerateClient([
        { data: { getSomeModel: [] } },
      ]);
      const client = generateClient<Schema>();

      const { data } = await client.models.SomeModel.get(
        {
          id: 'anything',
        },
        {
          selectionSet: [
            'id',
            'modelName',
            'company.companyName',
            'company.tenants.*',
          ],
        },
      );

      expectSelectionSetEquals(
        spy,
        `
        id
        modelName
        company {
          companyName
          tenants {
            something
          }
        }
      `,
      );
    });

    test('throws an instructive error on custom operations', async () => {
      const { generateClient } = mockedGenerateClient([
        { data: { getCompanyById: [] } },
      ]);
      const client = generateClient<Schema>();

      await expect(() =>
        client.queries.listByModelName({
          someModelName: 'anything',
        }),
      ).rejects.toThrow(
        'Cyclical custom types results are not yet supported in custom operations.',
      );
    });

    /**
     * Custom selection set not supported on custom operations.
     */
  });
});
