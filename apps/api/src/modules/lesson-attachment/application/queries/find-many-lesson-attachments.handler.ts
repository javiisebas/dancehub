import { BaseFindManyHandler, FindManyQuery } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { LessonAttachment } from '../../domain/entities/lesson-attachment.entity';
import {
    ILessonAttachmentRepository,
    LESSON_ATTACHMENT_REPOSITORY,
    LessonAttachmentField,
    LessonAttachmentRelations,
} from '../../domain/repositories/i-lesson-attachment.repository';

export class FindManyLessonAttachmentsQuery extends FindManyQuery<LessonAttachmentField, LessonAttachmentRelations> {}

@Injectable()
export class FindManyLessonAttachmentsHandler extends BaseFindManyHandler<LessonAttachment, LessonAttachmentField, LessonAttachmentRelations> {
    constructor(@Inject(LESSON_ATTACHMENT_REPOSITORY) repository: ILessonAttachmentRepository) {
        super(repository);
    }
}
