import type {
  deferredRefResolvingPrefix,
  ModelTypeParamShape,
} from '../../ModelType';
import { ClientSchemaProperty } from './ClientSchemaProperty';
import { ResolveFields } from '../utilities/ResolveField';
import { Authorization, ImpliedAuthFields } from '../../Authorization';
import { SchemaMetadata } from '../utilities/SchemaMetadata';
import {
  IsEmptyStringOrNever,
  UnionToIntersection,
  Equal,
  Prettify,
} from '@aws-amplify/data-schema-types';
import { ModelField } from '../../ModelField';
import { ModelRelationalField } from '../../ModelRelationalField';
import { EnumType, EnumTypeParamShape } from '../../EnumType';
import { CustomType, CustomTypeParamShape } from '../../CustomType';
import { RefType } from '../../RefType';

export interface ClientModel<
  Bag extends Record<string, unknown>,
  Metadata extends SchemaMetadata<any>,
  T extends ModelTypeParamShape,
  K extends keyof Bag & string,
> extends ClientSchemaProperty {
  __entityType: 'model';
  // Adding prettify here breaks a bunch of things. Need to revisit Prettify impl.
  // Probably work investigating a sprinkling of shallow prettification around instead.
  type: ShallowPretty<ClientFields<Bag, Metadata, T>>;
  createType: Prettify<CreateModelInput<ClientModel<Bag, Metadata, T, K>>>;
  updateType: Prettify<UpdateModelInput<ClientModel<Bag, Metadata, T, K>>>;
  deleteType: Prettify<ModelIdentifier<Bag, T>>;
  identifier: ShallowPretty<ModelIdentifier<Bag, T>>;
  nestedTypes: NestedTypes<ClientFields<Bag, Metadata, T>, T>;
  secondaryIndexes: IndexQueryMethodsFromIR<Bag, T['secondaryIndexes'], K>;
}

type ShallowPretty<T> = {
  [K in keyof T]: T[K];
};

type ClientFields<
  Bag extends Record<string, unknown>,
  Metadata extends SchemaMetadata<any>,
  T extends ModelTypeParamShape,
> = ResolveFields<Bag, T['fields']> &
  ModelIdentifier<Bag, T> &
  AuthFields<Metadata, T> &
  Omit<SystemFields, keyof ResolveFields<Bag, T['fields']>>;

type SystemFields = {
  readonly createdAt: string;
  readonly updatedAt: string;
};

type ModelIdentifier<
  Bag extends Record<string, unknown>,
  T extends ModelTypeParamShape,
> = T['identifier'][number] extends keyof T['fields']
  ? Pick<ResolveFields<Bag, T['fields']>, T['identifier'][number]>
  : { readonly id: string };

type AuthFields<
  Metadata extends SchemaMetadata<any>,
  Model extends ModelTypeParamShape,
> = (Model['authorization'][number] extends never
  ? Metadata['authFields'] extends never
    ? object
    : Metadata['authFields']
  : ImpliedAuthFields<Model['authorization'][number]> extends never
    ? object
    : ImpliedAuthFields<Model['authorization'][number]>) &
  ImpliedAuthFieldsFromFields<Model>;

type ImpliedAuthFieldsFromFields<T> = UnionToIntersection<
  T extends ModelTypeParamShape
    ? T['fields'][keyof T['fields']] extends
        | ModelField<any, any, infer Auth>
        | ModelRelationalField<any, any, any, infer Auth>
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
    | EnumType<EnumTypeParamShape>
    | CustomType<CustomTypeParamShape>
    ? K
    : never]: K extends keyof Bag
    ? {
        // A little hackier than I'd like here.
        // Ideally, adapt ClientEnum and ClientCustomType to work with us here instead.
        __entityType: T['fields'][K] extends EnumType<EnumTypeParamShape>
          ? 'enum'
          : 'customType';
        type: Exclude<Bag[K], null>;
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

/**
 * TODO: Get rid of the `deferredRefResolvingPrefix` reference hack.
 *
 * Instead, just dereference refs as usual?
 */
type IndexQueryMethodSignature<
  Bag extends Record<string, unknown>,
  Idx extends SecondaryIndexIrShape,
  ModelName extends string,
> = Record<
  IsEmptyStringOrNever<Idx['queryField']> extends false
    ? Idx['queryField']
    : `list${ModelName}By${Idx['defaultQueryFieldSuffix']}`,
  {
    input: {
      [PKField in keyof Idx['pk']]: Idx['pk'][PKField] extends `${deferredRefResolvingPrefix}${infer R}`
        ? 'type' extends keyof Bag[R]
          ? Bag[R]['type']
          : never
        : Idx['pk'][PKField];
    } & {
      [SKField in keyof Idx['sk']]+?: number extends Idx['sk'][SKField]
        ? NumericFilter
        : Idx['sk'][SKField] extends `${deferredRefResolvingPrefix}${infer R}`
          ? 'type' extends keyof Bag[R]
            ? Bag[R]['type'] extends string
              ? StringFilter<Bag[R]['type']>
              : never
            : never
          : StringFilter<Idx['sk'][SKField] & string>;
    };
  }
>;

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
 * All required fields and relational fields, exclude readonly fields
 */
type MutationInput<
  Model extends ClientModel<any, any, any, any>,
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

type WithNullablesAsOptionalRecursively<T> =
  T extends Array<any>
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
type CreateModelInput<Model extends ClientModel<any, any, any, any>> =
  Equal<Model['identifier'], { readonly id: string }> extends true
    ? Partial<MinusReadonly<Model['identifier']>> &
        Omit<MutationInput<Model>, 'id'>
    : MutationInput<Model>;

type UpdateModelInput<Model extends ClientModel<any, any, any, any>> =
  MinusReadonly<Model['identifier']> & Partial<MutationInput<Model>>;

type StringFilter<T extends string = string> = {
  attributeExists?: boolean;
  beginsWith?: string;
  between?: [string, string];
  contains?: string;
  eq?: T;
  ge?: string;
  gt?: string;
  le?: string;
  lt?: string;
  ne?: T;
  notContains?: string;
  size?: SizeFilter;
};

type NumericFilter = {
  attributeExists?: boolean;
  between?: [number, number];
  eq?: number;
  ge?: number;
  gt?: number;
  le?: number;
  lt?: number;
  ne?: number;
};

type SizeFilter = {
  between?: [number, number];
  eq?: number;
  ge?: number;
  gt?: number;
  le?: number;
  lt?: number;
  ne?: number;
};

export type SecondaryIndexIrShape = {
  defaultQueryFieldSuffix: string;
  queryField: string;
  pk: { [key: string]: string | number };
  sk: { [key: string]: string | number };
};
