import { a } from '../src';
import { StringValidationBuilder, NumericValidationBuilder, ValidationBuilder } from '../src/Validate';

describe('Validation', () => {
  describe('Valid validation calls', () => {
    it('should allow string validations on string fields', () => {
      const stringField = a.string().validate(v => v
        .minLength(5, 'String must be at least 5 characters long')
        .maxLength(100, 'String must be at most 100 characters long')
        .startsWith('prefix-', 'String must start with prefix-')
        .endsWith('-suffix', 'String must end with -suffix')
        .matches('^[a-zA-Z0-9]+$', 'String must be alphanumeric')
      );
    });
    
    it('should allow numeric validations on integer fields', () => {
      const intField = a.integer().validate(v => v
        .gt(10, 'Integer must be greater than 10')
        .lt(100, 'Integer must be less than 100')
        .gte(0, 'Integer must be greater than or equal to 0')
        .lte(50, 'Integer must be less than or equal to 50')
      );
    });
    
    it('should allow numeric validations on float fields', () => {
      const floatField = a.float().validate(v => v
        .gt(3.14, 'Float must be greater than 3.14')
        .lt(9.99, 'Float must be less than 9.99')
        .gte(0.0, 'Float must be greater than or equal to 0.0')
        .lte(10.5, 'Float must be less than or equal to 10.5')
      );
    });
  });
  
  describe('Invalid validation calls', () => {
    it('should not allow string validations on non-string fields', () => {
      // @ts-expect-error - Integer cannot use string validations
      a.integer().validate(v => v.minLength(5));
      
      // @ts-expect-error - Float cannot use string validations
      a.float().validate(v => v.maxLength(100));
      
      // @ts-expect-error - Boolean cannot use string validations
      a.boolean().validate(v => v.startsWith('prefix-'));
      
      // @ts-expect-error - ID cannot use string validations
      a.id().validate(v => v.endsWith('-suffix'));
    });
    
    it('should not allow numeric validations on non-numeric fields', () => {
      // @ts-expect-error - String cannot use numeric validations
      a.string().validate(v => v.gt(10));
      
      // @ts-expect-error - Boolean cannot use numeric validations
      a.boolean().validate(v => v.lt(100));
      
      // @ts-expect-error - Date cannot use numeric validations
      a.date().validate(v => v.gte(0));
      
      // @ts-expect-error - Email cannot use numeric validations
      a.email().validate(v => v.lte(50));
    });
    
    it('should not allow any validations on types without validation support', () => {
      // @ts-expect-error - JSON cannot use string validations  
      a.json().validate(v => v.minLength(5));
      
      // @ts-expect-error - Boolean cannot use string validations
      a.boolean().validate(v => v.maxLength(10));
      
      // Other field types without specific validations
      // @ts-expect-error - Date cannot use string validations
      a.date().validate(v => v.matches('[0-9]+'));
      
      // @ts-expect-error - Time cannot use string validations
      a.time().validate(v => v.startsWith('12:'));
      
      // @ts-expect-error - DateTime cannot use numeric validations
      a.datetime().validate(v => v.gt(10));
      
      // @ts-expect-error - Timestamp cannot use string validations
      a.timestamp().validate(v => v.endsWith('Z'));
      
      // @ts-expect-error - Email cannot use numeric validations 
      a.email().validate(v => v.lte(50));
      
      // @ts-expect-error - Phone cannot use numeric validations
      a.phone().validate(v => v.gt(10));
      
      // @ts-expect-error - URL cannot use numeric validations
      a.url().validate(v => v.lt(100));
      
      // @ts-expect-error - IP Address cannot use numeric validations
      a.ipAddress().validate(v => v.gte(0));
    });
  });
});