import { ConstructFactory } from '@aws-amplify/plugin-types';
import { FunctionResources } from '@aws-amplify/plugin-types';
import type { Observable } from 'rxjs';
import { ResourceAccessAcceptorFactory } from '@aws-amplify/plugin-types';
import { ResourceProvider } from '@aws-amplify/plugin-types';

/**
 * Used to "attach" auth types to ModelField without exposing them on the builder.
 */
declare const __auth: unique symbol;

/**
 * Used to "attach" auth types to ModelField without exposing them on the builder.
 */
declare const __auth_2: unique symbol;

declare const __data: unique symbol;

export declare const __modelMeta__: unique symbol;

declare namespace a {
    export {
        schema,
        model,
        modelIndex as index,
        ref,
        customType,
        enumType as enum,
        query,
        mutation,
        subscription,
        hasOne,
        hasMany,
        belongsTo,
        manyToMany,
        allow,
        id,
        string,
        integer,
        float,
        boolean,
        date,
        time,
        datetime,
        timestamp,
        email,
        json,
        phone,
        url,
        ipAddress,
        handler
    }
}
export { a }

declare type AllAuthFieldsForModel<Schema extends ModelSchema<any, any>, Model extends Schema['data']['types'][keyof Schema['data']['types']]> = (Model['authorization'][number] extends never ? Schema['data']['authorization'][number] extends never ? object : ImpliedAuthFields<Schema['data']['authorization'][number]> : ImpliedAuthFields<Model['authorization'][number]>) & ImpliedAuthFieldsFromFields<Model>;

declare type AllImpliedFKs<ResolvedSchema, Identifiers extends Record<string, {
    identifier: string;
}>, Schema extends Record<any, any> = ResolvedSchema extends ResolveSchema<any> ? ResolvedSchema : object, DenormalizedSchema extends Denormalized<Schema, Identifiers> = Denormalized<Schema, Identifiers>, AllModels = DenormalizedSchema['model'] | DenormalizedSchema['relationName']> = {
    [K in Extract<AllModels, string>]: ImpliedFKs<ResolvedSchema, Identifiers, K> extends never ? object : ImpliedFKs<ResolvedSchema, Identifiers, K>;
};

/**
 * Defines an authorization rule for your data models and fields. First choose an authorization strategy (`public`,
 * `private`, `owner`, `group`, or `custom`), then choose an auth provider (`apiKey`, `iam`, `userPools`, `oidc`, or `function`)
 * and optionally use `.to(...)` to specify the operations that can be performed against your data models and fields.
 */
declare const allow: {
    /**
     * Authorize unauthenticated users. By default, `.public()` uses an API key based authorization. You can additionally
     * use `.public('iam')` to use IAM based authorization for unauthenticated users.
     * @param provider the authentication provider - supports "apiKey" or "iam" as valid providers
     * @returns an authorization rule for unauthenticated users
     */
    readonly public: (provider?: PublicProvider) => Authorization<"public", undefined, false> & {
        to: typeof to;
    };
    /**
     * Authorize authenticated users. By default, `.private()` uses an Amazon Cognito user pool based authorization. You can additionally
     * use `.private("iam")` or `.private("oidc")` to use IAM or OIDC based authorization for authenticated users.
     * @param provider the authentication provider - supports "userPools", "iam", or "oidc"
     * @returns an authorization rule for authenticated users
     */
    readonly private: (provider?: PrivateProvider) => Authorization<"private", undefined, false> & {
        to: typeof to;
    };
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
    readonly owner: (provider?: OwnerProviders) => Authorization<"owner", "owner", false> & {
        to: typeof to;
        inField: typeof inField;
        identityClaim: typeof identityClaim;
    };
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
    readonly multipleOwners: (provider?: OwnerProviders) => Authorization<"owner", "owner", true> & {
        to: typeof to;
        inField: typeof inField;
        identityClaim: typeof identityClaim;
    };
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
    readonly specificGroup: (group: string, provider?: GroupProvider) => Authorization<"groups", undefined, false> & {
        to: typeof to;
        withClaimIn: typeof withClaimIn;
    };
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
    readonly specificGroups: (groups: string[], provider?: GroupProvider) => Authorization<"groups", undefined, false> & {
        to: typeof to;
        withClaimIn: typeof withClaimIn;
    };
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
    readonly groupDefinedIn: <T extends string>(groupsField: T, provider?: GroupProvider) => Authorization<"groups", T, false> & {
        to: typeof to;
        withClaimIn: typeof withClaimIn;
    };
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
    readonly groupsDefinedIn: <T_1 extends string>(groupsField: T_1, provider?: GroupProvider) => Authorization<"groups", T_1, true> & {
        to: typeof to;
        withClaimIn: typeof withClaimIn;
    };
    readonly custom: (provider?: CustomProvider) => Authorization<"custom", undefined, false> & {
        to: typeof to;
    };
    readonly resource: (fn: DefineFunction) => ResourceAuthorization & {
        to: typeof resourceTo;
    };
};

declare type ArrayField<T> = [T] extends [ModelFieldTypeParamInner] ? Array<T> | null : never;

export declare type AuthMode = 'apiKey' | 'iam' | 'oidc' | 'userPool' | 'lambda' | 'none';

