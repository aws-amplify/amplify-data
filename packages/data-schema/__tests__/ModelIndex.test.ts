import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { ClientSchema, a } from '../src/index';
import { ExtractModelMeta, Prettify } from '@aws-amplify/data-schema-types';

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
      'Invalid ref. Todo is referencing TodoStatus which is not defined in the schema',
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
      'Invalid ref. Todo is referencing TodoStatus which is not defined in the schema',
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
});
