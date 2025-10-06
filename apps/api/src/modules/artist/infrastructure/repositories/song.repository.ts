import { BaseRepository, relation, RepositoryRegistry } from '@api/modules/core/database/base';
import { DatabaseService } from '@api/modules/core/database/services/database.service';
import { UnitOfWorkService } from '@api/modules/core/database/unit-of-work/unit-of-work.service';
import { LogService } from '@api/modules/core/logger/services/logger.service';
import { Injectable } from '@nestjs/common';
import { Album } from '../../domain/entities/album.entity';
import { Song } from '../../domain/entities/song.entity';
import { albums } from '../schemas/album.schema';
import { songs } from '../schemas/song.schema';

type SongRelations = {
    album: Album;
};

type SongField = 'title' | 'duration' | 'trackNumber' | 'albumId';

@Injectable()
export class SongRepositoryImpl extends BaseRepository<
    Song,
    typeof songs,
    SongField,
    SongRelations
> {
    protected table = songs;
    protected entityName = 'Song';

    protected relations = {
        album: relation.manyToOne({
            entity: Album,
            table: albums,
            foreignKey: 'albumId',
        }),
    };

    constructor(
        databaseService: DatabaseService,
        unitOfWorkService: UnitOfWorkService,
        logger: LogService,
        private readonly registry: RepositoryRegistry,
    ) {
        super(databaseService, unitOfWorkService, logger, registry);
        this.registry.register('Song', this);
    }

    protected toDomain(schema: typeof songs.$inferSelect): Song {
        return new Song(
            schema.id,
            schema.albumId,
            schema.title,
            schema.duration,
            schema.trackNumber,
            schema.createdAt,
            schema.updatedAt,
        );
    }

    protected toSchema(entity: Song): any {
        return {
            albumId: entity.albumId,
            title: entity.title,
            duration: entity.duration,
            trackNumber: entity.trackNumber,
        };
    }
}
