import {
  configureAmplifyAndGenerateClient,
  enableDebugLogging,
  establishWebsocket,
  pause,
} from './utils';
// import type { Schema } from '../amplify/data/resource';
// import { CONNECTION_STATE_CHANGE, ConnectionState } from 'aws-amplify/data';
import { Hub, ConsoleLogger } from 'aws-amplify/utils';

enableDebugLogging();
establishWebsocket();

await pause(500);

ConsoleLogger.LOG_LEVEL = 'DEBUG';

const client = await configureAmplifyAndGenerateClient();

Hub.listen('api', (data: any) => {
  console.log('all hub data----------------', data);
});

const subResults: any[] = [];

await pause(2000);

await client.models.Todo.onCreate().subscribe({
  next: (data) => subResults.push(data),
  error: (error) => subResults.push(error),
});

await client.models.Todo.create({
  content: 'todo1',
});

await client.models.Todo.create({
  content: 'todo2',
});

await client.models.Todo.create({
  content: 'todo3',
});

await pause(10000);

console.log('subResults', subResults);
console.log('subResults', subResults);
console.log('subResults', subResults);
console.log('subResults', subResults);
console.log('subResults', subResults);
console.log('subResults', subResults);
console.log('subResults', subResults);
console.log('subResults', subResults);
console.log('subResults', subResults);
