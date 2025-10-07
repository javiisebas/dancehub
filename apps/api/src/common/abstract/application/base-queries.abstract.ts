import { IBaseRepository } from '@api/modules/core/database/interfaces/i-base.repository';
import { Injectable } from '@nestjs/common';
import { Filter, PaginatedRequest, PaginatedResponse } from '@repo/shared';

/**
 * Base Query for finding entity by any field with relations support
 * More flexible than just by ID
 *
 * @example
 * ```typescript
 * // Find by ID
 * new GetByFieldQuery('id', '123', { with: ['albums'] })
 *
 * // Find by slug
 * new GetByFieldQuery('slug', 'my-slug', { with: ['albums'] })
 * ```
 */
export class GetByFieldQuery<TField extends string = string, TRelations = any> {
    constructor(
        public readonly field: TField | 'id',
        public readonly value: string | number,
        public readonly options?: {
            with?: (keyof TRelations)[];
            locale?: string;
            includeAllTranslations?: boolean;
        },
    ) {}
}

/**
 * Base Query for finding multiple entities with filters and relations
 *
 * @example
 * ```typescript
 * new FindManyQuery({
 *   filter: { field: 'country', operator: 'eq', value: 'Spain' },
 *   with: ['albums'],
 *   sort: { field: 'name', order: 'asc' },
 *   limit: 10
 * })
 * ```
 */
export class FindManyQuery<TField extends string = string, TRelations = any> {
    constructor(
        public readonly options?: {
            filter?: Filter<TField>;
            sort?: any;
            limit?: number;
            with?: (keyof TRelations)[];
            locale?: string;
            includeAllTranslations?: boolean;
        },
    ) {}
}

/**
 * Base Query for paginated results with full power
 * Supports filters, sorting, and relations
 */
export class GetPaginatedQueryEnhanced<TRequest extends PaginatedRequest = any> {
    constructor(
        public readonly data: TRequest,
        public readonly options?: {
            with?: string[];
            locale?: string;
        },
    ) {}
}

/**
 * Generic handler for GetByField queries
 * Works for both translatable and non-translatable entities
 */
@Injectable()
export abstract class BaseGetByFieldHandler<
    TEntity,
    TField extends string = string,
    TRelations = any,
> {
    constructor(protected readonly repository: IBaseRepository<TEntity, TField, TRelations>) {}

    async execute(query: GetByFieldQuery<TField, TRelations>): Promise<TEntity | null> {
        if (query.field === 'id') {
            return this.repository.findById(
                query.value as string,
                {
                    with: query.options?.with as any,
                    locale: query.options?.locale,
                    includeAllTranslations: query.options?.includeAllTranslations,
                } as any,
            );
        }

        return this.repository.findOne({
            filter: {
                field: query.field as TField,
                operator: 'eq' as any,
                value: query.value,
            },
            with: query.options?.with as any,
            locale: query.options?.locale,
            includeAllTranslations: query.options?.includeAllTranslations,
        } as any);
    }
}

/**
 * Generic handler for FindMany queries
 * Works for both translatable and non-translatable entities
 */
@Injectable()
export abstract class BaseFindManyHandler<
    TEntity,
    TField extends string = string,
    TRelations = any,
> {
    constructor(protected readonly repository: IBaseRepository<TEntity, TField, TRelations>) {}

    async execute(query: FindManyQuery<TField, TRelations>): Promise<TEntity[]> {
        return this.repository.findMany({
            filter: query.options?.filter as any,
            sort: query.options?.sort,
            limit: query.options?.limit,
            with: query.options?.with as any,
            locale: query.options?.locale,
            includeAllTranslations: query.options?.includeAllTranslations,
        } as any);
    }
}

/**
 * Enhanced paginated handler with relations support
 */
@Injectable()
export abstract class BaseGetPaginatedHandler<
    TEntity,
    TRequest extends PaginatedRequest = any,
    TField extends string = string,
    TRelations = any,
> {
    constructor(protected readonly repository: IBaseRepository<TEntity, TField, TRelations>) {}

    async execute(query: GetPaginatedQueryEnhanced<TRequest>): Promise<PaginatedResponse<TEntity>> {
        return this.repository.paginate(
            query.data as any,
            {
                with: query.options?.with as any,
                locale: query.options?.locale,
            } as any,
        );
    }
}
