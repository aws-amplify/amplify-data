import {
  CustomSqlDataSourceStrategy,
  DerivedApiDefinition,
  FunctionSchemaAccess,
  JsResolver,
  JsResolverEntry,
  LambdaFunctionDefinition,
} from '@aws-amplify/data-schema-types';
import * as os from 'os';
import * as path from 'path';
import {
  accessData,
  accessSchemaData,
  type Authorization,
  type ResourceAuthorization,
  type SchemaAuthorization,
} from './Authorization';
import { CustomOperationNames, type InternalCustom } from './CustomOperation';
import type {
  CustomType,
  CustomTypeAllowedModifiers,
  CustomTypeParamShape,
} from './CustomType';
import type { EnumType } from './EnumType';
import {
  FunctionHandler,
  getHandlerData,
  type CustomHandler,
  type HandlerType,
  type SqlReferenceHandler,
} from './Handler';
import {
  ModelFieldType,
  ModelFieldTypeParamOuter,
  string,
  type InternalField,
  type ModelField
} from './ModelField';
import type { InternalModelIndexType } from './ModelIndex';
import {
  ModelRelationshipTypes,
  type InternalRelationalField
} from './ModelRelationalField';
import { type CustomPathData, type InternalSchema } from './ModelSchema';
import { type InternalModel, type ModelType } from './ModelType';
import type { InternalRef, RefType } from './RefType';
import { Brand, getBrand } from './util';

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

function refFieldToGql(fieldDef: RefFieldDef): string {
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

  return field;
}

function transformFunctionHandler(
  handlers: FunctionHandler[],
  callSignature: string,
): {
  gqlHandlerContent: string;
  lambdaFunctionDefinition: LambdaFunctionDefinition;
} {
  let gqlHandlerContent = '';
  const lambdaFunctionDefinition: LambdaFunctionDefinition = {};

  handlers.forEach((handler, idx) => {
    const handlerData = getHandlerData(handler);

    if (typeof handlerData === 'string') {
      gqlHandlerContent += `@function(name: "${handlerData}") `;
    } else if (typeof handlerData.getInstance === 'function') {
      const fnBaseName = `Fn${capitalize(callSignature)}`;
      const fnNameSuffix = idx === 0 ? '' : `${idx + 1}`;
      const fnName = fnBaseName + fnNameSuffix;

      lambdaFunctionDefinition[fnName] = handlerData;
      gqlHandlerContent += `@function(name: "${fnName}") `;
    } else {
      throw new Error(
        `Invalid value specified for ${callSignature} handler.function(). Expected: defineFunction or string.`,
      );
    }
  });

  return { gqlHandlerContent, lambdaFunctionDefinition };
}

