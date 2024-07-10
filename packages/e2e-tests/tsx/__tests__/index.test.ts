import { testCases } from '../index';
import { runTestCases } from './utils';

let client: any;

describe('API CRUD operations', () => {
  // TODO:
  // beforeAll(async () => {
  //   console.log('BEFORE ALL-----');
  //   client = await configureAmplifyAndGenerateClient();
  // });
  // afterEach(async () => {
  //   console.log('AFTER EACH-----');
  //   await cleanup(client);
  // });
  runTestCases(client, testCases);
});

// TODO?
//  process.exit(1);
