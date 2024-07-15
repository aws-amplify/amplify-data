import { TestCase, Client, configureAmplifyAndGenerateClient } from '../utils';
import type { Schema } from '../amplify/data/resource';

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

export const basicCRUDL: TestCase[] = [
  {
    label: 'Create',
    setup: async () => configureAmplifyAndGenerateClient(),
    action: async (client) => {
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

      // TODO: better assertion:
      return newTodo.content === 'test create';
    },
    cleanup: async (client) => await deleteAll(client),
  },
  {
    label: 'Read',
    setup: async () => configureAmplifyAndGenerateClient(),
    action: async (client) => {
      const { errors: firstCreateErrors } = await client.models.Todo.create({
        content: 'todo1',
      });

      if (firstCreateErrors) {
        console.log('error on create:', firstCreateErrors);
        throw new Error(JSON.stringify(firstCreateErrors));
      }

      const { data: secondNewTodo, errors: secondCreateErrors } =
        await client.models.Todo.create({
          content: 'todo2',
        });

      if (secondCreateErrors) {
        console.log('error on create:', firstCreateErrors);
        throw new Error(JSON.stringify(secondCreateErrors));
      }

      if (!secondNewTodo) {
        throw new Error('secondNewTodo is undefined');
      }

      // Get the first todo:
      const { data: getTodo, errors: readErrors } =
        await client.models.Todo.get({ id: secondNewTodo.id });

      if (readErrors) {
        console.log('error getting todo:', readErrors);
        throw new Error(JSON.stringify(readErrors));
      }

      if (!getTodo) {
        throw new Error('get todo is undefined');
      }

      // TODO: better assertion:
      return getTodo.content === 'todo2';
    },
    cleanup: async (client) => await deleteAll(client),
  },
  {
    label: 'Update',
    setup: async () => configureAmplifyAndGenerateClient(),
    action: async (client) => {
      const { data: originalTodo, errors: createErrors } =
        await client.models.Todo.create({
          content: 'original content',
        });

      if (createErrors) {
        console.log('createErrors:', createErrors);
        throw new Error(JSON.stringify(createErrors));
      }

      if (!originalTodo) {
        throw new Error('newTodo is undefined');
      }

      const { data: updatedTodo, errors: updateErrors } =
        await client.models.Todo.update({
          id: originalTodo.id,
          content: 'test content',
        });

      if (updateErrors) {
        console.log('updateErrors:', updateErrors);
        throw new Error(JSON.stringify(updateErrors));
      }

      if (!updatedTodo) {
        throw new Error('updatedTodo is undefined');
      }

      // TODO: better assertion:
      return updatedTodo.content === 'test content';
    },
    cleanup: async (client) => await deleteAll(client),
  },
  {
    label: 'Delete',
    setup: async () => configureAmplifyAndGenerateClient(),
    action: async (client) => {
      const { data: newTodo, errors: createErrors } =
        await client.models.Todo.create({
          content: 'test content',
        });

      if (createErrors) {
        console.log('createErrors:', createErrors);
        throw new Error(JSON.stringify(createErrors));
      }

      if (!newTodo) {
        throw new Error('newTodo is undefined');
      }

      const { data: deletedTodo, errors: deleteErrors } =
        await client.models.Todo.delete(newTodo);

      if (deleteErrors) {
        console.log('deleteErrors:', createErrors);
        throw new Error(JSON.stringify(createErrors));
      }

      if (!deletedTodo) {
        throw new Error('deletedTodo is undefined');
      }

      // TODO: better assertion:
      return deletedTodo.content === 'test content';
    },
    cleanup: async (client) => await deleteAll(client),
  },
  {
    label: 'List',
    setup: async () => configureAmplifyAndGenerateClient(),
    action: async (client) => {
      await client.models.Todo.create({
        content: 'todo1',
      });

      await client.models.Todo.create({
        content: 'todo2',
      });

      await client.models.Todo.create({
        content: 'todo3',
      });

      const { data: listTodos } = await client.models.Todo.list();

      return listTodos.length === 3;
    },
    cleanup: async (client) => await deleteAll(client),
  },
];
