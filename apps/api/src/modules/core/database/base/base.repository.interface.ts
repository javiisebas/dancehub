import type { Filter, PaginatedRequest, PaginatedResponse, Sort } from '@repo/shared';
import type { WithRelationsOptions } from './relation-builder';

export interface IBaseRepository<TEntity, TField extends string = string> {
    findById(id: string | number, options?: WithRelationsOptions): Promise<TEntity>;
    findOne(filter?: Filter<TField>, options?: WithRelationsOptions): Promise<TEntity | null>;
    findMany(
        filter?: Filter<TField>,
        sort?: Sort<TField>,
        limit?: number,
        options?: WithRelationsOptions,
    ): Promise<TEntity[]>;

    paginate(
        request: PaginatedRequest<TField>,
        options?: WithRelationsOptions,
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
