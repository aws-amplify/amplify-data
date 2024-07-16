import { testCaseSuites } from '../../test-cases/index';
import { runTestCases } from '../../utils';

for (const testCaseSuite of testCaseSuites) {
  describe(`${testCaseSuite.title}`, () => {
    runTestCases(testCaseSuite.suite);
  });
}
