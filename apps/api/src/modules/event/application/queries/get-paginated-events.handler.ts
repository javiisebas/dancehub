import {
    BaseGetPaginatedHandler,
    GetPaginatedQueryEnhanced,
} from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { PaginatedEventRequest } from '@repo/shared';
import { Event } from '../../domain/entities/event.entity';
import {
    IEventRepository,
    EVENT_REPOSITORY,
    EventField,
    EventRelations,
} from '../../domain/repositories/i-event.repository';

export class GetPaginatedEventsQuery extends GetPaginatedQueryEnhanced<PaginatedEventRequest> {}

@Injectable()
export class GetPaginatedEventsHandler extends BaseGetPaginatedHandler<
    Event,
    PaginatedEventRequest,
    EventField,
    EventRelations
> {
    constructor(@Inject(EVENT_REPOSITORY) repository: IEventRepository) {
        super(repository);
    }
}
