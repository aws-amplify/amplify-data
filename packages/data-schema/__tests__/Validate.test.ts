import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { a } from '../src/index';

// evaluates type defs in corresponding test-d.ts file
it('should not produce static type errors', async () => {
  await expectTypeTestsToPassAsync(__filename);
});

describe('Validation directive generation', () => {
  test('Model with various validation rules without error messages', () => {
    const schema = a
      .schema({
        TestModel: a.model({
          id: a.id(),
          // Integer field with numeric validations
          integerField: a.integer().validate(v => 
            v.gt(0)
             .lt(100)
             .gte(1)
             .lte(99)
          ),
          positiveIntegerField: a.integer().validate(v => 
            v.positive()
          ),
          negativeIntegerField: a.integer().validate(v => 
            v.negative()
          ),
          // Float field with numeric validations
          floatField: a.float().validate(v => 
            v.gt(0.99)
             .lt(1000.01)
             .gte(1.0)
             .lte(1000.0)
          ),
          positiveFloatField: a.float().validate(v => 
            v.positive()
          ),
          negativeFloatField: a.float().validate(v => 
            v.negative()
          ),
          // String field with string validations
          stringField: a.string().validate(v => 
            v.minLength(5)
             .maxLength(20)
             .startsWith("ABC")
             .endsWith("XYZ")
             .matches("^[A-Z0-9]+$")
          ),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  });
  
  test('Model with various validation rules with double-quoted error messages', () => {
    const schema = a
      .schema({
        TestModelWithErrors: a.model({
          id: a.id(),
          // Integer field with numeric validations
          integerField: a.integer().validate(v => 
            v.gt(0, "Value must be greater than 0")
             .lt(100, "Value must be less than 100")
             .gte(1, "Value must be at least 1")
             .lte(99, "Value must be at most 99")
          ),
          positiveIntegerField: a.integer().validate(v => 
            v.positive("Value must be positive")
          ),
          negativeIntegerField: a.integer().validate(v => 
            v.negative("Value must be negative")
          ),
          // Float field with numeric validations
          floatField: a.float().validate(v => 
            v.gt(0.99, "Value must be greater than 0.99")
             .lt(1000.01, "Value must be less than 1000.01")
             .gte(1.0, "Value must be at least 1.0")
             .lte(1000.0, "Value must be at most 1000.0")
          ),
          positiveFloatField: a.float().validate(v => 
            v.positive("Value must be positive")
          ),
          negativeFloatField: a.float().validate(v => 
            v.negative("Value must be negative")
          ),
          // String field with string validations
          stringField: a.string().validate(v => 
            v.minLength(5, "String must be at least 5 characters")
             .maxLength(20, "String must be at most 20 characters")
             .startsWith("ABC", "String must start with ABC")
             .endsWith("XYZ", "String must end with XYZ")
             .matches("^[A-Z0-9]+$", "String must only contain uppercase letters and numbers")
          ),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  test('Model with various validation rules with single-quoted error messages', () => {
    const schema = a
      .schema({
        TestModelWithErrors: a.model({
          id: a.id(),
          // Integer field with numeric validations
          integerField: a.integer().validate(v => 
            v.gt(0, 'Value must be greater than 0')
             .lt(100, 'Value must be less than 100')
             .gte(1, 'Value must be at least 1')
             .lte(99, 'Value must be at most 99')
          ),
          positiveIntegerField: a.integer().validate(v => 
            v.positive('Value must be positive')
          ),
          negativeIntegerField: a.integer().validate(v => 
            v.negative('Value must be negative')
          ),
          // Float field with numeric validations
          floatField: a.float().validate(v => 
            v.gt(0.99, 'Value must be greater than 0.99')
             .lt(1000.01, 'Value must be less than 1000.01')
             .gte(1.0, 'Value must be at least 1.0')
             .lte(1000.0, 'Value must be at most 1000.0')
          ),
          positiveFloatField: a.float().validate(v => 
            v.positive('Value must be positive')
          ),
          negativeFloatField: a.float().validate(v => 
            v.negative('Value must be negative')
          ),
            // String field with string validations
          stringField: a.string().validate(v => 
            v.minLength(5, 'String must be at least 5 characters')
             .maxLength(20, 'String must be at most 20 characters')
             .startsWith('ABC', 'String must start with ABC')
             .endsWith('XYZ', 'String must end with XYZ')
             .matches('^[A-Z0-9]+$', 'String must only contain uppercase letters and numbers')
          ),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  });
});