declare type Authorization<AuthStrategy extends Strategy, AuthField extends string | undefined, AuthFieldPlurality extends boolean> = {
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

/**
 * Importing the full objects from @aws-amplify/plugin-types
 * more than doubles dev env runtime. This type replacement
 * will contain the content for config without the negative
 * side-effects. We may need to re-approach if customers interact
 * with these programmatically to avoid forcing narrowing.
 */
declare type BackendSecret = {
    resolve: (scope: any, backendIdentifier: any) => any;
    resolvePath: (backendIdentifier: any) => any;
};

/**
 * Make a `hasOne()` or `hasMany()` relationship bi-directional using the `belongsTo()` method.
 * The belongsTo() method requires that a hasOne() or hasMany() relationship already exists from
 * parent to the related model.
 * @param relatedModel name of the related `.hasOne()` or `.hasMany()` model
 * @returns a belong-to relationship definition
 */
declare function belongsTo<RM extends string>(relatedModel: RM): ModelRelationalField<ModelRelationalTypeArgFactory<RM, ModelRelationshipTypes.belongsTo, false, undefined>, RM, "required" | "valueRequired" | "arrayRequired", undefined>;

/**
 * A boolean scalar type that can be either true or false.
 * @returns boolean field definition
 */
declare function boolean(): ModelField<Nullable<boolean>>;

declare type BooleanFilters = {
    attributeExists?: boolean;
    eq?: boolean;
    ne?: boolean;
};

/**
 * @typeParam BrandStr - String type to brand this object with
 * @returns A branded empty object type
 *
 * @example
 * Brand<'example'> => {[brandSymbol]: 'example'}
 *
 * Which I might use like this:
 * type MyType = {content: string} & Brand<'example'>
 */
declare type Brand<BrandStr extends string> = {
    [brandSymbol]: BrandStr;
};

declare const brandName = "modelField";

declare const brandName_2 = "modelRelationalField";

declare const brandName_3 = "ref";

declare const brandName_4 = "modelType";

declare const brandName_5 = "modelIndexType";

declare const brandSymbol: unique symbol;

declare type BuilderMethods<T extends object> = {
    [K in keyof T as T[K] extends (...args: any) => any ? K : never]: T[K];
};

export declare type ClientSchema<Schema extends ModelSchema<any, any>> = InternalClientSchema<Schema>;

declare type ContextType = 'CLIENT' | 'COOKIES' | 'REQUEST';

declare type CreateImplicitModelsFromRelations<Schema> = UnionToIntersection<ExcludeEmpty<{
    [ModelProp in keyof Schema]: {
        [FieldProp in keyof Schema[ModelProp] as Schema[ModelProp][FieldProp] extends ModelRelationalFieldParamShape ? Schema[ModelProp][FieldProp]['relationName'] extends string ? Schema[ModelProp][FieldProp]['relationName'] extends keyof Schema ? never : Schema[ModelProp][FieldProp]['relationName'] : never : never]: Record<`${Lowercase<ModelProp & string>}`, ModelRelationalTypeArgFactory<ModelProp & string, ModelRelationshipTypes.hasMany, false>>;
    };
}[keyof Schema]>>;

/**
 * All identifiers and fields used to create a model
 */
declare type CreateModelInput<Model extends Record<string, unknown>, ModelMeta extends Record<string, unknown>> = Equal<ModelIdentifier_2<ModelMeta>, {
    id: string;
}> extends true ? Partial<ModelIdentifier_2<ModelMeta>> & Omit<MutationInput<Model, ModelMeta>, 'id'> : MutationInput<Model, ModelMeta>;

declare function custom(customHandler: CustomHandlerInput): CustomHandler;

declare type CustomArguments = Record<string, ModelField<any, any> | EnumType<EnumTypeParamShape>>;

declare type CustomFunctionRefType = string;

declare type CustomHandler = {
    [dataSymbol]: CustomHandlerData;
} & Brand<typeof customHandlerBrand>;

declare const customHandlerBrand = "customHandler";

declare type CustomHandlerData = CustomHandlerInput & {
    stack: string | undefined;
};

declare type CustomHandlerInput = {
    /**
     * The data source used by the function.
     * Can reference a model in the schema with a.ref('ModelName') or any string data source name configured in your API
     *
     * Defaults to 'NONE_DS'
     *
     */
    dataSource?: string | RefType<any, any, any>;
    /**
     * The path to the file that contains the function entry point.
     * If this is a relative path, it is computed relative to the file where this handler is defined
     */
    entry: string;
};

/**
 * Custom headers that can be passed either to the client or to individual
 * model operations, either as a static object or a function that returns a
 * promise.
 */
export declare type CustomHeaders = Record<string, string> | ((requestOptions?: RequestOptions) => Promise<Record<string, string>>);

export declare type CustomMutations<Schema extends Record<any, any>, Context extends ContextType = 'CLIENT', ModelMeta extends Record<any, any> = ExtractModelMeta<Schema>> = CustomOperations<Schema, 'Mutation', Context, ModelMeta>;

/**
 * Digs out custom operation arguments, mapped to the intended graphql types.
 */
declare type CustomOpArguments<Shape extends CustomOperationParamShape> = {
    [FieldName in keyof Shape['arguments']]: Shape['arguments'][FieldName] extends ModelField<infer R, any, any> ? R : never;
};

declare type CustomOperation<T extends CustomOperationParamShape, K extends keyof CustomOperation<T> = never, B extends CustomOperationBrand = CustomOperationBrand> = Omit<{
    arguments<Arguments extends CustomArguments>(args: Arguments): CustomOperation<SetTypeSubArg<T, 'arguments', Arguments>, K | 'arguments', B>;
    returns<ReturnType extends CustomReturnType>(returnType: ReturnType): CustomOperation<SetTypeSubArg<T, 'returnType', ReturnType>, K | 'returns', B>;
    /**
     *
     * @deprecated
     * `.function` should no longer be used and will be removed
     * in the next minor version of this package.
     *
     * Use `.handler(a.handler.function())` instead
     */
    function<FunctionRef extends CustomFunctionRefType>(functionRefOrName: FunctionRef): CustomOperation<SetTypeSubArg<T, 'functionRef', FunctionRef>, K | 'function', B>;
    authorization<AuthRuleType extends Authorization<any, any, any>>(rules: AuthRuleType[]): CustomOperation<SetTypeSubArg<T, 'authorization', AuthRuleType[]>, K | 'authorization', B>;
    handler<H extends HandlerInputType>(handlers: H): CustomOperation<T, K | 'handler', B>;
}, K> & Brand<B>;

declare type CustomOperationBrand = typeof queryBrand | typeof mutationBrand | typeof subscriptionBrand;

declare type CustomOperationName = (typeof CustomOperationNames)[number];

declare const CustomOperationNames: readonly ["Query", "Mutation", "Subscription"];

declare type CustomOperationParamShape = {
    arguments: CustomArguments;
    returnType: CustomReturnType | null;
    functionRef: string | null;
    authorization: Authorization<any, any, any>[];
    typeName: CustomOperationName;
    handlers: HandlerType | null;
};

export declare type CustomOperations<Schema extends Record<any, any>, OperationType extends 'Query' | 'Mutation' | 'Subscription', Context extends ContextType = 'CLIENT', ModelMeta extends Record<any, any> = ExtractModelMeta<Schema>> = {
    [OpName in keyof ModelMeta['customOperations'] as ModelMeta['customOperations'][OpName]['typeName'] extends OperationType ? OpName : never]: {
        CLIENT: (input: ModelMeta['customOperations'][OpName]['arguments'], options?: {
            authMode?: AuthMode;
            authToken?: string;
            headers?: CustomHeaders;
        }) => SingularReturnValue<ModelMeta['customOperations'][OpName]['returnType']>;
        COOKIES: (input: ModelMeta['customOperations'][OpName]['arguments'], options?: {
            authMode?: AuthMode;
            authToken?: string;
            headers?: CustomHeaders;
        }) => SingularReturnValue<ModelMeta['customOperations'][OpName]['returnType']>;
        REQUEST: (contextSpec: any, input: ModelMeta['customOperations'][OpName]['arguments'], options?: {
            authMode?: AuthMode;
            authToken?: string;
            headers?: CustomHeaders;
        }) => SingularReturnValue<ModelMeta['customOperations'][OpName]['returnType']>;
    }[Context];
};

/**
 * Computes the return type from the `returnType` of a custom operation shape.
 *
 * This entails dereferencing refs and inferring graphql types from field-type defs.
 */
declare type CustomOpReturnType<Shape extends CustomOperationParamShape, FullyResolvedSchema extends Record<string, unknown>, NonModelTypes extends NonModelTypesShape> = Shape['returnType'] extends RefType<infer RefShape, any, any> ? ResolveRef_2<RefShape, FullyResolvedSchema, NonModelTypes> : Shape['returnType'] extends ModelField<infer R, any, any> ? R : never;

/**
 * Filtered, mapped list of custom operations shapes from a schema.
 */
declare type CustomOpShapes<Schema extends ModelSchema<any, any>> = {
    [K in keyof Schema['data']['types'] as Schema['data']['types'][K] extends CustomOperation<any, any> ? K : never]: Schema['data']['types'][K] extends CustomOperation<infer Shape, any> ? Shape : never;
};

declare type CustomProvider = (typeof CustomProviders)[number];

/**
 * The subset of auth providers that can facilitate `custom` auth.
 */
declare const CustomProviders: readonly ["function"];

export declare type CustomQueries<Schema extends Record<any, any>, Context extends ContextType = 'CLIENT', ModelMeta extends Record<any, any> = ExtractModelMeta<Schema>> = CustomOperations<Schema, 'Query', Context, ModelMeta>;

declare type CustomReturnType = RefType<any> | CustomType<any>;

/**
 * Generates flattened, readonly return type using specified custom sel. set
 */
declare type CustomSelectionSetReturnValue<FlatModel extends Model, Paths extends string> = Prettify<DeepReadOnlyObject<RestoreArrays<UnionToIntersection<DeepPickFromPath<FlatModel, Paths>>, FlatModel>>>;

declare type CustomType<T extends CustomTypeParamShape> = T & Brand<'customType'>;

declare function customType<T extends CustomTypeFields>(fields: T): CustomType<{
    fields: T;
}>;

/**
 * Custom Types
 *
 * can be defined in-line to strongly type object types
 *
 */
declare type CustomTypeAllowedModifiers = 'authorization' | 'array' | 'required';

declare type CustomTypeFields = Record<string, ModelField<ModelFieldTypeParamOuter, CustomTypeAllowedModifiers, any> | RefType<any, any, any> | EnumType<EnumTypeParamShape> | CustomType<CustomTypeParamShape>>;

declare type CustomTypeParamShape = {
    fields: CustomTypeFields;
};

declare type DatasourceConfig<DE extends DatasourceEngine> = DE extends 'dynamodb' ? {
    engine: DE;
} : {
    engine: DE;
    hostname: BackendSecret;
    username: BackendSecret;
    password: BackendSecret;
    port: BackendSecret;
    databaseName: BackendSecret;
    vpcConfig?: Record<string, never>;
};

declare type DatasourceEngine = 'mysql' | 'postgresql' | 'dynamodb';

declare const dataSymbol: unique symbol;

/**
 * A date scalar type that is represented server-side as an extended ISO 8601 date string in the format `YYYY-MM-DD`.
 * @returns date field definition
 */
declare function date(): ModelField<Nullable<string>>;

/**
 * A date time scalar type that is represented server-side as an extended ISO 8601 date and time string in the format `YYYY-MM-DDThh:mm:ss.sssZ`.
 * @returns datetime field definition
 */
declare function datetime(): ModelField<Nullable<string>>;

export declare type Debug<T> = {
    [K in keyof T]: T[K];
};

/**
 * Picks object properties that match provided dot-separated Path
 *
 * @typeParam FlatModel
 * @typeParam Path - string union of dot-separated paths
 *
 * @returns union of object slices
 *
 * @example
 * ### Given
 * ```ts
 * FlatModel = {
 title: string;
 description?: string | null;
 comments: {
 content: string;
 readonly id: string;
 readonly createdAt: string;
 readonly updatedAt: string;
 }[];
 readonly id: string;
 readonly createdAt: string;
 readonly updatedAt: string;
 }

 Path = 'title' | 'comments.id' | 'comments.content'
 * ```
 * ### Returns
 * ```ts
 * { title: string } | { comments: { id: string} } | { comments: { content: string} }
 * ```
 *
 * @privateRemarks
 *
 * Intersections on arrays have unexpected behavior in TypeScript:
 * see: https://github.com/microsoft/TypeScript/issues/41874 and https://github.com/microsoft/TypeScript/issues/39693
 *
 * To work around this limitation, DeepPickFromPath flattens Arrays of Models (e.g. { comments: { id: string}[] } => { comments: { id: string} })
 * Arrays are then restored downstream in RestoreArrays
 */
declare type DeepPickFromPath<FlatModel extends Model, Path extends string> = FlatModel extends undefined ? DeepPickFromPath<NonNullable<FlatModel>, Path> | undefined : FlatModel extends null ? DeepPickFromPath<NonNullable<FlatModel>, Path> | null : FlatModel extends any[] ? DeepPickFromPath<UnwrapArray<FlatModel>, Path> : Path extends `${infer Head}.${infer Tail}` ? Head extends keyof FlatModel ? Tail extends '*' ? {
    [k in Head]: NonRelationalFields<UnwrapArray<FlatModel[Head]>>;
} : {
    [k in Head]: DeepPickFromPath<FlatModel[Head], Tail>;
} : never : Path extends keyof FlatModel ? {
    [K in Path]: FlatModel[Path];
} : never;

export declare type DeepReadOnlyObject<T> = T extends Array<infer U> ? DeepReadOnlyObject<U>[] : T extends Record<any, any> ? {
    readonly [k in keyof T]: DeepReadOnlyObject<T[k]>;
} : T;

declare type DefaultIdentifierFields = {
    readonly id: string;
};

declare type DefaultTimestampFields = {
    readonly createdAt: string;
    readonly updatedAt: string;
};

export declare type DefineFunction = ConstructFactory<ResourceProvider<FunctionResources> & ResourceAccessAcceptorFactory>;

declare type Denormalized<Schema extends Record<any, any>, Identifiers extends Record<string, {
    identifier: string;
}>> = {
    [ModelName in keyof Schema]: {
        [FieldName in keyof Schema[ModelName]]: {
            model: ModelName;
            identifier: IdentifierFields_2<Identifiers, ModelName>;
            field: FieldName;
            type: Schema[ModelName][FieldName];
        } & RelatedModelFields<Schema[ModelName][FieldName], Identifiers>;
    }[keyof Schema[ModelName]];
}[keyof Schema];

/**
 * references IAmplifyGraphqlDefinition from:
 * https://github.com/aws-amplify/amplify-category-api/blob/4c0ea253a0bae51f775383929ba4748593185bc1/packages/amplify-graphql-api-construct/src/types.ts#L491-L503
 *
 * function slots is any'd for now. Will add actual type when we add support for this feature
 */
export declare interface DerivedApiDefinition {
    /**
     * Return the schema definition as a graphql string, with amplify directives allowed.
     * @returns the rendered schema.
     */
    readonly schema: string;
    /**
     * Retrieve any function slots defined explicitly in the Api definition.
     * @returns generated function slots
     */
    readonly functionSlots: any[];
    readonly jsFunctions: JsResolver[];
    readonly lambdaFunctions: LambdaFunctionDefinition;
    readonly functionSchemaAccess: FunctionSchemaAccess[];
}

export declare type DerivedModelSchema = {
    data: {
        types: object;
    };
    transform: () => DerivedApiDefinition;
};

/**
 * An email scalar type that is represented server-side in the format `local-part@domain-part` as defined by RFC 822.
 * @returns email field definition
 */
declare function email(): ModelField<Nullable<string>>;

declare type EnumType<T extends EnumTypeParamShape> = T & Brand<'enum'>;

/**
 * this type param pattern allows us to infer literal type values from the array without using the `as const` suffix
 */
declare function enumType<Value extends string, T extends readonly Value[]>(values: T): EnumType<EnumTypeArgFactory<T>>;

declare type EnumTypeArgFactory<Values extends readonly string[]> = {
    type: 'enum';
    values: Values;
};

declare type EnumTypeParamShape = {
    type: 'enum';
    values: readonly string[];
};

/**
 * The utility type that is used to infer the type (interface) of the generated
 * `client.enums` property.
 *
 * @example
 * // The schema:
 * {
 *   TodoStatus: a.enum(['Planned' | 'InProgress' | 'Completed']),
 * }
 *
 * // The inferred interface of the `client.enums`:
 * {
 *   TodoStatus: {
 *     values: () => Array<'Planned' | 'InProgress' | 'Completed'>;
 *   }
 * }
 */
export declare type EnumTypes<Schema extends Record<any, any>, ModelMeta extends Record<any, any> = ExtractModelMeta<Schema>> = {
    [EnumName in keyof ModelMeta['enums']]: {
        values: () => Array<ModelMeta['enums'][EnumName]>;
    };
};

export declare type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

/**
 * @typeParam U - Union Type
 * @returns Union of non-empty types
 *
 * @example
 * ExcludeEmpty<{a: 1} | {} | {b: 2}> => {a: 1} | {b: 2}
 */
export declare type ExcludeEmpty<U> = U extends U ? object extends U ? never : U : never;

export declare type Expect<T extends true> = T;

export declare type ExpectFalse<T extends false> = T;

export declare type ExpectTrue<T extends true> = T;

/**
 * Extract all implicit non-model types a `FieldName: Field` map recursively,
 * and store them in a flat map. The keys are serialized property path.
 *
 * For example, with the following schema structure:
 * ```
 * ExtractAndFlattenImplicitNonModelTypesFromFields<
 *   'Post',
 *   {
 *     content: string,
 *     status: enum(['reviewing'], ['published']),
 *     meta: customType({
 *       tag: enum(['internal', 'external']),
 *       views: number
 *     }),
 *     tag: ref('SomeExplicitEnum'),
 *   }
 * >
 * ```
 * It generates the result as:
 * ```
 * {
 *   PostStatus: enum(['reviewing'], ['published']),
 *   PostMeta: customType({
 *     tag: enum(['internal', 'external']),
 *     views: number
 *   }),
 *   PostMetaTag: enum(['internal', 'external']),
 * }
 * ```
 */
declare type ExtractAndFlattenImplicitNonModelTypesFromFields<ParentTypeName extends string, Fields> = {
    [FieldProp in keyof Fields as Fields[FieldProp] extends EnumType<EnumTypeParamShape> | CustomType<CustomTypeParamShape> ? FieldProp : never]: (x: NonNullable<Fields[FieldProp]> extends infer FieldType ? FieldType extends EnumType<EnumTypeParamShape> ? {
        [Key in `${ParentTypeName}${Capitalize<FieldProp & string>}`]: Fields[FieldProp];
    } : FieldType extends CustomType<infer CustomTypeShape extends CustomTypeParamShape> ? // recursively extract to the Nested CustomType, and return the
    ExtractAndFlattenImplicitNonModelTypesFromFields<`${ParentTypeName}${Capitalize<FieldProp & string>}`, CustomTypeShape['fields']> & {
        [Key in `${ParentTypeName}${Capitalize<FieldProp & string>}`]: Fields[FieldProp];
    } : never : never) => void;
} extends Record<string, infer Func> ? Func extends (x: infer P) => void ? P : Record<never, never> : Record<never, never>;

/**
 * Pulls out implicit, i.e. field-level non-model types from `ModelType` and
 * `CustomType` which may contain deeply nested implicit (inline) non-model
 * types.
 */
declare type ExtractImplicitNonModelTypes<Schema, Targets = ModelAndCustomTypes<SchemaTypes<Schema>>> = UnionToIntersection<{
    [Model in keyof Targets]: Targets[Model] extends CustomType<infer R extends CustomTypeParamShape> ? // extract nested non-model types from it, and include itself
    ExtractAndFlattenImplicitNonModelTypesFromFields<Capitalize<Model & string>, R['fields']> & {
        [key in Model]: Targets[Model];
    } : Targets[Model] extends ModelType<infer R extends ModelTypeParamShape, any> ? ExtractAndFlattenImplicitNonModelTypesFromFields<Capitalize<Model & string>, R['fields']> : Targets[Model];
}[keyof Targets]>;

declare type ExtractModelIdentifier<ModelName, IdentifierMeta> = ModelName extends keyof IdentifierMeta ? IdentifierMeta[ModelName] : never;

export declare type ExtractModelMeta<T extends Record<any, any>> = T[typeof __modelMeta__];

declare type ExtractNonModelTypes<Schema> = ResolveNonModelFields<ResolveNonModelTypes<Schema, ExtractImplicitNonModelTypes<Schema>>>;

declare type ExtractNonNullableFieldsToRequiredFields<Fields> = {
    [FieldProp in keyof Fields as null extends Fields[FieldProp] ? never : FieldProp]: null extends Fields[FieldProp] ? never : Fields[FieldProp];
};

declare type ExtractNullableFieldsToOptionalFields<Fields> = Partial<{
    [FieldProp in keyof Fields as null extends Fields[FieldProp] ? FieldProp : never]: null extends Fields[FieldProp] ? Fields[FieldProp] : never;
}>;

declare type ExtractType<T extends ModelTypeParamShape> = {
    [FieldProp in keyof T['fields'] as T['fields'][FieldProp] extends ModelField<any, any> ? FieldProp : never]: T['fields'][FieldProp] extends ModelField<infer R, any> ? R : never;
};

declare function fcn(fn: FunctionHandlerData): FunctionHandler;

/**
 * @returns true if a string union `ExplicitFieldNames` contains a given string `FieldName`
 */
declare type FieldExists<ExplicitFieldNames extends string, FieldName extends string> = Extract<ExplicitFieldNames, FieldName> extends never ? false : true;

/**
 * Resolves field types
 *
 * Non-model types are replaced with Refs. Refs remain and are resolved in ResolveFieldProperties.ts
 */
declare type FieldTypes<T> = {
    [ModelProp in keyof T]: {
        [FieldProp in keyof T[ModelProp]]: T[ModelProp][FieldProp] extends ModelField<infer R, any, any> ? R : T[ModelProp][FieldProp] extends RefType<infer R extends RefTypeParamShape, any, any> ? R['valueRequired'] extends true ? T[ModelProp][FieldProp] : T[ModelProp][FieldProp] | null : T[ModelProp][FieldProp] extends EnumType<EnumTypeParamShape> | CustomType<CustomTypeParamShape> ? RefType<{
            link: `${Capitalize<ModelProp & string>}${Capitalize<FieldProp & string>}`;
            type: 'ref';
            valueRequired: false;
            array: false;
            arrayRequired: false;
            authorization: [];
        }> | null : T[ModelProp][FieldProp] extends ModelRelationalField<infer R, string, RelationTypeFunctionOmitMapping<ModelRelationshipTypes>, any> ? R : never;
    };
};

/**
 * Resolves field types for a CustomType.
 *
 * This utility type is needed in addition to the `FieldTypes` utility type as
 * without checking `ModelRelationalField` can improve ~5% on resolving performance.
 *
 * Non-model types are replaced with Refs. Refs remain and are resolved in ResolveFieldProperties.ts
 */
declare type FieldTypesOfCustomType<T> = {
    [CustomTypeName in keyof T]: {
        [FieldProp in keyof T[CustomTypeName]]: T[CustomTypeName][FieldProp] extends ModelField<infer R, any, any> ? R : T[CustomTypeName][FieldProp] extends RefType<infer R extends RefTypeParamShape, any, any> ? R['valueRequired'] extends true ? T[CustomTypeName][FieldProp] : T[CustomTypeName][FieldProp] | null : T[CustomTypeName][FieldProp] extends EnumType<EnumTypeParamShape> | CustomType<CustomTypeParamShape> ? RefType<{
            link: `${Capitalize<CustomTypeName & string>}${Capitalize<FieldProp & string>}`;
            type: 'ref';
            valueRequired: false;
            array: false;
            arrayRequired: false;
            authorization: [];
        }> | null : never;
    };
};

declare type FieldWithRelationship = {
    model: string;
    identifier: string;
    field: string;
    relatedModel: string;
    relatedModelIdentifier: string;
    relationName: string | undefined;
};

declare type FilterFieldTypes<Schema> = {
    [ModelProp in keyof Schema]: {
        [FieldProp in keyof Schema[ModelProp] as Schema[ModelProp][FieldProp] extends undefined ? never : FieldProp]: Schema[ModelProp][FieldProp];
    };
};

declare type FKName<Model extends string, Field extends string, Identifier extends string> = `${Uncapitalize<Model>}${Capitalize<Field>}${Capitalize<Identifier>}`;

/**
 * A float scalar type following represented server-side as an IEEE 754 floating point value.
 * @returns float field definition
 */
declare function float(): ModelField<Nullable<number>>;

declare type FunctionHandler = {
    [dataSymbol]: FunctionHandlerData;
} & Brand<typeof functionHandlerBrand>;

declare const functionHandlerBrand = "functionHandler";

declare type FunctionHandlerData = DefineFunction | string;

export declare type FunctionSchemaAccess = {
    resourceProvider: DefineFunction;
    actions: ('query' | 'mutate' | 'listen')[];
};

/**
 * @returns union of explicitly defined field names for a model
 */
declare type GetModelFieldNames<FlatModel> = FlatModel extends Record<infer R, any> ? R : never;

declare type GetRelationshipRef<T, RM extends keyof T, TypeArg extends ModelRelationalFieldParamShape, Flat extends boolean, ResolvedModel = ResolveRelationalFieldsForModel<T, RM, Flat>, Model = TypeArg['valueRequired'] extends true ? ResolvedModel : ResolvedModel | null | undefined> = LazyLoader<Model, TypeArg['array']>;

declare type GetRequiredFields<T> = {
    [FieldProp in keyof T as T[FieldProp] extends NonNullable<T[FieldProp]> ? FieldProp : never]: T[FieldProp];
};

/**
 * See: https://spec.graphql.org/draft/#sec-Errors
 */
export declare interface GraphQLFormattedError {
    /**
     * A short, human-readable summary of the problem that **SHOULD NOT** change
     * from occurrence to occurrence of the problem, except for purposes of
     * localization.
     */
    readonly message: string;
    /**
     * The AppSync exception category. Indicates the source of the error.
     */
    readonly errorType: string;
    /**
     * Additional error metadata that can be surfaced via error handling resolver utils:
     * * JS - https://docs.aws.amazon.com/appsync/latest/devguide/built-in-util-js.html#utility-helpers-in-error-js
     * * VTL - https://docs.aws.amazon.com/appsync/latest/devguide/utility-helpers-in-util.html#utility-helpers-in-error
     */
    readonly errorInfo: null | {
        [key: string]: unknown;
    };
    /**
     * If an error can be associated to a particular point in the requested
     * GraphQL document, it should contain a list of locations.
     */
    readonly locations?: ReadonlyArray<SourceLocation>;
    /**
     * If an error can be associated to a particular field in the GraphQL result,
     * it _must_ contain an entry with the key `path` that details the path of
     * the response field which experienced the error. This allows clients to
     * identify whether a null result is intentional or caused by a runtime error.
     */
    readonly path?: ReadonlyArray<string | number>;
    /**
     * Reserved for implementors to extend the protocol however they see fit,
     * and hence there are no additional restrictions on its contents.
     */
    readonly extensions?: {
        [key: string]: unknown;
    };
}

declare type GroupProvider = (typeof GroupProviders)[number];

/**
 * The subset of auth providers that can facilitate `group` auth.
 */
declare const GroupProviders: readonly ["userPools", "oidc"];

declare const handler: {
    inlineSql: typeof inlineSql;
    sqlReference: typeof sqlReference;
    custom: typeof custom;
    function: typeof fcn;
};

declare type HandlerInputType = FunctionHandler[] | CustomHandler[] | HandlerType;

declare type HandlerType = InlineSqlHandler | SqlReferenceHandler | CustomHandler | FunctionHandler;

export declare type HasKey<Obj extends Record<string, any>, Key extends string> = Key extends keyof Obj ? true : false;

/**
 * Create a one-directional one-to-many relationship between two models using the `hasMany()` method.
 * @param relatedModel the name of the related model
 * @returns a one-to-many relationship definition
 */
declare function hasMany<RM extends string>(relatedModel: RM): ModelRelationalField<ModelRelationalTypeArgFactory<RM, ModelRelationshipTypes.hasMany, true, undefined>, RM, "required", undefined>;

declare type HasMany_Model_Keys<Schema extends Record<any, any>, RelDef> = RelDef extends FieldWithRelationship ? {
    [IDField in RelDef['identifier'] as FKName<RelDef['model'], RelDef['field'], IDField>]?: IDField extends keyof Schema[RelDef['model']] ? Schema[RelDef['model']][IDField] : string;
} : never;

/**
 * Create a one-directional one-to-one relationship between two models using the `hasOne("MODEL_NAME")` method.
 * A hasOne relationship always uses a reference to the related model's identifier. Typically this is the `id` field
 * unless overwritten with the `identifier()` method.
 * @param relatedModel the name of the related model
 * @returns a one-to-one relationship definition
 */
declare function hasOne<RM extends string>(relatedModel: RM): ModelRelationalField<ModelRelationalTypeArgFactory<RM, ModelRelationshipTypes.hasOne, false, undefined>, RM, "valueRequired" | "arrayRequired", undefined>;

declare type HasOne_Model_Keys<Schema extends Record<any, any>, RelDef> = RelDef extends FieldWithRelationship ? {
    [IDField in RelDef['relatedModelIdentifier'] as FKName<RelDef['model'], RelDef['field'], IDField>]?: IDField extends keyof Schema[RelDef['relatedModel']] ? Schema[RelDef['relatedModel']][IDField] : string;
} : never;

/**
 * A unique identifier scalar type. This scalar is serialized like a String but isn't meant to be human-readable.
 * If not specified on create operations, a ULID will be auto-generated service-side.
 * @returns ID field definition
 */
declare function id(): ModelField<Nullable<string>>;

declare type IdentifierFields<T extends ModelTypeParamShape> = keyof IdentifierMap<T> & string;

declare type IdentifierFields_2<Identifiers extends Record<string, {
    identifier: string;
}>, ModelName> = ModelName extends keyof Identifiers ? Identifiers[ModelName]['identifier'] : 'id';

declare type IdentifierMap<T extends ModelTypeParamShape> = GetRequiredFields<ExtractType<T>>;

declare type IdentifierType<T extends ModelTypeParamShape, Fields extends string = IdentifierFields<T>> = Array<Fields>;

/**
 * Specifies a property of the identity JWT to use in place of `sub::username`
 * as the value to match against the owner field for authorization.
 *
 * @param this Authorization object to operate against.
 * @param property A property of identity JWT.
 * @returns A copy of the Authorization object with the claim attached.
 */
declare function identityClaim<SELF extends Authorization<any, any, any>>(this: SELF, property: string): Omit<SELF, "identityClaim">;

declare type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;

/**
 * Generate Record type containing all implicit fields for a given model
 */
declare type ImplicitFields<FlatModel, Identifier, ModelFieldNames = GetModelFieldNames<FlatModel>> = {
    [ImplicitField in keyof InitialImplicitFields<Identifier> as FieldExists<ModelFieldNames & string, ImplicitField & string> extends true ? never : ImplicitField]: InitialImplicitFields<Identifier>[ImplicitField];
};

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
declare type ImpliedAuthField<T extends Authorization<any, any, any>> = T extends Authorization<infer _Strat, infer Field, infer isMulti> ? Field extends undefined ? never : Field extends string ? isMulti extends true ? {
    [K in Field]?: string[];
} : {
    [K in Field]?: string;
} : never : never;

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
declare type ImpliedAuthFields<T extends Authorization<any, any, any>> = ImpliedAuthField<T> extends never ? never : UnionToIntersection<ImpliedAuthField<T>>;

declare type ImpliedAuthFieldsFromFields<T> = UnionToIntersection<T extends ModelTypeParamShape ? T['fields'][keyof T['fields']] extends ModelField<any, any, infer Auth> | ModelRelationalField<any, any, any, infer Auth> | RefType<any, any, infer Auth> ? Auth extends Authorization<any, any, any> ? ImpliedAuthFields<Auth> : object : object : object>;

declare type ImpliedFKs<ResolvedSchema, Identifiers extends Record<string, {
    identifier: string;
}>, ModelName, Schema extends Record<any, any> = ResolvedSchema extends ResolveSchema<any> ? ResolvedSchema : object, DenormalizedSchema = Denormalized<Schema, Identifiers>, HasMany_Model = Extract<DenormalizedSchema, {
    relatedModel: ModelName;
    relationshipType: ModelRelationshipTypes.hasMany;
}>, HasOne_Model = Extract<DenormalizedSchema, {
    model: ModelName;
    relationshipType: ModelRelationshipTypes.hasOne;
}>, Model_BelongsTo = Exclude<Extract<DenormalizedSchema, {
    model: ModelName;
    relationshipType: ModelRelationshipTypes.belongsTo;
}>, ImpliedHasManyBelongsTos<HasMany_Model>>, ManyToManys = Extract<DenormalizedSchema, {
    relationName: ModelName;
    relationshipType: ModelRelationshipTypes.manyToMany;
}>, InferredFields = HasMany_Model_Keys<Schema, HasMany_Model> | HasOne_Model_Keys<Schema, HasOne_Model> | Model_BelongsTo_Keys<Schema, Model_BelongsTo> | ManyToManyKeys<Schema, ManyToManys>> = unknown extends UnionToIntersection<InferredFields> ? never : UnionToIntersection<InferredFields>;

/**
 * I.e., creates a "matcher" to identify the belongsTo entries that correspond with
 * the given hasMany relationship.
 *
 * The `belongsTo` side of these relationships can be ignored. The FK comes from the
 * `hasMany` side of the relationship.
 */
declare type ImpliedHasManyBelongsTos<Relationship> = Relationship extends FieldWithRelationship ? {
    model: Relationship['relatedModel'];
} : never;

declare type IndexQueryMethodsFromIR<SecondaryIdxTuple extends SecondaryIndexIrShape[], Model extends Record<string, unknown>, Res = unknown> = SecondaryIdxTuple extends [
infer A extends SecondaryIndexIrShape,
...infer B extends SecondaryIndexIrShape[]
] ? IndexQueryMethodsFromIR<B, Model, IndexQueryMethodSignature<A, Model> & Res> : Res;

declare type IndexQueryMethodSignature<Idx extends SecondaryIndexIrShape, Model extends Record<string, unknown>> = {
    [K in Idx['queryField'] & string]: <FlatModel extends Record<string, unknown> = ResolvedModel<Model>, SelectionSet extends ReadonlyArray<ModelPath<FlatModel>> = never[]>(input: Idx['pk'] & {
        [SKField in keyof Idx['sk']]+?: string extends Idx['sk'][SKField] ? StringFilter : NumericFilter;
    }, options?: {
        filter?: ModelFilter<Model>;
        limit?: number;
        nextToken?: string | null;
        selectionSet?: SelectionSet;
        authMode?: AuthMode;
        authToken?: string;
        headers?: CustomHeaders;
    }) => ListReturnValue<Prettify<ReturnValue<Model, FlatModel, SelectionSet>>>;
};

declare function inField<SELF extends Authorization<any, any, any>, Field extends string>(this: SELF, field: Field): BuilderMethods<Omit<SELF, "inField">> & Authorization<SELF[typeof __data]["strategy"], Field, SELF[typeof __data]["multiOwner"]>;

declare type InitialImplicitFields<Identifier> = Identifier extends 'id' ? DefaultIdentifierFields & DefaultTimestampFields : DefaultTimestampFields;

/**
 * @returns intersection of explicit and implicit model fields
 */
declare type InjectDefaultFieldsForModel<FlatModel, ModelIdentifier> = FlatModel & ImplicitFields<FlatModel, 'identifier' extends keyof ModelIdentifier ? ModelIdentifier['identifier'] : never>;

/**
 * Mapped type that injects default implicit fields for a model
 * 1. Add "id" field to models with neither an explicit field named "id" nor a custom identifier (`.identifier(['some-field'])`)
 * 2. Add default timestamp fields ("createdAt", "updatedAt") unless they're already explicitly defined
 *
 * @typeParam FlattenedSchema - resolved schema type (TODO: add detail/example/link to type)
 */
declare type InjectImplicitModelFields<FlattenedSchema, IdentifierMeta> = {
    [ModelName in keyof FlattenedSchema]: InjectDefaultFieldsForModel<FlattenedSchema[ModelName], ModelName extends keyof IdentifierMeta ? IdentifierMeta[ModelName] : object>;
};

declare function inlineSql(sql: string): InlineSqlHandler;

declare const inlineSqlBrand = "inlineSql";

declare type InlineSqlHandler = {
    [dataSymbol]: string;
} & Brand<typeof inlineSqlBrand>;

/**
 * An integer scalar type with a supported value range between -(2^31) and 2^31-1.
 * @returns integer field definition
 */
declare function integer(): ModelField<Nullable<number>>;

/**
 * Types for unwrapping generic type args into client-consumable types
 *
 * @typeParam Schema - Type Beast schema type
 *
 * The following params are used solely as variables in order to simplify mapped type usage.
 * They should not receive external type args.
 *
 * @internal @typeParam NonModelTypes - Custom Types, Enums, and Custom Operations
 * @internal @typeParam ResolvedSchema - Schema/Models/Fields structure with generic type args extracted
 * @internal @typeParam ResolvedFields - Resovled client-facing types used for CRUDL response shapes
 * @internal @typeParam IdentifierMeta - Map of model primary index metadata
 * @internal @typeParam SecondaryIndexes - Map of model secondary index metadata
 *
 * @internal @typeParam Meta - Stores schema metadata: identifier, relationship metadata;
 * used by `API.generateClient` to craft strongly typed mutation inputs; hidden from customer-facing types behind __modelMeta__ symbol
 *
 */
declare type InternalClientSchema<Schema extends ModelSchema<any, any>, NonModelTypes extends NonModelTypesShape = ExtractNonModelTypes<Schema>, ResolvedSchema = ResolveSchema<Schema>, ImplicitModels = CreateImplicitModelsFromRelations<ResolvedSchema>, ImplicitModelsIdentifierMeta = {
    [ImplicitModel in keyof ImplicitModels]: {
        identifier: 'id';
    };
}, ResolvedFields extends Record<string, unknown> = ResolveFieldProperties<Schema, NonModelTypes, ImplicitModels>, IdentifierMeta extends Record<string, any> = ModelIdentifier<SchemaTypes<Schema>>, SecondaryIndexes extends Record<string, any> = ModelSecondaryIndexes<SchemaTypes<Schema>>> = ResolvedFields & {
    [__modelMeta__]: IdentifierMeta & ImplicitModelsIdentifierMeta & SecondaryIndexes & RelationalMetadata<ResolvedSchema, ResolvedFields, IdentifierMeta> & NonModelTypes & ResolveCustomOperations<Schema, ResolvedFields, NonModelTypes>;
};

declare type Intersection<A = Record<never, never>, B = Record<never, never>, C = Record<never, never>, D = Record<never, never>> = A & B & C & D extends infer U ? {
    [P in keyof U]: U[P];
} : never;

/**
 * A valid IPv4 or IPv6 address scalar type. IPv4 addresses are expected in quad-dotted notation (123.12.34.56). IPv6 addresses
 * are expected in non-bracketed, colon-separated format (1a2b:3c4b:🔢4567). You can include an optional CIDR suffix (123.45.67.89/16)
 * to indicate subnet mask.
 * @returns IP address field definition
 */
declare function ipAddress(): ModelField<Nullable<string>>;

export declare type IsAny<T> = 0 extends 1 & T ? true : false;

export declare type IsEmptyStringOrNever<T extends string | never> = [T] extends [never] ? true : [T] extends [''] ? true : false;

export declare type IsFalse<T extends false> = T;

export declare type IsTrue<T extends true> = T;

declare type Json = null | string | number | boolean | object | any[];

/**
 * A JSON scalar type that is automatically parsed and loaded server-side as maps, lists, or scalar values
 * rather than as the literal input strings.
 * @returns JSON field definition
 */
declare function json(): ModelField<Nullable<Json>>;

export declare type JsResolver = {
    typeName: 'Mutation' | 'Query' | 'Subscription';
    fieldName: string;
    handlers: {
        dataSource: string;
        entry: JsResolverEntry;
    }[];
};

export declare type JsResolverEntry = string | {
    relativePath: string;
    importLine: string;
};

export declare type LambdaFunctionDefinition = Record<string, DefineFunction>;

export declare type LazyLoader<Model, IsArray extends boolean> = (options?: IsArray extends true ? {
    authMode?: AuthMode;
    authToken?: string;
    limit?: number;
    nextToken?: string | null;
    headers?: CustomHeaders;
} : {
    authMode?: AuthMode;
    authToken?: string;
    headers?: CustomHeaders;
}) => IsArray extends true ? ListReturnValue<Prettify<NonNullable<Model>>> : SingularReturnValue<Prettify<Model>>;

export declare type ListReturnValue<T> = Promise<{
    data: Array<T>;
    nextToken?: string | null;
    errors?: GraphQLFormattedError[];
    extensions?: {
        [key: string]: any;
    };
}>;

declare type LogicalFilters<Model extends Record<any, any>> = {
    and?: ModelFilter<Model> | ModelFilter<Model>[];
    or?: ModelFilter<Model> | ModelFilter<Model>[];
    not?: ModelFilter<Model>;
};

/**
 * Create a many-to-many relationship between two models with the manyToMany() method.
 * Provide a common relationName on both models to join them into a many-to-many relationship.
 * Under the hood a many-to-many relationship is modeled with a "join table" with corresponding
 * `hasMany()` relationships between the two related models. You must set the same `manyToMany()`
 * field on both models of the relationship.
 * @param relatedModel name of the related model
 * @param opts pass in the `relationName` that will serve as the join table name for this many-to-many relationship
 * @returns a many-to-many relationship definition
 */
declare function manyToMany<RM extends string, RN extends string>(relatedModel: RM, opts: {
    relationName: RN;
}): ModelRelationalField<ModelRelationalTypeArgFactory<RM, ModelRelationshipTypes.manyToMany, true, RN>, RM, "required" | "references", undefined>;

declare type ManyToManyKeys<Schema extends Record<any, any>, RelDef> = RelDef extends FieldWithRelationship ? {
    [IDField in RelDef['identifier'] as FKName<RelDef['model'], '', IDField>]?: IDField extends keyof Schema[RelDef['model']] ? Schema[RelDef['model']][IDField] : string;
} : never;

declare type MarkModelsNonNullableFieldsRequired<Schema> = {
    [ModelProp in keyof Schema]: ExtractNonNullableFieldsToRequiredFields<Schema[ModelProp]>;
};

declare type MarkModelsNullableFieldsOptional<Schema> = {
    [ModelProp in keyof Schema]: ExtractNullableFieldsToOptionalFields<Schema[ModelProp]>;
};

declare type Model = Record<string, any>;

/**
 * A data model that creates a matching Amazon DynamoDB table and provides create, read (list and get), update,
 * delete, and subscription APIs.
 *
 * @param fields database table fields. Supports scalar types and relationship types.
 * @returns a data model definition
 */
declare function model<T extends ModelFields>(fields: T): ModelType<{
    fields: T;
    identifier: Array<'id'>;
    secondaryIndexes: [];
    authorization: [];
}>;

declare type Model_BelongsTo_Keys<Schema extends Record<any, any>, RelDef> = RelDef extends FieldWithRelationship ? {
    [IDField in RelDef['relatedModelIdentifier'] as FKName<RelDef['model'], RelDef['field'], IDField>]?: IDField extends keyof Schema[RelDef['model']] ? Schema[RelDef['model']][IDField] : string;
} : never;

/**
 * Gets the collection of all ModelTypes and CustomTypes which are explicitly
 * defined in the schema.
 */
declare type ModelAndCustomTypes<Schema> = {
    [Model in keyof Schema as Schema[Model] extends EnumType<EnumTypeParamShape> | CustomOperation<CustomOperationParamShape, any> ? never : Model]: Schema[Model] extends ModelType<any, any> ? Schema[Model] : Schema[Model] extends CustomType<CustomTypeParamShape> ? Schema[Model] : never;
};

/**
 * Public API for the chainable builder methods exposed by Model Field.
 * The type is narrowing e.g., after calling .array() it will be omitted from intellisense suggestions
 *
 * @typeParam T - holds the JS data type of the field
 * @typeParam K - union of strings representing already-invoked method names. Used to improve Intellisense
 */
declare type ModelField<T extends ModelFieldTypeParamOuter, K extends keyof ModelField<T> = never, Auth = undefined> = Omit<{
    /**
     * Marks a field as required.
     */
    required(): ModelField<Required_2<T>, K | 'required'>;
    /**
     * Converts a field type definition to an array of the field type.
     */
    array(): ModelField<ArrayField<T>, Exclude<K, 'required'> | 'array'>;
    /**
     * Sets a default value for the scalar type.
     * @param value the default value
     */
    default(value: ModelFieldTypeParamOuter): ModelField<T, K | 'default'>;
    /**
     * Configures field-level authorization rules. Pass in an array of authorizations `(a.allow.____)` to mix and match
     * multiple authorization rules for this field.
     */
    authorization<AuthRuleType extends Authorization<any, any, any>>(rules: AuthRuleType[]): ModelField<T, K | 'authorization', AuthRuleType>;
}, K> & {
    [__auth]?: Auth;
} & Brand<typeof brandName>;

declare type ModelFields = Record<string, ModelField<any, any, any> | ModelRelationalField<any, string, any, any> | RefType<any, any, any> | EnumType<EnumTypeParamShape> | CustomType<CustomTypeParamShape>>;

declare type ModelFieldTypeParamInner = string | number | boolean | Date | Json | null;

declare type ModelFieldTypeParamOuter = ModelFieldTypeParamInner | Array<ModelFieldTypeParamInner> | null;

declare type ModelFilter<Model extends Record<any, any>> = LogicalFilters<Model> & {
    [K in keyof Model as Model[K] extends LazyLoader<any, any> ? never : K]?: Model[K] extends boolean ? BooleanFilters : Model[K] extends number ? NumericFilter : StringFilter;
};

declare type ModelIdentifier<T> = {
    [Property in keyof T]: T[Property] extends ModelType<infer R, any> ? R['identifier'] extends any[] ? {
        identifier: R['identifier'][number];
    } : never : never;
};

declare type ModelIdentifier_2<Model extends Record<any, any>> = Prettify<Record<Model['identifier'] & string, string>>;

declare type ModelImpliedAuthFields<Schema extends ModelSchema<any, any>> = {
    [ModelKey in keyof Schema['data']['types'] as Schema['data']['types'][ModelKey] extends EnumType<EnumTypeParamShape> ? never : Schema['data']['types'][ModelKey] extends CustomType<CustomTypeParamShape> ? never : Schema['data']['types'][ModelKey] extends CustomOperation<CustomOperationParamShape, any> ? never : ModelKey]: Schema['data']['types'][ModelKey] extends ModelType<infer Model, any> ? AllAuthFieldsForModel<Schema, Model> : object;
};

declare function modelIndex<ModelFieldKeys extends string, PK extends ModelFieldKeys, SK = readonly [], QueryField = never>(partitionKeyFieldName: PK): ModelIndexType<ModelFieldKeys, PK, SK, QueryField, never>;

declare type ModelIndexType<ModelFieldKeys extends string, PK, SK = readonly [], QueryField = never, K extends keyof ModelIndexType<any, any, any, any> = never> = Omit<{
    sortKeys<FieldKeys extends ModelFieldKeys = ModelFieldKeys, const SK extends ReadonlyArray<Exclude<FieldKeys, PK>> = readonly []>(sortKeys: SK): ModelIndexType<FieldKeys, PK, SK, QueryField, K | 'sortKeys'>;
    name(name: string): ModelIndexType<ModelFieldKeys, PK, SK, QueryField, K | 'name'>;
    queryField<QF extends string = never, MF extends ModelFieldKeys = ModelFieldKeys>(field: QF): ModelIndexType<MF, PK, SK, QF, K | 'queryField'>;
}, K> & Brand<typeof brandName_5>;

declare type ModelIndexTypeShape = ModelIndexType<any, any, any, any, any>;

declare type ModelMetaShape = {
    secondaryIndexes: SecondaryIndexIrShape[];
    identifier: string[];
};

/**
 * Generates custom selection set type with up to 6 levels of nested fields
 *
 * @returns string[] where each string is a field in the model
 * recurses over nested objects - such as relationships and custom types - generating a `field.*` type value to select all fields in that nested type,
 * as well as a dot-delimited set of fields for fine-grained selection of particular fields in the nested type (see example below)
 *
 * @example
 * ```ts
 * FlatModel = {
 *   id: string
 *   title: string
 *   comments: {
 *     id:: string
 *     content: string
 *   }[]
 * }
 *```
 *
 * ### Result
 * ```
 * 'id' | 'title' | 'comments.*' | 'comments.id' | 'comments.content'
 * ```
 *
 * @privateRemarks
 *
 * explicit recursion depth pattern ref: https://github.com/microsoft/TypeScript/blob/main/src/lib/es2019.array.d.ts#L1-L5
 *
 * this pattern puts an upper bound on the levels of recursion in our mapped type
 *
 * it guards against infinite recursion when generating the selection set type for deeply-nested models
 * and especially for bi-directional relationships which are infinitely recursable by their nature
 *
 */
export declare type ModelPath<FlatModel extends Record<string, unknown>, Depth extends number = 5, // think of this as the initialization expr. in a for loop (e.g. `let depth = 5`)
RecursionLoop extends number[] = [-1, 0, 1, 2, 3, 4], Field = keyof FlatModel> = {
    done: Field extends string ? `${Field}.*` : never;
    recur: Field extends string ? NonNullable<UnwrapArray<FlatModel[Field]>> extends Record<string, unknown> ? `${Field}.${ModelPath<NonNullable<UnwrapArray<FlatModel[Field]>>, RecursionLoop[Depth]>}` | `${Field}.*` : `${Field}` : never;
}[Depth extends -1 ? 'done' : 'recur'];

declare type ModelRelationalField<T extends ModelRelationalFieldParamShape, RM extends string | symbol, K extends keyof ModelRelationalField<T, RM> = never, Auth = undefined> = Omit<ModelRelationalFieldFunctions<T, RM, K>, K> & {
    [__auth_2]?: Auth;
} & Brand<typeof brandName_2>;

declare type ModelRelationalFieldFunctions<T extends ModelRelationalFieldParamShape, RM extends string | symbol, K extends keyof ModelRelationalField<T, RM> = never> = {
    /**
     * When set, it requires the value of the relationship type to be required.
     */
    valueRequired(): ModelRelationalField<SetTypeSubArg<T, 'valueRequired', true>, K | 'valueRequired'>;
    /**
     * Reference sets the foreign key on which to establish the relationship
     */
    references(references: string[]): ModelRelationalField<SetTypeSubArg<T, 'references', string[]>, K | 'references'>;
    /**
     * When set, it requires the relationship to always return a value
     */
    required(): ModelRelationalField<SetTypeSubArg<T, 'arrayRequired', true>, K | 'required'>;
    /**
     * When set, it requires the relationship to always return an array value
     * @deprecated this modifier should not be used and will be removed
     * in the next minor version of this package.
     */
    arrayRequired(): ModelRelationalField<SetTypeSubArg<T, 'arrayRequired', true>, K | 'arrayRequired'>;
    /**
     * Configures field-level authorization rules. Pass in an array of authorizations `(a.allow.____)` to mix and match
     * multiple authorization rules for this field.
     */
    authorization<AuthRuleType extends Authorization<any, any, any>>(rules: AuthRuleType[]): ModelRelationalField<T, K | 'authorization', K, AuthRuleType>;
};

declare type ModelRelationalFieldParamShape = {
    type: 'model';
    relationshipType: string;
    relatedModel: string;
    array: boolean;
    valueRequired: boolean;
    references?: string[];
    arrayRequired: boolean;
    relationName?: string;
};

declare type ModelRelationalTypeArgFactory<RM extends string, RT extends RelationshipTypes, IsArray extends boolean, RelationName extends string | undefined = undefined> = {
    type: 'model';
    relatedModel: RM;
    relationshipType: RT;
    array: IsArray;
    valueRequired: false;
    arrayRequired: false;
    relationName: RelationName;
    references: string[];
};

declare enum ModelRelationshipTypes {
    hasOne = "hasOne",
    hasMany = "hasMany",
    belongsTo = "belongsTo",
    manyToMany = "manyToMany"
}

declare type ModelSchema<T extends ModelSchemaParamShape, UsedMethods extends 'authorization' = never> = Omit<{
    authorization: <AuthRules extends SchemaAuthorization<any, any, any>>(auth: AuthRules[]) => ModelSchema<SetTypeSubArg<T, 'authorization', AuthRules[]>, UsedMethods | 'authorization'>;
}, UsedMethods> & {
    data: T;
    models: {
        [TypeKey in keyof T['types']]: T['types'][TypeKey] extends ModelType<ModelTypeParamShape> ? SchemaModelType<T['types'][TypeKey]> : never;
    };
    transform: () => DerivedApiDefinition;
};

declare type ModelSchemaContents = Record<string, SchemaContent>;

declare type ModelSchemaParamShape = {
    types: ModelSchemaContents;
    authorization: SchemaAuthorization<any, any, any>[];
    configuration: SchemaConfig<any, any>;
};

declare type ModelSecondaryIndexes<T> = {
    [Property in keyof T]: T[Property] extends ModelType<infer R, any> ? R['secondaryIndexes'] extends any[] ? {
        secondaryIndexes: R['secondaryIndexes'];
    } : never : never;
};

declare type ModelType<T extends ModelTypeParamShape, K extends keyof ModelType<T> = never> = Omit<{
    identifier<ID extends IdentifierType<T> = []>(identifier: ID): ModelType<SetTypeSubArg<T, 'identifier', ID>, K | 'identifier'>;
    secondaryIndexes<const Indexes extends readonly ModelIndexType<SecondaryIndexFields<ExtractType<T>>, SecondaryIndexFields<ExtractType<T>>, unknown, never, any>[] = readonly [], const IndexesIR extends readonly any[] = SecondaryIndexToIR<Indexes, ExtractType<T>>>(indexes: Indexes): ModelType<SetTypeSubArg<T, 'secondaryIndexes', IndexesIR>, K | 'secondaryIndexes'>;
    authorization<AuthRuleType extends Authorization<any, any, any>>(rules: AuthRuleType[]): ModelType<SetTypeSubArg<T, 'authorization', AuthRuleType[]>, K | 'authorization'>;
}, K> & Brand<typeof brandName_4>;

declare type ModelTypeParamShape = {
    fields: ModelFields;
    identifier: string[];
    secondaryIndexes: ReadonlyArray<SecondaryIndexIrShape>;
    authorization: Authorization<any, any, any>[];
};

export declare type ModelTypes<Schema extends Record<any, any>, Context extends ContextType = 'CLIENT', ModelMeta extends Record<any, any> = ExtractModelMeta<Schema>> = {
    [ModelName in keyof Schema]: ModelName extends string ? Schema[ModelName] extends Record<string, unknown> ? Context extends 'CLIENT' ? ModelTypesClient<Schema[ModelName], ModelMeta[ModelName]> : Context extends 'COOKIES' ? ModelTypesSSRCookies<Schema[ModelName], ModelMeta[ModelName]> : Context extends 'REQUEST' ? ModelTypesSSRRequest<Schema[ModelName], ModelMeta[ModelName]> : never : never : never;
};

/**
 * Resolves model types
 *
 * Removes CustomTypes and Enums from resolved schema.
 * They are extracted separately in ExtractNonModelTypes.ts and
 * added to ModelMeta in ClientSchema.ts
 */
declare type ModelTypes_2<Schema> = {
    [Model in keyof Schema as Schema[Model] extends EnumType<EnumTypeParamShape> | CustomType<CustomTypeParamShape> | CustomOperation<CustomOperationParamShape, any> ? never : Model]: Schema[Model] extends ModelType<infer R, any> ? R['fields'] : never;
};

declare type ModelTypesClient<Model extends Record<string, unknown>, ModelMeta extends ModelMetaShape> = IndexQueryMethodsFromIR<ModelMeta['secondaryIndexes'], Model> & {
    create: (model: Prettify<CreateModelInput<Model, ModelMeta>>, options?: {
        authMode?: AuthMode;
        authToken?: string;
        headers?: CustomHeaders;
    }) => SingularReturnValue<Model>;
    update: (model: Prettify<ModelIdentifier_2<ModelMeta> & Partial<MutationInput<Model, ModelMeta>>>, options?: {
        authMode?: AuthMode;
        authToken?: string;
        headers?: CustomHeaders;
    }) => SingularReturnValue<Model>;
    delete: (identifier: ModelIdentifier_2<ModelMeta>, options?: {
        authMode?: AuthMode;
        authToken?: string;
        headers?: CustomHeaders;
    }) => SingularReturnValue<Model>;
    get<FlatModel extends Record<string, unknown> = ResolvedModel<Model>, SelectionSet extends ReadonlyArray<ModelPath<FlatModel>> = never[]>(identifier: ModelIdentifier_2<ModelMeta>, options?: {
        selectionSet?: SelectionSet;
        authMode?: AuthMode;
        authToken?: string;
        headers?: CustomHeaders;
    }): SingularReturnValue<Prettify<ReturnValue<Model, FlatModel, SelectionSet>>>;
    list<FlatModel extends Record<string, unknown> = ResolvedModel<Model>, SelectionSet extends ReadonlyArray<ModelPath<FlatModel>> = never[]>(options?: {
        filter?: ModelFilter<Model>;
        limit?: number;
        nextToken?: string | null;
        selectionSet?: SelectionSet;
        authMode?: AuthMode;
        authToken?: string;
        headers?: CustomHeaders;
    }): ListReturnValue<Prettify<ReturnValue<Model, FlatModel, SelectionSet>>>;
    onCreate<FlatModel extends Record<string, unknown> = ResolvedModel<Model>, SelectionSet extends ReadonlyArray<ModelPath<FlatModel>> = never[]>(options?: {
        filter?: ModelFilter<Model>;
        selectionSet?: SelectionSet;
        authMode?: AuthMode;
        authToken?: string;
        headers?: CustomHeaders;
    }): ObservedReturnValue<Prettify<ReturnValue<Model, FlatModel, SelectionSet>>>;
    onUpdate<FlatModel extends Record<string, unknown> = ResolvedModel<Model>, SelectionSet extends ReadonlyArray<ModelPath<FlatModel>> = never[]>(options?: {
        filter?: ModelFilter<Model>;
        selectionSet?: SelectionSet;
        authMode?: AuthMode;
        authToken?: string;
        headers?: CustomHeaders;
    }): ObservedReturnValue<Prettify<ReturnValue<Model, FlatModel, SelectionSet>>>;
    onDelete<FlatModel extends Record<string, unknown> = ResolvedModel<Model>, SelectionSet extends ReadonlyArray<ModelPath<FlatModel>> = never[]>(options?: {
        filter?: ModelFilter<Model>;
        selectionSet?: SelectionSet;
        authMode?: AuthMode;
        authToken?: string;
        headers?: CustomHeaders;
    }): ObservedReturnValue<Prettify<ReturnValue<Model, FlatModel, SelectionSet>>>;
    observeQuery<FlatModel extends Record<string, unknown> = ResolvedModel<Model>, SelectionSet extends ModelPath<FlatModel>[] = never[]>(options?: {
        filter?: ModelFilter<Model>;
        selectionSet?: SelectionSet;
        authMode?: AuthMode;
        authToken?: string;
    }): ObserveQueryReturnValue<Prettify<ReturnValue<Model, FlatModel, SelectionSet>>>;
};

declare type ModelTypesSSRCookies<Model extends Record<string, unknown>, ModelMeta extends ModelMetaShape> = IndexQueryMethodsFromIR<ModelMeta['secondaryIndexes'], Model> & {
    create: (model: Prettify<CreateModelInput<Model, ModelMeta>>, options?: {
        authMode?: AuthMode;
        authToken?: string;
        headers?: CustomHeaders;
    }) => SingularReturnValue<Model>;
    update: (model: Prettify<ModelIdentifier_2<ModelMeta> & Partial<MutationInput<Model, ModelMeta>>>, options?: {
        authMode?: AuthMode;
        authToken?: string;
        headers?: CustomHeaders;
    }) => SingularReturnValue<Model>;
    delete: (identifier: ModelIdentifier_2<ModelMeta>, options?: {
        authMode?: AuthMode;
        authToken?: string;
        headers?: CustomHeaders;
    }) => SingularReturnValue<Model>;
    get<FlatModel extends Record<string, unknown> = ResolvedModel<Model>, SelectionSet extends ReadonlyArray<ModelPath<FlatModel>> = never[]>(identifier: ModelIdentifier_2<ModelMeta>, options?: {
        selectionSet?: SelectionSet;
        authMode?: AuthMode;
        authToken?: string;
        headers?: CustomHeaders;
    }): SingularReturnValue<Prettify<ReturnValue<Model, FlatModel, SelectionSet>>>;
    list<FlatModel extends Record<string, unknown> = ResolvedModel<Model>, SelectionSet extends ReadonlyArray<ModelPath<FlatModel>> = never[]>(options?: {
        filter?: ModelFilter<Model>;
        limit?: number;
        nextToken?: string | null;
        selectionSet?: SelectionSet;
        authMode?: AuthMode;
        authToken?: string;
        headers?: CustomHeaders;
    }): ListReturnValue<Prettify<ReturnValue<Model, FlatModel, SelectionSet>>>;
};

declare type ModelTypesSSRRequest<Model extends Record<string, unknown>, ModelMeta extends ModelMetaShape> = IndexQueryMethodsFromIR<ModelMeta['secondaryIndexes'], Model> & {
    create: (contextSpec: any, model: Prettify<CreateModelInput<Model, ModelMeta>>, options?: {
        authMode?: AuthMode;
        authToken?: string;
        headers?: CustomHeaders;
    }) => SingularReturnValue<Model>;
    update: (contextSpec: any, model: Prettify<ModelIdentifier_2<ModelMeta> & Partial<MutationInput<Model, ModelMeta>>>, options?: {
        authMode?: AuthMode;
        authToken?: string;
        headers?: CustomHeaders;
    }) => SingularReturnValue<Model>;
    delete: (contextSpec: any, identifier: ModelIdentifier_2<ModelMeta>, options?: {
        authMode?: AuthMode;
        authToken?: string;
        headers?: CustomHeaders;
    }) => SingularReturnValue<Model>;
    get<FlatModel extends Record<string, unknown> = ResolvedModel<Model>, SelectionSet extends ReadonlyArray<ModelPath<FlatModel>> = never[]>(contextSpec: any, identifier: ModelIdentifier_2<ModelMeta>, options?: {
        selectionSet?: SelectionSet;
        authMode?: AuthMode;
        authToken?: string;
        headers?: CustomHeaders;
    }): SingularReturnValue<Prettify<ReturnValue<Model, FlatModel, SelectionSet>>>;
    list<FlatModel extends Record<string, unknown> = ResolvedModel<Model>, SelectionSet extends ReadonlyArray<ModelPath<FlatModel>> = never[]>(contextSpec: any, options?: {
        filter?: ModelFilter<Model>;
        limit?: number;
        nextToken?: string | null;
        selectionSet?: SelectionSet;
        authMode?: AuthMode;
        authToken?: string;
        headers?: CustomHeaders;
    }): ListReturnValue<Prettify<ReturnValue<Model, FlatModel, SelectionSet>>>;
};

declare function mutation(): CustomOperation<{
    arguments: CustomArguments;
    returnType: null;
    functionRef: null;
    authorization: [];
    typeName: 'Mutation';
    handlers: null;
}, never, typeof mutationBrand>;

declare const mutationBrand = "mutationCustomOperation";

/**
 * All required fields and relational fields, exclude readonly fields
 */
declare type MutationInput<Fields, ModelMeta extends Record<any, any>, RelationalFields = ModelMeta['relationalInputFields'], WritableFields = Pick<Fields, WritableKeys<Fields>>> = {
    [Prop in keyof WritableFields as WritableFields[Prop] extends (...args: any) => any ? never : Prop]: WritableFields[Prop];
} & RelationalFields;

declare type NonModelTypesShape = {
    enums: Record<string, EnumType<any>>;
    customTypes: Record<string, any>;
};

/**
 * Currently this omits any object-type fields. Update this when we add custom types/enums.
 */
declare type NonRelationalFields<M extends Model> = {
    [Field in keyof M as UnwrapArray<M[Field]> extends Record<string, unknown> ? never : Field]: M[Field];
};

declare type NormalizeInputFields<ModelFields, IdentifierMeta extends Record<string, any>> = Partial<Omit<ModelFields, IdentifierMeta['identifier']>> & Required<Pick<ModelFields, IdentifierMeta['identifier']>>;

export declare type NotAny<T> = true extends IsAny<T> ? false : true;

export declare type NotEqual<X, Y> = true extends Equal<X, Y> ? false : true;

/**
 * Field type arg mutators
 */
declare type Nullable<T> = T | null;

declare type NumericFilter = {
    attributeExists?: boolean;
    between?: [number, number];
    eq?: number;
    ge?: number;
    gt?: number;
    le?: number;
    lt?: number;
    ne?: number;
};

export declare type ObjectIsNonEmpty<T extends object> = keyof T extends never ? false : true;

export declare type ObservedReturnValue<T> = Observable<T>;

export declare type ObserveQueryReturnValue<T> = Observable<{
    items: T[];
    isSynced: boolean;
}>;

declare type Operation = (typeof Operations)[number];

/**
 * The operations that can be performed against an API.
 */
declare const Operations: readonly ["create", "update", "delete", "read", "get", "list", "sync", "listen", "search"];

/**
 * The subset of auth providers that can facilitate `owner` auth.
 */
declare const OwnerProviders: readonly ["userPools", "oidc"];

declare type OwnerProviders = (typeof OwnerProviders)[number];

/**
 * A phone number scalar type thas is stored as a string server-side. Phone numbers can contain either spaces
 * or hyphens to separate digit groups. Phone numbers without a country code are assumed to be US/North American numbers adhering
 * to the North American Numbering Plan.
 * @returns phone number field definition
 */
declare function phone(): ModelField<Nullable<string>>;

export declare type Prettify<T> = T extends (...args: infer ArgsType) => any ? (...args: ArgsType) => ReturnType<T> : T extends object ? {
    [P in keyof T]: Prettify<T[P]>;
} : T;

declare type PrivateProvider = (typeof PrivateProviders)[number];

/**
 * The subset of auth providers that can facilitate `private` auth.
 */
declare const PrivateProviders: readonly ["userPools", "oidc", "iam"];

declare type Provider = (typeof Providers)[number];

/**
 * All possible providers.
 *
 * This list should not be used if you need to restrict available providers
 * according to an auth strategcy. E.g., `public` auth can only be facilitated
 * by `apiKey` and `iam` providers.
 */
declare const Providers: readonly ["apiKey", "iam", "userPools", "oidc", "function"];

declare type PublicProvider = (typeof PublicProviders)[number];

/**
 * The subset of auth providers that can facilitate `public` auth.
 */
declare const PublicProviders: readonly ["apiKey", "iam"];

declare function query(): CustomOperation<{
    arguments: CustomArguments;
    returnType: null;
    functionRef: null;
    authorization: [];
    typeName: 'Query';
    handlers: null;
}, never, typeof queryBrand>;

declare const queryBrand = "queryCustomOperation";

/**
 * @typeParam SK - tuple of SortKey field names, e.g. ['viewCount', 'createdAt']
 * @typeParam StrStart - initial string value; expects capitalized Partition Key field name
 *
 * @returns Query field name: concatenated PascalCase string with an `And` separator
 * @example
 * QueryFieldLabelFromTuple<['viewCount', 'createdAt'], 'Title'> => 'TitleAndViewCountAndCreatedAt'
 */
declare type QueryFieldLabelFromTuple<SK, StrStart extends string = ''> = SK extends readonly [infer A extends string, ...infer B extends string[]] ? QueryFieldLabelFromTuple<B, `${StrStart}And${Capitalize<A>}`> : StrStart;

declare function ref<Value extends string, T extends Value>(link: T): RefType<RefTypeArgFactory<T>, never, undefined>;

declare type RefType<T extends RefTypeParamShape, K extends keyof RefType<T> = never, Auth = undefined> = Omit<{
    /**
     * Marks a field as required.
     */
    required(): RefType<SetTypeSubArg<T, T['array'] extends true ? 'arrayRequired' : 'valueRequired', true>, K | 'required'>;
    /**
     * Marks a field as an array of the specified ref type.
     */
    array(): RefType<SetTypeSubArg<T, 'array', true>, Exclude<K, 'required'> | 'array'>;
    /**
     * Configures field-level authorization rules. Pass in an array of authorizations `(a.allow.____)` to mix and match
     * multiple authorization rules for this field.
     */
    authorization<AuthRuleType extends Authorization<any, any, any>>(rules: AuthRuleType[]): RefType<T, K | 'authorization', AuthRuleType>;
}, K> & {
    [__auth]?: Auth;
} & Brand<typeof brandName_3>;

declare type RefTypeArgFactory<Link extends string> = {
    type: 'ref';
    link: Link;
    valueRequired: false;
    array: false;
    arrayRequired: false;
    authorization: [];
};

declare type RefTypeParamShape = {
    type: 'ref';
    link: string;
    valueRequired: boolean;
    array: boolean;
    arrayRequired: boolean;
    authorization: Authorization<any, any, any>[];
};

declare type RelatedModelFields<ModelField, Identifiers extends Record<string, {
    identifier: string;
}>> = ModelField extends ModelRelationalFieldParamShape ? {
    relatedModel: ModelField['relatedModel'];
    relationshipType: ModelField['relationshipType'];
    relationName: ModelField['relationName'];
    relatedModelIdentifier: IdentifierFields_2<Identifiers, ModelField['relatedModel']>;
} : {
    relatedModel: undefined;
    relationshipType: undefined;
    relationName: undefined;
    relatedModelIdentifier: never;
};

declare type RelationalMetadata<ResolvedSchema, ResolvedFields extends Record<string, unknown>, IdentifierMeta extends Record<string, any>> = UnionToIntersection<ExcludeEmpty<{
    [ModelName in keyof ResolvedSchema]: {
        [Field in keyof ResolvedSchema[ModelName] as ResolvedSchema[ModelName][Field] extends ModelRelationalFieldParamShape ? ResolvedSchema[ModelName][Field]['relationshipType'] extends 'hasOne' | 'belongsTo' ? ModelName : ResolvedSchema[ModelName][Field]['relationshipType'] extends 'manyToMany' ? ResolvedSchema[ModelName][Field]['relationName'] extends string ? ResolvedSchema[ModelName][Field]['relationName'] : never : never : never]: ResolvedSchema[ModelName][Field] extends ModelRelationalFieldParamShape ? ResolvedSchema[ModelName][Field] extends ModelRelationalFieldParamShape ? ResolvedSchema[ModelName][Field]['relationshipType'] extends 'manyToMany' | 'hasMany' ? {
            relationalInputFields: Partial<Record<`${Uncapitalize<ModelName & string>}`, NormalizeInputFields<ResolvedFields[ModelName & string], ExtractModelIdentifier<ModelName, IdentifierMeta>>>>;
        } : {
            relationalInputFields: Partial<Record<Field, NormalizeInputFields<ResolvedFields[ResolvedSchema[ModelName][Field]['relatedModel']], ExtractModelIdentifier<`${Capitalize<Field & string>}`, IdentifierMeta>>>>;
        } : never : never;
    };
}[keyof ResolvedSchema]>>;

declare type RelationshipTypes = `${ModelRelationshipTypes}`;

declare type RelationTypeFunctionOmitMapping<Type extends ModelRelationshipTypes> = Type extends ModelRelationshipTypes.belongsTo ? 'required' | 'arrayRequired' | 'valueRequired' : Type extends ModelRelationshipTypes.hasMany ? 'required' : Type extends ModelRelationshipTypes.hasOne ? 'arrayRequired' | 'valueRequired' : Type extends ModelRelationshipTypes.manyToMany ? 'required' | 'references' : never;

/**
 * Request options that are passed to custom header functions.
 * `method` and `headers` are not included in custom header functions passed to
 * subscriptions.
 */
export declare type RequestOptions = {
    url: string;
    queryString: string;
    method?: string;
};

declare type Required_2<T> = Exclude<T, null>;

/**
 * Creates meta types for custom operations from a schema.
 */
declare type ResolveCustomOperations<Schema extends ModelSchema<any, any>, FullyResolvedSchema extends Record<string, unknown>, NonModelTypes extends NonModelTypesShape> = {
    customOperations: {
        [OpName in keyof CustomOpShapes<Schema>]: {
            arguments: CustomOpArguments<CustomOpShapes<Schema>[OpName]>;
            returnType: CustomOpReturnType<CustomOpShapes<Schema>[OpName], FullyResolvedSchema, NonModelTypes>;
            functionRef: CustomOpShapes<Schema>[OpName]['functionRef'];
            typeName: CustomOpShapes<Schema>[OpName]['typeName'];
            authorization: CustomOpShapes<Schema>[OpName]['authorization'];
        };
    };
};

/**
 * Flattens model instance type and unwraps async functions into resolved GraphQL shape
 *
 * This type is used for generating the base shape for custom selection set input and its return value
 * Uses same pattern as above to limit recursion depth to maximum usable for selection set.
 *
 * @example
 * ### Given
 * ```ts
 * Model = {
 title: string;
 comments: () => ListReturnValue<({
 content: string;
 readonly id: string;
 readonly createdAt: string;
 readonly updatedAt: string;
 } | null | undefined)[]>;
 readonly id: string;
 readonly createdAt: string;
 readonly updatedAt: string;
 description?: string | ... 1 more ... | undefined;
 }
 * ```
 * ### Returns
 * ```ts
 * {
 title: string;
 comments: {
 content: string;
 readonly id: string;
 readonly createdAt: string;
 readonly updatedAt: string;
 }[];
 readonly id: string;
 readonly createdAt: string;
 readonly updatedAt: string;
 description: string | null | undefined;
 }
 *
 * ```
 */
declare type ResolvedModel<Model extends Record<string, unknown>, Depth extends number = 7, RecursionLoop extends number[] = [-1, 0, 1, 2, 3, 4, 5, 6]> = {
    done: NonRelationalFields<Model>;
    recur: {
        [Field in keyof Model]: Model[Field] extends (...args: any) => ListReturnValue<infer M> ? NonNullable<M> extends Record<string, any> ? ResolvedModel<NonNullable<M>, RecursionLoop[Depth]>[] : never : Model[Field] extends (...args: any) => SingularReturnValue<infer M> ? NonNullable<M> extends Record<string, any> ? ResolvedModel<NonNullable<M>, RecursionLoop[Depth]> : never : Model[Field];
    };
}[Depth extends -1 ? 'done' : 'recur'];

/**
 * @typeParam SK - tuple of SortKey field names, e.g. ['viewCount', 'createdAt']
 * @typeParam ResolvedFields - resolved model fields
 *
 * @returns object type where the key is the sort key field name and the value is the resolved model field type
 * @example
 * {
 *   viewCount: number;
 *   createdAt: string;
 * }
 */
declare type ResolvedSortKeyFields<SK, ResolvedFields> = SK extends readonly [
infer A extends string,
...infer B extends string[]
] ? A extends keyof ResolvedFields ? {
    [Key in A]: Exclude<ResolvedFields[A], null>;
} & (B extends readonly never[] ? unknown : ResolvedSortKeyFields<B, ResolvedFields>) : never : never;

declare type ResolveFieldProperties<Schema extends ModelSchema<any, any>, NonModelTypes extends NonModelTypesShape, ImplicitModelsSchema, ResolvedSchema = ResolveSchema<Schema>, IdentifierMeta extends Record<string, {
    identifier: string;
}> = ModelIdentifier<SchemaTypes<Schema>>, FieldsWithInjectedImplicitFields = InjectImplicitModelFields<ResolvedSchema & ImplicitModelsSchema, IdentifierMeta>, FieldsWithRelationships = ResolveRelationships<FieldsWithInjectedImplicitFields, NonModelTypes>> = Intersection<FilterFieldTypes<MarkModelsNonNullableFieldsRequired<FieldsWithRelationships>>, FilterFieldTypes<MarkModelsNullableFieldsOptional<FieldsWithRelationships>>, FilterFieldTypes<ModelImpliedAuthFields<Schema>>, AllImpliedFKs<ResolvedSchema, IdentifierMeta>>;

declare type ResolveNonModelFields<T extends NonModelTypesShape> = {
    enums: T['enums'];
    customTypes: FieldTypesOfCustomType<T['customTypes']>;
};

declare type ResolveNonModelTypes<Schema, Extracted, ResolvedSchema = SchemaTypes<Schema> & Extracted> = {
    enums: {
        [Model in keyof ResolvedSchema as ResolvedSchema[Model] extends EnumType<EnumTypeParamShape> ? Model : never]: ResolvedSchema[Model] extends EnumType<infer R extends EnumTypeParamShape> ? R['values'][number] : never;
    };
    customTypes: {
        [Model in keyof ResolvedSchema as ResolvedSchema[Model] extends CustomType<CustomTypeParamShape> ? Model : never]: ResolvedSchema[Model] extends CustomType<infer R extends CustomTypeParamShape> ? R['fields'] : never;
    };
};

declare type ResolveRef<NonModelTypes extends NonModelTypesShape, Ref extends RefTypeParamShape, Link extends string = Ref['link'], RefValue = Link extends keyof NonModelTypes['enums'] ? NonModelTypes['enums'][Link] : Link extends keyof NonModelTypes['customTypes'] ? ResolveRefsOfCustomType<NonModelTypes, NonModelTypes['customTypes'][Link]> : never, Value = Ref['valueRequired'] extends true ? RefValue : RefValue | null> = ResolveRefValueArrayTraits<Ref, Value>;

/**
 * `a.ref()` resolution specific to custom operations, for which `a.ref()`
 * can refer to a model, custom type, or enum.
 *
 * This utility is a duplication of ResolveRef (src/MappedTypes/ResolveFieldProperties.ts)
 * with the addition that allows .ref() a model with custom operations.
 */
declare type ResolveRef_2<Shape extends RefTypeParamShape, FullyResolvedSchema extends Record<string, unknown>, NonModelTypes extends NonModelTypesShape, Link = Shape['link'], RefValue = Link extends keyof FullyResolvedSchema ? FullyResolvedSchema[Link] : Link extends keyof NonModelTypes['enums'] ? NonModelTypes['enums'][Link] : Link extends keyof NonModelTypes['customTypes'] ? ResolveRefsOfCustomType<NonModelTypes, NonModelTypes['customTypes'][Link]> : never, Value = Shape['valueRequired'] extends true ? RefValue : RefValue | null> = ResolveRefValueArrayTraits<Shape, Value>;

declare type ResolveRefsOfCustomType<NonModelTypes extends NonModelTypesShape, T> = {
    [Prop in keyof T]: T[Prop] extends RefType<infer R extends RefTypeParamShape, any, any> | null ? ResolveRef<NonModelTypes, R> : T[Prop];
} extends infer Resolved ? Intersection<ExtractNullableFieldsToOptionalFields<Resolved>, ExtractNonNullableFieldsToRequiredFields<Resolved>> : never;

/**
 * Converts the resolved RefType Value type into Array<> according to the
 * `array` and `arrayRequired` properties of the RefType
 */
declare type ResolveRefValueArrayTraits<Ref extends RefTypeParamShape, Value> = Ref['array'] extends false ? Value : Ref['arrayRequired'] extends true ? Array<Value> : Array<Value> | null;

declare type ResolveRelationalFieldsForModel<Schema, ModelName extends keyof Schema, Flat extends boolean> = {
    [FieldName in keyof Schema[ModelName]]: Schema[ModelName][FieldName] extends ModelRelationalFieldParamShape ? Schema[ModelName][FieldName]['relatedModel'] extends keyof Schema ? GetRelationshipRef<Schema, Schema[ModelName][FieldName]['relatedModel'], Schema[ModelName][FieldName], Flat> : never : Schema[ModelName][FieldName];
};

declare type ResolveRelationships<Schema, NonModelTypes extends NonModelTypesShape, Flat extends boolean = false> = {
    [ModelProp in keyof Schema]: {
        [FieldProp in keyof Schema[ModelProp]]: Schema[ModelProp][FieldProp] extends RefType<infer R extends RefTypeParamShape, any, any> | null ? ResolveRef<NonModelTypes, R> : Schema[ModelProp][FieldProp] extends ModelRelationalFieldParamShape ? Schema[ModelProp][FieldProp]['relatedModel'] extends keyof Schema ? Schema[ModelProp][FieldProp]['relationshipType'] extends 'manyToMany' ? Schema[ModelProp][FieldProp]['relationName'] extends keyof Schema ? GetRelationshipRef<Schema, Schema[ModelProp][FieldProp]['relationName'], Schema[ModelProp][FieldProp], Flat> : never : GetRelationshipRef<Schema, Schema[ModelProp][FieldProp]['relatedModel'], Schema[ModelProp][FieldProp], Flat> : never : Schema[ModelProp][FieldProp];
    };
};

declare type ResolveSchema<Schema> = FieldTypes<ModelTypes_2<SchemaTypes<Schema>>>;

declare type ResourceAuthorization = {
    [__data]: ResourceAuthorizationData;
};

declare type ResourceAuthorizationData = {
    strategy: 'resource';
    resource: DefineFunction;
    operations?: ResourceOperation[];
};

declare type ResourceOperation = (typeof ResourceOperations)[number];

/**
 * The operations that can be performed against an API by a Lambda function.
 */
declare const ResourceOperations: readonly ["query", "mutate", "listen"];

declare function resourceTo<SELF extends ResourceAuthorization>(this: SELF, operations: ResourceOperation[]): Omit<SELF, "to">;

/**
 * This mapped type traverses the SelectionSetReturnValue result and the original FlatModel, restoring array types
 * that were flattened in DeepPickFromPath
 *
 */
declare type RestoreArrays<Result, FlatModel> = {
    [K in keyof Result]: K extends keyof FlatModel ? FlatModel[K] extends Array<any> ? Array<RestoreArrays<Result[K], UnwrapArray<FlatModel[K]>>> : FlatModel[K] extends Record<string, any> ? RestoreArrays<Result[K], FlatModel[K]> : Result[K] : never;
};

/**
 * Selection set-aware CRUDL operation return value type
 *
 * @returns model type as-is with default selection set; otherwise generates return type from custonm sel. set
 */
declare type ReturnValue<M extends Model, FlatModel extends Model, Paths extends ReadonlyArray<ModelPath<FlatModel>>> = Paths extends never[] ? M : CustomSelectionSetReturnValue<FlatModel, Paths[number]>;

/**
 * The API and data model definition for Amplify Data. Pass in `{ <NAME>: a.model(...) }` to create a database table
 * and exposes CRUDL operations via an API.
 * @param types The API and data model definition
 * @returns An API and data model definition to be deployed with Amplify (Gen 2) experience (`processSchema(...)`)
 * or with the Amplify Data CDK construct (`@aws-amplify/data-construct`)
 */
declare const schema: <Types extends ModelSchemaContents>(types: Types) => ModelSchema<{
    types: Types;
    authorization: [];
    configuration: any;
}, never>;

/**
 * Super-set of regular auth type; includes schema-level resource access configuration
 */
declare type SchemaAuthorization<AuthStrategy extends Strategy, AuthField extends string | undefined, AuthFieldPlurality extends boolean> = Authorization<AuthStrategy, AuthField, AuthFieldPlurality> | ResourceAuthorization;

declare type SchemaConfig<DE extends DatasourceEngine, DC extends DatasourceConfig<DE>> = {
    database: DC;
};

declare type SchemaContent = ModelType<ModelTypeParamShape, any> | CustomType<CustomTypeParamShape> | EnumType<EnumTypeParamShape> | CustomOperation<CustomOperationParamShape, any>;

/**
 * External representation of Model Type that exposes the `addRelationships` modifier.
 * Used on the complete schema object.
 */
declare type SchemaModelType<T extends ModelType<ModelTypeParamShape> = ModelType<ModelTypeParamShape>> = T & {
    addRelationships(relationships: Record<string, ModelRelationalField<any, string, any, any>>): void;
};

declare type SchemaTypes<T> = T extends ModelSchema<any, any> ? T['data']['types'] : never;

declare type SecondaryIndexFields<T extends Record<string, unknown>> = keyof {
    [Field in keyof T as NonNullable<T[Field]> extends string | number ? Field : never]: T[Field];
} & string;

/**
 * SecondaryIndex index types and query methods
 */
export declare type SecondaryIndexIrShape = {
    queryField: string;
    pk: {
        [key: string]: string | number;
    };
    sk: {
        [key: string]: string | number;
    };
};

/**
 * Maps array of ModelIndexType to SecondaryIndexIrShape (defined in in data-schema-types)
 * */
declare type SecondaryIndexToIR<Idxs extends ReadonlyArray<ModelIndexTypeShape>, ResolvedFields, Result extends readonly any[] = readonly []> = Idxs extends readonly [
infer First extends ModelIndexTypeShape,
...infer Rest extends ReadonlyArray<ModelIndexTypeShape>
] ? SecondaryIndexToIR<Rest, ResolvedFields, [
...Result,
SingleIndexIrFromType<First, ResolvedFields>
]> : Result;

export declare type SelectionSet<Model extends Record<string, unknown>, Path extends ReadonlyArray<ModelPath<FlatModel>>, FlatModel extends Record<string, unknown> = ResolvedModel<Model>> = CustomSelectionSetReturnValue<FlatModel, Path[number]>;

/**
 * Replaces the value of a key in a complex generic type param
 * @typeParam T - ModelType type param
 * @typeParam SetKey - name of the key whose value will be replaced
 * @typeParam Val - the value to set
 *
 * @example
 * T = { fields: {}, identifier: "id"[] }
 * type Modified = SetTypeSubArg<T, "identifier", "customId"[]>
 * Modified => { fields: {}, identifier: "customId"[] }
 */
export declare type SetTypeSubArg<T, SetKey extends keyof T, Val> = {
    [Property in keyof T]: SetKey extends Property ? Val : T[Property];
};

/**
 * @typeParam Idx - accepts a single ModelIndexType
 * @typeParam ResolvedFields - resolved model fields
 *
 * @returns an IR with the following shape:
 * {
 *   queryField: string;
 *   pk: { [fieldName: string]: string | number }
 *   sk: { [fieldName: string]: string | number } | never
 * }
 *
 * @remarks - the IR type alias is defined as SecondaryIndexIrShape in data-schema-types
 */
declare type SingleIndexIrFromType<Idx extends ModelIndexTypeShape, ResolvedFields> = Idx extends ModelIndexType<any, infer PK extends string, infer SK, infer QueryField extends string | never, any> ? {
    queryField: IsEmptyStringOrNever<QueryField> extends true ? `listBy${QueryFieldLabelFromTuple<SK, Capitalize<PK>>}` : QueryField;
    pk: PK extends keyof ResolvedFields ? {
        [Key in PK]: Exclude<ResolvedFields[PK], null>;
    } : never;
    sk: unknown extends SK ? never : ResolvedSortKeyFields<SK, ResolvedFields>;
} : never;

export declare type SingularReturnValue<T> = Promise<{
    data: T;
    errors?: GraphQLFormattedError[];
    extensions?: {
        [key: string]: any;
    };
}>;

/**
 * Filter options that can be used on fields where size checks are supported.
 */
declare type SizeFilter = {
    between?: [number, number];
    eq?: number;
    ge?: number;
    gt?: number;
    le?: number;
    lt?: number;
    ne?: number;
};

/**
 * Represents a location in a Source.
 */
export declare interface SourceLocation {
    readonly line: number;
    readonly column: number;
}

declare function sqlReference(sqlReference: string): SqlReferenceHandler;

declare const sqlReferenceBrand = "sqlReference";

declare type SqlReferenceHandler = {
    [dataSymbol]: string;
} & Brand<typeof sqlReferenceBrand>;

declare const Strategies: readonly ["public", "private", "owner", "groups", "custom"];

declare type Strategy = (typeof Strategies)[number];

/**
 * A string scalar type that is represented server-side as a UTF-8 character sequence.
 * @returns string field definition
 */
declare function string(): ModelField<Nullable<string>>;

/**
 * Not actually sure if/how customer can pass this through as variables yet.
 * Leaving it out for now:
 *
 * attributeType: "binary" | "binarySet" | "bool" | "list" | "map" | "number" | "numberSet" | "string" | "stringSet" | "_null"
 */
/**
 * Filters options that can be used on string-like fields.
 */
declare type StringFilter = {
    attributeExists?: boolean;
    beginsWith?: string;
    between?: [string, string];
    contains?: string;
    eq?: string;
    ge?: string;
    gt?: string;
    le?: string;
    lt?: string;
    ne?: string;
    notContains?: string;
    size?: SizeFilter;
};

declare function subscription(): CustomOperation<{
    arguments: CustomArguments;
    returnType: null;
    functionRef: null;
    authorization: [];
    typeName: 'Subscription';
    handlers: null;
}, never, typeof subscriptionBrand>;

declare const subscriptionBrand = "subscriptionCustomOperation";

/**
 * A time scalar type that is represented server-side as an extended ISO 8601 time string in the format `hh:mm:ss.sss`.
 * @returns time field definition
 */
declare function time(): ModelField<Nullable<string>>;

/**
 * A timestamp scalar type that is represented by an integer value of the number of seconds before or after `1970-01-01-T00:00Z`.
 * @returns timestamp field definition
 */
declare function timestamp(): ModelField<Nullable<number>>;

declare function to<SELF extends Authorization<any, any, any>>(this: SELF, operations: Operation[]): Omit<SELF, "to">;

/**
 * @typeParam U - Union Type
 * @returns Intersection type
 *
 * @example
 * UnionToIntersection<{a: 1} | {b: 2}> => {a: 1} & {b: 2}
 */
export declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

/**
 * @returns element type for arrays; otherwise returns passed-in type as is
 */
export declare type UnwrapArray<T> = T extends any[] ? T[number] : T;

/**
 * A URL scalar type as defined by RFC 1738. For example, https://www.amazon.com/dp/B000NZW3KC/ or mailto:example@example.com.
 * URLs must contain a schema (http, mailto) and can't contain two forward slashes (//) in the path part.
 * @returns URL field definition
 */
declare function url(): ModelField<Nullable<string>>;

declare function withClaimIn<SELF extends Authorization<any, any, any>>(this: SELF, property: string): Omit<SELF, "withClaimIn">;

declare type WritableKeys<T> = {
    [P in keyof T]-?: IfEquals<{
        [Q in P]: T[P];
    }, {
        -readonly [Q in P]: T[P];
    }, P>;
}[keyof T];

export { }
