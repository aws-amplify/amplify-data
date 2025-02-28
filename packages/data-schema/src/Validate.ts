import { ModelFieldType } from './ModelField';

/**
 * The type of validation rule
 */
export enum ValidationType {
  GT = 'gt',
  LT = 'lt',
  GTE = 'gte',
  LTE = 'lte',
  MIN_LENGTH = 'minLength',
  MAX_LENGTH = 'maxLength',
  STARTS_WITH = 'startsWith',
  ENDS_WITH = 'endsWith',
  MATCHES = 'matches',
}

/**
 * Represents a validation rule to be applied to a field
 */
export interface ValidationRule {
  type: ValidationType;
  value: string | number;
  errorMessage?: string;
}

function createValidationRule(
  type: ValidationType,
  value: string | number,
  errorMessage?: string
): ValidationRule {
  return {
    type,
    value,
    errorMessage,
  };
}

/**
 * A builder for creating field validation rules
 * @typeParam T - The type of the field being validated
 */
export class ValidationBuilder<T> {
  private rules: ValidationRule[] = [];
  private fieldType: ModelFieldType;

  constructor(fieldType: ModelFieldType) {
    this.fieldType = fieldType;
  }

  /**
   * Check if the field type is a string type
   */
  private isStringFieldType(): boolean {
    return [
      ModelFieldType.String,
      ModelFieldType.Id,
      ModelFieldType.Date,
      ModelFieldType.Time,
      ModelFieldType.DateTime,
      ModelFieldType.Email,
      ModelFieldType.Phone,
      ModelFieldType.Url,
      ModelFieldType.IPAddress,
    ].includes(this.fieldType);
  }

  /**
   * Check if the field type is a numeric type
   */
  private isNumericFieldType(): boolean {
    return [
      ModelFieldType.Integer,
      ModelFieldType.Float,
      ModelFieldType.Timestamp,
    ].includes(this.fieldType);
  }

  /**
   * Validates that a numeric field is greater than the specified value
   * ⚠️ Only applicable for numeric fields (integer, float, timestamp)
   * 
   * @example
   * // Integer field example
   * integer().validate(v => v.gt(10))
   * 
   * // Float field example
   * float().validate(v => v.gt(3.14))
   * 
   * @param value - The value that the field must be greater than
   * @param errorMessage - Optional custom error message
   * @returns The validation builder for chaining
   */
  gt(value: number, errorMessage?: string): ValidationBuilder<T> {
    if (!this.isNumericFieldType()) {
      console.warn(`gt validation is only valid for numeric fields, but was used on ${this.fieldType} field`);
    }
    this.rules.push(createValidationRule(ValidationType.GT, value, errorMessage));
    return this;
  }

  /**
   * Validates that a numeric field is less than the specified value
   * ⚠️ Only applicable for numeric fields (integer, float, timestamp)
   * 
   * @example
   * // Integer field example
   * integer().validate(v => v.lt(100))
   * 
   * // Float field example
   * float().validate(v => v.lt(99.99))
   * 
   * @param value - The value that the field must be less than
   * @param errorMessage - Optional custom error message
   * @returns The validation builder for chaining
   */
  lt(value: number, errorMessage?: string): ValidationBuilder<T> {
    if (!this.isNumericFieldType()) {
      console.warn(`lt validation is only valid for numeric fields, but was used on ${this.fieldType} field`);
    }
    this.rules.push(createValidationRule(ValidationType.LT, value, errorMessage));
    return this;
  }

  /**
   * Validates that a numeric field is greater than or equal to the specified value
   * ⚠️ Only applicable for numeric fields (integer, float, timestamp)
   * 
   * @example
   * // Integer field example
   * integer().validate(v => v.gte(0))
   * 
   * // Float field example
   * float().validate(v => v.gte(0.0))
   * 
   * @param value - The value that the field must be greater than or equal to
   * @param errorMessage - Optional custom error message
   * @returns The validation builder for chaining
   */
  gte(value: number, errorMessage?: string): ValidationBuilder<T> {
    if (!this.isNumericFieldType()) {
      console.warn(`gte validation is only valid for numeric fields, but was used on ${this.fieldType} field`);
    }
    this.rules.push(createValidationRule(ValidationType.GTE, value, errorMessage));
    return this;
  }

  /**
   * Validates that a numeric field is less than or equal to the specified value
   * ⚠️ Only applicable for numeric fields (integer, float, timestamp)
   * 
   * @example
   * // Integer field example
   * integer().validate(v => v.lte(10))
   * 
   * // Float field example
   * float().validate(v => v.lte(5.5))
   * 
   * @param value - The value that the field must be less than or equal to
   * @param errorMessage - Optional custom error message
   * @returns The validation builder for chaining
   */
  lte(value: number, errorMessage?: string): ValidationBuilder<T> {
    if (!this.isNumericFieldType()) {
      console.warn(`lte validation is only valid for numeric fields, but was used on ${this.fieldType} field`);
    }
    this.rules.push(createValidationRule(ValidationType.LTE, value, errorMessage));
    return this;
  }

