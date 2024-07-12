import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from './amplify/data/resource';
import outputs from './amplify_outputs.json';

export const statuses = {
  success: {
    icon: '✅',
    label: 'Success',
  },
  fail: {
    icon: '❌',
    label: 'Fail',
  },
} as const;

const _testCase = (success: boolean): any =>
  success ? statuses.success : statuses.fail;

// TODO: use imported type from `aws-amplify/data` once it's fixed
export type Client = ReturnType<typeof configureAmplifyAndGenerateClient>;

export type TestCase = {
  label: string;
  action: (client: Client) => Promise<boolean>;
};

/**
 * Given an array of test cases, runs each test case
 * and asserts that the result is successful
 * @param testCases
 * @param client
 */
export async function runTestCases(testCases: TestCase[]) {
  const client = (global as any).client as Client;

  for (const testCase of testCases) {
    test(`${testCase.label}`, async () => {
      let result: any;

      try {
        const response = await testCase.action(client);
        result = _testCase(response);
      } catch (error) {
        result = _testCase(false);
      }

      console.log(`${result.icon} ${testCase.label}`);
      expect(result.label).toBe(statuses.success.label);
    });
  }
}

/**
 * Configures Amplify and returns API client
 * @returns API client
 */
export function configureAmplifyAndGenerateClient() {
  console.log('configuring Amplify and generating client..');
  Amplify.configure(outputs);

  const client = generateClient<Schema>();

  return client;
}
