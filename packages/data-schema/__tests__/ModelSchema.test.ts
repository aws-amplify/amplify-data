import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { a } from '../index';

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
    const myFunc = () => {};

    const schema = a
      .schema({
        Todo: a
          .model({
            content: a.string(),
          })
          .authorization([a.allow.public()]),
      })
      // asserting `any` here and below, so that we don't have to take a dep
      // on @aws-amplify/backend just to run this test.
      .authorization([a.allow.resource(myFunc as any)]);

    const { functionSchemaAccess } = schema.transform();
    expect(functionSchemaAccess).toEqual([
      {
        resourceProvider: myFunc,
        actions: ['query', 'mutate', 'listen'],
      },
    ]);
  });

  it('schema lambda access single action', () => {
    const myFunc = () => {};

    const schema = a
      .schema({
        Todo: a
          .model({
            content: a.string(),
          })
          .authorization([a.allow.public()]),
      })
      .authorization([a.allow.resource(myFunc as any).to(['query'])]);

    const { functionSchemaAccess } = schema.transform();
    expect(functionSchemaAccess).toEqual([
      {
        resourceProvider: myFunc,
        actions: ['query'],
      },
    ]);
  });

  it('lambda access not valid on model or field', () => {
    const myFunc = () => {};

    const schema = a
      .schema({
        Todo: a
          .model({
            content: a
              .string()
              // @ts-expect-error
              .authorization([a.allow.resource(myFunc as any).to(['query'])]),
          })
          // @ts-expect-error
          .authorization([a.allow.resource(myFunc as any).to(['query'])]),
      })
      .authorization([a.allow.public()]);

    expect(() => schema.transform()).toThrow(
      'Lambda resource authorization is only confiugrable at the schema level',
    );
  });
});
