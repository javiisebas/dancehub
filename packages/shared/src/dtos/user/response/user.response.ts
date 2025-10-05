import { Expose } from 'class-transformer';
import { BaseResponse } from '../../common';

export class UserResponse extends BaseResponse {
    @Expose()
    email!: string;

    @Expose()
    name!: string;
}
