import { CreateCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import { CreateEventRequest } from '@repo/shared';
import { randomUUID } from 'crypto';
import { Event } from '../../domain/entities/event.entity';
import {
    IEventRepository,
    EVENT_REPOSITORY,
} from '../../domain/repositories/i-event.repository';

export class CreateEventCommand extends CreateCommand<CreateEventRequest> {}

@Injectable()
export class CreateEventHandler {
    constructor(
        @Inject(EVENT_REPOSITORY) private readonly repository: IEventRepository,
    ) {}

    async execute({ data }: CreateEventCommand) {
        const event = Event.create({
            id: randomUUID(),
            title: data.title,
            slug: data.slug,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
            status: data.status,
            category: data.category,
            maxAttendees: data.maxAttendees,
            price: data.price,
            isFeatured: data.isFeatured,
            organizerId: data.organizerId,
            danceStyleId: data.danceStyleId,
        });

        return this.repository.save(event);
    }
}