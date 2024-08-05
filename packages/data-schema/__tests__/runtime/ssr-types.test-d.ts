import { a, ClientSchema } from '../../src/index';
import {
  ClientExtensions,
  ClientExtensionsSSRCookies,
  ClientExtensionsSSRRequest,
} from '../../src/runtime/client/index';
import { Expect, Equal } from '@aws-amplify/data-schema-types';

describe('method return types', () => {
  const schema = a
    .schema({
      Parent: a.model({
        name: a.string(),
        children: a.hasMany('Child', 'parentId'),
      }),
      Child: a.model({
        name: a.string(),
        parentId: a.id(),
        parent: a.belongsTo('Parent', 'parentId'),
      }),
      MyCustomType: a.customType({
        value: a.string(),
      }),
      operate: a
        .query()
        .arguments({ id: a.string() })
        .returns(a.ref('MyCustomType'))
        .authorization((allow) => [allow.publicApiKey()])
        .handler(a.handler.function('asdf')),
    })
    .authorization((allow) => [allow.publicApiKey()]);

  type Schema = ClientSchema<typeof schema>;

  const normalClient = {} as ClientExtensions<Schema>;
  const cookiesClient = {} as ClientExtensionsSSRCookies<Schema>;
  const requestClient = {} as ClientExtensionsSSRRequest<Schema>;

  test('create request results match normal client', async () => {
    const { data: normalData } = await normalClient.models.Parent.create({});
    const { data: cookiesData } = await cookiesClient.models.Parent.create({});
    const { data: requestData } = await requestClient.models.Parent.create(
      {} as any,
      {},
    );

    type _testCookiesClient = Expect<
      Equal<typeof cookiesData, typeof normalData>
    >;

    type _testRequestClient = Expect<
      Equal<typeof requestData, typeof normalData>
    >;
  });

  test('update request results match normal client', async () => {
    const { data: normalData } = await normalClient.models.Parent.update({
      id: 'some-id',
    });
    const { data: cookiesData } = await cookiesClient.models.Parent.update({
      id: 'some-id',
    });
    const { data: requestData } = await requestClient.models.Parent.update(
      {} as any,
      { id: 'some-id' },
    );

    type _testCookiesClient = Expect<
      Equal<typeof cookiesData, typeof normalData>
    >;

    type _testRequestClient = Expect<
      Equal<typeof requestData, typeof normalData>
    >;
  });

  test('delete request results match normal client', async () => {
    const { data: normalData } = await normalClient.models.Parent.delete({
      id: 'some-id',
    });
    const { data: cookiesData } = await cookiesClient.models.Parent.delete({
      id: 'some-id',
    });
    const { data: requestData } = await requestClient.models.Parent.delete(
      {} as any,
      { id: 'some-id' },
    );

    type _testCookiesClient = Expect<
      Equal<typeof cookiesData, typeof normalData>
    >;

    type _testRequestClient = Expect<
      Equal<typeof requestData, typeof normalData>
    >;
  });

  test('get request results match normal client', async () => {
    const { data: normalData } = await normalClient.models.Parent.get({
      id: 'some-id',
    });
    const { data: cookiesData } = await cookiesClient.models.Parent.get({
      id: 'some-id',
    });
    const { data: requestData } = await requestClient.models.Parent.get(
      {} as any,
      {
        id: 'some-id',
      },
    );

    type _testCookiesClient = Expect<
      Equal<typeof cookiesData, typeof normalData>
    >;

    type _testRequestClient = Expect<
      Equal<typeof requestData, typeof normalData>
    >;
  });

  test('list request results match normal client', async () => {
    const { data: normalData } = await normalClient.models.Parent.list();
    const { data: cookiesData } = await cookiesClient.models.Parent.list();
    const { data: requestData } = await requestClient.models.Parent.list(
      {} as any,
    );

    type _testCookiesClient = Expect<
      Equal<typeof cookiesData, typeof normalData>
    >;

    type _testRequestClient = Expect<
      Equal<typeof requestData, typeof normalData>
    >;
  });

  test('custom operation results match normal client', async () => {
    const { data: normalData } = await normalClient.queries.operate({
      id: 'some-id',
    });
    const { data: cookiesData } = await cookiesClient.queries.operate({
      id: 'some-id',
    });
    const { data: requestData } = await requestClient.queries.operate(
      {} as any,
      {
        id: 'some-id',
      },
    );

    type _testCookiesClient = Expect<
      Equal<typeof cookiesData, typeof normalData>
    >;

    type _testRequestClient = Expect<
      Equal<typeof requestData, typeof normalData>
    >;
  });

  // Subscription type operations are omitted as they aren't supported in SSR contexts.
});
