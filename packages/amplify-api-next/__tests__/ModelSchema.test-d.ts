import { type ModelType, type InternalModel, model } from '../src/ModelType';
import { type ModelField, type InternalField, fields } from '../src/ModelField';
import { query, mutation, subscription } from '../src/CustomType';
import {
  type ModelSchema,
  type InternalSchema,
  schema,
} from '../src/ModelSchema';
import { allow } from '../src/Authorization';

type GetModelTypeArg<T> = T extends ModelType<infer R, any> ? R : never;

const { string, id } = fields;

describe('basic functionality', () => {
  const { id, string } = fields;

  test('basic ModelSchema can be cast to InternalSchema', () => {
    const s = schema({
      Post: model({
        id: id(),
        title: string(),
      }),
    });

    // TODO: fix
    // const is = s as InternalSchema;
  });

  test('basic accepts custom stuff', () => {
    const s = schema({
      Post: model({
        id: id(),
        title: string(),
      }),
    }, {
      echo: query()
        .arguments({
          message: string(),
        })
        .response(string()),
      put: mutation()
        .arguments({
          id: id(),
          content: string(),
        })
        .response(string()),
      onChange: subscription()
        .authorization([allow.public().to(['read'])]),
    });
  });
});
