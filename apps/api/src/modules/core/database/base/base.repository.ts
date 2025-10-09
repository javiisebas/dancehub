import { LogService } from '@api/modules/core/logger/services/logger.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { Filter, PaginatedRequest } from '@repo/shared';
import { PaginatedResponse } from '@repo/shared';
import { and, eq, SQL, sql } from 'drizzle-orm';
import { PgColumn, PgTable } from 'drizzle-orm/pg-core';
import { IBaseRepository } from '../interfaces/i-base.repository';
import { DatabaseService } from '../services/database.service';
import { UnitOfWorkService } from '../unit-of-work/unit-of-work.service';
import { QueryBuilder } from './query-builder';
import { RelationLoader } from './relation-loader';
import { RelationMap, RelationType } from './types/relation.types';
import { InferFields, InferRelations } from './types/type-helpers.types';

import { QueryOptions } from './types/query-options.types';

export type WhereCondition = SQL | undefined;

export type EntityWithRelations<TEntity, TRelations extends Record<string, any>> = TEntity & {
    [K in keyof TRelations]?: TRelations[K];
};

// Re-export for backward compatibility
export type FindOptions<TRelations extends Record<string, any>> = QueryOptions<string, TRelations>;

@Injectable()
export abstract class BaseRepository<
    TEntity,
    TTable extends PgTable,
    TRelationMap extends RelationMap = RelationMap,
