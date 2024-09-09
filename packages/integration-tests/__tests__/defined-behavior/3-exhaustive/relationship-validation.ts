import { a, ClientSchema } from '@aws-amplify/data-schema';
import { configure } from '@aws-amplify/data-schema/internals';
import { Amplify } from 'aws-amplify';
import { type SelectionSet } from '@aws-amplify/data-schema-types';
import {
  buildAmplifyConfig,
  mockedGenerateClient,
  optionsAndHeaders,
  useState,
} from '../../utils';

const fakeSecret = () => ({}) as any;

const datasourceConfigMySQL = {
  engine: 'mysql',
  connectionUri: fakeSecret(),
} as const;

const aSql = configure({ database: datasourceConfigMySQL });

describe('schema relationship validation', () => {
  describe('homogenous data source', () => {
    test('with valid relationships passes', () => {
      const schema = a
        .schema({
          Team: a
            .model({
              id: a.id().required(),
              motto: a.string(),
              members: a.hasMany('Member', ['teamId']),
              project: a.hasOne('Project', ['teamId']),
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
          Member: a.model({
            id: a.id().required(),
            name: a.string(),
            teamId: a.id(),
            team: a.belongsTo('Team', ['teamId']),
          }),
        })
        .authorization((allow) => allow.publicApiKey());

      expect(() => schema.transform().schema).not.toThrow();
    });

    test('with too many FK fields in hasOne-belongsTo throws', () => {
      const schema = a
        .schema({
          Team: a
            .model({
              id: a.id().required(),
              motto: a.string(),
              members: a.hasMany('Member', ['teamId']),
              project: a.hasOne('Project', ['teamId']),
            })
            .identifier(['id']),
          Project: a
            .model({
              id: a.id().required(),
              name: a.string(),
              teamId: a.id(),
              team: a.belongsTo('Team', ['teamId', 'name']),
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

      expect(() => schema.transform().schema).toThrow(
        "Unable to find associated relationship definition in Project for Team.project: Project @hasOne(references: ['teamId'])",
      );
    });

    test('with too many FK fields in hasMany-belongsTo throws', () => {
      const schema = a
        .schema({
          Team: a
            .model({
              id: a.id().required(),
              motto: a.string(),
              members: a.hasMany('Member', ['teamId']),
              project: a.hasOne('Project', ['teamId']),
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
          Member: a.model({
            id: a.id().required(),
            name: a.string(),
            teamId: a.id(),
            team: a.belongsTo('Team', ['teamId', 'name']),
          }),
        })
        .authorization((allow) => allow.publicApiKey());

      expect(() => schema.transform().schema).toThrow(
        "Unable to find associated relationship definition in Member for Team.members: [Member] @hasMany(references: ['teamId'])",
      );
    });

    test('with too many/unexpected PK fields on the parent throws', () => {
      const schema = a
        .schema({
          Team: a
            .model({
              id: a.id().required(),
              motto: a.string().required(),
              members: a.hasMany('Member', ['teamId']),
              project: a.hasOne('Project', ['teamId']),
            })
            .identifier(['id', 'motto']),
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

      expect(() => schema.transform().schema).toThrow(
        [
          'The identifiers defined on Team must match the reference fields defined on Member.',
          '2 identifiers defined on Team.',
          '1 reference fields found on Member',
        ].join('\n'),
      );
    });
  });
  describe('heterogenous data source', () => {
    test('with valid relationships passes', () => {
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

      expect(() =>
        schema.schemas.map((schema) => schema.transform().schema).join('\n'),
      ).not.toThrow();
    });

    test('with too many FK fields in hasOne-belongsTo throws', () => {
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
              team: a.belongsTo('Team', ['teamId', 'name']),
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

      expect(() =>
        schema.schemas.map((schema) => schema.transform().schema).join('\n'),
      ).toThrow(
        "Unable to find associated relationship definition in Team for Project.team: Team @belongsTo(references: ['teamId', 'name'])",
      );
    });

    test('with too many FK fields in hasMany-belongsTo throws', () => {
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
            team: a.belongsTo('Team', ['teamId', 'name']),
          }),
        })
        .authorization((allow) => allow.publicApiKey());

      const schema = a.combine([sqlSchema, ddbSchema]);

      expect(() =>
        schema.schemas.map((schema) => schema.transform().schema).join('\n'),
      ).toThrow(
        "Unable to find associated relationship definition in Team for Member.team: Team @belongsTo(references: ['teamId', 'name'])",
      );
    });

    test('with too many/unexpected PK fields on the parent throws', () => {
      const sqlSchema = aSql
        .schema({
          Team: a
            .model({
              id: a.id().required(),
              motto: a.string().required(),
              members: a.hasMany('Member', ['teamId']),
              project: a.hasOne('Project', ['teamId']),
            })
            .identifier(['id', 'motto']),
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

      expect(() =>
        schema.schemas.map((schema) => schema.transform().schema).join('\n'),
      ).toThrow(
        [
          'The identifiers defined on Team must match the reference fields defined on Project.',
          '2 identifiers defined on Team.',
          '1 reference fields found on Project',
        ].join('\n'),
      );
    });
  });
});
