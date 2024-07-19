import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from './amplify/data/resource';
import outputs from './amplify_outputs.json';

/**
 * For better readability of test output:
 */
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
export type Client = ReturnType<typeof generateClient<Schema>>;

export type TestCase = {
  label: string;
  setup: () => Promise<Client>;
  action: (client: Client) => Promise<boolean>;
  cleanup: (client: Client) => Promise<void>;
};

/**
 * Given an array of test cases, runs each test case and asserts that the result
 * is successful.
 * Runs the test case cleanup function after each test case.
 * @param testCases - test cases to run
 */
export async function runTestCases(testCases: TestCase[]) {
  for (const testCase of testCases) {
    test(`${testCase.label}`, async () => {
      const client = await testCase.setup();

      let result: any;

      try {
        const response = await testCase.action(client);
        result = _testCase(response);
      } catch (error) {
        result = _testCase(false);
      }

      console.log(`${result.icon} ${testCase.label}`);

      await testCase.cleanup(client);

      expect(result.label).toBe(statuses.success.label);
    }, 20000);
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

/**
 * Util for pausing test execution.
 */
export async function pause(ms: number) {
  console.log('calling pause');
  return new Promise((resolve) => setTimeout(resolve, ms));
}
