import { ModelFieldTypeParamOuter, ModelFieldType } from './ModelField';

//=============================================================================
// #region Constants and Enums
//=============================================================================

/**
 * Zero value
 */
const ZERO = 0;

/**
 * Enum of all supported validation types
 */
export enum ValidationType {
  // Numeric validations
  GT = 'gt',           // Greater than
  LT = 'lt',           // Less than
  GTE = 'gte',         // Greater than or equal
  LTE = 'lte',         // Less than or equal
  
  // Syntactic sugar for numeric validations
  POSITIVE = 'positive', // Syntactic sugar for GT with value 0
  NEGATIVE = 'negative', // Syntactic sugar for LT with value 0
  
  // String validations
  MIN_LENGTH = 'minLength',   // Minimum string length
  MAX_LENGTH = 'maxLength',   // Maximum string length
  STARTS_WITH = 'startsWith', // String starts with
  ENDS_WITH = 'endsWith',     // String ends with
  MATCHES = 'matches'         // String matches regex pattern
}

//=============================================================================
// #endregion Constants and Enums
//=============================================================================

//=============================================================================
// #region Interfaces and Types
//=============================================================================

/**
 * Validation rule interface
 */
export interface ValidationRule {
  validationType: ValidationType;
  validationValue?: any;
  errorMessage?: string;
}

/**
 * Base interface for all validation builders
 */
export interface BaseValidationBuilder {
  getRules(): ValidationRule[];
}

//-----------------------------------------------------------------------------
// Type markers for used validators
//-----------------------------------------------------------------------------

// String validation markers
export interface WithMinLength { readonly minLength: true; }
export interface WithMaxLength { readonly maxLength: true; }
export interface WithStartsWith { readonly startsWith: true; }
export interface WithEndsWith { readonly endsWith: true; }
export interface WithMatches { readonly matches: true; }

// Numeric validation markers
export interface WithGT { readonly gt: true; }
export interface WithLT { readonly lt: true; }
export interface WithGTE { readonly gte: true; }
export interface WithLTE { readonly lte: true; }
export interface WithPositive extends WithGT { readonly positive: true; }
export interface WithNegative extends WithLT { readonly negative: true; }

//-----------------------------------------------------------------------------
// Validation builders
//-----------------------------------------------------------------------------

// String validation builder
export interface StringValidationBuilder<Used = Record<string, never>> extends BaseValidationBuilder {
  // Methods are only available if their corresponding validator hasn't been used
  minLength: Used extends WithMinLength ? never : 
    (validationValue: number, errorMessage?: string) => StringValidationBuilder<Used & WithMinLength>;
  
  maxLength: Used extends WithMaxLength ? never : 
    (validationValue: number, errorMessage?: string) => StringValidationBuilder<Used & WithMaxLength>;
  
  startsWith: Used extends WithStartsWith ? never : 
    (validationValue: string, errorMessage?: string) => StringValidationBuilder<Used & WithStartsWith>;
  
  endsWith: Used extends WithEndsWith ? never : 
    (validationValue: string, errorMessage?: string) => StringValidationBuilder<Used & WithEndsWith>;
  
  matches: Used extends WithMatches ? never : 
    (validationValue: string, errorMessage?: string) => StringValidationBuilder<Used & WithMatches>;
}

// Numeric validation builder
export interface NumericValidationBuilder<Used = Record<string, never>> extends BaseValidationBuilder {
  // Methods are only available if their corresponding validator hasn't been used
  gt: Used extends (WithGT | WithPositive) ? never : 
    (validationValue: number, errorMessage?: string) => NumericValidationBuilder<Used & WithGT>;
  
  lt: Used extends (WithLT | WithNegative) ? never : 
    (validationValue: number, errorMessage?: string) => NumericValidationBuilder<Used & WithLT>;
  
  gte: Used extends WithGTE ? never : 
    (validationValue: number, errorMessage?: string) => NumericValidationBuilder<Used & WithGTE>;
  
  lte: Used extends WithLTE ? never : 
    (validationValue: number, errorMessage?: string) => NumericValidationBuilder<Used & WithLTE>;
  
  positive: Used extends (WithPositive | WithGT) ? never : 
    (errorMessage?: string) => NumericValidationBuilder<Used & WithPositive>;
  
  negative: Used extends (WithNegative | WithLT) ? never : 
    (errorMessage?: string) => NumericValidationBuilder<Used & WithNegative>;
}

/**
 * Type for the ValidationBuilder
 */
export type ValidationBuilder<T extends ModelFieldTypeParamOuter> = 
  T extends ModelFieldType.String 
    ? StringValidationBuilder
    : T extends ModelFieldType.Integer | ModelFieldType.Float 
      ? NumericValidationBuilder
      : BaseValidationBuilder;

