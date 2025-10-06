import type { Filter, PaginatedRequest, PaginatedResponse } from '@repo/shared';
import type { QueryOptions } from '../base/types/query-options.types';

export interface IBaseRepository<
    TEntity,
    TField extends string = string,
    TRelations extends Record<string, any> = {},
> {
    findById(id: string | number, options?: QueryOptions<TField, TRelations>): Promise<TEntity>;
    findOne(options?: QueryOptions<TField, TRelations>): Promise<TEntity | null>;
    findMany(options?: QueryOptions<TField, TRelations>): Promise<TEntity[]>;

    paginate(
        request: PaginatedRequest<TField>,
        options?: QueryOptions<TField, TRelations>,
    ): Promise<PaginatedResponse<TEntity>>;

    create(data: unknown): Promise<TEntity>;
    save(entity: TEntity): Promise<TEntity>;

    createMany(data: unknown[]): Promise<TEntity[]>;
    update(id: string | number, data: unknown): Promise<TEntity>;
    updateEntity(entity: TEntity): Promise<TEntity>;
    updateMany(filter: Filter<TField>, data: unknown): Promise<TEntity[]>;
    delete(id: string | number): Promise<void>;
    deleteMany(filter: Filter<TField>): Promise<number>;

    exists(filter: Filter<TField>): Promise<boolean>;
    count(filter?: Filter<TField>): Promise<number>;
}
