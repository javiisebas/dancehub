import { BaseRepository, defineRelations, relation } from '@api/modules/core/database/base';
import { Injectable } from '@nestjs/common';
import { Event } from '../../domain/entities/event.entity';
import { IEventRepository } from '../../domain/repositories/i-event.repository';
import { events } from '../schemas/event.schema';
import { EventStatusEnum } from '@repo/shared';
import { EventCategoryEnum } from '@repo/shared';
import { User } from '../../../user/domain/entities/user.entity';
import { users } from '../../../user/infrastructure/schemas/user.schema';
import { DanceStyle } from '../../../dance-style/domain/entities/dance-style.entity';
import { danceStyles } from '../../../dance-style/infrastructure/schemas/dance-style.schema';

const eventRelations = defineRelations({
    organizer: relation.manyToOne({
        entity: User,
        table: users,
        foreignKey: 'organizerId',
    }),
    danceStyle: relation.manyToOne({
        entity: DanceStyle,
        table: danceStyles,
        foreignKey: 'danceStyleId',
    }),
});

@Injectable()
export class EventRepositoryImpl
    extends BaseRepository<Event, typeof events, typeof eventRelations>
    implements IEventRepository
{
    protected readonly table = events;
    protected readonly entityName = 'Event';
    protected readonly relations = eventRelations;

    protected toDomain(schema: typeof events.$inferSelect): Event {
        return Event.fromPersistence({
            id: schema.id,
            title: schema.title,
            slug: schema.slug,
            description: schema.description,
            startDate: schema.startDate,
            endDate: schema.endDate,
            status: schema.status as EventStatusEnum,
            category: schema.category as EventCategoryEnum,
            maxAttendees: schema.maxAttendees,
            price: schema.price ? parseFloat(schema.price) : null,
            isFeatured: schema.isFeatured,
            organizerId: schema.organizerId,
            danceStyleId: schema.danceStyleId,
            createdAt: schema.createdAt,
            updatedAt: schema.updatedAt,
        });
    }

    protected toSchema(entity: Event): any {
        return {
            title: entity.title,
            slug: entity.slug,
            ...(entity.description !== undefined && { description: entity.description }),
            startDate: entity.startDate,
            endDate: entity.endDate,
            status: entity.status,
            category: entity.category,
            ...(entity.maxAttendees !== undefined && { maxAttendees: entity.maxAttendees }),
            ...(entity.price !== undefined && { price: entity.price }),
            isFeatured: entity.isFeatured,
            organizerId: entity.organizerId,
            danceStyleId: entity.danceStyleId,
        };
    }
}
