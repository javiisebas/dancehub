import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export abstract class BaseResponse {
    @Expose()
    id!: string;

    @Expose()
    @Transform(({ value }) => {
        if (!value) return value;
        if (value instanceof Date) return value.toISOString();
        if (typeof value === 'string') return value;
        return value;
    })
    createdAt!: string;

    @Expose()
    @Transform(({ value }) => {
        if (!value) return value;
        if (value instanceof Date) return value.toISOString();
        if (typeof value === 'string') return value;
        return value;
    })
    updatedAt!: string;
}
