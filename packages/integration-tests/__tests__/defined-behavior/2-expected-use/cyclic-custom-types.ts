import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import type { Expect, Equal } from '@aws-amplify/data-schema-types';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  expectGraphqlMatches,
  expectSelectionSetEquals,
} from '../../utils';

// https://github.com/aws-amplify/amplify-data/issues/423
describe('custom types with cyclic references', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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
    allCompanies: a
      .query()
      .returns(a.ref('Company').array())
      .authorization((allow) => allow.publicApiKey())
      .handler(a.handler.function('myFunc')),
    getTenant: a
      .query()
      .returns(a.ref('Tenant'))
      .authorization((allow) => allow.publicApiKey())
      .handler(a.handler.function('myFunc')),
  });

  type Schema = ClientSchema<typeof schema>;

  beforeEach(async () => {
    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);
  });

  test('produces a valid graphql schema', () => {
    expectGraphqlMatches(
      schema.transform().schema,
      `
        type SomeModel @model @auth(rules: [{allow: public, provider: apiKey}])
        {
          modelName: String
          company: Company
        }

        type Tenant @aws_api_key
        {
          tenantName: String
          company: Company
        }

        type Company @aws_api_key
        {
          companyName: String
          tenants: [Tenant]
        }

        type Query {
          allCompanies: [Company] @function(name: "myFunc") @auth(rules: [{allow: public, provider: apiKey}])
          getTenant: Tenant @function(name: "myFunc") @auth(rules: [{allow: public, provider: apiKey}])
        }
      `,
    );
  });

  test('client types resolve the cyclic custom types', () => {
    type Company = Schema['Company']['type'];
    type Tenant = Schema['Tenant']['type'];
    type SomeModel = Schema['SomeModel']['type'];

    type _company = Expect<
      Equal<
        Company,
        {
          companyName?: string | null;
          tenants?: (Tenant | null | undefined)[] | null;
        }
      >
    >;
    type _tenant = Expect<
      Equal<
        Tenant,
        {
          tenantName?: string | null;
          company?: Company | null;
        }
      >
    >;
    type _modelField = Expect<
      Equal<NonNullable<SomeModel['company']>, Company>
    >;

    // the types stay intact (no `any` / depth errors) when traversing the cycle
    type DeepTenant = NonNullable<
      NonNullable<
        NonNullable<
          NonNullable<
            NonNullable<NonNullable<SomeModel['company']>['tenants']>[number]
          >['company']
        >['tenants']
      >[number]
    >;
    type _deep = Expect<Equal<DeepTenant, Tenant>>;
    type _deepField = Expect<
      Equal<DeepTenant['tenantName'], string | null | undefined>
    >;
  });

  test('default model selection set stops at the cycle', async () => {
    const { spy, generateClient } = mockedGenerateClient([
      {
        data: {
          getSomeModel: {
            id: 'some-id',
            modelName: 'some model',
            company: {
              companyName: 'some company',
              tenants: [{ tenantName: 'some tenant' }],
            },
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        },
      },
    ]);
    const client = generateClient<Schema>();

    const { data } = await client.models.SomeModel.get({ id: 'some-id' });

    expectSelectionSetEquals(
      spy,
      `
        id
        modelName
        company { companyName tenants { tenantName } }
        createdAt
        updatedAt
      `,
    );
    expect(data?.company?.tenants?.[0]?.tenantName).toEqual('some tenant');
  });

  test('custom selection sets can traverse the cycle', async () => {
    const { spy, generateClient } = mockedGenerateClient([
      { data: { getSomeModel: null } },
    ]);
    const client = generateClient<Schema>();

    await client.models.SomeModel.get(
      { id: 'some-id' },
      {
        selectionSet: [
          'id',
          'company.companyName',
          'company.tenants.company.tenants.*',
        ],
      },
    );

    expectSelectionSetEquals(
      spy,
      `
        id
        company {
          companyName
          tenants {
            company {
              tenants { tenantName company { companyName } }
            }
          }
        }
      `,
    );
  });

  test('custom query returning a cyclic custom type array', async () => {
    const { spy, generateClient } = mockedGenerateClient([
      {
        data: {
          allCompanies: [
            {
              companyName: 'some company',
              tenants: [{ tenantName: 'some tenant' }],
            },
          ],
        },
      },
    ]);
    const client = generateClient<Schema>();

    const { data } = await client.queries.allCompanies();

    expectSelectionSetEquals(spy, `companyName tenants { tenantName }`);
    expect(data).toEqual([
      {
        companyName: 'some company',
        tenants: [{ tenantName: 'some tenant' }],
      },
    ]);
  });

  test('custom query returning a cyclic custom type', async () => {
    const { spy, generateClient } = mockedGenerateClient([
      { data: { getTenant: null } },
    ]);
    const client = generateClient<Schema>();

    await client.queries.getTenant();

    expectSelectionSetEquals(spy, `tenantName company { companyName }`);
  });
});
