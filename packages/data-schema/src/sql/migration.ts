export type AmplifySqlMigration = {
  steps: AmplifySqlMigrationStep[];
};

type AmplifySqlMigrationStep = {
  up: AmplifySqlMigrationCreateTableStep;
  down: AmplifySqlMigrationDropTableStep;
} | {
  up: AmplifySqlMigrationAddColumnStep;
  down: AmplifySqlMigrationDropColumnStep;
} | {
  up: AmplifySqlMigrationCreateIndexStep;
  down: AmplifySqlMigrationDropIndexStep;
};

function createTable(input: Omit<AmplifySqlMigrationCreateTableStep, 'type'>): AmplifySqlMigrationCreateTableStep {
  return {
    type: 'createTable',
    ...input,
  };
}

function dropTable(input: Omit<AmplifySqlMigrationDropTableStep, 'type'>): AmplifySqlMigrationDropTableStep {
  return {
    type: 'dropTable',
    ...input,
  };
}

function addColumn(input: Omit<AmplifySqlMigrationAddColumnStep, 'type'>): AmplifySqlMigrationAddColumnStep {
  return {
    type: 'addColumn',
    ...input,
  };
}

function dropColumn(input: Omit<AmplifySqlMigrationDropColumnStep, 'type'>): AmplifySqlMigrationDropColumnStep {
  return {
    type: 'dropColumn',
    ...input,
  };
}

function createIndex(input: Omit<AmplifySqlMigrationCreateIndexStep, 'type'>): AmplifySqlMigrationCreateIndexStep {
  return {
    type: 'createIndex',
    ...input,
  };
}

function dropIndex(input: Omit<AmplifySqlMigrationDropIndexStep, 'type'>): AmplifySqlMigrationDropIndexStep {
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

type AmplifySqlMigrationCreateTableStep = {
  type: 'createTable';
  name: string;
  columns: {
    name: string;
    type: string;
    constraints?: {
      nullable?: boolean;
    };
  }[];
};

type AmplifySqlMigrationDropTableStep = {
  type: 'dropTable';
  name: string;
};

type AmplifySqlMigrationAddColumnStep = {
  type: 'addColumn';
  table: string;
  column: {
    name: string;
    type: string;
    nullable: boolean;
  };
};

type AmplifySqlMigrationDropColumnStep = {
  type: 'dropColumn';
  table: string;
  column: {
    name: string;
  };
};

type AmplifySqlMigrationCreateIndexStep = {
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

type AmplifySqlMigrationDropIndexStep = {
  type: 'dropIndex';
  table: string;
  indexName: string;
};

