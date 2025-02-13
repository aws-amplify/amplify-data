import type {
  UnionToIntersection,
  DefineFunction,
} from '@aws-amplify/data-schema-types';

const __data = Symbol('data');

/**
 * All possible providers.
 *
 * This list should not be used if you need to restrict available providers
 * according to an auth strategcy. E.g., `public` auth can only be facilitated
 * by `apiKey` and `identityPool` providers.
 */
export const Providers = [
  'apiKey',
  'identityPool',
  'userPools',
  'oidc',
  'function',
] as const;
export type Provider = (typeof Providers)[number];

/**
 * The subset of auth providers that can facilitate `public` auth.
 */
export const PublicProviders = ['apiKey', 'identityPool'] as const;
export type PublicProvider = (typeof PublicProviders)[number];

/**
 * The subset of auth providers that can facilitate `private` auth.
 */
export const PrivateProviders = ['userPools', 'oidc', 'identityPool'] as const;
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

/**
 * The operations that can be performed against an API by a Lambda function.
 */
export const ResourceOperations = ['query', 'mutate', 'listen'] as const;
export type ResourceOperation = (typeof ResourceOperations)[number];

/**
 * Super-set of regular auth type; includes schema-level resource access configuration
 */
export type SchemaAuthorization<
  AuthStrategy extends Strategy,
  AuthField extends string | undefined,
  AuthFieldPlurality extends boolean,
> =
  | Authorization<AuthStrategy, AuthField, AuthFieldPlurality>
  | ResourceAuthorization;

/**
 * Container for representing the authorization of function resources
 */
export type ResourceAuthorization = {
  [__data]: ResourceAuthorizationData;
};

export type ResourceAuthorizationData = {
  strategy: 'resource';
  resource: DefineFunction;
  operations?: ResourceOperation[];
};

/**
 * Container for authorization schema definition content.
 *
 * @param AuthStrategy The auth strategy to use.
 * @param AuthField The field to use for owner authorization.
 * @param AuthFieldPlurality Whether the field is plural or singular.
 */
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
 * `private`, `owner`, `group`, or `custom`), then choose an auth provider (`apiKey`, `identitypool`, `userPools`, `oidc`, or `function`)
 * and optionally use `.to(...)` to specify the operations that can be performed against your data models and fields.
 */
