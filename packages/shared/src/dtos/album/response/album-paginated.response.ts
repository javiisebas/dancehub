import { Expose, Type } from 'class-transformer';
import { PaginatedResponse } from '../../common';
import { AlbumResponse } from './album.response';

export class AlbumPaginatedResponse extends PaginatedResponse<AlbumResponse> {
    @Expose()
    @Type(() => AlbumResponse)
    declare data: AlbumResponse[];
}
