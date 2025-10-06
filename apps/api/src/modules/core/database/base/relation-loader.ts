import { eq } from 'drizzle-orm';
import type { DatabaseService } from '../services/database.service';
import {
    ManyToManyConfig,
    ManyToOneConfig,
    OneToManyConfig,
    OneToOneConfig,
    RelationConfig,
    RelationType,
} from './types/relation.types';

export class RelationLoader {
    // CACHE STRATEGY: Only cache ID column lookups (schema metadata), never entity data
    // This is safe because database schema doesn't change at runtime
    // Avoids expensive reflection on every query
    private idColumnCache = new Map<string, any>();

    constructor(private readonly db: DatabaseService['db']) {}

    async loadOneToOne<TRelatedEntity>(
        config: OneToOneConfig<TRelatedEntity, any>,
        entityId: string | number,
    ): Promise<TRelatedEntity | null> {
        const ownerKey = config.ownerKey || this.findIdColumn(config.table);
        const result = await this.db
            .select()
            .from(config.table)
            .where(eq(config.foreignKey, entityId))
            .limit(1);

        return result.length > 0 ? config.toDomain(result[0]) : null;
    }

    async loadOneToMany<TRelatedEntity>(
        config: OneToManyConfig<TRelatedEntity, any>,
        entityId: string | number,
    ): Promise<TRelatedEntity[]> {
        const result = await this.db
            .select()
            .from(config.table)
            .where(eq(config.foreignKey, entityId));

        return result.map((r) => config.toDomain(r));
    }

    async loadOneToManyBatch<TRelatedEntity>(
        config: OneToManyConfig<TRelatedEntity, any>,
        entityIds: (string | number)[],
    ): Promise<Map<string | number, TRelatedEntity[]>> {
        if (entityIds.length === 0) {
            return new Map();
        }

        const result = await this.db
            .select()
            .from(config.table)
            .where(eq(config.foreignKey, entityIds[0]));

        const grouped = new Map<string | number, TRelatedEntity[]>();
        for (const row of result) {
            const fkValue = (row as any)[config.foreignKey.name];
            if (!grouped.has(fkValue)) {
                grouped.set(fkValue, []);
            }
            grouped.get(fkValue)!.push(config.toDomain(row));
        }

        return grouped;
    }

    async loadManyToOne<TRelatedEntity>(
        config: ManyToOneConfig<TRelatedEntity, any>,
        foreignKeyValue: string | number | null,
    ): Promise<TRelatedEntity | null> {
        if (foreignKeyValue === null) return null;

        const idColumn = this.findIdColumn(config.table);
        const result = await this.db
            .select()
            .from(config.table)
            .where(eq(idColumn, foreignKeyValue))
            .limit(1);

        return result.length > 0 ? config.toDomain(result[0]) : null;
    }

    async loadManyToMany<TRelatedEntity>(
        config: ManyToManyConfig<TRelatedEntity, any, any>,
        entityId: string | number,
    ): Promise<TRelatedEntity[]> {
        const relatedIdColumn = this.findIdColumn(config.table);

        const result = await this.db
            .select()
            .from(config.table)
            .innerJoin(config.joinTable, eq(relatedIdColumn, config.relatedKey))
            .where(eq(config.foreignKey, entityId));

        return result.map((row) => {
            const tableName = config.table[Symbol.for('drizzle:Name') as any] || 'table';
            return config.toDomain(row[tableName]);
        });
    }

    async loadRelation<TRelatedEntity>(
        config: RelationConfig<TRelatedEntity, any, any>,
        entityId: string | number,
        foreignKeyValue?: string | number | null,
    ): Promise<TRelatedEntity | TRelatedEntity[] | null> {
        switch (config.type) {
            case RelationType.ONE_TO_ONE:
                return this.loadOneToOne(config as OneToOneConfig<TRelatedEntity, any>, entityId);
            case RelationType.ONE_TO_MANY:
                return this.loadOneToMany(config as OneToManyConfig<TRelatedEntity, any>, entityId);
            case RelationType.MANY_TO_ONE:
                if (foreignKeyValue === undefined) {
                    throw new Error('foreignKeyValue is required for MANY_TO_ONE relations');
                }
                return this.loadManyToOne(
                    config as ManyToOneConfig<TRelatedEntity, any>,
                    foreignKeyValue,
                );
            case RelationType.MANY_TO_MANY:
                return this.loadManyToMany(
                    config as ManyToManyConfig<TRelatedEntity, any, any>,
                    entityId,
                );
            default:
                throw new Error(`Unsupported relation type: ${(config as any).type}`);
        }
    }

    private findIdColumn(table: any): any {
        const tableName = table[Symbol.for('drizzle:Name') as any] || 'unknown';

        if (this.idColumnCache.has(tableName)) {
            return this.idColumnCache.get(tableName);
        }

        const idColumn = Object.values(table).find(
            (col: any) => col && typeof col === 'object' && col.name === 'id',
        );

        if (!idColumn) {
            throw new Error(`ID column not found in table "${tableName}"`);
        }

        this.idColumnCache.set(tableName, idColumn);
        return idColumn;
    }
}
