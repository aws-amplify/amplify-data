import { SetTypeSubArg } from '@aws-amplify/data-schema-types';
import { Brand, brand } from './util';

import { ModelField, InternalField } from './ModelField';
import { Authorization } from './Authorization';
import { RefType, InternalRef } from './RefType';
import { EnumType, EnumTypeParamShape } from './EnumType';
import { CustomType } from './CustomType';
import type { HandlerType as Handler } from './Handler';

const queryBrand = 'queryCustomOperation';
const mutationBrand = 'mutationCustomOperation';
const subscriptionBrand = 'subscriptionCustomOperation';

type CustomOperationBrand =
  | typeof queryBrand
  | typeof mutationBrand
  | typeof subscriptionBrand;

type CustomArguments = Record<
  string,
  ModelField<any, any> | EnumType<EnumTypeParamShape>
>;

type CustomReturnType = RefType<any> | CustomType<any>;
type CustomFunctionRefType = string; // extend to include reference

type InternalCustomArguments = Record<string, InternalField>;
type InternalCustomReturnType = InternalRef;
type HandlerInputType = Handler | Handler[number];

export const CustomOperationNames = [
  'Query',
  'Mutation',
  'Subscription',
] as const;
type CustomOperationName = (typeof CustomOperationNames)[number];

type CustomData = {
  arguments: CustomArguments;
  returnType: CustomReturnType | null;
  functionRef: string | null; // extend to include reference
  authorization: Authorization<any, any, any>[];
  typeName: CustomOperationName;
  handlers: Handler | null;
};

type InternalCustomData = CustomData & {
  arguments: InternalCustomArguments;
  returnType: InternalCustomReturnType;
  functionRef: string | null;
  authorization: Authorization<any, any, any>[];
};

export type CustomOperationParamShape = {
  arguments: CustomArguments;
  returnType: CustomReturnType | null;
  functionRef: string | null;
  authorization: Authorization<any, any, any>[];
  typeName: CustomOperationName;
  handlers: Handler | null;
};

export type CustomOperation<
  T extends CustomOperationParamShape,
  K extends keyof CustomOperation<T> = never,
  B extends CustomOperationBrand = CustomOperationBrand,
  // Branding the exported type allows us to detect it
  // nominally in our mapped types, ignoring structural overlap with other types
> = Omit<
  {
    arguments<Arguments extends CustomArguments>(
      args: Arguments,
    ): CustomOperation<
      SetTypeSubArg<T, 'arguments', Arguments>,
      K | 'arguments',
      B
    >;
    returns<ReturnType extends CustomReturnType>(
      returnType: ReturnType,
    ): CustomOperation<
      SetTypeSubArg<T, 'returnType', ReturnType>,
      K | 'returns',
      B
    >;
    function<FunctionRef extends CustomFunctionRefType>(
      functionRefOrName: FunctionRef,
    ): CustomOperation<
      SetTypeSubArg<T, 'functionRef', FunctionRef>,
      K | 'function',
      B
    >;
    authorization<AuthRuleType extends Authorization<any, any, any>>(
      rules: AuthRuleType[],
    ): CustomOperation<
      SetTypeSubArg<T, 'authorization', AuthRuleType[]>,
      K | 'authorization',
      B
    >;
    handler<H extends HandlerInputType>(
      handlers: H,
    ): CustomOperation<T, K | 'handler', B>;
  },
  K
> &
  Brand<B>;

function brandedBuilder<T extends CustomOperationParamShape>(
  builder: Record<keyof CustomOperation<T> & string, any>,
  brandValue: CustomOperationBrand,
): CustomOperation<T, never, typeof brandValue> {
  return { ...builder, ...brand(brandValue) };
}

/**
 * Internal representation of Custom Type that exposes the `data` property.
 * Used at buildtime.
 */
export type InternalCustom<B extends CustomOperationBrand> = CustomOperation<
  any,
  never,
  B
> & {
  data: InternalCustomData;
};

function _custom<
  T extends CustomOperationParamShape,
  B extends CustomOperationBrand,
>(typeName: CustomOperationName, brand: B) {
  const data: CustomData = {
    arguments: {},
    returnType: null,
    functionRef: null,
    authorization: [],
    typeName: typeName,
    handlers: null,
  };

  const builder = brandedBuilder<T>(
    {
      arguments(args: CustomArguments) {
        data.arguments = args;

        return this;
      },
      returns(returnType: CustomReturnType) {
        data.returnType = returnType;

        return this;
      },
      function(functionRefOrName: CustomFunctionRefType) {
        data.functionRef = functionRefOrName;

        return this;
      },
      authorization(rules: Authorization<any, any, any>[]) {
        data.authorization = rules;

        return this;
      },
      handler(handlers: HandlerInputType) {
        data.handlers = Array.isArray(handlers)
          ? handlers
          : ([handlers] as Handler);

        return this;
      },
    },
    brand,
  );

  return { ...builder, data } as InternalCustom<B> as CustomOperation<
    T,
    never,
    B
  >;
}

export type QueryCustomOperation = CustomOperation<
  CustomOperationParamShape,
  any,
  typeof queryBrand
>;

export function query(): CustomOperation<
  {
    arguments: CustomArguments;
    returnType: null;
    functionRef: null;
    authorization: [];
    typeName: 'Query';
    handlers: null;
  },
  never,
  typeof queryBrand
> {
  return _custom('Query', queryBrand);
}

export type MutationCustomOperation = CustomOperation<
  CustomOperationParamShape,
  any,
  typeof mutationBrand
>;

export function mutation(): CustomOperation<
  {
    arguments: CustomArguments;
    returnType: null;
    functionRef: null;
    authorization: [];
    typeName: 'Mutation';
    handlers: null;
  },
  never,
  typeof mutationBrand
> {
  return _custom('Mutation', mutationBrand);
}

export type SubscriptionCustomOperation = CustomOperation<
  CustomOperationParamShape,
  any,
  typeof subscriptionBrand
>;

export function subscription(): CustomOperation<
  {
    arguments: CustomArguments;
    returnType: null;
    functionRef: null;
    authorization: [];
    typeName: 'Subscription';
    handlers: null;
  },
  never,
  typeof subscriptionBrand
> {
  return _custom('Subscription', subscriptionBrand);
}
