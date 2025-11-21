import type {
  deferredRefResolvingPrefix,
  ModelTypeParamShape,
  ModelDefaultIdentifier,
  DisableOperationsOptions,
} from '../../ModelType';
import type { ClientSchemaProperty } from './ClientSchemaProperty';
import type { Authorization, ImpliedAuthFields } from '../../Authorization';
import type {
  SchemaMetadata,
  ResolveFields,
  FlatResolveFields,
} from '../utilities';
import type {
  IsEmptyStringOrNever,
  UnionToIntersection,
  Equal,
  Prettify,
} from '@aws-amplify/data-schema-types';
import type { ModelField } from '../../ModelField';
import type { ModelRelationshipField } from '../../ModelRelationshipField';
import type { EnumType } from '../../EnumType';
import type { CustomType, CustomTypeParamShape } from '../../CustomType';
import type { RefType } from '../../RefType';
import type {
  StringFilter,
  NumericFilter,
  ModelPrimaryCompositeKeyInput,
  PrimaryIndexIrShape,
  SecondaryIndexIrShape,
  KindaPretty,
} from '../../util';

export interface ClientModel<
  Bag extends Record<string, unknown>,
  Metadata extends SchemaMetadata<any>,
  IsRDS extends boolean,
  T extends ModelTypeParamShape,
  K extends keyof Bag & string,
> extends ClientSchemaProperty {
  __entityType: 'model';
  // Adding prettify here breaks a bunch of things. Need to revisit Prettify impl.
  // Probably work investigating a sprinkling of shallow prettification around instead.
  type: KindaPretty<ClientFields<Bag, Metadata, IsRDS, T>>;
  createType: Prettify<
    CreateModelInput<ClientModel<Bag, Metadata, IsRDS, T, K>>
  >;
  updateType: Prettify<
    UpdateModelInput<ClientModel<Bag, Metadata, IsRDS, T, K>>
  >;
  deleteType: Prettify<ModelIdentifier<Bag, T>>;
  identifier: KindaPretty<ModelIdentifier<Bag, T>>;
  nestedTypes: NestedTypes<ClientFields<Bag, Metadata, IsRDS, T>, T>;
  secondaryIndexes: IndexQueryMethodsFromIR<Bag, T['secondaryIndexes'], K>;
  __meta: {
    listOptionsPkParams: ListOptionsPkParams<Bag, T>;
    // retaining a reference to the un-resolved schema builder type;
    // this retains generic arg metadata that can be referenced in transformations downstream
    rawType: T;
    // custom selection set-optimized type with limited depth and flattened relationships
    flatModel: FlatClientFields<Bag, Metadata, IsRDS, T, K>;
    disabledOperations: DisabledOpsToMap<T['disabledOperations']>;
  };
}

/**
 * Creates a map of disabled operations, expanding coarse-grained ops into fine-grained ones
 * The map is used in runtime/client/index.ts to Omit any disabled ops from the data-client types
 *
 * @example
 * a.model({...}).disableOperations(['update', 'subscriptions'])
 * Returns
 * {
 *   update: true;
 *   onCreate: true;
 *   onUpdate: true;
 *   onDelete: true;
 *   observeQuery: true;
 * }
 */
type DisabledOpsToMap<Ops extends ReadonlyArray<DisableOperationsOptions>> = {
  [Op in Ops[number] as Op extends 'queries'
    ? 'list' | 'get' | 'observeQuery'
    : Op extends 'mutations'
      ? 'create' | 'update' | 'delete'
      : Op extends 'subscriptions'
        ? 'onCreate' | 'onUpdate' | 'onDelete' | 'observeQuery'
        : Op extends 'list'
          ? 'list' | 'observeQuery'
          : Op]: true;
};

type ClientFields<
  Bag extends Record<string, unknown>,
  Metadata extends SchemaMetadata<any>,
  IsRDS extends boolean,
  T extends ModelTypeParamShape,
> = ResolveFields<Bag, T['fields']> &
  If<Not<IsRDS>, ImplicitIdentifier<T>> &
  AuthFields<Metadata, T> &
  Omit<SystemFields<IsRDS>, keyof ResolveFields<Bag, T['fields']>>;

