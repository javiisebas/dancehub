import { InferFields } from '@api/modules/core/database/base';
import { IBaseRepository } from '@api/modules/core/database/interfaces/i-base.repository';
import { albums } from '../../infrastructure/schemas/album.schema';
import { Album } from '../entities/album.entity';
import { Artist } from '../entities/artist.entity';
import { Song } from '../entities/song.entity';

export const ALBUM_REPOSITORY = Symbol('ALBUM_REPOSITORY');

export type AlbumField = InferFields<typeof albums>;
export type AlbumRelations = {
    artist?: Artist | Artist[];
    songs?: Song | Song[];
};

export interface IAlbumRepository extends IBaseRepository<Album, AlbumField, AlbumRelations> {
    findByArtistId(artistId: string): Promise<Album[]>;
}
