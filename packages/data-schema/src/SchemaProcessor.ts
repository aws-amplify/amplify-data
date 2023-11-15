import type { InternalSchema } from './ModelSchema';
import {
  type ModelField,
  ModelFieldType,
  type InternalField,
  id,
  string,
  datetime,
} from './ModelField';
import {
  type InternalRelationalField,
  ModelRelationshipTypes,
} from './ModelRelationalField';
import type { ModelType, InternalModel } from './ModelType';
import { Authorization, accessData } from './Authorization';
import { DerivedApiDefinition } from './types';
import type { InternalRef } from './RefType';
import type { EnumType } from './EnumType';
import type { CustomType } from './CustomType';
import { type InternalCustom, CustomOperationNames } from './CustomOperation';
import { Brand } from '@aws-amplify/data-schema-types';

type ScalarFieldDef = Exclude<InternalField['data'], { fieldType: 'model' }>;
type ModelFieldDef = Extract<
  InternalRelationalField['data'],
  { fieldType: 'model' }
>;
type RefFieldDef = InternalRef['data'];

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

function isCustomType(data: any): data is CustomType<any> {
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
  return isModelFieldDef((field as any).data);
}

function isScalarField(
  field: ModelField<any, any>,
): field is Brand<{ data: ScalarFieldDef }, 'modelField'> {
  return isScalarFieldDef((field as any).data);
}

function isRefField(
  field: ModelField<any, any>,
): field is Brand<{ data: RefFieldDef }, 'modelField'> {
  return isRefFieldDef((field as any).data);
}

function scalarFieldToGql(fieldDef: ScalarFieldDef, identifier?: string[]) {
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
      field += ` @primaryKey(sortKeyFields: ${JSON.stringify(sk)})`;
    } else {
      field += ' @primaryKey';
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

  field += ` @${type}`;

  // TODO: accept other relationship options e.g. `fields`
  if (type === 'manyToMany') {
    field += `(relationName: "${relationName}")`;
  }

  return field;
}

function refFieldToGql(fieldDef: RefFieldDef) {
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
): { gqlField: string; models: [string, any][] } {
  const {
    arguments: fieldArgs,
    returnType,
    authorization,
    functionRef,
  } = typeDef.data;

  const { authString } = calculateAuth(authorization);

  const resolvedArg = refFieldToGql(returnType.data);

  let sig: string = typeName;
  let implicitModels: [string, any][] = [];

  if (Object.keys(fieldArgs).length > 0) {
    const { gqlFields, models } = processFields(fieldArgs, {});
    sig += `(${gqlFields.join(', ')})`;
    implicitModels = models;
  }

  const fnString = functionRef ? `@function(name: "${functionRef}") ` : '';

  const gqlField = `${sig}: ${resolvedArg} ${fnString}${authString}`;
  return { gqlField, models: implicitModels };
}

// function mergeFieldDefinitions(fields: Record<string, any>): Record<string, any> {
// }

// function areConflicting(left: ModelFieldDef);

// function addFields(
//   fields: Record<string, ModelField<any, any>>,
//   additions: Record<string, ModelField<any, any>>,
// ): Record<LeftKeys | RightKeys, LeftValues | RightValues> {
//   const o: any = { ...fields };
//   for (const [k, addition] of Object.entries(additions)) {
//     const existing = o[k];
//     if (!existing) {
//       o[k] = addition;
//     } else if (areConflicting(existing, addition)) {
//       throw new Error(`Field ${k} defined twice with conflicting definitions.`);
//     }
//   }
// }

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
        authFields[rule.groupOrOwnerField] = string().array();
      } else {
        authFields[rule.groupOrOwnerField] = string();
      }
    }

    // for (const [name, value] of Object.entries(authFields)) {
    //   console.log(name, (value as any).data);
    // }

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

function capitalize<T extends string>(s: T): Capitalize<T> {
  return `${s[0].toUpperCase()}${s.slice(1)}` as any;
}

