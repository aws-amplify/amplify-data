export type AmplifySqlMigration<T extends Record<any, any>> = {
  steps: AmplifySqlMigrationStep<T>[];
};

type AmplifySqlMigrationStep<T extends Record<any, any>> = {
  up: AmplifySqlMigrationCreateTableStep<T>;
  down: AmplifySqlMigrationDropTableStep<T>;
} | {
  up: AmplifySqlMigrationAddColumnStep<T>;
  down: AmplifySqlMigrationDropColumnStep<T>;
} | {
  up: AmplifySqlMigrationCreateIndexStep<T>;
  down: AmplifySqlMigrationDropIndexStep<T>;
};


function createTable<T extends Record<any, any>>(
  input: Omit<AmplifySqlMigrationCreateTableStep<T>, 'type'>
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

type AmplifySqlMigrationCreateTableStep<T extends Record<string, { types: Record<string, { fields: Record<string, any> }> }>> = {
  type: 'createTable';
  name: keyof T;
  columns: {
    name: keyof T[keyof T]['types'][keyof T[keyof T]['types']]['fields'];
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