export const allow = {
  /**
   * Authorize unauthenticated users by using API key based authorization.
   * @returns an authorization rule for unauthenticated users
   */
  publicApiKey() {
    return authData(
      {
        strategy: 'public',
        provider: 'apiKey',
      },
      {
        to,
      },
    );
  },

  /**
   * Authorize unauthenticated users by using IDENTITYPOOL based authorization.
   * @returns an authorization rule for unauthenticated users
   */
  guest() {
    return authData(
      {
        strategy: 'public',
        provider: 'identityPool',
      },
      {
        to,
      },
    );
  },

  /**
   * Authorize authenticated users. By default, `.authenticated()` uses an Amazon Cognito user pool based authorization. You can additionally
   * use `.authenticated("identityPool")` or `.authenticated("oidc")` to use identityPool or OIDC based authorization for authenticated users.
   * @param provider the authentication provider - supports "userPools", "identityPool", or "oidc"
   * @returns an authorization rule for authenticated users
   */
  authenticated(provider?: PrivateProvider) {
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
   * auto-populated with the authenticated user's information. If you want to specify which field should be used as
   * the owner field, you can use the `ownerDefinedIn` builder function instead.
   *
   * By default, `.owner()` uses an Amazon Cognito user pool based authorization. You can additionally
   * use `.owner("oidc")` to use OIDC based authentication to designate the owner.
   *
   * To change the specific claim that should be used as the user identifier within the owner field, chain the
   * `.identityClaim(...)` method.
   *
   * @param provider the authentication provider - supports "userPools", "identityPool", or "oidc"
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
        identityClaim,
      },
    );
  },

  /**
   * Authorize access on a per-user (owner) basis with specifying which field should be used as the owner field.
   *
   * By default, `.owner()` uses an Amazon Cognito user pool based authorization. You can additionally
   * use `.ownerDefinedIn("owner", "oidc")` to use OIDC based authentication to designate the owner.
   *
   * To change the specific claim that should be used as the user identifier within the owner field, chain the
   * `.identityClaim(...)` method.
   *
   * @param ownerField the field that contains the owner information
   * @param provider the authentication provider - supports "userPools", "identityPool", or "oidc"
   * @returns an authorization rule for authenticated users
   */
  ownerDefinedIn<T extends string>(ownerField: T, provider?: OwnerProviders) {
    validateProvider(provider, OwnerProviders);

    return authData(
      {
        strategy: 'owner',
        provider,
        groupOrOwnerField: ownerField,
      },
      {
        to,
        identityClaim,
      },
    );
  },

  /**
   * Authorize access for multi-user / multi-owner access. By setting multi-owner-based authorization, a new `owners: a.string().array()`
   * field will be added to the model to store which users "own" the item. Upon item creation, the "owners field" is
   * auto-populated with the authenticated user's information. To grant other users access to the item, append their user identifier into the `owners` array.
   *
   * You can specify which field should be used as the owners field by passing the `ownersField` parameter.
   *
   * By default, `.ownersDefinedIn()` uses an Amazon Cognito user pool based authorization. You can additionally
   * use `.ownersDefinedIn("owners", "oidc")` to use OIDC based authentication to designate the owner.
   *
   * To change the specific claim that should be used as the user identifier within the owners field, chain the
   * `.identityClaim(...)` method.
   *
   * @param ownersField the field that contains the owners information
   * @param provider the authentication provider - supports "userPools", "identityPool", or "oidc"
   * @returns an authorization rule for authenticated users
   */
  ownersDefinedIn<T extends string>(ownersField: T, provider?: OwnerProviders) {
    validateProvider(provider, OwnerProviders);

    return authData(
      {
        strategy: 'owner',
        provider,
        groupOrOwnerField: ownersField,
        multiOwner: true,
      },
      {
        to,
        identityClaim,
      },
    );
  },

  /**
   * Authorize a specific user group. Provide the name of the specific user group to have access.
   *
   * By default, `.group()` uses an Amazon Cognito user pool based authorization. You can additionally
   * use `.group("group-name", "oidc")` to use OIDC based authentication to designate the user group.
   *
   * To change the specific claim that should be used as the user group identifier, chain the
   * `.withClaimIn(...)` method.
   * @param group the name of the group to authorize
   * @param provider the authentication provider - supports "userPools" or "oidc"
   * @returns an authorization rule to grant access by a specific group
   */
  group(group: string, provider?: GroupProvider) {
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
   * By default, `.groups()` uses an Amazon Cognito user pool based authorization. You can additionally
   * use `.groups(["group-a", "group-b"], "oidc")` to use OIDC based authentication to designate the user group.
   *
   * To change the specific claim that should be used as the user group identifier, chain the
   * `.withClaimIn(...)` method.
   * @param groups the names of the group to authorize defined as an array
   * @param provider the authentication provider - supports "userPools" or "oidc"
   * @returns an authorization rule to grant access by a specific group
   */
  groups(groups: string[], provider?: GroupProvider) {
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

  resource(fn: DefineFunction) {
    return resourceAuthData(fn, {
      to: resourceTo,
    });
  },
} as const;

/**
 * This is a copy of the {@link allow} defined above, with modifications for custom operations.
 *
 * Removed builder methods:
 *
 * * `owner`
 * * `ownerDefinedIn`
 * * `ownersDefinedIn`
 * * `groupDefinedIn`
 * * `groupsDefinedIn`
 * * `resource`
 * * `.to()` builder method from each available rule builder
 */
export const allowForCustomOperations = {
  /**
   * Authorize unauthenticated users by using API key based authorization.
   * @returns an authorization rule for unauthenticated users
   */
  publicApiKey() {
    return authData(
      {
        strategy: 'public',
        provider: 'apiKey',
      },
      {},
    );
  },

  /**
   * Authorize unauthenticated users by using identityPool based authorization.
   * @returns an authorization rule for unauthenticated users
   */
  guest() {
    return authData(
      {
        strategy: 'public',
        provider: 'identityPool',
      },
      {},
    );
  },

  /**
   * Authorize authenticated users. By default, `.private()` uses an Amazon Cognito user pool based authorization. You can additionally
   * use `.authenticated("identityPool")` or `.authenticated("oidc")` to use Identity Pool or OIDC based authorization for authenticated users.
   * @param provider the authentication provider - supports "userPools", "identityPool", or "oidc"
   * @returns an authorization rule for authenticated users
   */
  authenticated(provider?: PrivateProvider) {
    validateProvider(provider, PrivateProviders);
    return authData(
      {
        strategy: 'private',
        provider,
      },
      {},
    );
  },

  /**
   * Authorize a specific user group. Provide the name of the specific user group to have access.
   *
   * By default, `.group()` uses an Amazon Cognito user pool based authorization. You can additionally
   * use `.group("group-name", "oidc")` to use OIDC based authentication to designate the user group.
   *
   * @param group the name of the group to authorize
   * @param provider the authentication provider - supports "userPools" or "oidc"
   * @returns an authorization rule to grant access by a specific group
   */
  group(group: string, provider?: GroupProvider) {
    return authData(
      {
        strategy: 'groups',
        provider,
        groups: [group],
      },
      {},
    );
  },

  /**
   * Authorize multiple specific user groups. Provide the names of the specific user groups to have access.
   *
   * By default, `.groups()` uses an Amazon Cognito user pool based authorization. You can additionally
   * use `.groups(["group-a", "group-b"], "oidc")` to use OIDC based authentication to designate the user group.
   *
   * @param groups the names of the group to authorize defined as an array
   * @param provider the authentication provider - supports "userPools" or "oidc"
   * @returns an authorization rule to grant access by a specific group
   */
  groups(groups: string[], provider?: GroupProvider) {
    return authData(
      {
        strategy: 'groups',
        provider,
        groups,
      },
      {},
    );
  },

  custom(provider?: CustomProvider) {
    return authData(
      {
        strategy: 'custom',
        provider,
      },
      {},
    );
  },
} as const;

export const allowForConversations = {
  owner() {
    return authData(
      {
        strategy: 'owner',
        provider: 'userPools',
      },
      {
        to,
        identityClaim,
      },
    );
  },
} as const;

function resourceTo<SELF extends ResourceAuthorization>(
  this: SELF,
  operations: ResourceOperation[],
) {
  (this as any)[__data].operations = operations;
  return omit(this, 'to');
}

function resourceAuthData<Builders extends object = object>(
  resource: DefineFunction,
  builderMethods: Builders,
): ResourceAuthorization & Builders {
  return {
    [__data]: {
      strategy: 'resource',
      resource,
    } as any,
    ...builderMethods,
  };
}

/**
 * Turns the type from a list of `Authorization` rules like this:
 *
 * ```typescript
 * [
 *  allow.public(),
 *  allow.ownerDefinedIn('otherfield'),
 *  allow.ownersDefinedIn('editors')
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
export type ImpliedAuthField<T extends AnyAuthorization> =
  T extends Authorization<infer _Strat, infer Field, infer isMulti>
    ? Field extends undefined
      ? never
      : Field extends string
        ? isMulti extends true
          ? { [K in Field]?: string[] | null | undefined }
          : { [K in Field]?: string | null | undefined }
        : never
    : never;

/**
 * Turns the type from a list of `Authorization` rules like this:
 *
 * ```typescript
 * [
 *  allow.public(),
 *  allow.ownerDefinedIn('otherfield'),
 *  allow.ownersDefinedIn('editors')
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
export type ImpliedAuthFields<T extends AnyAuthorization> =
  ImpliedAuthField<T> extends never
    ? never
    : UnionToIntersection<ImpliedAuthField<T>>;

export const accessData = <T extends AnyAuthorization>(
  authorization: T,
) => authorization[__data];

// TODO: delete when we make resource auth available at each level in the schema (model, field)
export const accessSchemaData = <T extends SchemaAuthorization<any, any, any>>(
  authorization: T,
): T[typeof __data] => authorization[__data];

// `allow` is declared as a `const` above
export type AllowModifier = typeof allow;
export type AllowModifierForCustomOperation = typeof allowForCustomOperations;
export type AllowModifierForConversations = typeof allowForConversations;

export type BaseAllowModifier = Omit<AllowModifier, 'resource'>;
export type AnyAuthorization =  Authorization<any, any, any>;

export type ConversationAuthorizationCallback<AuthRuleType extends AnyAuthorization> = (
  allow: AllowModifierForConversations
) => AuthRuleType | AuthRuleType[];

export type CustomOperationAuthorizationCallback<AuthRuleType extends AnyAuthorization> = (
  allow: AllowModifierForCustomOperation,
) => AuthRuleType | AuthRuleType[];

export type FieldAuthorizationCallback<AuthRuleType extends AnyAuthorization> = (
  allow: Omit<AllowModifier, 'resource'>,
) => AuthRuleType | AuthRuleType[];

export type ModelAuthorizationCallback<AuthRuleType extends AnyAuthorization> = (
  allow: BaseAllowModifier
) => AuthRuleType | AuthRuleType[];

export type ReferenceAuthorizationCallback<AuthRuleType extends AnyAuthorization> = (
  allow: AllowModifier
) => AuthRuleType | AuthRuleType[];

export type RelationshipAuthorizationCallback<AuthRuleType extends AnyAuthorization> = (
  allow: AllowModifier
) => AuthRuleType | AuthRuleType[]

export type SchemaAuthorizationCallback<AuthRuleType extends SchemaAuthorization<any, any, any>> = (
  allow: AllowModifier
) => AuthRuleType | AuthRuleType[];

type AuthorizationCallbackMapping = {
  conversation: ConversationAuthorizationCallback<any>;
  customOperation: CustomOperationAuthorizationCallback<any>;
  field: FieldAuthorizationCallback<any>;
  model: ModelAuthorizationCallback<any>;
  ref: ReferenceAuthorizationCallback<any>;
  relationship: RelationshipAuthorizationCallback<any>;
  schema: SchemaAuthorizationCallback<any>;
};

/**
 * Define an authorization callback that can be reused for multiple authorization calls
 * across the schema definition.
 *
 * @typeParam AuthorizationType - The type of Authorization callback being built, which can be
 *    'conversation' | 'customOperation' | 'field' | 'model' | 'reference' | 'relationship' | 'schema'
 *
 * @example
 * const authCallback: AuthorizationCallback = (allow) => [
 *   allow.groups(["example"]).to(["read"]),
 * ];
 *
 * const schema = a.schema({
 *   Post: a.model({
 *     id: a.id(),
 *     title: a.string(),
 *     protectedField: a.string().authorization(authCallback),
 *     content: a.string(),
 *   }).authorization(authCallback),
 * }).authorization(authCallback);
 *
 */
export type AuthorizationCallback<
  AuthorizationType extends (keyof AuthorizationCallbackMapping) = "model"
> = AuthorizationCallbackMapping[AuthorizationType];