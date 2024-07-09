import test1 from '../index';

// TODO: test for each CRUD operation:

test('todo', async () => {
  const [result] = await test1();
  expect(result.content).toBe('test content');
});
