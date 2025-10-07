import { InferFields } from '@api/modules/core/database/base';
import { IBaseRepository } from '@api/modules/core/database/interfaces/i-base.repository';
import { artists } from '../../infrastructure/schemas/artist.schema';
import { Album } from '../entities/album.entity';
import { Artist } from '../entities/artist.entity';
import { Song } from '../entities/song.entity';

export const ARTIST_REPOSITORY = Symbol('ARTIST_REPOSITORY');

export type ArtistField = InferFields<typeof artists>;
export type ArtistRelations = {
    albums?: Album | Album[];
    songs?: Song | Song[];
};

export interface IArtistRepository extends IBaseRepository<Artist, ArtistField, ArtistRelations> {
    findByName(name: string): Promise<Artist | null>;
}
