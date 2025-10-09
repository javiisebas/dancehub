import { Expose, Type } from 'class-transformer';
import { PaginatedResponse } from '../../common';
import { LessonAttachmentResponse } from './lesson-attachment.response';

export class LessonAttachmentPaginatedResponse extends PaginatedResponse<LessonAttachmentResponse> {
    @Expose()
    @Type(() => LessonAttachmentResponse)
    declare data: LessonAttachmentResponse[];
}
