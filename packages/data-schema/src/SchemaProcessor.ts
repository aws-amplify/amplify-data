import type { CustomPathData, InternalSchema } from './ModelSchema';
import {
  type ModelField,
  type InternalField,
  string,
  type BaseModelField,
  ModelFieldType,
  __generated,
} from './ModelField';
import {
  ModelRelationshipTypes,
  type InternalRelationshipField,
} from './ModelRelationshipField';
import type { InternalModel, DisableOperationsOptions } from './ModelType';
import type { InternalModelIndexType } from './ModelIndex';
import {
  type Authorization,
  type ResourceAuthorization,
  type SchemaAuthorization,
  accessData,
  accessSchemaData,
} from './Authorization';
import {
  DerivedApiDefinition,
  JsResolver,
  JsResolverEntry,
  FunctionSchemaAccess,
  LambdaFunctionDefinition,
  CustomSqlDataSourceStrategy,
  DatasourceEngine,
} from '@aws-amplify/data-schema-types';
import type { InternalRef, RefType } from './RefType';
import type { EnumType } from './EnumType';
import type { CustomType, CustomTypeParamShape } from './CustomType';
import {
  type InternalCustom,
  type CustomOperationInput,
  type GenerationInput,
  CustomOperationNames,
} from './CustomOperation';
import { Brand, getBrand } from './util';
import {
  getHandlerData,
  type HandlerType,
  type CustomHandler,
  type SqlReferenceHandler,
  FunctionHandler,
  AsyncFunctionHandler,
} from './Handler';
import * as os from 'os';
import * as path from 'path';
import { brandSymbol } from './util/Brand';
import {
  brandName as conversationBrandName,
  type InternalConversationType,
} from './ai/ConversationType';
import { CONVERSATION_SCHEMA_GRAPHQL_TYPES } from './ai/ConversationSchemaGraphQLTypes';
import { createConversationField } from './ai/ConversationSchemaProcessor';

type ScalarFieldDef = Exclude<InternalField['data'], { fieldType: 'model' }>;

type ModelFieldDef = Extract<
  InternalRelationshipField['data'],
  { fieldType: 'model' }
>;

type RefFieldDef = InternalRef['data'];

type CustomOperationFields = {
  queries: string[];
  mutations: string[];
  subscriptions: string[];
};

function isInternalModel(model: unknown): model is InternalModel {
  if (
    (model as any).data &&
    !isCustomType(model) &&
    !isCustomOperation(model) &&
    !isConversationRoute(model)
  ) {
    return true;
  }
  return false;
}

function isEnumType(data: any): data is EnumType {
  if (data?.type === 'enum') {
    return true;
  }
  return false;
}

function isCustomType(
  data: any,
): data is { data: CustomType<CustomTypeParamShape> } {
  if (data?.data?.type === 'customType') {
    return true;
  }
  return false;
}

function isConversationRoute(type: any): type is InternalConversationType {
  return getBrand(type) === conversationBrandName;
}

function isGenerationInput(
  input?: CustomOperationInput,
): input is GenerationInput {
  return Boolean(input?.aiModel && input?.systemPrompt);
}

function isCustomOperation(type: any): type is InternalCustom {
  if (CustomOperationNames.includes(type?.data?.typeName)) {
    return true;
  }
  return false;
}

function isModelFieldDef(data: any): data is ModelFieldDef {
  return data?.fieldType === 'model';
}

function isScalarFieldDef(data: any): data is ScalarFieldDef {
  return data?.fieldType !== 'model';
}

function isRefFieldDef(data: any): data is RefFieldDef {
  return data?.type === 'ref';
}

function isModelField(field: any): field is { data: ModelFieldDef } {
  return isModelFieldDef((field as any)?.data);
}

function dataSourceIsRef(
  dataSource: string | RefType<any, any, any>,
): dataSource is RefType<any, any, any> {
  return (
    typeof dataSource !== 'string' &&
    (dataSource as InternalRef)?.data &&
    (dataSource as InternalRef).data.type === 'ref'
  );
}

function isScalarField(
  field: unknown,
): field is { data: ScalarFieldDef } & Brand<'modelField'> {
  return isScalarFieldDef((field as any)?.data);
}

function isRefField(
  field: unknown,
): field is { data: RefFieldDef } & Brand<'modelField'> {
  return isRefFieldDef((field as any)?.data);
}

function canGenerateFieldType(fieldType: ModelFieldType): boolean {
  return fieldType === 'Int';
}

function scalarFieldToGql(
  fieldDef: ScalarFieldDef,
  identifier?: readonly string[],
  secondaryIndexes: string[] = [],
) {
  const {
    fieldType,
    required,
    array,
    arrayRequired,
    default: _default,
  } = fieldDef;
  let field: string = fieldType;

  if (identifier !== undefined) {
    field += '!';
    if (identifier.length > 1) {
      const [_pk, ...sk] = identifier;
      field += ` @primaryKey(sortKeyFields: [${sk
        .map((sk) => `"${sk}"`)
        .join(', ')}])`;
    } else {
      field += ' @primaryKey';
    }

    for (const index of secondaryIndexes) {
      field += ` ${index}`;
    }

    if (_default === __generated) {
      field += ` @default`;
    }

    return field;
  }

  if (required === true) {
    field += '!';
  }

  if (array) {
    field = `[${field}]`;

    if (arrayRequired === true) {
      field += '!';
    }
  }

  if (_default === __generated) {
    field += ` @default`;
  } else if (_default !== undefined) {
    field += ` @default(value: "${_default?.toString()}")`;
  }

  for (const index of secondaryIndexes) {
    field += ` ${index}`;
  }
  return field;
}

function modelFieldToGql(fieldDef: ModelFieldDef) {
  const {
    type,
    relatedModel,
    array,
    valueRequired,
    arrayRequired,
    references,
  } = fieldDef;

  let field = relatedModel;

  if (valueRequired === true) {
    field += '!';
  }

  if (array) {
    field = `[${field}]`;
  }

  if (arrayRequired === true) {
    field += '!';
  }

  if (references && Array.isArray(references) && references.length > 0) {
    field += ` @${type}(references: [${references.map(
      (s) => `"${String(s)}"`,
    )}])`;
  } else {
    field += ` @${type}`;
  }

  return field;
}

function refFieldToGql(
  fieldDef: RefFieldDef,
  secondaryIndexes: string[] = [],
): string {
  const { link, valueRequired, array, arrayRequired } = fieldDef;

  let field = link;

  if (valueRequired === true) {
    field += '!';
  }

  if (array === true) {
    field = `[${field}]`;
  }

  if (arrayRequired === true) {
    field += '!';
  }

  for (const index of secondaryIndexes) {
    field += ` ${index}`;
  }

  return field;
}

function enumFieldToGql(enumName: string, secondaryIndexes: string[] = []) {
  let field = enumName;

  for (const index of secondaryIndexes) {
    field += ` ${index}`;
  }

  return field;
}

function transformFunctionHandler(
  handlers: (FunctionHandler | AsyncFunctionHandler)[],
  functionFieldName: string,
): {
  gqlHandlerContent: string;
  lambdaFunctionDefinition: LambdaFunctionDefinition;
} {
  let gqlHandlerContent = '';
  const lambdaFunctionDefinition: LambdaFunctionDefinition = {};

  handlers.forEach((handler, idx) => {
    const handlerData = getHandlerData(handler);

    if (typeof handlerData.handler === 'string') {
      gqlHandlerContent += `@function(name: "${handlerData.handler}") `;
    } else if (typeof handlerData.handler.getInstance === 'function') {
      const fnName = `Fn${capitalize(functionFieldName)}${idx === 0 ? '' : `${idx + 1}`}`;
      lambdaFunctionDefinition[fnName] = handlerData.handler;
      const invocationTypeArg =
        handlerData.invocationType === 'Event'
          ? ', invocationType: Event)'
          : ')';
      gqlHandlerContent += `@function(name: "${fnName}"${invocationTypeArg} `;
    } else {
      throw new Error(
        `Invalid value specified for ${functionFieldName} handler.function(). Expected: defineFunction or string.`,
      );
    }
  });

  return {
    gqlHandlerContent,
    lambdaFunctionDefinition,
  };
}

type CustomTypeAuthRules =
  | {
      typeName: string;
      authRules: Authorization<any, any, any>[];
    }
  | undefined;

