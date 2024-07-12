import { testCases } from '../test-cases/basic-crudl';
import { runTestCases, cleanup } from '../utils';

// This test suite will run the test cases defined in test-cases/index.ts
describe('API CRUDL operations', () => {
  afterEach(async () => {
    await cleanup();
  });
  runTestCases(testCases);
});
