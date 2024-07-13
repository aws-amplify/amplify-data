import { basicCRUDL } from '../test-cases/basic-crudl';
import { runTestCases } from '../utils';

describe('API CRUDL operations', () => {
  runTestCases(basicCRUDL);
});
