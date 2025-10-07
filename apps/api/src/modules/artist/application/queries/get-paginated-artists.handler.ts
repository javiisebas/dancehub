import {
    BaseGetPaginatedHandler,
    GetPaginatedQueryEnhanced,
} from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { PaginatedArtistRequest } from '@repo/shared';
import { Artist } from '../../domain/entities/artist.entity';
import {
    ARTIST_REPOSITORY,
    ArtistField,
    ArtistRelations,
    IArtistRepository,
} from '../../domain/repositories/i-artist.repository';

export class GetPaginatedArtistsQuery extends GetPaginatedQueryEnhanced<PaginatedArtistRequest> {}

@Injectable()
export class GetPaginatedArtistsHandler extends BaseGetPaginatedHandler<
    Artist,
    PaginatedArtistRequest,
    ArtistField,
    ArtistRelations
> {
    constructor(@Inject(ARTIST_REPOSITORY) repository: IArtistRepository) {
        super(repository);
    }
}
