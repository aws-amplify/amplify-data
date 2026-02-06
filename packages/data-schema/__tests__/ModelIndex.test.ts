import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { a } from '../src/index';

// evaluates type defs in corresponding test-d.ts file
it('should not produce static type errors', async () => {
  await expectTypeTestsToPassAsync(__filename);
});

describe('secondary index schema generation', () => {
  it('generates correct schema for using a.enum() as the partition key', () => {
    const schema = a
      .schema({
        Todo: a
          .model({
            title: a.string().required(),
            content: a.string(),
            status: a.enum(['open', 'in_progress', 'completed']),
          })
          .secondaryIndexes((index) => [index('status').sortKeys(['title'])]),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  it('generates correct schema for using a.enum() as the sort key', () => {
    const schema = a
      .schema({
        Todo: a
          .model({
            title: a.string().required(),
            content: a.string(),
            status: a.enum(['open', 'in_progress', 'completed']),
          })
          .secondaryIndexes((index) => [index('title').sortKeys(['status'])]),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  it('generates correct schema for using a.ref() (refer to an enum) as the partition key', () => {
    const schema = a
      .schema({
        Todo: a
          .model({
            title: a.string().required(),
            content: a.string(),
            status: a.ref('TodoStatus'),
          })
          .secondaryIndexes((index) => [index('status').sortKeys(['title'])]),
        TodoStatus: a.enum(['open', 'in_progress', 'completed']),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  it('generates correct schema for using a.ref() (refer to an enum) as the sort key', () => {
    const schema = a
      .schema({
        Todo: a
          .model({
            title: a.string().required(),
            content: a.string(),
            status: a.ref('TodoStatus'),
          })
          .secondaryIndexes((index) => [index('title').sortKeys(['status'])]),
        TodoStatus: a.enum(['open', 'in_progress', 'completed']),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  });
});

describe('GSI projection functionality', () => {
  it('generates correct schema for KEYS_ONLY projection', () => {
    const schema = a
      .schema({
        Product: a
          .model({
            id: a.id().required(),
            name: a.string().required(),
            category: a.string().required(),
            price: a.float().required(),
            inStock: a.boolean().required(),
          })
          .secondaryIndexes((index) => [
            index('category').projection('KEYS_ONLY'),
          ]),
      })
      .authorization((allow) => allow.publicApiKey());

    const transformed = schema.transform().schema;

    expect(transformed).toContain('projection: { type: KEYS_ONLY }');
    expect(transformed).not.toContain('nonKeyAttributes');
    expect(transformed).toMatchSnapshot();
  });

  it('generates correct schema for INCLUDE projection with nonKeyAttributes', () => {
    const schema = a
      .schema({
        Product: a
          .model({
            id: a.id().required(),
            name: a.string().required(),
            category: a.string().required(),
            price: a.float().required(),
            inStock: a.boolean().required(),
          })
          .secondaryIndexes((index) => [
            index('category').projection('INCLUDE', ['name', 'price']),
          ]),
      })
      .authorization((allow) => allow.publicApiKey());

    const transformed = schema.transform().schema;

    expect(transformed).toContain(
      'projection: { type: INCLUDE, nonKeyAttributes: ["name", "price"] }',
    );
    expect(transformed).toMatchSnapshot();
  });

  it('generates correct schema for ALL projection', () => {
    const schema = a
      .schema({
        Product: a
          .model({
            id: a.id().required(),
            name: a.string().required(),
            category: a.string().required(),
            price: a.float().required(),
            inStock: a.boolean().required(),
          })
          .secondaryIndexes((index) => [index('category').projection('ALL')]),
      })
      .authorization((allow) => allow.publicApiKey());

    const transformed = schema.transform().schema;

    // When projection is ALL and no explicit projection is set, it may be omitted from output
    expect(transformed).toContain('@index');
    expect(transformed).not.toContain('nonKeyAttributes');
    expect(transformed).toMatchSnapshot();
  });

  it('generates correct schema for multiple indexes with different projection types', () => {
    const schema = a
      .schema({
        Order: a
          .model({
            id: a.id().required(),
            customerId: a.string().required(),
            status: a.string().required(),
            total: a.float().required(),
            createdAt: a.datetime().required(),
          })
          .secondaryIndexes((index) => [
            index('customerId').projection('ALL'),
            index('status').projection('INCLUDE', ['customerId', 'total']),
            index('createdAt').projection('KEYS_ONLY'),
          ]),
      })
      .authorization((allow) => allow.publicApiKey());

    const transformed = schema.transform().schema;

    expect(transformed).toContain(
      'projection: { type: INCLUDE, nonKeyAttributes: ["customerId", "total"] }',
    );
    expect(transformed).toContain('projection: { type: KEYS_ONLY }');
    expect(transformed).toMatchSnapshot();
  });

  it('generates correct schema without projection (defaults to ALL)', () => {
    const schema = a
      .schema({
        Product: a
          .model({
            id: a.id().required(),
            name: a.string().required(),
            category: a.string().required(),
            price: a.float().required(),
          })
          .secondaryIndexes((index) => [
            index('category'), // No projection specified, should default to ALL
          ]),
      })
      .authorization((allow) => allow.publicApiKey());

    const transformed = schema.transform().schema;

    // When no projection is specified, it defaults to ALL and may be omitted from output
    expect(transformed).toContain('@index');
    expect(transformed).not.toContain('nonKeyAttributes');
    expect(transformed).toMatchSnapshot();
  });
});

describe('SchemaProcessor validation against secondary indexes', () => {
  it('throws error when a.ref() used as the index partition key points to a non-existing type', () => {
    const schema = a.schema({
      Todo: a
        .model({
          title: a.string().required(),
          content: a.string(),
          status: a.ref('TodoStatus'),
        })
        .secondaryIndexes((index) => [index('status').sortKeys(['title'])]),
      Status: a.enum(['open', 'in_progress', 'completed']),
    });

    expect(() => schema.transform()).toThrow(
      'Invalid ref. Todo is referring to TodoStatus which is not defined in the schema',
    );
  });

  it('throws error when a.ref() used as the index sort key points to a non-existing type', () => {
    const schema = a.schema({
      Todo: a
        .model({
          title: a.string().required(),
          content: a.string(),
          status: a.ref('TodoStatus'),
        })
        .secondaryIndexes((index) => [index('title').sortKeys(['status'])]),
      Status: a.enum(['open', 'in_progress', 'completed']),
    });

    expect(() => schema.transform()).toThrow(
      'Invalid ref. Todo is referring to TodoStatus which is not defined in the schema',
    );
  });

  it('throws error when a.ref() used as the partition key points to a non-enum type', () => {
    const schema = a.schema({
      Todo: a
        .model({
          title: a.string().required(),
          content: a.string(),
          status: a.ref('TodoStatus'),
        })
        .secondaryIndexes((index) => [index('title').sortKeys(['status'])]),
      TodoStatus: a.customType({
        completed: a.boolean(),
      }),
    });

    expect(() => schema.transform()).toThrow(
      'The ref field `status` used in the secondary index of `Todo` should refer to an enum type. `TodoStatus` is not a enum type.',
    );
  });

  it('creates a queryField with a default name', () => {
    const schema = a
      .schema({
        Todo: a
          .model({
            title: a.string().required(),
            content: a.string(),
            status: a.enum(['open', 'in_progress', 'completed']),
          })
          .secondaryIndexes((index) => [index('status').sortKeys(['title'])]),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  it('creates a queryField with user-defined name', () => {
    const schema = a
      .schema({
        Todo: a
          .model({
            title: a.string().required(),
            content: a.string(),
            status: a.enum(['open', 'in_progress', 'completed']),
          })
          .secondaryIndexes((index) => [
            index('status')
              .sortKeys(['title'])
              .queryField('userDefinedQueryField'),
          ]),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  it('omits the queryField if null is provided instead of a name', () => {
    const schema = a
      .schema({
        Todo: a
          .model({
            title: a.string().required(),
            content: a.string(),
            status: a.enum(['open', 'in_progress', 'completed']),
          })
          .secondaryIndexes((index) => [
            index('status').sortKeys(['title']).queryField(null),
          ]),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  });
});
