import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@api/common/exceptions/not-found.exception';

import { UpdateCommand } from '@api/common/abstract/application/commands.abstract';
import { UpdateEventRequest } from '@repo/shared';
import { Event } from '../../domain/entities/event.entity';
import {
    IEventRepository,
    EVENT_REPOSITORY,
} from '../../domain/repositories/i-event.repository';

export class UpdateEventCommand extends UpdateCommand<UpdateEventRequest> {}

@CommandHandler(UpdateEventCommand)
export class UpdateEventHandler implements ICommandHandler<UpdateEventCommand> {
    constructor(
        @Inject(EVENT_REPOSITORY) private readonly repository: IEventRepository,
    ) {}

    async execute(command: UpdateEventCommand): Promise<Event> {
        const { id, data } = command;

        const event = await this.repository.findById(id);
        if (!event) {
            throw new NotFoundException('Event');
        }

        if (data.title !== undefined) {
            event.title = data.title;
        }
        if (data.slug !== undefined) {
            event.slug = data.slug;
        }
        if (data.description !== undefined) {
            event.description = data.description;
        }
        if (data.startDate !== undefined) {
            event.startDate = data.startDate;
        }
        if (data.endDate !== undefined) {
            event.endDate = data.endDate;
        }
        if (data.status !== undefined) {
            event.status = data.status;
        }
        if (data.category !== undefined) {
            event.category = data.category;
        }
        if (data.maxAttendees !== undefined) {
            event.maxAttendees = data.maxAttendees;
        }
        if (data.price !== undefined) {
            event.price = data.price;
        }
        if (data.isFeatured !== undefined) {
            event.isFeatured = data.isFeatured;
        }
        if (data.organizerId !== undefined) {
            event.organizerId = data.organizerId;
        }
        if (data.danceStyleId !== undefined) {
            event.danceStyleId = data.danceStyleId;
        }

        return await this.repository.update(id, event);
    }
}