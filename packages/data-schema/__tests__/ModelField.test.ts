import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { a } from '../src/index';
import { _Internal_ModelField, InternalField, __auth } from '../src/ModelField';
import {
  _Internal_ModelRelationalField,
  InternalRelationalField,
} from '../src/ModelRelationalField';
import {
  _Internal_Authorization,
  ImpliedAuthFields,
} from '../src/Authorization';

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
      typeof field extends _Internal_ModelField<any, any, infer Auth>
        ? Auth extends _Internal_Authorization<any, any, any>
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
      typeof field extends _Internal_ModelRelationalField<
        any,
        any,
        any,
        infer Auth
      >
        ? Auth extends _Internal_Authorization<any, any, any>
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
