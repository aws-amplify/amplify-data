import { Brand, SetTypeSubArg } from '@aws-amplify/data-schema-types';
import { ModelField, InternalField } from './ModelField';
import { Authorization } from './Authorization';
import { RefType, InternalRef } from './RefType';

type CustomArguments = Record<string, ModelField<any, any>>;

type CustomReturnType = RefType<any>;

type InternalCustomFields = Record<string, InternalField>;
type InternalCustomArguments = Record<string, InternalField>;
type InternalCustomReturnType = InternalRef;

export const CustomOperationNames = [
  'Query',
  'Mutation',
  'Subscription',
] as const;
type CustomOperationName = (typeof CustomOperationNames)[number];

type CustomData = {
  arguments: CustomArguments;
  returnType: CustomReturnType | null;
  authorization: Authorization<any, any>[];
  typeName: CustomOperationName;
};

type InternalCustomData = CustomData & {
  fields: InternalCustomFields;
  arguments: InternalCustomArguments;
  returnType: InternalCustomReturnType;
  authorization: Authorization<any, any>[];
};

export type CustomOperationParamShape = {
  arguments: CustomArguments;
  returnType: CustomReturnType | null;
  authorization: Authorization<any, any>[];
  typeName: CustomOperationName;
};

export type CustomOperation<
  T extends CustomOperationParamShape,
  K extends keyof CustomOperation<T> = never,
  // Branding the exported type allows us to detect it
  // nominally in our mapped types, ignoring structural overlap with other types
> = Brand<
  Omit<
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
      authorization<AuthRuleType extends Authorization<any, any>>(
        rules: AuthRuleType[],
      ): CustomOperation<
        SetTypeSubArg<T, 'authorization', AuthRuleType[]>,
        K | 'authorization'
      >;
    },
    K
  >,
  'customOperation'
>;

function brandedBuilder<T extends CustomOperationParamShape>(
  builder: Record<keyof CustomOperation<T> & string, any>,
): CustomOperation<T> {
  return builder as CustomOperation<T>;
}

/**
 * Internal representation of Custom Type that exposes the `data` property.
 * Used at buildtime.
 */
export type InternalCustom = CustomOperation<any> & {
  data: InternalCustomData;
};

function _custom<T extends CustomOperationParamShape>(
  typeName: CustomOperationName,
) {
  const data: CustomData = {
    arguments: {},
    returnType: null,
    authorization: [],
    typeName: typeName,
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
    authorization(rules: Authorization<any, any>[]) {
      data.authorization = rules;

      return this;
    },
  });

  return { ...builder, data } as InternalCustom as CustomOperation<T>;
}

export function query(): CustomOperation<{
  arguments: CustomArguments;
  returnType: null;
  authorization: [];
  typeName: 'Query';
}> {
  return _custom('Query');
}

export function mutation(): CustomOperation<{
  arguments: CustomArguments;
  returnType: null;
  authorization: [];
  typeName: 'Mutation';
}> {
  return _custom('Mutation');
}

export function subscription(): CustomOperation<{
  arguments: CustomArguments;
  returnType: null;
  authorization: [];
  typeName: 'Subscription';
}> {
  return _custom('Subscription');
}
