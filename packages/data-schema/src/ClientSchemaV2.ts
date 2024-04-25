import {
  DeepReadOnlyObject,
  Equal,
  UnionToIntersection,
  UnwrapArray,
  Prettify,
} from '@aws-amplify/data-schema-types';
import {
  ClientSchema as BaseClientSchema,
  // ExtractModelMeta,
} from './ClientSchema';
import { GenericModelSchema } from './ModelSchema';
import { CombinedModelSchema } from './CombineSchema';
import {
  AuthMode,
  CreateModelInput,
  CustomHeaders,
  ExcludeNeverFields,
  ExtractModelMeta,
  IndexQueryMethodsFromIR,
  ListReturnValue,
  ObservedReturnValue,
  ObserveQueryReturnValue,
  ModelFilter,
  ModelIdentifier,
  ModelMetaShape,
  ModelPath,
  ModelSortDirection,
  MutationInput,
  NumericFilter,
  ResolvedModel,
  ReturnValue,
  SecondaryIndexIrShape,
  SingularReturnValue,
  StringFilter,
} from './MappedTypes/ClientMaps';

type IndexQueryMethodsDetails<
  SecondaryIdxTuple extends SecondaryIndexIrShape[],
  Res = unknown, // defaulting `unknown` because it gets absorbed in an intersection, e.g. `{a: 1} & unknown` => `{a: 1}`
> = SecondaryIdxTuple extends [
  infer First extends SecondaryIndexIrShape,
  ...infer Rest extends SecondaryIndexIrShape[],
]
  ? IndexQueryMethodsDetails<Rest, IndexQueryMethodDetails<First> & Res>
  : Res;

type IndexQueryMethodDetails<Idx extends SecondaryIndexIrShape> = {
  [K in Idx['queryField'] & string]: {
    args: Idx['pk'] & {
      [SKField in keyof Idx['sk']]+?: string extends Idx['sk'][SKField]
        ? StringFilter
        : NumericFilter;
    };
  };
};

type RemappedModel<
  Model extends Record<string, unknown>,
  Meta extends Record<string, any>,
> = {
  __entityType: 'model';
  type: Model;
  getArgs: ModelIdentifier<Meta>;
  createArgs: Prettify<CreateModelInput<Model, Meta>>;
  updateArgs: Prettify<ModelIdentifier<Meta> & Partial<MutationInput<Model>>>;
  deleteArgs: ModelIdentifier<Meta>;
  filterType: ModelFilter<Model>;
  identifier: ModelIdentifier<Meta>;
  indexedQueries: IndexQueryMethodsDetails<Meta['secondaryIndexes'], any>;
};

type CustomOperationHandlerDefinition = Record<
  'functionHandler' | 'functionHandlerArguments' | 'functionHandlerResult',
  any
>;

type RemappedCustomOperation<
  Schema extends Record<any, any>,
  Key extends keyof Schema,
> = {
  __entityType: 'customOperation';
  operationType: ExtractModelMeta<Schema>['customOperations'][Key]['typeName'];
  functionHandler: Schema[Key]['functionHandler'];
  args: Schema[Key]['functionHandlerArguments'];
  returnType: Schema[Key]['functionHandlerResult'];
};

export type RemappedEnum<T extends string> = {
  __entityType: 'enum';
  type: T;
};

type RemappedCustomType<T extends object> = {
  __entityType: 'customType';
  type: T;
};

type RemappedSchemaType<
  Schema extends Record<any, any>,
  Key,
> = Key extends keyof Schema
  ? Schema[Key] extends CustomOperationHandlerDefinition
    ? RemappedCustomOperation<Schema, Key>
    : RemappedModel<Schema[Key], ExtractModelMeta<Schema>[Key]>
  : Key extends keyof ExtractModelMeta<Schema>['enums']
    ? RemappedEnum<ExtractModelMeta<Schema>['enums'][Key]>
    : Key extends keyof ExtractModelMeta<Schema>['customTypes']
      ? RemappedCustomType<ExtractModelMeta<Schema>['customTypes'][Key]>
      : never;

export type ClientSchema<
  RawSchema extends {
    data: { types: Record<any, any> };
  } & (GenericModelSchema<any> | CombinedModelSchema<any>),
  BaseSchema extends Record<any, any> = BaseClientSchema<RawSchema>,
> = Prettify<{
  [K in keyof RawSchema['data']['types']]: RemappedSchemaType<BaseSchema, K>;
}> & {
  __AmplifyInternal: {
    v1Schema: BaseSchema;
  };
};

type Select<T, M> = {
  [K in keyof T as T[K] extends M ? K : never]: T[K] extends M ? T[K] : never;
};

export type ClientSchemaByEntityTypeBaseShape = {
  enums: Record<string, RemappedEnum<any>>;
  customTypes: Record<string, RemappedCustomType<any>>;
  models: Record<string, RemappedModel<any, any>>;
  queries: Record<string, RemappedCustomOperation<any, any>>;
  mutations: Record<string, RemappedCustomOperation<any, any>>;
  subscriptions: Record<string, RemappedCustomOperation<any, any>>;
};

export type ClientSchemaByEntityType<T> = {
  enums: Select<T, { __entityType: 'enum' }>;
  customTypes: Select<T, { __entityType: 'customType' }>;
  models: Select<T, { __entityType: 'model' }>;

  // TODO: Need a way to distinguish these!
  queries: Select<
    T,
    { __entityType: 'customOperation'; operationType: 'Query' }
  >;
  mutations: Select<
    T,
    { __entityType: 'customOperation'; operationType: 'Mutation' }
  >;
  subscriptions: Select<
    T,
    { __entityType: 'customOperation'; operationType: 'Subscription' }
  >;

  // TODO: appsync handlers? ... do we need something distinct here ... brain is stuck.
  // handlers: Select<T, { __entityType: 'customHandler' }>;
};
