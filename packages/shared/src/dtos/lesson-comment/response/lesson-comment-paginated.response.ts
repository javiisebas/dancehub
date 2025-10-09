import { Expose, Type } from 'class-transformer';
import { PaginatedResponse } from '../../common';
import { LessonCommentResponse } from './lesson-comment.response';

export class LessonCommentPaginatedResponse extends PaginatedResponse<LessonCommentResponse> {
    @Expose()
    @Type(() => LessonCommentResponse)
    declare data: LessonCommentResponse[];
}
