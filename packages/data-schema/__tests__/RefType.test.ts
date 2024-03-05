import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { a } from '../index';

// evaluates type defs in corresponding test-d.ts file
it('should not produce static type errors', async () => {
  await expectTypeTestsToPassAsync(__filename);
});

describe('RefType', () => {
  describe('no modifiers applied', () => {
    it('creates correct RefType data with default values', () => {
      const refType = a.ref('SomeType');
      expect((refType as any).data).toMatchObject(
        expect.objectContaining({
          valueRequired: false,
          array: false,
          arrayRequired: false,
        }),
      );
    });

    it('produces expected transformed schema', () => {
      const schema = a
        .schema({
          TestModel: a.model({
            ref: a.ref('Enum'),
          }),
          Enum: a.enum(['1', '2']),
        })
        .authorization([a.allow.public()]);

      const transformed = schema.transform().schema;

      expect(/ref: Enum(?!!)/.test(transformed)).toBe(true);
    });
  });

  describe('RefType modifiers', () => {
    describe('.require()', () => {
      it('marks the RefType field having required value', () => {
        const refType = a.ref('SomeType').required();
        expect((refType as any).data).toMatchObject(
          expect.objectContaining({
            valueRequired: true,
            array: false,
            arrayRequired: false,
          }),
        );
      });

      it('produces expected transformed schema', () => {
        const schema = a
          .schema({
            TestModel: a.model({
              ref: a.ref('Enum').required(),
            }),
            Enum: a.enum(['1', '2']),
          })
          .authorization([a.allow.public()]);

        const transformed = schema.transform().schema;

        expect(/ref: Enum!/.test(transformed)).toBe(true);
      });
    });

    describe('.array()', () => {
      it('marks the RefType field having an optional array of values', () => {
        const refType = a.ref('SomeType').array();
        expect((refType as any).data).toMatchObject(
          expect.objectContaining({
            valueRequired: false,
            array: true,
            arrayRequired: false,
          }),
        );
      });

      it('produces expected transformed schema', () => {
        const schema = a
          .schema({
            TestModel: a.model({
              ref: a.ref('Enum').array(),
            }),
            Enum: a.enum(['1', '2']),
          })
          .authorization([a.allow.public()]);

        const transformed = schema.transform().schema;

        expect(/ref: \[Enum\]/.test(transformed)).toBe(true);
      });
    });

    describe('.required().array()', () => {
      it('marks the RefType field having an optional array of non-nullable value', () => {
        const refType = a.ref('SomeType').required().array();
        expect((refType as any).data).toMatchObject(
          expect.objectContaining({
            valueRequired: true,
            array: true,
            arrayRequired: false,
          }),
        );
      });

      it('produces expected transformed schema', () => {
        const schema = a
          .schema({
            TestModel: a.model({
              ref: a.ref('Enum').required().array(),
            }),
            Enum: a.enum(['1', '2']),
          })
          .authorization([a.allow.public()]);

        const transformed = schema.transform().schema;

        expect(/ref: \[Enum!\]/.test(transformed)).toBe(true);
      });
    });

    describe('.array().required()', () => {
      it('marks the RefType field having a required array of nullable value', () => {
        const refType = a.ref('SomeType').array().required();
        expect((refType as any).data).toMatchObject(
          expect.objectContaining({
            valueRequired: false,
            array: true,
            arrayRequired: true,
          }),
        );
      });

      it('produces expected transformed schema', () => {
        const schema = a
          .schema({
            TestModel: a.model({
              ref: a.ref('Enum').array().required(),
            }),
            Enum: a.enum(['1', '2']),
          })
          .authorization([a.allow.public()]);

        const transformed = schema.transform().schema;

        expect(/ref: \[Enum\]!/.test(transformed)).toBe(true);
      });
    });

    describe('.required().array().required()', () => {
      it('marks the RefType field having a required array of non-nullable value', () => {
        const refType = a.ref('SomeType').required().array().required();
        expect((refType as any).data).toMatchObject(
          expect.objectContaining({
            valueRequired: true,
            array: true,
            arrayRequired: true,
          }),
        );
      });

      it('produces expected transformed schema', () => {
        const schema = a
          .schema({
            TestModel: a.model({
              ref: a.ref('Enum').required().array().required(),
            }),
            Enum: a.enum(['1', '2']),
          })
          .authorization([a.allow.public()]);

        const transformed = schema.transform().schema;

        expect(/ref: \[Enum!\]!/.test(transformed)).toBe(true);
      });
    });
  });
});
