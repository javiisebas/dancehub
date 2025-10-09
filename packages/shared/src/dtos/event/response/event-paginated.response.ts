import { Expose, Type } from 'class-transformer';
import { PaginatedResponse } from '../../common';
import { EventResponse } from './event.response';

export class EventPaginatedResponse extends PaginatedResponse<EventResponse> {
    @Expose()
    @Type(() => EventResponse)
    declare data: EventResponse[];
}
