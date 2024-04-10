import { a } from '../index';
import { InternalField } from '../src/ModelField';
import {
  InternalRelationalField,
  ModelRelationalField,
  ModelRelationalTypeArgFactory,
  ModelRelationshipTypes,
} from '../src/ModelRelationalField';
import { configure } from '../src/ModelSchema';

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
        const field = a.belongsTo('Test', 'testId').valueRequired();
      }).toThrow();
    });

    it('offers an authorization modifier', () => {
      expect(() => {
        const field = a.belongsTo('Test', 'testId').authorization([]);
      }).not.toThrow();
    });

    it('references sets the references field value', () => {
      const field = a
        .belongsTo('Test', 'idFieldName') as InternalRelationalField;
      expect(field.data.references).toEqual(['idFieldName']);
    });
  });

  describe('hasOne', () => {
    it('offers a required modifier', () => {
      expect(() => {
        const field = a.hasOne('Test', 'testId').required();
      }).not.toThrow();
    });

    it("doesn't offer an arrayRequired modifier", () => {
      expect(() => {
        // @ts-expect-error
        const field = a.hasOne('Test', 'testId').arrayRequired();
      }).toThrow();
    });

    it("doesn't offer an valueRequired modifier", () => {
      expect(() => {
        // @ts-expect-error
        const field = a.hasOne('Test', 'testId').valueRequired();
      }).toThrow();
    });

    it('offers an authorization modifier', () => {
      expect(() => {
        const field = a.hasOne('Test', 'testId').authorization([]);
      }).not.toThrow();
    });

    it('required sets arrayRequired to true', () => {
      const field = a.hasOne('Test', 'testId').required() as InternalRelationalField;
      expect(field.data.arrayRequired).toBe(true);
    });

    it('references sets the reference field value', () => {
      const field = a
        .hasOne('Test', 'idFieldName') as InternalRelationalField;
      expect(field.data.references).toEqual(['idFieldName']);
    });
  });

  describe('hasMany', () => {
    it("doesn't offer a required modifier", () => {
      expect(() => {
        // @ts-expect-error
        const field = a.hasMany('Test', 'testId').required();
      }).toThrow();
    });

    it('offers an arrayRequired modifier', () => {
      expect(() => {
        const field = a.hasMany('Test', 'testId').arrayRequired();
      }).not.toThrow();
    });

    it('offers an valueRequired modifier', () => {
      expect(() => {
        const field = a.hasMany('Test', 'testId').valueRequired();
      }).not.toThrow();
    });

    it('offers an authorization modifier', () => {
      expect(() => {
        const field = a.hasMany('Test', 'testId').authorization([]);
      }).not.toThrow();
    });

    it('arrayRequired sets arrayRequired to true', () => {
      const field = a
        .hasMany('Test', 'testId')
        .arrayRequired() as InternalRelationalField;
      expect(field.data.arrayRequired).toBe(true);
    });

    it('valueRequired sets valueRequired to true', () => {
      const field = a
        .hasMany('Test', 'testId')
        .valueRequired() as InternalRelationalField;
      expect(field.data.valueRequired).toBe(true);
    });

    it('references sets the reference field value', () => {
      const field = a
        .hasMany('Test', 'idFieldName') as InternalRelationalField;
      expect(field.data.references).toEqual(['idFieldName']);
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
          .references(['idFieldName']) as InternalRelationalField;
      }).toThrow();
    });
  });
});

const fakeSecret = () => ({}) as any;

const datasourceConfigMySQL = {
  engine: 'mysql',
  connectionUri: fakeSecret(),
} as const;

const aSql = configure({ database: datasourceConfigMySQL });

