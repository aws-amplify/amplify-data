import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { a } from '../src/index';
import { ModelField, InternalField, __modelFieldAuth } from '../src/ModelField';
import {
  ModelRelationalField,
  InternalRelationalField,
} from '../src/ModelRelationalField';
import { Authorization, ImpliedAuthFields } from '../src/Authorization';

// evaluates type defs in corresponding test-d.ts file
it('should not produce static type errors', async () => {
  await expectTypeTestsToPassAsync(__filename);
});

describe('field level auth', () => {
  it('implied field types can be inferred', () => {
    const field = a
      .string()
      .array()
      .authorization((allow) => [
        allow.publicApiKey().to(['read']),
        allow.authenticated().to(['read', 'create']),
        allow.ownersDefinedIn('admin').to(['read', 'create', 'delete']),
      ]);

    type ExpectedAuthFields =
      typeof field extends ModelField<any, any, infer Auth>
        ? Auth extends Authorization<any, any, any>
          ? ImpliedAuthFields<Auth>
          : never
        : never;

    const authFields: ExpectedAuthFields = {
      admin: ['array', 'of', 'string'],
    };

    const brokenAuthFieldsB: ExpectedAuthFields = {
      // @ts-expect-error
      admin: 'just a regular string',
    };
  });

  it('implied field types can be inferred from related model fields', () => {
    const field = a
      .belongsTo('Widget', 'widgetId')
      .authorization((allow) => [
        allow.publicApiKey().to(['read']),
        allow.authenticated().to(['read', 'create']),
        allow.ownersDefinedIn('admin').to(['read', 'create', 'delete']),
      ]);

    type ExpectedAuthFields =
      typeof field extends ModelRelationalField<any, any, any, infer Auth>
        ? Auth extends Authorization<any, any, any>
          ? ImpliedAuthFields<Auth>
          : never
        : never;

    const authFields: ExpectedAuthFields = {
      admin: ['array', 'of', 'string'],
    };

    const brokenAuthFieldsB: ExpectedAuthFields = {
      // @ts-expect-error
      admin: 'just a regular string',
    };
  });

  it('implied fields objects can be extracted', () => {
    const field = a
      .string()
      .array()
      .authorization((allow) => [
        allow.publicApiKey().to(['read']),
        allow.authenticated().to(['read', 'create']),
        allow.ownersDefinedIn('admin').to(['read', 'create', 'delete']),
        allow
          .ownersDefinedIn('admin')
          .to(['read', 'create', 'delete'])
          .identityClaim('identityClaimValue'),
      ]) as InternalField;

    expect(field.data.authorization).toMatchSnapshot();
  });

  it('implied fields objects can be extracted from related model fields', () => {
    const field = a
      .belongsTo('Widget', 'widgetId')
      .authorization((allow) => [
        allow.publicApiKey().to(['read']),
        allow.authenticated().to(['read', 'create']),
        allow.ownersDefinedIn('admin').to(['read', 'create', 'delete']),
        allow
          .ownersDefinedIn('admin')
          .to(['read', 'create', 'delete'])
          .identityClaim('identityClaimValue'),
      ]) as InternalRelationalField;

    expect(field.data.authorization).toMatchSnapshot();
  });
});
