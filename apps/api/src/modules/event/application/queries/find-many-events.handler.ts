import { BaseFindManyHandler, FindManyQuery } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { Event } from '../../domain/entities/event.entity';
import {
    IEventRepository,
    EVENT_REPOSITORY,
    EventField,
    EventRelations,
} from '../../domain/repositories/i-event.repository';

export class FindManyEventsQuery extends FindManyQuery<EventField, EventRelations> {}

@Injectable()
export class FindManyEventsHandler extends BaseFindManyHandler<Event, EventField, EventRelations> {
    constructor(@Inject(EVENT_REPOSITORY) repository: IEventRepository) {
        super(repository);
    }
}
