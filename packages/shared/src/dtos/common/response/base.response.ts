import { Expose } from 'class-transformer';

export abstract class BaseResponse {
    @Expose()
    id: string;

    @Expose()
    createdAt: string;

    @Expose()
    updatedAt: string;
}
