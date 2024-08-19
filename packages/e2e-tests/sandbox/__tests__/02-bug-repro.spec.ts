import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { expectDataReturnWithoutErrors } from '../../common/utils';
import type { Schema } from '../amplify-backends/02-bug-repro/amplify/data/resource';
// import { deploySandbox, sandboxTimeout } from '../utils';
import { deploySandbox, sandboxTimeout, teardownSandbox } from '../utils';
// import { deploySandboxWatch, sandboxTimeout } from '../utils';
import { getGeneratedOutputs } from '../utils/outputsUtils';
import fs from 'fs';
// import path from 'path';

const sandboxDir = '02-bug-repro';

// Location of generated Amplify backend for this test:
const projectDirPath = `./amplify-backends/${sandboxDir}`;

const sandboxIdentifier = 'bugRepro';

// likePost: use imported type from `aws-amplify/data` once it's fixed
type Client = ReturnType<typeof generateClient<Schema>>;

let client: Client;

const deleteAll = async (client: Client) => {
  const { data: crudlTestModels } = await client.models.Post.list();
  console.log('crudlTestModels to delete:', crudlTestModels);

  const deletePromises = crudlTestModels?.map(
    async (Post: Schema['Post']['type']) => {
      await client.models.Post.delete(Post);
    },
  );

  await Promise.all(deletePromises!);

  const { data: listAfterDelete } = await client.models.Post.list();
  console.log('result of cleanup:', listAfterDelete);
};

async function pause(ms: number) {
  return new Promise((unsleep) => setTimeout(unsleep, ms));
}

const writeNewFile = (pathToUpdates: string, pathToOverwrite: string) => {
  fs.readFile(pathToUpdates, (readError: any, data: any) => {
    if (readError) {
      console.error('cannot read original schema:', readError);
      return;
    }

    fs.writeFile(pathToOverwrite, data, (writeError) => {
      if (writeError) {
        console.error('Error writing new schema:', writeError);
      } else {
        console.log('Successfully updated schema!!!!!');
      }
    });
  });
};

describe('Sandbox gen + runtime testing of p50 schema', () => {
  beforeAll(async () => {
    // Unlike other tests, will NOT
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
  test(
    'Update schema',
    async () => {
      /**
       * Save original schema to a new file so we can restore it:
       */
      writeNewFile(
        './amplify-backends/02-bug-repro/amplify/data/resource.ts',
        './replacement-schemas/hold.ts',
      );

      await pause(2000);

      // Update schema:
      writeNewFile(
        './replacement-schemas/first.ts',
        './amplify-backends/02-bug-repro/amplify/data/resource.ts',
      );

      await pause(2000);

      const response1 = await deploySandbox(projectDirPath, sandboxIdentifier);

      // Restore schema:
      writeNewFile(
        './replacement-schemas/hold.ts',
        './amplify-backends/02-bug-repro/amplify/data/resource.ts',
      );

      await pause(2000);

      const response2 = await deploySandbox(projectDirPath, sandboxIdentifier);

      /**
       * Temp solution to wait for the schema to be updated. If we wanted to actually
       * test something like this, we could use the process controller to wait
       * on the update to succeed, as we do elsewhere. This is just temporary
       * for the purposes of testing a bug.
       */

      // Here we would make an assertion from the output of `deploySandboxWatch`:
      if ('errors' in response1) {
        throw response1.errors;
      }
      expect(response1.success).toBe(true);
      if ('errors' in response2) {
        throw response2.errors;
      }
      expect(response2.success).toBe(true);
    },
    sandboxTimeout,
  );
  test('Custom mutation', async () => {
    const response1 = await client.models.Post.create({
      id: `${Date.now()}`,
      content: 'test',
    });

    expectDataReturnWithoutErrors(response1, 'create1');

    const response2 = await client.mutations.likePost({
      postId: 'hello',
    });

    const data2 = expectDataReturnWithoutErrors(response2, 'create2');

    expect(data2).toBe(data2);
  });
  afterAll(async () => {
    await teardownSandbox(projectDirPath);
  }, sandboxTimeout);
});