function customOperationToGql(
  typeName: string,
  typeDef: InternalCustom,
  authorization: Authorization<any, any, any>[],
  isCustom = false,
  databaseType: DatabaseType,
  getRefType: ReturnType<typeof getRefTypeForSchema>,
): {
  gqlField: string;
  implicitTypes: [string, any][];
  inputTypes: string[];
  returnTypes: string[];
  customTypeAuthRules: CustomTypeAuthRules;
  lambdaFunctionDefinition: LambdaFunctionDefinition;
  customSqlDataSourceStrategy: CustomSqlDataSourceStrategy | undefined;
} {
  const {
    arguments: fieldArgs,
    typeName: opType,
    returnType,
    handlers,
    subscriptionSource,
  } = typeDef.data;

  let callSignature: string = typeName;
  const implicitTypes: [string, any][] = [];
  const inputTypes: string[] = [];
  let returnTypes: string[] = [];

  // When Custom Operations are defined with a Custom Type return type,
  // the Custom Type inherits the operation's auth rules
  let customTypeAuthRules: CustomTypeAuthRules = undefined;

  const { authString } = isCustom
    ? mapToNativeAppSyncAuthDirectives(authorization, true)
    : calculateAuth(authorization);

  /**
   *
   * @param returnType The return type from the `data` field of a customer operation.
   * @param refererTypeName The type the refers {@link returnType} by `a.ref()`.
   * @param shouldAddCustomTypeToImplicitTypes A flag indicates wether it should push
   * the return type resolved CustomType to the `implicitTypes` list.
   * @returns
   */
  const resolveReturnTypeNameFromReturnType = (
    returnType: any,
    {
      refererTypeName,
      shouldAddCustomTypeToImplicitTypes = true,
    }: {
      refererTypeName: string;
      shouldAddCustomTypeToImplicitTypes?: boolean;
    },
  ): string => {
    if (isRefField(returnType)) {
      const { type } = getRefType(returnType.data.link, typeName);

      if (type === 'CustomType') {
        customTypeAuthRules = {
          typeName: returnType.data.link,
          authRules: authorization,
        };
      } else if (type === 'Enum') {
        return refFieldToGql(returnType.data);
      }

      return refFieldToGql(returnType?.data);
    } else if (isCustomType(returnType)) {
      const returnTypeName = `${capitalize(refererTypeName)}ReturnType`;
      if (shouldAddCustomTypeToImplicitTypes) {
        customTypeAuthRules = {
          typeName: returnTypeName,
          authRules: authorization,
        };

        implicitTypes.push([
          returnTypeName,
          { ...returnType, generateInputType: false },
        ]);
      }
      return returnTypeName;
    } else if (isEnumType(returnType)) {
      const returnTypeName = `${capitalize(refererTypeName)}ReturnType`;
      implicitTypes.push([returnTypeName, returnType]);

      return returnTypeName;
    } else if (isScalarField(returnType)) {
      return scalarFieldToGql(returnType?.data);
    } else {
      throw new Error(`Unrecognized return type on ${typeName}`);
    }
  };

  let returnTypeName: string;

  if (opType === 'Subscription' && returnType === null) {
    // up to this point, we've validated that each subscription resource resolves
    // the same return type, so it's safe to use subscriptionSource[0] here.
    const { type, def } = getRefType(subscriptionSource[0].data.link, typeName);
    if (type === 'CustomOperation') {
      returnTypeName = resolveReturnTypeNameFromReturnType(
        def.data.returnType,
        {
          refererTypeName: subscriptionSource[0].data.link,
          shouldAddCustomTypeToImplicitTypes: false,
        },
      );
    } else {
      returnTypeName = refFieldToGql(subscriptionSource[0].data);
    }
  } else {
    returnTypeName = resolveReturnTypeNameFromReturnType(returnType, {
      refererTypeName: typeName,
    });
  }
  // After resolving returnTypeName
  if (isCustomType(returnType)) {
    returnTypes = generateInputTypes(
      [[returnTypeName, { ...returnType, isgenerateInputTypeInput: false }]],
      false,
      getRefType,
      authorization,
    );
  }
  const dedupedInputTypes = new Set<string>(inputTypes);

  if (Object.keys(fieldArgs).length > 0) {
    const { gqlFields, implicitTypes: implied } = processFields(
      typeName,
      fieldArgs,
      {},
      {},
      getRefType,
      undefined,
      undefined,
      {},
      databaseType === 'sql' ? 'postgresql' : 'dynamodb',
      true,
    );
    callSignature += `(${gqlFields.join(', ')})`;
    implicitTypes.push(...implied);

    const newTypes = generateInputTypes(implied, true, getRefType);
    for (const t of newTypes) {
      if (!dedupedInputTypes.has(t)) {
        dedupedInputTypes.add(t);
      }
    }
  }

  const handler = handlers && handlers[0];
  const brand = handler && getBrand(handler);

  let gqlHandlerContent = '';
  let lambdaFunctionDefinition: LambdaFunctionDefinition = {};
  let customSqlDataSourceStrategy: CustomSqlDataSourceStrategy | undefined;

  if (isFunctionHandler(handlers)) {
    ({ gqlHandlerContent, lambdaFunctionDefinition } = transformFunctionHandler(
      handlers,
      typeName,
    ));
  } else if (databaseType === 'sql' && handler && brand === 'inlineSql') {
    gqlHandlerContent = `@sql(statement: ${escapeGraphQlString(
      String(getHandlerData(handler)),
    )}) `;
    customSqlDataSourceStrategy = {
      typeName: opType as `Query` | `Mutation`,
      fieldName: typeName,
    };
  } else if (isSqlReferenceHandler(handlers)) {
    const handlerData = getHandlerData(handlers[0]);
    const entry = resolveEntryPath(
      handlerData,
      'Could not determine import path to construct absolute code path for sql reference handler. Consider using an absolute path instead.',
    );
    const reference = typeof entry === 'string' ? entry : entry.relativePath;

    customSqlDataSourceStrategy = {
      typeName: opType as `Query` | `Mutation`,
      fieldName: typeName,
      entry,
    };
    gqlHandlerContent = `@sql(reference: "${reference}") `;
  }

  if (opType === 'Subscription') {
    const subscriptionSources = subscriptionSource
      .flatMap((source: InternalRef) => {
        const refTarget = source.data.link;
        const { type } = getRefType(refTarget, typeName);

        if (type === 'CustomOperation') {
          return refTarget;
        }

        if (type === 'Model') {
          return source.data.mutationOperations.map(
            // capitalize explicitly in case customer used lowercase model name
            (op: string) => `${op}${capitalize(refTarget)}`,
          );
        }
      })
      .join('", "');

    gqlHandlerContent += `@aws_subscribe(mutations: ["${subscriptionSources}"]) `;
  }

  if (opType === 'Generation') {
    if (!isGenerationInput(typeDef.data.input)) {
      throw new Error(
        `Invalid Generation Route definition. A Generation Route must include a valid input. ${typeName} has an invalid or no input defined.`,
      );
    }
    const { aiModel, systemPrompt, inferenceConfiguration } =
      typeDef.data.input;

    // This is done to escape newlines in potentially multi-line system prompts
    // e.g.
    // generateStuff: a.generation({
    //   aiModel: a.ai.model('Claude 3 Haiku'),
    //   systemPrompt: `Generate a haiku
    //   make it multiline`,
    // }),
    //
    // It doesn't affect non multi-line string inputs for system prompts
    const escapedSystemPrompt = systemPrompt.replace(/\r?\n/g, '\\n');
    const inferenceConfigurationEntries = Object.entries(
      inferenceConfiguration ?? {},
    );
    const inferenceConfigurationGql =
      inferenceConfigurationEntries.length > 0
        ? `, inferenceConfiguration: { ${inferenceConfigurationEntries
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ')} }`
        : '';
    gqlHandlerContent += `@generation(aiModel: "${aiModel.resourcePath}", systemPrompt: "${escapedSystemPrompt}"${inferenceConfigurationGql}) `;
  }

  const gqlField = `${callSignature}: ${returnTypeName} ${gqlHandlerContent}${authString}`;

  return {
    gqlField,
    implicitTypes: implicitTypes,
    inputTypes,
    returnTypes,
    customTypeAuthRules,
    lambdaFunctionDefinition,
    customSqlDataSourceStrategy,
  };
}

/**
 * Escape a string that will be used inside of a graphql string.
 * @param str The input string to be escaped
 * @returns The string with special charactars escaped
 */
function escapeGraphQlString(str: string) {
  return JSON.stringify(str);
}

/**
 * AWS AppSync scalars that are stored as strings in the data source
 */
const stringFieldTypes = {
  ID: true,
  String: true,
  AWSDate: true,
  AWSTime: true,
  AWSDateTime: true,
  AWSEmail: true,
  AWSPhone: true,
  AWSURL: true,
  AWSIPAddress: true,
};

/**
 * Normalize string-compatible field types for comparison
 */
const normalizeStringFieldTypes = (
  fieldType: ModelFieldType,
): ModelFieldType => {
  if (fieldType in stringFieldTypes) {
    return ModelFieldType.String;
  }

  return fieldType;
};

/**
 * Tests whether two ModelField definitions are in conflict.
 *
 * This is a shallow check intended to catch conflicts between defined fields
 * and fields implied by authorization rules. Hence, it only compares type
 * and plurality.
 *
 * @param left
 * @param right
 * @returns
 */
function areConflicting(left: BaseModelField, right: BaseModelField): boolean {
  const leftData = (left as InternalField).data;
  const rightData = (right as InternalField).data;

  // `array` and `fieldType` are the only props we care about for this comparison, because the others
  // (required, arrayRequired, etc) are not specified on auth or FK directives.
  if (leftData.array !== rightData.array) {
    return true;
  }

  // Convert "string-compatible" field types to `String` for the sake of this comparison
  //
  // E.g. if a customer has an explicit a.id() field that they're referencing in an allow.ownerDefinedIn rule
  // we treat ID and String as equivalent/non-conflicting
  if (
    normalizeStringFieldTypes(leftData.fieldType) !==
    normalizeStringFieldTypes(rightData.fieldType)
  ) {
    return true;
  }

  return false;
}

/**
 * Merges one field defition object onto an existing one, performing
 * validation (conflict detection) along the way.
 *
 * @param existing An existing field map
 * @param additions A field map to merge in
 */
function addFields(
  existing: Record<string, BaseModelField>,
  additions: Record<string, BaseModelField>,
): void {
  for (const [k, addition] of Object.entries(additions)) {
    if (!existing[k]) {
      existing[k] = addition;
    } else if (areConflicting(existing[k], addition)) {
      throw new Error(`Field ${k} defined twice with conflicting definitions.`);
    } else {
      // fields are defined on both sides, but match.
    }
  }
}

/**
 * Validate that no implicit fields are used by the model definition
 *
 * @param existing An existing field map
 * @param implicitFields A field map inferred from other schema usage
 *
 * @throws An error when an undefined field is used or when a field is used in a way that conflicts with its generated definition
 */
function validateStaticFields(
  existing: Record<string, BaseModelField>,
  implicitFields: Record<string, BaseModelField> | undefined,
) {
  if (implicitFields === undefined) {
    return;
  }
  for (const [k, field] of Object.entries(implicitFields)) {
    if (!existing[k]) {
      throw new Error(`Field ${k} isn't defined.`);
    } else if (areConflicting(existing[k], field)) {
      throw new Error(`Field ${k} defined twice with conflicting definitions.`);
    }
  }
}

/**
 * Validate that no implicit fields conflict with explicitly defined fields.
 *
 * @param existing An existing field map
 * @param implicitFields A field map inferred from other schema usage
 *
 * @throws An error when an undefined field is used or when a field is used in a way that conflicts with its generated definition
 */
