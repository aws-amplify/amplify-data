import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { ModelFieldType } from '../src/ModelField';
import { 
  createValidationBuilder, 
  ValidationType, 
} from '../src/FieldLevelValidation';

it('should not produce static type errors', async () => {
  await expectTypeTestsToPassAsync(__filename);
});

// describe('FieldLevelValidation', () => {
// }); 