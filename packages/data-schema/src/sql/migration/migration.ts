import {
  type SchemaDefinition,
  type FieldDefinition,
  type Nested,
  type DeNested,
  nested,
  denested,
  transformTables,
  transformColumn,
} from '../index';

interface AlterTableRenameTo {
  type: 'renameTo';
  newName: string;
}
interface AlterTableAddField {
  type: 'addColumn';
  field: ReturnType<typeof transformColumn>;
}
interface AlterTableRemoveField {
  type: 'removeColumn';
  fieldName: string;
}
interface AlterTableRenameField {
  type: 'renameColumn';
  oldName: string;
  newName: string;
}

type AlterTableModifications =
  | AlterTableRenameField
  | AlterTableRemoveField
  | AlterTableAddField
  | AlterTableRenameTo;

interface AlterTableStep {
  operation: 'alterTable';
  tableName: string;
  modifications: AlterTableModifications[];
}

type RenameTo<
  T extends SchemaDefinition,
  TableName extends string,
  NewTableName extends string,
> = {
  tables: {
    [Table in keyof T['tables'] as TableName extends Table
      ? NewTableName
      : Table]: T['tables'][Table];
  };
};

function renameTo<
  T extends SchemaDefinition,
  Fields extends string,
  TableName extends string,
  NewTableName extends string,
>(
  this: Nested<{
    schemaDef: T;
    fields: Fields;
    step: AlterTableStep;
    migrationSteps: AlterTableStep[];
    tableName: TableName;
  }>,
  newName: NewTableName,
): Nested<{
  migrationSteps: AlterTableStep[];
  schemaDef: RenameTo<T, TableName, NewTableName>;
  step: AlterTableStep;
  fields: Fields;
  tableName: TableName;
}> &
  AlterPublicAPI {
  const denestedThis = denested(this);

  denestedThis.step.modifications.push({
    type: 'renameTo',
    newName,
  });

  denestedThis.schemaDef.tables[newName] =
    denestedThis.schemaDef.tables[denestedThis.tableName];

  delete denestedThis.schemaDef.tables[denestedThis.tableName];

  return this as any;
}

type AddField<
  T extends SchemaDefinition,
  TableName extends string,
  FieldName extends string,
  FieldDef extends FieldDefinition,
> = {
  tables: {
    [Table in keyof T['tables'] & string]: TableName extends Table
      ? Nested<{
          identifier: DeNested<T['tables'][Table]>['identifier'];
          fields: DeNested<T['tables'][Table]>['fields'] & {
            [Key in FieldName]: Nested<FieldDef>;
          };
        }> &
          DefaultTableProps<T, Table>
      : T['tables'][Table];
  };
};

function addField<
  T extends SchemaDefinition,
  Fields extends string,
  F extends string,
  FieldDef extends FieldDefinition,
  TableName extends string,
>(
  this: Nested<{
    schemaDef: T;
    fields: Fields;
    step: AlterTableStep;
    migrationSteps: AlterTableStep[];
    tableName: TableName;
  }>,
  fieldName: F,
  field: Nested<FieldDef>,
): Nested<{
  migrationSteps: AlterTableStep[];
  schemaDef: AddField<T, TableName, F, FieldDef>;
  step: AlterTableStep;
  fields: Fields;
  tableName: TableName;
}> &
  AlterPublicAPI {
  const denestedThis = denested(this);

  denestedThis.step.modifications.push({
    type: 'addColumn',
    field: transformColumn(fieldName, denested(field)),
  });

  denested(denestedThis.schemaDef.tables[denestedThis.tableName]).fields[
    fieldName
  ] = field;

  return this as any;
}

type RemoveField<
  T extends SchemaDefinition,
  TableName extends string,
  FieldName extends string,
> = {
  tables: {
    [Table in keyof T['tables'] & string]: TableName extends Table
      ? Nested<{
          identifier: DeNested<T['tables'][Table]>['identifier'];
          fields: {
            [Field in keyof DeNested<
              T['tables'][Table]
            >['fields'] as Field extends FieldName ? never : Field]: DeNested<
              T['tables'][Table]
            >['fields'][Field];
          };
        }> &
          DefaultTableProps<T, Table>
      : T['tables'][Table];
  };
};

function removeField<
  T extends SchemaDefinition,
  Fields extends string,
  F extends Fields,
  TableName extends string,
>(
  this: Nested<{
    schemaDef: T;
    fields: Fields;
    step: AlterTableStep;
    migrationSteps: AlterTableStep[];
    tableName: TableName;
  }>,
  fieldName: F,
): Nested<{
  migrationSteps: AlterTableStep[];
  schemaDef: RemoveField<T, TableName, F>;
  step: AlterTableStep;
  fields: Exclude<Fields, F>;
  tableName: TableName;
}> &
  AlterPublicAPI {
  const denestedThis = denested(this);

  denestedThis.step.modifications.push({
    type: 'removeColumn',
    fieldName,
  });

  delete denested(denestedThis.schemaDef.tables[denestedThis.tableName]).fields[
    fieldName
  ];

  return this as any;
}

