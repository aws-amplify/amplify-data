import {ModelType, InternalModel, ModelField, InternalField, ModelSchema, InternalSchema} from '@aws-amplify/amplify-api-next-types-alpha'
import { model } from "../src/ModelType";
import { fields } from "../src/ModelField";
import {
  schema,
} from "../src/ModelSchema";

type GetModelTypeArg<T> = T extends ModelType<infer R, any> ? R : never;

const { string, id } = fields;

describe("basic functionality", () => {
  const { id, string } = fields;

  test("basic ModelSchema can be cast to InternalSchema", () => {
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
