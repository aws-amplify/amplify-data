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

export type MigrationStep = {
    name: string,
    up: MigrationCommand[],
    down: MigrationCommand[],
}

type Migration = {
    steps: MigrationStep[],
    toString: () => string
}

export function generateMigration(
    currentSchemaSnapshot: TableTransformDefinition,
    priorSchemaSnapshot?: TableTransformDefinition,
): Migration {
    const currentTableMap = new Map<string, TableDefinition>(currentSchemaSnapshot?.tables.map(
        (table) => [table.tableName, table]
    ));
    const priorTableMap = new Map<string, TableDefinition>(priorSchemaSnapshot?.tables.map(
        (table) => [table.tableName, table]
    ));

    const steps = [
        ...transformTables(priorSchemaSnapshot, currentSchemaSnapshot),
        ...commonTables(priorSchemaSnapshot, currentSchemaSnapshot).flatMap((tableName) => (
            transformFields(tableName, priorTableMap.get(tableName), currentTableMap.get(tableName))
        ))
    ]
    return {
        steps,
        toString: () => renderAstToString(migrationFactory(steps))
    }
}

function transformTables(from?: TableTransformDefinition, to?: TableTransformDefinition): MigrationStep[] {
    const toTables = to?.tables?.map((t) => t.tableName) || [];
    const fromTables = from?.tables?.map((t) => t.tableName) || [];
    const addedTables = toTables.filter((table) => !fromTables.includes(table));
    const removedTables = fromTables.filter((table) => !toTables.includes(table));

    return [...addedTables.map((tableName) => (
        {
            name: `create-table-${tableName}`,
            up: [{
                type: 'CREATE_TABLE' as const,
                // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                content: to?.tables.find((t) => t.tableName === tableName)!
            }],
            down: [{
                type: 'DROP_TABLE' as const,
                content: { tableName }
            }]
        }
    )), ...removedTables.map((tableName) => (
        {
            name: `drop-table-${tableName}`,
            up: [{
                type: 'DROP_TABLE' as const,
                content: { tableName }
            }],
            down: [{
                type: 'CREATE_TABLE' as const,
                // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                content: from?.tables.find((t) => t.tableName === tableName)!
            
            }]
        }
    ))]
}

function transformFields(tableName: string, from?: TableDefinition, to?: TableDefinition): MigrationStep[] {
    const toColumns = to?.columns?.map((c) => c.name) || [];
    const fromColumns = from?.columns?.map((c) => c.name) || [];
    const addedColumns = toColumns.filter((column) => !fromColumns.includes(column));
    const removedColumns = fromColumns.filter((column) => !toColumns.includes(column));
    const toColumnMap = new Map<string, TableDefinition["columns"][number]>(to?.columns.map(
        (column) => [column.name, column]
    ));
    const fromColumnMap = new Map<string, TableDefinition["columns"][number]>(from?.columns.map(
        (column) => [column.name, column]
    ));

    const columnAdds: MigrationStep[] = addedColumns.map((columnName) => {

        return {
            name: `create-column-${tableName}-${columnName}`,
            up: 
                [{
                    type: 'ADD_COLUMN' as const,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                    content: { tableName, columnDefinition: toColumnMap.get(columnName)! }
                }],
            down: [{
                type: 'DROP_COLUMN' as const,
                content: { tableName, columnName }
            }]
        }
});
    const columnRemoves: MigrationStep[] = removedColumns.map((columnName) => (
        {
            name: `drop-column-${tableName}-${columnName}`,
            up: [{
                type: 'DROP_COLUMN' as const,
                content: { tableName, columnName }
            }],
            down:
                [{
                    type: 'ADD_COLUMN' as const,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                    content: { tableName, columnDefinition: fromColumnMap.get(columnName)! }
                }]
        }
    ));
    return [...columnAdds, ...columnRemoves];
}

function commonTables(from?: TableTransformDefinition, to?: TableTransformDefinition) {
    const toTables = to?.tables.map((t) => t.tableName) || [];
    const fromTables = from?.tables.map((t) => t.tableName) || [];

    return toTables.filter((table) => fromTables.includes(table));
}