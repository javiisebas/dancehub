import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PaginatedResponse<T> {
    @Expose()
    data!: T[];

    @Expose()
    total!: number;

    @Expose()
    page!: number;

    @Expose()
    limit!: number;

    @Expose()
    totalPages!: number;

    @Expose()
    hasNext!: boolean;

    @Expose()
    hasPrev!: boolean;

    constructor(partial?: PaginatedResponse<T>) {
        if (partial) {
            Object.assign(this, partial);
        }
    }
}
