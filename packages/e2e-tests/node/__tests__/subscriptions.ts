import {
  Client,
  configureAmplifyAndGenerateClient,
  establishWebsocket,
  pause,
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

describe('Subscriptions', () => {
  beforeAll(() => {
    establishWebsocket({ disableConnectionStateLogging: true });
  });
  beforeEach(() => {
    client = configureAmplifyAndGenerateClient({ disableDebugLogging: true });
  });
  afterEach(async () => {
    await deleteAll(client);
  });
  test('Create', async () => {
    const subResult: any[] = [];

    await client.models.Todo.onCreate().subscribe({
      next: (data) => subResult.push(data),
      error: (error) => console.log('sub error', error),
    });

    const { data: newTodo, errors: createErrors } =
      await client.models.Todo.create({
        content: 'test create',
      });

    if (createErrors) {
      console.log('createErrors:', createErrors);
      throw new Error(JSON.stringify(createErrors));
    }

    if (!newTodo) {
      throw new Error('newTodo is undefined');
    }

    await pause(2000);

    console.log('yo-------------------------', subResult);
    console.log('yo-------------------------', subResult);
    console.log('yo-------------------------', subResult);

    expect(newTodo.content).toBe('test create');
  });
  //   test('Read', async () => {
  //     const { errors: firstCreateErrors } = await client.models.Todo.create({
  //       content: 'todo1',
  //     });

  //     if (firstCreateErrors) {
  //       console.log('error on create:', firstCreateErrors);
  //       throw new Error(JSON.stringify(firstCreateErrors));
  //     }

  //     const { data: secondNewTodo, errors: secondCreateErrors } =
  //       await client.models.Todo.create({
  //         content: 'todo2',
  //       });

  //     if (secondCreateErrors) {
  //       console.log('error on create:', firstCreateErrors);
  //       throw new Error(JSON.stringify(secondCreateErrors));
  //     }

  //     if (!secondNewTodo) {
  //       throw new Error('secondNewTodo is undefined');
  //     }

  //     // Get the first todo:
  //     const { data: getTodo, errors: readErrors } = await client.models.Todo.get({
  //       id: secondNewTodo.id,
  //     });

  //     if (readErrors) {
  //       console.log('error getting todo:', readErrors);
  //       throw new Error(JSON.stringify(readErrors));
  //     }

  //     if (!getTodo) {
  //       throw new Error('get todo is undefined');
  //     }

  //     expect(getTodo.content).toBe('todo2');
  //   });
  //   test('Update', async () => {
  //     const { data: originalTodo, errors: createErrors } =
  //       await client.models.Todo.create({
  //         content: 'original content',
  //       });

  //     if (createErrors) {
  //       console.log('createErrors:', createErrors);
  //       throw new Error(JSON.stringify(createErrors));
  //     }

  //     if (!originalTodo) {
  //       throw new Error('originalTodo is undefined');
  //     }

  //     const { data: updatedTodo, errors: updateErrors } =
  //       await client.models.Todo.update({
  //         id: originalTodo.id,
  //         content: 'updated content',
  //       });

  //     if (updateErrors) {
  //       console.log('updateErrors:', updateErrors);
  //       throw new Error(JSON.stringify(updateErrors));
  //     }

  //     if (!updatedTodo) {
  //       throw new Error('updatedTodo is undefined');
  //     }

  //     expect(updatedTodo.content).toBe('updated content');
  //   });
  //   test('Delete', async () => {
  //     const { data: newTodo, errors: createErrors } =
  //       await client.models.Todo.create({
  //         content: 'todo to delete',
  //       });

  //     if (createErrors) {
  //       console.log('createErrors:', createErrors);
  //       throw new Error(JSON.stringify(createErrors));
  //     }

  //     if (!newTodo) {
  //       throw new Error('newTodo is undefined');
  //     }

  //     const { data: deletedTodo, errors: deleteErrors } =
  //       await client.models.Todo.delete(newTodo);

  //     if (deleteErrors) {
  //       console.log('deleteErrors:', createErrors);
  //       throw new Error(JSON.stringify(createErrors));
  //     }

  //     if (!deletedTodo) {
  //       throw new Error('deletedTodo is undefined');
  //     }

  //     expect(deletedTodo.content).toBe('todo to delete');
  //   });
  //   test('List', async () => {
  //     await client.models.Todo.create({
  //       content: 'todo1',
  //     });

  //     await client.models.Todo.create({
  //       content: 'todo2',
  //     });

  //     await client.models.Todo.create({
  //       content: 'todo3',
  //     });

  //     const { data: listTodos } = await client.models.Todo.list();

  //     expect(listTodos.length).toBe(3);
  //   });
});
