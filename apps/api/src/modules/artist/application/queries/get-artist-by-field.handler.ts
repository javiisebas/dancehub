import { BaseGetByFieldHandler, GetByFieldQuery } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { Artist } from '../../domain/entities/artist.entity';
import {
    ARTIST_REPOSITORY,
    ArtistField,
    ArtistRelations,
    IArtistRepository,
} from '../../domain/repositories/i-artist.repository';

export class GetArtistByFieldQuery extends GetByFieldQuery<ArtistField, ArtistRelations> {}

@Injectable()
export class GetArtistByFieldHandler extends BaseGetByFieldHandler<
    Artist,
    ArtistField,
    ArtistRelations
> {
    constructor(@Inject(ARTIST_REPOSITORY) repository: IArtistRepository) {
        super(repository);
    }
}
