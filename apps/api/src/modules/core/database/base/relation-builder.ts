import { PgTable } from 'drizzle-orm/pg-core';
import { RelationConfig, RelationType } from './types/relation.types';

export interface ManyToOneOptions<TEntity, TTable extends PgTable> {
    entity: new (...args: any[]) => TEntity;
    table: TTable;
    foreignKey: string;
    references?: string;
}

export interface OneToManyOptions<TEntity, TTable extends PgTable> {
    entity: new (...args: any[]) => TEntity;
    table: TTable;
    foreignKey: string;
}

export interface ManyToManyOptions<TEntity, TTable extends PgTable, TJoinTable extends PgTable> {
    entity: new (...args: any[]) => TEntity;
    table: TTable;
    joinTable: TJoinTable;
    foreignKey: string;
    relatedKey: string;
}

export interface OneToOneOptions<TEntity, TTable extends PgTable> {
    entity: new (...args: any[]) => TEntity;
    table: TTable;
    foreignKey: string;
    ownerKey?: string;
}

export class RelationBuilder {
    static manyToOne<TEntity, TTable extends PgTable>(
        options: ManyToOneOptions<TEntity, TTable>,
    ): RelationConfig<TEntity, TTable> {
        const { entity, table, foreignKey, references = 'id' } = options;
        const idColumn = (table as any)[references];

        if (!idColumn) {
            throw new Error(
                `Reference column "${references}" not found in related table. This table cannot be used for relations.`,
            );
        }

        return {
            type: RelationType.MANY_TO_ONE,
            relationName: foreignKey,
            table,
            foreignKey: idColumn,
            toDomain: (schema: any) => {
                const constructor = entity as any;
                return new constructor(...Object.values(schema));
            },
        };
    }

    static oneToMany<TEntity, TTable extends PgTable>(
        options: OneToManyOptions<TEntity, TTable>,
    ): RelationConfig<TEntity, TTable> {
        const { entity, table, foreignKey } = options;
        const foreignKeyColumn = (table as any)[foreignKey];

        if (!foreignKeyColumn) {
            const availableColumns = Object.keys(table).filter(
                (k) => !k.startsWith('_') && !k.startsWith('Symbol'),
            );
            throw new Error(
                `Foreign key column "${foreignKey}" not found in related table. Available columns: ${availableColumns.join(', ')}`,
            );
        }

        return {
            type: RelationType.ONE_TO_MANY,
            relationName: foreignKey,
            table,
            foreignKey: foreignKeyColumn,
            toDomain: (schema: any) => {
                const constructor = entity as any;
                return new constructor(...Object.values(schema));
            },
        };
    }

    static manyToMany<TEntity, TTable extends PgTable, TJoinTable extends PgTable>(
        options: ManyToManyOptions<TEntity, TTable, TJoinTable>,
    ): RelationConfig<TEntity, TTable, TJoinTable> {
        const { entity, table, joinTable, foreignKey, relatedKey } = options;
        const foreignKeyColumn = (joinTable as any)[foreignKey];
        const relatedKeyColumn = (joinTable as any)[relatedKey];

        if (!foreignKeyColumn || !relatedKeyColumn) {
            throw new Error(
                `Join table keys not found. Looking for "${foreignKey}" and "${relatedKey}" in join table`,
            );
        }

        return {
            type: RelationType.MANY_TO_MANY,
            relationName: 'many-to-many',
            table,
            joinTable,
            foreignKey: foreignKeyColumn,
            relatedKey: relatedKeyColumn,
            toDomain: (schema: any) => {
                const constructor = entity as any;
                return new constructor(...Object.values(schema));
            },
        };
    }

    static oneToOne<TEntity, TTable extends PgTable>(
        options: OneToOneOptions<TEntity, TTable>,
    ): RelationConfig<TEntity, TTable> {
        const { entity, table, foreignKey, ownerKey } = options;
        const foreignKeyColumn = (table as any)[foreignKey];

        if (!foreignKeyColumn) {
            throw new Error(
                `Foreign key column "${foreignKey}" not found in table. Available columns: ${Object.keys(table).join(', ')}`,
            );
        }

        return {
            type: RelationType.ONE_TO_ONE,
            relationName: foreignKey,
            table,
            foreignKey: foreignKeyColumn,
            ownerKey: ownerKey ? (table as any)[ownerKey] : undefined,
            toDomain: (schema: any) => {
                const constructor = entity as any;
                return new constructor(...Object.values(schema));
            },
        };
    }
}

export const relation = RelationBuilder;
