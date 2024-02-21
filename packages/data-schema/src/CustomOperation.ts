import { SetTypeSubArg, Brand } from '@aws-amplify/data-schema-types';

import { ModelField, InternalField } from './ModelField';
import { Authorization } from './Authorization';
import { RefType, InternalRef } from './RefType';
import { EnumType, EnumTypeParamShape } from './EnumType';
import { CustomType } from './CustomType';
import { Handler } from './Handler';

type CustomArguments = Record<
  string,
  ModelField<any, any> | EnumType<EnumTypeParamShape>
>;

type CustomReturnType = RefType<any> | CustomType<any>;
type CustomFunctionRefType = string; // extend to include reference

type InternalCustomArguments = Record<string, InternalField>;
type InternalCustomReturnType = InternalRef;

const brandName = 'customOperation';

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
  handlers: Handler<any>[] | null;
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
  handlers: Handler<any>[] | null;
};

export type CustomOperation<
  T extends CustomOperationParamShape,
  K extends keyof CustomOperation<T> = never,
  // Branding the exported type allows us to detect it
  // nominally in our mapped types, ignoring structural overlap with other types
> = Omit<
  {
    arguments<Arguments extends CustomArguments>(
      args: Arguments,
    ): CustomOperation<
      SetTypeSubArg<T, 'arguments', Arguments>,
      K | 'arguments'
    >;
    returns<ReturnType extends CustomReturnType>(
      returnType: ReturnType,
    ): CustomOperation<
      SetTypeSubArg<T, 'returnType', ReturnType>,
      K | 'returns'
    >;
    function<FunctionRef extends CustomFunctionRefType>(
      functionRefOrName: FunctionRef,
    ): CustomOperation<
      SetTypeSubArg<T, 'functionRef', FunctionRef>,
      K | 'function'
    >;
    authorization<AuthRuleType extends Authorization<any, any, any>>(
      rules: AuthRuleType[],
    ): CustomOperation<
      SetTypeSubArg<T, 'authorization', AuthRuleType[]>,
      K | 'authorization'
    >;
    handler(
      handlers: Handler<any>[] | Handler<any>,
    ): CustomOperation<
      SetTypeSubArg<T, 'handlers', Handler<any>[]>,
      K | 'handler'
    >;
  },
  K
> &
  Brand<object, typeof brandName>;

function brandedBuilder<T extends CustomOperationParamShape>(
  builder: Record<keyof CustomOperation<T> & string, any>,
): CustomOperation<T> {
  return builder as CustomOperation<T>;
}

/**
 * Internal representation of Custom Type that exposes the `data` property.
 * Used at buildtime.
 */
export type InternalCustom = CustomOperation<any, any> & {
  data: InternalCustomData;
};

function _custom<T extends CustomOperationParamShape>(
  typeName: CustomOperationName,
) {
  const data: CustomData = {
    arguments: {},
    returnType: null,
    functionRef: null,
    authorization: [],
    typeName: typeName,
    handlers: null,
  };

  const builder = brandedBuilder<T>({
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
    handler(handlers: Handler<any> | Handler<any>[]) {
      data.handlers = Array.isArray(handlers) ? handlers : [handlers];

      return this;
    },
  });

  return { ...builder, data } as InternalCustom as CustomOperation<T>;
}

export function query(): CustomOperation<
  {
    arguments: CustomArguments;
    returnType: null;
    functionRef: null;
    authorization: [];
    typeName: 'Query';
    handlers: null;
  },
  any
> {
  return _custom('Query');
}

export function mutation(): CustomOperation<
  {
    arguments: CustomArguments;
    returnType: null;
    functionRef: null;
    authorization: [];
    typeName: 'Mutation';
    handlers: null;
  },
  any
> {
  return _custom('Mutation');
}

export function subscription(): CustomOperation<
  {
    arguments: CustomArguments;
    returnType: null;
    functionRef: null;
    authorization: [];
    typeName: 'Subscription';
    handlers: null;
  },
  any
> {
  return _custom('Subscription');
}
