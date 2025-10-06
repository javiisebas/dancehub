import { EntityWithRelations, QueryOptions } from '@api/modules/core/database/base';
import { IBaseRepository } from '@api/modules/core/database/interfaces/i-base.repository';
import { Album } from '../entities/album.entity';
import { Artist } from '../entities/artist.entity';

export const ARTIST_REPOSITORY = Symbol('ARTIST_REPOSITORY');

type ArtistRelations = {
    albums: Album[];
};

export type ArtistField = 'name' | 'country' | 'bio';

export interface IArtistRepository extends IBaseRepository<Artist, ArtistField, ArtistRelations> {
    findByName(
        name: string,
        options?: QueryOptions<ArtistField, ArtistRelations>,
    ): Promise<Artist | EntityWithRelations<Artist, ArtistRelations> | null>;
}
