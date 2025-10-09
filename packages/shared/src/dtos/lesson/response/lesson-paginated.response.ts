import { Expose, Type } from 'class-transformer';
import { PaginatedResponse } from '../../common';
import { LessonResponse } from './lesson.response';

export class LessonPaginatedResponse extends PaginatedResponse<LessonResponse> {
    @Expose()
    @Type(() => LessonResponse)
    declare data: LessonResponse[];
}
