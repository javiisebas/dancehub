import { PaginatedRequest } from '@repo/shared';

export abstract class GetPaginatedQuery<T extends PaginatedRequest> {
    constructor(public readonly data: T) {}
}

export abstract class GetByIdQuery {
    constructor(public readonly id: string) {}
}