describe('schema generation with relationships', () => {
  test('ddb masMany / belongsTo fails if reference field on related model is undefined', () => {
    const schema = a.schema({
      Team: a.model({
        motto: a.string(),
        members: a.hasMany('Member', ['teamId']),
      }),
      Member: a.model({
        name: a.string(),
        team: a.belongsTo('Team', ['teamId'])
      })
    })
      .authorization([a.allow.public()]);

    // FIXME: This should throw an error -- `teamId` isn't defined on `Member`
    expect(schema.transform().schema).toMatchSnapshot(); // .toThrowError()
  });

  test('ddb masMany / belongsTo explicitly defined reference field on related model is supported', () => {
    const schema = a.schema({
      Team: a.model({
        motto: a.string(),
        members: a.hasMany('Member', ['teamId']),
      }),
      Member: a.model({
        name: a.string(),
        teamId: a.id(),
        team: a.belongsTo('Team', ['teamId'])
      })
    })
      .authorization([a.allow.public()]);

    expect(schema.transform().schema).toMatchSnapshot();
  });

  test('ddb masMany / belongsTo partition key + sort key is supported', () => {
    const schema = a.schema({
      Team: a.model({
        id: a.id().required(),
        sk: a.id().required(),
        motto: a.string(),
        members: a.hasMany('Member', ['teamId', 'teamSk']),
      })
      .identifier(['id', 'sk']),
      Member: a.model({
        name: a.string(),
        teamId: a.id(),
        teamSk: a.id(),
        team: a.belongsTo('Team', ['teamId', 'teamSk'])
      })
    })
      .authorization([a.allow.public()]);

    expect(schema.transform().schema).toMatchSnapshot();
  });

  test('ddb masMany / belongsTo partition key + sort key - undefined sort key reference on related model fails', () => {
    const schema = a.schema({
      Team: a.model({
        id: a.id().required(),
        sk: a.id().required(),
        motto: a.string(),
        members: a.hasMany('Member', ['teamId', 'teamSk']),
      })
      .identifier(['id', 'sk']),
      Member: a.model({
        name: a.string(),
        teamId: a.id(),
        team: a.belongsTo('Team', ['teamId', 'teamSk'])
      })
    })
      .authorization([a.allow.public()]);

    // FIXME: This should throw an error -- ...
    expect(schema.transform().schema).toMatchSnapshot(); // toThrowError
  });

  test('ddb hasOne / belongsTo explicitly defined reference field on related model is supported', () => {
    const schema = a.schema({
      Team: a.model({
        motto: a.string(),
        project: a.hasOne('Project', ['teamId']),
      }),
      Project: a.model({
        name: a.string(),
        teamId: a.id(),
        team: a.belongsTo('Team', ['teamId']),
      })
    })
      .authorization([a.allow.public()]);

    expect(schema.transform().schema).toMatchSnapshot();
  });

  test('relationships', () => {
    const schema = a
      .schema({
        Team: a.model({
          motto: a.string(),
          members: a.hasMany('Member', ['teamId']),
          project: a.hasOne('Project', ['teamId']),
        }),
        Project: a.model({
          name: a.string(),
          teamId: a.id(),
          team: a.belongsTo('Team', ['teamId']),
        }),
        Member: a.model({
          name: a.string(),
          teamId: a.id(),
          team: a.belongsTo('Team', ['teamId'])
        })
      })
      .authorization([a.allow.public()]);

    expect(schema.transform().schema).toMatchSnapshot();
  })

  test('sql references', () => {

    const schema = aSql
      .schema({
        Team: a
          .model({
            id: a.id().required(),
            motto: a.string(),
            members: a.hasMany('Member', 'teamMembersId'),
            project: a.hasOne('Project', 'teamProjectId'),
          })
          .identifier(['id']),
        Project: a.model({
          id: a.id().required(),
          name: a.string(),
          teamId: a.id(),
          team: a.belongsTo('Team', ['teamId']),
        })
          .identifier(['id']),
        Member: a.model({
          id: a.id().required(),
          name: a.string(),
          teamId: a.id(),
          team: a.belongsTo('Team', ['teamId'])
        })
          .identifier(['id'])
      })
      .authorization([a.allow.public()]);

    expect(schema.transform().schema).toMatchSnapshot();
  });

  test('heterogenous data source relationships', () => {
    const sqlSchema = aSql.schema({
      Team: a.model({
        id: a.id().required(),
        motto: a.string(),
        members: a.hasMany('Member', ['teamId']),
        project: a.hasOne('Project', ['teamId']),
      })
      .identifier(['id']),
    })
    .authorization([a.allow.public()]);

    const ddbSchema = a.schema({
      Project: a.model({
        id: a.id().required(),
        name: a.string(),
        teamId: a.id(),
        team: a.belongsTo('Team', ['teamId']),
      })
        .identifier(['id']),
      Member: a.model({
        id: a.id().required(),
        name: a.string(),
        teamId: a.id(),
        team: a.belongsTo('Team', ['teamId'])
      })
    })
    .authorization([a.allow.public()]);

    const schema = a.combine([sqlSchema, ddbSchema]);
    // FIXME: Property 'transform' does not exist on type 'CombinedModelSchema<[RDSModelSchema<SetTypeSubArg< ...
    // const graphql = schema.transform().schema
    // expect(graphql).toMatchSnapshot();
  });
});
