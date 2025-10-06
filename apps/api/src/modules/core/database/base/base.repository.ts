import { LogService } from '@api/modules/core/logger/services/logger.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { Filter, PaginatedRequest } from '@repo/shared';
import { PaginatedResponse } from '@repo/shared';
import { and, eq, SQL, sql } from 'drizzle-orm';
import { PgColumn, PgTable } from 'drizzle-orm/pg-core';
import { IBaseRepository } from '../interfaces/i-base.repository';
import { DatabaseService } from '../services/database.service';
import { RepositoryRegistry } from '../services/repository-registry.service';
import { UnitOfWorkService } from '../unit-of-work/unit-of-work.service';
import { QueryBuilder } from './query-builder';
import { RelationLoader } from './relation-loader';
import { RelationMap, RelationType } from './types/relation.types';

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
    TField extends string = string,
    TRelations extends Record<string, any> = {},
> implements IBaseRepository<TEntity, TField>
{
    protected abstract table: TTable;
    protected abstract entityName: string;
    protected fieldColumnMap?: Partial<Record<TField, keyof TTable>>;
    protected relations?: RelationMap;

    protected abstract toDomain(schema: TTable['$inferSelect']): TEntity;
    protected abstract toSchema(entity: TEntity): Partial<TTable['$inferInsert']>;

    private queryBuilder!: QueryBuilder<TTable, TField>;
    private relationLoader!: RelationLoader;
    protected repositoryRegistry?: RepositoryRegistry;

    constructor(
        protected readonly databaseService: DatabaseService,
        protected readonly unitOfWorkService: UnitOfWorkService,
        protected readonly logger: LogService,
        repositoryRegistry?: RepositoryRegistry,
    ) {
        this.repositoryRegistry = repositoryRegistry;
    }

    protected getQueryBuilder(): QueryBuilder<TTable, TField> {
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
        options?: QueryOptions<TField, TRelations>,
    ): Promise<TEntity | EntityWithRelations<TEntity, TRelations>> {
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
        options?: QueryOptions<TField, TRelations>,
    ): Promise<TEntity | EntityWithRelations<TEntity, TRelations> | null> {
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
        options?: QueryOptions<TField, TRelations>,
    ): Promise<TEntity[] | EntityWithRelations<TEntity, TRelations>[]> {
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
        request: PaginatedRequest<TField>,
        options?: QueryOptions<TField, TRelations>,
    ): Promise<
        PaginatedResponse<TEntity> | PaginatedResponse<EntityWithRelations<TEntity, TRelations>>
    > {
        const { page, limit } = request;
        const offset = (page - 1) * limit;

        // Merge filters and sorts from request and options
        const mergedOptions: QueryOptions<TField, TRelations> = {
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
        const result = await this.db
            .insert(this.table)
            .values(schema as never)
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
        const result = await this.db
            .update(this.table)
            .set(data as never)
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

    async updateMany(filter: Filter<TField>, data: unknown): Promise<TEntity[]> {
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

    async deleteMany(filter: Filter<TField>): Promise<number> {
        const where = this.getQueryBuilder().buildWhereClause(filter);
        const result = await this.db.delete(this.table).where(where).returning();
        return result.length;
    }

    async exists(filter: Filter<TField>): Promise<boolean> {
        const where = this.getQueryBuilder().buildWhereClause(filter);
        const result = await this.db
            .select({ count: sql<number>`count(*)::int` })
            .from(this.table)
            .where(where)
            .limit(1);
        return Number(result[0]?.count || 0) > 0;
    }

    async count(filter?: Filter<TField>): Promise<number> {
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

    private buildQuery(options?: QueryOptions<TField, TRelations>): {
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

    async loadRelation<K extends keyof TRelations>(
        entity: TEntity,
        relationName: K,
    ): Promise<TRelations[K] | null> {
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
            ) as Promise<TRelations[K] | null>;
        }

        const result = await this.getRelationLoader().loadRelation(config, entityId);
        return result as TRelations[K] | null;
    }

    async loadRelations(
        entity: TEntity,
        relationNames: (keyof TRelations)[],
    ): Promise<Partial<TRelations>> {
        const loadedRelations: Partial<TRelations> = {};

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

    async withRelations<K extends keyof TRelations>(
        entity: TEntity,
        relationNames: (K | string)[],
    ): Promise<EntityWithRelations<TEntity, Pick<TRelations, K>>> {
        const loadedRelations: any = {};
        const processedFirstLevel = new Set<string>();

        for (const relationName of relationNames) {
            const relName = String(relationName);

            if (relName.includes('.')) {
                const [firstRel, ...nestedPath] = relName.split('.');

                if (!processedFirstLevel.has(firstRel)) {
                    const firstRelation = await this.loadRelation(entity, firstRel as K);
                    processedFirstLevel.add(firstRel);

                    if (firstRelation !== null) {
                        if (Array.isArray(firstRelation)) {
                            loadedRelations[firstRel] = await this.loadNestedForMany(
                                firstRelation,
                                nestedPath,
                            );
                        } else {
                            loadedRelations[firstRel] = await this.loadNestedForOne(
                                firstRelation,
                                nestedPath,
                            );
                        }
                    }
                }
            } else {
                if (!processedFirstLevel.has(relName)) {
                    const relation = await this.loadRelation(entity, relationName);
                    if (relation !== null) {
                        loadedRelations[relName] = relation;
                        processedFirstLevel.add(relName);
                    }
                }
            }
        }

        return { ...entity, ...loadedRelations } as EntityWithRelations<
            TEntity,
            Pick<TRelations, K>
        >;
    }

    private async loadNestedForOne(entity: any, path: string[]): Promise<any> {
        if (!entity || path.length === 0) return entity;

        const [firstRel, ...restPath] = path;
        const relationConfig = (entity.constructor as any).prototype.relations?.[firstRel];

        if (!relationConfig && this.relations) {
            const relConfig = Object.values(this.relations).find(
                (config: any) => config.relationName === firstRel,
            );

            if (relConfig) {
                const nestedEntity = await this.loadRelationDirect(entity, firstRel, relConfig);

                if (nestedEntity && restPath.length > 0) {
                    if (Array.isArray(nestedEntity)) {
                        return this.loadNestedForMany(nestedEntity, restPath);
                    } else {
                        return this.loadNestedForOne(nestedEntity, restPath);
                    }
                }

                return nestedEntity;
            }
        }

        return entity;
    }

    private async loadNestedForMany(entities: any[], path: string[]): Promise<any[]> {
        if (!entities || entities.length === 0 || path.length === 0) return entities;

        const [firstRel, ...restPath] = path;

        return Promise.all(
            entities.map(async (entity) => {
                const nested = await this.loadNestedRelationDynamic(entity, firstRel);

                if (nested && restPath.length > 0) {
                    if (Array.isArray(nested)) {
                        return {
                            ...entity,
                            [firstRel]: await this.loadNestedForMany(nested, restPath),
                        };
                    } else {
                        return {
                            ...entity,
                            [firstRel]: await this.loadNestedForOne(nested, restPath),
                        };
                    }
                }

                return { ...entity, [firstRel]: nested };
            }),
        );
    }

    // CACHE STRATEGY: Only cache repository instances (metadata), never entities
    // This is safe because repositories are stateless singletons
    // Entities are ALWAYS fetched fresh from DB for data consistency
    private repositoryCache = new Map<string, any>();

    private async loadNestedRelationDynamic(entity: any, relationName: string): Promise<any> {
        if (!this.repositoryRegistry) {
            return null;
        }

        const entityConstructorName = entity.constructor.name;

        let relatedRepo = this.repositoryCache.get(entityConstructorName);
        if (!relatedRepo) {
            relatedRepo = this.repositoryRegistry.get(entityConstructorName);
            if (relatedRepo) {
                this.repositoryCache.set(entityConstructorName, relatedRepo);
            }
        }

        if (relatedRepo && typeof relatedRepo.loadRelation === 'function') {
            try {
                return await relatedRepo.loadRelation(entity, relationName);
            } catch (error) {
                this.logger.warn(
                    `Failed to load nested relation "${relationName}" for entity "${entityConstructorName}": ${error}`,
                );
                return null;
            }
        }

        return null;
    }

    private async loadRelationDirect(entity: any, relationName: string, config: any): Promise<any> {
        const entityId = (entity as any).id;

        if (config.type === RelationType.ONE_TO_MANY) {
            return this.getRelationLoader().loadOneToMany(config, entityId);
        }

        if (config.type === RelationType.MANY_TO_ONE) {
            const foreignKeyValue = (entity as any)[config.relationName];
            return this.getRelationLoader().loadManyToOne(config, foreignKeyValue);
        }

        if (config.type === RelationType.MANY_TO_MANY) {
            return this.getRelationLoader().loadManyToMany(config, entityId);
        }

        return null;
    }

    async withRelationsMany<K extends keyof TRelations>(
        entities: TEntity[],
        relationNames: K[],
    ): Promise<EntityWithRelations<TEntity, Pick<TRelations, K>>[]> {
        if (!this.relations || relationNames.length === 0) {
            return entities as EntityWithRelations<TEntity, Pick<TRelations, K>>[];
        }

        return Promise.all(
            entities.map(async (entity) => {
                const relations = await this.loadRelations(entity, relationNames);
                return { ...entity, ...relations } as EntityWithRelations<
                    TEntity,
                    Pick<TRelations, K>
                >;
            }),
        );
    }
}
