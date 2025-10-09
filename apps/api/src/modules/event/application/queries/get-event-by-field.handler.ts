import { BaseGetByFieldHandler, GetByFieldQuery } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { Event } from '../../domain/entities/event.entity';
import {
    IEventRepository,
    EVENT_REPOSITORY,
    EventField,
    EventRelations,
} from '../../domain/repositories/i-event.repository';

export class GetEventByFieldQuery extends GetByFieldQuery<EventField, EventRelations> {}

@Injectable()
export class GetEventByFieldHandler extends BaseGetByFieldHandler<Event, EventField, EventRelations> {
    constructor(@Inject(EVENT_REPOSITORY) repository: IEventRepository) {
        super(repository);
    }
}
