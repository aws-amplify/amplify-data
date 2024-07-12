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

export type TestCase = {
  label: string;
  action: (client: any) => Promise<boolean>;
};

/**
 * Given an array of test cases, runs each test case
 * and asserts that the result is successful
 * @param testCases
 * @param client
 */
export async function runTestCases(testCases: TestCase[]) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const client = global.client;
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
