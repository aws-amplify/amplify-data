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
  next: (data) => console.log('sub result', data),
  error: (error) => console.log('sub error', error),
});

console.log('before pause');
await pause(50000);
console.log('after pause');
