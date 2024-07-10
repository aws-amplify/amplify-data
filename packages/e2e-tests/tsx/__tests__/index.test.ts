import { testCases } from '../index';
import { runTestCases, cleanup } from './utils';

describe('API CRUD operations', () => {
  // TODO:
  // beforeAll(async () => {
  //   console.log('BEFORE ALL-----');
  //   client = await configureAmplifyAndGenerateClient();
  // });
  afterEach(async () => {
    await cleanup();
  });
  runTestCases(testCases);
});

// TODO?
//  process.exit(1);