function validateImpliedFields(
  existing: Record<string, BaseModelField>,
  implicitFields: Record<string, BaseModelField> | undefined,
) {
  if (implicitFields === undefined) {
    return;
  }
  for (const [k, field] of Object.entries(implicitFields)) {
    if (existing[k] && areConflicting(existing[k], field)) {
      throw new Error(
        `Implicit field ${k} conflicts with the explicit field definition.`,
      );
    }
  }
}

function validateRefUseCases(
  referrerName: string,
  referrerType: 'customType' | 'model',
  fields: Record<string, any>,
  getRefType: ReturnType<typeof getRefTypeForSchema>,
) {
  const check = (fieldName: string, refLink: string, targetType: string) => {
    const { def } = getRefType(refLink, referrerName);
    if (isInternalModel(def)) {
      throw new Error(
        `Cannot use \`.ref()\` to refer a model from a \`${targetType}\`. Field \`${fieldName}\` of \`${referrerName}\` refers to model \`${refLink}\``,
      );
    }
  };

  for (const [fieldName, field] of Object.entries(fields)) {
    if (isRefField(field)) {
      check(
        fieldName,
        field.data.link,
        referrerType === 'customType' ? 'custom type' : 'model',
      );
    }
  }
}

/**
 * Given a list of authorization rules, produces a set of the implied owner and/or
 * group fields, along with the associated graphql `@auth` string directive.
 *
 * This is intended to be called for each model and field to collect the implied
 * fields and directives from that individual "item's" auth rules.
 *
 * The computed directives are intended to be appended to the graphql field definition.
 *
 * The computed fields will be used to confirm no conflicts between explicit field definitions
 * and implicit auth fields.
 *
 * @param authorization A list of authorization rules.
 * @returns
 */
function calculateAuth(authorization: Authorization<any, any, any>[]) {
  const authFields: Record<string, BaseModelField> = {};
  const rules: string[] = [];

  for (const entry of authorization) {
    const rule = accessData(entry);
    const ruleParts: Array<string | string[]> = [];

    if (rule.strategy) {
      ruleParts.push([`allow: ${rule.strategy}`]);
    } else {
      return {
        authFields,
        authString: '',
      };
    }

    if (rule.provider) {
      // identityPool maps to iam in the transform
      const provider = rule.provider === 'identityPool' ? 'iam' : rule.provider;
      ruleParts.push(`provider: ${provider}`);
    }

    if (rule.operations) {
      ruleParts.push(`operations: [${rule.operations.join(', ')}]`);
    }

    if (rule.groupOrOwnerField) {
      // directive attribute, depending whether it's owner or group auth
      if (rule.strategy === 'groups') {
        // does this need to be escaped?
        ruleParts.push(`groupsField: "${rule.groupOrOwnerField}"`);
      } else {
        // does this need to be escaped?
        ruleParts.push(`ownerField: "${rule.groupOrOwnerField}"`);
      }

      // model field dep, type of which depends on whether multiple owner/group
      // is required.
      if (rule.multiOwner) {
        addFields(authFields, { [rule.groupOrOwnerField]: string().array() });
      } else {
        addFields(authFields, { [rule.groupOrOwnerField]: string() });
      }
    }

    if (rule.groups) {
      // does `group` need to be escaped?
      ruleParts.push(
        `groups: [${rule.groups.map((group) => `"${group}"`).join(', ')}]`,
      );
    }

    // identityClaim
    if (rule.identityClaim) {
      // does this need to be escaped?
      ruleParts.push(`identityClaim: "${rule.identityClaim}"`);
    }

    // groupClaim
    if (rule.groupClaim) {
      // does this need to be escaped?
      ruleParts.push(`groupClaim: "${rule.groupClaim}"`);
    }

    rules.push(`{${ruleParts.join(', ')}}`);
  }

  const authString =
    rules.length > 0 ? `@auth(rules: [${rules.join(',\n  ')}])` : '';

  return { authString, authFields };
}

type AuthRule = ReturnType<typeof accessData>;

function validateCustomHandlerAuthRule(rule: AuthRule) {
  if (rule.groups && rule.provider === 'oidc') {
    throw new Error('OIDC group auth is not supported with a.handler.custom');
  }

  // not currently supported with handler.custom (JS Resolvers), but will be in the future
  if (rule.provider === 'identityPool' || (rule.provider as string) === 'iam') {
    throw new Error(
      "identityPool-based auth (allow.guest() and allow.authenticated('identityPool')) is not supported with a.handler.custom",
    );
  }
}

function getAppSyncAuthDirectiveFromRule(rule: AuthRule): string {
  const strategyDict: Record<string, Record<string, string>> = {
    public: {
      default: '@aws_api_key',
      apiKey: '@aws_api_key',
      iam: '@aws_iam',
      identityPool: '@aws_iam',
    },
    private: {
      default: '@aws_cognito_user_pools',
      userPools: '@aws_cognito_user_pools',
      oidc: '@aws_oidc',
      iam: '@aws_iam',
      identityPool: '@aws_iam',
    },
    groups: {
      default: '@aws_cognito_user_pools',
      userPools: '@aws_cognito_user_pools',
    },
    custom: {
      default: '@aws_lambda',
      function: '@aws_lambda',
    },
  };

  const stratProviders = strategyDict[rule.strategy];

  if (stratProviders === undefined) {
    throw new Error(
      `Unsupported auth strategy for custom handlers: ${rule.strategy}`,
    );
  }

  const provider = rule.provider || 'default';
  const stratProvider = stratProviders[provider];

  if (stratProvider === undefined) {
    throw new Error(
      `Unsupported provider for custom handlers: ${rule.provider}`,
    );
  }

  return stratProvider;
}

function mapToNativeAppSyncAuthDirectives(
  authorization: Authorization<any, any, any>[],
  isCustomHandler: boolean,
) {
  const rules = new Set<string>();

  for (const entry of authorization) {
    const rule = accessData(entry);

    isCustomHandler && validateCustomHandlerAuthRule(rule);

    const provider = getAppSyncAuthDirectiveFromRule(rule);

    if (rule.groups) {
      // example: (cognito_groups: ["Bloggers", "Readers"])
      rules.add(
        `${provider}(cognito_groups: [${rule.groups
          .map((group) => `"${group}"`)
          .join(', ')}])`,
      );
    } else {
      rules.add(provider);
    }
  }

  const authString = [...rules].join(' ');

  return { authString };
}

function capitalize<T extends string>(s: T): Capitalize<T> {
  return `${s[0].toUpperCase()}${s.slice(1)}` as Capitalize<T>;
}

function processFieldLevelAuthRules(
  fields: Record<string, BaseModelField>,
  authFields: Record<string, BaseModelField>,
) {
  const fieldLevelAuthRules: {
    [k in keyof typeof fields]: string | null;
  } = {};

  for (const [fieldName, fieldDef] of Object.entries(fields)) {
    const fieldAuth = (fieldDef as InternalField)?.data?.authorization || [];

    const { authString, authFields: fieldAuthField } = calculateAuth(fieldAuth);

    if (authString) fieldLevelAuthRules[fieldName] = authString;
    if (fieldAuthField) {
      addFields(authFields, fieldAuthField);
    }
  }

  return fieldLevelAuthRules;
}

function validateDBGeneration(
  fields: Record<string, any>,
  databaseEngine: DatasourceEngine,
) {
  for (const [fieldName, fieldDef] of Object.entries(fields)) {
    const _default = fieldDef.data?.default;
    const fieldType = fieldDef.data?.fieldType;
    const isGenerated = _default === __generated;

    if (isGenerated && databaseEngine !== 'postgresql') {
      throw new Error(
        `Invalid field definition for ${fieldName}. DB-generated fields are only supported with PostgreSQL data sources.`,
      );
    }

    if (isGenerated && !canGenerateFieldType(fieldType)) {
      throw new Error(
        `Incompatible field type. Field type ${fieldType} in field ${fieldName} cannot be configured as a DB-generated field.`,
      );
    }
  }
}

function validateNullableIdentifiers(
  fields: Record<string, any>,
  identifier?: readonly string[],
) {
  for (const [fieldName, fieldDef] of Object.entries(fields)) {
    const fieldType = fieldDef.data?.fieldType;
    const required = fieldDef.data?.required;
    const _default = fieldDef.data?.default;
    const isGenerated = _default === __generated;

    if (identifier !== undefined && identifier.includes(fieldName)) {
      if (!required && fieldType !== 'ID' && !isGenerated) {
        throw new Error(
          `Invalid identifier definition. Field ${fieldName} cannot be used in the identifier. Identifiers must reference required or DB-generated fields)`,
        );
      }
    }
  }
}

