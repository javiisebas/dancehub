import { BaseRepository, defineRelations, relation } from '@api/modules/core/database/base';
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Album } from '../../domain/entities/album.entity';
import { Artist } from '../../domain/entities/artist.entity';
import { Song } from '../../domain/entities/song.entity';
import { IAlbumRepository } from '../../domain/repositories/i-album.repository';
import { albums } from '../schemas/album.schema';
import { artists } from '../schemas/artist.schema';
import { songs } from '../schemas/song.schema';

const albumRelations = defineRelations({
    artist: relation.manyToOne({
        entity: Artist,
        table: artists,
        foreignKey: 'artistId',
    }),
    songs: relation.oneToMany({
        entity: Song,
        table: songs,
        foreignKey: 'albumId',
    }),
});

@Injectable()
export class AlbumRepositoryImpl
    extends BaseRepository<Album, typeof albums, typeof albumRelations>
    implements IAlbumRepository
{
    protected readonly table = albums;
    protected readonly entityName = 'Album';
    protected readonly relations = albumRelations;

    protected toDomain(schema: typeof albums.$inferSelect): Album {
        return new Album(
            schema.id,
            schema.artistId,
            schema.title,
            schema.releaseYear,
            schema.createdAt,
            schema.updatedAt,
        );
    }

    protected toSchema(entity: Album): any {
        return {
            artistId: entity.artistId,
            title: entity.title,
            releaseYear: entity.releaseYear,
        };
    }

    async findByArtistId(artistId: string): Promise<Album[]> {
        const results = await this.db
            .select()
            .from(this.table)
            .where(eq(this.table.artistId, artistId));
        return results.map((row) => this.toDomain(row));
    }
}
