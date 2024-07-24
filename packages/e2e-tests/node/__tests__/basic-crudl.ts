import {
  Client,
  configureAmplifyAndGenerateClient,
  expectDataReturnWithoutErrors,
} from '../utils';
import type { Schema } from '../amplify/data/resource';

let client: Client;

const deleteAll = async (client: Client) => {
  const { data: todos } = await client.models.Todo.list();
  console.log('todos to delete:', todos);

  const deletePromises = todos?.map(async (todo: Schema['Todo']['type']) => {
    await client.models.Todo.delete(todo);
  });

  await Promise.all(deletePromises!);

  const { data: listAfterDelete } = await client.models.Todo.list();
  console.log('result of cleanup:', listAfterDelete);
};

describe('Basic CRUDL', () => {
  beforeEach(() => {
    client = configureAmplifyAndGenerateClient({});
  });
  afterEach(async () => {
    await deleteAll(client);
  });
  test('Create', async () => {
    const response = await client.models.Todo.create({
      content: 'test create',
    });

    const data = expectDataReturnWithoutErrors(response, 'create');

    expect(data?.content).toBe('test create');
  });
  test('Read', async () => {
    const response = await client.models.Todo.create({
      content: 'todo1',
    });

    expectDataReturnWithoutErrors(response, 'first create');

    const secondResponse = await client.models.Todo.create({
      content: 'todo2',
    });

    const secondTodo = expectDataReturnWithoutErrors(
      secondResponse,
      'second create',
    );

    // Get the first todo:
    const getResponse = await client.models.Todo.get({
      // expectDataReturnWithoutErrors will throw if this doesn't exist:
      id: secondTodo!.id,
    });

    expectDataReturnWithoutErrors(getResponse, 'create');

    expect(getResponse.data?.content).toBe('todo2');
  });
  test('Update', async () => {
    const createResponse = await client.models.Todo.create({
      content: 'original content',
    });

    const firstTodo = expectDataReturnWithoutErrors(createResponse, 'create');

    const updateResponse = await client.models.Todo.update({
      // expectDataReturnWithoutErrors will throw if this doesn't exist:
      id: firstTodo!.id,
      content: 'updated content',
    });

    const updatedTodo = expectDataReturnWithoutErrors(updateResponse, 'update');

    // expectDataReturnWithoutErrors will throw if this doesn't exist:
    expect(updatedTodo!.content).toBe('updated content');
  });
  test('Delete', async () => {
    const createResponse = await client.models.Todo.create({
      content: 'todo to delete',
    });

    const createdTodo = expectDataReturnWithoutErrors(createResponse, 'create');

    // expectDataReturnWithoutErrors will throw if this doesn't exist:
    const deleteResponse = await client.models.Todo.delete(createdTodo!);

    const deletedTodo = expectDataReturnWithoutErrors(deleteResponse, 'delete');

    // expectDataReturnWithoutErrors will throw if this doesn't exist:
    expect(deletedTodo!.content).toBe('todo to delete');
  });
  test('List', async () => {
    const firstCreateResponse = await client.models.Todo.create({
      content: 'todo1',
    });
    expectDataReturnWithoutErrors(firstCreateResponse, 'first create');

    const secondCreateResponse = await client.models.Todo.create({
      content: 'todo2',
    });
    expectDataReturnWithoutErrors(secondCreateResponse, 'second create');

    const thirdCreateResponse = await client.models.Todo.create({
      content: 'todo3',
    });
    expectDataReturnWithoutErrors(thirdCreateResponse, 'third create');

    const listResponse = await client.models.Todo.list();
    expectDataReturnWithoutErrors(listResponse, 'list');

    expect(listResponse.data.length).toBe(3);
  });
});
