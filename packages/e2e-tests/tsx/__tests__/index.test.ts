import testCreate from '../index';

// TODO: test for each CRUD operation:

describe('API CRUD operations', () => {
  test('create', async () => {
    const result = await testCreate();
    // TODO:
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(result.content).toBe('test content');
  });
});

//  process.exit(1);