type DefaultTableProps<T extends SchemaDefinition, Table extends string> = {
  identifier: 'identifier' extends keyof T['tables'][Table]
    ? T['tables'][Table]['identifier']
    : never;
  toAPIModel: 'toAPIModel' extends keyof T['tables'][Table]
    ? T['tables'][Table]['toAPIModel']
    : never;
};

type RenameField<
  T extends SchemaDefinition,
  TableName extends string,
  OldName extends string,
  NewName extends string,
> = {
  tables: {
    [Table in keyof T['tables'] & string]: TableName extends Table
      ? Nested<{
          identifier: DeNested<T['tables'][Table]>['identifier'];
          fields: {
            [Field in keyof DeNested<
              T['tables'][Table]
            >['fields'] as Field extends OldName ? NewName : Field]: DeNested<
              T['tables'][Table]
            >['fields'][Field];
          };
        }> &
          DefaultTableProps<T, Table>
      : T['tables'][Table];
  };
};

function renameField<
  T extends SchemaDefinition,
  Fields extends string,
  F extends Fields,
  TableName extends string,
  NewFieldName extends string,
>(
  this: Nested<{
    schemaDef: T;
    fields: Fields;
    step: AlterTableStep;
    migrationSteps: AlterTableStep[];
    tableName: TableName;
  }>,
  oldName: F,
  newName: NewFieldName,
): Nested<{
  migrationSteps: AlterTableStep[];
  schemaDef: RenameField<T, TableName, F, NewFieldName>;
  step: AlterTableStep;
  fields: Exclude<Fields, F> | NewFieldName;
  tableName: TableName;
}> &
  AlterPublicAPI {
  const denestedThis = denested(this);

  denestedThis.step.modifications.push({
    type: 'renameColumn',
    oldName,
    newName,
  });

  const table = denestedThis.schemaDef.tables[denestedThis.tableName];
  const tableFields = denested(table).fields;

  denested(denestedThis.schemaDef.tables[denestedThis.tableName]).fields[
    newName
  ] = tableFields[oldName];

  delete denested(denestedThis.schemaDef.tables[denestedThis.tableName]).fields[
    oldName
  ];

  return this as any;
}

function done<T extends SchemaDefinition>(
  this: Nested<{
    schemaDef: T;
    migrationSteps: AlterTableStep[];
    step: AlterTableStep;
  }>,
): {
  alter: typeof alter;
} & Nested<{
  schemaDef: T;
  migrationSteps: AlterTableStep[];
  step: AlterTableStep;
}> {
  const { step } = denested(this);

  denested(this).migrationSteps.push(step);

  return { ...this, alter };
}

interface AlterPublicAPI {
  renameTo: typeof renameTo;
  renameField: typeof renameField;
  removeField: typeof removeField;
  addField: typeof addField;
  done: typeof done;
}

function alter<
  T extends SchemaDefinition,
  TableName extends keyof T['tables'] & string,
  Fields extends string = keyof DeNested<T['tables'][TableName]>['fields'] &
    string,
>(
  this: Nested<{ schemaDef: T; migrationSteps: AlterTableStep[] }>,
  tableName: TableName,
): Nested<{
  schemaDef: T;
  migrationSteps: AlterTableStep[];
  fields: Fields;
  step: AlterTableStep;
  tableName: TableName;
}> &
  AlterPublicAPI {
  const step: AlterTableStep = {
    operation: 'alterTable',
    tableName,
    modifications: [],
  };

  return {
    ...this,
    renameTo,
    renameField,
    removeField,
    addField,
    done,
    ...nested({
      step,
      tableName,
      schemaDef: denested(this).schemaDef,
      migrationSteps: denested(this).migrationSteps,
    }),
  } as any;
}

function migration<const T extends SchemaDefinition>(
  this: any,
): {
  alter: typeof alter;
} & Nested<{
  schemaDef: T;
  migrationSteps: AlterTableStep[];
}> {
  // TODO: use more general type that supports different kinds of steps, not just AlterTable*
  const migrationSteps: AlterTableStep[] = [];

  return {
    ...this,
    ...nested({
      schemaDef: this,
      migrationSteps,
    }),
    alter,
  };
}

export interface MigrationRecord {
  createdAt: number;
  prevState: ReturnType<typeof transformTables>;
  migrationSteps: AlterTableStep[];
}

type ApplyMigration<T extends SchemaDefinition, MT extends SchemaDefinition> = {
  [Key in keyof T]: Key extends 'tables' ? MT[Key] : T[Key];
};

export function addMigration<
  const T extends SchemaDefinition,
  const MT extends SchemaDefinition,
>(
  this: T & { migrations: MigrationRecord[] },
  callback: (existing: typeof migration<T>) => Nested<{
    migrationSteps: AlterTableStep[];
    schemaDef: MT;
  }>,
): ApplyMigration<T, MT> & { migrations: MigrationRecord[] } {
  // save pre-migration state;
  const prevState = transformTables({ ...this.tables });
  const newState = { ...this };

  const { migrationSteps } = denested(callback(migration.bind(newState)));

  const newMigration = {
    createdAt: Date.now(),
    prevState,
    migrationSteps,
  };

  newState.migrations.push(newMigration);

  return newState as any;
}
