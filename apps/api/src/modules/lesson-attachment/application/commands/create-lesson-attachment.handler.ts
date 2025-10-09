import { CreateCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import { CreateLessonAttachmentRequest } from '@repo/shared';
import { randomUUID } from 'crypto';
import { LessonAttachment } from '../../domain/entities/lesson-attachment.entity';
import {
    ILessonAttachmentRepository,
    LESSON_ATTACHMENT_REPOSITORY,
} from '../../domain/repositories/i-lesson-attachment.repository';

export class CreateLessonAttachmentCommand extends CreateCommand<CreateLessonAttachmentRequest> {}

@Injectable()
export class CreateLessonAttachmentHandler {
    constructor(
        @Inject(LESSON_ATTACHMENT_REPOSITORY) private readonly repository: ILessonAttachmentRepository,
    ) {}

    async execute({ data }: CreateLessonAttachmentCommand) {
        const lessonAttachment = LessonAttachment.create({
            id: randomUUID(),
            fileName: data.fileName,
            fileUrl: data.fileUrl,
            fileType: data.fileType,
            fileSize: data.fileSize,
            lessonId: data.lessonId,
        });

        return this.repository.save(lessonAttachment);
    }
}