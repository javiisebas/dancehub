import { BaseRepository, defineRelations, relation } from '@api/modules/core/database/base';
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Album } from '../../domain/entities/album.entity';
import { Artist } from '../../domain/entities/artist.entity';
import { Song } from '../../domain/entities/song.entity';
import { IArtistRepository } from '../../domain/repositories/i-artist.repository';
import { albums } from '../schemas/album.schema';
import { artists } from '../schemas/artist.schema';
import { songs } from '../schemas/song.schema';

const artistRelations = defineRelations({
    albums: relation.oneToMany({
        entity: Album,
        table: albums,
        foreignKey: 'artistId',
    }),
    songs: relation.oneToMany({
        entity: Song,
        table: songs,
        foreignKey: 'artistId',
    }),
});

@Injectable()
export class ArtistRepositoryImpl
    extends BaseRepository<Artist, typeof artists, typeof artistRelations>
    implements IArtistRepository
{
    protected readonly table = artists;
    protected readonly entityName = 'Artist';
    protected readonly relations = artistRelations;

    protected toDomain(schema: typeof artists.$inferSelect): Artist {
        return new Artist(schema.id, schema.name, schema.createdAt, schema.updatedAt);
    }

    protected toSchema(entity: Artist): any {
        return {
            name: entity.name,
        };
    }

    async findByName(name: string): Promise<Artist | null> {
        const result = await this.db.select().from(this.table).where(eq(this.table.name, name));
        return result.length > 0 ? this.toDomain(result[0]) : null;
    }
}