function uncapitalize<T extends string>(s: T): Uncapitalize<T> {
  return `${s[0].toLowerCase()}${s.slice(1)}` as any;
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
  fields: Record<string, InternalModel>,
  authFields: Record<string, ModelField<any, any>>,
) {
  const fieldLevelAuthRules: {
    [k in keyof typeof fields]: string | null;
  } = {};

  for (const [fieldName, fieldDef] of Object.entries(fields)) {
    const { authString, authFields: fieldAuthField } = calculateAuth(
      fieldDef?.data?.authorization || [],
    );

    if (authString) fieldLevelAuthRules[fieldName] = authString;
    if (fieldAuthField) {
      Object.assign(authFields, fieldAuthField);
    }
  }

  return fieldLevelAuthRules;
}

function processFields(
  fields: Record<string, ModelField<any, any>>,
  fieldLevelAuthRules: Record<string, string | null>,
  identifier?: string[],
  partitionKey?: string,
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
          )}${fieldAuth}`,
        );
      } else if (isRefField(fieldDef)) {
        gqlFields.push(
          `${fieldName}: ${refFieldToGql(fieldDef.data)}${fieldAuth}`,
        );
      } else if (isEnumType(fieldDef)) {
        const enumName = capitalize(fieldName);

        models.push([enumName, fieldDef]);

        gqlFields.push(`${fieldName}: ${enumName}`);
      } else if (isCustomType(fieldDef)) {
        const customTypeName = capitalize(fieldName);

        models.push([customTypeName, fieldDef]);

        gqlFields.push(`${fieldName}: ${customTypeName}`);
      } else {
        gqlFields.push(
          `${fieldName}: ${scalarFieldToGql(
            (fieldDef as any).data,
          )}${fieldAuth}`,
        );
      }
    } else {
      throw new Error(`Unexpected field definition: ${fieldDef}`);
    }
  }

  return { gqlFields, models };
}

const schemaPreprocessor = (schema: InternalSchema): string => {
  const gqlModels: string[] = [];

  const customQueries = [];
  const customMutations = [];
  const customSubscriptions = [];

  const fkFields = allImpliedFKs(schema);
  const topLevelTypes = Object.entries(schema.data.types);

  for (const [typeName, typeDef] of topLevelTypes) {
    if (!isInternalModel(typeDef)) {
      if (isEnumType(typeDef)) {
        const enumType = `enum ${typeName} {\n  ${typeDef.values.join(
          '\n  ',
        )}\n}`;
        gqlModels.push(enumType);
      } else if (isCustomType(typeDef)) {
        const fields = typeDef.data.fields;

        const authString = '';
        const authFields = {};

        const fieldLevelAuthRules = processFieldLevelAuthRules(
          fields,
          authFields,
        );

        const { gqlFields, models } = processFields(
          fields,
          fieldLevelAuthRules,
        );

        topLevelTypes.push(...models);

        const joined = gqlFields.join('\n  ');

        const model = `type ${typeName} ${authString}\n{\n  ${joined}\n}`;
        gqlModels.push(model);
      } else if (isCustomOperation(typeDef)) {
        const { typeName: opType } = (typeDef as InternalCustom).data;

        const { gqlField, models } = customOperationToGql(typeName, typeDef);

        topLevelTypes.push(...models);

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
      const fields = {
        ...typeDef.data.fields,
        ...fkFields[typeName],
      };
      const identifier = typeDef.data.identifier;
      const [partitionKey] = identifier;

      const mostRelevantAuthRules =
        typeDef.data.authorization.length > 0
          ? typeDef.data.authorization
          : schema.data.authorization;

      const { authString, authFields } = calculateAuth(mostRelevantAuthRules);

      const fieldLevelAuthRules = processFieldLevelAuthRules(
        fields,
        authFields,
      );

      const { gqlFields, models } = processFields(
        {
          // idFields first, so they can be overridden by customer definitions when present.
          ...idFields(typeDef),
          ...fields,
          ...authFields,
          ...implicitTimestampFields(typeDef),
        },
        fieldLevelAuthRules,
        identifier,
        partitionKey,
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

  return processedSchema;
};

type CustomOperationFields = {
  queries: string[];
  mutations: string[];
  subscriptions: string[];
};

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
  const schema = schemaPreprocessor(arg.schema);

  return { schema, functionSlots: [] };
}
