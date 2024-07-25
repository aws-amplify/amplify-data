import { Amplify } from 'aws-amplify';
import {
  CONNECTION_STATE_CHANGE,
  ConnectionState,
  generateClient,
} from 'aws-amplify/data';
import { Hub, ConsoleLogger } from 'aws-amplify/utils';
import type { Schema } from './amplify/data/resource';
import outputs from './amplify_outputs.json';
import { WebSocket } from 'ws';

// TODO: use imported type from `aws-amplify/data` once it's fixed
export type Client = ReturnType<typeof generateClient<Schema>>;

type ConfigureAmplifyAndGenerateClientParams = {
  enableDebugLogging?: boolean;
  amplifyOptions?: any;
  apiClientOptions?: any;
};

/**
 * Configures Amplify and returns API client
 * @param enableDebugLogging - enables debug logging
 * @param amplifyOptions - options to pass to Amplify.configure
 * @param apiClientOptions - options to pass to generateClient
 * @returns API client
 */
export const configureAmplifyAndGenerateClient = ({
  enableDebugLogging = false,
  amplifyOptions = {},
  apiClientOptions = {},
}: ConfigureAmplifyAndGenerateClientParams): Client => {
  console.log('configuring Amplify and generating client..');
  Amplify.configure(outputs, amplifyOptions);

  if (enableDebugLogging) {
    ConsoleLogger.LOG_LEVEL = 'DEBUG';

    Hub.listen('core', (data: any) => {
      if (data.payload.event === 'configure') {
        console.log('API configuration details:', data.payload.data.API);
      }
    });
  }

  return generateClient<Schema>(apiClientOptions);
};

type EstablishWebsocketParams = {
  enableConnectionStateLogging?: boolean;
};

/**
 * Adds the WebSocket API globally.
 * Subscriptions do not work in Node.js environment without the WebSocket API.
 */
export const establishWebsocket = ({
  enableConnectionStateLogging = false,
}: EstablishWebsocketParams) => {
  (global as any).WebSocket = WebSocket;

  if (enableConnectionStateLogging) {
    Hub.listen('api', (data: any) => {
      const { payload } = data;
      if (payload.event === CONNECTION_STATE_CHANGE) {
        const connectionState = payload.data.connectionState as ConnectionState;
        console.log(
          'Connection state has changed. Connection state: ',
          connectionState,
        );
      }
    });
  }
};

/**
 * Util that takes model operation response and throws an error if errors
 * are present, or if the data is undefined.
 * @param response - model operation response
 * @param operation - operation name
 * @returns data from response
 */
export const expectDataReturnWithoutErrors = <T>(
  response: { data?: T; errors?: any },
  operation: string,
): T => {
  if (response.errors) {
    console.log(`error on ${operation}:`, response.errors);
    throw new Error(JSON.stringify(response.errors));
  }

  if (!response.data) {
    throw new Error(`no response data for ${operation}`);
  }

  return response.data;
};

/**
 * Function that listens for "Subscription ack" event, and once it receives it,
 * resolves.
 * Jest will timeout if the test does not complete within the default timeout of
 * 5 seconds, so no timeout handling is required.
 */
export const waitForSubscriptionAck = () =>
  new Promise<void>((resolve) => {
    const cancel = Hub.listen('api', async (data: any) => {
      const { payload } = data;
      // TODO: update once we add export:
      if (payload.event === 'Subscription ack') {
        console.log('Subscription ack received:', payload.data);
        // Stop listening for msgs once we receive the ack:
        cancel();
        // Resolve so test execution can continue:
        resolve();
      }
    });
  });
