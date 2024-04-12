import { type ModelType, type InternalModel, model } from '../src/ModelType';
import {
  type ModelField,
  type InternalField,
  string,
  id,
} from '../src/ModelField';
import {
  type ModelSchema,
  type InternalSchema,
  schema,
} from '../src/ModelSchema';
import { configure } from '../src/internals';

type GetModelTypeArg<T> = T extends ModelType<infer R, any> ? R : never;

const fakeSecret = () => ({}) as any;

const datasourceConfigMySQL = {
  engine: 'mysql',
  connectionUri: fakeSecret(),
} as const;

describe('ModelSchema', () => {
  describe('default functionality', () => {
    it('basic ModelSchema can be cast to InternalSchema', () => {
      const s = schema({
        Post: model({
          id: id(),
          title: string(),
        }),
      });

      // TODO: fix
      // const is = s as InternalSchema;
    });
  });
  describe('sql configured functionality', () => {
    it('can be configured to use sql', () => {
      const s = configure({ database: datasourceConfigMySQL }).schema({
        Post: model({
          id: id(),
          title: string(),
        }),
      });
    });
  });
});
