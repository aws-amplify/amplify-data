import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { a } from '../src/index';
import { defineFunctionStub } from './utils';

// evaluates type defs in corresponding test-d.ts file
it('should not produce static type errors', async () => {
  await expectTypeTestsToPassAsync(__filename);
});

it('requires a model to have at least one auth rule - no authorization calls', () => {
  const schema = a.schema({
    widget: a.model({
      title: a.string().required(),
      someOwnerField: a.string(),
    }),
  });

  expect(() => schema.transform().schema).toThrow(
    'missing authorization rules',
  );
});

it('requires a model to have at least one auth rule - empty model authorization call', () => {
  const schema = a.schema({
    widget: a
      .model({
        title: a.string().required(),
        someOwnerField: a.string(),
      })
      .authorization([]),
  });

  expect(() => schema.transform().schema).toThrow(
    'missing authorization rules',
  );
});

it('requires a model to have at least one auth rule - empty global authorization call', () => {
  const schema = a
    .schema({
      widget: a.model({
        title: a.string().required(),
        someOwnerField: a.string(),
      }),
    })
    .authorization([]);

  expect(() => schema.transform().schema).toThrow(
    'missing authorization rules',
  );
});

it('empty model auth inherits global auth', () => {
  const schema = a
    .schema({
      widget: a
        .model({
          title: a.string().required(),
          someOwnerField: a.string(),
        })
        .authorization([]),
    })
    .authorization([a.allow.owner()]);

  expect(schema.transform().schema).toMatchSnapshot();
});

describe('Lambda resource access', () => {
  it('schema lambda access', () => {
    const fn1 = defineFunctionStub({});

    const schema = a
      .schema({
        Todo: a
          .model({
            content: a.string(),
          })
          .authorization([a.allow.public()]),
      })
      .authorization([a.allow.resource(fn1)]);

    const { functionSchemaAccess } = schema.transform();
    expect(functionSchemaAccess).toEqual([
      {
        resourceProvider: fn1,
        actions: ['query', 'mutate', 'listen'],
      },
    ]);
  });

  it('schema lambda access single action', () => {
    const fn1 = defineFunctionStub({});

    const schema = a
      .schema({
        Todo: a
          .model({
            content: a.string(),
          })
          .authorization([a.allow.public()]),
      })
      .authorization([a.allow.resource(fn1).to(['query'])]);

    const { functionSchemaAccess } = schema.transform();
    expect(functionSchemaAccess).toEqual([
      {
        resourceProvider: fn1,
        actions: ['query'],
      },
    ]);
  });

  it('schema lambda access - multiple fns', () => {
    const fn1 = defineFunctionStub({});
    const fn2 = defineFunctionStub({});
    const fn3 = defineFunctionStub({});

    const schema = a
      .schema({
        Todo: a
          .model({
            content: a.string(),
          })
          .authorization([a.allow.public()]),
      })
      .authorization([
        a.allow.resource(fn1).to(['query']),
        a.allow.resource(fn2).to(['mutate']),
        a.allow.resource(fn3).to(['listen']),
      ]);

    const { functionSchemaAccess } = schema.transform();
    expect(functionSchemaAccess).toEqual([
      {
        resourceProvider: fn1,
        actions: ['query'],
      },
      {
        resourceProvider: fn2,
        actions: ['mutate'],
      },
      {
        resourceProvider: fn3,
        actions: ['listen'],
      },
    ]);
  });

  it('lambda access not valid on model or field', () => {
    const fn1 = defineFunctionStub({});

    const schema = a
      .schema({
        Todo: a
          .model({
            content: a.string().authorization([
              // @ts-expect-error
              a.allow.resource(fn1).to(['query']),
            ]),
          })
          .authorization([
            // @ts-expect-error
            a.allow.resource(fn1).to(['query']),
          ]),
      })
      .authorization([a.allow.public()]);

    expect(() => schema.transform()).toThrow(
      'Lambda resource authorization is only confiugrable at the schema level',
    );
  });
});