function processFields(
  typeName: string,
  fields: Record<string, any>,
  impliedFields: Record<string, any>,
  fieldLevelAuthRules: Record<string, string | null>,
  getRefType: ReturnType<typeof getRefTypeForSchema>,

  identifier?: readonly string[],
  partitionKey?: string,
  secondaryIndexes: TransformedSecondaryIndexes = {},
  databaseEngine: DatasourceEngine = 'dynamodb',
  generateInputType: boolean = false,
) {
  const gqlFields: string[] = [];
  // stores nested, field-level type definitions (custom types and enums)
  // the need to be hoisted to top-level schema types and processed accordingly
  const implicitTypes: [string, any][] = [];

  validateImpliedFields(fields, impliedFields);
  validateDBGeneration(fields, databaseEngine);
  validateNullableIdentifiers(fields, identifier);

  for (const [fieldName, fieldDef] of Object.entries(fields)) {
    const fieldAuth = fieldLevelAuthRules[fieldName]
      ? ` ${fieldLevelAuthRules[fieldName]}`
      : '';

    if (isModelField(fieldDef)) {
      gqlFields.push(
        `${fieldName}: ${modelFieldToGql(fieldDef.data)}${fieldAuth}`,
      );
    } else if (isScalarField(fieldDef)) {
      if (fieldName === partitionKey) {
        gqlFields.push(
          `${fieldName}: ${scalarFieldToGql(
            (fieldDef as any).data,
            identifier,
            secondaryIndexes[fieldName],
          )}${fieldAuth}`,
        );
      } else if (isRefField(fieldDef)) {
        const refTypeInfo = getRefType(fieldDef.data.link, typeName);
        if (refTypeInfo.type === 'Enum') {
          gqlFields.push(
            `${fieldName}: ${refFieldToGql(fieldDef.data, secondaryIndexes[fieldName])}${fieldAuth}`,
          );
        } else if (refTypeInfo.type === 'CustomType') {
          if (generateInputType) {
            const inputTypeName = `${capitalize(typeName)}${capitalize(fieldName)}Input`;
            gqlFields.push(`${fieldName}: ${inputTypeName}${fieldAuth}`);

            const { implicitTypes: nestedImplicitTypes } = processFields(
              inputTypeName,
              refTypeInfo.def.data.fields,
              {},
              {},
              getRefType,
              undefined,
              undefined,
              {},
              'dynamodb',
              true,
            );

            implicitTypes.push([
              inputTypeName,
              {
                data: {
                  type: 'customType',
                  fields: refTypeInfo.def.data.fields,
                },
              },
            ]);

            implicitTypes.push(...nestedImplicitTypes);
          } else {
            gqlFields.push(
              `${fieldName}: ${refFieldToGql(fieldDef.data, secondaryIndexes[fieldName])}${fieldAuth}`,
            );
          }
        } else {
          throw new Error(
            `Field '${fieldName}' in type '${typeName}' references '${fieldDef.data.link}' which is neither a CustomType nor an Enum.`,
          );
        }
      } else if (isEnumType(fieldDef)) {
        // The inline enum type name should be `<TypeName><FieldName>` to avoid
        // enum type name conflicts
        const enumName = `${capitalize(typeName)}${capitalize(fieldName)}`;
        implicitTypes.push([enumName, fieldDef]);
        gqlFields.push(
          `${fieldName}: ${enumFieldToGql(enumName, secondaryIndexes[fieldName])}`,
        );
      } else if (isCustomType(fieldDef)) {
        // The inline CustomType name should be `<TypeName><FieldName>` to avoid
        // CustomType name conflicts
        const customTypeName = `${capitalize(typeName)}${capitalize(fieldName)}${generateInputType ? 'Input' : ''}`;
        implicitTypes.push([customTypeName, fieldDef]);
        gqlFields.push(`${fieldName}: ${customTypeName}${fieldAuth}`);
      } else {
        gqlFields.push(
          `${fieldName}: ${scalarFieldToGql(
            fieldDef.data,
            undefined,
            secondaryIndexes[fieldName],
          )}${fieldAuth}`,
        );
      }
    } else {
      throw new Error(
        `Unexpected field definition for ${typeName}.${fieldName}: ${JSON.stringify(fieldDef)}`,
      );
    }
  }

  return { gqlFields, implicitTypes };
}

type TransformedSecondaryIndexes = {
  [fieldName: string]: string[];
};

/**
 *
 * @param pk - partition key field name
 * @param sk - (optional) array of sort key field names
 * @returns default query field name
 */
const secondaryIndexDefaultQueryField = (
  modelName: string,
  pk: string,
  sk?: readonly string[],
): string => {
  const skName = sk?.length ? 'And' + sk?.map(capitalize).join('And') : '';

  const queryField = `list${capitalize(modelName)}By${capitalize(pk)}${skName}`;

  return queryField;
};

/**
 * Given InternalModelIndexType[] returns a map where the key is the model field to be annotated with an @index directive
 * and the value is an array of transformed Amplify @index directives with all supplied attributes
 */
const transformedSecondaryIndexesForModel = (
  modelName: string,
  secondaryIndexes: readonly InternalModelIndexType[],
  modelFields: Record<string, ModelField<any, any>>,
  getRefType: ReturnType<typeof getRefTypeForSchema>,
): TransformedSecondaryIndexes => {
  const indexDirectiveWithAttributes = (
    partitionKey: string,
    sortKeys: readonly string[],
    indexName: string,
    queryField: string,
  ): string => {
    for (const keyName of [partitionKey, ...sortKeys]) {
      const field = modelFields[keyName];

      if (isRefField(field)) {
        const { def } = getRefType(field.data.link, modelName);
        if (!isEnumType(def)) {
          throw new Error(
            `The ref field \`${keyName}\` used in the secondary index of \`${modelName}\` should refer to an enum type. \`${field.data.link}\` is not a enum type.`,
          );
        }
      }
    }

    if (!sortKeys.length && !indexName && !queryField) {
      return `@index(queryField: "${secondaryIndexDefaultQueryField(
        modelName,
        partitionKey,
      )}")`;
    }

    const attributes: string[] = [];

    if (indexName) {
      attributes.push(`name: "${indexName}"`);
    }

    if (sortKeys.length) {
      attributes.push(
        `sortKeyFields: [${sortKeys.map((sk) => `"${sk}"`).join(', ')}]`,
      );
    }

    if (queryField) {
      attributes.push(`queryField: "${queryField}"`);
    } else {
      attributes.push(
        `queryField: "${secondaryIndexDefaultQueryField(
          modelName,
          partitionKey,
          sortKeys,
        )}"`,
      );
    }

    return `@index(${attributes.join(', ')})`;
  };

  return secondaryIndexes.reduce(
    (
      acc: TransformedSecondaryIndexes,
      { data: { partitionKey, sortKeys, indexName, queryField } },
    ) => {
      acc[partitionKey] = acc[partitionKey] || [];
      acc[partitionKey].push(
        indexDirectiveWithAttributes(
          partitionKey,
          sortKeys as readonly string[],
          indexName,
          queryField,
        ),
      );

      return acc;
    },
    {},
  );
};

type DatabaseType = 'dynamodb' | 'sql';

const ruleIsResourceAuth = (
  authRule: SchemaAuthorization<any, any, any>,
): authRule is ResourceAuthorization => {
  const data = accessSchemaData(authRule);
  return data.strategy === 'resource';
};

/**
 * Separates out lambda resource auth rules from remaining schema rules.
 *
 * @param authRules schema auth rules
 */
const extractFunctionSchemaAccess = (
  authRules: SchemaAuthorization<any, any, any>[],
): {
  schemaAuth: Authorization<any, any, any>[];
  functionSchemaAccess: FunctionSchemaAccess[];
} => {
  const schemaAuth: Authorization<any, any, any>[] = [];
  const functionSchemaAccess: FunctionSchemaAccess[] = [];
  const defaultActions: ['query', 'mutate', 'listen'] = [
    'query',
    'mutate',
    'listen',
  ];

  for (const rule of authRules) {
    if (ruleIsResourceAuth(rule)) {
      const ruleData = accessSchemaData(rule);

      const fnAccess = {
        resourceProvider: ruleData.resource,
        actions: ruleData.operations || defaultActions,
      };
      functionSchemaAccess.push(fnAccess);
    } else {
      schemaAuth.push(rule);
    }
  }

  return { schemaAuth, functionSchemaAccess };
};

/**
 * Searches a schema and all related schemas (through `.combine()`) for the given type by name.
 *
 * @param schema
 * @param name
 * @returns
 */
const findCombinedSchemaType = (
  schema: InternalSchema,
  name: string,
): unknown | undefined => {
  if (schema.context) {
    for (const contextualSchema of schema.context.schemas) {
      if (contextualSchema.data.types[name]) {
        return contextualSchema.data.types[name];
      }
    }
  } else {
    return schema.data.types[name];
  }
  return undefined;
};

type GetRef =
  | {
      type: 'Model';
      def: InternalModel;
    }
  | { type: 'CustomOperation'; def: InternalCustom }
  | {
      type: 'CustomType';
      def: {
        data: CustomType<CustomTypeParamShape>;
      };
    }
  | { type: 'Enum'; def: EnumType<any> };

/**
 * Returns a closure for retrieving reference type and definition from schema
 */
const getRefTypeForSchema = (schema: InternalSchema) => {
  const getRefType = (name: string, referrerName?: string): GetRef => {
    const typeDef = findCombinedSchemaType(schema, name);

    if (typeDef === undefined) {
      throw new Error(
        referrerName
          ? `Invalid ref. ${referrerName} is referring to ${name} which is not defined in the schema`
          : `Invalid ref. ${name} is not defined in the schema`,
      );
    }

    if (isInternalModel(typeDef)) {
      return { type: 'Model', def: typeDef };
    }

    if (isCustomOperation(typeDef)) {
      return { type: 'CustomOperation', def: typeDef };
    }

    if (isCustomType(typeDef)) {
      return { type: 'CustomType', def: typeDef };
    }

    if (isEnumType(typeDef)) {
      return { type: 'Enum', def: typeDef };
    }

    throw new Error(
      referrerName
        ? `Invalid ref. ${referrerName} is referring to ${name} which is neither a Model, Custom Operation, Custom Type, or Enum`
        : `Invalid ref. ${name} is neither a Model, Custom Operation, Custom Type, or Enum`,
    );
  };

  return getRefType;
};

/**
 * Sorts top-level schema types to where Custom Types are processed last
 * This allows us to accrue and then apply inherited auth rules for custom types from custom operations
 * that reference them in their return values
 */
const sortTopLevelTypes = (topLevelTypes: [string, any][]) => {
  return topLevelTypes.sort(
    ([_typeNameA, typeDefA], [_typeNameB, typeDefB]) => {
      if (
        (isCustomType(typeDefA) && isCustomType(typeDefB)) ||
        (!isCustomType(typeDefA) && !isCustomType(typeDefB))
      ) {
        return 0;
      } else if (isCustomType(typeDefA) && !isCustomType(typeDefB)) {
        return 1;
      } else {
        return -1;
      }
    },
  );
};

/**
 * Builds up dictionary of Custom Type name - array of inherited auth rules
 */
const mergeCustomTypeAuthRules = (
  existing: Record<string, Authorization<any, any, any>[]>,
  added: CustomTypeAuthRules,
) => {
  if (!added) return;

  const { typeName, authRules } = added;

  if (typeName in existing) {
    existing[typeName] = [...existing[typeName], ...authRules];
  } else {
    existing[typeName] = authRules;
  }
};

