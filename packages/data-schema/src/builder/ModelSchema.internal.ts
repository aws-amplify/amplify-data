import {
  DerivedApiDefinition,
  SchemaConfiguration,
} from '@aws-amplify/data-schema-types';
import { SchemaAuthorization } from '../Authorization';
import { CustomOperation, CustomOperationParamShape } from '../CustomOperation';
import { CustomType, CustomTypeParamShape } from '../CustomType';
import { EnumType } from '../EnumType';
import { BaseModelType, SchemaModelType } from '../ModelType';

export type BaseSchema<
  T extends ModelSchemaParamShape,
  IsRDS extends boolean = false,
> = {
  data: T;
  models: {
    [TypeKey in keyof T['types']]: T['types'][TypeKey] extends BaseModelType
      ? SchemaModelType<T['types'][TypeKey], TypeKey & string, IsRDS>
      : never;
  };
  transform: () => DerivedApiDefinition;
};

export type ModelSchemaParamShape = {
  types: ModelSchemaContents;
  authorization: SchemaAuthorization<any, any, any>[];
  configuration: SchemaConfiguration<any, any>;
};

export type ModelSchemaContents = Record<string, SchemaContent>;

export type SchemaContent =
  | BaseModelType
  | CustomType<CustomTypeParamShape>
  | EnumType
  | CustomOperation<CustomOperationParamShape, any>;
