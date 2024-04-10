import type { Equal, Expect, Prettify } from '@aws-amplify/data-schema-types';
import { a, type ClientSchema } from '../../index';
import type {
  ModelTypesClient,
  ModelIdentifier,
  ClientExtensions,
  ClientExtensionsSSRCookies,
  ClientExtensionsSSRRequest,
  ExtractModelMeta,
  ModelPath,
  ResolvedModel,
} from '../../src/runtime';

describe('client extension types', () => {
  const schema = a
    .schema({
      Model: a.model({
        description: a.string(),
      }),
    })
    .authorization([a.allow.public()]);
  type Schema = ClientSchema<typeof schema>;
  type Extensions = ClientExtensions<Schema>;
  type CookieExtensions = ClientExtensionsSSRCookies<Schema>;
  type RequestExtensions = ClientExtensionsSSRRequest<Schema>;

  // type Meta = ExtractModelMeta<Schema>['Model'];
  // type Identifier = ModelIdentifier<Meta>;
  // type Resolved = ResolvedModel<Schema['Model']>;
  // type Path = ReadonlyArray<ModelPath<Resolved>>;
  // type TTTT = Prettify<ModelTypesClient<Schema['Model'], Meta>>['get'];

  describe('model get args', () => {
    test('web client component types', async () => {
      type Get = Extensions['models']['Model']['get'];
      const get = {} as Get;
      const rv = await get({ id: 'something' });
      type GetArgs = Parameters<typeof get>;
      type RT = typeof rv.data;
      type Expected = Schema['Model'];
      type T_ModelFields = Expect<Equal<Actual, Expected>>;
    });

    test('web client', async () => {
      type Get = Extensions['models']['Model']['get'];
      type GetArgs = Parameters<Get>;
      const get = {} as Get;
      const rv = await get({ id: '123' });
      type RT = typeof rv.data;
      type Expected = Schema['Model'];
      type T_ModelFields = Expect<Equal<Actual, Expected>>;
    });
  });
});
