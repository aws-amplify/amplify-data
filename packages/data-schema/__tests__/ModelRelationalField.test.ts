import { a } from '../src/index';
import { InternalRelationalField } from '../src/ModelRelationalField';
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
        const field = a
          .belongsTo('Test', 'testId')
          .authorization((allow) => allow.publicApiKey());
      }).not.toThrow();
    });

    it('references sets the references field value', () => {
      const field = a.belongsTo(
        'Test',
        'idFieldName',
      ) as InternalRelationalField;
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
        const field = a
          .hasOne('Test', 'testId')
          .authorization((allow) => allow.publicApiKey());
      }).not.toThrow();
    });

    it('required sets arrayRequired to true', () => {
      const field = a
        .hasOne('Test', 'testId')
        .required() as InternalRelationalField;
      expect(field.data.arrayRequired).toBe(true);
    });

    it('references sets the reference field value', () => {
      const field = a.hasOne('Test', 'idFieldName') as InternalRelationalField;
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
        const field = a
          .hasMany('Test', 'testId')
          .authorization((allow) => allow.publicApiKey());
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
      const field = a.hasMany('Test', 'idFieldName') as InternalRelationalField;
      expect(field.data.references).toEqual(['idFieldName']);
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
  test('ddb masMany / belongsTo explicitly defined reference field on related model is supported', () => {
    const schema = a
      .schema({
        Team: a.model({
          motto: a.string(),
          members: a.hasMany('Member', ['teamId']),
        }),
        Member: a.model({
          name: a.string(),
          teamId: a.id(),
          team: a.belongsTo('Team', ['teamId']),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  test('ddb masMany / belongsTo partition key + sort key is supported', () => {
    const schema = a
      .schema({
        Team: a
          .model({
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
          team: a.belongsTo('Team', ['teamId', 'teamSk']),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  test('ddb hasOne / belongsTo explicitly defined reference field on related model is supported', () => {
    const schema = a
      .schema({
        Team: a.model({
          motto: a.string(),
          project: a.hasOne('Project', ['teamId']),
        }),
        Project: a.model({
          name: a.string(),
          teamId: a.id(),
          team: a.belongsTo('Team', ['teamId']),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

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
          team: a.belongsTo('Team', ['teamId']),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  });

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
        Project: a
          .model({
            id: a.id().required(),
            name: a.string(),
            teamId: a.id(),
            team: a.belongsTo('Team', ['teamId']),
          })
          .identifier(['id']),
        Member: a
          .model({
            id: a.id().required(),
            name: a.string(),
            teamId: a.id(),
            team: a.belongsTo('Team', ['teamId']),
          })
          .identifier(['id']),
      })
      .authorization((allow) => allow.publicApiKey());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  test('heterogenous data source relationships', () => {
    const sqlSchema = aSql
      .schema({
        Team: a
          .model({
            id: a.id().required(),
            motto: a.string(),
            members: a.hasMany('Member', ['teamId']),
            project: a.hasOne('Project', ['teamId']),
          })
          .identifier(['id']),
      })
      .authorization((allow) => allow.publicApiKey());

    const ddbSchema = a
      .schema({
        Project: a
          .model({
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
          team: a.belongsTo('Team', ['teamId']),
        }),
      })
      .authorization((allow) => allow.publicApiKey());

    const schema = a.combine([sqlSchema, ddbSchema]);
    const graphql = schema.schemas
      .map((schema) => schema.transform().schema)
      .join('\n');
    expect(graphql).toMatchSnapshot();
  });
});
