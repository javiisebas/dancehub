import { BaseGetByFieldHandler, GetByFieldQuery } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { LessonAttachment } from '../../domain/entities/lesson-attachment.entity';
import {
    ILessonAttachmentRepository,
    LESSON_ATTACHMENT_REPOSITORY,
    LessonAttachmentField,
    LessonAttachmentRelations,
} from '../../domain/repositories/i-lesson-attachment.repository';

export class GetLessonAttachmentByFieldQuery extends GetByFieldQuery<LessonAttachmentField, LessonAttachmentRelations> {}

@Injectable()
export class GetLessonAttachmentByFieldHandler extends BaseGetByFieldHandler<LessonAttachment, LessonAttachmentField, LessonAttachmentRelations> {
    constructor(@Inject(LESSON_ATTACHMENT_REPOSITORY) repository: ILessonAttachmentRepository) {
        super(repository);
    }
}
