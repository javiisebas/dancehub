import { BaseRepository, relation, RepositoryRegistry } from '@api/modules/core/database/base';
import { DatabaseService } from '@api/modules/core/database/services/database.service';
import { UnitOfWorkService } from '@api/modules/core/database/unit-of-work/unit-of-work.service';
import { LogService } from '@api/modules/core/logger/services/logger.service';
import { Injectable } from '@nestjs/common';
import { Album } from '../../domain/entities/album.entity';
import { Artist } from '../../domain/entities/artist.entity';
import { Song } from '../../domain/entities/song.entity';
import { albums } from '../schemas/album.schema';
import { artists } from '../schemas/artist.schema';
import { songs } from '../schemas/song.schema';

type AlbumRelations = {
    songs: Song[];
    artist: Artist;
};

type AlbumField = 'title' | 'releaseYear' | 'artistId';

@Injectable()
export class AlbumRepositoryImpl extends BaseRepository<
    Album,
    typeof albums,
    AlbumField,
    AlbumRelations
> {
    protected table = albums;
    protected entityName = 'Album';

    protected relations = {
        songs: relation.oneToMany({
            entity: Song,
            table: songs,
            foreignKey: 'albumId',
        }),
        artist: relation.manyToOne({
            entity: Artist,
            table: artists,
            foreignKey: 'artistId',
        }),
    };

    constructor(
        databaseService: DatabaseService,
        unitOfWorkService: UnitOfWorkService,
        logger: LogService,
        private readonly registry: RepositoryRegistry,
    ) {
        super(databaseService, unitOfWorkService, logger, registry);
        this.registry.register('Album', this);
    }

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
}
