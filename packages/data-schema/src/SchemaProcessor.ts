import type { InternalSchema } from './ModelSchema';
import {
  type ModelField,
  ModelFieldType,
  type InternalField,
  id,
  string,
  datetime,
  ModelFieldTypeParamOuter,
} from './ModelField';
import {
  type InternalRelationalField,
  ModelRelationshipTypes,
} from './ModelRelationalField';
import type { ModelType, InternalModel } from './ModelType';
import type { InternalModelIndexType } from './ModelIndex';
import { Authorization, accessData } from './Authorization';
import {
  DerivedApiDefinition,
  JsResolver,
  JsResolverEntry,
} from '@aws-amplify/data-schema-types';
import type { InternalRef, RefType } from './RefType';
import type { EnumType } from './EnumType';
import type {
  CustomType,
  CustomTypeAllowedModifiers,
  CustomTypeParamShape,
} from './CustomType';
import { type InternalCustom, CustomOperationNames } from './CustomOperation';
import { Brand, getBrand } from './util';
import {
  getHandlerData,
  type HandlerType,
  type CustomHandler,
  type CustomHandlerData,
} from './Handler';
import * as os from 'os';
import * as path from 'path';

type ScalarFieldDef = Exclude<InternalField['data'], { fieldType: 'model' }>;

type ModelFieldDef = Extract<
  InternalRelationalField['data'],
  { fieldType: 'model' }
>;

type RefFieldDef = InternalRef['data'];

type CustomOperationFields = {
  queries: string[];
  mutations: string[];
  subscriptions: string[];
};

function isInternalModel(model: ModelType<any, any>): model is InternalModel {
  if (
    (model as any).data &&
    !isCustomType(model) &&
    !isCustomOperation(model)
  ) {
    return true;
  }
  return false;
}

function isEnumType(
  data: any,
): data is EnumType<{ type: 'enum'; values: string[] }> {
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
  field: ModelField<any, any>,
): field is { data: ScalarFieldDef } & Brand<'modelField'> {
  return isScalarFieldDef((field as any)?.data);
}

function isRefField(
  field: ModelField<any, any>,
): field is { data: RefFieldDef } & Brand<'modelField'> {
  return isRefFieldDef((field as any)?.data);
}