function generateInputTypes(
  implicitTypes: [string, any][],
  generateInputType: boolean,
  getRefType: ReturnType<typeof getRefTypeForSchema>,
  authRules?: Authorization<any, any, any>[],
  isInlineType = false,
): string[] {
  const generatedTypes = new Set<string>();

  implicitTypes.forEach(([typeName, typeDef]) => {
    if (isCustomType(typeDef)) {
      const { gqlFields, implicitTypes: nestedTypes } = processFields(
        typeName,
        typeDef.data.fields,
        {},
        {},
        getRefType,
        undefined,
        undefined,
        {},
        'dynamodb',
        generateInputType,
      );
      const authString =
        !isInlineType && authRules
          ? mapToNativeAppSyncAuthDirectives(authRules, false).authString
          : '';
      const typeKeyword = generateInputType ? 'input' : 'type';
      const customType = `${typeKeyword} ${typeName}${authString ? ` ${authString}` : ''}\n{\n  ${gqlFields.join('\n  ')}\n}`;
      generatedTypes.add(customType);

      // Process nested types
      if (nestedTypes.length > 0) {
        const nestedGeneratedTypes = generateInputTypes(
          nestedTypes,
          generateInputType,
          getRefType,
          authRules,
          false,
        );
        nestedGeneratedTypes.forEach((type) => {
          generatedTypes.add(type);
        });
      }
    } else if (typeDef.type === 'enum') {
      generatedTypes.add(
        `enum ${typeName} {\n  ${typeDef.values.join('\n  ')}\n}`,
      );
    } else if (typeDef?.data?.type === 'ref') {
      const { type: refTargetType } = getRefType(typeDef.data.link, typeName);
    } else if (typeDef.type === 'scalar') {
      generatedTypes.add(`scalar ${typeName}`);
    } else {
      console.warn(`Unexpected type definition for ${typeName}:`, typeDef);
    }
  });

  return Array.from(generatedTypes);
}

const schemaPreprocessor = (
  schema: InternalSchema,
): {
  schema: string;
  jsFunctions: JsResolver[];
  functionSchemaAccess: FunctionSchemaAccess[];
  lambdaFunctions: LambdaFunctionDefinition;
  customSqlDataSourceStrategies?: CustomSqlDataSourceStrategy[];
} => {
  const gqlComponents: string[] = [];
  const customQueries = [];
  const customMutations = [];
  const customSubscriptions = [];
  let shouldAddConversationTypes = false;

  // Dict of auth rules to be applied to custom types
  // Inherited from the auth configured on the custom operations that return these custom types
  const customTypeInheritedAuthRules: Record<
    string,
    Authorization<any, any, any>[]
  > = {};

  const jsFunctions: JsResolver[] = [];
  const lambdaFunctions: LambdaFunctionDefinition = {};
  const customSqlDataSourceStrategies: CustomSqlDataSourceStrategy[] = [];

  const databaseEngine = schema.data.configuration.database.engine;
  const databaseType = databaseEngine === 'dynamodb' ? 'dynamodb' : 'sql';

  const staticSchema = databaseType === 'sql';

  // If the schema contains a custom operation with an async lambda handler,
  // we need to add the EventInvocationResponse custom type to the schema.
  // This is done here so that:
  // - it only happens once per schema
  // - downstream validation based on `getRefTypeForSchema` finds the EventInvocationResponse type
  const containsAsyncLambdaCustomOperation = Object.entries(
    schema.data.types,
  ).find(([_, typeDef]) => {
    return (
      isCustomOperation(typeDef) &&
      finalHandlerIsAsyncFunctionHandler(typeDef.data.handlers)
    );
  });

  if (containsAsyncLambdaCustomOperation) {
    schema.data.types['EventInvocationResponse'] =
      eventInvocationResponseCustomType;
  }

  const topLevelTypes = sortTopLevelTypes(Object.entries(schema.data.types));

  const { schemaAuth, functionSchemaAccess } = extractFunctionSchemaAccess(
    schema.data.authorization,
  );

  const getRefType = getRefTypeForSchema(schema);

  for (const [typeName, typeDef] of topLevelTypes) {
    const mostRelevantAuthRules: Authorization<any, any, any>[] =
      typeDef.data?.authorization?.length > 0
        ? typeDef.data.authorization
        : schemaAuth;

    if (!isInternalModel(typeDef)) {
      if (isEnumType(typeDef)) {
        if (typeDef.values.some((value) => /\s/.test(value))) {
          throw new Error(
            `Values of the enum type ${typeName} should not contain any whitespace.`,
          );
        }
        const enumType = `enum ${typeName} {\n  ${typeDef.values.join('\n  ')}\n}`;
        gqlComponents.push(enumType);
      } else if (isCustomType(typeDef)) {
        const fields = typeDef.data.fields;

        validateRefUseCases(typeName, 'customType', fields, getRefType);

        const fieldAuthApplicableFields = Object.fromEntries(
          Object.entries(fields).filter(
            (pair: [string, unknown]): pair is [string, BaseModelField] =>
              isModelField(pair[1]),
          ),
        );

        let customAuth = '';
        if (typeName in customTypeInheritedAuthRules) {
          const { authString } = mapToNativeAppSyncAuthDirectives(
            customTypeInheritedAuthRules[typeName],
            false,
          );
          customAuth = authString;
        }

        const authFields = {};

        const fieldLevelAuthRules = processFieldLevelAuthRules(
          fieldAuthApplicableFields,
          authFields,
        );

        const { gqlFields, implicitTypes } = processFields(
          typeName,
          fields,
          authFields,
          fieldLevelAuthRules,
          getRefType,
          undefined,
          undefined,
          databaseEngine,
        );
        const existingTypeNames = new Set<string>(
          topLevelTypes.map(([n]) => n),
        );
        for (const [name, type] of implicitTypes) {
          if (!existingTypeNames.has(name)) {
            topLevelTypes.push([name, type]);
            existingTypeNames.add(name);
          }
        }
        const joined = gqlFields.join('\n  ');

        const model = `type ${typeName} ${customAuth}\n{\n  ${joined}\n}`;
        gqlComponents.push(model);
      } else if (isCustomOperation(typeDef)) {
        // TODO: add generation route logic.

        const { typeName: opType } = typeDef.data;

        const {
          gqlField,
          implicitTypes,
          inputTypes: operationInputTypes,
          returnTypes: operationReturnTypes,
          customTypeAuthRules,
          jsFunctionForField,
          lambdaFunctionDefinition,
          customSqlDataSourceStrategy,
        } = transformCustomOperations(
          typeDef,
          typeName,
          mostRelevantAuthRules,
          databaseType,
          getRefType,
        );
        operationInputTypes.forEach((type) => {
          gqlComponents.push(type);
        });
        gqlComponents.push(...operationReturnTypes);

        /**
         * Processes implicit types to generate GraphQL definitions.
         *
         * - Enums are converted to 'enum' definitions and added to the schema.
         * - Custom types are conditionally treated as input types if they are
         *   not part of the operation's return types.
         * - Input types are generated and added to the inputTypes array when required.
         *
         * This ensures that all necessary type definitions, including enums and input types,
         * are correctly generated and available in the schema output.
         */

        implicitTypes.forEach(([typeName, typeDef]) => {
          if (isEnumType(typeDef)) {
            gqlComponents.push(
              `enum ${typeName} {\n  ${typeDef.values.join('\n  ')}\n}`,
            );
          } else {
            const isReturnType = operationReturnTypes.some((returnType) =>
              returnType.includes(typeName),
            );
            if (!isReturnType) {
              const generatedTypes = generateInputTypes(
                [[typeName, typeDef]],
                true,
                getRefType,
              );
              gqlComponents.push(...generatedTypes);
            }
          }
        });

        mergeCustomTypeAuthRules(
          customTypeInheritedAuthRules,
          customTypeAuthRules,
        );

        if (customTypeAuthRules) {
          const nestedCustomTypeNames = extractNestedCustomTypeNames(
            customTypeAuthRules,
            topLevelTypes,
            getRefType,
          );

          for (const nestedCustomType of nestedCustomTypeNames) {
            mergeCustomTypeAuthRules(customTypeInheritedAuthRules, {
              typeName: nestedCustomType,
              authRules: customTypeAuthRules.authRules, // apply the same auth rules as the top-level custom type
            });
          }
        }

        Object.assign(lambdaFunctions, lambdaFunctionDefinition);

        if (jsFunctionForField) {
          jsFunctions.push(jsFunctionForField);
        }

        if (customSqlDataSourceStrategy) {
          customSqlDataSourceStrategies.push(customSqlDataSourceStrategy);
        }

        switch (opType) {
          case 'Query':
          case 'Generation':
            customQueries.push(gqlField);
            break;
          case 'Mutation':
            customMutations.push(gqlField);
            break;
          case 'Subscription':
            customSubscriptions.push(gqlField);
            break;
          default:
            break;
        }
      } else if (isConversationRoute(typeDef)) {
        const { field, functionHandler } = createConversationField(
          typeDef,
          typeName,
        );
        customMutations.push(field);
        Object.assign(lambdaFunctions, functionHandler);
        shouldAddConversationTypes = true;
      }
    } else if (staticSchema) {
      const fields = { ...typeDef.data.fields } as Record<
        string,
        BaseModelField
      >;

      validateRefUseCases(typeName, 'model', fields, getRefType);

      const identifier = typeDef.data.identifier;
      const [partitionKey] = identifier;

      const { authString, authFields } = calculateAuth(mostRelevantAuthRules);

      const fieldLevelAuthRules = processFieldLevelAuthRules(
        fields,
        authFields,
      );

      validateStaticFields(fields, authFields);

      const { gqlFields, implicitTypes } = processFields(
        typeName,
        fields,
        authFields,
        fieldLevelAuthRules,
        getRefType,
        identifier,
        partitionKey,
        undefined,
        databaseEngine,
      );
      const existingTypeNames = new Set<string>(topLevelTypes.map(([n]) => n));
      for (const [name, type] of implicitTypes) {
        if (!existingTypeNames.has(name)) {
          topLevelTypes.push([name, type]);
          existingTypeNames.add(name);
        }
      }
      topLevelTypes.push(...implicitTypes);

      const joined = gqlFields.join('\n  ');
      const refersToString = typeDef.data.originalName
        ? ` @refersTo(name: "${typeDef.data.originalName}")`
        : '';
      // TODO: update @model(timestamps: null) once a longer term solution gets
      // determined.
      //
      // Context: SQL schema should not be automatically inserted with timestamp fields,
      // passing (timestamps: null) to @model to suppress this behavior as a short
      // term solution.
      const model = `type ${typeName} @model(timestamps: null) ${authString}${refersToString}\n{\n  ${joined}\n}`;
      gqlComponents.push(model);
    } else {
      const fields = typeDef.data.fields as Record<string, BaseModelField>;

      validateRefUseCases(typeName, 'model', fields, getRefType);

      const identifier = typeDef.data.identifier;
      const [partitionKey] = identifier;

      const transformedSecondaryIndexes = transformedSecondaryIndexesForModel(
        typeName,
        typeDef.data.secondaryIndexes,
        fields,
        getRefType,
      );

      const { authString, authFields } = calculateAuth(mostRelevantAuthRules);

      if (authString == '') {
        throw new Error(
          `Model \`${typeName}\` is missing authorization rules. Add global rules to the schema or ensure every model has its own rules.`,
        );
      }

      const getInternalModel = (
        modelName: string,
        sourceName?: string,
      ): InternalModel => {
        const model = getRefType(modelName, sourceName);
        if (!isInternalModel(model.def)) {
          throw new Error(`Expected to find model type with name ${modelName}`);
        }
        return model.def;
      };
      validateRelationships(typeName, fields, getInternalModel);

      const fieldLevelAuthRules = processFieldLevelAuthRules(
        fields,
        authFields,
      );

      const { gqlFields, implicitTypes } = processFields(
        typeName,
        fields,
        authFields,
        fieldLevelAuthRules,
        getRefType,
        identifier,
        partitionKey,
        transformedSecondaryIndexes,
        databaseEngine,
      );
      topLevelTypes.push(...implicitTypes);

      const joined = gqlFields.join('\n  ');

      const modelAttrs = modelAttributesFromDisabledOps(
        typeDef.data.disabledOperations,
      );

      const modelDirective = modelAttrs ? `@model(${modelAttrs})` : '@model';

      const model = `type ${typeName} ${modelDirective} ${authString}\n{\n  ${joined}\n}`;
      gqlComponents.push(model);
    }
  }

  const customOperations = {
    queries: customQueries,
    mutations: customMutations,
    subscriptions: customSubscriptions,
  };

  gqlComponents.push(...generateCustomOperationTypes(customOperations));

  if (shouldAddConversationTypes) {
    gqlComponents.push(CONVERSATION_SCHEMA_GRAPHQL_TYPES);
  }
  const processedSchema = gqlComponents.join('\n\n');

  return {
    schema: processedSchema,
    jsFunctions,
    functionSchemaAccess,
    lambdaFunctions,
    customSqlDataSourceStrategies,
  };
};

