import { LogService } from '@api/modules/core/logger/services/logger.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { Filter, PaginatedRequest, Sort } from '@repo/shared';
import { PaginatedResponse } from '@repo/shared';
import { eq, SQL, sql } from 'drizzle-orm';
import { PgColumn, PgTable } from 'drizzle-orm/pg-core';
import { DatabaseService } from '../services/database.service';
import { UnitOfWorkService } from '../unit-of-work/unit-of-work.service';
import { IBaseRepository } from './base.repository.interface';
import { QueryBuilder } from './query-builder';

export type WhereCondition = SQL | undefined;

@Injectable()
export abstract class BaseRepository<
    TEntity,
    TTable extends PgTable,
    TField extends string = string,
> implements IBaseRepository<TEntity, TField>
{
    protected abstract table: TTable;
    protected abstract entityName: string;
    protected fieldColumnMap?: Partial<Record<TField, keyof TTable>>;

    protected abstract toDomain(schema: TTable['$inferSelect']): TEntity;
    protected abstract toSchema(entity: TEntity): Partial<TTable['$inferInsert']>;

    private queryBuilder!: QueryBuilder<TTable, TField>;

    constructor(
        protected readonly databaseService: DatabaseService,
        protected readonly unitOfWorkService: UnitOfWorkService,
        protected readonly logger: LogService,
    ) {}

    protected getQueryBuilder(): QueryBuilder<TTable, TField> {
        if (!this.queryBuilder) {
            this.queryBuilder = new QueryBuilder(this.table, this.fieldColumnMap);
        }
        return this.queryBuilder;
    }

    protected get db(): DatabaseService['db'] {
        return (
            (this.unitOfWorkService.getTransaction() as DatabaseService['db']) ||
            this.databaseService.db
        );
    }

    async findById(id: string | number): Promise<TEntity> {
        const idColumn = this.getIdColumn();
        const result = await this.db.select().from(this.table).where(eq(idColumn, id)).limit(1);

        if (!result.length) {
            throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
        }
        return this.toDomain(result[0] as TTable['$inferSelect']);
    }

    async findOne(filter?: Filter<TField>): Promise<TEntity | null> {
        const where = this.getQueryBuilder().buildWhereClause(filter);
        const result = await this.db.select().from(this.table).where(where).limit(1);
        return result.length ? this.toDomain(result[0] as TTable['$inferSelect']) : null;
    }

    async findMany(
        filter?: Filter<TField>,
        sort?: Sort<TField>,
        limit?: number,
    ): Promise<TEntity[]> {
        const where = this.getQueryBuilder().buildWhereClause(filter);
        const orderBy = this.getQueryBuilder().buildOrderByClause(sort);

        let query = this.db.select().from(this.table).where(where).$dynamic();

        if (orderBy.length > 0) {
            query = query.orderBy(...orderBy);
        }

        if (limit !== undefined) {
            query = query.limit(limit);
        }

        const result = await query;
        return result.map((r) => this.toDomain(r as TTable['$inferSelect']));
    }

    async paginate(request: PaginatedRequest<TField>): Promise<PaginatedResponse<TEntity>> {
        const { page, limit, filter, sort } = request;
        const offset = (page - 1) * limit;

        const where = this.getQueryBuilder().buildWhereClause(filter as Filter<TField>);
        const orderBy = this.getQueryBuilder().buildOrderByClause(sort as Sort<TField>);

        const [data, countResult] = await Promise.all([
            (async () => {
                let query = this.db
                    .select()
                    .from(this.table)
                    .where(where)
                    .offset(offset)
                    .limit(limit)
                    .$dynamic();

                if (orderBy.length > 0) {
                    query = query.orderBy(...orderBy);
                }

                return query;
            })(),
            this.db
                .select({ count: sql<number>`count(*)::int` })
                .from(this.table)
                .where(where),
        ]);

        const total = Number(countResult[0]?.count || 0);
        const totalPages = Math.ceil(total / limit);
        const entities = data.map((r) => this.toDomain(r as TTable['$inferSelect']));

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
}
