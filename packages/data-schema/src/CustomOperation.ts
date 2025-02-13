import { AiModel, SetTypeSubArg } from '@aws-amplify/data-schema-types';
import { Brand, brand } from './util';
import { InternalField, ModelField, type BaseModelField } from './ModelField';
import {
  type Authorization,
  type CustomOperationAuthorizationCallback,
  allowForCustomOperations,
} from './Authorization';
import { RefType, InternalRef } from './RefType';
import { EnumType } from './EnumType';
import { CustomType } from './CustomType';
import type {
  AsyncFunctionHandler,
  CustomHandler,
  FunctionHandler,
  HandlerType as Handler,
} from './Handler';
import { brandSymbol } from './util/Brand';
import { InferenceConfiguration } from './ai/ModelType';

const queryBrand = 'queryCustomOperation';
const mutationBrand = 'mutationCustomOperation';
const subscriptionBrand = 'subscriptionCustomOperation';
const generationBrand = 'generationCustomOperation';

type CustomOperationBrand =
  | typeof queryBrand
  | typeof mutationBrand
  | typeof subscriptionBrand
  | typeof generationBrand;

type CustomArguments = Record<string, BaseModelField | EnumType>;
type SubscriptionSource = RefType<any, any>;
type InternalSubscriptionSource = InternalRef;
type CustomReturnType = RefType<any> | CustomType<any>;
type InternalCustomArguments = Record<string, InternalField>;
type InternalCustomReturnType = InternalRef;
type HandlerInputType =
  | FunctionHandler[]
  | CustomHandler[]
  | AsyncFunctionHandler[]
  | HeterogeneousFunctionHandlerWithLastAsync
  | HeterogeneousFunctionHandlerType
  | Handler;
type HeterogeneousFunctionHandlerType = (
  | FunctionHandler
  | AsyncFunctionHandler
)[];
type HeterogeneousFunctionHandlerWithLastAsync = [
  ...HeterogeneousFunctionHandlerType,
  AsyncFunctionHandler,
];

export type UltimateFunctionHandlerAsyncType =
  | AsyncFunctionHandler
  | AsyncFunctionHandler[]
  | HeterogeneousFunctionHandlerWithLastAsync;

export const CustomOperationNames = [
  'Query',
  'Mutation',
  'Subscription',
  'Generation',
] as const;
type CustomOperationName = (typeof CustomOperationNames)[number];

type CustomData = {
  arguments: CustomArguments;
  returnType: CustomReturnType | null;
  authorization: Authorization<any, any, any>[];
  typeName: CustomOperationName;
  handlers: Handler[] | null;
  subscriptionSource: SubscriptionSource[];
  input?: CustomOperationInput;
};

type InternalCustomData = CustomData & {
  arguments: InternalCustomArguments;
  returnType: InternalCustomReturnType;
  subscriptionSource: InternalSubscriptionSource[];
  authorization: Authorization<any, any, any>[];
};

export type CustomOperationInput = GenerationInput;

export type CustomOperationParamShape = {
  arguments: CustomArguments | null;
  returnType: CustomReturnType | null;
  authorization: Authorization<any, any, any>[];
  typeName: CustomOperationName;
  handlers: Handler | null;
  input?: CustomOperationInput;
};

/**
 * Custom operation definition interface
 *
 * @param T - The shape of the custom operation
 * @param K - The keys already defined
 * @param B - The brand of the custom operation
 */
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
      callback: CustomOperationAuthorizationCallback<AuthRuleType>,
    ): CustomOperation<
      SetTypeSubArg<T, 'authorization', AuthRuleType[]>,
      K | 'authorization',
      B
    >;
    handler<H extends HandlerInputType>(
      handlers: H,
    ): [H] extends [UltimateFunctionHandlerAsyncType]
      ? CustomOperation<
          AsyncFunctionCustomOperation<T>,
          K | 'handler' | 'returns',
          B
        >
      : CustomOperation<T, K | 'handler', B>;

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
>(typeName: CustomOperationName, brand: B, input?: T['input']) {
  const data: CustomData = {
    arguments: {},
    returnType: null,
    authorization: [],
    typeName: typeName,
    handlers: null,
    subscriptionSource: [],
    input,
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
        callback: CustomOperationAuthorizationCallback<AuthRuleType>,
      ) {
        const rules = callback(allowForCustomOperations);
        data.authorization = Array.isArray(rules) ? rules : [rules];

        return this;
      },
      handler(handlers: HandlerInputType) {
        data.handlers = Array.isArray(handlers)
          ? handlers
          : ([handlers] as Handler[]);

        if (lastHandlerIsAsyncFunction(handlers)) {
          data.returnType = eventInvocationResponse;
        }

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

// #region async Lambda function related types
type AsyncFunctionCustomOperation<T extends CustomOperationParamShape> =
  SetTypeSubArg<
    SetTypeSubArg<T, 'returnType', EventInvocationResponseCustomType>,
    'handlers',
    AsyncFunctionHandler
  >;

type EventInvocationResponseCustomType = CustomType<{
  fields: {
    success: ModelField<boolean, 'required', undefined>;
  };
}>;

const eventInvocationResponse = {
  data: {
    type: 'ref',
    link: 'EventInvocationResponse',
    valueRequired: false,
    array: false,
    arrayRequired: false,
    mutationOperations: [],
    authorization: [],
  },
};

function lastHandlerIsAsyncFunction(handlers: HandlerInputType): boolean {
  const lastHandlerBrandSymbol = Array.isArray(handlers)
    ? handlers[handlers.length - 1][brandSymbol]
    : handlers[brandSymbol];
  return lastHandlerBrandSymbol === 'asyncFunctionHandler';
}
// #endregion async Lambda function related types
export interface GenerationInput {
  aiModel: AiModel;
  systemPrompt: string;
  inferenceConfiguration?: InferenceConfiguration;
}

/**
 * Define an AI generation route for single request-response interaction with specified AI model.
 * @example
 * makeRecipe: a.generation({
 *   aiModel: { resourcePath },
 *   systemPrompt: 'Please make a recipe from the provided ingredients',
 * })
 *   .arguments({ ingredients: a.string().array() })
 *   .returns(a.ref("Recipe"))
 * @returns a generation route definition
 */
export function generation(input: GenerationInput): CustomOperation<
  {
    arguments: null;
    returnType: null;
    authorization: [];
    typeName: 'Generation';
    handlers: null;
    input: GenerationInput;
  },
  'for' | 'handler',
  typeof generationBrand
> {
  return _custom('Generation', generationBrand, input);
}
