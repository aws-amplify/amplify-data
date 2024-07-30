import {
  Client,
  configureAmplifyAndGenerateClient,
  expectDataReturnWithoutErrors,
} from '../../node/utils';
import type { Schema } from '../amplify-backends/00-basic-todo/amplify/data/resource';
import { deploySandbox, sandboxTimeout, teardownSandbox } from '../utils/';

// Location of generated Amplify backend for this test:
const projectDirPath = './amplify-backends/01-p50';

const sandboxIdentifier = 'p50';

let client: Client;

const deleteAll = async (client: Client) => {
  const { data: crudlTestModels } = await client.models.CRUDLTestModel.list();
  console.log('crudlTestModels to delete:', crudlTestModels);

  const deletePromises = crudlTestModels?.map(
    async (todo: Schema['Todo']['type']) => {
      await client.models.CRUDLTestModel.delete(todo);
    },
  );

  await Promise.all(deletePromises!);

  const { data: listAfterDelete } = await client.models.CRUDLTestModel.list();
  console.log('result of cleanup:', listAfterDelete);
};

describe.skip('Sandbox gen + runtime testing of p50 schema', () => {
  beforeAll(async () => {
    const response = await deploySandbox(projectDirPath, sandboxIdentifier);

    if ('errors' in response) {
      throw response.errors;
    }
  }, sandboxTimeout);
  beforeEach(() => {
    client = configureAmplifyAndGenerateClient({});
  });
  afterEach(async () => {
    await deleteAll(client);
  });
  // TODO: add more model operations
  test('Create', async () => {
    const response = await client.models.CRUDLTestModel.create({
      content: 'test create',
    });

    const data = expectDataReturnWithoutErrors(response, 'create');

    expect(data?.content).toBe('test create');
  });
  afterAll(async () => {
    await teardownSandbox(projectDirPath);
  }, sandboxTimeout);
});
