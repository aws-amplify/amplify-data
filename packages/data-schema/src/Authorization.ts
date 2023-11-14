import type { UnionToIntersection } from '@aws-amplify/data-schema-types';

const __data = Symbol('data');

/**
 * All possible providers.
 *
 * This list should not be used if you need to restrict available providers
 * according to an auth strategcy. E.g., `public` auth can only be facilitated
 * by `apiKey` and `iam` providers.
 */
export const Providers = [
  'apiKey',
  'iam',
  'userPools',
  'oidc',
  'function',
] as const;
export type Provider = (typeof Providers)[number];

/**
 * The subset of auth providers that can facilitate `public` auth.
 */
export const PublicProviders = ['apiKey', 'iam'] as const;
export type PublicProvider = (typeof PublicProviders)[number];

/**
 * The subset of auth providers that can facilitate `private` auth.
 */
export const PrivateProviders = ['userPools', 'oidc', 'iam'] as const;
export type PrivateProvider = (typeof PrivateProviders)[number];

/**
 * The subset of auth providers that can facilitate `owner` auth.
 */
export const OwnerProviders = ['userPools', 'oidc'] as const;
export type OwnerProviders = (typeof OwnerProviders)[number];

/**
 * The subset of auth providers that can facilitate `group` auth.
 */
export const GroupProviders = ['userPools', 'oidc'] as const;
export type GroupProvider = (typeof GroupProviders)[number];

/**
 * The subset of auth providers that can facilitate `custom` auth.
 */
export const CustomProviders = ['function'] as const;
export type CustomProvider = (typeof CustomProviders)[number];

export const Strategies = [
  'public',
  'private',
  'owner',
  'groups',
  'custom',
] as const;
export type Strategy = (typeof Strategies)[number];

/**
 * The operations that can be performed against an API.
 */
export const Operations = [
  'create',
  'update',
  'delete',
  'read',
  'get',
  'list',
  'sync',
  'listen',
  'search',
] as const;
export type Operation = (typeof Operations)[number];

export type Authorization<
  AuthStrategy extends Strategy,
  AuthField extends string | undefined,
  AuthFieldPlurality extends boolean,
> = {
  [__data]: {
    strategy?: AuthStrategy;
    provider?: Provider;
    operations?: Operation[];
    groupOrOwnerField?: AuthField;
    groups?: string[];
    multiOwner: AuthFieldPlurality;
    identityClaim?: string;
    groupClaim?: string;
  };
};

export type OwnerField = object;

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
  without: O,
): Omit<T, O> {
  const pruned = { ...original };
  delete (pruned as any)[without];
  return pruned;
}

function to<SELF extends Authorization<any, any, any>>(
  this: SELF,
  operations: Operation[],
) {
  (this as any)[__data].operations = operations;
  return omit(this, 'to');
}

function inField<
  SELF extends Authorization<any, any, any>,
  Field extends string,
>(this: SELF, field: Field) {
  this[__data].groupOrOwnerField = field;
  const built = omit(this, 'inField');

  return built as unknown as BuilderMethods<typeof built> &
    Authorization<
      SELF[typeof __data]['strategy'],
      Field,
      SELF[typeof __data]['multiOwner']
    >;
}

/**
 * Specifies a property of the identity JWT to use in place of `sub::username`
 * as the value to match against the owner field for authorization.
 *
 * @param this Authorization object to operate against.
 * @param property A property of identity JWT.
 * @returns A copy of the Authorization object with the claim attached.
 */
function identityClaim<SELF extends Authorization<any, any, any>>(
  this: SELF,
  property: string,
) {
  this[__data].identityClaim = property;
  return omit(this, 'identityClaim');
}

function withClaimIn<SELF extends Authorization<any, any, any>>(
  this: SELF,
  property: string,
) {
  this[__data].groupClaim = property;
  return omit(this, 'withClaimIn');
}

function validateProvider(
  needle: Provider | undefined,
  haystack: readonly Provider[],
) {
  if (needle && !haystack.includes(needle)) {
    throw new Error(`Invalid provider (${needle}) given!`);
  }
}

function authData<
  Strat extends Strategy = 'public',
  Field extends string | undefined = undefined,
  isMulti extends boolean = false,
  Builders extends object = object,
