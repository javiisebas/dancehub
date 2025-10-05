import { Expose, Type } from 'class-transformer';
import { PaginatedResponse } from '../../common';
import { DanceStyleResponse } from './dance-style.response';

export class DanceStylePaginatedResponse extends PaginatedResponse<DanceStyleResponse> {
    @Expose()
    @Type(() => DanceStyleResponse)
    declare data: DanceStyleResponse[];
}
