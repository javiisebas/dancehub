import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@api/common/exceptions/not-found.exception';

import { UpdateCommand } from '@api/common/abstract/application/commands.abstract';
import { UpdateLessonAttachmentRequest } from '@repo/shared';
import { LessonAttachment } from '../../domain/entities/lesson-attachment.entity';
import {
    ILessonAttachmentRepository,
    LESSON_ATTACHMENT_REPOSITORY,
} from '../../domain/repositories/i-lesson-attachment.repository';

export class UpdateLessonAttachmentCommand extends UpdateCommand<UpdateLessonAttachmentRequest> {}

@CommandHandler(UpdateLessonAttachmentCommand)
export class UpdateLessonAttachmentHandler implements ICommandHandler<UpdateLessonAttachmentCommand> {
    constructor(
        @Inject(LESSON_ATTACHMENT_REPOSITORY) private readonly repository: ILessonAttachmentRepository,
    ) {}

    async execute(command: UpdateLessonAttachmentCommand): Promise<LessonAttachment> {
        const { id, data } = command;

        const lessonAttachment = await this.repository.findById(id);
        if (!lessonAttachment) {
            throw new NotFoundException('LessonAttachment');
        }

        if (data.fileName !== undefined) {
            lessonAttachment.fileName = data.fileName;
        }
        if (data.fileUrl !== undefined) {
            lessonAttachment.fileUrl = data.fileUrl;
        }
        if (data.fileType !== undefined) {
            lessonAttachment.fileType = data.fileType;
        }
        if (data.fileSize !== undefined) {
            lessonAttachment.fileSize = data.fileSize;
        }
        if (data.lessonId !== undefined) {
            lessonAttachment.lessonId = data.lessonId;
        }

        return await this.repository.update(id, lessonAttachment);
    }
}