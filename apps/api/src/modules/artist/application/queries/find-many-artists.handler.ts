import { BaseFindManyHandler, FindManyQuery } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { Artist } from '../../domain/entities/artist.entity';
import {
    ARTIST_REPOSITORY,
    ArtistField,
    ArtistRelations,
    IArtistRepository,
} from '../../domain/repositories/i-artist.repository';

export class FindManyArtistsQuery extends FindManyQuery<ArtistField, ArtistRelations> {}

@Injectable()
export class FindManyArtistsHandler extends BaseFindManyHandler<
    Artist,
    ArtistField,
    ArtistRelations
> {
    constructor(@Inject(ARTIST_REPOSITORY) repository: IArtistRepository) {
        super(repository);
    }
}