function validateCustomOperations(
  typeDef: InternalCustom,
  typeName: string,
  authRules: Authorization<any, any, any>[],
  getRefType: ReturnType<typeof getRefTypeForSchema>,
) {
  const { handlers, typeName: opType, subscriptionSource } = typeDef.data;

  const handlerConfigured = handlers?.length;
  const authConfigured = authRules.length > 0;

  if (
    opType !== 'Generation' &&
    ((authConfigured && !handlerConfigured) ||
      (handlerConfigured && !authConfigured))
  ) {
    // Deploying a custom operation with auth and no handler reference OR
    // with a handler reference but no auth
    // causes the CFN stack to reach an unrecoverable state. Ideally, this should be fixed
    // in the CDK construct, but we're catching it early here as a stopgap
    throw new Error(
      `Custom operation ${typeName} requires both an authorization rule and a handler reference`,
    );
  }

  // Handlers must all be of the same type
  if (handlers?.length) {
    const configuredHandlers: Set<string> = new Set();

    for (const handler of handlers) {
      configuredHandlers.add(getBrand(handler));
    }

    if (configuredHandlers.size > 1) {
      configuredHandlers.delete('asyncFunctionHandler');
      configuredHandlers.delete('functionHandler');
      if (configuredHandlers.size > 0) {
        const configuredHandlersStr = JSON.stringify(
          Array.from(configuredHandlers),
        );
        throw new Error(
          `Field handlers must be of the same type. ${typeName} has been configured with ${configuredHandlersStr}`,
        );
      }
    }
  }

  if (
    typeDef.data.returnType === null &&
    (opType === 'Query' || opType === 'Mutation' || opType === 'Generation')
  ) {
    // TODO: There should be a more elegant and readable way to handle this check.
    // Maybe it's not even necessary anymore since we're the setting returnType in the handler() method.
    if (
      !handlers ||
      handlers.length === 0 ||
      handlers[handlers.length - 1][brandSymbol] !== 'asyncFunctionHandler'
    ) {
      const typeDescription =
        opType === 'Generation' ? 'Generation Route' : `Custom ${opType}`;
      throw new Error(
        `Invalid ${typeDescription} definition. A ${typeDescription} must include a return type. ${typeName} has no return type specified.`,
      );
    }
  }

  if (opType !== 'Subscription' && subscriptionSource.length > 0) {
    throw new Error(
      `The .for() modifier function can only be used with a custom subscription. ${typeName} is not a custom subscription.`,
    );
  }

  if (opType === 'Subscription') {
    if (subscriptionSource.length < 1) {
      throw new Error(
        `${typeName} is missing a mutation source. Custom subscriptions must reference a mutation source via subscription().for(a.ref('ModelOrOperationName')) `,
      );
    }

    let expectedReturnType: any | undefined;

    for (const source of subscriptionSource) {
      const sourceName = source.data.link;
      const { type, def } = getRefType(sourceName, typeName);

      if (type !== 'Model' && source.data.mutationOperations.length > 0) {
        throw new Error(
          `Invalid subscription definition. .mutations() modifier can only be used with a Model ref. ${typeName} is referencing ${type}`,
        );
      }

      let resolvedReturnType: any;

      if (type === 'Model') {
        if (source.data.mutationOperations.length === 0) {
          throw new Error(
            `Invalid subscription definition. .mutations() modifier must be used with a Model ref subscription source. ${typeName} is referencing ${sourceName} without specifying a mutation`,
          );
        } else {
          resolvedReturnType = def;
        }
      }

      if (type === 'CustomOperation') {
        if (def.data.typeName !== 'Mutation') {
          throw new Error(
            `Invalid subscription definition. .for() can only reference a mutation. ${typeName} is referencing ${sourceName} which is a ${def.data.typeName}`,
          );
        } else {
          const returnType = def.data.returnType;
          if (isRefField(returnType)) {
            ({ def: resolvedReturnType } = getRefType(
              returnType.data.link,
              typeName,
            ));
          } else {
            resolvedReturnType = returnType;
          }
        }
      }

      expectedReturnType = expectedReturnType ?? resolvedReturnType;

      // As the return types are resolved from the root `schema` object and they should
      // not be mutated, we compare by references here.
      if (expectedReturnType !== resolvedReturnType) {
        throw new Error(
          `Invalid subscription definition. .for() can only reference resources that have the same return type. ${typeName} is referencing resources that have different return types.`,
        );
      }
    }
  }
}

const isSqlReferenceHandler = (
  handler: HandlerType[] | null,
): handler is [SqlReferenceHandler] => {
  return Array.isArray(handler) && getBrand(handler[0]) === 'sqlReference';
};

const isCustomHandler = (
  handler: HandlerType[] | null,
): handler is CustomHandler[] => {
  return Array.isArray(handler) && getBrand(handler[0]) === 'customHandler';
};

const isFunctionHandler = (
  handler: HandlerType[] | null,
): handler is (FunctionHandler | AsyncFunctionHandler)[] => {
  return (
    Array.isArray(handler) &&
    ['functionHandler', 'asyncFunctionHandler'].includes(getBrand(handler[0]))
  );
};

const finalHandlerIsAsyncFunctionHandler = (
  handler: HandlerType[] | null,
): handler is AsyncFunctionHandler[] => {
  return (
    Array.isArray(handler) &&
    getBrand(handler[handler.length - 1]) === 'asyncFunctionHandler'
  );
};

const normalizeDataSourceName = (
  dataSource: undefined | string | RefType<any, any, any>,
): string => {
  // default data source
  const noneDataSourceName = 'NONE_DS';

  if (dataSource === undefined) {
    return noneDataSourceName;
  }

  if (dataSourceIsRef(dataSource)) {
    return `${(dataSource as InternalRef).data.link}Table`;
  }

  return dataSource;
};

const sanitizeStackTrace = (stackTrace: string): string[] => {
  // normalize EOL to \n so that parsing is consistent across platforms
  const normalizedStackTrace = stackTrace.replace(new RegExp(os.EOL), '\n');
  return (
    normalizedStackTrace
      .split('\n')
      .map((line) => line.trim())
      // filters out noise not relevant to the stack trace. All stack trace lines begin with 'at'
      .filter((line) => line.startsWith('at')) || []
  );
};

// copied from the defineFunction path resolution impl:
// https://github.com/aws-amplify/amplify-backend/blob/main/packages/backend-function/src/get_caller_directory.ts
const resolveEntryPath = (
  data: CustomPathData,
  errorMessage: string,
): JsResolverEntry => {
  if (path.isAbsolute(data.entry)) {
    return data.entry;
  }

  if (!data.stack) {
    throw new Error(errorMessage);
  }

  const stackTraceLines = sanitizeStackTrace(data.stack);

  if (stackTraceLines.length < 2) {
    throw new Error(errorMessage);
  }

  const stackTraceImportLine = stackTraceLines[1]; // the first entry is the file where the error was initialized (our code). The second entry is where the customer called our code which is what we are interested in

  // if entry is relative, compute with respect to the caller directory
  return { relativePath: data.entry, importLine: stackTraceImportLine };
};

