import { basicCRUDL } from '../test-cases/basic-crudl';
import { runTestCases, Client } from '../utils';
import type { Schema } from '../amplify/data/resource';

async function deleteAll() {
  console.log('starting cleanup..');
  const client = (global as any).client as Client;

  const { data: todos } = await client.models.Todo.list();
  console.log('todos to delete:', todos);

  const deletePromises = todos?.map(async (todo: Schema['Todo']['type']) => {
    await client.models.Todo.delete(todo);
  });

  await Promise.all(deletePromises!);

  const { data: listAfterDelete } = await client.models.Todo.list();
  console.log('result of cleanup:', listAfterDelete);
}

describe('API CRUDL operations', () => {
  afterEach(async () => {
    await deleteAll();
  });
  runTestCases(basicCRUDL);
});