type FlatClientFields<
  Bag extends Record<string, unknown>,
  Metadata extends SchemaMetadata<any>,
  IsRDS extends boolean,
  T extends ModelTypeParamShape,
  ModelName extends keyof Bag & string,
> = FlatResolveFields<Bag, T['fields'], ModelName> &
  If<Not<IsRDS>, ImplicitIdentifier<T>> &
  AuthFields<Metadata, T> &
  Omit<SystemFields<IsRDS>, keyof ResolveFields<Bag, T['fields']>>;

type SystemFields<IsRDS extends boolean> = IsRDS extends false
  ? {
      readonly createdAt: string;
      readonly updatedAt: string;
    }
  : object;

// refs are not being resolved here ... yet.
type ModelIdentifier<
  Bag extends Record<string, unknown>,
  T extends ModelTypeParamShape,
> = ResolveIdentifierFields<
  ResolveFields<Bag, T['fields']>,
  T['identifier']['pk'] &
    (T['identifier']['sk'] extends never ? unknown : T['identifier']['sk'])
>;

/**
 * Separate util for *injecting* the default implicit identifier for performance
 * reasons. The full ModelIdentifer util needs to extract types from the fields
 * matching the explicitly defined field types. Contrast that to **injecting** PK
 * fields into the model, which is only done specifically when the default of
 * `readonly id: string` is being injected IF AND ONLY IF another `id` field is
 * not already present on the model.
 */
type ImplicitIdentifier<T extends ModelTypeParamShape> =
  T['identifier']['pk'] extends ModelDefaultIdentifier['pk']
    ? 'id' extends keyof T['fields']
      ? unknown
      : ModelDefaultIdentifier['pk']
    : unknown;

type ResolveIdentifierFields<Model, IdentifierFields> = {
  [K in keyof IdentifierFields]: K extends keyof Model ? Model[K] : string;
};

type If<
  ConditionResult extends boolean,
  IfTrueValue,
  IfFalseValue = unknown,
> = ConditionResult extends true ? IfTrueValue : IfFalseValue;

type Not<T extends boolean> = T extends true ? false : true;

/**
 * Models with composite PKs defined are expected to contain the model's pk, sk, and sortDirection properties in the `options` param
 *
 * @returns an object containing additional `options` properties for models with a composite primary index
 *
 */
export type ListOptionsPkParams<
  Bag extends Record<string, unknown>,
  T extends ModelTypeParamShape,
> = T['identifier']['sk'] extends never
  ? unknown
  : Prettify<Partial<IndexQueryInput<Bag, T['identifier']>>>;

type AuthFields<
  SchemaMeta extends SchemaMetadata<any>,
  Model extends ModelTypeParamShape,
> = (Model['authorization'][number] extends never
  ? SchemaMeta['authFields'] extends never
    ? object
    : SchemaMeta['authFields']
  : ImpliedAuthFields<Model['authorization'][number]> extends never
    ? object
    : ImpliedAuthFields<Model['authorization'][number]>) &
  ImpliedAuthFieldsFromFields<Model>;

type ImpliedAuthFieldsFromFields<T> = UnionToIntersection<
  T extends ModelTypeParamShape
    ? T['fields'][keyof T['fields']] extends
        | ModelField<any, any, infer Auth>
        | ModelRelationshipField<any, any, any, infer Auth>
        | RefType<any, any, infer Auth>
      ? Auth extends Authorization<any, any, any>
        ? ImpliedAuthFields<Auth>
        : object
      : object
    : object
>;

type NestedTypes<
  Bag extends Record<string, unknown>,
  T extends ModelTypeParamShape,
> = {
  [K in keyof T['fields'] as T['fields'][K] extends
    | EnumType
    | CustomType<CustomTypeParamShape>
    ? K
    : never]: K extends keyof Bag
    ? {
        // A little hackier than I'd like here.
        // Ideally, adapt ClientEnum and ClientCustomType to work with us here instead.
        __entityType: T['fields'][K] extends EnumType ? 'enum' : 'customType';
        type: Exclude<Bag[K], null | undefined>;
      }
    : never;
};

