import { DeNested, SchemaDefinition } from ".";

export type AmplifySqlMigration<T extends SchemaDefinition> = {
  steps: AmplifySqlMigrationStep<T>[];
};

type AmplifySqlMigrationStep<T extends SchemaDefinition> = {
  up: AmplifySqlMigrationCreateTableStep<T>;
  down: AmplifySqlMigrationDropTableStep<T>;
} | {
  up: AmplifySqlMigrationAddColumnStep<T>;
  down: AmplifySqlMigrationDropColumnStep<T>;
} | {
  up: AmplifySqlMigrationCreateIndexStep<T>;
  down: AmplifySqlMigrationDropIndexStep<T>;
};


function createTable<T extends SchemaDefinition, TName extends Tables<T>>(
  input: Omit<AmplifySqlMigrationCreateTableStep<T, TName>, 'type'>
): AmplifySqlMigrationCreateTableStep<T> {
  return {
    type: 'createTable',
    ...input,
  };
}

function dropTable<T extends Record<any, any>>(input: Omit<AmplifySqlMigrationDropTableStep<T>, 'type'>): AmplifySqlMigrationDropTableStep<T> {
  return {
    type: 'dropTable',
    ...input,
  };
}

function addColumn<T extends Record<any, any>>(input: Omit<AmplifySqlMigrationAddColumnStep<T>, 'type'>): AmplifySqlMigrationAddColumnStep<T> {
  return {
    type: 'addColumn',
    ...input,
  };
}

function dropColumn<T extends Record<any, any>>(input: Omit<AmplifySqlMigrationDropColumnStep<T>, 'type'>): AmplifySqlMigrationDropColumnStep<T> {
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

type AmplifySqlMigrationDropTableStep<T> = {
  type: 'dropTable';
  name: string;
};

type AmplifySqlMigrationAddColumnStep<T> = {
  type: 'addColumn';
  table: string;
  column: {
    name: string;
    type: string;
    nullable: boolean;
  };
};

type AmplifySqlMigrationDropColumnStep<T> = {
  type: 'dropColumn';
  table: string;
  column: {
    name: string;
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

