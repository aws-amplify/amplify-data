import { a, ClientSchema } from '@aws-amplify/data-schema';
import { Amplify } from 'aws-amplify';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  expectSelectionSetEquals,
} from '../../utils';
import { Expect, Equal, ExpectFalse } from '@aws-amplify/data-schema-types';

describe('selectionSetDepth ClientSchema option', () => {
  const schema = a
    .schema({
      Network: a.model({
        name: a.string().required(),
        articles: a.hasMany('Article', 'networkId'),
      }),
      Article: a.model({
        title: a.string().required(),
        networkId: a.id().required(),
        network: a.belongsTo('Network', 'networkId'),
        articleOriginalWorks: a.hasMany('ArticleOriginalWork', 'articleId'),
      }),
      ArticleOriginalWork: a
        .model({
          articleId: a.id().required(),
          personId: a.id().required(),
          article: a.belongsTo('Article', 'articleId'),
          person: a.belongsTo('Person', 'personId'),
        })
        .identifier(['articleId', 'personId']),
      Person: a.model({
        name: a.string().required(),
        articleOriginalWorks: a.hasMany('ArticleOriginalWork', 'personId'),
      }),
    })
    .authorization((allow) => [allow.publicApiKey()]);

  beforeEach(async () => {
    Amplify.configure(await buildAmplifyConfig(schema));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('default depth (= 5): full path coverage', () => {
    it('accepts the 3-hop articles.articleOriginalWorks.person.name path', async () => {
      type Schema = ClientSchema<typeof schema>;

      type FlatNetwork = Schema['Network']['__meta']['flatModel'];
      type _personNameAccessible = Expect<
        Equal<
          FlatNetwork['articles'][number]['articleOriginalWorks'][number]['person']['name'],
          string
        >
      >;

      const { spy, generateClient } = mockedGenerateClient([
        {
          data: {
            listNetworks: {
              items: [],
              nextToken: null,
            },
          },
        },
      ]);
      const client = generateClient<Schema>();

      await client.models.Network.list({
        selectionSet: ['name', 'articles.articleOriginalWorks.person.name'],
      });

      expectSelectionSetEquals(
        spy,
        `items {
          name
          articles {
            items {
              articleOriginalWorks {
                items {
                  person {
                    name
                  }
                }
              }
            }
          }
        }
        nextToken
        __typename`,
      );
    });
  });

  describe('depth=2: two hops accessible, third hop rejected', () => {
    it('accepts articles.articleOriginalWorks.* but not person sub-paths', async () => {
      type Schema = ClientSchema<typeof schema, { selectionSetDepth: 2 }>;

      type FlatNetwork = Schema['Network']['__meta']['flatModel'];
      type AOWInFlat =
        FlatNetwork['articles'][number]['articleOriginalWorks'][number];

      type _aowArticleId = Expect<Equal<AOWInFlat['articleId'], string>>;
      type _personStripped = ExpectFalse<
        Equal<'person' extends keyof AOWInFlat ? true : false, true>
      >;
    });
  });

  describe('depth=1: one hop accessible, second hop rejected', () => {
    it('accepts articles.* but not articleOriginalWorks sub-paths', async () => {
      type Schema = ClientSchema<typeof schema, { selectionSetDepth: 1 }>;

      type FlatNetwork = Schema['Network']['__meta']['flatModel'];
      type ArticleInFlat = FlatNetwork['articles'][number];

      type _articleTitle = Expect<Equal<ArticleInFlat['title'], string>>;
      type _aowStripped = ExpectFalse<
        Equal<
          'articleOriginalWorks' extends keyof ArticleInFlat ? true : false,
          true
        >
      >;
    });
  });

  describe('depth=0: no flatten', () => {
    it('keeps articles as a LazyLoader; no static traversal into it', async () => {
      type Schema = ClientSchema<typeof schema, { selectionSetDepth: 0 }>;

      type FlatNetwork = Schema['Network']['__meta']['flatModel'];
      type ArticlesField = FlatNetwork['articles'];

      type _articlesIsCallable = Expect<
        Equal<ArticlesField extends (...args: any) => any ? true : false, true>
      >;
    });
  });
});
