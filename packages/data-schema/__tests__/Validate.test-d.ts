import { a } from '../src';

/**
 * This test suite checks that the validate builder function is only available on 
 * String, Integer, and Float field types, and not available on any other field types.
 */
describe('Validate builder function availability on different field types', () => {
  it('Validate builder function is available on String, Integer, and Float field types', () => {
    const stringField = a.string().validate(v => v.minLength(5));
    const integerField = a.integer().validate(v => v.gt(10));
    const floatField = a.float().validate(v => v.lt(100));
  });
  
  it('Validate builder function is not available on any other field types', () => {
    // @ts-expect-error
    const idField = a.id().validate(v => v.minLength(5));
    // @ts-expect-error
    const booleanField = a.boolean().validate(v => v.minLength(5));
    // @ts-expect-error
    const dateField = a.date().validate(v => v.gt(10));
    // @ts-expect-error
    const timeField = a.time().validate(v => v.gt(10));
    // @ts-expect-error
    const dateTimeField = a.datetime().validate(v => v.gt(10));
    // @ts-expect-error
    const timestampField = a.timestamp().validate(v => v.endsWith('Z'));
    // @ts-expect-error
    const emailField = a.email().validate(v => v.lt(100));
    // @ts-expect-error
    const jsonField = a.json().validate(v => v.minLength(5));
    // @ts-expect-error
    const phoneField = a.phone().validate(v => v.gt(10));
    // @ts-expect-error
    const urlField = a.url().validate(v => v.lt(100));
    // @ts-expect-error
    const ipAddressField = a.ipAddress().validate(v => v.gt(10));
  });
});

/**
 * This test suite checks that the validate builder function is not available on any array field types.
 */
describe('Validate builder function is not available on array field types', () => {
  it('Validate builder function is not available on array field types', () => {
    // @ts-expect-error
    const stringArrayField = a.string().array().validate(v => v.minLength(5));
    // @ts-expect-error
    const integerArrayField = a.integer().array().validate(v => v.minLength(5));
    // @ts-expect-error
    const floatArrayField = a.float().array().validate(v => v.minLength(5));
    // @ts-expect-error
    const idArrayField = a.id().array().validate(v => v.minLength(5));
    // @ts-expect-error
    const booleanArrayField = a.boolean().array().validate(v => v.minLength(5));
    // @ts-expect-error
    const dateArrayField = a.date().array().validate(v => v.minLength(5));
    // @ts-expect-error
    const timeArrayField = a.time().array().validate(v => v.minLength(5));
    // @ts-expect-error
    const dateTimeArrayField = a.datetime().array().validate(v => v.minLength(5));
    // @ts-expect-error
    const timestampArrayField = a.timestamp().array().validate(v => v.minLength(5));
    // @ts-expect-error
    const emailArrayField = a.email().array().validate(v => v.minLength(5));
    // @ts-expect-error
    const jsonArrayField = a.json().array().validate(v => v.minLength(5));
    // @ts-expect-error
    const phoneArrayField = a.phone().array().validate(v => v.minLength(5));
    // @ts-expect-error
    const urlArrayField = a.url().array().validate(v => v.minLength(5));
    // @ts-expect-error
    const ipAddressArrayField = a.ipAddress().array().validate(v => v.minLength(5));
  });
});

/**
 * This test suite checks that the validate builder function has to always go after the default builder function.
 */
describe('Validate builder function must go after the default builder function', () => {
  it('Validate builder function after default builder function is acceptable', () => {
    const stringField = a.string().default('test').validate(v => v.minLength(5));
    const integerField = a.integer().default(10).validate(v => v.gt(10));
    const floatField = a.float().default(100).validate(v => v.lt(100));
  });

  it('Validate builder function before default builder function is not acceptable', () => {
    // @ts-expect-error
    const stringField = a.string().validate(v => v.minLength(5)).default('test');
    // @ts-expect-error
    const integerField = a.integer().validate(v => v.gt(10)).default(10);
    // @ts-expect-error
    const floatField = a.float().validate(v => v.lt(100)).default(100);
  });
});

/**
 * This test suite checks the compatibility between field types and validators.
 */
