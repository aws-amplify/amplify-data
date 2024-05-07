import { SetTypeSubArg } from '@aws-amplify/data-schema-types';
import { Brand, brand } from './util';
import { InternalField, type BaseModelField } from './ModelField';
import {
  AllowModifierForCustomOperation,
  Authorization,
  allowForCustomOperations,
} from './Authorization';
import { RefType, InternalRef } from './RefType';
import { EnumType } from './EnumType';
import { CustomType } from './CustomType';
import type {
  CustomHandler,
  FunctionHandler,
  HandlerType as Handler,
} from './Handler';

const queryBrand = 'queryCustomOperation';
const mutationBrand = 'mutationCustomOperation';
const subscriptionBrand = 'subscriptionCustomOperation';

type CustomOperationBrand =
  | typeof queryBrand
  | typeof mutationBrand
  | typeof subscriptionBrand;

type CustomArguments = Record<string, BaseModelField | EnumType>;

type SubscriptionSource = RefType<any, any>;
type InternalSubscriptionSource = InternalRef;

type CustomReturnType = RefType<any> | CustomType<any>;
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
  authorization: Authorization<any, any, any>[];
  typeName: CustomOperationName;
  handlers: Handler[] | null;
  subscriptionSource: SubscriptionSource[];
};

type InternalCustomData = CustomData & {
  arguments: InternalCustomArguments;
  returnType: InternalCustomReturnType;
  subscriptionSource: InternalSubscriptionSource[];
  authorization: Authorization<any, any, any>[];
};

export type CustomOperationParamShape = {
  arguments: CustomArguments | null;
  returnType: CustomReturnType | null;
  authorization: Authorization<any, any, any>[];
  typeName: CustomOperationName;
  handlers: Handler | null;
};

export type CustomOperation<
  T extends CustomOperationParamShape,
  K extends keyof CustomOperation<T> = never,
  B extends CustomOperationBrand = CustomOperationBrand,
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
    authorization<AuthRuleType extends Authorization<any, any, any>>(
      callback: (
        allow: AllowModifierForCustomOperation,
      ) => AuthRuleType | AuthRuleType[],
    ): CustomOperation<
      SetTypeSubArg<T, 'authorization', AuthRuleType[]>,
      K | 'authorization',
      B
    >;
    handler<H extends HandlerInputType>(
      handlers: H,
    ): CustomOperation<T, K | 'handler', B>;
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
      K | 'for',
      B
    >;
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
      authorization<AuthRuleType extends Authorization<any, any, any>>(
        callback: (
          allow: AllowModifierForCustomOperation,
        ) => AuthRuleType | AuthRuleType[],
      ) {
        const rules = callback(allowForCustomOperations);
        data.authorization = Array.isArray(rules) ? rules : [rules];

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

/**
 * Use a custom query to define an API request that will retrieve backend data.
 * @see {@link https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/}
 * @example
 * const schema = a.schema({
 *   echo: a
 *     .query()
 *     .arguments({ content: a.string() })
 *     .returns(a.ref('EchoResponse'))
 *     .authorization(allow => [allow.publicApiKey()])
 *     // 3. set the function has the handler
 *     .handler(a.handler.function(echoHandler)),
 * 
 *   EchoResponse: a.customType({
 *     content: a.string(),
 *     executionDuration: a.float()
 *   }),
 * });
 * @returns a custom query
 */
export function query(): CustomOperation<
  {
    arguments: null;
    returnType: null;
    authorization: [];
    typeName: 'Query';
    handlers: null;
  },
  'for',
  typeof queryBrand
> {
  return _custom('Query', queryBrand);
}

export type MutationCustomOperation = CustomOperation<
  CustomOperationParamShape,
  any,
  typeof mutationBrand
>;

/**
 * Use a custom mutation to define an API request that will modify backend data or trigger a subscription event.
 * @see {@link https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/}
 * @example
 * likePost: a
 *   .mutation()
 *   .arguments({ postId: a.string() })
 *   .returns(a.ref('Post'))
 *   .authorization(allow => [allow.publicApiKey()])
 *   .handler(a.handler.function(echoHandler))
 * @returns a custom mutation
 */
export function mutation(): CustomOperation<
  {
    arguments: null;
    returnType: null;
    authorization: [];
    typeName: 'Mutation';
    handlers: null;
  },
  'for',
  typeof mutationBrand
> {
  return _custom('Mutation', mutationBrand);
}

export type SubscriptionCustomOperation = CustomOperation<
  CustomOperationParamShape,
  any,
  typeof subscriptionBrand
>;

/**
 * Define a custom subscription to receive an event when a mutation is triggered
 * @see {@link https://docs.amplify.aws/react/build-a-backend/data/custom-subscription/}
 * @example
 * // Subscribe to incoming messages
 * receive: a.subscription()
 *   // subscribes to the 'publish' mutation
 *   .for(a.ref('publish')) 
 *   // subscription handler to set custom filters
 *   .handler(a.handler.custom({entry: './receive.js'})) 
 *   // authorization rules as to who can subscribe to the data
 *   .authorization(allow => [allow.publicApiKey()]),
 * @returns a custom subscription
 */
export function subscription(): CustomOperation<
  {
    arguments: null;
    returnType: null;
    authorization: [];
    typeName: 'Subscription';
    handlers: null;
  },
  'returns',
  typeof subscriptionBrand
> {
  return _custom('Subscription', subscriptionBrand);
}
