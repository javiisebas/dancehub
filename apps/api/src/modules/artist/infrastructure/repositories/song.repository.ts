import { BaseRepository, defineRelations, relation } from '@api/modules/core/database/base';
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Album } from '../../domain/entities/album.entity';
import { Artist } from '../../domain/entities/artist.entity';
import { Song } from '../../domain/entities/song.entity';
import { ISongRepository } from '../../domain/repositories/i-song.repository';
import { albums } from '../schemas/album.schema';
import { artists } from '../schemas/artist.schema';
import { songs } from '../schemas/song.schema';

const songRelations = defineRelations({
    album: relation.manyToOne({
        entity: Album,
        table: albums,
        foreignKey: 'albumId',
    }),
    artist: relation.manyToOne({
        entity: Artist,
        table: artists,
        foreignKey: 'artistId',
    }),
});

@Injectable()
export class SongRepositoryImpl
    extends BaseRepository<Song, typeof songs, typeof songRelations>
    implements ISongRepository
{
    protected readonly table = songs;
    protected readonly entityName = 'Song';
    protected readonly relations = songRelations;

    protected toDomain(schema: typeof songs.$inferSelect): Song {
        return new Song(
            schema.id,
            schema.albumId,
            schema.artistId,
            schema.title,
            schema.duration,
            schema.createdAt,
            schema.updatedAt,
        );
    }

    protected toSchema(entity: Song): any {
        return {
            albumId: entity.albumId,
            artistId: entity.artistId,
            title: entity.title,
            duration: entity.duration,
        };
    }

    async findByAlbumId(albumId: string): Promise<Song[]> {
        const results = await this.db
            .select()
            .from(this.table)
            .where(eq(this.table.albumId, albumId));
        return results.map((row) => this.toDomain(row));
    }

    async findByArtistId(artistId: string): Promise<Song[]> {
        const results = await this.db
            .select()
            .from(this.table)
            .where(eq(this.table.artistId, artistId));
        return results.map((row) => this.toDomain(row));
    }
}
