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
