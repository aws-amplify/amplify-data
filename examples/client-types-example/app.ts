import { API } from 'aws-amplify';
import type { Schema } from './resource';

const client = API.generateClient<Schema>();

async function test() {
  const todos = await client.models.Todo.list();

  const newTodo = await client.models.Todo.create({
    title: 'Test',
  });
}