type IndexQueryMethodsFromIR<
  Bag extends Record<string, unknown>,
  Indexes,
  ModelName extends string,
  Res = unknown, // defaulting `unknown` because it gets absorbed in an intersection, e.g. `{a: 1} & unknown` => `{a: 1}`
> = Indexes extends [
  infer A extends SecondaryIndexIrShape,
  ...infer B extends SecondaryIndexIrShape[],
]
  ? IndexQueryMethodsFromIR<
      Bag,
      B,
      ModelName,
      IndexQueryMethodSignature<Bag, A, ModelName> & Res
    >
  : Res;

type IndexQueryMethodSignature<
  Bag extends Record<string, unknown>,
  Idx extends SecondaryIndexIrShape,
  ModelName extends string,
> = Record<
  IsEmptyStringOrNever<Idx['queryField']> extends false
    ? Idx['queryField']
    : `list${ModelName}By${Idx['defaultQueryFieldSuffix']}`,
  {
    input: IndexQueryInput<Bag, Idx>;
  }
>;

/**
 * Accepts a PrimaryIndexIr or SecondaryIndexIr and returns resolved parameters
 *
 * TODO: Get rid of the `deferredRefResolvingPrefix` reference hack.
 * Instead, just dereference refs as usual?
 */
export type IndexQueryInput<
  Bag extends Record<string, unknown>,
  Idx extends PrimaryIndexIrShape,
> = {
  [PKField in keyof Idx['pk']]: Idx['pk'][PKField] extends `${deferredRefResolvingPrefix}${infer R}`
    ? 'type' extends keyof Bag[R]
      ? Bag[R]['type']
      : never
    : Idx['pk'][PKField];
} & (Idx['compositeSk'] extends never
  ? {
      [SKField in keyof Idx['sk']]+?: number extends Idx['sk'][SKField]
        ? NumericFilter
        : Idx['sk'][SKField] extends `${deferredRefResolvingPrefix}${infer R}`
          ? 'type' extends keyof Bag[R]
            ? Bag[R]['type'] extends string
              ? StringFilter<Bag[R]['type']>
              : never
            : never
          : StringFilter<Idx['sk'][SKField] & string>;
    }
  : {
      [CompositeSk in Idx['compositeSk']]+?: ModelPrimaryCompositeKeyInput<{
        [SKField in keyof Idx['sk']]: Idx['sk'][SKField] extends `${deferredRefResolvingPrefix}${infer _R}`
          ? string
          : Idx['sk'][SKField];
      }>;
    });

/**
 *
 *      TEMP
 *    ---++---
 *       ||
 *       ||
 *      \^^/
 *       \/
 */

/**
 * All required fields and relationship fields, exclude readonly fields
 */
type MutationInput<
  Model extends ClientModel<any, any, any, any, any>,
  WritableFields = Pick<Model['type'], WritableKeys<Model['type']>>,
> = WithNullablesAsOptionalRecursively<{
  [Prop in keyof WritableFields as WritableFields[Prop] extends (
    ...args: any
  ) => any
    ? never
    : Prop]: WritableFields[Prop];
}>;

type IfEquals<X, Y, A = X, B = never> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;

// Excludes readonly fields from Record type
type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] },
    P
  >;
}[keyof T];

type MinusReadonly<T> = {
  -readonly [K in keyof T]: T[K];
};

type WithNullablesAsOptionalRecursively<T> = T extends
  | Array<any>
  | ((...args: any) => any)
  ? T
  : T extends object
    ? {
        [K in keyof T as null extends T[K]
          ? K
          : never]+?: WithNullablesAsOptionalRecursively<T[K]>;
      } & {
        [K in keyof T as null extends T[K]
          ? never
          : K]: WithNullablesAsOptionalRecursively<T[K]>;
      }
    : T;

/**
 * All identifiers and fields used to create a model
 */
type CreateModelInput<Model extends ClientModel<any, any, any, any, any>> =
  Equal<MinusReadonly<Model['identifier']>, { id: string }> extends true
    ? Partial<MinusReadonly<Model['identifier']>> &
        Omit<MutationInput<Model>, 'id'>
    : MutationInput<Model>;

type UpdateModelInput<Model extends ClientModel<any, any, any, any, any>> =
  MinusReadonly<Model['identifier']> & Partial<MutationInput<Model>>;
