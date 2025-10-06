import { PgColumn, PgTable } from 'drizzle-orm/pg-core';

export interface IFieldMapper<TField extends string> {
    mapFieldToColumn(field: TField): string | undefined;
}

export type NestedFieldConfig = {
    table: PgTable;
    column: PgColumn;
};

export class FieldMapper<TTable extends PgTable, TField extends string = string>
    implements IFieldMapper<TField>
{
    private fieldToColumnMap: Map<TField, string> = new Map();
    private columnsByName: Map<string, PgColumn> = new Map();
    private columnsBySchemaKey: Map<string, PgColumn> = new Map();
    private nestedFields: Map<string, NestedFieldConfig> = new Map();

    constructor(
        private readonly table: TTable,
        customMapping?: Partial<Record<TField, keyof TTable>>,
    ) {
        if (!table) {
            throw new Error('FieldMapper: table parameter is required');
        }
        this.initializeColumns();
        this.initializeMapping(customMapping);
    }

    private initializeColumns(): void {
        if (!this.table || typeof this.table !== 'object') {
            throw new Error(`FieldMapper: invalid table object: ${typeof this.table}`);
        }
        const entries = Object.entries(this.table);
        const columns = entries.filter((entry): entry is [string, PgColumn] => {
            return entry[1] && typeof entry[1] === 'object' && entry[1] instanceof PgColumn;
        });

        if (columns.length === 0) {
            throw new Error('FieldMapper: no PgColumn instances found in table');
        }

        for (const [key, column] of columns) {
            this.columnsBySchemaKey.set(key, column);
            this.columnsByName.set(column.name, column);
        }
    }

    private initializeMapping(customMapping?: Partial<Record<TField, keyof TTable>>): void {
        if (customMapping) {
            for (const [field, schemaKey] of Object.entries(customMapping) as Array<
                [TField, keyof TTable]
            >) {
                const column = this.columnsBySchemaKey.get(schemaKey as string);
                if (column) {
                    this.fieldToColumnMap.set(field, column.name);
                }
            }
        }
    }

    registerNestedField(fieldPath: string, table: PgTable, columnKey: string): void {
        const column = (table as any)[columnKey];
        if (column instanceof PgColumn) {
            this.nestedFields.set(fieldPath, { table, column });
        }
    }

    mapFieldToColumn(field: TField): string | undefined {
        const fieldStr = field as string;

        // Check nested fields first (translation.name, artist.name)
        if (fieldStr.includes('.')) {
            const nestedConfig = this.nestedFields.get(fieldStr);
            if (nestedConfig) {
                return nestedConfig.column.name;
            }
            return undefined;
        }

        if (this.fieldToColumnMap.has(field)) {
            return this.fieldToColumnMap.get(field);
        }

        if (this.columnsBySchemaKey.has(fieldStr)) {
            const column = this.columnsBySchemaKey.get(fieldStr)!;
            return column.name;
        }

        const snakeCase = this.toSnakeCase(fieldStr);
        if (this.columnsByName.has(snakeCase)) {
            return snakeCase;
        }

        return undefined;
    }

    getColumn(field: TField): PgColumn | undefined {
        const fieldStr = field as string;

        // Check nested fields first
        if (fieldStr.includes('.')) {
            const nestedConfig = this.nestedFields.get(fieldStr);
            return nestedConfig?.column;
        }

        const columnName = this.mapFieldToColumn(field);
        return columnName ? this.columnsByName.get(columnName) : undefined;
    }

    getNestedFieldTable(field: string): PgTable | undefined {
        return this.nestedFields.get(field)?.table;
    }

    private toSnakeCase(str: string): string {
        return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    }
}