> implements IBaseRepository<TEntity, InferFields<TTable>>
{
    protected abstract readonly table: TTable;
    protected abstract readonly entityName: string;
    protected readonly fieldColumnMap?: Partial<Record<InferFields<TTable>, keyof TTable>>;
    protected readonly relations?: TRelationMap;

    protected abstract toDomain(schema: TTable['$inferSelect']): TEntity;
    protected abstract toSchema(entity: TEntity): Partial<TTable['$inferInsert']>;

    private queryBuilder!: QueryBuilder<TTable, InferFields<TTable>>;
    private relationLoader!: RelationLoader;

    constructor(
        protected readonly databaseService: DatabaseService,
        protected readonly unitOfWorkService: UnitOfWorkService,
        protected readonly logger: LogService,
    ) {}

    protected getQueryBuilder(): QueryBuilder<TTable, InferFields<TTable>> {
        if (!this.queryBuilder) {
            this.queryBuilder = new QueryBuilder(this.table, this.fieldColumnMap);
        }
        return this.queryBuilder;
    }

    protected getRelationLoader(): RelationLoader {
        if (!this.relationLoader) {
            this.relationLoader = new RelationLoader(this.db);
        }
        return this.relationLoader;
    }

    protected get db(): DatabaseService['db'] {
        return (
            (this.unitOfWorkService.getTransaction() as DatabaseService['db']) ||
            this.databaseService.db
        );
    }

    async findById(
        id: string | number,
        options?: QueryOptions<InferFields<TTable>, InferRelations<TRelationMap>>,
    ): Promise<TEntity | EntityWithRelations<TEntity, InferRelations<TRelationMap>>> {
        const idColumn = this.getIdColumn();
        const result = await this.db.select().from(this.table).where(eq(idColumn, id)).limit(1);

        if (!result.length) {
            throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
        }

        const entity = this.toDomain(result[0] as TTable['$inferSelect']);

        if (options?.with && options.with.length > 0) {
            return this.withRelations(entity, options.with);
        }

        return entity;
    }

    async findOne(
        options?: QueryOptions<InferFields<TTable>, InferRelations<TRelationMap>>,
    ): Promise<TEntity | EntityWithRelations<TEntity, InferRelations<TRelationMap>> | null> {
        const { where, orderBy, joins } = this.buildQuery(options);

        let query = this.db.select().from(this.table).$dynamic();
        query = this.applyJoins(query, joins);
        query = query.where(where).limit(1);

        if (orderBy.length > 0) {
            query = query.orderBy(...orderBy);
        }

        const result = await query;
        if (!result.length) return null;

        const entity = this.toDomain(
            this.extractMainEntity(result[0], joins.length > 0) as TTable['$inferSelect'],
        );

        if (options?.with && options.with.length > 0) {
            return this.withRelations(entity, options.with);
        }

        return entity;
    }

    async findMany(
        options?: QueryOptions<InferFields<TTable>, InferRelations<TRelationMap>>,
    ): Promise<TEntity[] | EntityWithRelations<TEntity, InferRelations<TRelationMap>>[]> {
        const { where, orderBy, joins } = this.buildQuery(options);

        let query = this.db.select().from(this.table).$dynamic();
        query = this.applyJoins(query, joins);
        query = query.where(where);

        if (orderBy.length > 0) {
            query = query.orderBy(...orderBy);
        }

        if (options?.limit !== undefined) {
            query = query.limit(options.limit);
        }

        const result = await query;
        const hasJoins = joins.length > 0;
        const entities = result.map((r) =>
            this.toDomain(this.extractMainEntity(r, hasJoins) as TTable['$inferSelect']),
        );

        if (options?.with && options.with.length > 0) {
            return this.withRelationsMany(entities, options.with);
        }

        return entities;
    }

    async paginate(
        request: PaginatedRequest<InferFields<TTable>>,
        options?: QueryOptions<InferFields<TTable>, InferRelations<TRelationMap>>,
    ): Promise<
        | PaginatedResponse<TEntity>
        | PaginatedResponse<EntityWithRelations<TEntity, InferRelations<TRelationMap>>>
    > {
        const { page, limit } = request;
        const offset = (page - 1) * limit;

        // Merge filters and sorts from request and options
        const mergedOptions: QueryOptions<InferFields<TTable>, InferRelations<TRelationMap>> = {
            ...options,
            filter: options?.filter || (request as any).filter,
            sort: options?.sort || (request as any).sort,
        };

        const { where, orderBy, joins } = this.buildQuery(mergedOptions);

        const [data, countResult] = await Promise.all([
            (async () => {
                let query = this.db.select().from(this.table).$dynamic();
                query = this.applyJoins(query, joins);
                query = query.where(where).offset(offset).limit(limit);

                if (orderBy.length > 0) {
                    query = query.orderBy(...orderBy);
                }

                return query;
            })(),
            (async () => {
                let countQuery = this.db
                    .select({ count: sql<number>`count(*)::int` })
                    .from(this.table)
                    .$dynamic();
                countQuery = this.applyJoins(countQuery, joins);
                return countQuery.where(where);
            })(),
        ]);

        const total = Number(countResult[0]?.count || 0);
        const totalPages = Math.ceil(total / limit);
        const hasJoins = joins.length > 0;
        let entities = data.map((r) =>
            this.toDomain(this.extractMainEntity(r, hasJoins) as TTable['$inferSelect']),
        );

        if (options?.with && options.with.length > 0) {
            entities = await this.withRelationsMany(entities, options.with);
        }

        return new PaginatedResponse({
            data: entities,
            total,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        });
    }

    async create(data: unknown): Promise<TEntity> {
        const result = await this.db
            .insert(this.table)
            .values(data as never)
            .returning();
        return this.toDomain(result[0] as TTable['$inferSelect']);
    }

    async save(entity: TEntity): Promise<TEntity> {
        const schema = this.toSchema(entity);
        const now = new Date();
        const dataToSave = {
            ...schema,
            updatedAt: now,
        };
        const result = await this.db
            .insert(this.table)
            .values(dataToSave as never)
            .returning();
        return this.toDomain(result[0] as TTable['$inferSelect']);
    }

    async createMany(data: unknown[]): Promise<TEntity[]> {
        if (data.length === 0) return [];
        const result = await this.db
            .insert(this.table)
            .values(data as never)
            .returning();
        return result.map((r) => this.toDomain(r as TTable['$inferSelect']));
    }

    async update(id: string | number, data: unknown): Promise<TEntity> {
        const idColumn = this.getIdColumn();
        const now = new Date();
        const dataToUpdate = {
            ...(data as Record<string, unknown>),
            updatedAt: now,
        };
        const result = await this.db
            .update(this.table)
            .set(dataToUpdate as never)
            .where(eq(idColumn, id))
            .returning();

        if (!result.length) {
            throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
        }
        return this.toDomain(result[0] as TTable['$inferSelect']);
    }

    async updateEntity(entity: TEntity): Promise<TEntity> {
        const schema = this.toSchema(entity);
        const idColumn = this.getIdColumn();
        const entityId = (entity as any).id;

        if (!entityId) {
            throw new Error(`ID not found in entity for update`);
        }

        const result = await this.db
            .update(this.table)
            .set(schema as never)
            .where(eq(idColumn, entityId))
            .returning();

        if (!result.length) {
            throw new NotFoundException(`${this.entityName} with ID ${entityId} not found`);
        }
        return this.toDomain(result[0] as TTable['$inferSelect']);
    }

    async updateMany(filter: Filter<InferFields<TTable>>, data: unknown): Promise<TEntity[]> {
        const where = this.getQueryBuilder().buildWhereClause(filter);
        const result = await this.db
            .update(this.table)
            .set(data as never)
            .where(where)
            .returning();
        return result.map((r) => this.toDomain(r as TTable['$inferSelect']));
    }

    async delete(id: string | number): Promise<void> {
        const idColumn = this.getIdColumn();
        const result = await this.db.delete(this.table).where(eq(idColumn, id)).returning();

        if (!result.length) {
            throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
        }
    }

    async deleteMany(filter: Filter<InferFields<TTable>>): Promise<number> {
        const where = this.getQueryBuilder().buildWhereClause(filter);
        const result = await this.db.delete(this.table).where(where).returning();
        return result.length;
    }

    async exists(filter: Filter<InferFields<TTable>>): Promise<boolean> {
        const where = this.getQueryBuilder().buildWhereClause(filter);
        const result = await this.db
            .select({ count: sql<number>`count(*)::int` })
            .from(this.table)
            .where(where)
            .limit(1);
        return Number(result[0]?.count || 0) > 0;
    }

    async count(filter?: Filter<InferFields<TTable>>): Promise<number> {
        const where = this.getQueryBuilder().buildWhereClause(filter);
        const result = await this.db
            .select({ count: sql<number>`count(*)::int` })
            .from(this.table)
            .where(where);
        return Number(result[0]?.count || 0);
    }

    protected getIdColumn(): PgColumn {
        const idColumn = Object.values(this.table).find(
            (column): column is PgColumn => column instanceof PgColumn && column.name === 'id',
        );
        if (!idColumn) {
            throw new Error(`ID column not found in table`);
        }
        return idColumn;
    }

    private buildQuery(options?: QueryOptions<InferFields<TTable>, InferRelations<TRelationMap>>): {
        where: SQL | undefined;
        orderBy: SQL[];
        joins: any[];
    } {
        const queryBuilder = this.getQueryBuilder();
        queryBuilder.clearJoins();

        const where = queryBuilder.buildWhereClause(options?.filter);
        const orderBy = queryBuilder.buildOrderByClause(options?.sort);
        const joins = queryBuilder.getRequiredJoins();

        return { where, orderBy, joins };
    }

    private applyJoins(query: any, joins: any[]): any {
        let result = query;
        for (const join of joins) {
            const joinConditions = [eq(join.on.leftColumn, join.on.rightColumn)];
            if (join.on.additionalConditions) {
                joinConditions.push(...join.on.additionalConditions);
            }
            result = result.innerJoin(join.table, and(...joinConditions));
        }
        return result;
    }

    protected extractMainEntity(result: any, hasJoins: boolean): any {
        if (!hasJoins) {
            return result;
        }

        // When there are joins, Drizzle returns { mainTable: {...}, joinedTable: {...} }
        const tableName = (this.table as any)[Symbol.for('drizzle:Name')] || Object.keys(result)[0];
        return result[tableName] || result;
    }

    async loadRelation<K extends keyof InferRelations<TRelationMap>>(
        entity: TEntity,
        relationName: K,
    ): Promise<InferRelations<TRelationMap>[K] | null> {
        if (!this.relations || !(relationName in this.relations)) {
            throw new Error(`Relation "${String(relationName)}" is not defined in the repository`);
        }

        const config = this.relations[relationName as string];
        const entityId = (entity as any).id;

        if (config.type === RelationType.MANY_TO_ONE) {
            const foreignKeyValue = (entity as any)[config.relationName];
            return this.getRelationLoader().loadRelation(
                config,
                entityId,
                foreignKeyValue,
            ) as Promise<InferRelations<TRelationMap>[K] | null>;
        }

        const result = await this.getRelationLoader().loadRelation(config, entityId);
        return result as InferRelations<TRelationMap>[K] | null;
    }

    async loadRelations(
        entity: TEntity,
        relationNames: (keyof InferRelations<TRelationMap>)[],
    ): Promise<Partial<InferRelations<TRelationMap>>> {
        const loadedRelations: Partial<InferRelations<TRelationMap>> = {};

        await Promise.all(
            relationNames.map(async (relationName) => {
                const relation = await this.loadRelation(entity, relationName);
                if (relation !== null) {
                    loadedRelations[relationName] = relation;
                }
            }),
        );

        return loadedRelations;
    }

    async withRelations<K extends keyof InferRelations<TRelationMap>>(
        entity: TEntity,
        relationNames: K[],
    ): Promise<EntityWithRelations<TEntity, Pick<InferRelations<TRelationMap>, K>>> {
        const loadedRelations: any = {};

        for (const relationName of relationNames) {
            const relation = await this.loadRelation(entity, relationName);
            if (relation !== null) {
                loadedRelations[relationName] = relation;
            }
        }

        return { ...entity, ...loadedRelations } as EntityWithRelations<
            TEntity,
            Pick<InferRelations<TRelationMap>, K>
        >;
    }

    async withRelationsMany<K extends keyof InferRelations<TRelationMap>>(
        entities: TEntity[],
        relationNames: K[],
    ): Promise<EntityWithRelations<TEntity, Pick<InferRelations<TRelationMap>, K>>[]> {
        if (!this.relations || relationNames.length === 0) {
            return entities as EntityWithRelations<
                TEntity,
                Pick<InferRelations<TRelationMap>, K>
            >[];
        }

        return Promise.all(
            entities.map(async (entity) => {
                const relations = await this.loadRelations(entity, relationNames);
                return { ...entity, ...relations } as EntityWithRelations<
                    TEntity,
                    Pick<InferRelations<TRelationMap>, K>
                >;
            }),
        );
    }
}
