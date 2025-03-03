import { ModelFieldType } from './ModelField';

//----------------------------------------------------------------------
// #region Validation Types
//----------------------------------------------------------------------

/**
 * The types of validations supported
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

//----------------------------------------------------------------------
// #endregion Validation Types
//----------------------------------------------------------------------

//----------------------------------------------------------------------
// #region ValidationRule
//----------------------------------------------------------------------

/**
 * Represents a validation rule to be applied to a field
 */
export interface ValidationRule {
  type: ValidationType;
  value: string | number;
  errorMessage?: string;
}

/**
 * Creates a validation rule
 * @param type - The type of validation rule
 * @param value - The value to validate against
 * @param errorMessage - Optional custom error message
 * @returns The validation rule
 */
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

//----------------------------------------------------------------------
// #endregion ValidationRule
//----------------------------------------------------------------------

//----------------------------------------------------------------------
// #region Builder
//----------------------------------------------------------------------

/**
 * Maps a ModelFieldType to the appropriate validation builder type
 */
export type FieldTypeToValidationBuilder<T, FT extends ModelFieldType> = 
  FT extends ModelFieldType.String
    ? StringValidationBuilder<T>
    : FT extends ModelFieldType.Integer | ModelFieldType.Float
      ? NumericValidationBuilder<T>
      : never;

/**
 * Interface for string validation methods
 */
export interface StringValidationBuilder<T> {
  /**
   * Validates that a string field has at least the specified length
   * ⚠️ Only applicable to string fields
   * 
   * @example
   * // String field example
   * a.string().validate(v => v.minLength(5))
   * 
   * @param length - The minimum length required
   * @param errorMessage - Optional custom error message
   */
  minLength(length: number, errorMessage?: string): StringValidationBuilder<T>;
  
  /**
   * Validates that a string field does not exceed the specified length
   * ⚠️ Only applicable to string fields
   * 
   * @example
   * // String field example
   * a.string().validate(v => v.maxLength(100))
   * 
   * @param length - The maximum length allowed
   * @param errorMessage - Optional custom error message
   */
  maxLength(length: number, errorMessage?: string): StringValidationBuilder<T>;
  
  /**
   * Validates that a string field starts with the specified prefix
   * ⚠️ Only applicable to string fields
   * 
   * @example
   * // String field example
   * a.string().validate(v => v.startsWith("prefix-"))
   * 
   * @param prefix - The prefix the string must start with
   * @param errorMessage - Optional custom error message
   */
  startsWith(prefix: string, errorMessage?: string): StringValidationBuilder<T>;
  
  /**
   * Validates that a string field ends with the specified suffix
   * ⚠️ Only applicable to string fields
   * 
   * @example
   * // String field example
   * a.string().validate(v => v.endsWith("-suffix"))
   * 
   * @param suffix - The suffix the string must end with
   * @param errorMessage - Optional custom error message
   */
  endsWith(suffix: string, errorMessage?: string): StringValidationBuilder<T>;
  
  /**
   * Validates that a string field matches the specified regular expression pattern
   * ⚠️ Only applicable to string fields
   * 
   * @example
   * // String field example
   * a.string().validate(v => v.matches("^[a-zA-Z0-9]+$"))
   * 
   * @param pattern - The regex pattern the string must match
   * @param errorMessage - Optional custom error message
   */
  matches(pattern: string, errorMessage?: string): StringValidationBuilder<T>;
  
  /**
   * Returns all the validation rules defined by this builder
   */
  getRules(): ValidationRule[];
}

/**
 * Interface for numeric validation methods
 */
export interface NumericValidationBuilder<T> {
  /**
   * Validates that a numeric field is greater than the specified value
   * ⚠️ Only applicable for integer or float fields
   * 
   * @example
   * // Integer field example
   * a.integer().validate(v => v.gt(10))
   * 
   * // Float field example
   * a.float().validate(v => v.gt(3.14))
   * 
   * @param value - The value that the field must be greater than
   * @param errorMessage - Optional custom error message
   */
  gt(value: number, errorMessage?: string): NumericValidationBuilder<T>;
  
  /**
   * Validates that a numeric field is less than the specified value
   * ⚠️ Only applicable for integer or float fields
   * 
   * @example
   * // Integer field example
   * a.integer().validate(v => v.lt(10))
   * 
   * // Float field example
   * a.float().validate(v => v.lt(3.14))
   */
  lt(value: number, errorMessage?: string): NumericValidationBuilder<T>;
  
