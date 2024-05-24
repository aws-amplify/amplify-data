import { type ModelType, type InternalModel, model } from '../src/ModelType';
import {
  type ModelField,
  type InternalField,
  string,
  id,
} from '../src/ModelField';
import {
  type ModelSchema,
  type InternalSchema,
  schema,
} from '../src/ModelSchema';
import { configure } from '../src/internals';
import { a, ClientSchema } from '../src/index';

type GetModelTypeArg<T> = T extends ModelType<infer R, any> ? R : never;

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
  describe('[TODO] SQL', () => {
    test('Runtime error when calling unsupported `setAuthorization` [TODO]', () => {
      expect(() => {
        const sqlSchema = configure({ database: datasourceConfigMySQL })
          .schema({
            post: a
              .model({
                id: a.string().required(),
                title: a.string(),
                author: a.string(),
              })
              .identifier(['id']),
            comment: a
              .model({
                id: a.string().required(),
                title: a.string(),
                author: a.string(),
              })
              .identifier(['id']),
            tags: a
              .model({
                id: a.string().required(),
                title: a.string(),
                author: a.string(),
              })
              .identifier(['id']),
          })
          .setAuthorization((models) => [
            models.post.authorization((allow) => allow.publicApiKey()),
            models.comment.authorization((allow) => allow.publicApiKey()),
            models.tags.authorization((allow) => allow.publicApiKey()),
            // For setAuthorization, the model shouldn't have "addRelationship" and "secondaryIndexes"
            // Note: unable to repro `addRelationship`, may have been inadvertently fixed previously:
            // @ts-expect-error
            models.tags.secondaryIndexes,
          ]);
      }).toThrowError();
    });
    test('Runtime error when calling unsupported relationships [TODO]', () => {
      expect(() => {
        const sqlSchema = configure({ database: datasourceConfigMySQL })
          .schema({
            post: a
              .model({
                id: a.string().required(),
                title: a.string(),
                author: a.string(),
              })
              .identifier(['id']),
            comment: a
              .model({
                id: a.string().required(),
                title: a.string(),
                author: a.string(),
              })
              .identifier(['id']),
            tags: a
              .model({
                id: a.string().required(),
                title: a.string(),
                author: a.string(),
              })
              .identifier(['id']),
          })
          .setAuthorization((models) => [
            models.post.authorization((allow) => allow.publicApiKey()),
            models.comment.authorization((allow) => allow.publicApiKey()),
            models.tags.authorization((allow) => allow.publicApiKey()),
            // This shouldn't work:
            // @ts-expect-error
            models.tags.secondaryIndexes((index) => [index('title')]),
          ])
          .setRelationships((models) => [
            models.post.relationships({
              comments: a.hasMany('Comment', 'post_id'),
            }),
            models.comment.relationships({
              note: a.belongsTo('Post', 'post_id'),
            }),
            // For relationships, the model shouldn't have "authorization", "secondaryIndexes", "fields":
            // TODO: errors, but is still shown as option - test elsewhere
            // models.tags.relationships({
            //   note: a.belongsTo('Post', 'post_id'),
            // }),
            // models.tags
          ]);
      }).not.toThrowError();
    });
  });
});
