import { SetTypeSubArg } from '@aws-amplify/data-schema-types';
import { Brand } from './util';
import { AllowModifier, Authorization, allow } from './Authorization';
import { __auth } from './ModelField';

const brandName = 'ref';

type RefTypeData = {
  type: 'ref';
  link: string;
  valueRequired: boolean;
  array: boolean;
  arrayRequired: boolean;
  mutationOperations: MutationOperations[];
  authorization: Authorization<any, any, any>[];
};

export type RefTypeParamShape = {
  type: 'ref';
  link: string;
  valueRequired: boolean;
  array: boolean;
  arrayRequired: boolean;
  authorization: Authorization<any, any, any>[];
};

type MutationOperations = 'create' | 'update' | 'delete';

export type RefType<
  T extends RefTypeParamShape,
  K extends keyof RefType<T> = never,
  Auth = undefined,
  // Branding the exported type allows us to detect it
  // nominally in our mapped types, ignoring structural overlap with other types
> = Omit<
  {
    /**
     * Marks a field as required.
     */
    required(): RefType<
      SetTypeSubArg<
        T,
        T['array'] extends true ? 'arrayRequired' : 'valueRequired',
        true
      >,
      K | 'required'
    >;
    /**
     * Marks a field as an array of the specified ref type.
     */
    array(): RefType<
      SetTypeSubArg<T, 'array', true>,
      Exclude<K, 'required'> | 'array'
    >;
    /**
     * Configures field-level authorization rules. Pass in an array of authorizations `(allow => allow.____)` to mix and match
     * multiple authorization rules for this field.
     */
    authorization<AuthRuleType extends Authorization<any, any, any>>(
      callback: (allow: AllowModifier) => AuthRuleType | AuthRuleType[],
    ): RefType<T, K | 'authorization', AuthRuleType>;

    mutations(operations: MutationOperations[]): RefType<T, K | 'mutations'>;
  },
  K
> & {
  // This is a lie. This property is never set at runtime. It's just used to smuggle auth types through.
  [__auth]?: Auth;
} & Brand<typeof brandName>;

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
    valueRequired: false,
    array: false,
    arrayRequired: false,
    mutationOperations: [],
    authorization: [],
  };

  const builder: RefType<T> = brandedBuilder({
    required() {
      if (data.array) {
        data.arrayRequired = true;
      } else {
        data.valueRequired = true;
      }

      return this;
    },
    array() {
      data.array = true;

      return this;
    },
    authorization<AuthRuleType extends Authorization<any, any, any>>(
      callback: (allow: AllowModifier) => AuthRuleType | AuthRuleType[],
    ) {
      const rules = callback(allow);
      data.authorization = Array.isArray(rules) ? rules : [rules];

      return this;
    },
    mutations(operations: MutationOperations[]) {
      data.mutationOperations = operations;
      return this;
    },
  });

  return { ...builder, data } as InternalRef as RefType<T>;
}

type RefTypeArgFactory<Link extends string> = {
  type: 'ref';
  link: Link;
  valueRequired: false;
  array: false;
  arrayRequired: false;
  authorization: [];
};

export function ref<Value extends string, T extends Value>(link: T) {
  return _ref<RefTypeArgFactory<T>>(link);
}
