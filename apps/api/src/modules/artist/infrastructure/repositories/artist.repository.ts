import {
    BaseRepository,
    EntityWithRelations,
    QueryOptions,
    relation,
    RepositoryRegistry,
} from '@api/modules/core/database/base';
import { DatabaseService } from '@api/modules/core/database/services/database.service';
import { UnitOfWorkService } from '@api/modules/core/database/unit-of-work/unit-of-work.service';
import { LogService } from '@api/modules/core/logger/services/logger.service';
import { Injectable } from '@nestjs/common';
import { Album } from '../../domain/entities/album.entity';
import { Artist } from '../../domain/entities/artist.entity';
import {
    ARTIST_REPOSITORY,
    ArtistField,
    IArtistRepository,
} from '../../domain/repositories/i-artist.repository';
import { albums } from '../schemas/album.schema';
import { artists } from '../schemas/artist.schema';

type ArtistRelations = {
    albums: Album[];
};

@Injectable()
export class ArtistRepositoryImpl
    extends BaseRepository<Artist, typeof artists, ArtistField, ArtistRelations>
    implements IArtistRepository
{
    protected table = artists;
    protected entityName = 'Artist';

    protected relations = {
        albums: relation.oneToMany({
            entity: Album,
            table: albums,
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
        this.registry.register('Artist', this, ARTIST_REPOSITORY);
    }

    protected toDomain(schema: typeof artists.$inferSelect): Artist {
        return new Artist(
            schema.id,
            schema.name,
            schema.country,
            schema.bio,
            schema.createdAt,
            schema.updatedAt,
        );
    }

    protected toSchema(entity: Artist): any {
        return {
            name: entity.name,
            country: entity.country,
            bio: entity.bio,
        };
    }

    async findByName(
        name: string,
        options?: QueryOptions<ArtistField, ArtistRelations>,
    ): Promise<Artist | EntityWithRelations<Artist, ArtistRelations> | null> {
        return this.findOne({
            filter: {
                field: 'name',
                operator: 'eq' as any,
                value: name,
            },
            ...options,
        });
    }
}
