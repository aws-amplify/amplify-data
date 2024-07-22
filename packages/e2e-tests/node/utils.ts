import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { Hub, ConsoleLogger } from 'aws-amplify/utils';
import type { Schema } from './amplify/data/resource';
import outputs from './amplify_outputs.json';

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

  return generateClient<Schema>(apiClientOptions);
};

/**
 * Util that takes model operation response and throws an error if errors
 * are present, or if the data is undefined.
 * @param response - model operation response
 * @param operation - operation name
 * @returns data from response
 */
export const handleErrorsAndData = <T>(
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
