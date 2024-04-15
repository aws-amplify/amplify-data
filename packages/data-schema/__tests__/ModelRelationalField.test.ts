import { a } from '../index';
import {
  InternalRelationalField
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

    expect(() => schema.transform().schema).toThrowError(
      `reference field 'teamId' must be defined on Member. Team.members: [Member] @hasMany(references: ['teamId']) <-> Member.team: Team @belongsTo(references: ['teamId'])`
    );
  });

  test('conflicting relational definition on related model fails', () => {
    const schema = a.schema({
      Team: a.model({
        members: a.hasMany('Member', ['teamId']),
      }),
      Member: a.model({
        teamId: a.id(),
        team: a.belongsTo('Team', ['teamId']),
        team2: a.belongsTo('Team', ['teamId']),
      })
    })
      .authorization([a.allow.public()]);

    expect(() => schema.transform().schema).toThrowError(
      `Found multiple relationship associations with Member.team, Member.team2 for Team.members: [Member] @hasMany(references: ['teamId'])`
    );
  })

  test('conflicting relational definition on primary model fails', () => {
    const schema = a.schema({
      Team: a.model({
        members: a.hasMany('Member', ['teamId']),
        members2: a.hasMany('Member', ['teamId']),
      }),
      Member: a.model({
        teamId: a.id(),
        team: a.belongsTo('Team', ['teamId']),
      })
    })
      .authorization([a.allow.public()]);

    expect(() => schema.transform().schema).toThrowError(
      `Found multiple relationship associations with Team.members, Team.members2 for Member.team: Team @belongsTo(references: ['teamId'])`
    );
  })

  test('More identifiers on Primary than references defined fails', () => {
    const schema = a.schema({
      Team: a.model({
        id: a.id().required(),
        id2: a.id().required(),
        members: a.hasMany('Member', ['teamId']),
        members2: a.hasMany('Member', ['teamId']),
      })
      .identifier(['id', 'id2']),
      Member: a.model({
        teamId: a.id(),
        team: a.belongsTo('Team', ['teamId']),
      })
    })
      .authorization([a.allow.public()]);

    expect(() => schema.transform().schema).toThrowError(
      `The identifiers defined on Team must match the reference fields defined on Member.\n`
      + `2 identifiers defined on Team.\n`
      + `1 reference fields found on Member`
    );
  })

  test('Multiple relational definition on primary model ', () => {
    const schema = a.schema({
      Team: a.model({
        members: a.hasMany('Member', ['teamId']),
        members2: a.hasMany('Member', ['teamId']),
      }),
      Member: a.model({
        teamId: a.id(),
        team: a.belongsTo('Team', ['teamId']),
      })
    })
      .authorization([a.allow.public()]);

    expect(() => schema.transform().schema).toThrowError(
      `Found multiple relationship associations with Team.members, Team.members2 for Member.team: Team @belongsTo(references: ['teamId'])`
    );
  })


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

  test('ddb masMany / belongsTo partition key and sort key with undefined sort key reference on related model fails', () => {
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

    expect(() => schema.transform().schema).toThrowError(
      `reference field 'teamSk' must be defined on Member. Team.members: [Member] @hasMany(references: ['teamId', 'teamSk']) <-> Member.team: Team @belongsTo(references: ['teamId', 'teamSk'])`
    );
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
