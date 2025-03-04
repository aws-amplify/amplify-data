import { ModelFieldType } from './ModelField';

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

/**
 * Represents a validation rule to be applied to a field
 */
export interface ValidationRule {
  type: ValidationType;
  value: string | number;
  errorMessage?: string;
}

/**
 * Type to exclude specific validation methods from a builder type
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Base interface for all validation builders
 */
export interface BaseValidationBuilder {
  /**
   * Returns all the validation rules defined by this builder
   */
  getRules(): ValidationRule[];
}

/**
 * Interface for string validation methods without any exclusions
 */
export interface StringValidationBuilderBase<T> extends BaseValidationBuilder {
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
  minLength(length: number, errorMessage?: string): StringValidationBuilder<T, 'minLength'>;
  
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
  maxLength(length: number, errorMessage?: string): StringValidationBuilder<T, 'maxLength'>;
  
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
  startsWith(prefix: string, errorMessage?: string): StringValidationBuilder<T, 'startsWith'>;
  
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
  endsWith(suffix: string, errorMessage?: string): StringValidationBuilder<T, 'endsWith'>;
  
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
  matches(pattern: string, errorMessage?: string): StringValidationBuilder<T, 'matches'>;
}

/**
 * Interface for string validation methods with specific validators excluded
 */
export type StringValidationBuilder<T, ExcludedMethods extends string = never> = 
  Omit<StringValidationBuilderBase<T>, ExcludedMethods & keyof StringValidationBuilderBase<T>>;

/**
 * Interface for numeric validation methods without any exclusions
 */
export interface NumericValidationBuilderBase<T> extends BaseValidationBuilder {
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
  gt(value: number, errorMessage?: string): NumericValidationBuilder<T, 'gt' | 'positive'>;
  
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
   * 
   * @param value - The value that the field must be less than
   * @param errorMessage - Optional custom error message
   */
  lt(value: number, errorMessage?: string): NumericValidationBuilder<T, 'lt' | 'negative'>;
  
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
   * 
   * @param value - The value that the field must be greater than or equal to
   * @param errorMessage - Optional custom error message
   */
  gte(value: number, errorMessage?: string): NumericValidationBuilder<T, 'gte'>;
  
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
   * 
   * @param value - The value that the field must be less than or equal to
   * @param errorMessage - Optional custom error message
   */
  lte(value: number, errorMessage?: string): NumericValidationBuilder<T, 'lte'>;

  /**
   * Validates that a numeric field is positive
   * ⚠️ Only applicable for integer or float fields
   * 
   * @example
   * // Integer field example
   * a.integer().validate(v => v.positive())
   * 
   * // Float field example
   * a.float().validate(v => v.positive())
   * 
   * @param errorMessage - Optional custom error message
   */
  positive(errorMessage?: string): NumericValidationBuilder<T, 'positive' | 'gt'>;

  /**
   * Validates that a numeric field is negative
   * ⚠️ Only applicable for integer or float fields
   * 
   * @example
   * // Integer field example
   * a.integer().validate(v => v.negative())
   * 
   * // Float field example
   * a.float().validate(v => v.negative())
   * 
   * @param errorMessage - Optional custom error message
   */
  negative(errorMessage?: string): NumericValidationBuilder<T, 'negative' | 'lt'>;
}

/**
 * Interface for numeric validation methods with specific validators excluded
 */
export type NumericValidationBuilder<T, ExcludedMethods extends string = never> = 
  Omit<NumericValidationBuilderBase<T>, ExcludedMethods & keyof NumericValidationBuilderBase<T>>;

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
 * A builder for creating field validation rules
 * @typeParam T - The type of the field being validated
 */
export class ValidationBuilder<T> implements StringValidationBuilderBase<T>, NumericValidationBuilderBase<T> {
  private rules: ValidationRule[] = [];
  private fieldType: ModelFieldType;

  constructor(fieldType: ModelFieldType) {
    this.fieldType = fieldType;
  }

  /**
   * Validates that a numeric field is greater than the specified value
   * @param value - The value that the field must be greater than
   * @param errorMessage - Optional custom error message
   */
  gt(value: number, errorMessage?: string): ValidationBuilder<T> {
    this.rules.push({ type: ValidationType.GT, value, errorMessage });
    return this;
  }

  /**
   * Validates that a numeric field is less than the specified value
   * @param value - The value that the field must be less than
   * @param errorMessage - Optional custom error message
   */
  lt(value: number, errorMessage?: string): ValidationBuilder<T> {
    this.rules.push({ type: ValidationType.LT, value, errorMessage });
    return this;
  }

  /**
   * Validates that a numeric field is greater than or equal to the specified value
   * @param value - The value that the field must be greater than or equal to
   * @param errorMessage - Optional custom error message
   */
  gte(value: number, errorMessage?: string): ValidationBuilder<T> {
    this.rules.push({ type: ValidationType.GTE, value, errorMessage });
    return this;
  }

  /**
   * Validates that a numeric field is less than or equal to the specified value
   * @param value - The value that the field must be less than or equal to
   * @param errorMessage - Optional custom error message
   */
  lte(value: number, errorMessage?: string): ValidationBuilder<T> {
    this.rules.push({ type: ValidationType.LTE, value, errorMessage });
    return this;
  }

  /**
   * Validates that a numeric field is positive. We use gt(0) internally to achieve this.
   * @param errorMessage - Optional custom error message
   */
  positive(errorMessage?: string): ValidationBuilder<T> {
    this.rules.push({ type: ValidationType.GT, value: 0, errorMessage });
    return this;
  }

  /**
   * Validates that a numeric field is negative. We use lt(0) internally to achieve this.
   * @param errorMessage - Optional custom error message
   */
  negative(errorMessage?: string): ValidationBuilder<T> {
    this.rules.push({ type: ValidationType.LT, value: 0, errorMessage });
    return this;
  }

  /**
   * Validates that a string field has at least the specified length
   * @param length - The minimum length required
   * @param errorMessage - Optional custom error message
   */
  minLength(length: number, errorMessage?: string): ValidationBuilder<T> {
    this.rules.push({ type: ValidationType.MIN_LENGTH, value: length, errorMessage });
    return this;
  }

  /**
   * Validates that a string field does not exceed the specified length
   * @param length - The maximum length allowed
   * @param errorMessage - Optional custom error message
   */
  maxLength(length: number, errorMessage?: string): ValidationBuilder<T> {
    this.rules.push({ type: ValidationType.MAX_LENGTH, value: length, errorMessage });
    return this;
  }

  /**
   * Validates that a string field starts with the specified prefix
   * @param prefix - The prefix the string must start with
   * @param errorMessage - Optional custom error message
   */
  startsWith(prefix: string, errorMessage?: string): ValidationBuilder<T> {
    this.rules.push({ type: ValidationType.STARTS_WITH, value: prefix, errorMessage });
    return this;
  }

  /**
   * Validates that a string field ends with the specified suffix
   * @param suffix - The suffix the string must end with
   * @param errorMessage - Optional custom error message
   */
  endsWith(suffix: string, errorMessage?: string): ValidationBuilder<T> {
    this.rules.push({ type: ValidationType.ENDS_WITH, value: suffix, errorMessage });
    return this;
  }

  /**
   * Validates that a string field matches the specified regular expression pattern
   * @param pattern - The regex pattern the string must match
   * @param errorMessage - Optional custom error message
   */
  matches(pattern: string, errorMessage?: string): ValidationBuilder<T> {
    this.rules.push({ type: ValidationType.MATCHES, value: pattern, errorMessage });
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