const handleCustom = (
  handlers: CustomHandler[],
  opType: JsResolver['typeName'],
  typeName: string,
) => {
  const transformedHandlers = handlers.map((handler) => {
    const handlerData = getHandlerData(handler);

    return {
      dataSource: normalizeDataSourceName(handlerData.dataSource),
      entry: resolveEntryPath(
        handlerData,
        'Could not determine import path to construct absolute code path for custom handler. Consider using an absolute path instead.',
      ),
    };
  });

  const jsFn: JsResolver = {
    typeName: opType,
    fieldName: typeName,
    handlers: transformedHandlers,
  };

  return jsFn;
};

const eventInvocationResponseCustomType = {
  data: {
    fields: {
      success: {
        data: {
          fieldType: ModelFieldType.Boolean,
          required: true,
          array: false,
          arrayRequired: false,
        },
      },
    },
    type: 'customType',
  },
};

function transformCustomOperations(
  typeDef: InternalCustom,
  typeName: string,
  authRules: Authorization<any, any, any>[],
  databaseType: DatabaseType,
  getRefType: ReturnType<typeof getRefTypeForSchema>,
) {
  const { typeName: opType, handlers } = typeDef.data;

  let jsFunctionForField: JsResolver | undefined = undefined;

  validateCustomOperations(typeDef, typeName, authRules, getRefType);

  if (isCustomHandler(handlers)) {
    jsFunctionForField = handleCustom(
      handlers,
      // Generation routes should not have handlers
      opType as Exclude<typeof opType, 'Generation'>,
      typeName,
    );
  }

  const isCustom = Boolean(jsFunctionForField);

  const {
    gqlField,
    implicitTypes,
    inputTypes,
    returnTypes,
    customTypeAuthRules,
    lambdaFunctionDefinition,
    customSqlDataSourceStrategy,
  } = customOperationToGql(
    typeName,
    typeDef,
    authRules,
    isCustom,
    databaseType,
    getRefType,
  );

  return {
    gqlField,
    implicitTypes,
    inputTypes,
    returnTypes,
    customTypeAuthRules,
    jsFunctionForField,
    lambdaFunctionDefinition,
    customSqlDataSourceStrategy,
  };
}

function generateCustomOperationTypes({
  queries,
  mutations,
  subscriptions,
}: CustomOperationFields): string[] {
  const types: string[] = [];

  if (mutations.length > 0) {
    types.push(`type Mutation {\n  ${mutations.join('\n  ')}\n}`);
  }

  if (queries.length > 0) {
    types.push(`type Query {\n  ${queries.join('\n  ')}\n}`);
  }

  if (subscriptions.length > 0) {
    types.push(`type Subscription {\n  ${subscriptions.join('\n  ')}\n}`);
  }

  return types;
}

function extractNestedCustomTypeNames(
  customTypeAuthRules: CustomTypeAuthRules,
  topLevelTypes: [string, any][],
  getRefType: ReturnType<typeof getRefTypeForSchema>,
): string[] {
  if (!customTypeAuthRules || !topLevelTypes || topLevelTypes.length === 0) {
    return [];
  }
  const foundType = topLevelTypes.find(
    ([topLevelTypeName]) => customTypeAuthRules.typeName === topLevelTypeName,
  );

  if (!foundType) {
    return [];
  }

  const [_, customTypeDef] = topLevelTypes.find(
    ([topLevelTypeName]) => customTypeAuthRules.typeName === topLevelTypeName,
  )!;

  // traverse the custom type's fields and extract any nested custom type names.
  // Those nested custom types also inherit the custom op's auth configuration.
  // Supports both inline custom types and refs to custom types
  const traverseCustomTypeFields = (
    name: string,
    typeDef: any,
    namesList: string[] = [],
  ) => {
    const fields = typeDef.data.fields as Record<string, any>;

    for (const [fieldName, fieldDef] of Object.entries(fields)) {
      if (isCustomType(fieldDef)) {
        const customTypeName = `${capitalize(name)}${capitalize(fieldName)}`;
        namesList.push(customTypeName);
        traverseCustomTypeFields(customTypeName, fieldDef, namesList);
      } else if (isRefField(fieldDef)) {
        const refType = getRefType(fieldDef.data.link, name);

        if (refType.type === 'CustomType') {
          namesList.push(fieldDef.data.link);
          traverseCustomTypeFields(fieldDef.data.link, refType.def, namesList);
        }
      }
    }

    return namesList;
  };

  const nestedCustomTypeNames = traverseCustomTypeFields(
    customTypeAuthRules.typeName,
    customTypeDef,
  );

  return nestedCustomTypeNames;
}

/**
 * Validates that defined relationships conform to the following rules.
 * - relationships are bidirectional
 *   - hasOne has a belongsTo counterpart
 *   - hasMany has a belongsTo counterpart
 *   - belongsTo has either a hasOne or hasMany counterpart
 * - both sides of a relationship have identical `references` defined.
 * - the `references` match the primary key of the parent model
 *   - references[0] is the primaryKey's partitionKey on the parent model
 *   - references[1...n] are the primaryKey's sortKey(s) on the parent model
 *   - types match (id / string / number)
 * - the `references` are fields defined on the child model
 *   - field names match the named `references` arguments
 *   - child model references fields types match those of the parent model's primaryKey
 * @param typeName source model's type name.
 * @param record map of field name to {@link ModelField}
 * @param getInternalModel given a model name, return an {@link InternalModel}
 */
function validateRelationships(
  typeName: string,
  record: Record<string, ModelField<any, any>>,
  getInternalModel: (
    modelName: string,
    referringModelName?: string,
  ) => InternalModel,
) {
  for (const [name, field] of Object.entries(record)) {
    // If the field's type is not a model, there's no relationship
    // to evaluate and we can skip this iteration.
    if (!isModelField(field)) {
      continue;
    }

    // Create a structure representing the relationship for validation.
    const relationship = getModelRelationship(
      typeName,
      { name: name, def: field.data },
      getInternalModel,
    );

    // Validate that the references defined in the relationship follow the
    // relationship definition rules.
    validateRelationshipReferences(relationship);
  }
}

/**
 * Helper function that describes the relationship of a given connection field for use in logging or error messages.
 *
 * `Parent.child: Child @hasMany(references: ['parentId'])`
 * -- or --
 * `Child.parent: Parent @belongsTo(references: ['parentId'])`
 * @param sourceField The {@link ConnectionField} to describe.
 * @param sourceModelName The name of the model within which the sourceField is defined.
 * @returns a 'string' describing the relationship
 */
function describeConnectFieldRelationship(
  sourceField: ConnectionField,
  sourceModelName: string,
): string {
  const associatedTypeDescription = sourceField.def.array
    ? `[${sourceField.def.relatedModel}]`
    : sourceField.def.relatedModel;
  const referencesDescription =
    sourceField.def.references
      .reduce(
        (description, reference) => description + `'${reference}', `,
        'references: [',
      )
      .slice(0, -2) + ']';
  return `${sourceModelName}.${sourceField.name}: ${associatedTypeDescription} @${sourceField.def.type}(${referencesDescription})`;
}

/**
 * Validates that the types of child model's reference fields match the types of the parent model's identifier fields.
 * @param relationship The {@link ModelRelationship} to validate.
 */
function validateRelationshipReferences(relationship: ModelRelationship) {
  const {
    parent,
    parentConnectionField,
    child,
    childConnectionField,
    references,
  } = relationship;
  const parentIdentifiers = getIndentifierTypes(parent);

  const childReferenceTypes: ModelFieldType[] = [];
  // Iterate through the model schema defined 'references' to find each matching field on the Related model.
  // If a field by that name is not found, throw a validate error.
  // Accumulate the ModelFieldType for each reference field to validate matching types below.
  for (const reference of references) {
    const relatedReferenceType = child.data.fields[reference]?.data
      .fieldType as ModelFieldType;
    // reference field on related type with name passed to references not found. Time to throw a validation error.
    if (!relatedReferenceType) {
      const errorMessage =
        `reference field '${reference}' must be defined on ${parentConnectionField.def.relatedModel}. ` +
        describeConnectFieldRelationship(
          parentConnectionField,
          childConnectionField.def.relatedModel,
        ) +
        ' <-> ' +
        describeConnectFieldRelationship(
          childConnectionField,
          parentConnectionField.def.relatedModel,
        );
      throw new Error(errorMessage);
    }
    childReferenceTypes.push(relatedReferenceType);
  }

  if (parentIdentifiers.length !== childReferenceTypes.length) {
    throw new Error(
      `The identifiers defined on ${childConnectionField.def.relatedModel} must match the reference fields defined on ${parentConnectionField.def.relatedModel}.\n` +
        `${parentIdentifiers.length} identifiers defined on ${childConnectionField.def.relatedModel}.\n` +
        `${childReferenceTypes.length} reference fields found on ${parentConnectionField.def.relatedModel}`,
    );
  }

  const matchingModelFieldType = (
    a: ModelFieldType,
    b: ModelFieldType,
  ): boolean => {
    // `String` and `Id` are considered equal types for when comparing
    // the child model's references fields with their counterparts within
    // the parent model's identifier (parent key) fields.
    const matching = [ModelFieldType.Id, ModelFieldType.String];
    return a === b || (matching.includes(a) && matching.includes(b));
  };

  // Zip pairs of child model's reference field with corresponding parent model's identifier field.
  // Confirm that the types match. If they don't, throw a validation error.
  parentIdentifiers
    .map((identifier, index) => [identifier, childReferenceTypes[index]])
    .forEach(([parent, child]) => {
      if (!matchingModelFieldType(parent, child)) {
        throw new Error('Validate Error: types do not match');
      }
    });
}

/**
 * Internal convenience type that contains the name of the connection field along with
 * its {@link ModelFieldDef}.
 */
type ConnectionField = {
  name: string;
  def: ModelFieldDef;
};

/**
 * An internal representation of a model relationship used by validation functions.
 * Use {@link getModelRelationship} to create this.
 * See {@link validateRelationshipReferences} for validation example.
 */
type ModelRelationship = {
  /**
   * The model that is referred to by the child.
   */
  parent: InternalModel;

  /**
   * The field on the parent into which the child model(s) is/are populated.
   */
  parentConnectionField: ConnectionField;

  /**
   * The model that refers to the parent.
   */
  child: InternalModel;

  /**
   * The field on the child into which the parent is loaded.
   */
  childConnectionField: ConnectionField;

  /**
   * The field names on the child that refer to the parent's PK.
   *
   * Both sides of the relationship must identify these "references" fields which
   * names the child FK fields. So, regardless of which side of the relationship
   * is explored, if the relationship definition is valid, these fields will be
   * the same.
   */
  references: string[];
};

