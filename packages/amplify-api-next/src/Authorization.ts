import {Authorization, Operation, Provider, PublicProvider, PublicProviders, PrivateProvider, PrivateProviders, GroupProvider, OwnerProviders, __data} from '@aws-amplify/amplify-api-next-types-alpha';

type BuilderMethods<T extends object> = {
  [K in keyof T as T[K] extends (...args: any) => any ? K : never]: T[K];
};

/**
 * Creates a shallow copy of an object with an individual field pruned away.
 *
 * @param original The original object to prune.
 * @param without The field to prune.
 * @returns The pruned object.
 */
function omit<T extends object, O extends string>(
  original: T,
  without: O
): Omit<T, O> {
  const pruned = { ...original };
  delete (pruned as any)[without];
  return pruned;
}

function to<SELF extends Authorization<any, any>>(
  this: SELF,
  operations: Operation[]
) {
  (this as any)[__data].operations = operations;
  return omit(this, 'to');
}

function inField<SELF extends Authorization<any, any>, Field extends string>(
  this: SELF,
  field: Field
) {
  this[__data].groupOrOwnerField = field;
  const built = omit(this, 'inField');

  return built as unknown as BuilderMethods<typeof built> &
    Authorization<Field, SELF[typeof __data]['multiOwner']>;
}

/**
 * Specifies a property of the identity JWT to use in place of `sub::username`
 * as the value to match against the owner field for authorization.
 *
 * @param this Authorization object to operate against.
 * @param property A property of identity JWT.
 * @returns A copy of the Authorization object with the claim attached.
 */
function identityClaim<SELF extends Authorization<any, any>>(
  this: SELF,
  property: string
) {
  this[__data].identityClaim = property;
  return omit(this, 'identityClaim');
}

function withClaimIn<SELF extends Authorization<any, any>>(
  this: SELF,
  property: string
) {
  this[__data].groupClaim = property;
  return omit(this, 'withClaimIn');
}

function validateProvider(
  needle: Provider | undefined,
  haystack: readonly Provider[]
) {
  if (needle && !haystack.includes(needle)) {
    throw new Error(`Invalid provider (${needle}) given!`);
  }
}

function authData<
  Field extends string | undefined = 'owner',
  isMulti extends boolean = false,
  Builders extends object = object
>(
  defaults: Partial<Authorization<Field, isMulti>[typeof __data]>,
  builderMethods: Builders
): Authorization<Field, isMulti> & Builders {
  return {
    [__data]: {
      strategy: 'public',
      provider: undefined,
      operations: undefined,
      groupOrOwnerField: undefined,
      multiOwner: false,
      identityClaim: undefined,
      groups: undefined,
      ...defaults,

      // might not even be needed ...
      // dependencies: {
      //   owner: {},
      // },
    } as any,
    ...builderMethods,
  };
}

export const allow = {
  public(provider?: PublicProvider) {
    validateProvider(provider, PublicProviders);
    return authData(
      {
        strategy: 'public',
        provider,
      },
      {
        to,
      }
    );
  },

  private(provider?: PrivateProvider) {
    validateProvider(provider, PrivateProviders);
    return authData(
      {
        strategy: 'private',
        provider,
      },
      {
        to,
      }
    );
  },

  owner(provider?: OwnerProviders) {
    validateProvider(provider, OwnerProviders);
    return authData(
      {
        strategy: 'owner',
        provider,
      },
      {
        to,
        inField,
        identityClaim,
      }
    );
  },

  /**
   * Specifies `owner` auth and automatically adds the necessary
   * `[owner]: a.string().list()` field if it doesn't already exist.
   */
  multipleOwners(provider?: OwnerProviders) {
    validateProvider(provider, OwnerProviders);
    return authData(
      {
        strategy: 'owner',
        multiOwner: true,
        provider,
      },
      {
        to,
        inField,
        identityClaim,
      }
    );
  },

  specificGroup(group: string, provider?: GroupProvider) {
    return authData(
      {
        strategy: 'groups',
        provider,
        groups: [group],
      },
      {
        to,
        withClaimIn,
      }
    );
  },

  specificGroups(groups: string[], provider?: GroupProvider) {
    return authData(
      {
        strategy: 'groups',
        provider,
        groups,
      },
      {
        to,
        withClaimIn,
      }
    );
  },

  groupDefinedIn<T extends string>(groupsField: T, provider?: GroupProvider) {
    return authData(
      {
        strategy: 'groups',
        provider,
        groupOrOwnerField: groupsField,
      },
      {
        to,
      }
    );
  },

  groupsDefinedIn<T extends string>(groupsField: T, provider?: GroupProvider) {
    return authData(
      {
        strategy: 'groups',
        provider,
        groupOrOwnerField: groupsField,
        multiOwner: true,
      },
      {
        to,
      }
    );
  },
} as const;

