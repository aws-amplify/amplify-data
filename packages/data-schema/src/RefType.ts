import { SetTypeSubArg } from '@aws-amplify/data-schema-types';
import { Brand } from './Brand';
import { Authorization } from './Authorization';
import { __auth } from './ModelField';

type RefTypeData = {
  type: 'ref';
  link: string;
  required: boolean;
  authorization: Authorization<any, any, any>[];
};

export type RefTypeParamShape = {
  type: 'ref';
  link: string;
  required: boolean;
  authorization: Authorization<any, any, any>[];
};

export type RefType<
  T extends RefTypeParamShape,
  K extends keyof RefType<T> = never,
  Auth = undefined,
  // Branding the exported type allows us to detect it
  // nominally in our mapped types, ignoring structural overlap with other types
> = Brand<
  Omit<
    {
      /**
       * Marks a field as required.
       */
      required(): RefType<SetTypeSubArg<T, 'required', true>, K | 'required'>;
      /**
       * Configures field-level authorization rules. Pass in an array of authorizations `(a.allow.____)` to mix and match
       * multiple authorization rules for this field.
       */
      authorization<AuthRuleType extends Authorization<any, any, any>>(
        rules: AuthRuleType[],
      ): RefType<T, K | 'authorization', AuthRuleType>;
    },
    K
  > & {
    // This is a lie. This property is never set at runtime. It's just used to smuggle auth types through.
    [__auth]?: Auth;
  },
  'ref'
>;

function brandedBuilder<T extends RefTypeParamShape>(
  builder: Record<keyof RefType<T> & string, any>,
): RefType<T> {
  return builder as RefType<T>;
}

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

  const builder: RefType<T> = brandedBuilder({
    required() {
      data.required = true;

      return this;
    },
    authorization(rules: Authorization<any, any, any>[]) {
      data.authorization = rules;

      return this;
    },
  });

  return { ...builder, data } as InternalRef as RefType<T>;
}

type RefTypeArgFactory<Link extends string> = {
  type: 'ref';
  link: Link;
  required: false;
  authorization: [];
};

export function ref<Value extends string, T extends Value>(link: T) {
  return _ref<RefTypeArgFactory<T>>(link);
}
