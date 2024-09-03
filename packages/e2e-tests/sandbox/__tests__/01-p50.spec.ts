import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { expectDataReturnWithoutErrors } from '../../common/utils';
import type { Schema } from '../amplify-backends/01-p50/amplify/data/resource';
import { deploySandbox, sandboxTimeout, teardownSandbox } from '../utils/';
import { getGeneratedOutputs } from '../utils/outputsUtils';

const sandboxDir = '01-p50';

// Location of generated Amplify backend for this test:
const projectDirPath = `./amplify-backends/${sandboxDir}`;

const sandboxIdentifier = 'p50';

// TODO: use imported type from `aws-amplify/data` once it's fixed
type Client = ReturnType<typeof generateClient<Schema>>;

let client: Client;

const deleteAll = async (client: Client) => {
  const { data: crudlTestModels } = await client.models.Todo.list();
  console.log('crudlTestModels to delete:', crudlTestModels);

  const deletePromises = crudlTestModels?.map(
    async (todo: Schema['Todo']['type']) => {
      await client.models.Todo.delete(todo);
    },
  );

  await Promise.all(deletePromises!);

  const { data: listAfterDelete } = await client.models.Todo.list();
  console.log('result of cleanup:', listAfterDelete);
};

describe('Sandbox gen + runtime testing of p50 schema', () => {
  beforeAll(async () => {
    // Deploy the sandbox
    const response = await deploySandbox(projectDirPath, sandboxIdentifier);

    if ('errors' in response) {
      throw response.errors;
    }
  }, sandboxTimeout);
  beforeEach(async () => {
    const { result, errors } = await getGeneratedOutputs(sandboxDir);

    if (errors) {
      throw errors;
    }

    Amplify.configure(result);
    client = generateClient<Schema>();
  });
  afterEach(async () => {
    await deleteAll(client);
  });
  // TODO: add more model operations
  test('Create', async () => {
    const response = await client.models.Todo.create({
      todoId: `${Date.now()}`,
      name: `test create`,
    });

    const data = expectDataReturnWithoutErrors(response, 'create');

    expect(data?.name).toBe('test create');
  });
  afterAll(async () => {
    await teardownSandbox(projectDirPath);
  }, sandboxTimeout);
});
