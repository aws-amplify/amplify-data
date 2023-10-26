import type { InternalSchema } from './ModelSchema';
import { type ModelField, type InternalField, fields } from './ModelField';
import type { InternalRelationalField } from './ModelRelationalField';
import type { ModelType, InternalModel } from './ModelType';
import { Authorization, __data } from './Authorization';
import { DerivedApiDefinition } from './types';

type ScalarFieldDef = Exclude<InternalField['data'], { fieldType: 'model' }>;
type ModelFieldDef = Extract<
  InternalRelationalField['data'],
  { fieldType: 'model' }
>;

function isInternalModel(model: ModelType<any, any>): model is InternalModel {
  if ((model as any).data) {
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

function isModelField(
  field: ModelField<any, any>,
): field is { data: ModelFieldDef } {
  return isModelFieldDef((field as any).data);
}

function isScalarField(
  field: ModelField<any, any>,
): field is { data: ScalarFieldDef } {
  return isScalarFieldDef((field as any).data);
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

  // TODO: once we flip default to nullable, uncomment
  if (valueRequired === true) {
    field += '!';
  }

  if (array) {
    field = `[${field}]`;
  }

  // TODO: once we flip default to nullable, uncomment
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
        authFields[rule.groupOrOwnerField] = fields.string().array();
      } else {
        authFields[rule.groupOrOwnerField] = fields.string();
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

const schemaPreprocessor = (schema: InternalSchema): string => {
  const gqlModels: string[] = [];

  for (const [modelName, modelDef] of Object.entries(schema.data.models)) {
    const gqlFields: string[] = [];

    if (!isInternalModel(modelDef)) continue;

    const fields = modelDef.data.fields;
    const identifier = modelDef.data.identifier;
    const [partitionKey] = identifier;

    const { authString, authFields } = calculateAuth(
      modelDef.data.authorization,
    );

    const fieldLevelAuthRules: {
      [k in keyof typeof fields]: string | null;
    } = {};

    for (const [fieldName, fieldDef] of Object.entries(fields)) {
      const { authString, authFields: fieldAuthField } = calculateAuth(
        fieldDef.data.authorization,
      );

      if (authString) fieldLevelAuthRules[fieldName] = authString;
      if (fieldAuthField) {
        Object.assign(authFields, fieldAuthField);
      }
    }

    // process model and fields
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
        } else {
          gqlFields.push(
            `${fieldName}: ${scalarFieldToGql(fieldDef.data)}${fieldAuth}`,
          );
        }
      } else {
        throw new Error(`Unexpected field definition: ${fieldDef}`);
      }
    }

    const joined = gqlFields.join('\n  ');

    const model = `type ${modelName} @model ${authString}\n{\n  ${joined}\n}`;
    gqlModels.push(model);
  }

  const processedSchema = gqlModels.join('\n\n');

  return processedSchema;
};

/**
 * Returns API definition from ModelSchema or string schema
 * @param arg - { schema }
 * @returns DerivedApiDefinition that conforms to IAmplifyGraphqlDefinition
 */
export function defineData(arg: {
  schema: InternalSchema;
}): DerivedApiDefinition {
  const schema = schemaPreprocessor(arg.schema);

  return { schema, functionSlots: [] };
}
