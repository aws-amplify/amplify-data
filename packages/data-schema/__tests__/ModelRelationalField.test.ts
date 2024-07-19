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

  describe('validation for malformed relationships', () => {
    test('conflicting relational definition on related model fails', () => {
      const schema = a
        .schema({
          Team: a.model({
            members: a.hasMany('Member', ['teamId']),
          }),
          Member: a.model({
            teamId: a.id(),
            team: a.belongsTo('Team', ['teamId']),
            team2: a.belongsTo('Team', ['teamId']),
          }),
        })
        .authorization((allow) => [allow.publicApiKey()]);

      expect(() => schema.transform().schema).toThrowError(
        `Found multiple relationship associations with Member.team, Member.team2 for Team.members: [Member] @hasMany(references: ['teamId'])`,
      );
    });

    test('conflicting relational definition on parent model fails', () => {
      const schema = a
        .schema({
          Team: a.model({
            members: a.hasMany('Member', ['teamId']),
            members2: a.hasMany('Member', ['teamId']),
          }),
          Member: a.model({
            teamId: a.id(),
            team: a.belongsTo('Team', ['teamId']),
          }),
        })
        .authorization((allow) => [allow.publicApiKey()]);

      expect(() => schema.transform().schema).toThrowError(
        `Found multiple relationship associations with Team.members, Team.members2 for Member.team: Team @belongsTo(references: ['teamId'])`,
      );
    });

    test('More identifiers on parent than references defined fails', () => {
      const schema = a
        .schema({
          Team: a
            .model({
              id: a.id().required(),
              id2: a.id().required(),
              members: a.hasMany('Member', ['teamId']),
              members2: a.hasMany('Member', ['teamId']),
            })
            .identifier(['id', 'id2']),
          Member: a.model({
            teamId: a.id(),
            team: a.belongsTo('Team', ['teamId']),
          }),
        })
        .authorization((allow) => [allow.publicApiKey()]);

      expect(() => schema.transform().schema).toThrowError(
        [
          'The identifiers defined on Team must match the reference fields defined on Member.',
          '2 identifiers defined on Team.',
          '1 reference fields found on Member',
        ].join('\n'),
      );
    });

    test('Fewer identifiers on parent than references defined fails', () => {
      const schema = a
        .schema({
          Team: a
            .model({
              id: a.id().required(),
              members: a.hasMany('Member', ['teamIdPart1', 'teamIdPart2']),
              members2: a.hasMany('Member', ['teamIdPart1', 'teamIdPart2']),
            })
            .identifier(['id']),
          Member: a.model({
            teamIdPart1: a.id(),
            teamIdPart2: a.id(),
            team: a.belongsTo('Team', ['teamIdPart1', 'teamIdPart2']),
          }),
        })
        .authorization((allow) => [allow.publicApiKey()]);

      expect(() => schema.transform().schema).toThrowError(
        [
          'The identifiers defined on Team must match the reference fields defined on Member.',
          '1 identifiers defined on Team.',
          '2 reference fields found on Member',
        ].join('\n'),
      );
    });

    test('Multiple relational definition on parent model ', () => {
      const schema = a
        .schema({
          Team: a.model({
            members: a.hasMany('Member', ['teamId']),
            members2: a.hasMany('Member', ['teamId']),
          }),
          Member: a.model({
            teamId: a.id(),
            team: a.belongsTo('Team', ['teamId']),
          }),
        })
        .authorization((allow) => [allow.publicApiKey()]);

      expect(() => schema.transform().schema).toThrowError(
        `Found multiple relationship associations with Team.members, Team.members2 for Member.team: Team @belongsTo(references: ['teamId'])`,
      );
    });
  });
});
