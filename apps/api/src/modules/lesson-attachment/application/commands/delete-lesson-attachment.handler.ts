import { DeleteCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import {
    ILessonAttachmentRepository,
    LESSON_ATTACHMENT_REPOSITORY,
} from '../../domain/repositories/i-lesson-attachment.repository';

export class DeleteLessonAttachmentCommand extends DeleteCommand {}

@Injectable()
export class DeleteLessonAttachmentHandler {
    constructor(
        @Inject(LESSON_ATTACHMENT_REPOSITORY) private readonly repository: ILessonAttachmentRepository,
    ) {}

    async execute({ id }: DeleteLessonAttachmentCommand): Promise<void> {
        await this.repository.delete(id);
    }
}