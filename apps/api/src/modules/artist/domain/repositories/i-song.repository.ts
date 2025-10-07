import { InferFields } from '@api/modules/core/database/base';
import { IBaseRepository } from '@api/modules/core/database/interfaces/i-base.repository';
import { songs } from '../../infrastructure/schemas/song.schema';
import { Album } from '../entities/album.entity';
import { Artist } from '../entities/artist.entity';
import { Song } from '../entities/song.entity';

export const SONG_REPOSITORY = Symbol('SONG_REPOSITORY');

export type SongField = InferFields<typeof songs>;
export type SongRelations = {
    album?: Album | Album[];
    artist?: Artist | Artist[];
};

export interface ISongRepository extends IBaseRepository<Song, SongField, SongRelations> {
    findByAlbumId(albumId: string): Promise<Song[]>;
    findByArtistId(artistId: string): Promise<Song[]>;
}