>(
  defaults: Partial<Authorization<Strat, Field, isMulti>[typeof __data]>,
  builderMethods: Builders,
): Authorization<Strat, Field, isMulti> & Builders {
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
    } as any,
    ...builderMethods,
  };
}

/**
 * Defines an authorization rule for your data models and fields. First choose an authorization strategy (`public`,
 * `private`, `owner`, `group`, or `custom`), then choose an auth provider (`apiKey`, `iam`, `userPools`, `oidc`, or `function`)
 * and optionally use `.to(...)` to specify the operations that can be performed against your data models and fields.
 */
export const allow = {
  /**
   * Authorize unauthenticated users. By default, `.public()` uses an API key based authorization. You can additionally
   * use `.public('iam')` to use IAM based authorization for unauthenticated users.
   * @param provider the authentication provider - supports "apiKey" or "iam" as valid providers
   * @returns an authorization rule for unauthenticated users
   */
  public(provider?: PublicProvider) {
    validateProvider(provider, PublicProviders);
    return authData(
      {
        strategy: 'public',
        provider,
      },
      {
        to,
      },
    );
  },

  /**
   * Authorize authenticated users. By default, `.private()` uses an Amazon Cognito user pool based authorization. You can additionally
   * use `.private("iam")` or `.private("oidc")` to use IAM or OIDC based authorization for authenticated users.
   * @param provider the authentication provider - supports "userPools", "iam", or "oidc"
   * @returns an authorization rule for authenticated users
   */
  private(provider?: PrivateProvider) {
    validateProvider(provider, PrivateProviders);
    return authData(
      {
        strategy: 'private',
        provider,
      },
      {
        to,
      },
    );
  },

  /**
   * Authorize access on a per-user (owner) basis. By setting owner-based authorization, a new `owner: a.string()`
   * field will be added to the model to store which user "owns" the item. Upon item creation, the "owner field" is
   * auto-populated with the authenticated user's information. You can which field should be used as the owner field
   * by chaining the * `.inField(...)` method.
   *
   * By default, `.owner()` uses an Amazon Cognito user pool based authorization. You can additionally
   * use `.owner("oidc")` to use OIDC based authentication to designate the owner.
   *
   * To change the specific claim that should be used as the user identifier within the owner field, chain the
   * `.identityClaim(...)` method.
   *
   * @param provider the authentication provider - supports "userPools", "iam", or "oidc"
   * @returns an authorization rule for authenticated users
   */
  owner(provider?: OwnerProviders) {
    validateProvider(provider, OwnerProviders);
    return authData(
      {
        strategy: 'owner',
        provider,
        groupOrOwnerField: 'owner',
      },
      {
        to,
        inField,
        identityClaim,
      },
    );
  },

  /**
   * Authorize access for multi-user / multi-owner access. By setting multi-owner-based authorization, a new `owners: a.string().array()`
   * field will be added to the model to store which users "own" the item. Upon item creation, the "owners field" is
   * auto-populated with the authenticated user's information. To grant other users access to the item, append their user identifier into the `owners` array.
   * You can which field should be used as the owners field by chaining the * `.inField(...)` method.
   *
   * By default, `.multipleOwners()` uses an Amazon Cognito user pool based authorization. You can additionally
   * use `.multipleOwners("oidc")` to use OIDC based authentication to designate the owner.
   *
   * To change the specific claim that should be used as the user identifier within the owners field, chain the
   * `.identityClaim(...)` method.
   *
   * @param provider the authentication provider - supports "userPools", "iam", or "oidc"
   * @returns an authorization rule for authenticated users
   */
  multipleOwners(provider?: OwnerProviders) {
    validateProvider(provider, OwnerProviders);
    return authData(
      {
        strategy: 'owner',
        multiOwner: true,
        provider,
        groupOrOwnerField: 'owner',
      },
      {
        to,
        inField,
        identityClaim,
      },
    );
  },

  /**
   * Authorize a specific user group. Provide the name of the specific user group to have access.
   *
   * By default, `.specificGroup()` uses an Amazon Cognito user pool based authorization. You can additionally
   * use `.specificGroup("group-name", "oidc")` to use OIDC based authentication to designate the user group.
   *
   * To change the specific claim that should be used as the user group identifier, chain the
   * `.withClaimIn(...)` method.
   * @param group the name of the group to authorize
   * @param provider the authentication provider - supports "userPools" or "oidc"
   * @returns an authorization rule to grant access by a specific group
   */
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
      },
    );
  },

  /**
   * Authorize multiple specific user groups. Provide the names of the specific user groups to have access.
   *
   * By default, `.specificGroups()` uses an Amazon Cognito user pool based authorization. You can additionally
   * use `.specificGroups(["group-a", "group-b"], "oidc")` to use OIDC based authentication to designate the user group.
   *
   * To change the specific claim that should be used as the user group identifier, chain the
   * `.withClaimIn(...)` method.
   * @param groups the names of the group to authorize defined as an array
   * @param provider the authentication provider - supports "userPools" or "oidc"
   * @returns an authorization rule to grant access by a specific group
   */
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
      },
    );
  },

  /**
   * Authorize if a user is part of a group defined in a data model field.
   *
   * By default, `.groupDefinedIn()` uses an Amazon Cognito user pool based authorization. You can additionally
   * use `.groupDefinedIn("field-name", "oidc")` to use OIDC based authentication to designate the user group.
   *
   * To change the specific claim that should be used as the user group identifier within the groups field, chain the
   * `.withClaimIn(...)` method.
   * @param groupsField the field that should store the authorized user group information
   * @param provider the authentication provider - supports "userPools" or "oidc"
   * @returns an authorization rule to grant access by a specific group
   */
  groupDefinedIn<T extends string>(groupsField: T, provider?: GroupProvider) {
    return authData(
      {
        strategy: 'groups',
        provider,
        groupOrOwnerField: groupsField,
      },
      {
        to,
        withClaimIn,
      },
    );
  },

  /**
   * Authorize if a user is part of a one of the groups defined in a data model field.
   *
   * By default, `.groupsDefinedIn()` uses an Amazon Cognito user pool based authorization. You can additionally
   * use `.groupsDefinedIn("field-name", "oidc")` to use OIDC based authentication to designate the user group.
   *
   * To change the specific claim that should be used as the user group identifier within the groups field, chain the
   * `.withClaimIn(...)` method.
   * @param groupsField the field that should store the list of authorized user groups
   * @param provider the authentication provider - supports "userPools" or "oidc"
   * @returns an authorization rule to grant access by a specific group
   */
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
        withClaimIn,
      },
    );
  },

  custom(provider?: CustomProvider) {
    return authData(
      {
        strategy: 'custom',
        provider,
      },
      {
        to,
      },
    );
  },
} as const;

