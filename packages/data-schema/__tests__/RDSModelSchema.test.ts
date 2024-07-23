import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { configure } from '../src/ModelSchema';
import { a } from '../src/index';

// evaluates type defs in corresponding test-d.ts file
it('should not produce static type errors', async () => {
  await expectTypeTestsToPassAsync(__filename);
});

describe('RDSModelSchema', () => {
  describe('.setRelationships() modifier', () => {
    it('generates expected schema for unidirectional hasMany', () => {
      const schema = configure({
        database: {
          engine: 'mysql',
          connectionUri: 'fake' as any,
        },
      })
        .schema({
          Post: a.model({
            title: a.string().required(),
            content: a.string(),
            parentBlogId: a.string(),
          }),
          Blog: a.model({
            title: a.string().required(),
            description: a.string(),
          }),
        })
        .authorization((allow) => allow.publicApiKey())
        .setRelationships((models) => [
          models.Blog.relationships({
            childPosts: a.hasMany('Post', 'parentBlogId'),
          }),
        ]);

      expect(schema.transform().schema).toMatchSnapshot();
    });

    it('generates expected schema for bidirectional hasMany<->belongsTo', () => {
      const schema = configure({
        database: {
          engine: 'mysql',
          connectionUri: 'fake' as any,
        },
      })
        .schema({
          Post: a.model({
            title: a.string().required(),
            content: a.string(),
            parentBlogId: a.string(),
          }),
          Blog: a.model({
            title: a.string().required(),
            description: a.string(),
          }),
        })
        .authorization((allow) => allow.publicApiKey())
        .setRelationships((models) => [
          models.Post.relationships({
            parentBlog: a.belongsTo('Blog', 'parentBlogId'),
          }),
          models.Blog.relationships({
            childPosts: a.hasMany('Post', 'parentBlogId'),
          }),
        ]);

      expect(schema.transform().schema).toMatchSnapshot();
    });

    it('generates expected schema for unidirectional hasOne', () => {
      const schema = configure({
        database: {
          engine: 'mysql',
          connectionUri: 'fake' as any,
        },
      })
        .schema({
          Supplier: a.model({
            name: a.string().required(),
          }),
          Account: a.model({
            email: a.string().required(),
            supplierId: a.string(),
          }),
        })
        .authorization((allow) => allow.publicApiKey())
        .setRelationships((models) => [
          models.Supplier.relationships({
            account: a.hasOne('Account', 'supplierId'),
          }),
        ]);

      expect(schema.transform().schema).toMatchSnapshot();
    });

    it('generates expected schema for unidirectional belongsTo', () => {
      const schema = configure({
        database: {
          engine: 'mysql',
          connectionUri: 'fake' as any,
        },
      })
        .schema({
          Supplier: a.model({
            name: a.string().required(),
          }),
          Account: a.model({
            email: a.string().required(),
            supplierId: a.string(),
          }),
        })
        .authorization((allow) => allow.publicApiKey())
        .setRelationships((models) => [
          models.Account.relationships({
            supplier: a.belongsTo('Supplier', 'supplierId'),
          }),
        ]);

      expect(schema.transform().schema).toMatchSnapshot();
    });

    it('generates expected schema for bidirectional hasOne<->belongsTo', () => {
      const schema = configure({
        database: {
          engine: 'mysql',
          connectionUri: 'fake' as any,
        },
      })
        .schema({
          Supplier: a.model({
            name: a.string().required(),
          }),
          Account: a.model({
            email: a.string().required(),
            supplierId: a.string(),
          }),
        })
        .authorization((allow) => allow.publicApiKey())
        .setRelationships((models) => [
          models.Account.relationships({
            supplier: a.belongsTo('Supplier', 'supplierId'),
          }),
          models.Supplier.relationships({
            account: a.hasOne('Account', 'supplierIds'),
          })
        ])

      expect(schema.transform().schema).toMatchSnapshot();
    });

    it('is unusable with non-RDS schema', () => {
      expect(() =>
        a
          .schema({
            Post: a.model({
              title: a.string().required(),
              content: a.string(),
            }),
          })
          // @ts-expect-error .setRelationships() should not be available for non-RDS schema
          .setRelationships((models) => []),
      ).toThrow();
    });
  });
});
