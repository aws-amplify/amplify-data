import { a } from '../index';
import { InternalField } from '../src/ModelField';
import {
  InternalRelationalField,
  ModelRelationalField,
  ModelRelationalTypeArgFactory,
  ModelRelationshipTypes,
} from '../src/ModelRelationalField';

describe('relational field required modifier', () => {
  describe('belongsTo', () => {
    it("doesn't offer a required modifier", () => {
      expect(() => {
        // @ts-expect-error
        const field = a.belongsTo('Test').required();
      }).toThrow();
    });

    it("doesn't offer an arrayRequired modifier", () => {
      expect(() => {
        // @ts-expect-error
        const field = a.belongsTo('Test').arrayRequired();
      }).toThrow();
    });

    it("doesn't offer an valueRequired modifier", () => {
      expect(() => {
        // @ts-expect-error
        const field = a.belongsTo('Test').valueRequired();
      }).toThrow();
    });

    it('offers an authorization modifier', () => {
      expect(() => {
        const field = a.belongsTo('Test').authorization([]);
      }).not.toThrow();
    });

    it('references sets the references field value', () => {
      const field = a
        .belongsTo('Test')
        .references('idFieldName') as InternalRelationalField;
      expect(field.data.references).toBe('idFieldName');
    });
  });

  describe('hasOne', () => {
    it('offers a required modifier', () => {
      expect(() => {
        const field = a.hasOne('Test').required();
      }).not.toThrow();
    });

    it("doesn't offer an arrayRequired modifier", () => {
      expect(() => {
        // @ts-expect-error
        const field = a.hasOne('Test').arrayRequired();
      }).toThrow();
    });

    it("doesn't offer an valueRequired modifier", () => {
      expect(() => {
        // @ts-expect-error
        const field = a.hasOne('Test').valueRequired();
      }).toThrow();
    });

    it('offers an authorization modifier', () => {
      expect(() => {
        const field = a.hasOne('Test').authorization([]);
      }).not.toThrow();
    });

    it('required sets arrayRequired to true', () => {
      const field = a.hasOne('Test').required() as InternalRelationalField;
      expect(field.data.arrayRequired).toBe(true);
    });

    it('references sets the reference field value', () => {
      const field = a
        .hasOne('Test')
        .references('idFieldName') as InternalRelationalField;
      expect(field.data.references).toBe('idFieldName');
    });
  });

  describe('hasMany', () => {
    it("doesn't offer a required modifier", () => {
      expect(() => {
        // @ts-expect-error
        const field = a.hasMany('Test').required();
      }).toThrow();
    });

    it('offers an arrayRequired modifier', () => {
      expect(() => {
        const field = a.hasMany('Test').arrayRequired();
      }).not.toThrow();
    });

    it('offers an valueRequired modifier', () => {
      expect(() => {
        const field = a.hasMany('Test').valueRequired();
      }).not.toThrow();
    });

    it('offers an authorization modifier', () => {
      expect(() => {
        const field = a.hasMany('Test').authorization([]);
      }).not.toThrow();
    });

    it('arrayRequired sets arrayRequired to true', () => {
      const field = a
        .hasMany('Test')
        .arrayRequired() as InternalRelationalField;
      expect(field.data.arrayRequired).toBe(true);
    });

    it('valueRequired sets valueRequired to true', () => {
      const field = a
        .hasMany('Test')
        .valueRequired() as InternalRelationalField;
      expect(field.data.valueRequired).toBe(true);
    });

    it('references sets the reference field value', () => {
      const field = a
        .hasMany('Test')
        .references('idFieldName') as InternalRelationalField;
      expect(field.data.references).toBe('idFieldName');
    });
  });

  describe('manyToMany', () => {
    it("doesn't offer a required modifier", () => {
      expect(() => {
        // @ts-ignore
        const field = a.manyToMany('Test', { relationName: 'Test' }).required();
      }).toThrow();
    });

    it('offers an arrayRequired modifier', () => {
      expect(() => {
        const field = a
          .manyToMany('Test', { relationName: 'Test' })
          .arrayRequired();
      }).not.toThrow();
    });

    it('offers an valueRequired modifier', () => {
      expect(() => {
        const field = a
          .manyToMany('Test', { relationName: 'Test' })
          .valueRequired();
      }).not.toThrow();
    });

    it('offers an authorization modifier', () => {
      expect(() => {
        const field = a
          .manyToMany('Test', { relationName: 'Test' })
          .authorization([]);
      }).not.toThrow();
    });

    it('arrayRequired sets arrayRequired to true', () => {
      const field = a
        .manyToMany('Test', { relationName: 'Test' })
        .arrayRequired() as InternalRelationalField;
      expect(field.data.arrayRequired).toBe(true);
    });

    it('valueRequired sets valueRequired to true', () => {
      const field = a
        .manyToMany('Test', { relationName: 'Test' })
        .valueRequired() as InternalRelationalField;
      expect(field.data.valueRequired).toBe(true);
    });

    it('references is not supported by manyToMany', () => {
      expect(() => {
        const field = a
          .manyToMany('Test', { relationName: 'Test' })
          // @ts-expect-error
          .references('idFieldName') as InternalRelationalField;
      }).toThrow();
    });
  });
});
