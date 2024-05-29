import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Expect, Equal } from '@aws-amplify/data-schema-types';
import { Amplify } from 'aws-amplify';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
  parseQuery,
  parseGraphqlSchema,
  expectSchemaModelContains,
  expectSchemaModelExcludes,
  expectSelectionSetContains,
  expectVariables,
} from '../../utils';

class CookieCollection {
  private items = {} as Record<string, string>;

  constructor(items?: Record<string, string>) {
    this.items = items || {};
  }

  // Amplify internals explicitly uses these four methods:
  // set, get, delete, getAll
  // See here: https://github.com/aws-amplify/amplify-js/blob/main/packages/adapter-nextjs/src/utils/createCookieStorageAdapterFromNextServerContext.ts#L113

  set(name: string, value: string, _options: any) {
    this.items[name] = value;
  }

  get(name: string) {
    return this.items[name];
  }

  delete(name: string) {
    delete this.items[name];
  }

  getAll() {
    return [...Object.entries(this.items)].map(([name, value]) => ({
      name,
      value,
    }));
  }
}

describe('something', () => {
  const schema = a
    .schema({
      StandaloneModel: a.model({
        name: a.string(),
      }),
      Parent: a.model({
        name: a.string(),
        children: a.hasMany('Child', 'parentId'),
      }),
      Child: a.model({
        name: a.string(),
        parentId: a.id(),
        parent: a.belongsTo('Parent', 'parentId'),
      }),
    })
    .authorization((allow) => [allow.publicApiKey()]);

  type Schema = ClientSchema<typeof schema>;

  test('whatever', async () => {
    const { spy, generateServerClientUsingCookies } = mockedGenerateClient([
      {
        data: {
          getStandaloneModel: {
            id: 'some-id',
            name: 'something',
          },
        },
      },
    ]);

    const config = await buildAmplifyConfig(schema);
    Amplify.configure(config);
    const client = generateServerClientUsingCookies<Schema>({
      config,
      cookies: () => {
        return new CookieCollection({
          'some-cookie': 'some-cookie-value',
        }) as any;
      },
    });

    // Just sanity-checking that types are present, for now.
    await client.models.StandaloneModel.get({ id: 'something' });
  });
});
