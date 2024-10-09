[<- Back to summary](readme.md)

# Orphaned Integ Tests

#### [bd051f6474d8be69,](../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/auth-modes.ts#49)

##### [`../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/auth-modes.ts#49`](../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/auth-modes.ts#49)

~~~
  // #region covers 214c31dd2206bfca, 92f1e6d948bb2f1e, b7b5ef648a737b54, 2fcbfbd338e2b642, bd051f6474d8be69,
  // #region covers ba61062287418137, 89231235f277e013, f1c468dfd69b0c4a, a4e33f3ee41a3d19, 27d103ec9928e5ee
  // #region covers b73cd93b7f81ba2a, c8110784c3c7df69, 75bbbc970e89b3dc, 573fd6a09fd9031f, 565011bb938244a7
  describe('client', () => {
afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(async () => {
  const config = await buildAmplifyConfig(schema);
  Amplify.configure(config);
});

for (const authMode of authModes) {
  describe(authMode, () => {
    test('list()', async () => {
const { spy, generateClient } = mockedGenerateClient([
  { data: { listPosts: [] } },
]);
const client = generateClient<Schema>({ authMode: authMode });
await client.models.Post.list();

const [call] = spy.mock.calls;
const [_amplifyInstance, options] = call;

expect(options).toEqual(
  expect.objectContaining({
    authMode: authMode,
  }),
);
    });

    test('get()', async () => {
const { spy, generateClient } = mockedGenerateClient([
  { data: { getPost: {} } },
]);
const client = generateClient<Schema>({ authMode: authMode });

await client.models.Post.get({ id: 'abc' });

const [call] = spy.mock.calls;
const [_instance, options] = call;

expect(options).toEqual(
  expect.objectContaining({
    authMode: authMode,
  }),
);
    });

    test('create()', async () => {
const { spy, generateClient } = mockedGenerateClient([
  { data: { createPost: {} } },
]);
const client = generateClient<Schema>({ authMode: authMode });

await client.models.Post.create({ title: 'abc' });

const [call] = spy.mock.calls;
const [_instance, options] = call;

expect(options).toEqual(
  expect.objectContaining({
    authMode: authMode,
  }),
);
    });

    test('update()', async () => {
const { spy, generateClient } = mockedGenerateClient([
  { data: { updatePost: {} } },
]);
const client = generateClient<Schema>({ authMode: authMode });

await client.models.Post.update({ id: 'abc' });

const [call] = spy.mock.calls;
const [_instance, options] = call;

expect(options).toEqual(
  expect.objectContaining({
    authMode: authMode,
  }),
);
    });

    test('delete()', async () => {
const { spy, generateClient } = mockedGenerateClient([
  { data: { deletePost: {} } },
]);
const client = generateClient<Schema>({ authMode: authMode });

await client.models.Post.delete({ id: 'abc' });

const [call] = spy.mock.calls;
const [_instance, options] = call;

expect(options).toEqual(
  expect.objectContaining({
    authMode: authMode,
  }),
);
    });
  });
}
  });
  // #endregion
  // #endregion
  // #endregion
~~~

---

#### [3774e58f1afbc0d2](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/quickstart.ts#9)

##### [`../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/quickstart.ts#9`](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/quickstart.ts#9)

~~~
// #region covers ca66fb122174b9cc, ed16cc50ccab928b, 008dc549768a46b2, 29238ffc8ab45ff8, 3774e58f1afbc0d2
// #endregion
~~~

---

[<- Back to summary](readme.md)
