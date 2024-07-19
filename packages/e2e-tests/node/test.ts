import { configureAmplifyAndGenerateClient, pause } from './utils';
// import type { Schema } from '../amplify/data/resource';
// import { CONNECTION_STATE_CHANGE, ConnectionState } from 'aws-amplify/data';
import { Hub } from 'aws-amplify/utils';

const client = await configureAmplifyAndGenerateClient();

await Hub.listen('api', (data: any) => {
  console.log('all hub data----------------', data);
  // const { payload } = data;
  // if (payload.event === CONNECTION_STATE_CHANGE) {
  //   const connectionState = payload.data
  //     .connectionState as ConnectionState;
  //   console.log('connectoin stuff---------', connectionState);
  // }
});

await client.models.Todo.onCreate().subscribe({
  next: (data) => console.log('sub result-------------', data),
  error: (error) => console.log('sub error----------------', error),
});

console.log('before pause');
await pause(2000);
console.log('after pause');

const { data: newTodo, errors: createErrors } = await client.models.Todo.create(
  {
    content: 'test create',
  },
);

console.log('new todo', newTodo);
console.log('create errors', createErrors);

console.log('before pause');
await pause(3000);
console.log('after pause');

const { data: newTodo2, errors: createErrors2 } =
  await client.models.Todo.create({
    content: 'test create',
  });

console.log('new todo', newTodo2);
console.log('create errors', createErrors2);

console.log('before pause');
await pause(5000);
console.log('after pause');

const { data: newTodo3, errors: createErrors3 } =
  await client.models.Todo.create({
    content: 'test create',
  });

console.log('new todo', newTodo3);
console.log('create errors', createErrors3);

console.log('before pause');
await pause(10000);
console.log('after pause');

const { data: newTodo4, errors: createErrors4 } =
  await client.models.Todo.create({
    content: 'test create',
  });

console.log('new todo', newTodo4);
console.log('create errors', createErrors4);

console.log('before pause');
await pause(10000);
console.log('after pause');