  /**
   * Validates that a string field has at least the specified length
   * ⚠️ Only applicable for string fields (string, id, email, phone, url, etc.)
   * 
   * @example
   * // String field example
   * string().validate(v => v.minLength(5))
   * 
   * // Email field example
   * email().validate(v => v.minLength(8))
   * 
   * @param length - The minimum length required
   * @param errorMessage - Optional custom error message
   * @returns The validation builder for chaining
   */
  minLength(length: number, errorMessage?: string): ValidationBuilder<T> {
    if (!this.isStringFieldType()) {
      console.warn(`minLength validation is only valid for string fields, but was used on ${this.fieldType} field`);
    }
    this.rules.push(createValidationRule(ValidationType.MIN_LENGTH, length, errorMessage));
    return this;
  }

  /**
   * Validates that a string field does not exceed the specified length
   * ⚠️ Only applicable for string fields (string, id, email, phone, url, etc.)
   * 
   * @example
   * // String field example
   * string().validate(v => v.maxLength(100))
   * 
   * // URL field example
   * url().validate(v => v.maxLength(255))
   * 
   * @param length - The maximum length allowed
   * @param errorMessage - Optional custom error message
   * @returns The validation builder for chaining
   */
  maxLength(length: number, errorMessage?: string): ValidationBuilder<T> {
    if (!this.isStringFieldType()) {
      console.warn(`maxLength validation is only valid for string fields, but was used on ${this.fieldType} field`);
    }
    this.rules.push(createValidationRule(ValidationType.MAX_LENGTH, length, errorMessage));
    return this;
  }

  /**
   * Validates that a string field starts with the specified prefix
   * ⚠️ Only applicable for string fields (string, id, email, phone, url, etc.)
   * 
   * @example
   * // String field example
   * string().validate(v => v.startsWith("prefix-"))
   * 
   * // URL field example
   * url().validate(v => v.startsWith("https://"))
   * 
   * @param prefix - The prefix the string must start with
   * @param errorMessage - Optional custom error message
   * @returns The validation builder for chaining
   */
  startsWith(prefix: string, errorMessage?: string): ValidationBuilder<T> {
    if (!this.isStringFieldType()) {
      console.warn(`startsWith validation is only valid for string fields, but was used on ${this.fieldType} field`);
    }
    this.rules.push(createValidationRule(ValidationType.STARTS_WITH, prefix, errorMessage));
    return this;
  }

  /**
   * Validates that a string field ends with the specified suffix
   * ⚠️ Only applicable for string fields (string, id, email, phone, url, etc.)
   * 
   * @example
   * // String field example
   * string().validate(v => v.endsWith("-suffix"))
   * 
   * // URL field example
   * url().validate(v => v.endsWith(".com"))
   * 
   * @param suffix - The suffix the string must end with
   * @param errorMessage - Optional custom error message
   * @returns The validation builder for chaining
   */
  endsWith(suffix: string, errorMessage?: string): ValidationBuilder<T> {
    if (!this.isStringFieldType()) {
      console.warn(`endsWith validation is only valid for string fields, but was used on ${this.fieldType} field`);
    }
    this.rules.push(createValidationRule(ValidationType.ENDS_WITH, suffix, errorMessage));
    return this;
  }

  /**
   * Validates that a string field matches the specified regular expression pattern
   * ⚠️ Only applicable for string fields (string, id, email, phone, url, etc.)
   * 
   * @example
   * // String field example
   * string().validate(v => v.matches("^[a-zA-Z0-9]+$"))
   * 
   * // Phone field example
   * phone().validate(v => v.matches("^\\+1-[0-9]{3}-[0-9]{3}-[0-9]{4}$"))
   * 
   * @param pattern - The regex pattern the string must match
   * @param errorMessage - Optional custom error message
   * @returns The validation builder for chaining
   */
  matches(pattern: string, errorMessage?: string): ValidationBuilder<T> {
    if (!this.isStringFieldType()) {
      console.warn(`matches validation is only valid for string fields, but was used on ${this.fieldType} field`);
    }
    this.rules.push(createValidationRule(ValidationType.MATCHES, pattern, errorMessage));
    return this;
  }

  /**
   * Returns all the validation rules defined by this builder
   */
  getRules(): ValidationRule[] {
    return this.rules;
  }
}

/**
 * Creates a validation builder for the specified field type
 * @param fieldType - The type of field to create a validation builder for
 * @returns A validation builder appropriate for the field type
 */
export function createValidationBuilder<T>(fieldType: ModelFieldType): ValidationBuilder<T> {
  return new ValidationBuilder<T>(fieldType);
}
