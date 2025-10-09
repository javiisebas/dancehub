import {
    BaseGetPaginatedHandler,
    GetPaginatedQueryEnhanced,
} from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { PaginatedLessonAttachmentRequest } from '@repo/shared';
import { LessonAttachment } from '../../domain/entities/lesson-attachment.entity';
import {
    ILessonAttachmentRepository,
    LESSON_ATTACHMENT_REPOSITORY,
    LessonAttachmentField,
    LessonAttachmentRelations,
} from '../../domain/repositories/i-lesson-attachment.repository';

export class GetPaginatedLessonAttachmentsQuery extends GetPaginatedQueryEnhanced<PaginatedLessonAttachmentRequest> {}

@Injectable()
export class GetPaginatedLessonAttachmentsHandler extends BaseGetPaginatedHandler<
    LessonAttachment,
    PaginatedLessonAttachmentRequest,
    LessonAttachmentField,
    LessonAttachmentRelations
> {
    constructor(@Inject(LESSON_ATTACHMENT_REPOSITORY) repository: ILessonAttachmentRepository) {
        super(repository);
    }
}