function customOperationToGql(
  typeName: string,
  typeDef: InternalCustom,
  authorization: Authorization<any, any, any>[],
  isCustom = false,
  databaseType: DatabaseType,
  getRefType: ReturnType<typeof getRefTypeForSchema>,
): {
  gqlField: string;
  models: [string, any][];
  lambdaFunctionDefinition: LambdaFunctionDefinition;
  customSqlDataSourceStrategy: CustomSqlDataSourceStrategy | undefined;
} {
  const {
    arguments: fieldArgs,
    typeName: opType,
    returnType,
    functionRef,
    handlers,
    subscriptionSource,
  } = typeDef.data;

  let callSignature: string = typeName;
  const implicitModels: [string, any][] = [];

  const { authString } = isCustom
    ? calculateCustomAuth(authorization)
    : calculateAuth(authorization);

  /**
   *
   * @param returnType The return type from the `data` field of a customer operation.
   * @param refererTypeName The type the refers {@link returnType} by `a.ref()`.
   * @param shouldAddCustomTypeToImplicitModels A flag indicates wether it should push
   * the return type resolved CustomType to the `implicitModels` list.
   * @returns
   */
  const resolveReturnTypeNameFromReturnType = (
    returnType: any,
    {
      refererTypeName,
      shouldAddCustomTypeToImplicitModels = true,
    }: {
      refererTypeName: string;
      shouldAddCustomTypeToImplicitModels?: boolean;
    },
  ): string => {
    if (isRefField(returnType)) {
      return refFieldToGql(returnType?.data);
    } else if (isCustomType(returnType)) {
      const returnTypeName = `${capitalize(refererTypeName)}ReturnType`;
      if (shouldAddCustomTypeToImplicitModels) {
        implicitModels.push([returnTypeName, returnType]);
      }
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
          shouldAddCustomTypeToImplicitModels: false,
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

  if (Object.keys(fieldArgs).length > 0) {
    const { gqlFields, models } = processFields(typeName, fieldArgs, {}, {});
    callSignature += `(${gqlFields.join(', ')})`;
    implicitModels.push(...models);
  }

  const handler = handlers && handlers[0];
  const brand = handler && getBrand(handler);

  let gqlHandlerContent = '';
  let lambdaFunctionDefinition: LambdaFunctionDefinition = {};
  let customSqlDataSourceStrategy: CustomSqlDataSourceStrategy | undefined;

  if (isFunctionHandler(handlers)) {
    ({ gqlHandlerContent, lambdaFunctionDefinition } = transformFunctionHandler(
      handlers,
      callSignature,
    ));
  } else if (functionRef) {
    gqlHandlerContent = `@function(name: "${functionRef}") `;
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

  const gqlField = `${callSignature}: ${returnTypeName} ${gqlHandlerContent}${authString}`;
  return {
    gqlField,
    models: implicitModels,
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
 * Validate that no implicit fields are used by the model definition
 *
 * @param existing An existing field map
 * @param implicitFields A field map inferred from other schema usage
 *
 * @throws An error when an undefined field is used or when a field is used in a way that conflicts with its generated definition
 */
function validateStaticFields(
  existing: Record<string, ModelField<any, any>>,
  implicitFields: Record<string, ModelField<any, any>> | undefined,
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
  existing: Record<string, ModelField<any, any>>,
  implicitFields: Record<string, ModelField<any, any>> | undefined,
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

// func validateBidirectionality

/**
 * Validates that defined relationships are valid
 * - relationships are bidirectional
 *  - hasOne has a belongsTo counterpart
 *  - hasMany has a belongsTo counterpart
 *  - belongsTo has either a hasOne or hasMany counterpart
 * - both sides of a relationship have identical `references` defined.
 * - the `references` match the primary key of the Primary model
 *  - references[0] is the primaryKey's paritionKey on the Primary model
 *  - references[1...n] are the primaryKey's sortKey(s) on the Primary model
 *  - types match (id / string / number)
 * - the `references` are fields defined on the Related model
 *  - field names match the named `references` arguments
 *  - Related model references fields types match those of the Primary model's primaryKey
 *
 * @param record
 */
function validateRelationships(
  typeName: string,
  record: Record<string, ModelField<any, any>>,
  getRef: (source: string, target: string) => GetRef,
) {
  for (const [name, field] of Object.entries(record)) {
    // If the field's type is not a model, there's no relationship
    // to evaluate and we can skip this iteration.
    if (!isModelField(field)) {
      continue;
    }

    const relationship = getModelRelationship(
      typeName,
      { name: name, def: field.data },
      field.data.relatedModel,
      getRef,
    )

    validateRelationalReferences(relationship);
  }
}

/**
 * Helper function that describes the relationship for use in logging or error messages.
 *
 * `Primary.related: Related @hasMany(references: ['primaryId']) <-> Related.primary: Primary @belongsTo(references: ['primaryId'])`
 * @param relationship The {@link ModelRelationship} to describe.
 * @returns a 'string' describing the relationship
 */
function prettifyRelationshipDescription(relationship: ModelRelationship): string {
  const { primaryConnectionField, relatedConnectionField, references } = relationship;
  const primaryModelName = relatedConnectionField.def.relatedModel;
  const relatedModelName = primaryConnectionField.def.relatedModel;
  const primaryConnectionFieldType = primaryConnectionField.def.array
    ? `[${relatedModelName}]`
    : relatedModelName;

  const referencesDescription = references
    .reduce((description, reference) => description + `'${reference}', `, 'references: [')
    .slice(0, -2) + ']'

  return `${primaryModelName}.${primaryConnectionField.name}: ${primaryConnectionFieldType} @${primaryConnectionField.def.type}(${referencesDescription})`
  + ' <-> '
  + `${relatedModelName}.${relatedConnectionField.name}: ${primaryModelName} @${relatedConnectionField.def.type}(${referencesDescription})`;
}

/**
 * Validates that the types of Related model's reference fields match the types of the Primary model's identifier fields.
 * @param relationship The {@link ModelRelationship} to validate.
 */
function validateRelationalReferences(
  relationship: ModelRelationship,
) {
  const { primary, primaryConnectionField, related, relatedConnectionField, references } = relationship;
  const primaryIdentifiers = getIndentifierTypes(primary);

  const relatedReferenceTypes: ModelFieldType[] = [];
  // Iterate through the model schema defined 'references' to find each matching field on the Related model.
  // If a field by that name is not found, throw a validate error.
  // Accumulate the ModelFieldType for each reference field to validate matching types below.
  for (const reference of references) {
    const relatedReferenceType = related.data.fields[reference]?.data.fieldType as ModelFieldType
    // reference field on related type with name passed to references not found. Time to throw a validation error.
    if (!relatedReferenceType) {
      const errorMessage = `Validation Error: reference field '${reference}' must be defined on ${primaryConnectionField.def.relatedModel}. `
      + `${prettifyRelationshipDescription(relationship)}`;
      throw new Error(errorMessage);
    }
    relatedReferenceTypes.push(relatedReferenceType);
  }

  if (primaryIdentifiers.length !== relatedReferenceTypes.length) {
    // TODO: better error message
    throw new Error(`references defined '${relatedConnectionField.def.references}' do not match`)
  }

  const matchingModelFieldType = (a: ModelFieldType, b: ModelFieldType): boolean => {
    // `String` and `Id` are considered equal types for when comparing
    // the Related model's references fields with their counterparts within
    // the Primary model's identifier (primary key) fields.
    const matching = [ModelFieldType.Id, ModelFieldType.String];
    return a === b
      || matching.includes(a) && matching.includes(b);
  }

  // Zip pairs of Related model's reference field with corresponding Primary model's identifier field.
  // Confirm that the types match. If they don't, throw a validation error.
  primaryIdentifiers
    .map((identifier, index) => [identifier, relatedReferenceTypes[index]])
    .forEach(([primary, related]) => {
    if (!matchingModelFieldType(primary, related)) {
      throw new Error('Validate Error: types do not match');
    }
  })
}

type ConnectionField = {
  name: string,
  def: ModelFieldDef,
}

type ModelRelationship = {
  primary: InternalModel,
  primaryConnectionField: ConnectionField
  related: InternalModel,
  relatedConnectionField: ConnectionField,
  references: string[],
}

function associatedRelationshipTypes(relationshipType: ModelRelationshipTypes): ModelRelationshipTypes[] {
  switch (relationshipType) {
    case ModelRelationshipTypes.hasOne:
    case ModelRelationshipTypes.hasMany:
      return [ModelRelationshipTypes.belongsTo];
    case ModelRelationshipTypes.belongsTo:
      return [ModelRelationshipTypes.hasOne, ModelRelationshipTypes.hasMany];
    case ModelRelationshipTypes.manyToMany:
      return []; // TODO: Remove this case
  }
}

function getIndentifierTypes(model: InternalModel): ModelFieldType[] {
  return model.data.identifier.flatMap((field) => {
    const primaryField = model.data.fields[field];
    if (primaryField) {
      return [primaryField.data.fieldType as ModelFieldType];
    } else if (field === 'id') {
      // implicity generated ID
      return [ModelFieldType.Id];
    }
    return [];
  });
}

function getAssociatedConnectionField(
  sourceModelName: string,
  sourceConnectionField: ConnectionField,
  associatedModel: InternalModel
): ConnectionField {
  const associatedRelationshipOptions = associatedRelationshipTypes(sourceConnectionField.def.type);
  const associatedConnectionFieldCandidates = Object.entries(associatedModel.data.fields).filter(([_key, connectionField]) => {
    if (!isModelField(connectionField)) {
      return false;
    }

    return connectionField.data.relatedModel === sourceModelName
      && associatedRelationshipOptions.includes(connectionField.data.type)
      && connectionField.data.references.length === sourceConnectionField.def.references.length
      && connectionField.data.references.every((value, index) => value === sourceConnectionField.def.references[index]);
  });

  if (associatedConnectionFieldCandidates.length !== 1) {
    // TODO better error message with context.
    throw new Error('Validation Error: cannot find counterpart to relationship definition')
  }

  const associatedConnectionField = associatedConnectionFieldCandidates[0];
  if (!isModelField(associatedConnectionField[1])) {
    throw new Error('Validation Error: cannot find counterpart to relationship definition');
  }

  return { name: associatedConnectionField[0], def: associatedConnectionField[1].data };
}

function getModelRelationship(
  sourceModelName: string,
  sourceConnectionField: { name: string, def: ModelFieldDef },
  associatedModelName: string,
  getRef: (source: string, target: string) => GetRef
): ModelRelationship {
  const sourceModel = getRef(sourceModelName, '').def;
  const associatedModel = getRef(associatedModelName, '').def;
  if (!isInternalModel(sourceModel) || !isInternalModel(associatedModel)) {
    throw new Error('is not internal model -- TODO: determine failure scenarios');
  }

  const associatedConnectionField = getAssociatedConnectionField(
    sourceModelName,
    sourceConnectionField,
    associatedModel,
  );

  switch (sourceConnectionField.def.type) {
    case ModelRelationshipTypes.hasOne:
    case ModelRelationshipTypes.hasMany:
      return {
        primary: sourceModel,
        primaryConnectionField: sourceConnectionField,
        related: associatedModel,
        relatedConnectionField: associatedConnectionField,
        references: sourceConnectionField.def.references,
      }
    case ModelRelationshipTypes.belongsTo:
      return {
        primary: associatedModel,
        primaryConnectionField: associatedConnectionField,
        related: sourceModel,
        relatedConnectionField: sourceConnectionField,
        references: sourceConnectionField.def.references,
      }
    case ModelRelationshipTypes.manyToMany:
      throw new Error('many to many') // TODO: Remove me
  }
}


/**
 * Throws if resource/lambda auth is configured at the model or field level
 *
 * @param authorization A list of authorization rules.
 */
function validateAuth(authorization: Authorization<any, any, any>[] = []) {
  for (const entry of authorization) {
    if (ruleIsResourceAuth(entry)) {
      throw new Error(
        'Lambda resource authorization is only confiugrable at the schema level',
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

function processFieldLevelAuthRules(
  fields: Record<string, ModelField<any, any>>,
  authFields: Record<string, ModelField<any, any>>,
) {
  const fieldLevelAuthRules: {
    [k in keyof typeof fields]: string | null;
  } = {};

  for (const [fieldName, fieldDef] of Object.entries(fields)) {
    const fieldAuth = (fieldDef as InternalField)?.data?.authorization || [];

    validateAuth(fieldAuth);
    const { authString, authFields: fieldAuthField } = calculateAuth(fieldAuth);

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
  impliedFields: Record<string, any>,
  fieldLevelAuthRules: Record<string, string | null>,
  identifier?: string[],
  partitionKey?: string,
  secondaryIndexes: TransformedSecondaryIndexes = {},
) {
  const gqlFields: string[] = [];
  const models: [string, any][] = [];

  validateImpliedFields(fields, impliedFields);

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
  const getRefType = (source: string, target: string): GetRef => {
    const typeDef = schema.data.types[source];

    if (typeDef === undefined) {
      throw new Error(
        `Invalid ref. ${target} is referencing ${source} which is not defined in the schema`,
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
      `Invalid ref. ${target} is referencing ${source} which is neither a Model, Custom Operation, Custom Type, or Enum`,
    );
  };

  return getRefType;
};

const schemaPreprocessor = (
  schema: InternalSchema,
): {
  schema: string;
  jsFunctions: JsResolver[];
  functionSchemaAccess: FunctionSchemaAccess[];
  lambdaFunctions: LambdaFunctionDefinition;
  customSqlDataSourceStrategies?: CustomSqlDataSourceStrategy[];
} => {
  const gqlModels: string[] = [];

  const customQueries = [];
  const customMutations = [];
  const customSubscriptions = [];

  const jsFunctions: JsResolver[] = [];
  let lambdaFunctions: LambdaFunctionDefinition = {};
  const customSqlDataSourceStrategies: CustomSqlDataSourceStrategy[] = [];

  const databaseType =
    schema.data.configuration.database.engine === 'dynamodb'
      ? 'dynamodb'
      : 'sql';

  const staticSchema =
    schema.data.configuration.database.engine === 'dynamodb' ? false : true;
  const topLevelTypes = Object.entries(schema.data.types);

  const { schemaAuth, functionSchemaAccess } = extractFunctionSchemaAccess(
    schema.data.authorization,
  );

  const getRefType = getRefTypeForSchema(schema);

  for (const [typeName, typeDef] of topLevelTypes) {
    validateAuth(typeDef.data?.authorization);
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
          authFields,
          fieldLevelAuthRules,
        );

        topLevelTypes.push(...models);

        const joined = gqlFields.join('\n  ');

        const model = `type ${typeName} ${authString}\n{\n  ${joined}\n}`;
        gqlModels.push(model);
      } else if (isCustomOperation(typeDef)) {
        const { typeName: opType } = typeDef.data;

        const {
          gqlField,
          models,
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

        lambdaFunctions = lambdaFunctionDefinition;

        topLevelTypes.push(...models);

        if (jsFunctionForField) {
          jsFunctions.push(jsFunctionForField);
        }

        if (customSqlDataSourceStrategy) {
          customSqlDataSourceStrategies.push(customSqlDataSourceStrategy);
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
    } else if (staticSchema) {
      const fields = { ...typeDef.data.fields } as Record<
        string,
        ModelField<any, any>
      >;
      const identifier = typeDef.data.identifier;
      const [partitionKey] = identifier;

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

      validateStaticFields(fields, authFields);

      const { gqlFields, models } = processFields(
        typeName,
        fields,
        authFields,
        fieldLevelAuthRules,
        identifier,
        partitionKey,
      );

      topLevelTypes.push(...models);

      const joined = gqlFields.join('\n  ');

      const model = `type ${typeName} @model ${authString}\n{\n  ${joined}\n}`;
      gqlModels.push(model);
    } else {
      const fields = typeDef.data.fields as Record<string, ModelField<any, any>>;
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

      validateRelationships(typeName, fields, getRefType);

      const fieldLevelAuthRules = processFieldLevelAuthRules(
        fields,
        authFields,
      );

      const { gqlFields, models } = processFields(
        typeName,
        fields,
        authFields,
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
  const {
    functionRef,
    handlers,
    typeName: opType,
    subscriptionSource,
  } = typeDef.data;

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
): handler is FunctionHandler[] => {
  return Array.isArray(handler) && getBrand(handler[0]) === 'functionHandler';
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
    jsFunctionForField = handleCustom(handlers, opType, typeName);
  }

  const isCustom = Boolean(jsFunctionForField);

  const {
    gqlField,
    models,
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
    models,
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
