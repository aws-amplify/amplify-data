import { type _Internal_ModelType, model } from '../src/ModelType';
import { string, id } from '../src/ModelField';
import { schema } from '../src/ModelSchema';
import { configure } from '../src/internals';
import { a } from '../src/index';

const fakeSecret = () => ({}) as any;

const datasourceConfigMySQL = {
  engine: 'mysql',
  connectionUri: fakeSecret(),
} as const;

describe('ModelSchema', () => {
  describe('default functionality', () => {
    it('basic ModelSchema can be cast to InternalSchema', () => {
      const s = schema({
        Post: model({
          id: id(),
          title: string(),
        }),
      });

      // TODO: fix
      // const is = s as InternalSchema;
    });
  });
  describe('sql configured functionality', () => {
    it('can be configured to use sql', () => {
      const s = configure({ database: datasourceConfigMySQL }).schema({
        Post: model({
          id: id(),
          title: string(),
        }),
      });
    });
  });
  describe('SQL schema unsupported modifiers', () => {
    it('expected errors for unsupported `setAuthorization` modifiers', () => {
      const sqlSchema = configure({ database: datasourceConfigMySQL })
        .schema({
          post: a.model({
            id: a.string().required(),
            title: a.string(),
          }),
        })
        .setAuthorization((models) => [
          // @ts-expect-error - not supported
          models.post.secondaryIndexes((index) => [index('title')]),
          // @ts-expect-error - not supported
          models.post.addRelationship,
        ]);
    });
    it('expected errors for unsupported `setRelationship` modifiers', () => {
      const sqlSchema = configure({ database: datasourceConfigMySQL })
        .schema({
          post: a.model({
            id: a.string().required(),
            title: a.string(),
            author: a.string(),
          }),
        })
        .setAuthorization((models) => [
          models.post.authorization((allow) => allow.publicApiKey()),
        ])
        .setRelationships((models) => [
          // @ts-expect-error - not supported
          models.post.secondaryIndexes((index) => [index('title')]),
          // @ts-expect-error - not supported
          models.post.authorization((allow) => allow.publicApiKey()),
          // @ts-expect-error - not supported
          models.post.fields.title.authorization((allow) =>
            allow.publicApiKey(),
          ),
        ]);
    });
  });
});
