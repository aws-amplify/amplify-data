import type { ModelType } from '../ModelType';
import type { ModelSchema } from '../ModelSchema';
import type { ModelRelationalField } from '../ModelRelationalField';
import type { ModelField } from '../ModelField';

export type ResolveSchema<Schema> = FieldTypes<ModelTypes<SchemaTypes<Schema>>>;

// TODO: find better name
export type SchemaTypes<T> = T extends ModelSchema<infer R>
  ? R['models']
  : never;

export type ModelTypes<Schema> = {
  [Property in keyof Schema]: Schema[Property] extends ModelType<infer R, any>
    ? R['fields']
    : never;
};

export type FieldTypes<T> = {
  [ModelProp in keyof T]: {
    [FieldProp in keyof T[ModelProp]]: T[ModelProp][FieldProp] extends ModelRelationalField<
      infer R,
      string,
      never,
      any
    >
      ? R
      : T[ModelProp][FieldProp] extends ModelField<infer R, any, any>
      ? R
      : never;
  };
};