/**
 * Turns the type from a list of `Authorization` rules like this:
 *
 * ```typescript
 * [
 *  allow.public(),
 *  allow.owner().inField('otherfield'),
 *  allow.multipleOwners().inField('editors')
 * ]
 * ```
 *
 * Into a union of the possible `fieldname: type` auth objects like this:
 *
 * ```typescript
 * {
 *  owner?: string | undefined;
 * } | {
 *  otherfield?: string | undefined;
 * } | {
 *  editors?: string[] | undefined;
 * }
 * ```
 */
export type ImpliedAuthField<T extends Authorization<any, any, any>> =
  T extends Authorization<infer _Strat, infer Field, infer isMulti>
    ? Field extends undefined
      ? never
      : Field extends string
      ? isMulti extends true
        ? { [K in Field]?: string[] }
        : { [K in Field]?: string }
      : never
    : never;

/**
 * Turns the type from a list of `Authorization` rules like this:
 *
 * ```typescript
 * [
 *  allow.public(),
 *  allow.owner().inField('otherfield'),
 *  allow.multipleOwners().inField('editors')
 * ]
 * ```
 *
 * Into an object type that includes all auth fields like this:
 *
 * ```typescript
 * {
 *  owner?: string | undefined;
 *  otherfield?: string | undefined;
 *  editors?: string[] | undefined;
 * }
 * ```
 */
export type ImpliedAuthFields<T extends Authorization<any, any, any>> =
  ImpliedAuthField<T> extends never
    ? never
    : UnionToIntersection<ImpliedAuthField<T>>;

export const accessData = <T extends Authorization<any, any, any>>(
  authorization: T,
) => authorization[__data];