/**
 * Relationship definitions require bi-directionality.
 * Use this to generate a `ModelRelationshipTypes[]` containing acceptable counterparts on the
 * associated model.
 *
 * Given {@link ModelRelationshipTypes.hasOne} or {@link ModelRelationshipTypes.hasOne} returns [{@link ModelRelationshipTypes.belongsTo}]
 * Given {@link ModelRelationshipTypes.belongsTo} returns [{@link ModelRelationshipTypes.hasOne}, {@link ModelRelationshipTypes.belongsTo}]
 *
 * @param relationshipType {@link ModelRelationshipTypes} defined on source model's connection field.
 * @returns possible counterpart {@link ModelRelationshipTypes} as `ModelRelationshipTypes[]`
 */
function associatedRelationshipTypes(
  relationshipType: ModelRelationshipTypes,
): ModelRelationshipTypes[] {
  switch (relationshipType) {
    case ModelRelationshipTypes.hasOne:
    case ModelRelationshipTypes.hasMany:
      return [ModelRelationshipTypes.belongsTo];
    case ModelRelationshipTypes.belongsTo:
      return [ModelRelationshipTypes.hasOne, ModelRelationshipTypes.hasMany];
    default:
      return []; // TODO: Remove this case on types are updated.
  }
}

/**
 * Retrieves the types of the identifiers defined on a model.
 *
 * Note: if a field by the name `id` isn't found in the {@link InternalModel},
 * this assumes an implicitly generated identifier is used with the type.
 *
 * This function does not validate that a corresponding field exists for each of the
 * identifiers because this validation happens at compile time.
 * @param model {@link InternalModel} from which to retrieve identifier types.
 * @returns Array of {@link ModelFieldType} of the model's identifiers found.
 */
function getIndentifierTypes(model: InternalModel): ModelFieldType[] {
  return model.data.identifier.flatMap((fieldName) => {
    const field = model.data.fields[fieldName];
    if (field) {
      return [field.data.fieldType as ModelFieldType];
    } else if (fieldName === 'id') {
      // implicity generated ID
      return [ModelFieldType.Id];
    }
    return [];
  });
}

/**
 * Given a relationship definition within a source model (`sourceModelName`, `sourceConnectionField`) and
 * the associated model (`associatedModel`), this finds the connection field for the relationship defined on the
 * associated model. Invalid states, such a 0 or >1 matching connection fields result in an error.
 * @param sourceModelName
 * @param sourceConnectionField
 * @param associatedModel
 * @returns
 */
function getAssociatedConnectionField(
  sourceModelName: string,
  sourceConnectionField: ConnectionField,
  associatedModel: InternalModel,
): ConnectionField {
  const associatedRelationshipOptions = associatedRelationshipTypes(
    sourceConnectionField.def.type,
  );
  // Iterate through the associated model's fields to find the associated connection field for the relationship defined on the source model.
  const associatedConnectionFieldCandidates = Object.entries(
    associatedModel.data.fields,
  ).filter(([_key, connectionField]) => {
    // If the field isn't a model, it's not part of the relationship definition -- ignore the field.
    if (!isModelField(connectionField)) {
      return false;
    }

    // In order to find that associated connection field, we need to do some validation that we'll depend on further downstream.
    // 1. Field type matches the source model's type.
    // 2. A valid counterpart relationship modifier is defined on the field. See `associatedRelationshipTypes` for more information.
    // 3. The reference arguments provided to the field match (element count + string comparison) references passed to the source connection field.
    return (
      connectionField.data.relatedModel === sourceModelName &&
      associatedRelationshipOptions.includes(connectionField.data.type) &&
      connectionField.data.references.length ===
        sourceConnectionField.def.references.length &&
      connectionField.data.references.every(
        (value, index) => value === sourceConnectionField.def.references[index],
      )
    );
  });

  // We should have found exactly one connection field candidate. If that's not the case, we need to throw a validation error.
  if (associatedConnectionFieldCandidates.length != 1) {
    // const associatedModelDescription = sourceConnectionField.def.array
    // ? `[${sourceConnectionField.def.relatedModel}]`
    // : sourceConnectionField.def.relatedModel
    const sourceConnectionFieldDescription = describeConnectFieldRelationship(
      sourceConnectionField,
      sourceModelName,
    ); // `${sourceModelName}.${sourceConnectionField.name}: ${associatedModelDescription} @${sourceConnectionField.def.type}(references: [${sourceConnectionField.def.references}])`
    const errorMessage =
      associatedConnectionFieldCandidates.length === 0
        ? `Unable to find associated relationship definition in ${sourceConnectionField.def.relatedModel}`
        : `Found multiple relationship associations with ${associatedConnectionFieldCandidates.map((field) => `${sourceConnectionField.def.relatedModel}.${field[0]}`).join(', ')}`;
    throw new Error(`${errorMessage} for ${sourceConnectionFieldDescription}`);
  }

  const associatedConnectionField = associatedConnectionFieldCandidates[0];
  if (!isModelField(associatedConnectionField[1])) {
    // This shouldn't happen because we've validated that it's a model field above.
    // However it's necessary to narrow the type.
    // const associatedModelDescription = sourceConnectionField.def.array
    // ? `[${sourceConnectionField.def.relatedModel}]`
    // : sourceConnectionField.def.relatedModel
    const sourceConnectionFieldDescription = describeConnectFieldRelationship(
      sourceConnectionField,
      sourceModelName,
    );
    const errorMessage = `Cannot find counterpart to relationship defintion for ${sourceConnectionFieldDescription}`;
    throw new Error(errorMessage);
  }

  return {
    name: associatedConnectionField[0],
    def: associatedConnectionField[1].data,
  };
}

/**
 * Given either side of a relationship (source), this retrieves the other side (related)
 * and packages the information neatly into a {@link ModelRelationship} for validation purposes.
 *
 * @param sourceModelName
 * @param sourceConnectionField
 * @param getInternalModel
 * @returns a {@link ModelRelationship}
 */
function getModelRelationship(
  sourceModelName: string,
  sourceModelConnectionField: ConnectionField,
  getInternalModel: (
    modelName: string,
    referringModelName?: string,
  ) => InternalModel,
): ModelRelationship {
  const sourceModel = getInternalModel(sourceModelName, sourceModelName);
  const associatedModel = getInternalModel(
    sourceModelConnectionField.def.relatedModel,
    sourceModelName,
  );

  const relatedModelConnectionField = getAssociatedConnectionField(
    sourceModelName,
    sourceModelConnectionField,
    associatedModel,
  );

  switch (sourceModelConnectionField.def.type) {
    case ModelRelationshipTypes.hasOne:
    case ModelRelationshipTypes.hasMany:
      return {
        parent: sourceModel,
        parentConnectionField: sourceModelConnectionField,
        child: associatedModel,
        childConnectionField: relatedModelConnectionField,
        references: sourceModelConnectionField.def.references,
      };
    case ModelRelationshipTypes.belongsTo:
      return {
        parent: associatedModel,
        parentConnectionField: relatedModelConnectionField,
        child: sourceModel,
        childConnectionField: sourceModelConnectionField,
        references: sourceModelConnectionField.def.references,
      };
    default:
      throw new Error(
        `"${sourceModelConnectionField.def.type}" is not a valid relationship type.`,
      );
  }
}

/**
 *
 * @param disabledOps
 * @returns sanitized string @model directive attribute; can be passed in as-is
 *
 * @example
 * ```ts
 * const disabledOps = ["subscriptions", "create"];
 * ```
 * returns
 * ```
 * subscriptions:null,mutations:{create:null}
 * ```
 */
function modelAttributesFromDisabledOps(
  disabledOps: ReadonlyArray<DisableOperationsOptions>,
) {
  const fineCoarseMap: Record<string, string> = {
    onCreate: 'subscriptions',
    onUpdate: 'subscriptions',
    onDelete: 'subscriptions',
    create: 'mutations',
    update: 'mutations',
    delete: 'mutations',
    list: 'queries',
    get: 'queries',
  };

  const coarseGrainedOps = ['queries', 'mutations', 'subscriptions'];

  const coarseFirstSorted = disabledOps
    // disabledOps is readOnly; create a copy w/ slice
    .slice()
    .sort((a: DisableOperationsOptions, b: DisableOperationsOptions) => {
      if (coarseGrainedOps.includes(a) && !coarseGrainedOps.includes(b)) {
        return -1;
      }

      if (!coarseGrainedOps.includes(a) && coarseGrainedOps.includes(b)) {
        return 1;
      }

      return 0;
    });

  const modelAttrs: Record<string, null | Record<string, null>> = {};

  for (const op of coarseFirstSorted) {
    if (coarseGrainedOps.includes(op)) {
      modelAttrs[op] = null;
      continue;
    }

    const coarseOp = fineCoarseMap[op];

    if (modelAttrs[coarseOp] !== null) {
      modelAttrs[coarseOp] = modelAttrs[coarseOp] || {};

      modelAttrs[coarseOp]![op] = null;
    }
  }

  const modelAttrsStr = JSON.stringify(modelAttrs)
    .replace(/"/g, '') // remove quotes
    .slice(1, -1); // drop outer curlies {}

  return modelAttrsStr;
}

/**
 * Returns API definition from ModelSchema or string schema
 * @param arg - { schema }
 * @returns DerivedApiDefinition that conforms to IAmplifyGraphqlDefinition
 */
export function processSchema(arg: {
  schema: InternalSchema;
}): DerivedApiDefinition {
  const {
    schema,
    jsFunctions,
    functionSchemaAccess,
    lambdaFunctions,
    customSqlDataSourceStrategies,
  } = schemaPreprocessor(arg.schema);

  return {
    schema,
    functionSlots: [],
    jsFunctions,
    functionSchemaAccess,
    lambdaFunctions,
    customSqlDataSourceStrategies,
  };
}
