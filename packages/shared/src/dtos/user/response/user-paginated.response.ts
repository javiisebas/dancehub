import { Expose, Type } from 'class-transformer';
import { PaginatedResponse } from '../../common';
import { UserResponse } from './user.response';

export class UserPaginatedResponse extends PaginatedResponse<UserResponse> {
    @Expose()
    @Type(() => UserResponse)
    declare data: UserResponse[];
}
