import { a, ClientSchema } from '@aws-amplify/data-schema';
import { __modelMeta__, Prettify } from '@aws-amplify/data-schema-types';
import { GraphQLFormattedError } from '@aws-amplify/data-schema/runtime';

const masterType = {
  id: a.id().required(),
  name: a.string().required(),
  type: a.string().required(),
  sort: a.integer().required(),
};

const schema = a
  .schema({
    Network: a
      .model({
        ...masterType,
        articles: a.hasMany('Article', 'networkId'),
      })
      .secondaryIndexes((index) => [
        index('type').sortKeys(['sort']).queryField('networkListByTypeAndId'),
      ]),
    Category: a
      .model({
        ...masterType,
        articles: a.hasMany('Article', 'categoryId'),
      })
      .secondaryIndexes((index) => [
        index('type').sortKeys(['sort']).queryField('categoryListByTypeAndId'),
      ]),
    Season: a
      .model({
        ...masterType,
        articles: a.hasMany('Article', 'seasonId'),
      })
      .secondaryIndexes((index) => [
        index('type').sortKeys(['sort']).queryField('seasonListByTypeAndId'),
      ]),
    Person: a
      .model({
        ...masterType,
        articleCasts: a.hasMany('ArticleCast', 'personId'),
        articleAuthors: a.hasMany('ArticleAuthor', 'personId'),
        articleDirectors: a.hasMany('ArticleDirector', 'personId'),
        articleProducers: a.hasMany('ArticleProducer', 'personId'),
        articleScreenwriters: a.hasMany('ArticleScreenwriter', 'personId'),
        articleOriginalWorks: a.hasMany('ArticleOriginalWork', 'personId'),
        image: a.string(),
      })
      .secondaryIndexes((index) => [
        index('type').sortKeys(['sort']).queryField('personListByTypeAndId'),
      ]),
    ArticleVod: a
      .model({
        articleId: a.id().required(),
        vodId: a.id().required(),
        vod: a.belongsTo('Vod', 'vodId'),
        article: a.belongsTo('Article', 'articleId'),
      })
      .identifier(['articleId', 'vodId']),
    Vod: a
      .model({
        ...masterType,
        articles: a.hasMany('ArticleVod', 'vodId'),
        microcopy: a.string(),
        url: a.string(),
      })
      .secondaryIndexes((index) => [
        index('type').sortKeys(['sort']).queryField('vodListByTypeAndId'),
      ]),
    ArticleCast: a
      .model({
        articleId: a.id().required(),
        personId: a.id().required(),
        roleName: a.string().required(),
        person: a.belongsTo('Person', 'personId'),
        article: a.belongsTo('Article', 'articleId'),
      })
      .identifier(['articleId', 'personId']),
    ArticleAuthor: a
      .model({
        articleId: a.id().required(),
        personId: a.id().required(),
        person: a.belongsTo('Person', 'personId'),
        article: a.belongsTo('Article', 'articleId'),
      })
      .identifier(['articleId', 'personId']),
    ArticleDirector: a
      .model({
        articleId: a.id().required(),
        personId: a.id().required(),
        person: a.belongsTo('Person', 'personId'),
        article: a.belongsTo('Article', 'articleId'),
      })
      .identifier(['articleId', 'personId']),
    ArticleProducer: a
      .model({
        articleId: a.id().required(),
        personId: a.id().required(),
        person: a.belongsTo('Person', 'personId'),
        article: a.belongsTo('Article', 'articleId'),
      })
      .identifier(['articleId', 'personId']),
    ArticleScreenwriter: a
      .model({
        articleId: a.id().required(),
        personId: a.id().required(),
        person: a.belongsTo('Person', 'personId'),
        article: a.belongsTo('Article', 'articleId'),
      })
      .identifier(['articleId', 'personId']),
    ArticleOriginalWork: a
      .model({
        articleId: a.id().required(),
        personId: a.id().required(),
        person: a.belongsTo('Person', 'personId'),
        article: a.belongsTo('Article', 'articleId'),
      })
      .identifier(['articleId', 'personId']),
    ArticleMusic: a
      .model({
        type: a.string().required(),
        articleId: a.id().required(),
        article: a.belongsTo('Article', 'articleId'),
        course: a.integer().required(),
        opArtist: a.string(),
        opSong: a.string(),
        edArtist: a.string(),
        edSong: a.string(),
        otherArtist: a.string(),
        otherSon: a.string(),
        sort: a.integer().required(), // articleId
      })
      .identifier(['articleId', 'course'])
      .secondaryIndexes((index) => [
        index('type')
          .sortKeys(['sort', 'course'])
          .queryField('musicListByTypeAndSortCourse'),
      ]),
    PageSetting: a
      .model({
        articleId: a.id().required(),
        type: a.string().required(), // eg: anime-CAROUSEL / anime-SPOTLIGHT
        article: a.belongsTo('Article', 'articleId'),
        sort: a.integer().required(),
      })
      .identifier(['articleId', 'type'])
      .secondaryIndexes((index) => [
        index('type').sortKeys(['sort']).queryField('settingListByTypeAndSort'),
      ]),
    Article: a
      .model({
        id: a.id().required(),
        genreType: a.enum(['movie', 'drama', 'variety', 'anime']),
        tagType: a.enum(['root', 'series', 'episode']),
        pathName: a.string().required(), // eg: spy_family | spy_family/season1 | spy_family/season1/episode1
        parentId: a.id(),
        childs: a.hasMany('Article', 'parentId'),
        parent: a.belongsTo('Article', 'parentId'),
        pageSetting: a.hasMany('PageSetting', 'articleId'),
        title: a.string().required(),
        titleMeta: a.string(),
        descriptionMeta: a.string(),
        networkId: a.id().required(),
        network: a.belongsTo('Network', 'networkId'),
        seasonId: a.id(),
        season: a.belongsTo('Season', 'seasonId'),
        thumbnail: a.string(),
        vods: a.hasMany('ArticleVod', 'articleId'),
        categoryId: a.id().required(),
        category: a.belongsTo('Category', 'categoryId'),
        summary: a.customType({
          title: a.string(),
          text: a.string(),
        }),
        authors: a.hasMany('ArticleAuthor', 'articleId'),
        authorOrganiation: a.string(),
        directors: a.hasMany('ArticleDirector', 'articleId'),
        producers: a.hasMany('ArticleProducer', 'articleId'),
        screenwriters: a.hasMany('ArticleScreenwriter', 'articleId'),
        staff: a.string(),
        production: a.string().array(),
        casts: a.hasMany('ArticleCast', 'articleId'),
        sns: a.url().array(),
        durationTime: a.string(),
        seriesNumber: a.string(),
        publisher: a.string(),
        otherPublisher: a.string(),
        website: a.url(),
        articleOriginalWorks: a.hasMany('ArticleOriginalWork', 'articleId'),
        originalWorkOrganization: a.string(),
        label: a.string(),
        durationPeriod: a.string(),
        volume: a.string(),
        content: a.customType({
          genre: a.string(),
          subgenre: a.string(),
        }),
        distributor: a.string(),
        distributorOverseas: a.string(),
        copyright: a.string(),
        productionYear: a.string(),
        musics: a.hasMany('ArticleMusic', 'articleId'),
        video: a.customType({
          text: a.string(),
          url: a.url(),
        }),
        sort: a.integer().required(),
      })
      .secondaryIndexes((index) => [
        index('genreType')
          .sortKeys(['sort'])
          .queryField('listByGenreTypeAndSort'),
        index('parentId')
          .sortKeys(['sort'])
          .queryField('listByParentIdAndSort'),
        index('seasonId')
          .sortKeys(['genreType', 'tagType', 'sort'])
          .queryField('listBySeasonIdAndTypeSort'),
        index('categoryId')
          .sortKeys(['genreType', 'tagType', 'sort'])
          .queryField('listByCategoryIdAndTypeSort'),
        index('pathName').queryField('listByPathName'),
      ]),
  })
  .authorization((allow) => [allow.publicApiKey()]);

export type Schema = ClientSchema<typeof schema>;

type TN = Prettify<Schema['Network']['type']>;
type TNF = Prettify<Schema['Network']['__meta']['flatModel']>;
