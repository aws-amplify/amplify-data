import { configureAmplifyAndGenerateClient, pause } from './utils';
// import type { Schema } from '../amplify/data/resource';
// import { CONNECTION_STATE_CHANGE, ConnectionState } from 'aws-amplify/data';
import { Hub, ConsoleLogger } from 'aws-amplify/utils';

// eslint-disable-next-line import/no-extraneous-dependencies
import { WebSocket } from 'ws';
(global as any).WebSocket = WebSocket;

ConsoleLogger.LOG_LEVEL = 'DEBUG';

const client = await configureAmplifyAndGenerateClient();

// const wss = new WebSocketServer({ port: 8080 });
// console.log(wss);

// await wss.on('connection', function connection(ws: any) {
//   console.log('new client connected');
//   // sending message to client
//   ws.send('Welcome, you are connected!');
//   //on message from client
//   ws.on('message', (data: any) => {
//     console.log(`Client has sent us: ${data}`);
//   });
//   // handling what to do when clients disconnects from server
//   ws.on('close', () => {
//     console.log('the client has connected');
//   });
//   // handling client connection error
//   ws.onerror = function () {
//     console.log('Some Error occurred');
//   };
//   console.log('something is happening in ws--------');
//   ws.send('something ws------------------');
//   ws.send('something ws------------------');
//   ws.send('something ws------------------');
// });

Hub.listen('api', (data: any) => {
  console.log('all hub data----------------', data);
});

Hub.listen('auth', (data) => {
  console.log('auth stuff------------------', data);
});

await client.models.Todo.onCreate().subscribe({
  next: (data) => console.log('sub result-----------------', data),
  error: (error) => console.log('sub error-------------------', error),
});

console.log('before pause');
await pause(2000);
console.log('after pause');

const { data: newTodo, errors: createErrors } = await client.models.Todo.create(
  {
    content: 'test create',
  },
);

console.log('RESULT OF CREATE--------------------------------------');
console.log('new todo', newTodo);
console.log('create errors', createErrors);

console.log('before pause');
await pause(3000);
console.log('after pause');

const { data: newTodo2, errors: createErrors2 } =
  await client.models.Todo.create({
    content: 'test create',
  });

console.log('RESULT OF CREATE--------------------------------------');
console.log('new todo', newTodo2);
console.log('create errors', createErrors2);

console.log('before pause');
await pause(5000);
console.log('after pause');

const { data: newTodo3, errors: createErrors3 } =
  await client.models.Todo.create({
    content: 'test create',
  });

console.log('RESULT OF CREATE--------------------------------------');
console.log('new todo', newTodo3);
console.log('create errors', createErrors3);

console.log('before pause');
await pause(10000);
console.log('after pause');

const { data: newTodo4, errors: createErrors4 } =
  await client.models.Todo.create({
    content: 'test create',
  });

console.log('RESULT OF CREATE--------------------------------------');
console.log('new todo', newTodo4);
console.log('create errors', createErrors4);

console.log('before pause');
await pause(10000);
console.log('after pause');
