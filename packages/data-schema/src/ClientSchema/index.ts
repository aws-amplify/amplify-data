import { CombinedModelSchema } from '../CombineSchema';
import { GenericModelSchema } from '../builder/ModelSchema';
import { InternalClientSchema, InternalCombinedSchema } from './internal';

export type ClientSchema<
  Schema extends GenericModelSchema<any> | CombinedModelSchema<any>,
> =
  Schema extends GenericModelSchema<any>
    ? InternalClientSchema<Schema>
    : Schema extends CombinedModelSchema<any>
      ? InternalCombinedSchema<Schema>
      : never;
