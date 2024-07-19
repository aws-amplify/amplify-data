import {
  TestCase,
  Client,
  configureAmplifyAndGenerateClient,
  pause,
  establishWebsocket,
} from '../utils';
import type { Schema } from '../amplify/data/resource';
import { Hub } from 'aws-amplify/utils';
import { CONNECTION_STATE_CHANGE, ConnectionState } from 'aws-amplify/api';

// type Todo = Schema['Todo']['type'];

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

export const subscriptions: TestCase[] = [
  {
    label: 'Subscription (Create)',
    setup: async () => configureAmplifyAndGenerateClient(),
    action: async (client) => {
      establishWebsocket();

      await Hub.listen('api', (data: any) => {
        const { payload } = data;
        if (payload.event === CONNECTION_STATE_CHANGE) {
          const connectionState = payload.data
            .connectionState as ConnectionState;
          console.log('connection state---------', connectionState);
          // TODO: double check this (not sure which one signals completion):
          if (connectionState === ConnectionState.Connected) {
            // TODO: signal that we can now establish sub, then test
          }
        }
      });

      // TODO:
      // await client.models.Todo.onCreate().subscribe({
      //   next: (data) => console.log('sub result', data),
      //   error: (error) => console.log('sub error', error),
      // });
      return false;
    },
    cleanup: async (client) => await deleteAll(client),
  },
];