  /**
   * Validates that a numeric field is greater than or equal to the specified value
   * ⚠️ Only applicable for integer or float fields
   * 
   * @example
   * // Integer field example
   * a.integer().validate(v => v.gte(10))
   * 
   * // Float field example
   * a.float().validate(v => v.gte(3.14))
   */
  gte(value: number, errorMessage?: string): NumericValidationBuilder<T>;
  
  /**
   * Validates that a numeric field is less than or equal to the specified value
   * ⚠️ Only applicable for integer or float fields
   * 
   * @example
   * // Integer field example
   * a.integer().validate(v => v.lte(10))
   * 
   * // Float field example
   * a.float().validate(v => v.lte(3.14))
   */
  lte(value: number, errorMessage?: string): NumericValidationBuilder<T>;
  
  /**
   * Returns all the validation rules defined by this builder
   */
  getRules(): ValidationRule[];
}

/**
 * A builder for creating field validation rules
 * @typeParam T - The type of the field being validated
 */
export class ValidationBuilder<T> implements StringValidationBuilder<T>, NumericValidationBuilder<T> {
  private rules: ValidationRule[] = [];
  private fieldType: ModelFieldType;

  constructor(fieldType: ModelFieldType) {
    this.fieldType = fieldType;
  }

  /**
   * Check if the field type is a string type
   */
  private isStringFieldType(): boolean {
    return this.fieldType === ModelFieldType.String;
  }

  /**
   * Check if the field type is a numeric type
   */
  private isNumericFieldType(): boolean {
    return this.fieldType === ModelFieldType.Integer || this.fieldType === ModelFieldType.Float;
  }

  gt(value: number, errorMessage?: string): ValidationBuilder<T> {
    if (!this.isNumericFieldType()) {
      console.warn(`gt validation is only valid for numeric fields, but was used on ${this.fieldType} field`);
    }
    this.rules.push(createValidationRule(ValidationType.GT, value, errorMessage));
    return this;
  }

  lt(value: number, errorMessage?: string): ValidationBuilder<T> {
    if (!this.isNumericFieldType()) {
      console.warn(`lt validation is only valid for numeric fields, but was used on ${this.fieldType} field`);
    }
    this.rules.push(createValidationRule(ValidationType.LT, value, errorMessage));
    return this;
  }

  gte(value: number, errorMessage?: string): ValidationBuilder<T> {
    if (!this.isNumericFieldType()) {
      console.warn(`gte validation is only valid for numeric fields, but was used on ${this.fieldType} field`);
    }
    this.rules.push(createValidationRule(ValidationType.GTE, value, errorMessage));
    return this;
  }

  lte(value: number, errorMessage?: string): ValidationBuilder<T> {
    if (!this.isNumericFieldType()) {
      console.warn(`lte validation is only valid for numeric fields, but was used on ${this.fieldType} field`);
    }
    this.rules.push(createValidationRule(ValidationType.LTE, value, errorMessage));
    return this;
  }

  minLength(length: number, errorMessage?: string): ValidationBuilder<T> {
    if (!this.isStringFieldType()) {
      console.warn(`minLength validation is only valid for string fields, but was used on ${this.fieldType} field`);
    }
    this.rules.push(createValidationRule(ValidationType.MIN_LENGTH, length, errorMessage));
    return this;
  }

  maxLength(length: number, errorMessage?: string): ValidationBuilder<T> {
    if (!this.isStringFieldType()) {
      console.warn(`maxLength validation is only valid for string fields, but was used on ${this.fieldType} field`);
    }
    this.rules.push(createValidationRule(ValidationType.MAX_LENGTH, length, errorMessage));
    return this;
  }

  startsWith(prefix: string, errorMessage?: string): ValidationBuilder<T> {
    if (!this.isStringFieldType()) {
      console.warn(`startsWith validation is only valid for string fields, but was used on ${this.fieldType} field`);
    }
    this.rules.push(createValidationRule(ValidationType.STARTS_WITH, prefix, errorMessage));
    return this;
  }

  endsWith(suffix: string, errorMessage?: string): ValidationBuilder<T> {
    if (!this.isStringFieldType()) {
      console.warn(`endsWith validation is only valid for string fields, but was used on ${this.fieldType} field`);
    }
    this.rules.push(createValidationRule(ValidationType.ENDS_WITH, suffix, errorMessage));
    return this;
  }

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
export function createValidationBuilder<T, FT extends ModelFieldType = ModelFieldType>(
  fieldType: FT
): ValidationBuilder<T> {
  return new ValidationBuilder<T>(fieldType);
}

//----------------------------------------------------------------------
// #endregion Builder
//----------------------------------------------------------------------