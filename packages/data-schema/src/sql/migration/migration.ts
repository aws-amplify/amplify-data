import { DeNested, SchemaDefinition } from ".";

export type AmplifySqlMigrationChageSet<T extends SchemaDefinition = any> = {
  identifier: string;
  steps: AmplifySqlMigrationStep<T>[];
};

export type AmplifySqlMigration<T extends SchemaDefinition = any> = AmplifySqlMigrationStep<T>[];

type CreateDropTableStep<T extends SchemaDefinition, TName extends Tables<T>> = {
  name: string;
  up: AmplifySqlMigrationCreateTableStep<T, TName>[];
  down: AmplifySqlMigrationDropTableStep<T, TName>[];
};

type AddDropColumnStep<T extends SchemaDefinition, TName extends Tables<T>> = {
  name: string;
  up: AmplifySqlMigrationAddColumnStep<T, TName>[];
  down: AmplifySqlMigrationDropColumnStep<T, TName>[];
};

type ConstrainedCreateDropTableStep<T extends SchemaDefinition> = {
  [K in Tables<T>]: CreateDropTableStep<T, K>
}[Tables<T>]

type ConstrainedAddDropColumnStep<T extends SchemaDefinition> = {
  [K in Tables<T>]: {
    [C in TableFields<T, K>]: AddDropColumnStep<T, K>
  }[TableFields<T, K>]
}[Tables<T>]

type AmplifySqlMigrationStep<T extends SchemaDefinition> =
  | ConstrainedCreateDropTableStep<T>
  | ConstrainedAddDropColumnStep<T>
  | {
    name: string;
    up: AmplifySqlMigrationCreateIndexStep<T>;
    down: AmplifySqlMigrationDropIndexStep<T>;
  };

function migrationStep<T extends SchemaDefinition>(
  input: AmplifySqlMigrationStep<T>
): AmplifySqlMigrationStep<T> {
  return input;
}

function createTable<T extends SchemaDefinition, TName extends Tables<T>>(
  input: Omit<AmplifySqlMigrationCreateTableStep<T, TName>, 'action'>,
): AmplifySqlMigrationCreateTableStep<T, TName> {
  return {
    ...input,
    action: 'CREATE_TABLE',
  };
}

function dropTable<T extends SchemaDefinition, TName extends Tables<T>>(
  input: Omit<AmplifySqlMigrationDropTableStep<T, TName>, 'action'>
): AmplifySqlMigrationDropTableStep<T, TName> {
  return {
    ...input,
    action: 'DROP_TABLE',
  };
}

function addColumn<T extends SchemaDefinition, TName extends Tables<T>>(
  input: Omit<AmplifySqlMigrationAddColumnStep<T, TName>, 'action'>
): AmplifySqlMigrationAddColumnStep<T, TName> {
  return {
    ...input,
    action: 'ADD_COLUMN',
  };
}

function dropColumn<T extends SchemaDefinition, TName extends Tables<T>, TColumn extends TableFields<T, TName>>(
  input: Omit<AmplifySqlMigrationDropColumnStep<T, TName, TColumn>, 'action'>
): AmplifySqlMigrationDropColumnStep<T, TName, TColumn> {
  return {
    ...input,
    action: 'DROP_COLUMN',
  };
}

function createIndex<T extends Record<any, any>>(input: Omit<AmplifySqlMigrationCreateIndexStep<T>, 'action'>): AmplifySqlMigrationCreateIndexStep<T> {
  return {
    ...input,
    action: 'CREATE_INDEX',
  };
}

function dropIndex<T extends Record<any, any>>(input: Omit<AmplifySqlMigrationDropIndexStep<T>, 'action'>): AmplifySqlMigrationDropIndexStep<T> {
  return {
    ...input,
    action: 'DROP_INDEX',
  };
}

export const sqlMigration = {
  migrationStep,
  createTable,
  dropTable,
  addColumn,
  dropColumn,
  createIndex,
  dropIndex,
};

type Tables<T extends SchemaDefinition> = keyof T['tables']
type TableFields<T extends SchemaDefinition, TName extends Tables<T>> =
  keyof DeNested<T['tables'][TName]>['fields']

type ColumnType = 'TEXT' | 'INT' | 'FLOAT' | 'BOOLEAN' | 'TIMESTAMP' | `VARCHAR(${number})` | (string & {});

type ColumnDefinition<T extends SchemaDefinition, TName extends Tables<T>> = {
  name: TableFields<T, TName>;
  type: ColumnType;
  isNullable?: boolean;
};

type AmplifySqlMigrationCreateTableStep<
  T extends SchemaDefinition,
  TName extends Tables<T> = Tables<T>
> = {
  action: 'CREATE_TABLE';
  tableName: TName;
  primaryKey?: TableFields<T, TName>[];
  columns: ColumnDefinition<T, TName>[];
};

type AmplifySqlMigrationDropTableStep<
  T extends SchemaDefinition,
  TName extends Tables<T> = Tables<T>
> = {
  action: 'DROP_TABLE';
  tableName: TName;
};

type AmplifySqlMigrationAddColumnStep<
  T extends SchemaDefinition,
  TName extends Tables<T> = Tables<T>,
> = {
  action: 'ADD_COLUMN';
  tableName: TName;
  column: ColumnDefinition<T, TName>;
};

type AmplifySqlMigrationDropColumnStep<
  T extends SchemaDefinition,
  TName extends Tables<T> = Tables<T>,
  TColumn extends TableFields<T, TName> = TableFields<T, TName>
> = {
  action: 'DROP_COLUMN';
  tableName: TName;
  columnName: TColumn;
};

type AmplifySqlMigrationCreateIndexStep<T> = {
  action: 'CREATE_INDEX';
  tableName: string;
  columns: {
    column: {
      descending: boolean;
      name: string;
    };
  }[];
  indexName?: string;
  unique?: boolean;
}

type AmplifySqlMigrationDropIndexStep<T> = {
  action: 'DROP_INDEX';
  tableName: string;
  indexName: string;
};

