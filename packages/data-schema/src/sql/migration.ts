import { DeNested, SchemaDefinition } from ".";

export type AmplifySqlMigration<T extends SchemaDefinition = any> = {
  steps: AmplifySqlMigrationStep<T>[];
};

type CreateDropTableStep<T extends SchemaDefinition, TName extends Tables<T>> = {
  up: AmplifySqlMigrationCreateTableStep<T, TName>;
  down: AmplifySqlMigrationDropTableStep<T, TName>;
};

type AddDropColumnStep<T extends SchemaDefinition, TName extends Tables<T>, TColumn extends TableFields<T, TName>> = {
  up: AmplifySqlMigrationAddColumnStep<T, TName, TColumn>;
  down: AmplifySqlMigrationDropColumnStep<T, TName, TColumn>;
};

type ConstrainedCreateDropTableStep<T extends SchemaDefinition> = {
  [K in Tables<T>]: CreateDropTableStep<T, K>
}[Tables<T>]

type ConstrainedAddDropColumnStep<T extends SchemaDefinition> = {
  [K in Tables<T>]: {
    [C in TableFields<T, K>]: AddDropColumnStep<T, K, C>
  }[TableFields<T, K>]
}[Tables<T>]

type AmplifySqlMigrationStep<T extends SchemaDefinition> =
  | ConstrainedCreateDropTableStep<T>
  | ConstrainedAddDropColumnStep<T>
  | {
    up: AmplifySqlMigrationCreateIndexStep<T>;
    down: AmplifySqlMigrationDropIndexStep<T>;
  };


function createTable<T extends SchemaDefinition, TName extends Tables<T>>(
  input: Omit<AmplifySqlMigrationCreateTableStep<T, TName>, 'type'>
): AmplifySqlMigrationCreateTableStep<T, TName> {
  return {
    type: 'createTable',
    ...input,
  };
}

function dropTable<T extends SchemaDefinition, TName extends Tables<T>>(
  input: Omit<AmplifySqlMigrationDropTableStep<T, TName>, 'type'>
): AmplifySqlMigrationDropTableStep<T, TName> {
  return {
    type: 'dropTable',
    ...input,
  };
}

function addColumn<T extends SchemaDefinition, TName extends Tables<T>, TColumn extends TableFields<T, TName>>(
  input: Omit<AmplifySqlMigrationAddColumnStep<T, TName, TColumn>, 'type'>
): AmplifySqlMigrationAddColumnStep<T, TName, TColumn> {
  return {
    type: 'addColumn',
    ...input,
  };
}

function dropColumn<T extends SchemaDefinition, TName extends Tables<T>, TColumn extends TableFields<T, TName>>(
  input: Omit<AmplifySqlMigrationDropColumnStep<T, TName, TColumn>, 'type'>
): AmplifySqlMigrationDropColumnStep<T, TName, TColumn> {
  return {
    type: 'dropColumn',
    ...input,
  };
}

function createIndex<T extends Record<any, any>>(input: Omit<AmplifySqlMigrationCreateIndexStep<T>, 'type'>): AmplifySqlMigrationCreateIndexStep<T> {
  return {
    type: 'createIndex',
    ...input,
  };
}

function dropIndex<T extends Record<any, any>>(input: Omit<AmplifySqlMigrationDropIndexStep<T>, 'type'>): AmplifySqlMigrationDropIndexStep<T> {
  return {
    type: 'dropIndex',
    ...input,
  };
}

export const sqlMigration = {
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

type AmplifySqlMigrationCreateTableStep<
  T extends SchemaDefinition,
  TName extends Tables<T> = Tables<T>
> = {
  type: 'createTable';
  name: TName;
  columns: {
    name: TableFields<T, TName>;
    type: string;
    constraints?: {
      nullable?: boolean;
    };
  }[];
};

type AmplifySqlMigrationDropTableStep<
  T extends SchemaDefinition,
  TName extends Tables<T> = Tables<T>
> = {
  type: 'dropTable';
  name: TName;
};

type AmplifySqlMigrationAddColumnStep<
  T extends SchemaDefinition,
  TName extends Tables<T> = Tables<T>,
  TColumn extends TableFields<T, TName> = TableFields<T, TName>
> = {
  type: 'addColumn';
  table: TName;
  column: {
    name: TColumn;
    type: string;
    nullable?: boolean;
  };
};

type AmplifySqlMigrationDropColumnStep<
  T extends SchemaDefinition,
  TName extends Tables<T> = Tables<T>,
  TColumn extends TableFields<T, TName> = TableFields<T, TName>
> = {
  type: 'dropColumn';
  table: TName;
  column: {
    name: TColumn;
  };
};

type AmplifySqlMigrationCreateIndexStep<T> = {
  type: 'createIndex';
  table: string;
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
  type: 'dropIndex';
  table: string;
  indexName: string;
};

