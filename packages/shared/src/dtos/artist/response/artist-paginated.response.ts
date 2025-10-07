import { Expose, Type } from 'class-transformer';
import { PaginatedResponse } from '../../common';
import { ArtistResponse } from './artist.response';

export class ArtistPaginatedResponse extends PaginatedResponse<ArtistResponse> {
    @Expose()
    @Type(() => ArtistResponse)
    declare data: ArtistResponse[];
}