//=============================================================================
// #endregion Interfaces and Types
//=============================================================================

//=============================================================================
// #region ValidationBuilder Implementation
//=============================================================================

/**
 * Base class for validation builders
 */
class BaseValidationBuilderImpl implements BaseValidationBuilder {
  protected validationRules: ValidationRule[] = [];

  getRules(): ValidationRule[] {
    return this.validationRules;
  }
}

/**
 * Implementation of string validation methods
 */
class StringValidationBuilderImpl extends BaseValidationBuilderImpl implements StringValidationBuilder {
  minLength(validationValue: number, errorMessage?: string): StringValidationBuilder<WithMinLength> {
    const intLength = this.assertIntegerValue(validationValue);
    this.validationRules.push({ validationType: ValidationType.MIN_LENGTH, validationValue: intLength, errorMessage });
    return this as any;
  }

  maxLength(validationValue: number, errorMessage?: string): StringValidationBuilder<WithMaxLength> {
    const intLength = this.assertIntegerValue(validationValue);
    this.validationRules.push({ validationType: ValidationType.MAX_LENGTH, validationValue: intLength, errorMessage });
    return this as any;
  }

  startsWith(validationValue: string, errorMessage?: string): StringValidationBuilder<WithStartsWith> {
    this.validationRules.push({ validationType: ValidationType.STARTS_WITH, validationValue, errorMessage });
    return this as any;
  }

  endsWith(validationValue: string, errorMessage?: string): StringValidationBuilder<WithEndsWith> {
    this.validationRules.push({ validationType: ValidationType.ENDS_WITH, validationValue, errorMessage });
    return this as any;
  }

  matches(validationValue: string, errorMessage?: string): StringValidationBuilder<WithMatches> {
    this.validationRules.push({ validationType: ValidationType.MATCHES, validationValue, errorMessage });
    return this as any;
  }

  /**
   * Asserts that the value is an integer
   */
  protected assertIntegerValue(value: number): number {
    const intValue = Math.floor(Number(value));
    if (intValue !== Number(value)) {
      throw new Error('Length must be an integer');
    }
    return intValue;
  }
}

/**
 * Implementation of numeric validation methods
 */
class NumericValidationBuilderImpl extends BaseValidationBuilderImpl implements NumericValidationBuilder {
  gt(validationValue: number, errorMessage?: string): NumericValidationBuilder<WithGT> {
    this.validationRules.push({ validationType: ValidationType.GT, validationValue, errorMessage });
    return this as any;
  }

  lt(validationValue: number, errorMessage?: string): NumericValidationBuilder<WithLT> {
    this.validationRules.push({ validationType: ValidationType.LT, validationValue, errorMessage });
    return this as any;
  }

  gte(validationValue: number, errorMessage?: string): NumericValidationBuilder<WithGTE> {
    this.validationRules.push({ validationType: ValidationType.GTE, validationValue, errorMessage });
    return this as any;
  }

  lte(validationValue: number, errorMessage?: string): NumericValidationBuilder<WithLTE> {
    this.validationRules.push({ validationType: ValidationType.LTE, validationValue, errorMessage });
    return this as any;
  }

  positive(errorMessage?: string): NumericValidationBuilder<WithPositive> {
    this.validationRules.push({ validationType: ValidationType.GT, validationValue: ZERO, errorMessage });
    return this as any;
  }

  negative(errorMessage?: string): NumericValidationBuilder<WithNegative> {
    this.validationRules.push({ validationType: ValidationType.LT, validationValue: ZERO, errorMessage });
    return this as any;
  }
}

//=============================================================================
// #endregion ValidationBuilder Implementation
//=============================================================================

//=============================================================================
// #region Factory Function
//=============================================================================

/**
 * Factory function to create a ValidationBuilder
 * 
 * @template T The field type being validated
 * @returns A ValidationBuilder
 * @throws Error if validation is attempted on array fields
 */
export function createValidationBuilder<T extends ModelFieldTypeParamOuter>(fieldType: T): ValidationBuilder<T> {  
  if (fieldType === ModelFieldType.String) {
    return new StringValidationBuilderImpl() as StringValidationBuilder as ValidationBuilder<T>;
  } else if (fieldType === ModelFieldType.Integer || fieldType === ModelFieldType.Float) {
    return new NumericValidationBuilderImpl() as NumericValidationBuilder as ValidationBuilder<T>;
  } else {
    return new BaseValidationBuilderImpl() as unknown as ValidationBuilder<T>;
  }
}

//=============================================================================
// #endregion Factory Function
//=============================================================================