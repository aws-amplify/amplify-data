import { ModelField, InternalField } from './ModelField';
import { Authorization } from './Authorization';
import type { SetTypeSubArg } from '@aws-amplify/amplify-api-next-types-alpha';

type CustomArguments = Record<string, ModelField<any, any>>;

type CustomResponse = ModelField<any, any>;

type InternalCustomFields = Record<string, InternalField>;
type InternalCustomArguments = Record<string, InternalField>;
type InternalCustomResponse = InternalField;

type CustomTypeName = 'Query' | 'Mutation' | 'Subscription';

type CustomData = {
  arguments: CustomArguments;
  response: CustomResponse | null;
  authorization: Authorization<any, any>[];
  typeName: CustomTypeName;
};

type InternalCustomData = CustomData & {
  fields: InternalCustomFields;
  arguments: InternalCustomArguments;
  response: InternalCustomResponse;
  authorization: Authorization<any, any>[];
};

export type CustomTypeParamShape = {
    arguments: CustomArguments;
    response: CustomResponse | null;
    authorization: Authorization<any, any>[];
    typeName: CustomTypeName;
};

export type CustomType<
  T extends CustomTypeParamShape,
  K extends keyof CustomType<T> = never,
> = Omit<
  {
    arguments<Arguments extends CustomArguments>(
        args: Arguments,
    ): CustomType<SetTypeSubArg<T, 'arguments', Arguments>, K | 'arguments'>;
    response<Response extends CustomResponse>(
        response: Response,
    ): CustomType<SetTypeSubArg<T, 'response', Response>, K | 'response'>;
    authorization<AuthRuleType extends Authorization<any, any>>(
      rules: AuthRuleType[],
    ): CustomType<
      SetTypeSubArg<T, 'authorization', AuthRuleType[]>,
      K | 'authorization'
    >;
  },
  K
>;

/**
 * Internal representation of Custom Type that exposes the `data` property.
 * Used at buildtime.
 */
export type InternalCustom = CustomType<any> & {
  data: InternalCustomData;
};

function _Custom<T extends CustomTypeParamShape>(typeName: CustomTypeName) {
  const data: CustomData = {
    arguments: {},
    response: null,
    authorization: [],
    typeName,
  };

  const builder: CustomType<T> = {
    arguments(args) {
        data.arguments = args;

        return this;
    },
    response(response) {
        data.response = response;

        return this;
    },
    authorization(rules) {
      data.authorization = rules;

      return this;
    },
  };

  return { ...builder, data } as InternalCustom as CustomType<T>;
}

export function query(): CustomType<{ arguments: CustomArguments, response: null, authorization: [], typeName: 'Query' }> {
  return _Custom('Query');
}

export function mutation(): CustomType<{ arguments: CustomArguments, response: null, authorization: [], typeName: 'Mutation' }> {
  return _Custom('Mutation');
}

export function subscription(): CustomType<{ arguments: CustomArguments, response: null, authorization: [], typeName: 'Subscription' }> {
  return _Custom('Subscription');
}
