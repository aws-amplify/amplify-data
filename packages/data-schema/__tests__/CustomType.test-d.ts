import type { Equal, Expect } from '@aws-amplify/data-schema-types';
import { type CustomType, customType } from '../src/CustomType';
import { type ModelField, Nullable, string, ModelFieldType } from '../src/ModelField';

import { float } from '../src/a';
import { EnumType, enumType } from '../src/EnumType';
import { a, type ClientSchema } from '../src/index';

describe('CustomType', () => {
  test('Basic CustomType', () => {
    const cType = customType({
      lat: float(),
      long: float(),
    });

    type Expected = CustomType<{
      fields: {
        lat: ModelField<Nullable<number>, never, undefined, ModelFieldType.Float>;
        long: ModelField<Nullable<number>, never, undefined, ModelFieldType.Float>;
      };
    }>;

    type Result = typeof cType;

    type test = Expect<Equal<Result, Expected>>;
  });

  test('Nested CustomType', () => {
    const cType = customType({
      content: string().required(),
      meta: customType({
        enumField: enumType(['value1', 'value2']),
        deepMeta: customType({
          description: string().required(),
        }),
      }),
    });

    type Expected = CustomType<{
      fields: {
        content: ModelField<string, 'required', undefined, ModelFieldType.String>;
        meta: CustomType<{
          fields: {
            enumField: EnumType<readonly ['value1', 'value2']>;
            deepMeta: CustomType<{
              fields: {
                description: ModelField<string, 'required', undefined, ModelFieldType.String>;
              };
            }>;
          };
        }>;
      };
    }>;

    type Result = typeof cType;

    type test = Expect<Equal<Result, Expected>>;
  });
});

// https://github.com/aws-amplify/amplify-data/issues/423
describe('CustomType with cyclic references', () => {
  const schema = a.schema({
    MasterTenantTable: a
      .model({
        pk: a.string().required(),
        sk: a.string().required(),
        company_id: a.id(),
        company: a.ref('Company'),
      })
      .authorization((allow) => [allow.publicApiKey()]),
    Tenant: a.customType({
      company: a.ref('Company'),
      company_id: a.id().required(),
    }),
    Company: a.customType({
      tenants: a.ref('Tenant').array(),
    }),
    TreeNode: a.customType({
      value: a.string(),
      parent: a.ref('TreeNode'),
    }),
    getCompanyById: a
      .query()
      .arguments({ company_id: a.id().required() })
      .returns(a.ref('Tenant').array())
      .authorization((allow) => [allow.authenticated()])
      .handler(
        a.handler.custom({
          dataSource: a.ref('MasterTenantTable'),
          entry: './company-resolvers/getCompanyById.js',
        }),
      ),
    getTree: a
      .query()
      .returns(a.ref('TreeNode'))
      .authorization((allow) => [allow.authenticated()])
      .handler(a.handler.function('myFunc')),
  });

  type Schema = ClientSchema<typeof schema>;
  type Tenant = Schema['Tenant']['type'];
  type Company = Schema['Company']['type'];
  type TreeNode = Schema['TreeNode']['type'];

  test('mutually referencing custom types resolve', () => {
    type _tenant = Expect<
      Equal<Tenant, { company?: Company | null; company_id: string }>
    >;
    type _company = Expect<
      Equal<Company, { tenants?: (Tenant | null | undefined)[] | null }>
    >;
  });

  test('self referencing custom type resolves', () => {
    type _tree = Expect<
      Equal<TreeNode, { value?: string | null; parent?: TreeNode | null }>
    >;
    type _deep = Expect<
      Equal<
        NonNullable<NonNullable<TreeNode['parent']>['parent']>['value'],
        string | null | undefined
      >
    >;
  });

  test('model field referencing a cyclic custom type resolves', () => {
    type Model = Schema['MasterTenantTable']['type'];
    type _ = Expect<Equal<NonNullable<Model['company']>, Company>>;
  });

  test('custom operation returning a cyclic custom type resolves', () => {
    type _returns = Expect<
      Equal<
        Schema['getCompanyById']['returnType'],
        (Tenant | null | undefined)[] | null | undefined
      >
    >;
    type _tree = Expect<
      Equal<Schema['getTree']['returnType'], TreeNode | null | undefined>
    >;
  });
});
