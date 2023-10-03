import { UnionToIntersection } from './util';

export const __data = Symbol('data');

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

// type ImpliedFields<Fields extends string> = Record<
//   Fields,
//   any
// >;

export type Authorization<
  AuthField extends string | undefined,
  AuthFieldPlurality extends boolean
> = {
  [__data]: {
    strategy?: Strategy;
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
export type ImpliedAuthField<T extends Authorization<any, any>> =
  T extends Authorization<infer Field, infer isMulti>
    ? Field extends string
      ? isMulti extends true
        ? { [K in Field]?: string[] }
        : { [K in Field]?: string }
      : object
    : object;

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
export type ImpliedAuthFields<T extends Authorization<any, any>> =
  UnionToIntersection<ImpliedAuthField<T>>;
