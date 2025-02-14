import { migrationFactory, renderAstToString } from "./migrationFactory";

type TableTransformDefinition = {
    tables: {
        tableName: string;
        columns: {
            name: string;
            type: string;
            isNullable: boolean;
        }[];
        primaryKey: string[];
    }[];
};

type TableDefinition = TableTransformDefinition["tables"][number]

export type CreateTableTransformation = TableDefinition;
export type DropTableTransformation = { tableName: string };
export type AddColumnTransformation = { tableName: string, columnDefinition: CreateTableTransformation["columns"][number] };
export type RemoveColumnTransformation = { tableName: string, columnName: string };

type TableMigrationCommand = {
    type: 'CREATE_TABLE',
    content: CreateTableTransformation
} | {
    type: 'DROP_TABLE',
    content: DropTableTransformation

};

type ColumnMigrationCommand = {
    type: 'ADD_COLUMN',
    content: AddColumnTransformation

} | {
    type: 'DROP_COLUMN',
    content: RemoveColumnTransformation

};

export type MigrationCommand = TableMigrationCommand | ColumnMigrationCommand;

type Migration = {
    up: MigrationCommand[],
    down: MigrationCommand[],
    toString: () => string
}

export function generateMigration(
    currentSchemaSnapshot: TableTransformDefinition,
    priorSchemaSnapshot?: TableTransformDefinition,
): Migration {
    const currentTableMap = new Map<string, TableDefinition>(currentSchemaSnapshot?.tables.map(
        (table) => [table.tableName, table] as const
    ));
    const priorTableMap = new Map<string, TableDefinition>(priorSchemaSnapshot?.tables.map(
        (table) => [table.tableName, table] as const
    ));

    const up = [
        ...transformTables(priorSchemaSnapshot, currentSchemaSnapshot),
        ...commonTables(priorSchemaSnapshot, currentSchemaSnapshot).flatMap((tableName) => (
            transformFields(tableName, priorTableMap.get(tableName), currentTableMap.get(tableName))
        ))
    ]
    const down = [
        ...transformTables(currentSchemaSnapshot, priorSchemaSnapshot),
        ...commonTables(priorSchemaSnapshot, currentSchemaSnapshot).flatMap((tableName) => (
            transformFields(tableName, currentTableMap.get(tableName), priorTableMap.get(tableName))
        ))
    ]
    return {
        up,
        down,
        toString: () => renderAstToString(migrationFactory({ up: up, down }))
    }
}

function transformTables(from?: TableTransformDefinition, to?: TableTransformDefinition): TableMigrationCommand[] {
    const toTables = to?.tables?.map((t) => t.tableName) || [];
    const fromTables = from?.tables?.map((t) => t.tableName) || [];
    const addedTables = toTables.filter((table) => !fromTables.includes(table));
    const removedTables = fromTables.filter((table) => !toTables.includes(table));

    return [...addedTables.map((tableName) => (
        {
            type: 'CREATE_TABLE' as const,
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            content: to?.tables.find((t) => t.tableName === tableName)!
        }
    )), ...removedTables.map((tableName) => (
        {
            type: 'DROP_TABLE' as const,
            content: { tableName }
        }
    ))]
}

function transformFields(tableName: string, from?: TableDefinition, to?: TableDefinition): ColumnMigrationCommand[] {
    const toColumns = Object.keys(to?.columns || {});
    const fromColumns = Object.keys(from?.columns || {});
    const addedColumns = toColumns.filter((column) => !fromColumns.includes(column));
    const removedColumns = fromColumns.filter((column) => !toColumns.includes(column));

    const columnAdds = addedColumns.map((columnName) => (
        {
            type: 'ADD_COLUMN' as const,
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            content: { tableName, columnDefinition: to?.columns.find((c) => c.name === columnName)! }
        }
    ));
    const columnRemoves = removedColumns.map((columnName) => (
        {
            type: 'DROP_COLUMN' as const,
            content: { tableName, columnName }
        }
    ))
    return [...columnAdds, ...columnRemoves];
}

function commonTables(from?: TableTransformDefinition, to?: TableTransformDefinition) {
    const toTables = Object.keys(to?.tables || {});
    const fromTables = Object.keys(from?.tables || {});

    return toTables.filter((table) => fromTables.includes(table));
}