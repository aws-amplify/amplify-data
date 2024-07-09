import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from './amplify/data/resource';
import outputs from './amplify_outputs.json';

async function cleanup(client: any) {
  // const { data: todos, errors } = await client.models.Todo.list();
  const { data: todos } = await client.models.Todo.list();

  const deletePromises = todos?.map(async (todo: Schema['Todo']['type']) => {
    await client.models.Todo.delete(todo);
  });

  await Promise.all(deletePromises!);
}

export async function testCreate() {
  Amplify.configure(outputs);

  const client = generateClient<Schema>();

  const { data: newTodo, errors: createErrors } =
    await client.models.Todo.create({
      content: 'test content',
    });

  await cleanup(client);

  return createErrors || newTodo;
}

export default testCreate;
