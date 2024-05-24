import { type ModelType, model } from '../src/ModelType';
import { string, id } from '../src/ModelField';
import { schema } from '../src/ModelSchema';
import { configure } from '../src/internals';
import { a } from '../src/index';

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
    it('Runtime error when calling unsupported `setAuthorization` [TODO]', () => {
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
          models.tags.secondaryIndexes((index) => [index('title')]),
        ]);
    });
    it('Runtime error when calling unsupported relationships [TODO]', () => {
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
        ])
        .setRelationships((models) => [
          models.post.relationships({
            comments: a.hasMany('Comment', 'post_id'),
          }),
          models.comment.relationships({
            note: a.belongsTo('Post', 'post_id'),
          }),
          // @ts-expect-error
          models.tags.secondaryIndexes((index) => [index('title')]),
          // @ts-expect-error
          models.tags.authorization((allow) => allow.publicApiKey()),
          // @ts-expect-error
          models.tags.fields.title.authorization((allow) =>
            allow.publicApiKey(),
          ),
        ]);
    });
  });
});
