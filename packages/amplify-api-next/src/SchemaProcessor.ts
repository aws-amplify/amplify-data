import type { InternalSchema } from './ModelSchema';
import {
  type ModelField,
  ModelFieldType,
  type InternalField,
  id,
  string,
} from './ModelField';
import {
  type InternalRelationalField,
  ModelRelationshipTypes,
} from './ModelRelationalField';
import type { ModelType, InternalModel } from './ModelType';
import { Authorization, __data } from './Authorization';
import { DerivedApiDefinition } from './types';
import type { InternalRef } from './RefType';
import type { EnumType } from './EnumType';
import type { CustomType } from './CustomType';

type ScalarFieldDef = Exclude<InternalField['data'], { fieldType: 'model' }>;
type ModelFieldDef = Extract<
  InternalRelationalField['data'],
  { fieldType: 'model' }
>;
type RefFieldDef = InternalRef['data'];

function isInternalModel(model: ModelType<any, any>): model is InternalModel {
  if ((model as any).data && (model as any).data?.type !== 'customType') {
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
): field is { data: ScalarFieldDef } {
  return isScalarFieldDef((field as any).data);
}

function isRefField(
  field: ModelField<any, any>,
): field is { data: RefFieldDef } {
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

function calculateAuth(authorization: Authorization<any, any>[]) {
  const authFields: Record<string, ModelField<any, any>> = {};
  const rules: string[] = [];

  for (const entry of authorization) {
    const rule = entry[__data];
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
            let authorization: Authorization<any, any>[] = [];
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
  authFields: Record<string, ModelField<any, any>>,
  fieldLevelAuthRules: Record<string, string | null>,
  identifier?: string[],
  partitionKey?: string,
) {
  const gqlFields: string[] = [];
  const models: [string, any][] = [];

  for (const [fieldName, fieldDef] of Object.entries({
    ...authFields,
    ...fields,
  })) {
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

  const fkFields = allImpliedFKs(schema);

  const topLevelTypes = Object.entries(schema.data.types);

  for (const [typeName, typeDef] of topLevelTypes) {
    if (!isInternalModel(typeDef)) {
      if (isEnumType(typeDef)) {
        const enumType = `enum ${typeName} {\n${typeDef.values.join('\n')}\n}`;
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
          {},
          fieldLevelAuthRules,
        );

        topLevelTypes.push(...models);

        const joined = gqlFields.join('\n  ');

        const model = `type ${typeName} ${authString}\n{\n  ${joined}\n}`;
        gqlModels.push(model);
      }
    } else {
      const fields = {
        ...typeDef.data.fields,
        ...fkFields[typeName],
      };
      const identifier = typeDef.data.identifier;
      const [partitionKey] = identifier;

      const { authString, authFields } = calculateAuth(
        typeDef.data.authorization,
      );

      const fieldLevelAuthRules = processFieldLevelAuthRules(
        fields,
        authFields,
      );

      const { gqlFields, models } = processFields(
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
    }
  }

  const processedSchema = gqlModels.join('\n\n');

  return processedSchema;
};

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
