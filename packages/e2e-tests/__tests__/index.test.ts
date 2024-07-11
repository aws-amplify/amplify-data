import { testCases } from '../index';
import { runTestCases, cleanup } from './utils';

describe('API CRUD operations', () => {
  afterEach(async () => {
    await cleanup();
  });
  runTestCases(testCases);
});

// TODO?
//  process.exit(1);
