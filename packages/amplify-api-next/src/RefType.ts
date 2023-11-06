import { SetTypeSubArg } from '@aws-amplify/amplify-api-next-types-alpha';
import { Authorization } from './Authorization';
import { __auth } from './ModelField';

export const __ref = Symbol('__ref');

export type RefTypeParamShape = {
  type: 'ref';
  link: string;
  required: boolean;
  authorization: Authorization<any, any>[];
};

export type RefType<
  T extends RefTypeParamShape,
  K extends keyof RefType<T> = never,
  Auth = undefined,
> = Omit<
  {
    /**
     * Marks a field as required.
     */
    required(): RefType<SetTypeSubArg<T, 'required', true>, K | 'required'>;
    /**
     * Configures field-level authorization rules. Pass in an array of authorizations `(a.allow.____)` to mix and match
     * multiple authorization rules for this field.
     */
    authorization<AuthRuleType extends Authorization<any, any>>(
      rules: AuthRuleType[],
    ): RefType<
      SetTypeSubArg<T, 'authorization', []>,
      K | 'authorization',
      AuthRuleType
    >;
    // structural difference to separate type from ModelField TODO: find cleaner way to achieve this
    [__ref]: typeof __ref;
  },
  K
> & {
  // This is a lie. This property is never set at runtime. It's just used to smuggle auth types through.
  [__auth]?: Auth;
};

type RefTypeData = {
  type: 'ref';
  link: string;
  required: boolean;
  authorization: Authorization<any, any>[];
};

/**
 * Internal representation of Ref that exposes the `data` property.
 * Used at buildtime.
 */
export type InternalRef = RefType<RefTypeParamShape> & {
  data: RefTypeData;
};

function _ref<T extends RefTypeParamShape>(link: T['link']) {
  const data: RefTypeData = {
    type: 'ref',
    link,
    required: false,
    authorization: [],
  };

  const builder: RefType<T> = {
    required() {
      data.required = true;

      return this;
    },
    authorization(rules) {
      data.authorization = rules;

      return this;
    },
    [__ref]: __ref,
  };

  return { ...builder, data } as InternalRef as RefType<T>;
}

// TODO: array, arrayRequired, authorization
type RefTypeArgFactory<Link extends string> = {
  type: 'ref';
  link: Link;
  required: false;
  authorization: [];
};

export function ref<Value extends string, T extends Value>(link: T) {
  return _ref<RefTypeArgFactory<T>>(link);
}
