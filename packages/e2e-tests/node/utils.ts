import { Amplify } from 'aws-amplify';
import {
  CONNECTION_STATE_CHANGE,
  ConnectionState,
  generateClient,
} from 'aws-amplify/data';
import { Hub, ConsoleLogger } from 'aws-amplify/utils';
import type { Schema } from './amplify/data/resource';
import outputs from './amplify_outputs.json';
// @ts-expect-error - TODO: investigate why this import is throwing an error
// eslint-disable-next-line import/no-extraneous-dependencies
import { WebSocket } from 'ws';

// TODO: use imported type from `aws-amplify/data` once it's fixed
export type Client = ReturnType<typeof generateClient<Schema>>;

type ConfigureAmplifyAndGenerateClientParams = {
  disableDebugLogging?: boolean;
  amplifyOptions?: any;
  apiClientOptions?: any;
};

/**
 * Configures Amplify and returns API client
 * @param disableDebugLogging - disables debug logging
 * @param amplifyOptions - options to pass to Amplify.configure
 * @param apiClientOptions - options to pass to generateClient
 * @returns API client
 */
export const configureAmplifyAndGenerateClient = ({
  disableDebugLogging = false,
  amplifyOptions = {},
  apiClientOptions = {},
}: ConfigureAmplifyAndGenerateClientParams): Client => {
  console.log('configuring Amplify and generating client..');
  Amplify.configure(outputs, amplifyOptions);

  /**
   * Debug logs are enabled by default to assist with CI failure debugging.
   * Option to disable is included for local development, in the event that
   * the debug logs are too verbose.
   */
  if (!disableDebugLogging) {
    ConsoleLogger.LOG_LEVEL = 'DEBUG';

    Hub.listen('core', (data: any) => {
      if (data.payload.event === 'configure') {
        console.log('API configuration details:', data.payload.data.API);
      }
    });
  }

  const client = generateClient<Schema>(apiClientOptions);

  return client;
};

/**
 * Util for pausing test execution.
 */
export async function pause(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type EstablishWebsocketParams = {
  disableConnectionStateLogging?: boolean;
};

/**
 * Adds the WebSocket API globally.
 * Subscriptions do not work in Node.js environment without the WebSocket API.
 */
export const establishWebsocket = ({
  disableConnectionStateLogging = false,
}: EstablishWebsocketParams): any => {
  (global as any).WebSocket = WebSocket;

  /**
   * Debug logs are enabled by default to assist with CI failure debugging.
   * Option to disable is included for local development, in the event that
   * the debug logs are too verbose.
   */
  if (!disableConnectionStateLogging) {
    // https://docs.amplify.aws/gen1/javascript/build-a-backend/graphqlapi/subscribe-data/#subscription-connection-status-updates
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
