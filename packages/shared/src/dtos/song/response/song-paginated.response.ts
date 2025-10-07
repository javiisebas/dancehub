import { Expose, Type } from 'class-transformer';
import { PaginatedResponse } from '../../common';
import { SongResponse } from './song.response';

export class SongPaginatedResponse extends PaginatedResponse<SongResponse> {
    @Expose()
    @Type(() => SongResponse)
    declare data: SongResponse[];
}
