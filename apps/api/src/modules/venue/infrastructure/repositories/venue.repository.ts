import { BaseRepository, EntityWithRelations, relation } from '@api/modules/core/database/base';
import { DatabaseService } from '@api/modules/core/database/services/database.service';
import { UnitOfWorkService } from '@api/modules/core/database/unit-of-work/unit-of-work.service';
import { LogService } from '@api/modules/core/logger/services/logger.service';
import { DanceStyle } from '@api/modules/dance-style/domain/entities/dance-style.entity';
import { danceStyles } from '@api/modules/dance-style/infrastructure/schemas/dance-style.schema';
import { User } from '@api/modules/user/domain/entities/user.entity';
import { users } from '@api/modules/user/infrastructure/schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { Venue } from '../../domain/entities/venue.entity';
import { venueDanceStyles } from '../schemas/venue-dance-style.schema';
import { venues } from '../schemas/venue.schema';

type VenueRelations = {
    owner: User;
    danceStyles: DanceStyle[];
};

type VenueField =
    | 'name'
    | 'slug'
    | 'address'
    | 'city'
    | 'country'
    | 'capacity'
    | 'hasParking'
    | 'ownerId';

@Injectable()
export class VenueRepositoryImpl extends BaseRepository<
    Venue,
    typeof venues,
    VenueField,
    VenueRelations
> {
    protected table = venues;
    protected entityName = 'Venue';

    protected relations = {
        owner: relation.manyToOne({
            entity: User,
            table: users,
            foreignKey: 'ownerId',
        }),
        danceStyles: relation.manyToMany({
            entity: DanceStyle,
            table: danceStyles,
            joinTable: venueDanceStyles,
            foreignKey: 'venueId',
            relatedKey: 'danceStyleId',
        }),
    };

    constructor(
        databaseService: DatabaseService,
        unitOfWorkService: UnitOfWorkService,
        logger: LogService,
    ) {
        super(databaseService, unitOfWorkService, logger);
    }

    protected toDomain(schema: typeof venues.$inferSelect): Venue {
        return new Venue(
            schema.id,
            schema.name,
            schema.slug,
            schema.address,
            schema.city,
            schema.country,
            schema.capacity,
            schema.hasParking ?? false,
            schema.ownerId,
            schema.createdAt,
            schema.updatedAt,
        );
    }

    protected toSchema(entity: Venue): any {
        return {
            name: entity.name,
            slug: entity.slug,
            address: entity.address,
            city: entity.city,
            country: entity.country,
            capacity: entity.capacity,
            hasParking: entity.hasParking,
            ownerId: entity.ownerId,
        };
    }

    async findBySlug(
        slug: string,
        options?: { with?: (keyof VenueRelations)[] },
    ): Promise<Venue | EntityWithRelations<Venue, VenueRelations> | null> {
        return this.findOne({
            filter: {
                field: 'slug',
                operator: 'eq' as any,
                value: slug,
            },
            ...options,
        });
    }
}