describe('Validation compatibility between field types and validators', () => {
  it('String field type with string validators are compatible', () => {
    const stringField = a.string().validate(v => v
      .minLength(5, 'String must be at least 5 characters long')
      .maxLength(100, 'String must be at most 100 characters long')
      .startsWith('prefix-', 'String must start with prefix-')
      .endsWith('-suffix', 'String must end with -suffix')
      .matches('^[a-zA-Z0-9]+$', 'String must be alphanumeric')
    );
  });

  it('Integer field type with numeric validators are compatible', () => {
    const integerField1 = a.integer().validate(v => v
      .gt(10, 'Integer must be greater than 10')
      .lt(100, 'Integer must be less than 100')
      .gte(0, 'Integer must be greater than or equal to 0')
      .lte(50, 'Integer must be less than or equal to 50')
    );
    const integerField2 = a.integer().validate(v => v.positive());
    const integerField3 = a.integer().validate(v => v.negative());
  });

  it('Float field type with numeric validators are compatible', () => {
    const floatField1 = a.float().validate(v => v
      .gt(3.14, 'Float must be greater than 3.14')
      .lt(9.99, 'Float must be less than 9.99')
      .gte(0.0, 'Float must be greater than or equal to 0.0')
      .lte(10.5, 'Float must be less than or equal to 10.5')
    );
    const floatField2 = a.float().validate(v => v.positive());
    const floatField3 = a.float().validate(v => v.negative());
  });

  it('String field types with numeric validators are incompatible', () => {
    // @ts-expect-error
    const stringField1 = a.string().validate(v => v.gt(10));
    // @ts-expect-error
    const stringField2 = a.string().validate(v => v.lt(100));
    // @ts-expect-error
    const stringField3 = a.string().validate(v => v.gte(0));
    // @ts-expect-error
    const stringField4 = a.string().validate(v => v.lte(50));
    // @ts-expect-error
    const stringField5 = a.string().validate(v => v.positive());
    // @ts-expect-error
    const stringField6 = a.string().validate(v => v.negative());
  });

  it('Integer field type with string validators are incompatible', () => {
    // @ts-expect-error
    const integerField1 = a.integer().validate(v => v.minLength(5));
    // @ts-expect-error
    const integerField2 = a.integer().validate(v => v.maxLength(100));
    // @ts-expect-error
    const integerField3 = a.integer().validate(v => v.startsWith('prefix-'));
    // @ts-expect-error
    const integerField4 = a.integer().validate(v => v.endsWith('-suffix'));
    // @ts-expect-error
    const integerField5 = a.integer().validate(v => v.matches('[0-9]+'));
  });

  it('Float field type with string validators are incompatible', () => {
    // @ts-expect-error
    const floatField1 = a.float().validate(v => v.minLength(5));
    // @ts-expect-error
    const floatField2 = a.float().validate(v => v.maxLength(100));
    // @ts-expect-error
    const floatField3 = a.float().validate(v => v.startsWith('prefix-'));
    // @ts-expect-error
    const floatField4 = a.float().validate(v => v.endsWith('-suffix'));
    // @ts-expect-error
    const floatField5 = a.float().validate(v => v.matches('[0-9]+'));
  });
});

/**
 * This test suite checks that positive and gt/negative and lt cannot be used together. 
 * The reason is that they use the same operator (> or <), which is disallowed in the ValidateTransformer.
 */
describe('Positive and gt/negative and lt cannot be used together', () => {
  it('Positive and gt cannot be used together', () => {
    // @ts-expect-error
    const integerField = a.integer().validate(v => v.positive().gt(10));
    // @ts-expect-error
    const floatField = a.float().validate(v => v.gt(10).positive());
  });

  it('Negative and lt cannot be used together', () => {
    // @ts-expect-error
    const integerField = a.integer().validate(v => v.negative().lt(10));
    // @ts-expect-error
    const floatField = a.float().validate(v => v.lt(10).negative());
  });

  it('Positive, lt, gte, lte can be used together', () => {
    const integerField = a.integer().validate(v => v.positive().lt(10).gte(0).lte(50));
    const floatField = a.float().validate(v => v.positive().lt(10).gte(0).lte(50));
  });

  it('Negative, gt, gte, lte can be used together', () => {
    const integerField = a.integer().validate(v => v.negative().gt(10).gte(0).lte(50));
    const floatField = a.float().validate(v => v.negative().gt(10).gte(0).lte(50));
  });
});

/**
 * This test suite checks that each validator can only be used once on the same field.
 */
describe('Each validator can only be used once on the same field', () => {
  it('Numeric validators can only be used once on the same Integer/Float field', () => {
    // @ts-expect-error
    const integerField1 = a.integer().validate(v => v.gt(0).gt(10));
    // @ts-expect-error
    const integerField2 = a.integer().validate(v => v.lt(0).lt(10));
    // @ts-expect-error
    const integerField3 = a.integer().validate(v => v.gte(0).gte(10));
    // @ts-expect-error
    const integerField4 = a.integer().validate(v => v.lte(0).lte(10));
    // @ts-expect-error
    const integerField5 = a.integer().validate(v => v.positive().positive());
    // @ts-expect-error
    const integerField6 = a.integer().validate(v => v.negative().negative());
    // @ts-expect-error
    const floatField1 = a.float().validate(v => v.gt(0).gt(10));
    // @ts-expect-error
    const floatField2 = a.float().validate(v => v.lt(0).lt(10));
    // @ts-expect-error
    const floatField3 = a.float().validate(v => v.gte(0).gte(10));
    // @ts-expect-error
    const floatField4 = a.float().validate(v => v.lte(0).lte(10));
    // @ts-expect-error
    const floatField5 = a.float().validate(v => v.positive().positive());
    // @ts-expect-error
    const floatField6 = a.float().validate(v => v.negative().negative());
  });

  it('String validators can only be used once on the same String field', () => {
    // @ts-expect-error
    const stringField1 = a.string().validate(v => v.minLength(5).minLength(10));
    // @ts-expect-error
    const stringField2 = a.string().validate(v => v.maxLength(5).maxLength(10));
    // @ts-expect-error
    const stringField3 = a.string().validate(v => v.startsWith('prefix-').startsWith('prefix-'));
    // @ts-expect-error
    const stringField4 = a.string().validate(v => v.endsWith('-suffix').endsWith('-suffix'));
    // @ts-expect-error
    const stringField5 = a.string().validate(v => v.matches('^[a-zA-Z0-9]+$').matches('^[a-zA-Z0-9]+$'));
  });
});