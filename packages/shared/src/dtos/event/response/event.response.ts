import { Expose } from 'class-transformer';
import { BaseResponse } from '../../common/response/base.response';
import { EventStatusEnum } from '../../../enums/event-status.enum';
import { EventCategoryEnum } from '../../../enums/event-category.enum';

export class EventResponse extends BaseResponse {
    @Expose()
    title: string;

    @Expose()
    slug: string;

    @Expose()
    description?: string;

    @Expose()
    startDate: Date;

    @Expose()
    endDate: Date;

    @Expose()
    status: EventStatusEnum;

    @Expose()
    category: EventCategoryEnum;

    @Expose()
    maxAttendees?: number;

    @Expose()
    price?: number;

    @Expose()
    isFeatured: boolean;

    @Expose()
    organizerId: string;

    @Expose()
    danceStyleId: string;

}
