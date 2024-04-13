import { SetTypeSubArg } from '@aws-amplify/data-schema-types';
import { brand, type brandSymbol } from './util';
import { Authorization } from './Authorization';
import { CustomType } from './CustomType';
import { EnumType, EnumTypeParamShape } from './EnumType';
import type {
  CustomHandler,
  FunctionHandler,
  HandlerType as Handler,
} from './Handler';
import { InternalField, ModelField } from './ModelField';
import { InternalRef, RefType } from './RefType';

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

type SubscriptionSource = RefType<any, any>;
type InternalSubscriptionSource = InternalRef;

type CustomReturnType = RefType<any> | CustomType<any>;
type CustomFunctionRefType = string; // extend to include reference

type InternalCustomArguments = Record<string, InternalField>;
type InternalCustomReturnType = InternalRef;
type HandlerInputType = FunctionHandler[] | CustomHandler[] | Handler;

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
  handlers: Handler[] | null;
  subscriptionSource: SubscriptionSource[];
};

type InternalCustomData = CustomData & {
  arguments: InternalCustomArguments;
  returnType: InternalCustomReturnType;
  functionRef: string | null;
  subscriptionSource: InternalSubscriptionSource[];
  authorization: Authorization<any, any, any>[];
};

export type CustomOperationParamShape = {
  arguments: CustomArguments | null;
  returnType: CustomReturnType | null;
  functionRef: string | null;
  authorization: Authorization<any, any, any>[];
  typeName: CustomOperationName;
  handlers: Handler | null;
};

export type CustomOperation<
  T extends CustomOperationParamShape,
  UsedMethod extends keyof CustomOperation<T> = never,
  B extends CustomOperationBrand = CustomOperationBrand,
> = Omit<
  {
    [brandSymbol]: B;
    arguments<Arguments extends CustomArguments>(
      args: Arguments,
    ): CustomOperation<
      SetTypeSubArg<T, 'arguments', Arguments>,
      UsedMethod | 'arguments',
      B
    >;
    returns<ReturnType extends CustomReturnType>(
      returnType: ReturnType,
    ): CustomOperation<
      SetTypeSubArg<T, 'returnType', ReturnType>,
      UsedMethod | 'returns',
      B
    >;
    /**
     *
     * @deprecated
     * `.function` should no longer be used and will be removed
     * in the next minor version of this package.
     *
     * Use `.handler(a.handler.function())` instead
     */
    function<FunctionRef extends CustomFunctionRefType>(
      functionRefOrName: FunctionRef,
    ): CustomOperation<
      SetTypeSubArg<T, 'functionRef', FunctionRef>,
      UsedMethod | 'function',
      B
    >;
    authorization<AuthRuleType extends Authorization<any, any, any>>(
      rules: AuthRuleType[],
    ): CustomOperation<
      SetTypeSubArg<T, 'authorization', AuthRuleType[]>,
      UsedMethod | 'authorization',
      B
    >;
    handler<H extends HandlerInputType>(
      handlers: H,
    ): CustomOperation<T, UsedMethod | 'handler', B>;
    for<Source extends SubscriptionSource>(
      source: Source | Source[],
    ): CustomOperation<
      T['typeName'] extends 'Subscription'
        ? SetTypeSubArg<
            T,
            'returnType',
            // the array contained types are validated in the SchemaProcessor to have the
            // same return type, so we can safely use Source[number] here as the source
            // to extra the return type in `packages/data-schema/src/MappedTypes/CustomOperations.ts`
            Source extends SubscriptionSource[] ? Source[number] : Source
          >
        : T,
      UsedMethod | 'for',
      B
    >;
  },
  UsedMethod
>;

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
export type InternalCustom<B extends CustomOperationBrand = any> =
  CustomOperation<any, never, B> & {
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
    subscriptionSource: [],
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
          : ([handlers] as Handler[]);

        return this;
      },
      for(source: SubscriptionSource | SubscriptionSource[]) {
        data.subscriptionSource = Array.isArray(source) ? source : [source];

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
    arguments: null;
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
    arguments: null;
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
    arguments: null;
    returnType: null;
    functionRef: null;
    authorization: [];
    typeName: 'Subscription';
    handlers: null;
  },
  'returns',
  typeof subscriptionBrand
> {
  return _custom('Subscription', subscriptionBrand);
}