function scalarFieldToGql(
  fieldDef: ScalarFieldDef,
  identifier?: string[],
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

  if (_default !== undefined) {
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
    relationName,
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

  // TODO: accept other relationship options e.g. `fields`
  if (type === 'manyToMany') {
    field += `(relationName: "${relationName}")`;
  }

  return field;
}

function refFieldToGql(fieldDef: RefFieldDef): string {
  const { link, required } = fieldDef;

  let field = link;

  if (required === true) {
    field += '!';
  }

  // if (array) {
  //   field = `[${field}]`;
  // }

  // if (arrayRequired === true) {
  //   field += '!';
  // }

  return field;
}

function customOperationToGql(
  typeName: string,
  typeDef: InternalCustom,
  authorization: Authorization<any, any, any>[],
  isCustom = false,
  databaseType: DatabaseType,
): { gqlField: string; models: [string, any][] } {
  const {
    arguments: fieldArgs,
    returnType,
    functionRef,
    handlers,
  } = typeDef.data;

  let callSignature: string = typeName;
  const implicitModels: [string, any][] = [];

  const { authString } = isCustom
    ? calculateCustomAuth(authorization)
    : calculateAuth(authorization);

  let returnTypeName: string;

  if (isRefField(returnType)) {
    returnTypeName = refFieldToGql(returnType?.data);
  } else if (isCustomType(returnType)) {
    returnTypeName = `${capitalize(typeName)}ReturnType`;
    implicitModels.push([returnTypeName, returnType]);
  } else if (isScalarField(returnType)) {
    returnTypeName = scalarFieldToGql(returnType?.data);
  } else {
    throw new Error(`Unrecognized return type on ${typeName}`);
  }

  if (Object.keys(fieldArgs).length > 0) {
    const { gqlFields, models } = processFields(typeName, fieldArgs, {});
    callSignature += `(${gqlFields.join(', ')})`;
    implicitModels.push(...models);
  }

  const handler = handlers && handlers[0];
  const brand = handler && getBrand(handler);

  let gqlHandlerContent = '';

  if (functionRef) {
    gqlHandlerContent = `@function(name: "${functionRef}") `;
  } else if (databaseType === 'sql' && handler && brand === 'inlineSql') {
    gqlHandlerContent = `@sql(statement: "${escapeGraphQlString(
      String(getHandlerData(handler)),
    )}") `;
  } else if (databaseType === 'sql' && handler && brand === 'sqlReference') {
    gqlHandlerContent = `@sql(reference: "${getHandlerData(handler)}") `;
  }
  const gqlField = `${callSignature}: ${returnTypeName} ${gqlHandlerContent}${authString}`;

  return { gqlField, models: implicitModels };
}

/**
 * Escape a string that will be used inside of a graphql string.
 * @param str The input string to be escaped
 * @returns The string with special charactars escaped
 */
function escapeGraphQlString(str: string) {
  return str.replace(/"/g, '\\"');
}

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
function areConflicting(
  left: ModelField<any, any>,
  right: ModelField<any, any>,
): boolean {
  // These are the only props we care about for this comparison, because the others
  // (required, arrayRequired, etc) are not specified on auth or FK directives.
  const relevantProps = ['array', 'fieldType'] as const;
  for (const prop of relevantProps) {
    if (
      (left as InternalField).data[prop] !== (right as InternalField).data[prop]
    ) {
      return true;
    }
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
  existing: Record<string, ModelField<any, any>>,
  additions: Record<string, ModelField<any, any>>,
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
 * Produces a new field definition object from every field definition object
 * given as an argument. Performs validation (conflict detection) as objects
 * are merged together.
 *
 * @param fieldsObjects A list of field definition objects to merge.
 * @returns
 */
function mergeFieldObjects(
  ...fieldsObjects: (Record<string, ModelField<any, any>> | undefined)[]
): Record<string, ModelField<any, any>> {
  const result: Record<string, ModelField<any, any>> = {};
  for (const fields of fieldsObjects) {
    if (fields) addFields(result, fields);
  }
  return result;
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
 * The computed fields are intended to be aggregated and injected per model.
 *
 * @param authorization A list of authorization rules.
 * @returns
 */
function calculateAuth(authorization: Authorization<any, any, any>[]) {
  const authFields: Record<string, ModelField<any, any>> = {};
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
      ruleParts.push(`provider: ${rule.provider}`);
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

function validateCustomAuthRule(rule: AuthRule) {
  if (rule.operations) {
    throw new Error(
      '.to() modifier is not supported for custom queries/mutations',
    );
  }

  if (rule.groupOrOwnerField) {
    throw new Error(
      'Dynamic auth (owner or dynamic groups) is not supported for custom queries/mutations',
    );
  }

  // identityClaim
  if (rule.identityClaim) {
    throw new Error(
      'identityClaim attr is not supported with a.handler.custom',
    );
  }

  // groupClaim
  if (rule.groupClaim) {
    throw new Error('groupClaim attr is not supported with a.handler.custom');
  }

  if (rule.groups && rule.provider === 'oidc') {
    throw new Error('OIDC group auth is not supported with a.handler.custom');
  }
}

function getCustomAuthProvider(rule: AuthRule): string {
  const strategyDict: Record<string, Record<string, string>> = {
    public: {
      default: '@aws_api_key',
      apiKey: '@aws_api_key',
      iam: '@aws_iam',
    },
    private: {
      default: '@aws_cognito_user_pools',
      userPools: '@aws_cognito_user_pools',
      oidc: '@aws_oidc',
      iam: '@aws_iam',
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

function calculateCustomAuth(authorization: Authorization<any, any, any>[]) {
  const rules: string[] = [];

  for (const entry of authorization) {
    const rule = accessData(entry);

    validateCustomAuthRule(rule);
    const provider = getCustomAuthProvider(rule);

    if (rule.groups) {
      // example: (cognito_groups: ["Bloggers", "Readers"])
      rules.push(
        `${provider}(cognito_groups: [${rule.groups
          .map((group) => `"${group}"`)
          .join(', ')}])`,
      );
    } else {
      rules.push(provider);
    }
  }

  const authString = rules.join(' ');

  return { authString };
}

function capitalize<T extends string>(s: T): Capitalize<T> {
  return `${s[0].toUpperCase()}${s.slice(1)}` as Capitalize<T>;
}

function uncapitalize<T extends string>(s: T): Uncapitalize<T> {
  return `${s[0].toLowerCase()}${s.slice(1)}` as Uncapitalize<T>;
}

function fkName(model: string, field: string, identifier: string): string {
  return `${uncapitalize(model)}${capitalize(field)}${capitalize(identifier)}`;
}

/**
 * Returns all explicitly defined and implied fields from a model.
 *
 * @param schema The schema the model is part of. Necessary to derive implied FK's.
 * @param model The model to extract fields from and derive fields for.
 * @returns
 */
const allImpliedFKs = (schema: InternalSchema) => {
  const fks = {} as Record<string, Record<string, any>>;

  function addFk({
    onModel,
    asField,
    fieldDef,
  }: {
    onModel: string;
    asField: string;
    fieldDef: any;
  }) {
    fks[onModel] = fks[onModel] || {};
    fks[onModel][asField] = fieldDef;
  }

  // implied FK's
  for (const [modelName, typeDef] of Object.entries(schema.data.types)) {
    if (!isInternalModel(typeDef)) continue;
    for (const [fieldName, fieldDef] of Object.entries(typeDef.data.fields)) {
      if (!isModelField(fieldDef)) continue;
      const relatedModel = schema.data.types[fieldDef.data.relatedModel];
      switch (fieldDef.data.type) {
        case ModelRelationshipTypes.hasOne:
          for (const idField of relatedModel.data.identifier) {
            addFk({
              onModel: modelName,
              asField: fkName(modelName, fieldName, idField),
              fieldDef: {
                data: {
                  ...fieldDef.data,
                  fieldType:
                    relatedModel.data.fields[idField]?.data.fieldType ||
                    ModelFieldType.Id,
                },
              },
            });
          }
          break;
        case ModelRelationshipTypes.hasMany:
          {
            let authorization: Authorization<any, any, any>[] = [];
            let required = false;
            const [_belongsToName, belongsToDef] =
              Object.entries(relatedModel.data.fields).find(([_name, def]) => {
                return (
                  isModelField(def) &&
                  def.data.type === ModelRelationshipTypes.belongsTo &&
                  def.data.relatedModel === fieldName
                );
              }) || [];
            if (belongsToDef && isModelField(belongsToDef)) {
              authorization = belongsToDef.data.authorization;
              required = belongsToDef.data.valueRequired;
            }

            for (const idField of typeDef.data.identifier) {
              addFk({
                onModel: fieldDef.data.relatedModel,
                asField: fkName(modelName, fieldName, idField),
                fieldDef: {
                  data: {
                    ...(typeDef.data.fields[idField]?.data ||
                      (id() as any).data),
                    authorization,
                    required,
                  },
                },
              });
            }
          }
          break;
        case ModelRelationshipTypes.belongsTo:
          {
            // only create if corresponds to hasOne
            const [_hasOneName, hasOneDef] =
              Object.entries(relatedModel.data.fields).find(([_name, def]) => {
                return (
                  isModelField(def) &&
                  def.data.type === ModelRelationshipTypes.hasOne &&
                  def.data.relatedModel === modelName
                );
              }) || [];
            if (hasOneDef && isModelField(hasOneDef)) {
              for (const idField of relatedModel.data.identifier) {
                addFk({
                  onModel: modelName,
                  asField: fkName(modelName, fieldName, idField),
                  fieldDef: {
                    data: {
                      ...typeDef.data,
                      fieldType:
                        relatedModel.data.fields[idField]?.data.fieldType ||
                        ModelFieldType.Id,
                    },
                  },
                });
              }
            }
          }
          break;
        case ModelRelationshipTypes.manyToMany:
          // pretty sure there's nothing to do here.
          // the implicit join table already has everything, AFAIK.
          break;
        default:
        // nothing to do.
      }
    }
  }

  return fks;
};

/**
 * Determines if implicit date fields are in effect for a given model. If they are,
 * returns those implicit fields.
 *
 * NOTE: For now, we *only* support the default implicit fields.
 *
 * @param _model Model to find date fields for.
 */
const implicitTimestampFields = (
  _model: InternalModel,
): Record<string, ModelField<any, any>> => {
  return {
    createdAt: datetime().required(),
    updatedAt: datetime().required(),
  };
};

/**
 * Generates default Pk fields for a model, based on identifier designation.
 *
 * The fields from this function are just default values. They should be overridden
 * by ID field definitions that are explicit in the model.
 *
 * @param _model Model to find PK fields for.
 */
const idFields = (
  model: InternalModel,
): Record<string, ModelField<any, any>> => {
  const fields: Record<string, ModelField<any, any>> = {};
  for (const fieldName of model.data.identifier) {
    fields[fieldName] = id().required();
  }
  return fields;
};

function processFieldLevelAuthRules(
  fields: Record<string, ModelField<any, any>>,
  authFields: Record<string, ModelField<any, any>>,
) {
  const fieldLevelAuthRules: {
    [k in keyof typeof fields]: string | null;
  } = {};

  for (const [fieldName, fieldDef] of Object.entries(fields)) {
    const { authString, authFields: fieldAuthField } = calculateAuth(
      (fieldDef as InternalField)?.data?.authorization || [],
    );

    if (authString) fieldLevelAuthRules[fieldName] = authString;
    if (fieldAuthField) {
      addFields(authFields, fieldAuthField);
    }
  }

  return fieldLevelAuthRules;
}

function processFields(
  typeName: string,
  fields: Record<string, any>,
  fieldLevelAuthRules: Record<string, string | null>,
  identifier?: string[],
  partitionKey?: string,
  secondaryIndexes: TransformedSecondaryIndexes = {},
) {
  const gqlFields: string[] = [];
  const models: [string, any][] = [];

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
            fieldDef.data,
            identifier,
            secondaryIndexes[fieldName],
          )}${fieldAuth}`,
        );
      } else if (isRefField(fieldDef)) {
        gqlFields.push(
          `${fieldName}: ${refFieldToGql(fieldDef.data)}${fieldAuth}`,
        );
      } else if (isEnumType(fieldDef)) {
        // The inline enum type name should be `<TypeName><FieldName>` to avoid
        // enum type name conflicts
        const enumName = `${capitalize(typeName)}${capitalize(fieldName)}`;

        models.push([enumName, fieldDef]);

        gqlFields.push(`${fieldName}: ${enumName}`);
      } else if (isCustomType(fieldDef)) {
        // The inline CustomType name should be `<TypeName><FieldName>` to avoid
        // CustomType name conflicts
        const customTypeName = `${capitalize(typeName)}${capitalize(
          fieldName,
        )}`;

        models.push([customTypeName, fieldDef]);

        gqlFields.push(`${fieldName}: ${customTypeName}`);
      } else {
        gqlFields.push(
          `${fieldName}: ${scalarFieldToGql(
            (fieldDef as any).data,
            undefined,
            secondaryIndexes[fieldName],
          )}${fieldAuth}`,
        );
      }
    } else {
      throw new Error(`Unexpected field definition: ${fieldDef}`);
    }
  }

  return { gqlFields, models };
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
  pk: string,
  sk?: readonly string[],
): string => {
  const skName = sk?.length ? 'And' + sk?.map(capitalize).join('And') : '';

  const queryField = `listBy${capitalize(pk)}${skName}`;

  return queryField;
};

/**
 * Given InternalModelIndexType[] returns a map where the key is the model field to be annotated with an @index directive
 * and the value is an array of transformed Amplify @index directives with all supplied attributes
 */
const transformedSecondaryIndexesForModel = (
  secondaryIndexes: readonly InternalModelIndexType[],
): TransformedSecondaryIndexes => {
  const indexDirectiveWithAttributes = (
    partitionKey: string,
    sortKeys: readonly string[],
    indexName: string,
    queryField: string,
  ): string => {
    if (!sortKeys.length && !indexName && !queryField) {
      return `@index(queryField: "${secondaryIndexDefaultQueryField(
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

const schemaPreprocessor = (
  schema: InternalSchema,
): { schema: string; jsFunctions: any[] } => {
  const gqlModels: string[] = [];

  const customQueries = [];
  const customMutations = [];
  const customSubscriptions = [];

  const jsFunctions: JsResolver[] = [];

  const databaseType =
    schema.data.configuration.database.engine === 'dynamodb'
      ? 'dynamodb'
      : 'sql';

  const fkFields = allImpliedFKs(schema);
  const topLevelTypes = Object.entries(schema.data.types);

  for (const [typeName, typeDef] of topLevelTypes) {
    const mostRelevantAuthRules: Authorization<any, any, any>[] =
      typeDef.data?.authorization?.length > 0
        ? typeDef.data.authorization
        : schema.data.authorization;

    if (!isInternalModel(typeDef)) {
      if (isEnumType(typeDef)) {
        if (typeDef.values.some((value) => /\s/.test(value))) {
          throw new Error(
            `Values of the enum type ${typeName} should not contain any whitespace.`,
          );
        }
        const enumType = `enum ${typeName} {\n  ${typeDef.values.join(
          '\n  ',
        )}\n}`;
        gqlModels.push(enumType);
      } else if (isCustomType(typeDef)) {
        const fields = typeDef.data.fields;
        const fieldAuthApplicableFields = Object.fromEntries(
          Object.entries(fields).filter(
            (
              pair: [string, unknown],
            ): pair is [
              string,
              ModelField<
                ModelFieldTypeParamOuter,
                CustomTypeAllowedModifiers,
                any
              >,
            ] => isModelField(pair[1]),
          ),
        );

        const authString = '';
        const authFields = {};

        const fieldLevelAuthRules = processFieldLevelAuthRules(
          fieldAuthApplicableFields,
          authFields,
        );

        const { gqlFields, models } = processFields(
          typeName,
          fields,
          fieldLevelAuthRules,
        );

        topLevelTypes.push(...models);

        const joined = gqlFields.join('\n  ');

        const model = `type ${typeName} ${authString}\n{\n  ${joined}\n}`;
        gqlModels.push(model);
      } else if (isCustomOperation(typeDef)) {
        const { typeName: opType } = typeDef.data;

        const { gqlField, models, jsFunctionForField } =
          transformCustomOperations(
            typeDef,
            typeName,
            mostRelevantAuthRules,
            databaseType,
          );

        topLevelTypes.push(...models);

        if (jsFunctionForField) {
          jsFunctions.push(jsFunctionForField);
        }

        switch (opType) {
          case 'Query':
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
      }
    } else {
      const fields = mergeFieldObjects(
        typeDef.data.fields as Record<string, ModelField<any, any>>,
        fkFields[typeName],
      );
      const identifier = typeDef.data.identifier;
      const [partitionKey] = identifier;

      const transformedSecondaryIndexes = transformedSecondaryIndexesForModel(
        typeDef.data.secondaryIndexes,
      );

      const { authString, authFields } = calculateAuth(mostRelevantAuthRules);

      if (authString == '') {
        throw new Error(
          `Model \`${typeName}\` is missing authorization rules. Add global rules to the schema or ensure every model has its own rules.`,
        );
      }

      const fieldLevelAuthRules = processFieldLevelAuthRules(
        fields,
        authFields,
      );

      const { gqlFields, models } = processFields(
        typeName,
        {
          // ID fields are not merged outside `mergeFieldObjects` to skip
          // validation, because the `identifer()` method doesn't specify or
          // care what the underlying field type is. We should always just defer
          // to whatever is explicitly defined if there's an overlap.
          ...idFields(typeDef),
          ...mergeFieldObjects(
            fields,
            authFields,
            implicitTimestampFields(typeDef),
          ),
        },
        fieldLevelAuthRules,
        identifier,
        partitionKey,
        transformedSecondaryIndexes,
      );
      topLevelTypes.push(...models);

      const joined = gqlFields.join('\n  ');

      const model = `type ${typeName} @model ${authString}\n{\n  ${joined}\n}`;
      gqlModels.push(model);
    }
  }

  const customOperations = {
    queries: customQueries,
    mutations: customMutations,
    subscriptions: customSubscriptions,
  };

  gqlModels.push(...generateCustomOperationTypes(customOperations));

  const processedSchema = gqlModels.join('\n\n');

  return { schema: processedSchema, jsFunctions };
};

function validateCustomOperations(
  typeDef: InternalCustom,
  typeName: string,
  authRules: Authorization<any, any, any>[],
) {
  const { functionRef, handlers } = typeDef.data;

  // TODO: remove `functionRef` after deprecating
  const handlerConfigured = functionRef !== null || handlers?.length;
  const authConfigured = authRules.length > 0;

  if (
    (authConfigured && !handlerConfigured) ||
    (handlerConfigured && !authConfigured)
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
      const configuredHandlersStr = JSON.stringify(
        Array.from(configuredHandlers),
      );
      throw new Error(
        `Field handlers must be of the same type. ${typeName} has been configured with ${configuredHandlersStr}`,
      );
    }
  }
}

const isCustomHandler = (
  handler: HandlerType[] | null,
): handler is CustomHandler[] => {
  return Array.isArray(handler) && getBrand(handler[0]) === 'customHandler';
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
  const normalizedStackTrace = stackTrace.replaceAll(os.EOL, '\n');
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
const resolveCustomHandlerEntryPath = (
  data: CustomHandlerData,
): JsResolverEntry => {
  if (path.isAbsolute(data.entry)) {
    return data.entry;
  }

  const unresolvedImportLocationError = new Error(
    'Could not determine import path to construct absolute code path for custom handler. Consider using an absolute path instead.',
  );

  if (!data.stack) {
    throw unresolvedImportLocationError;
  }

  const stackTraceLines = sanitizeStackTrace(data.stack);

  if (stackTraceLines.length < 2) {
    throw unresolvedImportLocationError;
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
      entry: resolveCustomHandlerEntryPath(handlerData),
    };
  });

  const jsFn: JsResolver = {
    typeName: opType,
    fieldName: typeName,
    handlers: transformedHandlers,
  };

  return jsFn;
};

function transformCustomOperations(
  typeDef: InternalCustom,
  typeName: string,
  authRules: Authorization<any, any, any>[],
  databaseType: DatabaseType,
) {
  const { typeName: opType, handlers } = typeDef.data;
  let jsFunctionForField: JsResolver | undefined = undefined;

  validateCustomOperations(typeDef, typeName, authRules);

  if (isCustomHandler(handlers)) {
    jsFunctionForField = handleCustom(handlers, opType, typeName);
  }

  const isCustom = Boolean(jsFunctionForField);

  const { gqlField, models } = customOperationToGql(
    typeName,
    typeDef,
    authRules,
    isCustom,
    databaseType,
  );

  return { gqlField, models, jsFunctionForField };
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

/**
 * Returns API definition from ModelSchema or string schema
 * @param arg - { schema }
 * @returns DerivedApiDefinition that conforms to IAmplifyGraphqlDefinition
 */
export function processSchema(arg: {
  schema: InternalSchema;
}): DerivedApiDefinition {
  const { schema, jsFunctions } = schemaPreprocessor(arg.schema);

  return { schema, functionSlots: [], jsFunctions };
}
