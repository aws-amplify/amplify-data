import { ModelFieldType } from '../src/ModelField';
import { createValidationBuilder } from '../src/FieldLevelValidation';

const string = () => createValidationBuilder(ModelFieldType.String);
const integer = () => createValidationBuilder(ModelFieldType.Integer);
const float = () => createValidationBuilder(ModelFieldType.Float);

describe('FieldLevelValidation', () => {
  describe('Type Constraints', () => {
    describe('Valid Operations', () => {
      test('String validations work on string fields', () => {
        const stringRules1 = string().minLength(5, 'String must be at least 5 characters long');
        const stringRules2 = string().maxLength(10, 'String must be at most 10 characters long');
        const stringRules3 = string().startsWith('test', 'String must start with "test"');
        const stringRules4 = string().endsWith('test', 'String must end with "test"');
        const stringRules5 = string().matches('^test$', 'String must match the regex "^test$"');
      });
      
      test('Numeric validations work on integer fields', () => {
        const intRules1 = integer().gt(5, 'Integer must be greater than 5');
        const intRules2 = integer().lt(10, 'Integer must be less than 10');
        const intRules3 = integer().gte(5, 'Integer must be greater than or equal to 5');
        const intRules4 = integer().lte(10, 'Integer must be less than or equal to 10');
        const intRules5 = integer().positive( 'Integer must be positive');
        const intRules6 = integer().negative( 'Integer must be negative');
      });
      
      test('Numeric validations work on float fields', () => {
        const floatRules1 = float().gt(5, 'Float must be greater than 5');
        const floatRules2 = float().lt(10, 'Float must be less than 10');
        const floatRules3 = float().gte(5, 'Float must be greater than or equal to 5');
        const floatRules4 = float().lte(10, 'Float must be less than or equal to 10');
        const floatRules5 = float().positive( 'Float must be positive');
        const floatRules6 = float().negative( 'Float must be negative');
      });
    });
    
    describe('Invalid Operations', () => {
      test('Numeric validations do not work on string fields', () => {
        function stringWithGt() {
          // @ts-expect-error
          string().gt(5);
        }
        function stringWithLt() {
          // @ts-expect-error
          string().lt(10);  
        }
        function stringWithGte() {
          // @ts-expect-error
          string().gte(5);
        }
        function stringWithLte() {
          // @ts-expect-error
          string().lte(10);
        }
        function stringWithPositive() {
          // @ts-expect-error
          string().positive();
        }
        function stringWithNegative() {
          // @ts-expect-error
          string().negative();
        }
      });
      
      test('String validations do not work on integer fields', () => {
        function integerWithMinLength() {
          // @ts-expect-error
          integer().minLength(5);
        }
        function integerWithMaxLength() {
          // @ts-expect-error
          integer().maxLength(10);
        }
        function integerWithStartsWith() {
          // @ts-expect-error
          integer().startsWith('test');
        }
        function integerWithEndsWith() {
          // @ts-expect-error
          integer().endsWith('test');
        }
        function integerWithMatches() {
          // @ts-expect-error
          integer().matches('^test$');
        }
      });
      
      test('String validations do not work on float fields', () => {
        function floatWithMinLength() {
          // @ts-expect-error
          float().minLength(5);
        }
        function floatWithMaxLength() {
          // @ts-expect-error
          float().maxLength(10);
        }
        function floatWithStartsWith() {
          // @ts-expect-error
          float().startsWith('test');
        }
        function floatWithEndsWith() {
          // @ts-expect-error
          float().endsWith('test');
        }
        function floatWithMatches() {
          // @ts-expect-error
          float().matches('^test$');
        }
      });
    });
  });

  describe('Duplicate Validators', () => {
    test('Cannot use the same numeric validator twice on integer fields', () => {
      function integerWithDuplicateLt() {
        // @ts-expect-error
        integer().lt(5).lt(10);
      }
      function integerWithDuplicateGt() {
        // @ts-expect-error
        integer().gt(5).gt(10);
      }
      function integerWithDuplicateLte() {
        // @ts-expect-error
        integer().lte(5).lte(10);
      }
      function integerWithDuplicateGte() {
        // @ts-expect-error
        integer().gte(5).gte(10);
      }
      function integerWithDuplicatePositive() {
        // @ts-expect-error
        integer().positive().positive();
      }
      function integerWithDuplicateNegative() {
        // @ts-expect-error
        integer().negative().negative();
      }
    });
    
    test('Cannot use the same numeric validator twice on float fields', () => {
      function floatWithDuplicateLt() {
        // @ts-expect-error
        float().lt(5).lt(10);
      }
      function floatWithDuplicateGt() {
        // @ts-expect-error
        float().gt(5).gt(10);
      }
      function floatWithDuplicateLte() {
        // @ts-expect-error
        float().lte(5).lte(10);
      }
      function floatWithDuplicateGte() {
        // @ts-expect-error
        float().gte(5).gte(10);
      }
      function floatWithDuplicatePositive() {
        // @ts-expect-error
        float().positive().positive();
      }
      function floatWithDuplicateNegative() {
        // @ts-expect-error
        float().negative().negative();
      }
    });
    
    test('Cannot use the same string validator twice', () => {
      function stringWithDuplicateMinLength() {
        // @ts-expect-error
        string().minLength(5).minLength(10);
      }
      function stringWithDuplicateMaxLength() {
        // @ts-expect-error
        string().maxLength(5).maxLength(10);
      }
      function stringWithDuplicateStartsWith() {
        // @ts-expect-error
        string().startsWith('test').startsWith('test');
      }
      function stringWithDuplicateEndsWith() {
        // @ts-expect-error
        string().endsWith('test').endsWith('test');
      }
      function stringWithDuplicateMatches() {
        // @ts-expect-error
        string().matches('^test$').matches('^test$');
      }
    });
    
    test('Cannot use numeric validators of the same comparator on integer fields', () => {
      function integerWithGtAndPositive() {
        // @ts-expect-error
        integer().gt(5).positive();
      }
      function integerWithPositiveAndGt() {
        // @ts-expect-error
        integer().positive().gt(5);
      }

      function integerWithLtAndNegative() {
        // @ts-expect-error
        integer().lt(5).negative();
      }
      function integerWithNegativeAndLt() {
        // @ts-expect-error
        integer().negative().lt(5);
      }
    });

    test('Cannot use numeric validators of the same comparator on float fields', () => {
      function floatWithGtAndPositive() {
        // @ts-expect-error
        float().gt(5).positive();
      }
      function floatWithPositiveAndGt() {
        // @ts-expect-error
        float().positive().gt(5);
      }

      function floatWithLtAndNegative() {
        // @ts-expect-error
        float().lt(5).negative();
      }
      function floatWithNegativeAndLt() {
        // @ts-expect-error
        float().negative().lt(5);
      }
    });
  });
}); 