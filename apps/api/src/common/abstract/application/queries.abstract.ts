import { PaginatedRequest } from '@repo/shared';

export abstract class Query<T> {
    constructor(public readonly data: T) {}
}
export abstract class GetPaginatedQuery<T extends PaginatedRequest> extends Query<T> {}

export abstract class GetByIdQuery {
    constructor(public readonly id: string) {}
}
