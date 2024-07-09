import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from './amplify/data/resource';
import outputs from './amplify_outputs.json';

Amplify.configure(outputs);

const client = generateClient<Schema>();

const { data: todo, errors: createErrors } = await client.models.Todo.create({
  content: `${Date.now()}`,
});

console.log('created todo:', todo);
console.log('create errors:', createErrors);

console.log('delete all');

const { data: todos, errors } = await client.models.Todo.list();
console.log(errors);

console.log('starting delete for', todos);

const deletePromises = todos?.map(async (todo: Schema['Todo']['type']) => {
  await client.models.Todo.delete(todo);
});

await Promise.all(deletePromises!);

process.exit(1);

// configureAmplify()
//   .then((configureResult) => {
//     console.log(configureResult);
//     return getClient();
//   })
//   .then(() => {
//     return createRecord();
//   })
//   .then((createResult) => {
//     console.log('create result:', createResult);
//   })
//   .then(() => {
//     return deleteAll();
//   })
//   .then(() => {
//     console.log('exiting..');
//     process.exit(0);
//   })
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
