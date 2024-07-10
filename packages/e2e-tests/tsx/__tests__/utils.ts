import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
import outputs from '../amplify_outputs.json';

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

/**
 *
 * @param testCases
 * @param client
 */
export async function runTestCases(client: any, testCases: any[]) {
  for (const testCase of testCases) {
    test(`${testCase.label}`, async () => {
      console.log('starting test case:', testCase.label);
      console.log('is client here?', client);
      let result: any;

      try {
        const response = await testCase.action(client);
        console.log('run test cases try result', response);
        result = _testCase(response);
      } catch (error) {
        console.error('run test cases catch error:', error);
        result = _testCase(false);
      }

      console.log(`Result of ${testCase.label}`, result.icon);
      expect(result.label).toBe(statuses.success.label);
    });
  }
}

/**
 * TODO
 * @returns
 */
export async function configureAmplifyAndGenerateClient() {
  console.log('configuring Amplify and generating client..');
  Amplify.configure(outputs);

  const client = generateClient<Schema>();
  console.log('client:', client);
  return client;
}

/**
 * TODO
 * @param client
 */
export async function cleanup(client: any) {
  console.log('starting cleanup..');
  const { data: todos } = await client.models.Todo.list();
  console.log('todos to delete:', todos);

  const deletePromises = todos?.map(async (todo: Schema['Todo']['type']) => {
    await client.models.Todo.delete(todo);
  });

  await Promise.all(deletePromises!);

  const { data: listAfterDelete } = await client.models.Todo.list();
  console.log('result of cleanup:', listAfterDelete);
}
