import {
  type SchemaDefinition,
  type TableDefinition,
  type FieldDefinition,
  type Nested,
  type DeNested,
  // nested,
  denested,
} from './index';

interface AlterTableRenameTo {
  type: 'renameTo';
  newName: string;
}
interface AlterTableAddField {
  type: 'addField';
  fieldName: string;
  field: Nested<FieldDefinition>;
}
interface AlterTableRemoveField {
  type: 'removeField';
  fieldName: string;
}
interface AlterTableRenameField {
  type: 'renameField';
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
  this: {
    schemaDef: T;
    fields: Fields;
    step: AlterTableStep;
    migrationSteps: AlterTableStep[];
    tableName: TableName;
  },
  newName: NewTableName,
): {
  migrationSteps: AlterTableStep[];
  schemaDef: RenameTo<T, TableName, NewTableName>;
  step: AlterTableStep;
  renameTo: typeof renameTo;
  renameField: typeof renameField;
  removeField: typeof removeField;
  addField: typeof addField;
  done: typeof done;
  fields: Fields;
  tableName: TableName;
} {
  this.step.modifications.push({
    type: 'renameTo',
    newName,
  });

  this.schemaDef.tables[newName] = this.schemaDef.tables[this.tableName];
  delete this.schemaDef.tables[this.tableName];

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
  this: {
    schemaDef: T;
    fields: Fields;
    step: AlterTableStep;
    migrationSteps: AlterTableStep[];
    tableName: TableName;
  },
  fieldName: F,
  field: Nested<FieldDef>,
): {
  migrationSteps: AlterTableStep[];
  schemaDef: AddField<T, TableName, F, FieldDef>;
  step: AlterTableStep;
  renameTo: typeof renameTo;
  renameField: typeof renameField;
  removeField: typeof removeField;
  addField: typeof addField;
  done: typeof done;
  fields: Fields;
  tableName: TableName;
} {
  this.step.modifications.push({
    type: 'addField',
    fieldName,
    field: field,
  });

  // const table = this.schemaDef.tables[this.tableName];
  // const tableFields = denested(table).fields;

  denested(this.schemaDef.tables[this.tableName]).fields[fieldName] = field;

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
  this: {
    schemaDef: T;
    fields: Fields;
    step: AlterTableStep;
    migrationSteps: AlterTableStep[];
    tableName: TableName;
  },
  fieldName: F,
): {
  migrationSteps: AlterTableStep[];
  schemaDef: RemoveField<T, TableName, F>;
  step: AlterTableStep;
  renameTo: typeof renameTo;
  renameField: typeof renameField;
  removeField: typeof removeField;
  addField: typeof addField;
  done: typeof done;
  fields: Exclude<Fields, F>;
  tableName: TableName;
} {
  this.step.modifications.push({
    type: 'removeField',
    fieldName,
  });

  delete denested(this.schemaDef.tables[this.tableName]).fields[fieldName];

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
  this: {
    schemaDef: T;
    fields: Fields;
    step: AlterTableStep;
    migrationSteps: AlterTableStep[];
    tableName: TableName;
  },
  oldName: F,
  newName: NewFieldName,
): {
  migrationSteps: AlterTableStep[];
  schemaDef: RenameField<T, TableName, F, NewFieldName>;
  step: AlterTableStep;
  renameTo: typeof renameTo;
  renameField: typeof renameField;
  removeField: typeof removeField;
  addField: typeof addField;
  done: typeof done;
  fields: Exclude<Fields, F> | NewFieldName;
  tableName: TableName;
} {
  this.step.modifications.push({
    type: 'renameField',
    oldName,
    newName,
  });

  const table = this.schemaDef.tables[this.tableName];
  const tableFields = denested(table).fields;

  denested(this.schemaDef.tables[this.tableName]).fields[newName] =
    tableFields[oldName];

  delete denested(this.schemaDef.tables[this.tableName]).fields[oldName];

  return this as any;
}

function done<T extends SchemaDefinition>(this: {
  schemaDef: T;
  migrationSteps: AlterTableStep[];
  step: AlterTableStep;
}): {
  schemaDef: T;
  migrationSteps: AlterTableStep[];
  alter: typeof alter;
  step: AlterTableStep;
} {
  const { step } = this;

  this.migrationSteps.push(step);

  return { ...this, alter };
}

function alter<
  T extends SchemaDefinition,
  TableName extends keyof T['tables'] & string,
  Fields extends string = keyof DeNested<T['tables'][TableName]>['fields'] &
    string,
>(
  this: { schemaDef: T; migrationSteps: AlterTableStep[] },
  tableName: TableName,
): T & {
  schemaDef: T;
  migrationSteps: AlterTableStep[];
  renameTo: typeof renameTo;
  renameField: typeof renameField;
  removeField: typeof removeField;
  addField: typeof addField;
  done: typeof done;
  fields: Fields;
  step: AlterTableStep;
  tableName: TableName;
} {
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
    step,
    tableName,
  } as any;
}

function migration<const T extends SchemaDefinition>(
  this: any,
): {
  schemaDef: T;
  migrationSteps: AlterTableStep[];
  alter: typeof alter;
} {
  // TODO: use more general type that support different kinds of steps
  const migrationSteps: AlterTableStep[] = [];

  return {
    ...this,
    schemaDef: this,
    migrationSteps,
    alter,
  };
}

export interface MigrationRecord {
  createdAt: number;
  prevState: Record<string, Nested<TableDefinition>>;
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
  callback: (existing: typeof migration<T>) => {
    migrationSteps: AlterTableStep[];
    schemaDef: MT;
  },
): ApplyMigration<T, MT> & { migrations: MigrationRecord[] } {
  // save pre-migration state;
  const prevState = { ...this.tables };
  const newState = { ...this };

  const { migrationSteps } = callback(migration.bind(newState));

  const newMigration = {
    createdAt: Date.now(),
    prevState,
    migrationSteps,
  };

  newState.migrations.push(newMigration);

  return newState as any;
}
